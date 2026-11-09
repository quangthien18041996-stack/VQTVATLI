import React, { useState } from 'react';
import MathView from '../MathView';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, HelpCircle, ChevronDown, ChevronUp, Award } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: '4.20',
    title: 'Câu 4.20 (SGK Trang 27)',
    question: 'Một nguyên hàm của hàm số f(x) = \\sin 2x là:',
    options: [
      { key: 'A', text: 'F(x) = 2\\cos 2x' },
      { key: 'B', text: 'F(x) = -\\cos 2x' },
      { key: 'C', text: 'F(x) = \\frac{1}{2}\\cos 2x' },
      { key: 'D', text: 'F(x) = -\\frac{1}{2}\\cos 2x' }
    ],
    correct: 'D',
    explanation: 'Ta có \\int \\sin 2x dx = -\\frac{1}{2}\\cos 2x + C. Do đó F(x) = -\\frac{1}{2}\\cos 2x là một nguyên hàm.'
  },
  {
    id: '4.21',
    title: 'Câu 4.21 (SGK Trang 27)',
    question: 'Họ các nguyên hàm của hàm số 2e^x là:',
    options: [
      { key: 'A', text: '2xe^x + C' },
      { key: 'B', text: '-2e^x + C' },
      { key: 'C', text: '2e^x' },
      { key: 'D', text: '2e^x + C' }
    ],
    correct: 'D',
    explanation: 'Theo tính chất nguyên hàm, \\int 2e^x dx = 2 \\int e^x dx = 2e^x + C.'
  },
  {
    id: '4.22',
    title: 'Câu 4.22 (SGK Trang 27)',
    question: 'Nguyên hàm F(x) của hàm số f(x) = e^x - 3e^{-x} thoả mãn F(0) = 4 là:',
    options: [
      { key: 'A', text: 'F(x) = e^x - 3e^{-x}' },
      { key: 'B', text: 'F(x) = e^x + 3e^{-2x}' },
      { key: 'C', text: 'F(x) = e^x + 3e^{-x}' },
      { key: 'D', text: 'F(x) = e^x + 3e^{-x} + 4' }
    ],
    correct: 'C',
    explanation: 'Ta có F(x) = \\int (e^x - 3e^{-x})dx = e^x + 3e^{-x} + C. Với F(0) = e^0 + 3e^0 + C = 1 + 3 + C = 4 \\implies C = 0. Vậy F(x) = e^x + 3e^{-x}.'
  },
  {
    id: '4.23',
    title: 'Câu 4.23 (SGK Trang 27)',
    question: 'Cho hàm số f(x) có đạo hàm f\'(x) liên tục trên \\mathbb{R}, f(1) = 16 và \\int_1^3 f\'(x)dx = 4. Khi đó giá trị của f(3) bằng:',
    options: [
      { key: 'A', text: '20' },
      { key: 'B', text: '16' },
      { key: 'C', text: '12' },
      { key: 'D', text: '10' }
    ],
    correct: 'A',
    explanation: 'Theo định nghĩa tích phân: \\int_1^3 f\'(x)dx = f(3) - f(1) \\iff 4 = f(3) - 16 \\implies f(3) = 20.'
  },
  {
    id: '4.24',
    title: 'Câu 4.24 (SGK Trang 27)',
    question: 'Diện tích hình phẳng giới hạn bởi đồ thị các hàm số y = x^2 - 2x, y = -x^2 + 4x và hai đường thẳng x = 0, x = 3 là:',
    options: [
      { key: 'A', text: '-9' },
      { key: 'B', text: '9' },
      { key: 'C', text: '\\frac{16}{3}' },
      { key: 'D', text: '\\frac{20}{3}' }
    ],
    correct: 'B',
    explanation: 'Xét hiệu (x^2 - 2x) - (-x^2 + 4x) = 2x^2 - 6x = 2x(x - 3). Với x \\in [0, 3], hiệu này luôn \\le 0. Do đó S = \\int_0^3 |2x^2 - 6x|dx = \\int_0^3 (6x - 2x^2)dx = \\left.(3x^2 - \\frac{2x^3}{3})\\right|_0^3 = 27 - 18 = 9.'
  },
  {
    id: '4.26',
    title: 'Câu 4.26 (SGK Trang 28)',
    question: 'Cho hình phẳng (S) giới hạn bởi đồ thị hàm số y = \\sqrt{1 - x^2}, trục hoành và hai đường thẳng x = -1, x = 1. Thể tích khối tròn xoay sinh ra khi quay (S) quanh Ox là:',
    options: [
      { key: 'A', text: '\\frac{3\\pi}{4}' },
      { key: 'B', text: '\\frac{3\\pi}{2}' },
      { key: 'C', text: '\\frac{2\\pi}{3}' },
      { key: 'D', text: '\\frac{4\\pi}{3}' }
    ],
    correct: 'D',
    explanation: 'Đây là thể tích khối cầu bán kính R=1! Ta có V = \\pi \\int_{-1}^1 (1 - x^2)dx = \\pi \\left.(x - \\frac{x^3}{3})\\right|_{-1}^1 = \\frac{4\\pi}{3}.'
  }
];

