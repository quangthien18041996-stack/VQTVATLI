/**
 * SIMULATION 5: KHÍ LÍ TƯỞNG & THUYẾT ĐỘNG HỌC PHÂN TỬ (IDEAL GAS SIMULATION)
 */

class IdealGasSimulation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Các tham số trạng thái
    this.temperature = 300; // Kelvin (27°C)
    this.numMolecules = 70; // Số phân tử mô phỏng
    this.pistonPos = 0.65; // Tỉ lệ vị trí pit-tông (thể tích V: 0.35 -> 0.95)
    this.heatMode = 'neutral'; // 'heat', 'cool', 'neutral'

    this.particles = [];
    this.initParticles();

    this.isRunning = true;
    this.lastTime = performance.now();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initParticles() {
    this.particles = [];
    const baseSpeed = Math.sqrt(this.temperature / 300) * 2.5;

    for (let i = 0; i < this.numMolecules; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.7 + Math.random() * 0.6) * baseSpeed;
      this.particles.push({
        x: 60 + Math.random() * 200,
        y: 60 + Math.random() * 180,
        vx: speed * Math.cos(angle),
        vy: speed * Math.sin(angle),
        radius: 3.5
      });
    }
  }

  setParam(name, val) {
    val = parseFloat(val);
    if (name === 'temperature') {
      const oldT = this.temperature;
      this.temperature = val;
      const factor = Math.sqrt(this.temperature / oldT);
      this.particles.forEach((p) => {
        p.vx *= factor;
        p.vy *= factor;
      });
    }
    if (name === 'volume') {
      this.pistonPos = Math.max(0.35, Math.min(0.95, val));
    }
  }

  updatePhysics(dt) {
    if (!this.isRunning) return;
    dt = Math.min(dt, 0.05);

    const left = 60;
    const top = 50;
    const bottom = 260;
    const right = left + (this.canvas.width - 200) * this.pistonPos;

    // Cập nhật vị trí và va chạm đàn hồi
    for (let p of this.particles) {
      p.x += p.vx * 60 * dt;
      p.y += p.vy * 60 * dt;

      // Va chạm tường trái
      if (p.x - p.radius < left) {
        p.x = left + p.radius;
        p.vx = -p.vx;
      }
      // Va chạm pit-tông (tường phải)
      if (p.x + p.radius > right) {
        p.x = right - p.radius;
        p.vx = -p.vx;
      }
      // Va chạm trên / dưới
      if (p.y - p.radius < top) {
        p.y = top + p.radius;
        p.vy = -p.vy;
      }
      if (p.y + p.radius > bottom) {
        p.y = bottom - p.radius;
        p.vy = -p.vy;
      }
    }
  }

  draw() {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const left = 60;
    const top = 50;
    const bottom = 260;
    const cylinderW = w - 200;
    const right = left + cylinderW * this.pistonPos;

    // 1. Thân xi-lanh trong suốt có khung kim loại
    ctx.fillStyle = 'rgba(241, 245, 249, 0.4)';
    ctx.fillRect(left, top, cylinderW, bottom - top);

    // Thành xi-lanh (trái, trên, dưới)
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(left + cylinderW, top);
    ctx.lineTo(left, top);
    ctx.lineTo(left, bottom);
    ctx.lineTo(left + cylinderW, bottom);
    ctx.stroke();

    // 2. Vẽ các phân tử khí (đổi màu theo nhiệt độ: lạnh=xanh, nóng=cam đỏ)
    const tRatio = Math.max(0, Math.min(1, (this.temperature - 100) / 500));
    const rColor = Math.floor(56 + tRatio * 180);
    const bColor = Math.floor(240 - tRatio * 190);
    const particleColor = `rgb(${rColor}, 120, ${bColor})`;

    ctx.fillStyle = particleColor;
    for (let p of this.particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Pit-tông di động
    ctx.fillStyle = '#64748b';
    ctx.fillRect(right - 8, top + 2, 16, (bottom - top) - 4);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(right - 8, top + 2, 16, (bottom - top) - 4);

    // Cần đẩy của pit-tông
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(right + 8, (top + bottom) / 2 - 8, 80, 16);
    ctx.strokeRect(right + 8, (top + bottom) / 2 - 8, 80, 16);

    // 4. Đồng hồ áp suất (Áp kế) gắn trên nắp xi-lanh
    const V = this.pistonPos * 10; // Đơn vị quy ước Lít (3.5L -> 9.5L)
    const p = (this.temperature * 0.082) / V; // atm theo pV = nRT
    this.drawPressureGauge(left + 60, top - 25, p);

    // 5. Nhiệt kế gắn trên thân bình
    this.drawThermometer(left - 35, (top + bottom) / 2, this.temperature);

    // 6. Bảng hiển thị thông số và công thức
    this.drawStats(w - 175, 40, p, V, this.temperature);
  }

  drawPressureGauge(x, y, p) {
    const ctx = this.ctx;
    // Ống dẫn
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, y + 25);
    ctx.lineTo(x, y + 10);
    ctx.stroke();

    // Mặt đồng hồ tròn
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Kim đo áp suất
    const maxP = 8.0; // atm
    const angle = -Math.PI * 0.75 + (p / maxP) * (Math.PI * 1.5);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 16 * Math.cos(angle), y + 16 * Math.sin(angle));
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 9px Inter, sans-serif';
    ctx.fillText(`${p.toFixed(2)} atm`, x - 18, y - 26);
  }

  drawThermometer(x, y, temp) {
    const ctx = this.ctx;
    const h = 120;
    const w = 12;

    // Ống thủy tinh
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(x - w / 2, y - h / 2, w, h);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - w / 2, y - h / 2, w, h);

    // Bầu thủy ngân
    ctx.beginPath();
    ctx.arc(x, y + h / 2 + 6, 11, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();

    // Cột chất lỏng đỏ
    const ratio = Math.max(0, Math.min(1, (temp - 100) / 500));
    const fillH = ratio * (h - 10);
    ctx.fillRect(x - w / 2 + 2, (y + h / 2) - fillH, w - 4, fillH);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText(`${Math.round(temp)} K`, x - 18, y - h / 2 - 8);
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`(${Math.round(temp - 273.15)}°C)`, x - 22, y - h / 2 + 6);
  }

  drawStats(x, y, p, V, T) {
    const ctx = this.ctx;
    const boxW = 165;
    const boxH = 220;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.roundRect ? ctx.roundRect(x, y, boxW, boxH, 8) : ctx.fillRect(x, y, boxW, boxH);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText('TRẠNG THÁI KHÍ', x + 15, y + 25);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('Áp suất (p):', x + 15, y + 55);
    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillText(`${p.toFixed(2)} atm`, x + 15, y + 72);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('Thể tích (V):', x + 15, y + 98);
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillText(`${V.toFixed(2)} lít`, x + 15, y + 115);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('Nhiệt độ tuyệt đối (T):', x + 15, y + 140);
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillText(`${Math.round(T)} K`, x + 15, y + 157);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 10px Inter, sans-serif';
    ctx.fillText('pV/T = const (Boyle-Charles)', x + 12, y + 195);
  }

  animate(currentTime) {
    const dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.updatePhysics(dt);
    this.draw();

    if (this.isRunning) {
      requestAnimationFrame(this.animate);
    }
  }
}

window.IdealGasSimulation = IdealGasSimulation;
