import React, { useState, useEffect } from 'react';
import MathView from '../MathView';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  Clock, 
  RotateCcw, 
  Send, 
  FileCheck, 
  BookOpen, 
  AlertCircle,
  Play,
  Pause,
  ArrowRight
} from 'lucide-react';

/* ============================================================
   1. DỮ LIỆU PHẦN LUYỆN TẬP (PRACTICE QUESTIONS - SGK CHƯƠNG IV)
   ============================================================ */
const PRACTICE_QUESTIONS = [
  {
    id: '4.20',
    title: 'Câu 4.20 (SGK Trang 27)',
    topic: 'Nguyên hàm lượng giác',
    question: 'Một nguyên hàm của hàm số $f(x) = \\sin 2x$ là:',
    options: [
      { key: 'A', text: '$F(x) = 2\\cos 2x$' },
      { key: 'B', text: '$F(x) = -\\cos 2x$' },
      { key: 'C', text: '$F(x) = \\frac{1}{2}\\cos 2x$' },
      { key: 'D', text: '$F(x) = -\\frac{1}{2}\\cos 2x$' }
    ],
    correct: 'D',
    explanation: 'Ta có $\\int \\sin 2x dx = -\\frac{1}{2}\\cos 2x + C$. Do đó $F(x) = -\\frac{1}{2}\\cos 2x$ là một nguyên hàm.'
  },
  {
    id: '4.21',
    title: 'Câu 4.21 (SGK Trang 27)',
    topic: 'Nguyên hàm hàm số mũ',
    question: 'Họ các nguyên hàm của hàm số $2e^x$ là:',
    options: [
      { key: 'A', text: '$2xe^x + C$' },
      { key: 'B', text: '$-2e^x + C$' },
      { key: 'C', text: '$2e^x$' },
      { key: 'D', text: '$2e^x + C$' }
    ],
    correct: 'D',
    explanation: 'Theo tính chất nguyên hàm, $\\int 2e^x dx = 2 \\int e^x dx = 2e^x + C$.'
  },
  {
    id: '4.22',
    title: 'Câu 4.22 (SGK Trang 27)',
    topic: 'Tìm nguyên hàm thỏa điều kiện',
    question: 'Nguyên hàm $F(x)$ của hàm số $f(x) = e^x - 3e^{-x}$ thoả mãn $F(0) = 4$ là:',
    options: [
      { key: 'A', text: '$F(x) = e^x - 3e^{-x}$' },
      { key: 'B', text: '$F(x) = e^x + 3e^{-2x}$' },
      { key: 'C', text: '$F(x) = e^x + 3e^{-x}$' },
      { key: 'D', text: '$F(x) = e^x + 3e^{-x} + 4$' }
    ],
    correct: 'C',
    explanation: 'Ta có $F(x) = \\int (e^x - 3e^{-x})dx = e^x + 3e^{-x} + C$. Với $F(0) = e^0 + 3e^0 + C = 1 + 3 + C = 4 \\implies C = 0$. Vậy $F(x) = e^x + 3e^{-x}$.'
  },
  {
    id: '4.23',
    title: 'Câu 4.23 (SGK Trang 27)',
    topic: 'Định nghĩa tích phân',
    question: 'Cho hàm số $f(x)$ có đạo hàm $f\'(x)$ liên tục trên $\\mathbb{R}$, $f(1) = 16$ và $\\int_1^3 f\'(x)dx = 4$. Khi đó giá trị của $f(3)$ bằng:',
    options: [
      { key: 'A', text: '20' },
      { key: 'B', text: '16' },
      { key: 'C', text: '12' },
      { key: 'D', text: '10' }
    ],
    correct: 'A',
    explanation: 'Theo định nghĩa tích phân: $\\int_1^3 f\'(x)dx = f(3) - f(1) \\iff 4 = f(3) - 16 \\implies f(3) = 20$.'
  },
  {
    id: '4.24',
    title: 'Câu 4.24 (SGK Trang 27)',
    topic: 'Diện tích hình phẳng',
    question: 'Diện tích hình phẳng giới hạn bởi đồ thị các hàm số $y = x^2 - 2x$, $y = -x^2 + 4x$ và hai đường thẳng $x = 0$, $x = 3$ là:',
    options: [
      { key: 'A', text: '-9' },
      { key: 'B', text: '9' },
      { key: 'C', text: '$\\frac{16}{3}$' },
      { key: 'D', text: '$\\frac{20}{3}$' }
    ],
    correct: 'B',
    explanation: 'Xét hiệu $(x^2 - 2x) - (-x^2 + 4x) = 2x^2 - 6x = 2x(x - 3)$. Với $x \\in [0, 3]$, hiệu này luôn $\\le 0$. Do đó $S = \\int_0^3 |2x^2 - 6x|dx = \\int_0^3 (6x - 2x^2)dx = \\left.(3x^2 - \\frac{2x^3}{3})\\right|_0^3 = 27 - 18 = 9$.'
  },
  {
    id: '4.26',
    title: 'Câu 4.26 (SGK Trang 28)',
    topic: 'Thể tích khối tròn xoay',
    question: 'Cho hình phẳng $(S)$ giới hạn bởi đồ thị hàm số $y = \\sqrt{1 - x^2}$, trục hoành và hai đường thẳng $x = -1$, $x = 1$. Thể tích khối tròn xoay sinh ra khi quay $(S)$ quanh trục $Ox$ là:',
    options: [
      { key: 'A', text: '$\\frac{3\\pi}{4}$' },
      { key: 'B', text: '$\\frac{3\\pi}{2}$' },
      { key: 'C', text: '$\\frac{2\\pi}{3}$' },
      { key: 'D', text: '$\\frac{4\\pi}{3}$' }
    ],
    correct: 'D',
    explanation: 'Đây là thể tích khối cầu bán kính $R=1$! Ta có $V = \\pi \\int_{-1}^1 (1 - x^2)dx = \\pi \\left.(x - \\frac{x^3}{3})\\right|_{-1}^1 = \\frac{4\\pi}{3}$.'
  },
  {
    id: '4.27',
    title: 'Câu 4.27 (SGK Trang 28)',
    topic: 'Ứng dụng vật lý - Gia tốc và Vận tốc',
    question: 'Một vật chuyển động có gia tốc là $a(t) = 3t^2 + t\\text{ (m/s}^2\\text{)}$. Biết rằng vận tốc ban đầu của vật là 2 m/s. Vận tốc của vật đó sau 2 giây là:',
    options: [
      { key: 'A', text: '8 m/s' },
      { key: 'B', text: '10 m/s' },
      { key: 'C', text: '12 m/s' },
      { key: 'D', text: '16 m/s' }
    ],
    correct: 'C',
    explanation: 'Vận tốc là nguyên hàm của gia tốc: $v(t) = \\int a(t)dt = t^3 + \\frac{t^2}{2} + C$. Với $v(0) = 2 \\implies C = 2$. Khi đó $v(2) = 2^3 + \\frac{2^2}{2} + 2 = 8 + 2 + 2 = 12\\text{ m/s}$.'
  }
];