export default function ExerciseBank() {
  const [userAnswers, setUserAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState({});

  const handleSelect = (qId, optionKey) => {
    setUserAnswers({ ...userAnswers, [qId]: optionKey });
    const q = QUIZ_QUESTIONS.find((item) => item.id === qId);
    if (q && q.correct === optionKey) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  const toggleExp = (qId) => {
    setShowExplanation((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const correctCount = Object.keys(userAnswers).filter(
    (qId) => userAnswers[qId] === QUIZ_QUESTIONS.find((q) => q.id === qId)?.correct
  ).length;

  return (
    <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-sm space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-sky-100">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-base md:text-lg font-bold text-slate-800">
              Hệ Thống Đánh Giá & Luyện Đề Chuẩn Cấu Trúc GDPT 2018
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ngân hàng câu hỏi trích từ Bài tập cuối Chương IV (SGK Trang 27–28). Có chấm điểm tự động và lời giải từng bước.
          </p>
        </div>

        {/* Score indicator */}
        <div className="bg-sky-50 px-4 py-2 rounded-xl border border-sky-200 flex items-center gap-3 shadow-xs">
          <span className="text-xs text-slate-600 font-medium">Điểm số:</span>
          <span className="text-lg font-black text-blue-700 font-mono">
            {correctCount} / {QUIZ_QUESTIONS.length}
          </span>
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {QUIZ_QUESTIONS.map((q) => {
          const userChoice = userAnswers[q.id];
          const isAnswered = !!userChoice;
          const isCorrect = userChoice === q.correct;

          return (
            <div
              key={q.id}
              className={`p-4 rounded-xl border transition-all ${
                isAnswered
                  ? isCorrect
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-rose-50/70 border-rose-300'
                  : 'bg-white border-sky-200/80 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  {q.title}
                </span>
                {isAnswered && (
                  <span
                    className={`text-xs font-bold flex items-center gap-1 ${
                      isCorrect ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Chính xác (+1đ)
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" /> Chưa đúng
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Question text with KaTeX */}
              <div className="text-sm font-semibold text-slate-800 my-3">
                <MathView math={q.question} />
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                {q.options.map((opt) => {
                  const isSelected = userChoice === opt.key;
                  let btnStyle = 'bg-white border-sky-200 text-slate-700 hover:bg-sky-50 hover:border-blue-300';

                  if (isAnswered) {
                    if (opt.key === q.correct) {
                      btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-100 border-rose-500 text-rose-900 font-medium';
                    } else {
                      btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelect(q.id, opt.key)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2.5 cursor-pointer shadow-2xs ${btnStyle}`}
                    >
                      <span className="w-5 h-5 rounded-md bg-sky-100 flex items-center justify-center font-bold text-blue-800 text-[11px] shrink-0">
                        {opt.key}
                      </span>
                      <span>
                        <MathView math={opt.text} />
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation toggle */}
              <div className="mt-3 pt-2.5 border-t border-sky-100 flex items-center justify-between">
                <button
                  onClick={() => toggleExp(q.id)}
                  className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  {showExplanation[q.id] ? 'Ẩn lời giải chi tiết' : 'Xem lời giải chi tiết'}
                  {showExplanation[q.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {showExplanation[q.id] && (
                <div className="mt-2.5 p-3.5 bg-sky-50/80 rounded-xl border border-sky-200 text-xs text-slate-700 leading-relaxed font-mono">
                  <span className="text-blue-800 font-bold block mb-1">Phương pháp giải:</span>
                  <MathView math={q.explanation} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
