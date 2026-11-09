import React, { useState } from 'react';
import MathView from '../MathView';
import { Rocket, Factory, TrendingUp, HeartPulse, Play, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function StemSimulations() {
  const [activeTab, setActiveTab] = useState('pottery');

  // Pottery state (Bài 4.35)
  const [potteryHeight, setPotteryHeight] = useState(30); // cm
  const [thickness, setThickness] = useState(1); // cm

  const outerVolume = React.useMemo(() => {
    const H = potteryHeight;
    const steps = 100;
    const dx = H / steps;
    let sum = 0;
    for (let i = 0; i < steps; i++) {
      const x = (i + 0.5) * dx;
      const y = (1 / 175) * x * x + (3 / 35) * x;
      sum += y * y * dx;
    }
    return Math.PI * sum;
  }, [potteryHeight]);

  const clayVolume = React.useMemo(() => {
    const H = potteryHeight;
    const steps = 100;
    const dx = H / steps;
    let sum = 0;
    for (let i = 0; i < steps; i++) {
      const x = (i + 0.5) * dx;
      const rOuter = (1 / 175) * x * x + (3 / 35) * x;
      const rInner = Math.max(0, rOuter - thickness);
      sum += (rOuter * rOuter - rInner * rInner) * dx;
    }
    return Math.PI * sum;
  }, [potteryHeight, thickness]);

  // Projectile state (Bài 4.7 & 4.30)
  const [v0, setV0] = useState(160);
  const [g, setG] = useState(9.8);
  const [simTime, setSimTime] = useState(0);
  const [isPlayingFlight, setIsPlayingFlight] = useState(false);

  const tPeak = v0 / g;
  const hMax = (v0 * v0) / (2 * g);
  const currentHeight = Math.max(0, v0 * simTime - 0.5 * g * simTime * simTime);
  const currentVelocity = v0 - g * simTime;

  React.useEffect(() => {
    let timer;
    if (isPlayingFlight) {
      timer = setInterval(() => {
        setSimTime((prev) => {
          if (prev >= 2 * tPeak) {
            setIsPlayingFlight(false);
            return 0;
          }
          return +(prev + 0.2).toFixed(1);
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isPlayingFlight, tPeak]);

  return (
    <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-sky-100 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <h3 className="text-base md:text-lg font-bold text-slate-800">
              Phòng Thí Nghiệm STEM: Ứng Dụng Tích Phân Vào Đời Sống Thực Tiễn
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Mô phỏng 4 bài toán thực tiễn tiêu biểu trích xuất trực tiếp từ SGK Toán 12 KNTT.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex flex-wrap gap-1.5 bg-sky-50 p-1 rounded-xl border border-sky-200">
          <button
            onClick={() => setActiveTab('pottery')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'pottery' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            Gốm Sứ Bát Tràng
          </button>
          <button
            onClick={() => setActiveTab('ballistics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'ballistics' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            Cơ Học & Đạn Pháo (Bài 4.7)
          </button>
          <button
            onClick={() => setActiveTab('lorenz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'lorenz' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Kinh Tế Lorenz (Bài 4.16)
          </button>
          <button
            onClick={() => setActiveTab('blood')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'blood' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            Y Sinh & Dòng Máu (Bài 4.13)
          </button>
        </div>
      </div>

      {/* Tab 1: Pottery */}
      {activeTab === 'pottery' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-sky-50/40 p-5 rounded-xl border border-sky-100">
          <div className="space-y-4">
            <div className="border-l-3 border-amber-500 pl-3">
              <h4 className="text-slate-800 font-bold text-sm">
                Bài toán chế tác gốm sứ truyền thống (SGK Trang 28 - Bài 4.35)
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Bình gốm có mặt trong là khối tròn xoay của đồ thị hàm số:
                <MathView math="y = \frac{1}{175}x^2 + \frac{3}{35}x \quad (0 \le x \le 30\text{ cm})" className="text-amber-800 font-mono text-xs mx-1 font-semibold" />
                quay quanh trục Ox. Bình có độ dày thành không đổi <MathView math="d = 1\text{ cm}" />.
              </p>
            </div>

            <div className="space-y-3 bg-white p-4 rounded-xl border border-sky-200 shadow-xs">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">Chiều cao bình gốm (H):</span>
                  <span className="text-amber-600 font-bold">{potteryHeight} cm</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="45"
                  value={potteryHeight}
                  onChange={(e) => setPotteryHeight(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">Độ dày thành bình (d):</span>
                  <span className="text-amber-600 font-bold">{thickness} cm</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={thickness}
                  onChange={(e) => setThickness(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                Kết quả tính toán tích phân kỹ thuật:
              </span>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <span className="text-[11px] text-slate-500 block">Dung tích lòng bình:</span>
                  <span className="text-lg font-black text-slate-900 font-mono">
                    {outerVolume.toFixed(1)} cm³
                  </span>
                  <span className="text-[10px] text-slate-500 block">≈ {(outerVolume / 1000).toFixed(2)} Lít</span>
                </div>
                <div>
                  <span className="text-[11px] text-amber-700 block font-semibold">Lượng đất sét cần dùng:</span>
                  <span className="text-lg font-black text-amber-600 font-mono">
                    {clayVolume.toFixed(1)} cm³
                  </span>
                  <span className="text-[10px] text-slate-500 block">Vật liệu đúc thành bình</span>
                </div>
              </div>
            </div>
          </div>

          {/* SVG Illustration */}
          <div className="flex flex-col items-center justify-center bg-white rounded-xl p-5 border border-sky-200 shadow-xs">
            <svg viewBox="0 0 420 220" className="w-full max-w-[420px] h-auto overflow-visible">
              <defs>
                <linearGradient id="potteryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
              {/* Trục xoay Ox */}
              <line x1="25" y1="110" x2="390" y2="110" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1.5" />
              <polygon points="390,106 398,110 390,114" fill="#94a3b8" />

              {/* Vỏ ngoài bình gốm */}
              <path
                d="M 75 110 Q 150 70 230 40 Q 270 20 300 20 L 300 200 Q 270 200 230 180 Q 150 150 75 110 Z"
                fill="url(#potteryGrad)"
                opacity="0.92"
                stroke="#d97706"
                strokeWidth="1.5"
              />

              {/* Lòng rỗng bên trong (co giãn trực quan theo độ dày d) */}
              <path
                d={`M ${75 + thickness * 5} 110 Q 150 ${70 + thickness * 3.5} 230 ${40 + thickness * 4} Q 270 ${20 + thickness * 4.5} 300 ${20 + thickness * 4.5} L 300 ${200 - thickness * 4.5} Q 270 ${200 - thickness * 4.5} 230 ${180 - thickness * 4} Q 150 ${150 - thickness * 3.5} ${75 + thickness * 5} 110 Z`}
                fill="#f0f7ff"
                stroke="#cbd5e1"
                strokeWidth="1"
              />

              {/* Chú thích văn bản rộng rãi, không bị tràn viền */}
              <text x="190" y="114" fill="#64748b" fontSize="11" textAnchor="middle" fontWeight="500">Trục xoay Ox</text>
              <text x="312" y="114" fill="#b45309" fontSize="11" textAnchor="start" fontWeight="bold">Miệng bình</text>
              <text x="65" y="114" fill="#b45309" fontSize="11" textAnchor="end" fontWeight="bold">Đáy bình</text>
            </svg>
            <p className="text-[11px] text-slate-500 text-center mt-3">
              Mặt cắt ngang cấu trúc bình gốm Bát Tràng (Phần đất sét màu cam nằm giữa vỏ ngoài và lòng rỗng).
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Ballistics */}
      {activeTab === 'ballistics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-sky-50/40 p-5 rounded-xl border border-sky-100">
          <div className="space-y-4">
            <div className="border-l-3 border-emerald-500 pl-3">
              <h4 className="text-slate-800 font-bold text-sm">
                Động lực học viên đạn bắn thẳng đứng (SGK Trang 11 - Bài 4.7)
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Vận tốc tại thời điểm <MathView math="t" /> giây là <MathView math="v(t) = 160 - 9.8t \text{ (m/s)}" />.
                Độ cao đạt được là tích phân của hàm vận tốc:
                <MathView math="s(t) = \int_0^t v(\tau) d\tau = 160t - 4.9t^2" className="text-emerald-700 font-mono text-xs block my-1 font-semibold" />
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-sky-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-700 font-medium">Trạng thái mô phỏng:</span>
                <button
                  onClick={() => setIsPlayingFlight(!isPlayingFlight)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isPlayingFlight ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {isPlayingFlight ? 'Tạm dừng' : 'Bắn pháo (Chạy)'}
                </button>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Thời gian bay (t):</span>
                  <span className="text-emerald-700 font-bold">{simTime} s / {(2 * tPeak).toFixed(1)} s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={(2 * tPeak).toFixed(1)}
                  step="0.1"
                  value={simTime}
                  onChange={(e) => {
                    setIsPlayingFlight(false);
                    setSimTime(parseFloat(e.target.value));
                  }}
                  className="w-full h-1.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-xl border border-sky-200 shadow-xs">
                <span className="text-[11px] text-slate-500 block">Độ cao hiện tại s(t):</span>
                <span className="text-xl font-bold text-slate-900 font-mono">{currentHeight.toFixed(1)} m</span>
                <span className="text-[10px] text-slate-400 block">Cực đại: {hMax.toFixed(1)} m</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-sky-200 shadow-xs">
                <span className="text-[11px] text-slate-500 block">Vận tốc tức thời v(t):</span>
                <span className={`text-xl font-bold font-mono ${currentVelocity >= 0 ? 'text-emerald-700' : 'text-amber-600'}`}>
                  {currentVelocity.toFixed(1)} m/s
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {currentVelocity >= 0 ? 'Đang bay lên' : 'Đang rơi xuống'}
                </span>
              </div>
            </div>
          </div>

          {/* Trajectory */}
          <div className="relative h-[240px] bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col justify-end p-4">
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-emerald-950/70 border-t border-emerald-800/40"></div>
            <div className="absolute left-4 top-4 bottom-6 w-8 flex flex-col justify-between text-[10px] text-slate-400 border-r border-slate-700">
              <span>{hMax.toFixed(0)}m</span>
              <span>{(hMax / 2).toFixed(0)}m</span>
              <span>0m</span>
            </div>
            <div
              className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-75 flex flex-col items-center"
              style={{
                bottom: `${Math.min(190, 16 + (currentHeight / hMax) * 170)}px`,
              }}
            >
              <div className="w-5 h-5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/80 flex items-center justify-center text-slate-950 font-bold text-[10px]">
                🚀
              </div>
              <span className="text-[10px] text-cyan-300 font-mono mt-1 bg-slate-950/80 px-1 rounded">
                {currentHeight.toFixed(0)}m
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Lorenz */}
      {activeTab === 'lorenz' && (
        <div className="bg-sky-50/40 p-5 rounded-xl border border-sky-100 space-y-4">
          <div className="border-l-3 border-indigo-500 pl-3">
            <h4 className="text-slate-800 font-bold text-sm">
              Đường cong Lorenz & Đo lường bất bình đẳng thu nhập (SGK Trang 25 - Bài 4.16)
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Đường <MathView math="y = x" /> thể hiện sự bình đẳng tuyệt đối. Đường cong Lorenz <MathView math="y = L(x)" /> thể hiện thực tế phân phối thu nhập. Hệ số Gini được đo bằng:
              <MathView math="G = 2 \int_0^1 (x - L(x)) dx" className="text-indigo-700 font-mono text-xs inline-block ml-2 font-semibold" />
            </p>
          </div>
          <div className="text-xs text-slate-700 bg-white p-3.5 rounded-lg border border-sky-200 shadow-xs">
            💡 <strong>Ý nghĩa thực tế:</strong> Chỉ số Gini nằm từ 0 (bình đẳng tuyệt đối) đến 1 (bất bình đẳng tuyệt đối). Tích phân chính là công cụ chuẩn mực của Ngân hàng Thế giới (World Bank) và Liên Hợp Quốc để giám sát sự công bằng kinh tế của mọi quốc gia trên toàn cầu!
          </div>
        </div>
      )}

      {/* Tab 4: Blood */}
      {activeTab === 'blood' && (
        <div className="bg-sky-50/40 p-5 rounded-xl border border-sky-100 space-y-4">
          <div className="border-l-3 border-rose-500 pl-3">
            <h4 className="text-slate-800 font-bold text-sm">
              Định luật Poiseuille về dòng máu trong động mạch (SGK Trang 18 - Bài 4.13)
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Vận tốc của dòng máu ở khoảng cách <MathView math="r" /> tính từ tâm động mạch bán kính <MathView math="R" /> là <MathView math="v(r) = k(R^2 - r^2)" />.
              Lưu lượng máu và vận tốc trung bình qua tiết diện tròn được tính bằng tích phân:
              <MathView math="\bar{v} = \frac{1}{\pi R^2} \int_0^R v(r) \cdot 2\pi r dr = \frac{1}{2} v_{\max}" className="text-rose-700 font-mono text-xs block my-1 font-semibold" />
            </p>
          </div>
          <div className="text-xs text-slate-700 bg-white p-3.5 rounded-lg border border-sky-200 shadow-xs">
            🩸 <strong>Ứng dụng Y học:</strong> Vận tốc máu ở tâm động mạch nhanh nhất và giảm dần về 0 ở thành mạch do lực ma sát nhớt. Tích phân giúp các bác sĩ tim mạch tính toán chính xác lưu lượng máu bơm qua tim mà không cần xâm lấn gây nguy hiểm cho bệnh nhân.
          </div>
        </div>
      )}
    </div>
  );
}
