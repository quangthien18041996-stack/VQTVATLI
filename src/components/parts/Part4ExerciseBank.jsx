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
  Play
} from 'lucide-react';

/* ============================================================
   1. BÀI TẬP SGK TOÁN 12 KẾT NỐI TRI THỨC (CHƯƠNG VI - TRANG 79, 80)
   ============================================================ */
const PRACTICE_QUESTIONS = [
  {
    id: '6.12',
    title: 'Câu 6.12 (SGK Trang 79)',
    topic: 'Công thức nhân xác suất',
    question: 'Cho $P(A) = \\frac{2}{5}$; $P(B|A) = \\frac{1}{3}$; $P(B|\\overline{A}) = \\frac{1}{4}$. Giá trị của $P(AB)$ là:',
    options: [
      { key: 'A', text: '$\\frac{2}{15}$' },
      { key: 'B', text: '$\\frac{3}{16}$' },
      { key: 'C', text: '$\\frac{1}{5}$' },
      { key: 'D', text: '$\\frac{4}{15}$' }
    ],
    correct: 'A',
    explanation: 'Theo công thức nhân xác suất: $P(AB) = P(A) \\cdot P(B|A) = \\frac{2}{5} \\cdot \\frac{1}{3} = \\frac{2}{15}$.'
  },
  {
    id: '6.13',
    title: 'Câu 6.13 (SGK Trang 79)',
    topic: 'Xác suất của biến cố giao với biến cố đối',
    question: 'Với dữ kiện của Câu 6.12, giá trị của $P(B\\overline{A})$ là:',
    options: [
      { key: 'A', text: '$\\frac{1}{7}$' },
      { key: 'B', text: '$\\frac{4}{19}$' },
      { key: 'C', text: '$\\frac{4}{21}$' },
      { key: 'D', text: '$\\frac{3}{20}$' }
    ],
    correct: 'D',
    explanation: 'Ta có $P(\\overline{A}) = 1 - P(A) = 1 - \\frac{2}{5} = \\frac{3}{5}$. Do đó: $P(B\\overline{A}) = P(\\overline{A}) \\cdot P(B|\\overline{A}) = \\frac{3}{5} \\cdot \\frac{1}{4} = \\frac{3}{20}$.'
  },
  {
    id: '6.14',
    title: 'Câu 6.14 (SGK Trang 79)',
    topic: 'Công thức xác suất toàn phần',
    question: 'Với dữ kiện của Câu 6.12, giá trị của xác suất toàn phần $P(B)$ là:',
    options: [
      { key: 'A', text: '$\\frac{19}{60}$' },
      { key: 'B', text: '$\\frac{17}{60}$' },
      { key: 'C', text: '$\\frac{9}{20}$' },
      { key: 'D', text: '$\\frac{7}{30}$' }
    ],
    correct: 'B',
    explanation: 'Theo công thức xác suất toàn phần: $P(B) = P(AB) + P(B\\overline{A}) = \\frac{2}{15} + \\frac{3}{20} = \\frac{8 + 9}{60} = \\frac{17}{60}$.'
  },
  {
    id: '6.15',
    title: 'Câu 6.15 (SGK Trang 79)',
    topic: 'Lấy ngẫu nhiên không hoàn lại (Kẹo đen)',
    question: 'Bạn An có túi kẹo gồm 6 kẹo sô cô la đen và 4 kẹo sô cô la trắng. An lấy ngẫu nhiên 1 chiếc kẹo đưa cho Bình, rồi lấy tiếp 1 chiếc nữa đưa cho Bình. Xác suất để Bình nhận được 2 chiếc kẹo sô cô la đen là:',
    options: [
      { key: 'A', text: '$\\frac{1}{3}$' },
      { key: 'B', text: '$\\frac{1}{4}$' },
      { key: 'C', text: '$\\frac{2}{5}$' },
      { key: 'D', text: '$\\frac{3}{7}$' }
    ],
    correct: 'A',
    explanation: 'Gọi $A$ là biến cố lần 1 lấy kẹo đen: $P(A) = \\frac{6}{10}$. Khi đã lấy 1 kẹo đen, trong túi còn 9 chiếc (5 đen, 4 trắng). Xác suất lần 2 lấy tiếp kẹo đen là $P(B|A) = \\frac{5}{9}$. Xác suất cả 2 kẹo đen: $P(AB) = \\frac{6}{10} \\cdot \\frac{5}{9} = \\frac{30}{90} = \\frac{1}{3}$.'
  },
  {
    id: '6.16',
    title: 'Câu 6.16 (SGK Trang 79)',
    topic: 'Lấy ngẫu nhiên không hoàn lại (Kẹo trắng)',
    question: 'Với túi kẹo của Câu 6.15, xác suất để Bình nhận được 2 chiếc kẹo sô cô la trắng là:',
    options: [
      { key: 'A', text: '$\\frac{1}{5}$' },
      { key: 'B', text: '$\\frac{2}{15}$' },
      { key: 'C', text: '$\\frac{3}{16}$' },
      { key: 'D', text: '$\\frac{4}{17}$' }
    ],
    correct: 'B',
    explanation: 'Lần 1 lấy kẹo trắng: xác suất $\\frac{4}{10}$. Lần 2 lấy tiếp kẹo trắng khi túi còn 9 chiếc (3 trắng): xác suất $\\frac{3}{9}$. Xác suất cả 2 lần đều kẹo trắng: $P = \\frac{4}{10} \\cdot \\frac{3}{9} = \\frac{12}{90} = \\frac{2}{15}$.'
  },
  {
    id: '6.17',
    title: 'Câu 6.17 (SGK Trang 79)',
    topic: 'Lần 1 đen, lần 2 trắng',
    question: 'Với túi kẹo của Câu 6.15, xác suất để Bình nhận được kẹo đen ở lần 1 và kẹo trắng ở lần 2 là:',
    options: [
      { key: 'A', text: '$\\frac{1}{5}$' },
      { key: 'B', text: '$\\frac{3}{16}$' },
      { key: 'C', text: '$\\frac{1}{4}$' },
      { key: 'D', text: '$\\frac{4}{15}$' }
    ],
    correct: 'D',
    explanation: 'Lần 1 lấy kẹo đen: $P(Đ_1) = \\frac{6}{10}$. Lần 2 lấy kẹo trắng khi túi còn 9 chiếc (trong đó 4 trắng): $P(T_2|Đ_1) = \\frac{4}{9}$. Xác suất: $P = \\frac{6}{10} \\cdot \\frac{4}{9} = \\frac{24}{90} = \\frac{4}{15}$.'
  },
  {
    id: '6.18',
    title: 'Câu 6.18 (SGK Trang 80)',
    topic: 'Bảng thống kê 2x2 thử nghiệm thuốc',
    question: 'Thử nghiệm thuốc X và Y trên 4000 bệnh nhân mất ngủ: Thuốc X có 1600 người khỏi bệnh, 800 người không khỏi. Thuốc Y có 1200 người khỏi bệnh, 400 người không khỏi. Chọn ngẫu nhiên 1 người bệnh. Xác suất để người đó khỏi bệnh nếu biết người này uống thuốc X là:',
    options: [
      { key: 'A', text: '$\\frac{2}{3}$' },
      { key: 'B', text: '$\\frac{1}{2}$' },
      { key: 'C', text: '$\\frac{3}{4}$' },
      { key: 'D', text: '$\\frac{3}{5}$' }
    ],
    correct: 'A',
    explanation: 'Tổng số người dùng thuốc X là: $1600 + 800 = 2400$ người. Trong đó số người khỏi bệnh là 1600 người. Vậy xác suất có điều kiện là $P(\\text{Khỏi} | X) = \\frac{1600}{2400} = \\frac{2}{3}$.'
  },
  {
    id: '6.20',
    title: 'Câu 6.20 (SGK Trang 80)',
    topic: 'Công thức xác suất toàn phần chọn chuồng gà',
    question: 'Chuồng I có 5 gà mái, 2 gà trống. Chuồng II có 3 gà mái, 5 gà trống. Tung một con xúc xắc cân đối: Nếu số chấm chia hết cho 3 (mặt 3, 6) thì chọn Chuồng I; nếu không thì chọn Chuồng II. Từ chuồng đã chọn, bắt ngẫu nhiên 1 con gà. Xác suất để bắt được con gà mái là:',
    options: [
      { key: 'A', text: '$\\frac{37}{72}$' },
      { key: 'B', text: '$\\frac{41}{84}$' },
      { key: 'C', text: '$\\frac{43}{84}$' },
      { key: 'D', text: '$\\frac{1}{2}$' }
    ],
    correct: 'B',
    explanation: 'Xác suất số chấm chia hết cho 3 là $P(I) = \\frac{2}{6} = \\frac{1}{3}$. Xác suất chọn chuồng II là $P(II) = 1 - \\frac{1}{3} = \\frac{2}{3}$. Tại chuồng I: $P(\\text{Mái}|I) = \\frac{5}{7}$. Tại chuồng II: $P(\\text{Mái}|II) = \\frac{3}{8}$. Theo công thức toàn phần: $P(\\text{Mái}) = \\frac{1}{3} \\cdot \\frac{5}{7} + \\frac{2}{3} \\cdot \\frac{3}{8} = \\frac{5}{21} + \\frac{1}{4} = \\frac{41}{84}$.'
  }
];

