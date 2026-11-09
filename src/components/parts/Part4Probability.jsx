import React, { useState } from 'react';
import MathView from '../MathView';
import { GitBranch, Activity, ShieldCheck, Sparkles } from 'lucide-react';

export default function Part4Probability() {
  const [prevalence, setPrevalence] = useState(1); // 1%
  const [sensitivity, setSensitivity] = useState(95); // 95%
  const [specificity, setSpecificity] = useState(90); // 90%

  const pD = prevalence / 100;
  const pNotD = 1 - pD;
  const pPosGivenD = sensitivity / 100;
  const pPosGivenNotD = (100 - specificity) / 100;

  const pTotalPos = pD * pPosGivenD + pNotD * pPosGivenNotD;
  const pDGivenPos = pTotalPos > 0 ? (pD * pPosGivenD) / pTotalPos : 0;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 via-sky-50 to-indigo-50/60 border border-purple-200/80 rounded-2xl p-6 shadow-xs">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200 inline-block mb-3">
          CHUYÊN ĐỀ 4 • TOÁN 12 KNTT (CHƯƠNG VI)
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Xác Suất Có Điều Kiện & Mô Hình Cây Xác Suất Định Lý Bayes
        </h2>
        <p className="text-slate-600 text-sm mt-2 leading-relaxed">
          Nội dung hoàn toàn mới trong chương trình Toán 12 GDPT 2018: Ứng dụng công thức xác suất toàn phần và định lý Bayes trong chẩn đoán y tế, trí tuệ nhân tạo và dự báo rủi ro thực tế.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white border border-sky-100 rounded-2xl p-5 shadow-sm">
        <div className="space-y-4">
          <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-100 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">Tỷ lệ mắc bệnh trong cộng đồng P(B):</span>
                <span className="text-purple-700 font-bold">{prevalence}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={prevalence}
                onChange={(e) => setPrevalence(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">Độ nhạy của que test P(+|B):</span>
                <span className="text-blue-700 font-bold">{sensitivity}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="99"
                value={sensitivity}
                onChange={(e) => setSensitivity(parseInt(e.target.value))}
                className="w-full h-1.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">Độ đặc hiệu của test P(-|không B):</span>
                <span className="text-emerald-700 font-bold">{specificity}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="99"
                value={specificity}
                onChange={(e) => setSpecificity(parseInt(e.target.value))}
                className="w-full h-1.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

          <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2">
            <span className="text-xs font-bold text-purple-800 uppercase tracking-wider block">
              Nghịch lý xác suất Bayes:
            </span>
            <p className="text-xs text-slate-700">
              Nếu một người nhận kết quả <strong>Dương tính (+)</strong>, xác suất người đó thực sự mắc bệnh là bao nhiêu?
            </p>
            <div className="text-2xl font-black text-purple-900 font-mono mt-1">
              P(B | +) = {(pDGivenPos * 100).toFixed(1)}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Mặc dù test chính xác {sensitivity}%, nhưng vì bệnh hiếm ({prevalence}%), đa số các kết quả dương tính lại là "dương tính giả" từ nhóm người khỏe mạnh!
            </p>
          </div>
        </div>

        {/* Tree visualization diagram */}
        <div className="bg-sky-50/40 rounded-xl p-4 border border-sky-100 flex flex-col justify-center space-y-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-purple-600" /> Sơ Đồ Cây Xác Suất (Tree Diagram):
          </h4>

          <div className="space-y-3 text-xs">
            {/* Branch 1 */}
            <div className="p-3 bg-white rounded-lg border-l-4 border-rose-500 shadow-2xs border border-sky-100">
              <div className="flex justify-between font-bold text-rose-700">
                <span>Nhánh Mắc bệnh P(B) = {(pD * 100).toFixed(1)}%</span>
              </div>
              <div className="pl-4 mt-2 space-y-1 text-slate-600">
                <div>• Test Dương tính (+): <strong className="text-slate-900 font-mono">{(pD * pPosGivenD * 100).toFixed(2)}%</strong></div>
                <div>• Test Âm tính (-): <strong className="text-slate-900 font-mono">{(pD * (1 - pPosGivenD) * 100).toFixed(2)}%</strong></div>
              </div>
            </div>

            {/* Branch 2 */}
            <div className="p-3 bg-white rounded-lg border-l-4 border-emerald-500 shadow-2xs border border-sky-100">
              <div className="flex justify-between font-bold text-emerald-700">
                <span>Nhánh Khỏe mạnh P(K) = {(pNotD * 100).toFixed(1)}%</span>
              </div>
              <div className="pl-4 mt-2 space-y-1 text-slate-600">
                <div>• Test Dương tính giả (+): <strong className="text-amber-700 font-mono">{(pNotD * pPosGivenNotD * 100).toFixed(2)}%</strong></div>
                <div>• Test Âm tính thật (-): <strong className="text-slate-900 font-mono">{(pNotD * (specificity / 100) * 100).toFixed(2)}%</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
