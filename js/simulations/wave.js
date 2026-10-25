/**
 * SIMULATION 2: GIAO THOA SÓNG CƠ TRÊN MẶT NƯỚC (2 NGUỒN KẾT HỢP)
 */

class WaveInterferenceSimulation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Các thông số
    this.distance = 120; // px (khoảng cách S1-S2)
    this.wavelength = 24; // px (bước sóng lambda)
    this.frequency = 1.5; // Hz
    this.phaseDiff = 0; // độ lệch pha giữa 2 nguồn (rad)
    this.showHyperbolas = true; // hiện đường cực đại / cực tiểu
    this.showWaveField = true;

    this.time = 0;
    this.isRunning = true;
    this.lastTime = performance.now();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setParam(name, val) {
    val = parseFloat(val);
    if (name === 'distance') this.distance = val;
    if (name === 'wavelength') this.wavelength = val;
    if (name === 'frequency') this.frequency = val;
    if (name === 'phaseDiff') this.phaseDiff = (val * Math.PI) / 180;
  }

  toggleHyperbolas() {
    this.showHyperbolas = !this.showHyperbolas;
  }

  togglePlay() {
    this.isRunning = !this.isRunning;
    if (this.isRunning) {
      this.lastTime = performance.now();
      requestAnimationFrame(this.animate);
    }
  }

  reset() {
    this.time = 0;
  }

  draw() {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const s1X = w / 2 - this.distance / 2;
    const s1Y = h / 2;
    const s2X = w / 2 + this.distance / 2;
    const s2Y = h / 2;

    const k = (2 * Math.PI) / this.wavelength;
    const omega = 2 * Math.PI * this.frequency;

    // 1. Vẽ trường sóng giao thoa bằng ImageData để đạt 60fps mượt mà
    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;
    const step = 2; // tối ưu hiệu năng render pixel

    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const d1 = Math.hypot(x - s1X, y - s1Y);
        const d2 = Math.hypot(x - s2X, y - s2Y);

        // Biên độ tổng hợp u = a*cos(omega*t - k*d1) + a*cos(omega*t - k*d2 + phase)
        const u = Math.cos(omega * this.time - k * d1) + Math.cos(omega * this.time - k * d2 + this.phaseDiff);

        // Biến đổi màu từ xanh dương đậm (lõm sóng) sang trắng/cyan (đỉnh sóng cực đại)
        // u chạy từ -2 đến +2
        const norm = (u + 2) / 4; // 0 -> 1

        const r = Math.floor(14 + norm * 80);
        const g = Math.floor(65 + norm * 150);
        const b = Math.floor(130 + norm * 125);

        for (let dy = 0; dy < step && (y + dy) < h; dy++) {
          for (let dx = 0; dx < step && (x + dx) < w; dx++) {
            const idx = ((y + dy) * w + (x + dx)) * 4;
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = 255;
          }
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // 2. Vẽ các đường hyperbol cực đại / cực tiểu lý thuyết
    if (this.showHyperbolas) {
      this.drawInterferenceHyperbolas(s1X, s1Y, s2X, s2Y);
    }

    // 3. Đánh dấu vị trí 2 nguồn S1, S2
    this.drawSource(s1X, s1Y, 'S₁');
    this.drawSource(s2X, s2Y, 'S₂');

    // 4. Bảng thông số đo đạc thực tế
    this.drawOverlayInfo(s1X, s2X);
  }

  drawSource(x, y, label) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillText(label, x - 8, y - 12);
  }

  drawInterferenceHyperbolas(s1X, s1Y, s2X, s2Y) {
    const { ctx, canvas } = this;
    const maxK = Math.floor(this.distance / this.wavelength);

    // Cực đại: d2 - d1 = k * lambda
    ctx.lineWidth = 1.5;
    for (let k = -maxK; k <= maxK; k++) {
      const deltaD = k * this.wavelength + (this.phaseDiff / (2 * Math.PI)) * this.wavelength;
      ctx.strokeStyle = k === 0 ? '#ef4444' : 'rgba(255, 255, 255, 0.7)';
      ctx.setLineDash(k === 0 ? [] : [6, 4]);

      ctx.beginPath();
      let started = false;
      for (let y = 0; y <= canvas.height; y += 4) {
        // Tìm x sao cho d2 - d1 = deltaD
        // Dùng phương pháp quét x
        for (let x = 0; x <= canvas.width; x += 4) {
          const d1 = Math.hypot(x - s1X, y - s1Y);
          const d2 = Math.hypot(x - s2X, y - s2Y);
          if (Math.abs((d2 - d1) - deltaD) < 1.8) {
            if (!started) {
              ctx.moveTo(x, y);
              started = true;
            } else {
              ctx.lineTo(x, y);
            }
          }
        }
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  drawOverlayInfo(s1X, s2X) {
    const { ctx } = this;
    const maxK = Math.floor(this.distance / this.wavelength);
    const numMax = 2 * maxK + 1;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.roundRect ? ctx.roundRect(15, 15, 250, 75, 8) : ctx.fillRect(15, 15, 250, 75);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(`Khoảng cách S₁S₂: ${this.distance} px`, 25, 35);
    ctx.fillText(`Bước sóng λ: ${this.wavelength} px`, 25, 55);

    ctx.fillStyle = '#4ade80';
    ctx.fillText(`Số vân cực đại trên S₁S₂: ${numMax} vân`, 25, 75);
  }

  animate(currentTime) {
    if (!this.isRunning) return;
    const dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.time += dt;
    this.draw();

    requestAnimationFrame(this.animate);
  }
}

window.WaveInterferenceSimulation = WaveInterferenceSimulation;