/* ============================================================
   2. DỮ LIỆU ĐỀ THI TN THPT CHƯƠNG VI (FORMAT BỘ GD&ĐT)
   ============================================================ */
const EXAM_PART_1 = [
  {
    id: 'E1_1',
    num: 1,
    question: 'Cho hai biến cố $A$ và $B$ có $P(A) = 0.4$, $P(B) = 0.5$ và $P(A|B) = 0.6$. Giá trị của xác suất đồng thời $P(AB)$ là:',
    options: [
      { key: 'A', text: '$0.20$' },
      { key: 'B', text: '$0.24$' },
      { key: 'C', text: '$0.30$' },
      { key: 'D', text: '$0.12$' }
    ],
    correct: 'C',
    explanation: 'Áp dụng công thức nhân xác suất: $P(AB) = P(B) \\cdot P(A|B) = 0.5 \\cdot 0.6 = 0.30$.'
  },
  {
    id: 'E1_2',
    num: 2,
    question: 'Công thức Bayes dùng để tính xác suất hậu nghiệm $P(A|B)$ khi đã biết $P(A)$, $P(B|A)$ và $P(B|\\overline{A})$ là:',
    options: [
      { key: 'A', text: '$P(A|B) = \\frac{P(A) \\cdot P(B|A)}{P(B)}$' },
      { key: 'B', text: '$P(A|B) = \\frac{P(B) \\cdot P(A|B)}{P(A)}$' },
      { key: 'C', text: '$P(A|B) = P(A) \\cdot P(B|A)$' },
      { key: 'D', text: '$P(A|B) = \\frac{P(AB)}{P(A)}$' }
    ],
    correct: 'A',
    explanation: 'Theo định lý Bayes: $P(A|B) = \\frac{P(A) \\cdot P(B|A)}{P(B)} = \\frac{P(A) \\cdot P(B|A)}{P(A) \\cdot P(B|A) + P(\\overline{A}) \\cdot P(B|\\overline{A})}$.'
  },
  {
    id: 'E1_3',
    num: 3,
    question: 'Một xạ thủ bắn 2 viên đạn độc lập vào bia với xác suất trúng đích lần 1 là $0.8$ và lần 2 là $0.7$. Xác suất để có ít nhất 1 viên trúng đích biết rằng viên thứ nhất đã bị trượt là:',
    options: [
      { key: 'A', text: '$0.7$' },
      { key: 'B', text: '$0.8$' },
      { key: 'C', text: '$0.56$' },
      { key: 'D', text: '$0.94$' }
    ],
    correct: 'A',
    explanation: 'Khi biết viên thứ nhất đã trượt, để có ít nhất 1 viên trúng đích thì bắt buộc viên thứ hai phải trúng. Do hai lần bắn độc lập nên xác suất viên thứ hai trúng chính là $0.7$.'
  },
  {
    id: 'E1_4',
    num: 4,
    question: 'Một hộp có 5 viên bi đỏ và 3 viên bi xanh. Lấy ngẫu nhiên lần lượt 2 viên bi không hoàn lại. Xác suất để viên thứ hai màu xanh biết viên thứ nhất màu đỏ là:',
    options: [
      { key: 'A', text: '$\\frac{3}{8}$' },
      { key: 'B', text: '$\\frac{3}{7}$' },
      { key: 'C', text: '$\\frac{5}{7}$' },
      { key: 'D', text: '$\\frac{15}{56}$' }
    ],
    correct: 'B',
    explanation: 'Khi viên thứ nhất màu đỏ đã được lấy ra ngoài, trong hộp còn tổng cộng 7 viên bi (4 đỏ và 3 xanh). Do đó xác suất viên thứ hai màu xanh là $\\frac{3}{7}$.'
  }
];

