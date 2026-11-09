import React, { useState, useEffect, useRef } from 'react';
import MathView from '../MathView';
import { Sliders, Sparkles, HelpCircle } from 'lucide-react';

const FUNCTIONS = [
  { id: 'poly', name: 'f(x) = x² - 2x + 2', fn: (x) => x * x - 2 * x + 2, str: 'x^2 - 2x + 2', exactAntideriv: (x) => (x**3)/3 - x*x + 2*x },
  { id: 'sin', name: 'f(x) = sin(x) + 1.2', fn: (x) => Math.sin(x) + 1.2, str: '\\sin(x) + 1.2', exactAntideriv: (x) => -Math.cos(x) + 1.2*x },
  { id: 'sqrt', name: 'f(x) = √x', fn: (x) => Math.sqrt(Math.max(0, x)), str: '\\sqrt{x}', exactAntideriv: (x) => (2/3) * Math.pow(Math.max(0, x), 1.5) },
  { id: 'exp', name: 'f(x) = e^(0.5x)', fn: (x) => Math.exp(0.5 * x), str: 'e^{0.5x}', exactAntideriv: (x) => 2 * Math.exp(0.5 * x) }
];

export default function RiemannIntegralLab() {
  const canvasRef = useRef(null);
  const [selectedFn, setSelectedFn] = useState(FUNCTIONS[0]);
  const [a, setA] = useState(0.5);
  const [b, setB] = useState(3.5);
  const [n, setN] = useState(12); // number of subintervals
  const [method, setMethod] = useState('mid'); // 'left', 'mid', 'right'

  const exactVal = selectedFn.exactAntideriv(b) - selectedFn.exactAntideriv(a);

  const dx = (b - a) / n;
  let riemannSum = 0;
  for (let i = 0; i < n; i++) {
    let evalX = a + i * dx;
    if (method === 'mid') evalX += dx / 2;
    if (method === 'right') evalX += dx;
    riemannSum += selectedFn.fn(evalX) * dx;
  }

  const errorPct = exactVal !== 0 ? Math.abs((riemannSum - exactVal) / exactVal * 100).toFixed(2) : '0';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Padding & Coordinate transform
    const padL = 50, padR = 30, padT = 30, padB = 40;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    const xMin = -0.5;
    const xMax = 5.0;
    const yMin = -0.5;
    const yMax = 7.0;

    const toPxX = (x) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
    const toPxY = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * plotH;

    // Canvas background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);

    for (let x = 0; x <= 5; x += 1) {
      ctx.beginPath();
      ctx.moveTo(toPxX(x), toPxY(yMin));
      ctx.lineTo(toPxX(x), toPxY(yMax));
      ctx.stroke();
    }
    for (let y = 0; y <= 6; y += 1) {
      ctx.beginPath();
      ctx.moveTo(toPxX(xMin), toPxY(y));
      ctx.lineTo(toPxX(xMax), toPxY(y));
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.8;
    // X Axis
    ctx.beginPath();
    ctx.moveTo(toPxX(xMin), toPxY(0));
    ctx.lineTo(toPxX(xMax), toPxY(0));
    ctx.stroke();
    // Y Axis
    ctx.beginPath();
    ctx.moveTo(toPxX(0), toPxY(yMin));
    ctx.lineTo(toPxX(0), toPxY(yMax));
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText('x', toPxX(xMax) - 15, toPxY(0) + 18);
    ctx.fillText('y', toPxX(0) - 18, toPxY(yMax) + 12);
    for (let x = 1; x <= 4; x++) {
      ctx.fillText(x.toString(), toPxX(x) - 4, toPxY(0) + 16);
    }

    // Draw Riemann Rectangles
    for (let i = 0; i < n; i++) {
      const xLeft = a + i * dx;
      const xRight = xLeft + dx;
      let evalX = xLeft;
      if (method === 'mid') evalX = xLeft + dx / 2;
      if (method === 'right') evalX = xRight;

      const yVal = selectedFn.fn(evalX);
      const pxLeft = toPxX(xLeft);
      const pxRight = toPxX(xRight);
      const pxTop = toPxY(yVal);
      const pxBottom = toPxY(0);

      // Light blue filled rectangle
      ctx.fillStyle = 'rgba(14, 165, 233, 0.22)';
      ctx.fillRect(pxLeft, pxTop, pxRight - pxLeft, pxBottom - pxTop);

      // Border
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(pxLeft, pxTop, pxRight - pxLeft, pxBottom - pxTop);

      // Point dot
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(toPxX(evalX), pxTop, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Continuous curve y = f(x)
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const steps = 300;
    for (let i = 0; i <= steps; i++) {
      const curX = xMin + (i / steps) * (xMax - xMin);
      const curY = selectedFn.fn(curX);
      const px = toPxX(curX);
      const py = toPxY(curY);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Bounds markers (a and b)
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(toPxX(a), toPxY(0));
    ctx.lineTo(toPxX(a), toPxY(selectedFn.fn(a)));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toPxX(b), toPxY(0));
    ctx.lineTo(toPxX(b), toPxY(selectedFn.fn(b)));
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels a & b
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(`a=${a}`, toPxX(a) - 10, toPxY(0) + 30);
    ctx.fillText(`b=${b}`, toPxX(b) - 10, toPxY(0) + 30);

  }, [selectedFn, a, b, n, method]);

  return (
    <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-sky-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h3 className="text-base md:text-lg font-bold text-slate-800">
              Bản Chất Tích Phân: Tổng Tích Phân Riemann
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Minh họa định nghĩa tích phân SGK: Khi số hình chữ nhật <MathView math="n \to \infty" />, tổng diện tích các dải chữ nhật tiến dần tới tích phân chính xác.
          </p>
        </div>

        {/* Function selector */}
        <div className="flex gap-1.5 bg-sky-50 p-1 rounded-xl border border-sky-200">
          {FUNCTIONS.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFn(f)}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                selectedFn.id === f.id
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-sky-100'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Canvas */}
        <div className="lg:col-span-2 bg-slate-50 rounded-xl p-3 border border-sky-200 flex justify-center shadow-xs">
          <canvas
            ref={canvasRef}
            width={640}
            height={360}
            className="w-full max-w-[640px] h-auto rounded-lg shadow-xs"
          />
        </div>

        {/* Sliders & Numbers */}
        <div className="space-y-4">
          <div className="bg-sky-50/60 p-4 rounded-xl border border-sky-100 space-y-4">
            {/* Number of intervals n */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">Số hình chữ nhật (n):</span>
                <span className="text-blue-700 font-bold text-sm">{n} hình</span>
              </div>
              <input
                type="range"
                min="4"
                max="60"
                step="2"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value))}
                className="w-full h-2 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>4 (thô)</span>
                <span>30 (khá mịn)</span>
                <span>60 (rất mịn)</span>
              </div>
            </div>

            {/* Bounds a and b */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-600 block mb-1 font-medium">Cận dưới a:</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max={b - 0.5}
                  value={a}
                  onChange={(e) => setA(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-sky-200 rounded-lg px-2.5 py-1 text-sm text-slate-800"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 block mb-1 font-medium">Cận trên b:</label>
                <input
                  type="number"
                  step="0.5"
                  min={a + 0.5}
                  max="4.5"
                  value={b}
                  onChange={(e) => setB(parseFloat(e.target.value) || 1)}
                  className="w-full bg-white border border-sky-200 rounded-lg px-2.5 py-1 text-sm text-slate-800"
                />
              </div>
            </div>

            {/* Method choice */}
            <div>
              <label className="text-[11px] text-slate-600 block mb-1.5 font-medium">Cách lấy điểm đại diện:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'left', label: 'Cận trái' },
                  { id: 'mid', label: 'Trung điểm' },
                  { id: 'right', label: 'Cận phải' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`py-1 text-xs rounded-lg border font-medium transition-all cursor-pointer ${
                      method === m.id
                        ? 'bg-blue-600 border-blue-600 text-white font-semibold shadow-xs'
                        : 'bg-white border-sky-200 text-slate-600 hover:bg-sky-50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Precision Comparison Card */}
          <div className="bg-gradient-to-br from-blue-50 to-sky-100/70 p-4 rounded-xl border border-blue-200/80 space-y-2 shadow-xs">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600">Tổng Riemann (Xấp xỉ):</span>
              <span className="text-blue-700 font-mono font-bold text-sm">
                {riemannSum.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600">Tích phân chính xác:</span>
              <span className="text-emerald-700 font-mono font-bold text-sm">
                {exactVal.toFixed(4)}
              </span>
            </div>
            <div className="pt-2 border-t border-sky-200 flex justify-between items-center text-xs">
              <span className="text-slate-600">Sai số tương đối:</span>
              <span className={`font-mono font-bold ${parseFloat(errorPct) < 1 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {errorPct}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
