import React, { useState } from 'react';
import MathView from '../MathView';
import Part4ExerciseBank from './Part4ExerciseBank';
import { 
  GitBranch, 
  HelpCircle, 
  Layers, 
  Award, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Sliders,
  RotateCcw,
  BookOpen,
  Compass,
  FileCheck,
  Check,
  Percent,
  Activity,
  ShieldAlert,
  Car,
  Gift,
  HelpCircle as QuestionIcon,
  Calculator
} from 'lucide-react';

export default function Part4Probability({ onOpenCasioModal }) {
  const [activeTab, setActiveTab] = useState('conditional'); // 'conditional' | 'bayes-tree' | 'exercises' | 'theory'

  /* ==========================================================
     TAB 1: TRÒ CHƠI NGHỊCH LÝ MONTY HALL & BẢNG 2x2
     ========================================================== */
  // Monty Hall Simulation state
  const [carDoor, setCarDoor] = useState(1); // 0, 1, 2
  const [selectedDoor, setSelectedDoor] = useState(null);
  const [revealedGoatDoor, setRevealedGoatDoor] = useState(null);
  const [finalDoor, setFinalDoor] = useState(null);
  const [gameResult, setGameResult] = useState(null); // 'win' | 'lose'
  const [stats, setStats] = useState({ switchWins: 0, switchTotal: 0, stayWins: 0, stayTotal: 0 });

  // Init a new Monty Hall round
  const startNewMontyRound = () => {
    const newCar = Math.floor(Math.random() * 3);
    setCarDoor(newCar);
    setSelectedDoor(null);
    setRevealedGoatDoor(null);
    setFinalDoor(null);
    setGameResult(null);
  };

  const handlePickInitialDoor = (doorIndex) => {
    if (selectedDoor !== null) return;
    setSelectedDoor(doorIndex);

    // Host reveals a goat door that is neither the car nor the player's pick
    const availableGoats = [0, 1, 2].filter(d => d !== doorIndex && d !== carDoor);
    const hostChoice = availableGoats[Math.floor(Math.random() * availableGoats.length)];
    setRevealedGoatDoor(hostChoice);
  };

  const handleFinalChoice = (isSwitch) => {
    let chosen;
    if (isSwitch) {
      chosen = [0, 1, 2].find(d => d !== selectedDoor && d !== revealedGoatDoor);
    } else {
      chosen = selectedDoor;
    }
    setFinalDoor(chosen);

    const isWin = chosen === carDoor;
    setGameResult(isWin ? 'win' : 'lose');

    if (isSwitch) {
      setStats(prev => ({
        ...prev,
        switchTotal: prev.switchTotal + 1,
        switchWins: prev.switchWins + (isWin ? 1 : 0)
      }));
    } else {
      setStats(prev => ({
        ...prev,
        stayTotal: prev.stayTotal + 1,
        stayWins: prev.stayWins + (isWin ? 1 : 0)
      }));
    }
  };

  // Interactive 2x2 contingency table (Bài 6.18 SGK)
  const [tableData, setTableData] = useState({
    curedX: 1600,
    notCuredX: 800,
    curedY: 1200,
    notCuredY: 400
  });

  const totalX = tableData.curedX + tableData.notCuredX;
  const totalY = tableData.curedY + tableData.notCuredY;
  const totalCured = tableData.curedX + tableData.curedY;
  const totalNotCured = tableData.notCuredX + tableData.notCuredY;
  const grandTotal = totalX + totalY;

  const pCuredGivenX = totalX > 0 ? (tableData.curedX / totalX) : 0;
  const pCuredGivenY = totalY > 0 ? (tableData.curedY / totalY) : 0;
  const pXGivenCured = totalCured > 0 ? (tableData.curedX / totalCured) : 0;

  /* ==========================================================
     TAB 2: CÂY XÁC SUẤT ĐỘNG (TREE DIAGRAM) & ĐỊNH LÝ BAYES
     ========================================================== */
  const [selectedScenario, setSelectedScenario] = useState('medical'); // 'medical' | 'weather' | 'factory'

  // Parameters for scenarios
  const [pA, setPA] = useState(0.02); // 2% bệnh nền / mưa / dây chuyền I
  const [pBGivenA, setPBGivenA] = useState(0.95); // Độ nhạy / bán hết vé khi mưa
  const [pBGivenNotA, setPBGivenNotA] = useState(0.10); // Dương tính giả / bán hết khi ko mưa

  // Sync preset scenarios
  const handleSelectScenario = (scId) => {
    setSelectedScenario(scId);
    if (scId === 'medical') {
      setPA(0.02);
      setPBGivenA(0.95);
      setPBGivenNotA(0.10);
    } else if (scId === 'weather') {
      // SGK Hình 6.1 Trang 72: Trời mưa P(A) = 0.75, bán hết vé khi mưa P(B|A) = 0.4, khi ko mưa P(B|A') = 0.9
      setPA(0.75);
      setPBGivenA(0.40);
      setPBGivenNotA(0.90);
    } else if (scId === 'factory') {
      // Dây chuyền I: 60%, lỗi 1%; Dây chuyền II: 40%, lỗi 3%
      setPA(0.60);
      setPBGivenA(0.01);
      setPBGivenNotA(0.03);
    }
  };

  const pNotA = +(1 - pA).toFixed(4);
  const pNotBGivenA = +(1 - pBGivenA).toFixed(4);
  const pNotBGivenNotA = +(1 - pBGivenNotA).toFixed(4);

  // Path probabilities
  const pPath1 = +(pA * pBGivenA).toFixed(5);
  const pPath2 = +(pA * pNotBGivenA).toFixed(5);
  const pPath3 = +(pNotA * pBGivenNotA).toFixed(5);
  const pPath4 = +(pNotA * pNotBGivenNotA).toFixed(5);

  // Total probability P(B)
  const pTotalB = +(pPath1 + pPath3).toFixed(5);

  // Bayes posterior P(A|B)
  const pAGivenB = pTotalB > 0 ? +(pPath1 / pTotalB).toFixed(4) : 0;

  return (
    <div className="space-y-6">
      {/* Overview Intro Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-sky-800 text-white rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-purple-100 inline-flex items-center gap-1.5 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              CHUYÊN ĐỀ 4 • TOÁN 12 KNTT (CHƯƠNG VI)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-900">
              Trọng Tâm Đổi Mới GDPT 2018
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Chương VI: Xác Suất Có Điều Kiện & Định Lý Bayes
          </h2>
          <p className="text-purple-100 text-xs md:text-sm leading-relaxed">
            Hệ thống hóa toàn bộ kiến thức <strong>Bài 18 (Xác suất có điều kiện, bảng thống kê 2x2)</strong> và <strong>Bài 19 (Công thức xác suất toàn phần & Định lý Bayes)</strong>. Trực quan hóa mô hình cây xác suất động và các ứng dụng đột phá trong chẩn đoán y tế, khoa học dữ liệu và trí tuệ nhân tạo (AI).
          </p>
        </div>

        {onOpenCasioModal && (
          <button
            onClick={onOpenCasioModal}
            className="relative z-10 self-start md:self-center px-4 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <Calculator className="w-4 h-4 text-white" />
            <span>Mẹo Casio Chương VI</span>
          </button>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-purple-100 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('conditional')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'conditional'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-purple-50 border border-purple-100'
          }`}
        >
          <Gift className="w-4 h-4" />
          1. Phòng Thí Nghiệm & Nghịch Lý Monty Hall
        </button>

        <button
          onClick={() => setActiveTab('bayes-tree')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'bayes-tree'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-purple-50 border border-purple-100'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          2. Cây Xác Suất Động & Định Lý Bayes
        </button>

        <button
          onClick={() => setActiveTab('exercises')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'exercises'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-purple-50 border border-purple-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          3. Luyện Đề & Chấm Điểm
        </button>

        <button
          onClick={() => setActiveTab('theory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'theory'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-purple-50 border border-purple-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          4. Sổ Tay Công Thức & Sơ Đồ Tư Duy
        </button>
      </div>

      {/* ========================================================
          TAB 1: PHÒNG THÍ NGHIỆM XÁC SUẤT CÓ ĐIỀU KIỆN & MONTY HALL
          ======================================================== */}
      {activeTab === 'conditional' && (
        <div className="space-y-6">
          {/* Section 1: Monty Hall Game (SGK Trang 64 - Let's Make a Deal) */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block">
                  Trò Chơi Mở Đầu Bài 18 (SGK Trang 64)
                </span>
                <h3 className="text-base md:text-lg font-extrabold text-slate-900 mt-0.5">
                  Mô Phỏng Trực Quan Nghịch Lý Monty Hall ("Ô Cửa Bí Mật")
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Đằng sau 3 cánh cửa có <strong>1 chiếc ô tô sang trọng 🚗</strong> và <strong>2 con dê 🐐</strong>. Bạn hãy chọn 1 cánh cửa!
                </p>
              </div>

              <button
                onClick={startNewMontyRound}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 self-start cursor-pointer transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Chơi Lượt Mới
              </button>
            </div>

            {/* 3 Doors Graphic */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto py-2">
              {[0, 1, 2].map((doorIdx) => {
                const isSelected = selectedDoor === doorIdx;
                const isRevealedGoat = revealedGoatDoor === doorIdx;
                const isFinal = finalDoor === doorIdx;
                const isCar = carDoor === doorIdx;

                let borderStyle = 'border-purple-200 bg-purple-50/40 hover:border-purple-400';
                if (isSelected && finalDoor === null) borderStyle = 'border-purple-600 bg-purple-100 ring-2 ring-purple-500';
                if (isRevealedGoat) borderStyle = 'border-amber-300 bg-amber-50';
                if (isFinal) {
                  borderStyle = gameResult === 'win' ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500' : 'border-red-400 bg-red-50';
                }

                return (
                  <div
                    key={doorIdx}
                    onClick={() => handlePickInitialDoor(doorIdx)}
                    className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[170px] ${borderStyle}`}
                  >
                    <span className="text-xs font-black text-slate-700 block">
                      CỬA SỐ {doorIdx + 1}
                    </span>

                    {/* Inside Content */}
                    <div className="my-2">
                      {isRevealedGoat ? (
                        <div className="space-y-1">
                          <span className="text-3xl block">🐐</span>
                          <span className="text-[10px] text-amber-800 font-bold block bg-amber-100 px-2 py-0.5 rounded-full">
                            MC mở con dê
                          </span>
                        </div>
                      ) : finalDoor !== null ? (
                        <div className="space-y-1">
                          <span className="text-3xl block">{isCar ? '🚗' : '🐐'}</span>
                          <span className={`text-[10px] font-bold block px-2 py-0.5 rounded-full ${isCar ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'}`}>
                            {isCar ? 'Ô tô trúng thưởng!' : 'Con dê'}
                          </span>
                        </div>
                      ) : (
                        <div className="w-12 h-16 bg-gradient-to-b from-purple-200 to-indigo-300 rounded-lg shadow-inner flex items-center justify-center border border-purple-300 mx-auto">
                          <span className="text-xs font-black text-purple-900">?</span>
                        </div>
                      )}
                    </div>

                    {/* Status Pill */}
                    <div>
                      {isSelected && finalDoor === null && (
                        <span className="text-[10px] bg-purple-600 text-white font-bold px-2 py-0.5 rounded-full">
                          Lựa chọn ban đầu
                        </span>
                      )}
                      {selectedDoor === null && (
                        <span className="text-[10px] text-slate-400">Bấm để chọn</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Player Next Action Decision */}
            {selectedDoor !== null && revealedGoatDoor !== null && finalDoor === null && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center space-y-3 animate-fade-in">
                <p className="text-xs text-amber-900 font-medium">
                  MC đã mở cánh cửa số <strong>{revealedGoatDoor + 1}</strong> có con dê! Bây giờ, bạn có muốn <strong>ĐỔI CỬA</strong> không?
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => handleFinalChoice(false)}
                    className="px-4 py-2 bg-white border border-slate-300 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-50 cursor-pointer shadow-xs transition-all"
                  >
                    ✋ Giữ nguyên cửa {selectedDoor + 1}
                  </button>
                  <button
                    onClick={() => handleFinalChoice(true)}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all flex items-center gap-1.5"
                  >
                    🔄 Đổi sang cánh cửa còn lại
                  </button>
                </div>
              </div>
            )}

            {/* Game Result & Math Explanation */}
            {gameResult !== null && (
              <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                gameResult === 'win' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {gameResult === 'win' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <ShieldAlert className="w-5 h-5 text-red-600" />}
                  {gameResult === 'win' ? 'Chúc mừng! Bạn đã rinh về chiếc xe ô tô 🚗!' : 'Rất tiếc! Cánh cửa bạn chọn là một con dê 🐐.'}
                </div>
                <p className="text-slate-700">
                  💡 <strong>Bản chất xác suất có điều kiện:</strong> Ban đầu, cơ hội chọn đúng ô tô chỉ là <MathView math="P = \frac{1}{3}" />. Do đó, xác suất ô tô nằm ở 2 cánh cửa còn lại là <MathView math="P = \frac{2}{3}" />. Khi MC mở 1 cửa có dê, toàn bộ xác suất <MathView math="\frac{2}{3}" /> đó dồn hết vào cánh cửa chưa mở còn lại! Vì vậy, <strong>luôn ĐỔI CỬA sẽ tăng tỷ lệ thắng gấp đôi (từ 33.3% lên 66.7%)!</strong>
                </p>
              </div>
            )}

            {/* Live Statistics Counter */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div className="text-center">
                <span className="text-slate-500 block text-[11px]">Chiến thuật ĐỔI CỬA:</span>
                <span className="text-lg font-black text-purple-700 font-mono">
                  {stats.switchTotal > 0 ? `${((stats.switchWins / stats.switchTotal) * 100).toFixed(1)}%` : '0%'}
                </span>
                <span className="text-[10px] text-slate-400 block">Thắng {stats.switchWins} / {stats.switchTotal} lượt</span>
              </div>
              <div className="text-center border-l border-slate-200">
                <span className="text-slate-500 block text-[11px]">Chiến thuật GIỮ NGUYÊN:</span>
                <span className="text-lg font-black text-slate-700 font-mono">
                  {stats.stayTotal > 0 ? `${((stats.stayWins / stats.stayTotal) * 100).toFixed(1)}%` : '0%'}
                </span>
                <span className="text-[10px] text-slate-400 block">Thắng {stats.stayWins} / {stats.stayTotal} lượt</span>
              </div>
            </div>
          </div>

          {/* Section 2: Interactive 2x2 Contingency Table (SGK Bài 6.18) */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm space-y-4">
            <div className="border-l-4 border-indigo-600 pl-3">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">Bài 18 • Mục 3 SGK Trang 68</span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">
                Bảng Dữ Liệu Thống Kê 2 × 2 & Tính Xác Suất Có Điều Kiện
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Ứng dụng thực tế: Thử nghiệm tác dụng điều trị bệnh mất ngủ của hai loại thuốc X và Y trên 4,000 bệnh nhân (Bài 6.18 SGK Trang 80). Bạn có thể chỉnh sửa số liệu trong ô để quan sát biến thiên xác suất.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-purple-50 text-purple-900 font-bold border-b border-purple-200">
                    <th className="p-3 text-left">Kết quả điều trị \ Thuốc</th>
                    <th className="p-3">Dùng thuốc X</th>
                    <th className="p-3">Dùng thuốc Y</th>
                    <th className="p-3 bg-purple-100/70">Tổng hàng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 text-left font-bold text-emerald-700 bg-emerald-50/30">Khỏi bệnh</td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={tableData.curedX}
                        onChange={(e) => setTableData({ ...tableData, curedX: parseInt(e.target.value) || 0 })}
                        className="w-24 px-2 py-1 text-center font-mono font-bold bg-white border border-slate-300 rounded-lg"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={tableData.curedY}
                        onChange={(e) => setTableData({ ...tableData, curedY: parseInt(e.target.value) || 0 })}
                        className="w-24 px-2 py-1 text-center font-mono font-bold bg-white border border-slate-300 rounded-lg"
                      />
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-800 bg-slate-50">{totalCured}</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-left font-bold text-red-600 bg-red-50/30">Không khỏi bệnh</td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={tableData.notCuredX}
                        onChange={(e) => setTableData({ ...tableData, notCuredX: parseInt(e.target.value) || 0 })}
                        className="w-24 px-2 py-1 text-center font-mono font-bold bg-white border border-slate-300 rounded-lg"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={tableData.notCuredY}
                        onChange={(e) => setTableData({ ...tableData, notCuredY: parseInt(e.target.value) || 0 })}
                        className="w-24 px-2 py-1 text-center font-mono font-bold bg-white border border-slate-300 rounded-lg"
                      />
                    </td>
                    <td className="p-3 font-mono font-bold text-red-800 bg-slate-50">{totalNotCured}</td>
                  </tr>
                  <tr className="bg-slate-100 font-bold text-slate-800">
                    <td className="p-3 text-left">Tổng cột</td>
                    <td className="p-3 font-mono">{totalX}</td>
                    <td className="p-3 font-mono">{totalY}</td>
                    <td className="p-3 font-mono text-purple-700 bg-purple-200/60">{grandTotal}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Calculated Conditional Probabilities */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-100 text-xs space-y-1">
                <span className="text-[11px] text-slate-500 font-semibold block">Khỏi bệnh khi uống thuốc X:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-indigo-700 font-mono">
                    {(pCuredGivenX * 100).toFixed(1)}%
                  </span>
                  <span className="text-slate-500 text-[11px]">({tableData.curedX}/{totalX})</span>
                </div>
                <MathView math="P(\text{Khỏi} | X) = \frac{n(\text{Khỏi} \cap X)}{n(X)}" className="text-indigo-900 font-semibold block text-[11px]" />
              </div>

              <div className="bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-100 text-xs space-y-1">
                <span className="text-[11px] text-slate-500 font-semibold block">Khỏi bệnh khi uống thuốc Y:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-indigo-700 font-mono">
                    {(pCuredGivenY * 100).toFixed(1)}%
                  </span>
                  <span className="text-slate-500 text-[11px]">({tableData.curedY}/{totalY})</span>
                </div>
                <MathView math="P(\text{Khỏi} | Y) = \frac{n(\text{Khỏi} \cap Y)}{n(Y)}" className="text-indigo-900 font-semibold block text-[11px]" />
              </div>

              <div className="bg-purple-50/70 p-3.5 rounded-xl border border-purple-200 text-xs space-y-1">
                <span className="text-[11px] text-purple-700 font-semibold block">Đã khỏi, xác suất uống thuốc X:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-purple-900 font-mono">
                    {(pXGivenCured * 100).toFixed(1)}%
                  </span>
                  <span className="text-slate-500 text-[11px]">({tableData.curedX}/{totalCured})</span>
                </div>
                <MathView math="P(X | \text{Khỏi}) = \frac{n(\text{Khỏi} \cap X)}{n(\text{Khỏi})}" className="text-purple-900 font-semibold block text-[11px]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: CÂY XÁC SUẤT ĐỘNG (TREE DIAGRAM) & ĐỊNH LÝ BAYES
          ======================================================== */}
      {activeTab === 'bayes-tree' && (
        <div className="space-y-6">
          {/* Scenario Selector */}
          <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-purple-600" /> Chọn Mô Hình Tình Huống Thực Tế:
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Quan sát sự cập nhật xác suất khi có thêm dữ kiện thông tin mới (Cập nhật Bayes).
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSelectScenario('medical')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedScenario === 'medical'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🏥 1. Xét Nghiệm Y Tế
              </button>
              <button
                onClick={() => handleSelectScenario('weather')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedScenario === 'weather'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🌧️ 2. Dự Báo Ca Nhạc (SGK H.6.1)
              </button>
              <button
                onClick={() => handleSelectScenario('factory')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedScenario === 'factory'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🏭 3. Kiểm Định Dây Chuyền
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sliders & Parameters */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-purple-100 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-purple-600" /> Tham Số Xác Suất Ban Đầu:
              </h4>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>
                      {selectedScenario === 'medical' ? 'Tỷ lệ mắc bệnh nền P(A):' : selectedScenario === 'weather' ? 'Dự báo trời mưa P(A):' : 'Tỷ lệ dây chuyền I P(A):'}
                    </span>
                    <span className="font-mono font-bold text-purple-700">{(pA * 100).toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.99"
                    step="0.01"
                    value={pA}
                    onChange={(e) => setPA(parseFloat(e.target.value))}
                    className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>
                      {selectedScenario === 'medical' ? 'Độ nhạy que test P(B|A):' : selectedScenario === 'weather' ? 'Bán hết vé khi trời mưa P(B|A):' : 'Tỷ lệ phế phẩm xưởng I P(B|A):'}
                    </span>
                    <span className="font-mono font-bold text-blue-700">{(pBGivenA * 100).toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.99"
                    step="0.01"
                    value={pBGivenA}
                    onChange={(e) => setPBGivenA(parseFloat(e.target.value))}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>
                      {selectedScenario === 'medical' ? 'Dương tính giả P(B|A\'):' : selectedScenario === 'weather' ? 'Bán hết vé khi KHÔNG mưa P(B|A\'):' : 'Tỷ lệ phế phẩm xưởng II P(B|A\'):'}
                    </span>
                    <span className="font-mono font-bold text-amber-700">{(pBGivenNotA * 100).toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.99"
                    step="0.01"
                    value={pBGivenNotA}
                    onChange={(e) => setPBGivenNotA(parseFloat(e.target.value))}
                    className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                </div>
              </div>

              {/* Calculated Bayes Result Card */}
              <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl space-y-2 mt-4">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block">
                  Kết Quả Tính Toán Theo Định Lý Bayes:
                </span>
                
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium">1. Xác suất toàn phần P(B):</span>
                    <span className="font-mono font-bold text-indigo-700">{(pTotalB * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium">2. Xác suất hậu nghiệm P(A|B):</span>
                    <span className="font-mono font-black text-purple-900 text-sm">{(pAGivenB * 100).toFixed(2)}%</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-200/60 text-[11px] text-slate-600 leading-relaxed">
                  <MathView math="P(A|B) = \frac{P(A) \cdot P(B|A)}{P(B)}" className="text-purple-800 font-semibold block text-center py-1" />
                  Khi có sự kiện <MathView math="B" /> xuất hiện, xác suất tiên nghiệm <MathView math="P(A)" /> được cập nhật tăng từ <strong className="text-slate-800">{(pA * 100).toFixed(1)}%</strong> lên xác suất hậu nghiệm <strong className="text-purple-700">{(pAGivenB * 100).toFixed(1)}%</strong>.
                </div>
              </div>
            </div>

            {/* Tree Diagram Visualizer */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-purple-100 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                  Sơ Đồ Cây Xác Suất Động 2 Cấp (Tree Diagram)
                </h4>
                <span className="text-[11px] text-slate-400">Tích xác suất trên nhánh</span>
              </div>

              {/* Graphic Tree Branches */}
              <div className="space-y-4 py-2">
                {/* Branch Top: A */}
                <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100 space-y-2">
                  <div className="flex items-center justify-between font-bold text-xs text-purple-900">
                    <span className="px-2 py-0.5 bg-purple-100 rounded-md">Nhánh Biến Cố A (Xác suất = {(pA * 100).toFixed(1)}%)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-3 border-l-2 border-purple-300 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-purple-100 shadow-2xs">
                      <div className="flex justify-between font-medium text-slate-700">
                        <span>Biến cố B | A:</span>
                        <span className="font-mono font-bold text-blue-600">{(pBGivenA * 100).toFixed(1)}%</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                        <span>P(A ∩ B) =</span>
                        <strong className="text-slate-800 font-mono">{(pPath1 * 100).toFixed(3)}%</strong>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-purple-100 shadow-2xs">
                      <div className="flex justify-between font-medium text-slate-700">
                        <span>Biến cố B' | A:</span>
                        <span className="font-mono text-slate-500">{(pNotBGivenA * 100).toFixed(1)}%</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                        <span>P(A ∩ B') =</span>
                        <strong className="text-slate-800 font-mono">{(pPath2 * 100).toFixed(3)}%</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Branch Bottom: Not A */}
                <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100 space-y-2">
                  <div className="flex items-center justify-between font-bold text-xs text-amber-900">
                    <span className="px-2 py-0.5 bg-amber-100 rounded-md">Nhánh Biến Cố A' (Xác suất = {(pNotA * 100).toFixed(1)}%)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-3 border-l-2 border-amber-300 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-amber-100 shadow-2xs">
                      <div className="flex justify-between font-medium text-slate-700">
                        <span>Biến cố B | A':</span>
                        <span className="font-mono font-bold text-amber-600">{(pBGivenNotA * 100).toFixed(1)}%</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                        <span>P(A' ∩ B) =</span>
                        <strong className="text-slate-800 font-mono">{(pPath3 * 100).toFixed(3)}%</strong>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-amber-100 shadow-2xs">
                      <div className="flex justify-between font-medium text-slate-700">
                        <span>Biến cố B' | A':</span>
                        <span className="font-mono text-slate-500">{(pNotBGivenNotA * 100).toFixed(1)}%</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                        <span>P(A' ∩ B') =</span>
                        <strong className="text-slate-800 font-mono">{(pPath4 * 100).toFixed(3)}%</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Summary Formula Box */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                <span className="font-bold text-slate-900 block mb-1">Quy tắc nhân trên cây xác suất:</span>
                Xác suất của một kết cục trên sơ đồ cây bằng <strong>tích các xác suất</strong> trên các nhánh đi từ gốc đến kết cục đó:
                <div className="font-mono text-purple-800 font-bold mt-1 text-center">
                  P(A ∩ B) = P(A) · P(B | A) = {(pA * 100).toFixed(1)}% · {(pBGivenA * 100).toFixed(1)}% = {(pPath1 * 100).toFixed(3)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: LUYỆN ĐỀ & CHẤM ĐIỂM (BÀI TẬP SGK & THI THỬ TN THPT)
          ======================================================== */}
      {activeTab === 'exercises' && (
        <Part4ExerciseBank />
      )}

      {/* ========================================================
          TAB 4: SỔ TAY CÔNG THỨC & SƠ ĐỒ TƯ DUY CHƯƠNG VI
          ======================================================== */}
      {activeTab === 'theory' && (
        <div className="space-y-6">
          {/* Sơ đồ tư duy 4 trụ cột */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Compass className="w-5 h-5 text-purple-600" />
              Sơ Đồ 4 Trụ Cột Kiến Thức Trọng Tâm Chương VI (GDPT 2018)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1 */}
              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
                    1
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm">Xác Suất Có Điều Kiện</h4>
                </div>
                <MathView math="P(A|B) = \frac{P(AB)}{P(B)} \quad (P(B) > 0)" block className="text-purple-800 font-semibold" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  Là xác suất của biến cố <MathView math="A" /> khi biết rằng biến cố <MathView math="B" /> đã xảy ra. Biến cố điều kiện <MathView math="B" /> đóng vai trò thu hẹp không gian mẫu ban đầu.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    2
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm">Công Thức Nhân Xác Suất</h4>
                </div>
                <MathView math="P(AB) = P(B) \cdot P(A|B) = P(A) \cdot P(B|A)" block className="text-blue-800 font-semibold" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  Áp dụng cho mọi cặp biến cố bất kỳ. Nếu <MathView math="A, B" /> độc lập thì <MathView math="P(A|B) = P(A)" /> và công thức trở về tích <MathView math="P(AB) = P(A)P(B)" />.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                    3
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm">Công Thức Xác Suất Toàn Phần</h4>
                </div>
                <MathView math="P(B) = P(A) \cdot P(B|A) + P(\overline{A}) \cdot P(B|\overline{A})" block className="text-emerald-800 font-semibold" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dùng để tính xác suất của biến cố mục tiêu <MathView math="B" /> bằng cách phân tách không gian mẫu thành 2 trường hợp đối lập nhau <MathView math="A" /> và <MathView math="\overline{A}" />.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center text-xs">
                    4
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm">Định Lý Bayes (Cập Nhật Xác Suất)</h4>
                </div>
                <MathView math="P(A|B) = \frac{P(A) \cdot P(B|A)}{P(B)}" block className="text-amber-800 font-semibold" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tính xác suất nguyên nhân <MathView math="A" /> khi đã biết kết quả <MathView math="B" />. Nền tảng cốt lõi của Machine Learning, mô hình phân loại Naive Bayes và phân tích rủi ro y sinh.
                </p>
              </div>
            </div>
          </div>

          {/* Bảng so sánh các lỗi sai kinh điển */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Các Lỗi Nhầm Lẫn Kinh Điển Cần Tránh Khi Thi TN THPT:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-red-50/60 rounded-xl border border-red-200 space-y-1">
                <span className="font-bold text-red-700 block">❌ Nhầm lẫn giữa P(A|B) và P(B|A):</span>
                <p className="text-slate-600">
                  <MathView math="P(\text{Dương tính} | \text{Bệnh})" /> (Độ nhạy que test) <strong>hoàn toàn khác</strong> với <MathView math="P(\text{Bệnh} | \text{Dương tính})" /> (Xác suất người có kết quả dương tính thực sự mắc bệnh)!
                </p>
              </div>

              <div className="p-3 bg-red-50/60 rounded-xl border border-red-200 space-y-1">
                <span className="font-bold text-red-700 block">❌ Quên cập nhật số lượng khi rút không hoàn lại:</span>
                <p className="text-slate-600">
                  Khi lấy liên tiếp 2 viên kẹo/viên bi mà không hoàn lại, không gian mẫu ở lần 2 bị giảm đi 1 phần tử (<MathView math="n - 1" />). Không được dùng xác suất của lần 1 cho lần 2!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