const EXAM_PART_2 = [
  {
    id: 'E2_1',
    num: 1,
    statement: 'Xét nghiệm chẩn đoán một căn bệnh hiếm gặp có tỷ lệ mắc trong cộng đồng là $1\\%$. Que xét nghiệm có độ nhạy $95\\%$ (xác suất người bị bệnh có kết quả dương tính) và độ đặc hiệu $90\\%$ (xác suất người không bị bệnh có kết quả âm tính). Gọi $B$ là biến cố người được xét nghiệm mắc bệnh, $+$ là biến cố kết quả dương tính.',
    items: [
      { key: 'a', text: 'Xác suất một người ngẫu nhiên mắc bệnh là $P(B) = 0.01$ và không mắc bệnh là $P(\\overline{B}) = 0.99$.', correct: true, explain: 'Tỷ lệ mắc bệnh $1\\%$ nên $P(B) = 0.01$ và $P(\\overline{B}) = 1 - 0.01 = 0.99$ (ĐÚNG).' },
      { key: 'b', text: 'Xác suất kết quả dương tính khi người đó không mắc bệnh (dương tính giả) là $P(+|\\overline{B}) = 0.10$.', correct: true, explain: 'Độ đặc hiệu $90\\%$ nghĩa là $P(-|\\overline{B}) = 0.90 \\implies P(+|\\overline{B}) = 1 - 0.90 = 0.10$ (ĐÚNG).' },
      { key: 'c', text: 'Xác suất toàn phần để một người ngẫu nhiên nhận kết quả dương tính là $P(+) = 0.1085$.', correct: true, explain: '$P(+) = P(B)P(+|B) + P(\\overline{B})P(+|\\overline{B}) = 0.01 \\cdot 0.95 + 0.99 \\cdot 0.10 = 0.0095 + 0.099 = 0.1085$ (ĐÚNG).' },
      { key: 'd', text: 'Khi một người nhận kết quả dương tính, xác suất người đó thực sự mắc bệnh lớn hơn $50\\%$.', correct: false, explain: 'Theo định lý Bayes: $P(B|+) = \\frac{0.0095}{0.1085} \\approx 8.76\\% < 50\\%$. Đây chính là nghịch lý xét nghiệm bệnh hiếm (SAI).' }
    ]
  },
  {
    id: 'E2_2',
    num: 2,
    statement: 'Một công ty công nghệ có 2 máy chủ A và B xử lý yêu cầu dữ liệu. Máy chủ A xử lý $60\\%$ yêu cầu với tỷ lệ lỗi là $2\\%$. Máy chủ B xử lý $40\\%$ yêu cầu với tỷ lệ lỗi là $1\\%$. Chọn ngẫu nhiên một yêu cầu được xử lý trong hệ thống.',
    items: [
      { key: 'a', text: 'Xác suất yêu cầu được chuyển tới máy chủ A là $P(A) = 0.6$.', correct: true, explain: 'Máy chủ A đảm nhận $60\\%$ lưu lượng nên $P(A) = 0.6$ (ĐÚNG).' },
      { key: 'b', text: 'Xác suất yêu cầu được xử lý bởi máy chủ B và gặp lỗi là $0.004$.', correct: true, explain: '$P(B \\cap \\text{Lỗi}) = P(B) \\cdot P(\\text{Lỗi}|B) = 0.4 \\cdot 0.01 = 0.004$ (ĐÚNG).' },
      { key: 'c', text: 'Tỷ lệ lỗi trung bình toàn hệ thống là $1.6\\%$.', correct: true, explain: '$P(\\text{Lỗi}) = 0.6 \\cdot 0.02 + 0.4 \\cdot 0.01 = 0.012 + 0.004 = 0.016 = 1.6\\%$ (ĐÚNG).' },
      { key: 'd', text: 'Nếu phát hiện một yêu cầu bị lỗi, xác suất lỗi đó xuất phát từ máy chủ A là $75\\%$.', correct: true, explain: '$P(A|\\text{Lỗi}) = \\frac{0.012}{0.016} = \\frac{12}{16} = 0.75 = 75\\%$ (ĐÚNG).' }
    ]
  }
];

