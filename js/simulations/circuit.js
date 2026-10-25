/**
 * SIMULATION 4: THÍ NGHIỆM MẠCH ĐIỆN & ĐỊNH LUẬT ÔM TOÀN MẠCH
 */

class CircuitSimulation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Thông số nguồn và tải
    this.emf = 12.0; // Suất điện động E (Volts)
    this.r = 2.0; // Điện trở trong r (Ohms)
    this.R = 10.0; // Biến trở R ngoài (Ohms)
    this.isSwitchClosed = true; // Khóa K

    // Animation electron chạy trong dây dẫn
    this.electrons = [];
    this.initElectrons();

    this.lastTime = performance.now();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initElectrons() {
    this.electrons = [];
    for (let i = 0; i < 40; i++) {
      this.electrons.push({ pos: i / 40 });
    }
  }

  setParam(name, val) {
    val = parseFloat(val);
    if (name === 'emf') this.emf = val;
    if (name === 'r') this.r = val;
    if (name === 'R') this.R = val;
    this.draw();
  }

  toggleSwitch() {
    this.isSwitchClosed = !this.isSwitchClosed;
    this.draw();
  }

  getCircuitValues() {
    if (!this.isSwitchClosed) {
      return { I: 0, U: this.emf, P: 0, efficiency: 0 };
    }
    const I = this.emf / (this.R + this.r);
    const U = this.emf - I * this.r; // = I * R
    const P = I * I * this.R; // Công suất mạch ngoài
    const efficiency = (this.R / (this.R + this.r)) * 100;
    return { I, U, P, efficiency };
  }

  draw() {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const left = 90;
    const right = w - 180;
    const top = 70;
    const bottom = h - 80;

    const { I, U, P, efficiency } = this.getCircuitValues();

    // 1. Dây dẫn mạch điện hình chữ nhật
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(right, top);
    ctx.lineTo(right, bottom);
    ctx.lineTo(left, bottom);
    ctx.closePath();
    ctx.stroke();

    // 2. Nguồn điện (phía trên: [E, r])
    const midX = (left + right) / 2;
    this.drawBattery(midX - 70, top, this.emf, this.r);

    // 3. Khóa K (bên phải nhánh trên)
    this.drawSwitch(right - 70, top, this.isSwitchClosed);

    // 4. Biến trở R ngoài (nhánh dưới)
    this.drawResistor(midX, bottom, this.R);

    // 5. Bóng đèn thí nghiệm (bên trái biến trở R)
    this.drawLightBulb(midX - 90, bottom, I);

    // 6. Ampe kế (nhánh phải: đo dòng I)
    this.drawAmmeter(right, (top + bottom) / 2, I);

    // 7. Vôn kế (mắc song song hai đầu nguồn điện)
    this.drawVoltmeter(midX - 70, top - 35, U);

    // 8. Chuyển động của dòng electron (chỉ khi khóa K đóng và I > 0)
    if (this.isSwitchClosed && I > 0) {
      this.drawElectrons(left, right, top, bottom, I);
    }

    // 9. Bảng đồng hồ kỹ thuật số trực quan (Digital Dashboard)
    this.drawDashboard(w - 160, 40, I, U, P, efficiency);
  }

  drawBattery(x, y, emf, r) {
    const ctx = this.ctx;
    // Xóa dây nền
    ctx.clearRect(x - 30, y - 15, 60, 30);

    // Cực dương (dài, mảnh)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 8, y - 18);
    ctx.lineTo(x - 8, y + 18);
    ctx.stroke();

    // Cực âm (ngắn, dày)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x + 8, y - 10);
    ctx.lineTo(x + 8, y + 10);
    ctx.stroke();

    // Ký hiệu (+ / -)
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText('+', x - 22, y - 8);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('−', x + 16, y - 8);

    // Nhãn nguồn
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText(`E = ${emf}V, r = ${r}Ω`, x - 35, y + 30);
  }

  drawSwitch(x, y, closed) {
    const ctx = this.ctx;
    ctx.clearRect(x - 20, y - 15, 40, 30);

    // Hai chốt
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(x - 12, y, 4, 0, Math.PI * 2);
    ctx.arc(x + 12, y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Lưỡi gà dao khóa K
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 12, y);
    if (closed) {
      ctx.lineTo(x + 12, y);
    } else {
      ctx.lineTo(x + 8, y - 18); // hở góc 40°
    }
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText(closed ? 'K (Đóng)' : 'K (Ngắt)', x - 18, y - 16);
  }

  drawResistor(x, y, R) {
    const ctx = this.ctx;
    const rw = 55;
    const rh = 20;
    ctx.clearRect(x - rw / 2 - 5, y - rh / 2 - 5, rw + 10, rh + 10);

    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(x - rw / 2, y - rh / 2, rw, rh);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - rw / 2, y - rh / 2, rw, rh);

    // Mũi tên biến trở
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - rw / 2 - 6, y + rh / 2 + 6);
    ctx.lineTo(x + rw / 2 + 6, y - rh / 2 - 6);
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText(`R = ${R.toFixed(1)} Ω`, x - 26, y + rh / 2 + 18);
  }

  drawLightBulb(x, y, I) {
    const ctx = this.ctx;
    ctx.clearRect(x - 16, y - 16, 32, 32);

    const brightness = Math.min(1, I / 3.0); // max sáng ở 3A

    // Hiệu ứng hào quang phát sáng nếu có điện
    if (brightness > 0.05) {
      const glowGrad = ctx.createRadialGradient(x, y, 4, x, y, 22 * brightness + 10);
      glowGrad.addColorStop(0, `rgba(250, 204, 21, ${0.9 * brightness})`);
      glowGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(x, y, 22 * brightness + 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // Vỏ bóng đèn
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fillStyle = brightness > 0.1 ? `rgb(254, 240, 138)` : '#f1f5f9';
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dây tóc chữ X
    ctx.beginPath();
    ctx.moveTo(x - 7, y - 7);
    ctx.lineTo(x + 7, y + 7);
    ctx.moveTo(x + 7, y - 7);
    ctx.lineTo(x - 7, y + 7);
    ctx.strokeStyle = brightness > 0.1 ? '#ea580c' : '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#475569';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText('Đèn', x - 9, y + 26);
  }

  drawAmmeter(x, y, I) {
    const ctx = this.ctx;
    ctx.clearRect(x - 18, y - 18, 36, 36);

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillText('A', x - 5, y + 5);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText(`${I.toFixed(2)} A`, x + 20, y + 4);
  }

  drawVoltmeter(x, y, U) {
    const ctx = this.ctx;
    // Dây nối song song
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(x - 45, y + 35);
    ctx.lineTo(x - 45, y);
    ctx.lineTo(x + 45, y);
    ctx.lineTo(x + 45, y + 35);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.clearRect(x - 16, y - 16, 32, 32);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#2563eb';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText('V', x - 4, y + 4);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText(`${U.toFixed(2)} V`, x - 18, y - 18);
  }

  drawElectrons(left, right, top, bottom, I) {
    const ctx = this.ctx;
    const speed = I * 0.003;
    const perimeter = 2 * (right - left + bottom - top);

    ctx.fillStyle = '#0284c7';
    this.electrons.forEach((e) => {
      e.pos = (e.pos + speed) % 1.0;
      const d = e.pos * perimeter;
      let ex = left;
      let ey = top;

      if (d < (right - left)) {
        ex = left + d;
        ey = top;
      } else if (d < (right - left + bottom - top)) {
        ex = right;
        ey = top + (d - (right - left));
      } else if (d < (2 * (right - left) + bottom - top)) {
        ex = right - (d - (right - left + bottom - top));
        ey = bottom;
      } else {
        ex = left;
        ey = bottom - (d - (2 * (right - left) + bottom - top));
      }

      ctx.beginPath();
      ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  drawDashboard(x, y, I, U, P, efficiency) {
    const ctx = this.ctx;
    const w = 150;
    const h = 210;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.roundRect ? ctx.roundRect(x, y, w, h, 8) : ctx.fillRect(x, y, w, h);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText('THÔNG SỐ ĐO', x + 15, y + 25);

    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`Dòng điện I:`, x + 15, y + 55);
    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillText(`${I.toFixed(2)} A`, x + 15, y + 72);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(`Điện áp mạch ngoài U:`, x + 15, y + 98);
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillText(`${U.toFixed(2)} V`, x + 15, y + 115);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(`Công suất tiêu thụ P:`, x + 15, y + 140);
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillText(`${P.toFixed(2)} W`, x + 15, y + 157);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(`Hiệu suất nguồn:`, x + 15, y + 182);
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillText(`${efficiency.toFixed(1)} %`, x + 15, y + 199);
  }

  animate(currentTime) {
    this.draw();
    requestAnimationFrame(this.animate);
  }
}

window.CircuitSimulation = CircuitSimulation;
