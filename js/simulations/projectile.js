/**
 * SIMULATION 3: CHUYỂN ĐỘNG NÉM NGANG & NÉM XIÊN
 */

class ProjectileSimulation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Các thông số đầu vào
    this.angle = 45; // độ
    this.v0 = 25; // m/s
    this.h0 = 10; // mét
    this.gravity = 9.8; // m/s²

    // Trạng thái vật
    this.time = 0;
    this.isRunning = false;
    this.isFinished = false;
    this.lastTime = performance.now();

    // Lịch sử quỹ đạo
    this.trajectories = []; // Danh sách các lần bắn
    this.currentPath = [];

    this.scale = 8; // 1m = 8px
    this.originX = 50;
    this.groundY = this.canvas.height - 40;

    this.animate = this.animate.bind(this);
    this.reset();
    this.draw();
  }

  setParam(name, val) {
    val = parseFloat(val);
    if (name === 'angle') this.angle = val;
    if (name === 'v0') this.v0 = val;
    if (name === 'h0') this.h0 = val;
    if (name === 'gravity') this.gravity = val;
    if (!this.isRunning) {
      this.reset();
      this.draw();
    }
  }

  fire() {
    this.reset();
    this.isRunning = true;
    this.isFinished = false;
    this.lastTime = performance.now();
    requestAnimationFrame(this.animate);
  }

  reset() {
    this.isRunning = false;
    this.isFinished = false;
    this.time = 0;
    this.currentPath = [];
    this.x = 0;
    this.y = this.h0;
    this.draw();
  }

  clearAllPaths() {
    this.trajectories = [];
    this.reset();
  }

  update(dt) {
    if (!this.isRunning || this.isFinished) return;
    dt = Math.min(dt, 0.04);
    this.time += dt * 1.5; // tốc độ mô phỏng vừa phải trực quan

    const rad = (this.angle * Math.PI) / 180;
    const vx0 = this.v0 * Math.cos(rad);
    const vy0 = this.v0 * Math.sin(rad);

    // Tọa độ tại thời điểm t
    this.x = vx0 * this.time;
    this.y = this.h0 + vy0 * this.time - 0.5 * this.gravity * this.time * this.time;

    // Vận tốc tức thời
    this.vx = vx0;
    this.vy = vy0 - this.gravity * this.time;

    // Thêm vào vết quỹ đạo
    this.currentPath.push({ x: this.x, y: this.y });

    // Khi chạm đất (y <= 0)
    if (this.y <= 0) {
      this.y = 0;
      this.isFinished = true;
      this.isRunning = false;
      this.trajectories.push([...this.currentPath]);
    }
  }

  draw() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const groundY = this.groundY;
    const originX = this.originX;
    const scale = this.scale;

    // 1. Mặt đất
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(canvas.width, groundY);
    ctx.stroke();

    // Vạch thước đo trên mặt đất (cứ 10m một vạch)
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter, sans-serif';
    for (let m = 0; m * scale < canvas.width - originX; m += 10) {
      const px = originX + m * scale;
      ctx.beginPath();
      ctx.moveTo(px, groundY);
      ctx.lineTo(px, groundY + 6);
      ctx.stroke();
      ctx.fillText(`${m}m`, px - 8, groundY + 18);
    }

    // 2. Tháp / bục xuất phát ban đầu (nếu có h0 > 0)
    if (this.h0 > 0) {
      const towerH = this.h0 * scale;
      ctx.fillStyle = '#475569';
      ctx.fillRect(originX - 25, groundY - towerH, 25, towerH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(originX - 25, groundY - towerH, 25, towerH);

      // Nhãn chiều cao ban đầu h0
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(`h₀ = ${this.h0}m`, originX - 35, groundY - towerH / 2);
    }

    // 3. Vẽ các quỹ đạo cũ
    this.trajectories.forEach((path, idx) => {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      path.forEach((pt, i) => {
        const px = originX + pt.x * scale;
        const py = groundY - pt.y * scale;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // 4. Vẽ quỹ đạo hiện tại
    if (this.currentPath.length > 0) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      this.currentPath.forEach((pt, i) => {
        const px = originX + pt.x * scale;
        const py = groundY - pt.y * scale;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }

    // 5. Vẽ quả cầu pháo
    const rad = (this.angle * Math.PI) / 180;
    const curX = this.isRunning || this.isFinished ? this.x : 0;
    const curY = this.isRunning || this.isFinished ? this.y : this.h0;
    const px = originX + curX * scale;
    const py = groundY - curY * scale;

    ctx.beginPath();
    ctx.arc(px, py, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 6. Vẽ các vector vận tốc vx, vy, v
    if (this.isRunning) {
      const vxLen = this.vx * 1.5;
      const vyLen = -this.vy * 1.5; // ngược hướng màn hình
      this.drawArrow(px, py, px + vxLen, py, '#22c55e', 'vx');
      this.drawArrow(px, py, px, py + vyLen, '#f59e0b', 'vy');
      this.drawArrow(px, py, px + vxLen, py + vyLen, '#38bdf8', 'v');
    } else if (!this.isFinished) {
      // Khi chuẩn bị bắn: vẽ góc bắn và vector v0
      const v0Len = this.v0 * 1.5;
      const targetVx = v0Len * Math.cos(rad);
      const targetVy = -v0Len * Math.sin(rad);
      this.drawArrow(px, py, px + targetVx, py + targetVy, '#f43f5e', 'v₀');
    }

    // 7. Bảng thông số bay lý thuyết
    this.drawStats(curX, curY);
  }

  drawArrow(fromX, fromY, toX, toY, color, label) {
    const len = Math.hypot(toX - fromX, toY - fromY);
    if (len < 4) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    const ang = Math.atan2(toY - fromY, toX - fromX);
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - 7 * Math.cos(ang - Math.PI / 6), toY - 7 * Math.sin(ang - Math.PI / 6));
    ctx.lineTo(toX - 7 * Math.cos(ang + Math.PI / 6), toY - 7 * Math.sin(ang + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    if (label) {
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(label, toX + 5, toY - 4);
    }
    ctx.restore();
  }

  drawStats(curX, curY) {
    const { ctx, canvas } = this;
    const rad = (this.angle * Math.PI) / 180;
    const vy0 = this.v0 * Math.sin(rad);

    // Tính toán lý thuyết:
    // Tầm cao cực đại H:
    const H = this.h0 + (vy0 * vy0) / (2 * this.gravity);
    // Thời gian bay chạm đất: y(t) = h0 + vy0*t - 0.5*g*t^2 = 0
    // => 0.5*g*t^2 - vy0*t - h0 = 0
    const delta = vy0 * vy0 + 2 * this.gravity * this.h0;
    const tFly = (vy0 + Math.sqrt(delta)) / this.gravity;
    const L = this.v0 * Math.cos(rad) * tFly;

    const boxW = 270;
    const boxH = 95;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.roundRect ? ctx.roundRect(canvas.width - boxW - 20, 20, boxW, boxH, 8) : ctx.fillRect(canvas.width - boxW - 20, 20, boxW, boxH);
    ctx.fill();

    const tx = canvas.width - boxW - 8;
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`Tầm xa cực đại (L): ${L.toFixed(2)} m`, tx, 42);
    ctx.fillStyle = '#fb923c';
    ctx.fillText(`Độ cao cực đại (H): ${H.toFixed(2)} m`, tx, 62);
    ctx.fillStyle = '#4ade80';
    ctx.fillText(`Thời gian bay (t): ${tFly.toFixed(2)} s`, tx, 82);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`Tọa độ tức thời: x = ${curX.toFixed(1)}m, y = ${curY.toFixed(1)}m`, tx, 102);
  }

  animate(currentTime) {
    if (!this.isRunning) return;
    const dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.update(dt);
    this.draw();

    if (this.isRunning) {
      requestAnimationFrame(this.animate);
    }
  }
}

window.ProjectileSimulation = ProjectileSimulation;