const EXAM_PART_3 = [
  {
    id: 'E3_1',
    num: 1,
    question: 'Một học sinh dự thi 2 môn Toán và Tiếng Anh. Xác suất đỗ môn Toán là $0.8$. Nếu đỗ môn Toán thì xác suất đỗ Tiếng Anh là $0.75$. Nếu trượt môn Toán thì xác suất đỗ Tiếng Anh là $0.3$. Tính xác suất để học sinh đó đỗ đúng 1 môn trong 2 môn thi (nhập kết quả dạng số thập phân, ví dụ 0.26).',
    correctAnswer: 0.26,
    tolerance: 0.01,
    unit: '',
    explanation: 'Trường hợp 1: Đỗ Toán và trượt Anh: $P_1 = 0.8 \\cdot (1 - 0.75) = 0.8 \\cdot 0.25 = 0.20$. Trường hợp 2: Trượt Toán và đỗ Anh: $P_2 = (1 - 0.8) \\cdot 0.3 = 0.2 \\cdot 0.3 = 0.06$. Xác suất đỗ đúng 1 môn là $P = 0.20 + 0.06 = 0.26$.'
  },
  {
    id: 'E3_2',
    num: 2,
    question: 'Một lô hàng chứa $70\\%$ linh kiện loại I và $30\\%$ linh kiện loại II. Tỷ lệ hỏng của linh kiện loại I là $2\\%$, của loại II là $5\\%$. Lấy ngẫu nhiên 1 linh kiện thấy nó bị hỏng. Tính xác suất linh kiện này thuộc loại I (làm tròn kết quả đến 2 chữ số thập phân, ví dụ 0.48).',
    correctAnswer: 0.48,
    tolerance: 0.02,
    unit: '',
    explanation: '$P(I) = 0.7$, $P(II) = 0.3$. $P(H|I) = 0.02$, $P(H|II) = 0.05$. Xác suất toàn phần linh kiện bị hỏng: $P(H) = 0.7 \\cdot 0.02 + 0.3 \\cdot 0.05 = 0.014 + 0.015 = 0.029$. Xác suất hỏng do loại I: $P(I|H) = \\frac{0.014}{0.029} \\approx 0.4828 \\approx 0.48$.'
  }
];