/* ============================================================
   2. DỮ LIỆU ĐỀ THI TNTHPT (CHUẨN ĐỔI MỚI BỘ GD&ĐT TỪ NĂM 2025)
   Gồm 3 phần: Phần I (Trắc nghiệm), Phần II (Đúng/Sai), Phần III (Trả lời ngắn)
   ============================================================ */
const EXAM_PART_1 = [
  {
    id: 'E1_1',
    num: 1,
    question: 'Họ tất cả các nguyên hàm của hàm số $f(x) = 3x^2 + 2x$ là:',
    options: [
      { key: 'A', text: '$x^3 + x^2 + C$' },
      { key: 'B', text: '$6x + 2 + C$' },
      { key: 'C', text: '$3x^3 + 2x^2 + C$' },
      { key: 'D', text: '$\\frac{x^3}{3} + \\frac{x^2}{2} + C$' }
    ],
    correct: 'A',
    explanation: '$\\int (3x^2 + 2x)dx = 3\\cdot\\frac{x^3}{3} + 2\\cdot\\frac{x^2}{2} + C = x^3 + x^2 + C$.'
  },
  {
    id: 'E1_2',
    num: 2,
    question: 'Tích phân $I = \\int_0^1 e^{2x} dx$ có giá trị bằng:',
    options: [
      { key: 'A', text: '$e^2 - 1$' },
      { key: 'B', text: '$\\frac{e^2 - 1}{2}$' },
      { key: 'C', text: '$2(e^2 - 1)$' },
      { key: 'D', text: '$\\frac{e^2}{2}$' }
    ],
    correct: 'B',
    explanation: '$I = \\left.\\frac{e^{2x}}{2}\\right|_0^1 = \\frac{e^2 - e^0}{2} = \\frac{e^2 - 1}{2}$.'
  },
  {
    id: 'E1_3',
    num: 3,
    question: 'Cho $\\int_1^2 f(x)dx = 2$ và $\\int_1^2 g(x)dx = -3$. Khi đó $\\int_1^2 [f(x) - 2g(x)]dx$ bằng:',
    options: [
      { key: 'A', text: '8' },
      { key: 'B', text: '-4' },
      { key: 'C', text: '7' },
      { key: 'D', text: '-1' }
    ],
    correct: 'A',
    explanation: '$\\int_1^2 [f(x) - 2g(x)]dx = \\int_1^2 f(x)dx - 2\\int_1^2 g(x)dx = 2 - 2(-3) = 8$.'
  },
  {
    id: 'E1_4',
    num: 4,
    question: 'Thể tích khối tròn xoay tạo thành khi quay hình phẳng giới hạn bởi $y = \\sqrt{x}$, $y = 0$, $x = 0$, $x = 4$ quanh trục $Ox$ là:',
    options: [
      { key: 'A', text: '$8\\pi$' },
      { key: 'B', text: '$16\\pi$' },
      { key: 'C', text: '$4\\pi$' },
      { key: 'D', text: '$\\frac{16\\pi}{3}$' }
    ],
    correct: 'A',
    explanation: '$V = \\pi \\int_0^4 (\\sqrt{x})^2 dx = \\pi \\int_0^4 x dx = \\pi \\left.\\frac{x^2}{2}\\right|_0^4 = 8\\pi$.'
  }
];

