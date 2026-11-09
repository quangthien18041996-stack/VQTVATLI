import React, { useState, useRef, useEffect } from 'react';
import MathView from '../MathView';
import { TrendingUp, Box, CheckCircle } from 'lucide-react';

export default function Part3Derivative() {
  const [sheetSize, setSheetSize] = useState(24); // cm
  const [cutSize, setCutSize] = useState(4); // cm

  const optimalCut = sheetSize / 6;
  const currentVolume = cutSize * Math.pow(sheetSize - 2 * cutSize, 2);
  const maxVolume = optimalCut * Math.pow(sheetSize - 2 * optimalCut, 2);

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const pad = 40;
    const maxCut = sheetSize / 2;
    const toPxX = (x) => pad + (x / maxCut) * (width - 2 * pad);
    const toPxY = (v) => height - pad - (v / (maxVolume * 1.25)) * (height - 2 * pad);

    // Canvas background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(pad, height - pad);
    ctx.lineTo(width - pad + 10, height - pad);
    ctx.moveTo(pad, height - pad);
    ctx.lineTo(pad, pad - 10);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText('x (cm)', width - pad - 10, height - pad + 25);
    ctx.fillText('V(x) (cm³)', pad - 35, pad - 15);

    // Draw V(x) curve
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const steps = 150;
    for (let i = 0; i <= steps; i++) {
      const xVal = (i / steps) * maxCut;
      const vVal = xVal * Math.pow(sheetSize - 2 * xVal, 2);
      const px = toPxX(xVal);
      const py = toPxY(vVal);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Optimal peak point (V' = 0)
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(toPxX(optimalCut), toPxY(maxVolume), 6, 0, Math.PI * 2);
    ctx.fill();

    // Current point
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(toPxX(cutSize), toPxY(currentVolume), 6, 0, Math.PI * 2);
    ctx.fill();
  }, [sheetSize, cutSize, optimalCut, maxVolume, currentVolume]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-50 via-sky-50 to-orange-50/60 border border-amber-200/80 rounded-2xl p-6 shadow-xs">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 inline-block mb-3">
          CHUYÊN ĐỀ 3 • TOÁN 12 KNTT (CHƯƠNG I)
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Ứng Dụng Đạo Hàm: Tối Ưu Hóa Kỹ Thuật & Cực Trị Thực Tế
        </h2>
        <p className="text-slate-600 text-sm mt-2 leading-relaxed">
          Mô hình bài toán kỹ thuật kinh điển: Cắt 4 góc hình vuông cạnh <MathView math="x" /> từ tấm tôn kích thước <MathView math="L \times L" /> để gấp thành chiếc hộp có thể tích lớn nhất <MathView math="V_{\max}" />.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white border border-sky-100 rounded-2xl p-5 shadow-sm">
        <div className="space-y-4">
          <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-100 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">Kích thước tấm bìa vuông (L):</span>
                <span className="text-amber-700 font-bold">{sheetSize} cm</span>
              </div>
              <input
                type="range"
                min="12"
                max="48"
                step="6"
                value={sheetSize}
                onChange={(e) => {
                  const s = parseInt(e.target.value);
                  setSheetSize(s);
                  setCutSize(s / 6);
                }}
                className="w-full h-1.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">Cạnh góc cắt (x):</span>
                <span className="text-blue-700 font-bold">{cutSize.toFixed(1)} cm</span>
              </div>
              <input
                type="range"
                min="0.5"
                max={(sheetSize / 2 - 0.5).toFixed(1)}
                step="0.5"
                value={cutSize}
                onChange={(e) => setCutSize(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          <div className="p-4 bg-sky-50/70 rounded-xl border border-sky-200 space-y-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
              Kết quả khảo sát đạo hàm:
            </span>
            <div className="text-xs text-slate-700 space-y-1">
              <p>Hàm thể tích: <MathView math="V(x) = x(L - 2x)^2 = 4x^3 - 4Lx^2 + L^2 x" /></p>
              <p>Đạo hàm bậc nhất: <MathView math="V'(x) = 12x^2 - 8Lx + L^2 = (2x - L)(6x - L)" /></p>
              <p className="text-emerald-700 font-bold pt-1">
                Điểm cực đại đạt được khi: <MathView math={`x = \\frac{L}{6} = ${optimalCut.toFixed(2)}\\text{ cm}`} />
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-sky-50/50 p-3 rounded-xl border border-sky-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 block font-medium">Thể tích hiện tại:</span>
              <span className="text-lg font-bold text-amber-700 font-mono">{currentVolume.toFixed(1)} cm³</span>
            </div>
            <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 shadow-2xs">
              <span className="text-[11px] text-emerald-800 block font-bold">Thể tích tối đa (Vmax):</span>
              <span className="text-lg font-bold text-emerald-700 font-mono">{maxVolume.toFixed(1)} cm³</span>
            </div>
          </div>
        </div>

        {/* Dynamic curve graph */}
        <div className="bg-slate-50 rounded-xl p-4 border border-sky-200 flex flex-col justify-between items-center shadow-xs">
          <canvas ref={canvasRef} width={420} height={280} className="w-full max-w-[420px] h-auto rounded-lg shadow-2xs" />
          <div className="flex items-center gap-4 text-xs text-slate-600 mt-2">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Điểm cực đại tối ưu (x = L/6)
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span> Trạng thái hiện tại
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