export default function Part4ExerciseBank() {
  const [activeSubTab, setActiveSubTab] = useState('practice'); // 'practice' | 'exam'

  /* State luyện tập */
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [showPracticeExp, setShowPracticeExp] = useState({});

  /* State thi thử */
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 phút
  const [isExamRunning, setIsExamRunning] = useState(false);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);

  const [examPart1Answers, setExamPart1Answers] = useState({});
  const [examPart2Answers, setExamPart2Answers] = useState({});
  const [examPart3Answers, setExamPart3Answers] = useState({});

  // Countdown timer
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

  /* Handler luyện tập */
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

  /* Handlers thi thử */
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
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
  };

  /* Tính điểm chuẩn Bộ GD&ĐT */
  const calculateScore = () => {
    let scoreP1 = 0;
    EXAM_PART_1.forEach((q) => {
      if (examPart1Answers[q.id] === q.correct) {
        scoreP1 += 0.25;
      }
    });

    let scoreP2 = 0;
    EXAM_PART_2.forEach((q) => {
      let correctCount = 0;
      q.items.forEach((item) => {
        const key = `${q.id}_${item.key}`;
        if (examPart2Answers[key] === item.correct) {
          correctCount++;
        }
      });
      if (correctCount === 1) scoreP2 += 0.1;
      else if (correctCount === 2) scoreP2 += 0.25;
      else if (correctCount === 3) scoreP2 += 0.5;
      else if (correctCount === 4) scoreP2 += 1.0;
    });

    let scoreP3 = 0;
    EXAM_PART_3.forEach((q) => {
      const userVal = parseFloat(examPart3Answers[q.id]);
      if (!isNaN(userVal) && Math.abs(userVal - q.correctAnswer) <= q.tolerance) {
        scoreP3 += 0.5;
      }
    });

    const rawTotal = scoreP1 + scoreP2 + scoreP3; // Max = 1.0 + 2.0 + 1.0 = 4.0
    const scaledScore = (rawTotal / 4.0) * 10.0;
    return {
      rawTotal: +rawTotal.toFixed(2),
      scaledScore: +scaledScore.toFixed(2),
      scoreP1: +scoreP1.toFixed(2),
      scoreP2: +scoreP2.toFixed(2),
      scoreP3: +scoreP3.toFixed(2)
    };
  };

  const scoreData = isExamSubmitted ? calculateScore() : null;

  return (
    <div className="space-y-6">
      {/* Switcher: Luyện tập vs Luyện thi TN THPT */}
      <div className="flex bg-purple-100/70 p-1.5 rounded-2xl border border-purple-200/80 gap-2 max-w-md">
        <button
          onClick={() => setActiveSubTab('practice')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'practice'
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          1. Luyện Tập SGK
        </button>
        <button
          onClick={() => setActiveSubTab('exam')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'exam'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          2. Luyện Thi TN THPT
        </button>
      </div>

      {/* ========================================================
          SUB-TAB 1: LUYỆN TẬP BÀI TẬP SGK CHƯƠNG VI
          ======================================================== */}
      {activeSubTab === 'practice' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  Bài Tập Trắc Nghiệm Cuối Chương VI (SGK Trang 79 - 80)
                </h4>
                <p className="text-xs text-slate-500">
                  Chọn đáp án để xem kết quả ngay và mở lời giải chi tiết từng bước.
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500">Đã trả lời:</span>
              <span className="text-sm font-bold text-purple-600 ml-1.5 font-mono">
                {Object.keys(practiceAnswers).length} / {PRACTICE_QUESTIONS.length}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {PRACTICE_QUESTIONS.map((q) => {
              const selected = practiceAnswers[q.id];
              const isCorrect = selected === q.correct;
              const isAnswered = !!selected;

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs space-y-4 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                        {q.title}
                      </span>
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                        {q.topic}
                      </span>
                    </div>
                    {isAnswered && (
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                          isCorrect
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-600 border border-red-200'
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Chính xác
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" /> Chưa đúng
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  <div className="text-slate-800 text-sm font-medium leading-relaxed pl-1">
                    <MathView math={q.question} />
                  </div>

                  {/* 4 Lựa chọn */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt) => {
                      const isOptionSelected = selected === opt.key;
                      let btnStyle = 'border-slate-200 hover:border-purple-400 bg-slate-50/50 text-slate-700';

                      if (isAnswered) {
                        if (opt.key === q.correct) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold ring-1 ring-emerald-400';
                        } else if (isOptionSelected && !isCorrect) {
                          btnStyle = 'border-red-400 bg-red-50 text-red-700 font-semibold';
                        } else {
                          btnStyle = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={opt.key}
                          onClick={() => handlePracticeSelect(q.id, opt.key)}
                          className={`p-3 rounded-xl border text-left text-xs flex items-center gap-3 transition-all cursor-pointer ${btnStyle}`}
                        >
                          <span
                            className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                              isOptionSelected
                                ? isCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-red-600 text-white'
                                : 'bg-white border border-slate-200 text-slate-700'
                            }`}
                          >
                            {opt.key}
                          </span>
                          <span className="flex-1">
                            <MathView math={opt.text} />
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Lời giải chi tiết */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => togglePracticeExp(q.id)}
                      className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      {showPracticeExp[q.id] ? 'Ẩn lời giải chi tiết' : 'Xem lời giải chi tiết'}
                      {showPracticeExp[q.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {showPracticeExp[q.id] && (
                      <div className="mt-3 p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 text-xs text-slate-700 leading-relaxed space-y-1">
                        <span className="font-bold text-purple-900 block">Hướng dẫn giải:</span>
                        <MathView math={q.explanation} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 2: LUYỆN THI TN THPT (FORMAT BỘ GD&ĐT 2025)
          ======================================================== */}
      {activeSubTab === 'exam' && (
        <div className="space-y-6">
          {/* Header & Timer Bar */}
          <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 sticky top-4 z-20">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center">
                <Award className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Đề Thi Thử TN THPT 2025 • Chuyên Đề Xác Suất Có Điều Kiện & Bayes
                </h4>
                <p className="text-xs text-slate-500">
                  Cấu trúc chuẩn Bộ GD&ĐT: 4 câu Trắc nghiệm 4 lựa chọn + 2 câu Đúng/Sai + 2 câu Trả lời ngắn.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <Clock className="w-4 h-4 text-purple-600 animate-spin-slow" />
                <span className="text-sm font-mono font-bold text-slate-800">
                  {formatTime(timeLeft)}
                </span>
              </div>

              {!isExamRunning && !isExamSubmitted ? (
                <button
                  onClick={startExam}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                >
                  <Play className="w-4 h-4" /> Bắt đầu làm bài
                </button>
              ) : isExamRunning ? (
                <button
                  onClick={handleSubmitExam}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                >
                  <Send className="w-4 h-4" /> Nộp bài thi
                </button>
              ) : (
                <button
                  onClick={resetExam}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                >
                  <RotateCcw className="w-4 h-4" /> Thi lại từ đầu
                </button>
              )}
            </div>
          </div>

          {/* Result Banner */}
          {isExamSubmitted && scoreData && (
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-purple-700 rounded-2xl p-6 text-white shadow-md space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-emerald-100 block">
                    KẾT QUẢ BÀI THI XÁC SUẤT CỦA BẠN
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-black font-mono">{scoreData.scaledScore}</span>
                    <span className="text-sm font-semibold text-emerald-100">/ 10.0 Điểm</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 text-center text-xs">
                  <div>
                    <span className="text-emerald-100 block text-[11px]">Phần I (Nhiều LC)</span>
                    <span className="font-bold font-mono text-sm">{scoreData.scoreP1} / 1.0</span>
                  </div>
                  <div className="border-x border-white/20 px-2">
                    <span className="text-emerald-100 block text-[11px]">Phần II (Đúng/Sai)</span>
                    <span className="font-bold font-mono text-sm">{scoreData.scoreP2} / 2.0</span>
                  </div>
                  <div>
                    <span className="text-emerald-100 block text-[11px]">Phần III (Trả lời ngắn)</span>
                    <span className="font-bold font-mono text-sm">{scoreData.scoreP3} / 1.0</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 p-3 rounded-xl border border-white/20 text-xs leading-relaxed flex items-center justify-between">
                <span>
                  {scoreData.scaledScore >= 8.5
                    ? '🎉 Xuất sắc! Bạn đã làm chủ hoàn toàn các dạng bài xác suất có điều kiện và định lý Bayes.'
                    : scoreData.scaledScore >= 6.5
                    ? '👍 Khá tốt! Bạn đã nắm chắc công thức cơ bản, chú ý rèn thêm kỹ năng lập sơ đồ cây để tránh nhầm lẫn.'
                    : '💡 Hãy rà soát lại phương pháp giải chi tiết bên dưới để bổ sung kiến thức xác suất nhé.'}
                </span>
                <span className="font-bold underline cursor-pointer" onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}>
                  Xem chi tiết từng câu ↓
                </span>
              </div>
            </div>
          )}

          {/* PHẦN I */}
          <div className="space-y-4">
            <div className="border-l-4 border-purple-600 pl-3">
              <h4 className="font-bold text-slate-800 text-sm">
                PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN
              </h4>
              <p className="text-xs text-slate-500">
                Thí sinh trả lời từ câu 1 đến câu 4. Mỗi câu hỏi chỉ chọn một phương án (0.25 điểm / câu).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EXAM_PART_1.map((q) => {
                const userChoice = examPart1Answers[q.id];
                const isCorrect = userChoice === q.correct;

                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-2xl p-4 border border-purple-100 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                        Câu {q.num}
                      </span>
                      {isExamSubmitted && (
                        <span
                          className={`text-xs font-bold flex items-center gap-1 ${
                            isCorrect ? 'text-emerald-600' : 'text-red-500'
                          }`}
                        >
                          {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {isCorrect ? 'Đúng (+0.25đ)' : 'Sai (0đ)'}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-800 font-medium">
                      <MathView math={q.question} />
                    </div>

                    <div className="grid grid-cols-1 gap-1.5">
                      {q.options.map((opt) => {
                        const isChosen = userChoice === opt.key;
                        let optStyle = 'border-slate-200 hover:border-purple-300 bg-slate-50/50 text-slate-700';

                        if (isExamSubmitted) {
                          if (opt.key === q.correct) {
                            optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold';
                          } else if (isChosen && !isCorrect) {
                            optStyle = 'border-red-400 bg-red-50 text-red-700';
                          } else {
                            optStyle = 'border-slate-100 text-slate-400 opacity-60';
                          }
                        } else if (isChosen) {
                          optStyle = 'border-purple-600 bg-purple-50 text-purple-800 font-bold ring-1 ring-purple-500';
                        }

                        return (
                          <button
                            key={opt.key}
                            disabled={!isExamRunning && !isExamSubmitted}
                            onClick={() =>
                              setExamPart1Answers({ ...examPart1Answers, [q.id]: opt.key })
                            }
                            className={`p-2.5 rounded-xl border text-left text-xs flex items-center gap-2.5 transition-all cursor-pointer ${optStyle}`}
                          >
                            <span
                              className={`w-5 h-5 rounded text-xs font-bold flex items-center justify-center shrink-0 ${
                                isChosen ? 'bg-purple-600 text-white' : 'bg-white border text-slate-700'
                              }`}
                            >
                              {opt.key}
                            </span>
                            <span className="flex-1">
                              <MathView math={opt.text} />
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {isExamSubmitted && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                        <span className="font-bold text-slate-700 block">Lời giải:</span>
                        <MathView math={q.explanation} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* PHẦN II */}
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-600 pl-3">
              <h4 className="font-bold text-slate-800 text-sm">
                PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG / SAI (ĐỊNH DẠNG MỚI BỘ GD&ĐT)
              </h4>
              <p className="text-xs text-slate-500">
                Thí sinh trả lời câu 1 và câu 2. Trong mỗi ý a), b), c), d), chọn Đúng hoặc Sai.
                <br />
                (Quy tắc tính điểm Bộ: Đúng 1 ý = 0.1đ; Đúng 2 ý = 0.25đ; Đúng 3 ý = 0.5đ; Đúng 4 ý = 1.0đ / câu).
              </p>
            </div>

            <div className="space-y-4">
              {EXAM_PART_2.map((q) => {
                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-xs space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                        Câu {q.num}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">
                        <MathView math={q.statement} />
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {q.items.map((item) => {
                        const ansKey = `${q.id}_${item.key}`;
                        const userVal = examPart2Answers[ansKey];
                        const isCorrect = userVal === item.correct;

                        return (
                          <div
                            key={item.key}
                            className={`p-3 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition-all ${
                              isExamSubmitted
                                ? isCorrect
                                  ? 'bg-emerald-50/50 border-emerald-200'
                                  : 'bg-red-50/50 border-red-200'
                                : 'bg-slate-50/60 border-slate-200'
                            }`}
                          >
                            <div className="flex items-start gap-2.5 flex-1">
                              <span className="font-bold text-slate-700 shrink-0">
                                {item.key})
                              </span>
                              <div className="text-slate-800 leading-relaxed">
                                <MathView math={item.text} />
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                              <button
                                disabled={!isExamRunning && !isExamSubmitted}
                                onClick={() =>
                                  setExamPart2Answers({ ...examPart2Answers, [ansKey]: true })
                                }
                                className={`px-3 py-1.5 rounded-lg font-bold text-xs border cursor-pointer transition-all ${
                                  userVal === true
                                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                                }`}
                              >
                                Đúng
                              </button>
                              <button
                                disabled={!isExamRunning && !isExamSubmitted}
                                onClick={() =>
                                  setExamPart2Answers({ ...examPart2Answers, [ansKey]: false })
                                }
                                className={`px-3 py-1.5 rounded-lg font-bold text-xs border cursor-pointer transition-all ${
                                  userVal === false
                                    ? 'bg-red-600 text-white border-red-600 shadow-xs'
                                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                                }`}
                              >
                                Sai
                              </button>

                              {isExamSubmitted && (
                                <span className="ml-2 font-bold text-xs">
                                  {item.correct ? (
                                    <span className="text-emerald-700 font-semibold">[Đáp án: ĐÚNG]</span>
                                  ) : (
                                    <span className="text-red-600 font-semibold">[Đáp án: SAI]</span>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {isExamSubmitted && (
                      <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-200 text-xs text-slate-700 space-y-1.5">
                        <span className="font-bold text-indigo-900 block">Lời giải chi tiết câu {q.num}:</span>
                        {q.items.map((item) => (
                          <div key={item.key} className="pl-2 border-l-2 border-indigo-300">
                            <strong>Ý {item.key}):</strong> <MathView math={item.explain} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* PHẦN III */}
          <div className="space-y-4">
            <div className="border-l-4 border-amber-500 pl-3">
              <h4 className="font-bold text-slate-800 text-sm">
                PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (XÁC SUẤT THỰC TIỄN)
              </h4>
              <p className="text-xs text-slate-500">
                Thí sinh giải và điền đáp số thập phân vào ô trống (0.5 điểm / câu).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EXAM_PART_3.map((q) => {
                const userVal = examPart3Answers[q.id] || '';
                const parsed = parseFloat(userVal);
                const isCorrect = !isNaN(parsed) && Math.abs(parsed - q.correctAnswer) <= q.tolerance;

                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-2xl p-5 border border-amber-100 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                        Câu {q.num}
                      </span>
                      {isExamSubmitted && (
                        <span
                          className={`text-xs font-bold flex items-center gap-1 ${
                            isCorrect ? 'text-emerald-600' : 'text-red-500'
                          }`}
                        >
                          {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {isCorrect ? 'Chính xác (+0.5đ)' : `Sai (0đ) • Đáp án: ${q.correctAnswer}`}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-800 font-medium leading-relaxed">
                      <MathView math={q.question} />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-xs font-bold text-slate-600">Đáp số:</span>
                      <input
                        type="number"
                        step="any"
                        disabled={!isExamRunning && !isExamSubmitted}
                        value={userVal}
                        onChange={(e) =>
                          setExamPart3Answers({ ...examPart3Answers, [q.id]: e.target.value })
                        }
                        placeholder="Nhập số (vd: 0.26)..."
                        className="w-44 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    {isExamSubmitted && (
                      <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-slate-700 space-y-1">
                        <span className="font-bold text-amber-900 block">Hướng dẫn giải:</span>
                        <MathView math={q.explanation} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