const EXAM_PART_2 = [
  {
    id: 'E2_1',
    num: 1,
    statement: 'Cho hàm số $f(x) = 2x - 3$ liên tục trên $\\mathbb{R}$.',
    items: [
      { key: 'a', text: 'Một nguyên hàm của $f(x)$ là $F(x) = x^2 - 3x$.', correct: true, explain: 'Đạo hàm $F\'(x) = 2x - 3 = f(x)$ nên mệnh đề này ĐÚNG.' },
      { key: 'b', text: 'Nếu $F(x)$ là một nguyên hàm của $f(x)$ thỏa mãn $F(1) = 2$ thì $F(0) = 4$.', correct: true, explain: '$F(x) = x^2 - 3x + C$. Với $F(1) = 1 - 3 + C = 2 \\implies C = 4$. Do đó $F(0) = 4$ (ĐÚNG).' },
      { key: 'c', text: 'Tích phân $\\int_0^2 f(x)dx = -2$.', correct: true, explain: '$\\int_0^2 (2x - 3)dx = [x^2 - 3x]_0^2 = 4 - 6 = -2$ (ĐÚNG).' },
      { key: 'd', text: 'Diện tích hình phẳng giới hạn bởi đồ thị hàm số $y = f(x)$, trục hoành và hai đường thẳng $x = 0$, $x = 2$ bằng 2.', correct: false, explain: 'Nghiệm $f(x) = 0$ là $x = 1.5$. Diện tích $S = \\int_0^{1.5} (3 - 2x)dx + \\int_{1.5}^2 (2x - 3)dx = 2.25 + 0.25 = 2.5 \\neq 2$ (SAI).' }
    ]
  },
  {
    id: 'E2_2',
    num: 2,
    statement: 'Một vật thể chuyển động có vận tốc xác định bởi phương trình $v(t) = 3t^2 - 6t\\text{ (m/s)}$ với thời gian $t \\in [0; 3]$ (giây).',
    items: [
      { key: 'a', text: 'Gia tốc của vật tại thời điểm $t = 2$ giây là $6\\text{ m/s}^2$.', correct: true, explain: '$a(t) = v\'(t) = 6t - 6$. Tại $t = 2$: $a(2) = 12 - 6 = 6\\text{ m/s}^2$ (ĐÚNG).' },
      { key: 'b', text: 'Vật đổi chiều chuyển động tại thời điểm $t = 2$ giây.', correct: true, explain: '$v(t) = 3t(t - 2)$. Vận tốc đổi dấu khi qua $t = 2$ (ĐÚNG).' },
      { key: 'c', text: 'Độ dịch chuyển của vật sau 3 giây là 0 mét.', correct: true, explain: 'Độ dịch chuyển $s = \\int_0^3 (3t^2 - 6t)dt = [t^3 - 3t^2]_0^3 = 27 - 27 = 0\\text{ m}$ (ĐÚNG).' },
      { key: 'd', text: 'Tổng quãng đường vật thực sự đi được trong 3 giây đầu tiên là 4 mét.', correct: false, explain: 'Quãng đường $S = \\int_0^3 |v(t)|dt = \\int_0^2 (6t - 3t^2)dt + \\int_2^3 (3t^2 - 6t)dt = 4 + 4 = 8\\text{ m} \\neq 4\\text{ m}$ (SAI).' }
    ]
  }
];

