/**
 * SIMULATION 1: DAO ĐỘNG ĐIỀU HÒA (CON LẮC ĐƠN & CON LẮC LÒ XO)
 */

class PendulumSimulation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Các tham số vật lí mặc định
    this.mode = 'simple'; // 'simple' (con lắc đơn) hoặc 'spring' (lò xo)
    this.length = 1.0; // mét
    this.mass = 0.5; // kg
    this.gravity = 9.8; // m/s²
    this.k = 50; // N/m (lò xo)
    this.amplitudeAngle = 15 * (Math.PI / 180); // rad
    this.damping = 0.001; // ma sát không khí rất nhỏ

    // Trạng thái dao động
    this.angle = this.amplitudeAngle;
    this.angularVelocity = 0;
    this.angularAcceleration = 0;

    // Trạng thái con lắc lò xo
    this.springA = 0.12; // 12cm
    this.springX = this.springA;
    this.springV = 0;

    this.isRunning = true;
    this.lastTime = performance.now();
    this.history = []; // Lưu vết tọa độ để vẽ đồ thị x(t)
    this.maxHistory = 200;

    this.bindEvents();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setMode(mode) {
    this.mode = mode;
    this.reset();
  }

  setParam(name, value) {
    value = parseFloat(value);
    if (name === 'length') this.length = value;
    if (name === 'mass') this.mass = value;
    if (name === 'gravity') this.gravity = value;
    if (name === 'k') this.k = value;
    if (name === 'amplitude') {
      if (this.mode === 'simple') {
        this.amplitudeAngle = (value * Math.PI) / 180;
        this.angle = this.amplitudeAngle;
        this.angularVelocity = 0;
      } else {
        this.springA = value / 100; // cm to m
        this.springX = this.springA;
        this.springV = 0;
      }
      this.history = [];
    }
  }

  reset() {
    this.angle = this.amplitudeAngle;
    this.angularVelocity = 0;
    this.springX = this.springA;
    this.springV = 0;
    this.history = [];
  }

  togglePlay() {
    this.isRunning = !this.isRunning;
    if (this.isRunning) {
      this.lastTime = performance.now();
      requestAnimationFrame(this.animate);
    }
  }

  bindEvents() {
    let isDragging = false;
    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (this.mode === 'simple') {
        const originX = this.canvas.width / 2;
        const originY = 60;
        const scale = 180;
        const bobX = originX + this.length * scale * Math.sin(this.angle);
        const bobY = originY + this.length * scale * Math.cos(this.angle);
        const dist = Math.hypot(mouseX - bobX, mouseY - bobY);
        if (dist < 25) {
          isDragging = true;
        }
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const originX = this.canvas.width / 2;
      const originY = 60;

      const dx = mouseX - originX;
      const dy = mouseY - originY;
      this.angle = Math.atan2(dx, dy);
      // Giới hạn góc [-75°, 75°]
      this.angle = Math.max(-1.3, Math.min(1.3, this.angle));
      this.amplitudeAngle = Math.abs(this.angle);
      this.angularVelocity = 0;
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) isDragging = false;
    });
  }

  updatePhysics(dt) {
    if (!this.isRunning) return;
    dt = Math.min(dt, 0.05); // cap frame skip

    if (this.mode === 'simple') {
      // Phương trình vi phân con lắc đơn: d²θ/dt² = -(g/l) * sin(θ) - b * dθ/dt
      this.angularAcceleration = -(this.gravity / this.length) * Math.sin(this.angle) - this.damping * this.angularVelocity;
      this.angularVelocity += this.angularAcceleration * dt;
      this.angle += this.angularVelocity * dt;

      // Lưu lịch sử li độ cung s = l * angle
      const s = this.length * this.angle * 100; // cm
      this.history.push(s);
      if (this.history.length > this.maxHistory) this.history.shift();

    } else {
      // Con lắc lò xo: d²x/dt² = -(k/m) * x - b * v
      const omega2 = this.k / this.mass;
      const a = -omega2 * this.springX - this.damping * 20 * this.springV;
      this.springV += a * dt;
      this.springX += this.springV * dt;

      this.history.push(this.springX * 100); // cm
      if (this.history.length > this.maxHistory) this.history.shift();
    }
  }

  draw() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Nền lưới nhẹ
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    if (this.mode === 'simple') {
      this.drawSimplePendulum();
    } else {
      this.drawSpringMass();
    }

    this.drawEnergyBars();
    this.drawRealtimeGraph();
    this.drawInfoStats();
  }

  drawSimplePendulum() {
    const { ctx, canvas } = this;
    const originX = canvas.width / 2;
    const originY = 60;
    const scale = 170; // 1m = 170px

    const bobX = originX + this.length * scale * Math.sin(this.angle);
    const bobY = originY + this.length * scale * Math.cos(this.angle);

    // Giá treo
    ctx.fillStyle = '#64748b';
    ctx.fillRect(originX - 50, originY - 12, 100, 12);
    ctx.beginPath();
    ctx.arc(originX, originY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();

    // Trục thẳng đứng đứt nét (VTCB)
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX, originY + this.length * scale + 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Dây treo
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // Quả cầu nặng
    const radius = 12 + Math.min(18, this.mass * 12);
    const grad = ctx.createRadialGradient(bobX - 4, bobY - 4, 2, bobX, bobY, radius);
    grad.addColorStop(0, '#38bdf8');
    grad.addColorStop(1, '#0284c7');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(bobX, bobY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0369a1';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Vector vận tốc v
    const vMag = this.length * this.angularVelocity * 20;
    const vx = vMag * Math.cos(this.angle);
    const vy = -vMag * Math.sin(this.angle);
    this.drawArrow(bobX, bobY, bobX + vx, bobY + vy, '#ef4444', 'v');
  }

  drawSpringMass() {
    const { ctx, canvas } = this;
    const originX = 70;
    const trackY = 180;
    const scale = 700; // 1m = 700px

    // Tường cố định bên trái
    ctx.fillStyle = '#64748b';
    ctx.fillRect(originX - 20, trackY - 50, 20, 100);
    for (let y = trackY - 50; y < trackY + 50; y += 10) {
      ctx.strokeStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(originX - 20, y);
      ctx.lineTo(originX - 30, y + 10);
      ctx.stroke();
    }

    // Giá đỡ sàn nằm ngang
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(originX, trackY + 30);
    ctx.lineTo(canvas.width - 50, trackY + 30);
    ctx.stroke();

    // Vị trí cân bằng VTCB
    const eqX = originX + 180;
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(eqX, trackY - 40);
    ctx.lineTo(eqX, trackY + 40);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#3b82f6';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('VTCB (O)', eqX - 22, trackY + 55);

    // Tọa độ vật
    const blockX = eqX + this.springX * scale;
    const blockSize = 45;

    // Vẽ lò xo zig-zag
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(originX, trackY);
    const turns = 14;
    const springLen = blockX - originX;
    for (let i = 1; i <= turns; i++) {
      const px = originX + (springLen / turns) * (i - 0.5);
      const py = trackY + (i % 2 === 0 ? 14 : -14);
      ctx.lineTo(px, py);
    }
    ctx.lineTo(blockX, trackY);
    ctx.stroke();

    // Vẽ khối vật m
    const grad = ctx.createLinearGradient(blockX, trackY - blockSize / 2, blockX + blockSize, trackY + blockSize / 2);
    grad.addColorStop(0, '#f97316');
    grad.addColorStop(1, '#c2410c');
    ctx.fillStyle = grad;
    ctx.fillRect(blockX, trackY - blockSize / 2, blockSize, blockSize);
    ctx.strokeStyle = '#9a3412';
    ctx.lineWidth = 2;
    ctx.strokeRect(blockX, trackY - blockSize / 2, blockSize, blockSize);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText('m', blockX + 16, trackY + 5);

    // Vector vận tốc
    const vx = this.springV * 60;
    this.drawArrow(blockX + blockSize / 2, trackY, blockX + blockSize / 2 + vx, trackY, '#ef4444', 'v');
  }

  drawArrow(fromX, fromY, toX, toY, color, label) {
    const len = Math.hypot(toX - fromX, toY - fromY);
    if (len < 3) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    const angle = Math.atan2(toY - fromY, toX - fromX);
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - 8 * Math.cos(angle - Math.PI / 6), toY - 8 * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - 8 * Math.cos(angle + Math.PI / 6), toY - 8 * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    if (label) {
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText(label, toX + 5, toY - 5);
    }
    ctx.restore();
  }

  drawEnergyBars() {
    const { ctx } = this;
    const startX = 20;
    const startY = 280;
    const barWidth = 26;
    const maxHeight = 80;

    let kinetic = 0;
    let potential = 0;

    if (this.mode === 'simple') {
      const v = this.length * this.angularVelocity;
      kinetic = 0.5 * this.mass * v * v;
      const h = this.length * (1 - Math.cos(this.angle));
      potential = this.mass * this.gravity * h;
    } else {
      kinetic = 0.5 * this.mass * this.springV * this.springV;
      potential = 0.5 * this.k * this.springX * this.springX;
    }

    const total = kinetic + potential;
    const scaleE = total > 0 ? maxHeight / Math.max(total, 0.05) : maxHeight;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.roundRect ? ctx.roundRect(startX - 10, startY - 25, 140, 125, 8) : ctx.fillRect(startX - 10, startY - 25, 140, 125);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText('NĂNG LƯỢNG (J)', startX, startY - 10);

    // Động năng Wd (xanh dương)
    const hKin = Math.min(maxHeight, kinetic * scaleE);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(startX, startY + maxHeight - hKin, barWidth, hKin);
    ctx.fillText('Wđ', startX + 4, startY + maxHeight + 14);

    // Thế năng Wt (cam)
    const hPot = Math.min(maxHeight, potential * scaleE);
    ctx.fillStyle = '#fb923c';
    ctx.fillRect(startX + 38, startY + maxHeight - hPot, barWidth, hPot);
    ctx.fillText('Wt', startX + 42, startY + maxHeight + 14);

    // Cơ năng W (xanh lá)
    const hTot = Math.min(maxHeight, total * scaleE);
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(startX + 76, startY + maxHeight - hTot, barWidth, hTot);
    ctx.fillText('W', startX + 83, startY + maxHeight + 14);
  }

  drawRealtimeGraph() {
    const { ctx, canvas } = this;
    const graphWidth = 220;
    const graphHeight = 85;
    const gx = canvas.width - graphWidth - 20;
    const gy = canvas.height - graphHeight - 25;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.roundRect ? ctx.roundRect(gx - 10, gy - 20, graphWidth + 20, graphHeight + 35, 8) : ctx.fillRect(gx - 10, gy - 20, graphWidth + 20, graphHeight + 35);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText('ĐỒ THỊ LI ĐỘ x(t)', gx, gy - 6);

    // Trục tọa độ
    ctx.strokeStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(gx, gy + graphHeight / 2);
    ctx.lineTo(gx + graphWidth, gy + graphHeight / 2);
    ctx.stroke();

    // Vẽ đường li độ thời gian thực
    if (this.history.length > 1) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < this.history.length; i++) {
        const xPos = gx + (i / this.maxHistory) * graphWidth;
        // Chuẩn hóa biên độ đồ thị
        const val = this.history[i];
        const yPos = (gy + graphHeight / 2) - (val * 1.6);
        if (i === 0) ctx.moveTo(xPos, yPos);
        else ctx.lineTo(xPos, yPos);
      }
      ctx.stroke();
    }
  }

  drawInfoStats() {
    const { ctx, canvas } = this;
    ctx.fillStyle = '#0f172a';
    ctx.font = '12px Inter, sans-serif';

    let T = 0;
    let f = 0;
    let omega = 0;

    if (this.mode === 'simple') {
      T = 2 * Math.PI * Math.sqrt(this.length / this.gravity);
      f = 1 / T;
      omega = Math.sqrt(this.gravity / this.length);
    } else {
      T = 2 * Math.PI * Math.sqrt(this.mass / this.k);
      f = 1 / T;
      omega = Math.sqrt(this.k / this.mass);
    }

    const badgeX = 20;
    const badgeY = 25;
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#cbd5e1';
    ctx.roundRect ? ctx.roundRect(badgeX, badgeY, 260, 50, 6) : ctx.fillRect(badgeX, badgeY, 260, 50);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(`Chu kỳ T: ${T.toFixed(3)} s | Tần số f: ${f.toFixed(2)} Hz`, badgeX + 10, badgeY + 20);
    ctx.fillStyle = '#475569';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText(`Tần số góc ω: ${omega.toFixed(2)} rad/s`, badgeX + 10, badgeY + 40);
  }

  animate(currentTime) {
    if (!this.isRunning) return;
    const dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.updatePhysics(dt);
    this.draw();

    requestAnimationFrame(this.animate);
  }
}

window.PendulumSimulation = PendulumSimulation;