const EXAM_PART_3 = [
  {
    id: 'E3_1',
    num: 1,
    question: 'Một vật thể có diện tích mặt cắt vuông góc với trục $Ox$ tại điểm có hoành độ $x$ là $S(x) = 2x + 1$ (với $0 \\le x \\le 4$). Thể tích $V$ của vật thể đó bằng bao nhiêu?',
    correctAnswer: 20,
    tolerance: 0.1,
    unit: '',
    explanation: '$V = \\int_0^4 S(x)dx = \\int_0^4 (2x + 1)dx = \\left.[x^2 + x]\\right|_0^4 = 16 + 4 = 20$.'
  },
  {
    id: 'E3_2',
    num: 2,
    question: 'Một ô tô đang chạy với vận tốc 20 m/s thì người lái đạp phanh. Kể từ lúc đạp phanh, ô tô chuyển động chậm dần đều với vận tốc $v(t) = -40t + 20\\text{ (m/s)}$. Kể từ lúc đạp phanh đến khi dừng hẳn, ô tô đi được quãng đường bao nhiêu mét?',
    correctAnswer: 5,
    tolerance: 0.1,
    unit: 'm',
    explanation: 'Xe dừng hẳn khi $v(t) = 0 \\iff -40t + 20 = 0 \\iff t = 0.5\\text{ giây}$. Quãng đường $s = \\int_0^{0.5} (-40t + 20)dt = \\left.[-20t^2 + 20t]\\right|_0^{0.5} = -5 + 10 = 5\\text{ m}$.'
  }
];

export default function ExerciseBank() {
  const [activeTab, setActiveTab] = useState('practice'); // 'practice' | 'exam'

  /* Practice State */
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [showPracticeExp, setShowPracticeExp] = useState({});

  /* Exam Simulation State */
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [isExamRunning, setIsExamRunning] = useState(false);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);

  const [examPart1Answers, setExamPart1Answers] = useState({});
  const [examPart2Answers, setExamPart2Answers] = useState({}); // { 'E2_1_a': true/false, ... }
  const [examPart3Answers, setExamPart3Answers] = useState({}); // { 'E3_1': '20', ... }

  // Timer countdown
  useEffect(() => {
    let timer;
    if (isExamRunning && !isExamSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isExamRunning && !isExamSubmitted) {
      handleSubmitExam();
    }
    return () => clearInterval(timer);
  }, [isExamRunning, isExamSubmitted, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /* Handler for practice */
  const handlePracticeSelect = (qId, optionKey) => {
    setPracticeAnswers({ ...practiceAnswers, [qId]: optionKey });
    const q = PRACTICE_QUESTIONS.find((item) => item.id === qId);
    if (q && q.correct === optionKey) {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    }
  };

  const togglePracticeExp = (qId) => {
    setShowPracticeExp((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  /* Handlers for Exam */
  const startExam = () => {
    setIsExamRunning(true);
    setIsExamSubmitted(false);
    setTimeLeft(45 * 60);
    setExamPart1Answers({});
    setExamPart2Answers({});
    setExamPart3Answers({});
  };

  const resetExam = () => {
    setIsExamRunning(false);
    setIsExamSubmitted(false);
    setTimeLeft(45 * 60);
    setExamPart1Answers({});
    setExamPart2Answers({});
    setExamPart3Answers({});
  };

  const handleSubmitExam = () => {
    setIsExamRunning(false);
    setIsExamSubmitted(true);
    confetti({ particleCount: 80, spread: 100, origin: { y: 0.6 } });
  };

  /* Calculate official 2025 exam score */
  const calculateExamScore = () => {
    let part1Score = 0;
    EXAM_PART_1.forEach((q) => {
      if (examPart1Answers[q.id] === q.correct) part1Score += 0.25;
    });

    let part2Score = 0;
    EXAM_PART_2.forEach((q) => {
      let correctSubCount = 0;
      q.items.forEach((item) => {
        const userChoice = examPart2Answers[`${q.id}_${item.key}`];
        if (userChoice === item.correct) {
          correctSubCount += 1;
        }
      });
      // Official standard barem: 1 right = 0.1, 2 right = 0.25, 3 right = 0.5, 4 right = 1.0
      if (correctSubCount === 1) part2Score += 0.1;
      else if (correctSubCount === 2) part2Score += 0.25;
      else if (correctSubCount === 3) part2Score += 0.5;
      else if (correctSubCount === 4) part2Score += 1.0;
    });

    let part3Score = 0;
    EXAM_PART_3.forEach((q) => {
      const userVal = parseFloat(examPart3Answers[q.id]);
      if (!isNaN(userVal) && Math.abs(userVal - q.correctAnswer) <= q.tolerance) {
        part3Score += 0.5;
      }
    });

    const totalRaw = part1Score + part2Score + part3Score;
    // Scale to standard 10 base (Max possible raw in this mini test: 1.0 + 2.0 + 1.0 = 4.0 points, scaled to 10)
    const maxRaw = EXAM_PART_1.length * 0.25 + EXAM_PART_2.length * 1.0 + EXAM_PART_3.length * 0.5;
    const scaledScore = maxRaw > 0 ? (totalRaw / maxRaw) * 10 : 0;

    return {
      part1Score,
      part2Score,
      part3Score,
      totalRaw,
      scaledScore: scaledScore.toFixed(2),
    };
  };

  const examResults = isExamSubmitted ? calculateExamScore() : null;

  return (
    <div className="bg-white border border-sky-100 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
      {/* Main Mode Navigation Bar: 1. Luyện Tập vs 2. Luyện Thi TNTHPT */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sky-100">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-extrabold text-slate-900">
              Hệ Thống Đánh Giá & Luyện Đề Môn Toán 12
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Phân hệ kép: Luyện tập chuyên sâu từng bài và Thi thử thực chiến chuẩn ma trận đề Bộ GD&ĐT 2025.
          </p>
        </div>

        {/* Big Two Mode Switcher Pills */}
        <div className="flex bg-sky-50 p-1.5 rounded-2xl border border-sky-200 shadow-2xs">
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'practice'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-sky-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Luyện Tập Từng Câu (SGK)</span>
          </button>
          <button
            onClick={() => setActiveTab('exam')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'exam'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-sky-100'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>2. Luyện Thi TNTHPT (Chuẩn 2025)</span>
          </button>
        </div>
      </div>

      {/* ============================================================
          MỤC 1: LUYỆN TẬP TỪNG BÀI (PRACTICE MODE)
         ============================================================ */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          <div className="bg-sky-50/60 p-4 rounded-xl border border-sky-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Chế độ tự học: Chọn đáp án để kiểm tra ngay • Có giải thích chi tiết từng bước.</span>
            </div>
            <div className="text-xs font-bold text-blue-700 bg-white px-3 py-1.5 rounded-lg border border-sky-200">
              Đã làm: {Object.keys(practiceAnswers).length} / {PRACTICE_QUESTIONS.length} câu
            </div>
          </div>

          <div className="space-y-4">
            {PRACTICE_QUESTIONS.map((q) => {
              const userChoice = practiceAnswers[q.id];
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
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                        {q.title}
                      </span>
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {q.topic}
                      </span>
                    </div>

                    {isAnswered && (
                      <span className={`text-xs font-bold flex items-center gap-1 ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {isCorrect ? <><CheckCircle2 className="w-4 h-4" /> Chính xác</> : <><XCircle className="w-4 h-4" /> Chưa đúng</>}
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-semibold text-slate-800 my-3">
                    <MathView math={q.question} />
                  </div>

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
                          onClick={() => handlePracticeSelect(q.id, opt.key)}
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

                  <div className="mt-3 pt-2.5 border-t border-sky-100 flex items-center justify-between">
                    <button
                      onClick={() => togglePracticeExp(q.id)}
                      className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      {showPracticeExp[q.id] ? 'Ẩn lời giải chi tiết' : 'Xem lời giải chi tiết'}
                      {showPracticeExp[q.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {showPracticeExp[q.id] && (
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
      )}

      {/* ============================================================
          MỤC 2: LUYỆN THI TNTHPT (CHUẨN 2025 MOCK EXAM)
         ============================================================ */}
      {activeTab === 'exam' && (
        <div className="space-y-6">
          {/* Header Bar with Countdown Timer & Actions */}
          <div className="bg-gradient-to-r from-blue-50 to-sky-100/70 p-4 rounded-2xl border border-sky-200 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
                  Thời Gian Làm Bài Thực Chiến:
                </span>
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isExamRunning && !isExamSubmitted && (
                <button
                  onClick={startExam}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Bắt Đầu Làm Bài Thi
                </button>
              )}

              {isExamRunning && (
                <button
                  onClick={handleSubmitExam}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Nộp Bài Chấm Điểm
                </button>
              )}

              {(isExamRunning || isExamSubmitted) && (
                <button
                  onClick={resetExam}
                  className="px-3.5 py-2 bg-white border border-sky-200 hover:bg-sky-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Làm Lại
                </button>
              )}
            </div>
          </div>

          {/* Exam Result Score Card (Shown after submit) */}
          {isExamSubmitted && examResults && (
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 p-6 rounded-2xl border border-emerald-300 shadow-sm animate-fadeIn space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-emerald-200">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Kết Quả Thi Thử Chuẩn Cấu Trúc 2025
                  </span>
                  <h4 className="text-2xl font-black text-slate-900 mt-1">
                    Điểm Tổng Kết: <span className="text-emerald-700 font-mono">{examResults.scaledScore} / 10.0</span>
                  </h4>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white border border-emerald-200 text-center shadow-xs">
                  <span className="text-[10px] text-slate-500 block uppercase">Xếp loại năng lực</span>
                  <span className="text-sm font-black text-blue-700">
                    {parseFloat(examResults.scaledScore) >= 8 ? 'Xuất Sắc (8+)' : parseFloat(examResults.scaledScore) >= 6.5 ? 'Khá Giỏi' : 'Cần Cố Gắng'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-emerald-200">
                  <span className="text-slate-500 block">Phần I (Nhiều lựa chọn):</span>
                  <strong className="text-base text-slate-900 font-mono">{examResults.part1Score.toFixed(2)}</strong> đ
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-200">
                  <span className="text-slate-500 block">Phần II (Đúng / Sai):</span>
                  <strong className="text-base text-slate-900 font-mono">{examResults.part2Score.toFixed(2)}</strong> đ
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-200">
                  <span className="text-slate-500 block">Phần III (Trả lời ngắn):</span>
                  <strong className="text-base text-slate-900 font-mono">{examResults.part3Score.toFixed(2)}</strong> đ
                </div>
              </div>
            </div>
          )}

          {/* Exam Paper Content */}
          <div className="space-y-8">
            {/* ----------------- PHẦN I ----------------- */}
            <div className="space-y-4">
              <div className="border-b-2 border-blue-600 pb-2 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm md:text-base">
                    PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Thí sinh trả lời từ câu 1 đến câu 4. Mỗi câu hỏi chỉ chọn một phương án. (0.25 điểm / câu)
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {EXAM_PART_1.map((q) => {
                  const userChoice = examPart1Answers[q.id];

                  return (
                    <div key={q.id} className="p-4 bg-sky-50/30 rounded-xl border border-sky-100 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                          {q.num}
                        </span>
                        <div className="text-xs sm:text-sm font-semibold text-slate-800">
                          <MathView math={q.question} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                        {q.options.map((opt) => {
                          const isSelected = userChoice === opt.key;
                          let btnStyle = 'bg-white border-sky-200 text-slate-700 hover:bg-sky-50';

                          if (isSelected) {
                            btnStyle = 'bg-blue-600 text-white font-bold border-blue-600 shadow-xs';
                          }

                          if (isExamSubmitted) {
                            if (opt.key === q.correct) {
                              btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                            } else if (isSelected && opt.key !== q.correct) {
                              btnStyle = 'bg-rose-100 border-rose-500 text-rose-900 font-medium';
                            }
                          }

                          return (
                            <button
                              key={opt.key}
                              disabled={isExamSubmitted}
                              onClick={() => setExamPart1Answers({ ...examPart1Answers, [q.id]: opt.key })}
                              className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2.5 cursor-pointer ${btnStyle}`}
                            >
                              <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] ${
                                isSelected ? 'bg-white text-blue-700' : 'bg-sky-100 text-blue-800'
                              }`}>
                                {opt.key}
                              </span>
                              <span><MathView math={opt.text} /></span>
                            </button>
                          );
                        })}
                      </div>

                      {isExamSubmitted && (
                        <div className="mt-2 p-2.5 bg-sky-50 rounded-lg border border-sky-200 text-xs text-slate-600 font-mono">
                          <span className="font-bold text-blue-800">Giải thích: </span>
                          <MathView math={q.explanation} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ----------------- PHẦN II ----------------- */}
            <div className="space-y-4">
              <div className="border-b-2 border-emerald-600 pb-2">
                <h4 className="font-extrabold text-slate-900 text-sm md:text-base">
                  PHẦN II. Câu trắc nghiệm Đúng / Sai
                </h4>
                <p className="text-[11px] text-slate-500">
                  Thí sinh trả lời từng ý a, b, c, d của mỗi câu. (Đúng 1 ý: 0.1đ; 2 ý: 0.25đ; 3 ý: 0.5đ; 4 ý: 1.0đ)
                </p>
              </div>

              <div className="space-y-5">
                {EXAM_PART_2.map((q) => (
                  <div key={q.id} className="p-4 bg-sky-50/30 rounded-xl border border-sky-100 space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {q.num}
                      </span>
                      <div className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                        <MathView math={q.statement} />
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      {q.items.map((it) => {
                        const answerKey = `${q.id}_${it.key}`;
                        const currentChoice = examPart2Answers[answerKey];

                        return (
                          <div
                            key={it.key}
                            className="p-3 bg-white rounded-xl border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
                          >
                            <div className="text-xs text-slate-800 flex-1">
                              <span className="font-bold text-blue-700 mr-2">{it.key})</span>
                              <MathView math={it.text} />
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                disabled={isExamSubmitted}
                                onClick={() => setExamPart2Answers({ ...examPart2Answers, [answerKey]: true })}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                                  currentChoice === true
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                    : 'bg-white text-slate-600 border-sky-200 hover:bg-sky-50'
                                } ${
                                  isExamSubmitted && it.correct === true ? 'ring-2 ring-emerald-500 bg-emerald-50 text-emerald-800' : ''
                                }`}
                              >
                                Đúng
                              </button>
                              <button
                                disabled={isExamSubmitted}
                                onClick={() => setExamPart2Answers({ ...examPart2Answers, [answerKey]: false })}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                                  currentChoice === false
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                    : 'bg-white text-slate-600 border-sky-200 hover:bg-sky-50'
                                } ${
                                  isExamSubmitted && it.correct === false ? 'ring-2 ring-emerald-500 bg-emerald-50 text-emerald-800' : ''
                                }`}
                              >
                                Sai
                              </button>
                            </div>

                            {isExamSubmitted && (
                              <div className="w-full pt-1 text-[11px] text-slate-500 border-t border-sky-100">
                                💡 <MathView math={it.explain} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ----------------- PHẦN III ----------------- */}
            <div className="space-y-4">
              <div className="border-b-2 border-amber-600 pb-2">
                <h4 className="font-extrabold text-slate-900 text-sm md:text-base">
                  PHẦN III. Câu trắc nghiệm trả lời ngắn
                </h4>
                <p className="text-[11px] text-slate-500">
                  Thí sinh tính toán và nhập đáp số dưới dạng số thập phân hoặc số nguyên vào ô trống. (0.5 điểm / câu)
                </p>
              </div>

              <div className="space-y-4">
                {EXAM_PART_3.map((q) => {
                  const userVal = examPart3Answers[q.id] || '';
                  const numVal = parseFloat(userVal);
                  const isCorrect = isExamSubmitted && !isNaN(numVal) && Math.abs(numVal - q.correctAnswer) <= q.tolerance;

                  return (
                    <div key={q.id} className="p-4 bg-sky-50/30 rounded-xl border border-sky-100 space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="w-6 h-6 rounded-md bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {q.num}
                        </span>
                        <div className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                          <MathView math={q.question} />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <span className="text-xs text-slate-600 font-medium">Đáp số của bạn:</span>
                        <input
                          type="number"
                          step="any"
                          disabled={isExamSubmitted}
                          placeholder="Nhập số..."
                          value={userVal}
                          onChange={(e) => setExamPart3Answers({ ...examPart3Answers, [q.id]: e.target.value })}
                          className={`w-36 px-3 py-1.5 bg-white border rounded-xl text-sm font-mono text-slate-800 focus:outline-none focus:border-blue-500 ${
                            isExamSubmitted
                              ? isCorrect
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                                : 'border-rose-500 bg-rose-50 text-rose-900 font-bold'
                              : 'border-sky-200'
                          }`}
                        />
                        {q.unit && <span className="text-xs text-slate-500">{q.unit}</span>}

                        {isExamSubmitted && (
                          <span className={`text-xs font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {isCorrect ? '✓ Chính xác (+0.5đ)' : `✗ Đáp án đúng: ${q.correctAnswer}`}
                          </span>
                        )}
                      </div>

                      {isExamSubmitted && (
                        <div className="p-2.5 bg-sky-50 rounded-lg border border-sky-200 text-xs text-slate-600 font-mono">
                          <span className="font-bold text-blue-800">Phương pháp giải: </span>
                          <MathView math={q.explanation} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
