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
  ArrowRight,
  TrendingUp,
  Target
} from 'lucide-react';

/* ============================================================
   1. BÀI TẬP SGK TOÁN 12 KẾT NỐI TRI THỨC (CHƯƠNG I - TRANG 42, 43)
   ============================================================ */
const PRACTICE_QUESTIONS = [
  {
    id: '1.30',
    title: 'Câu 1.30 (SGK Trang 42)',
    topic: 'Định lý tính đơn điệu của hàm số',
    question: 'Cho hàm số $y = f(x)$ có đạo hàm trên khoảng $(a; b)$. Phát biểu nào sau đây là đúng?',
    options: [
      { key: 'A', text: 'Nếu $f\'(x) \\ge 0$ với mọi $x \\in (a; b)$ thì hàm số $y = f(x)$ đồng biến trên $(a; b)$.' },
      { key: 'B', text: 'Nếu $f\'(x) > 0$ với mọi $x \\in (a; b)$ thì hàm số $y = f(x)$ đồng biến trên $(a; b)$.' },
      { key: 'C', text: 'Hàm số $y = f(x)$ đồng biến trên $(a; b)$ khi và chỉ khi $f\'(x) \\ge 0$ với mọi $x \\in (a; b)$.' },
      { key: 'D', text: 'Hàm số $y = f(x)$ đồng biến trên $(a; b)$ khi và chỉ khi $f\'(x) > 0$ với mọi $x \\in (a; b)$.' }
    ],
    correct: 'B',
    explanation: 'Theo định lý thuận trong SGK: Nếu $f\'(x) > 0$ với mọi $x \\in (a; b)$ thì hàm số đồng biến trên khoảng $(a; b)$. Khẳng định A sai vì hàm hằng $f(x) = C$ có đạo hàm bằng 0 trên khoảng nhưng không đồng biến. C và D sai vì chiều đảo yêu cầu $f\'(x) = 0$ chỉ tại hữu hạn điểm.'
  },
  {
    id: '1.31',
    title: 'Câu 1.31 (SGK Trang 42)',
    topic: 'Tính nghịch biến trên R',
    question: 'Hàm số nào sau đây nghịch biến trên $\\mathbb{R}$?',
    options: [
      { key: 'A', text: '$y = -x^3 + 3x^2 - 9x$' },
      { key: 'B', text: '$y = -x^3 + x + 1$' },
      { key: 'C', text: '$y = \\frac{x - 1}{x - 2}$' },
      { key: 'D', text: '$y = 2x^2 + 3x + 2$' }
    ],
    correct: 'A',
    explanation: 'Xét $y = -x^3 + 3x^2 - 9x$. Đạo hàm $y\' = -3x^2 + 6x - 9 = -3(x^2 - 2x + 3) = -3[(x - 1)^2 + 2] < 0$ với mọi $x \\in \\mathbb{R}$. Do đó hàm số luôn nghịch biến trên $\\mathbb{R}$.'
  },
  {
    id: '1.32',
    title: 'Câu 1.32 (SGK Trang 42)',
    topic: 'Cực trị của hàm số',
    question: 'Hàm số nào dưới đây không có cực trị?',
    options: [
      { key: 'A', text: '$y = |x|$' },
      { key: 'B', text: '$y = x^4$' },
      { key: 'C', text: '$y = -x^3 + x$' },
      { key: 'D', text: '$y = \\frac{2x - 1}{x + 1}$' }
    ],
    correct: 'D',
    explanation: 'Hàm phân thức bậc nhất / bậc nhất $y = \\frac{2x - 1}{x + 1}$ có đạo hàm $y\' = \\frac{2(1) - (-1)(1)}{(x + 1)^2} = \\frac{3}{(x + 1)^2} > 0$ với mọi $x \\neq -1$. Hàm số luôn đồng biến trên từng khoảng xác định nên không có cực trị.'
  },
  {
    id: '1.33',
    title: 'Câu 1.33 (SGK Trang 42)',
    topic: 'Giá trị cực tiểu của hàm số',
    question: 'Giá trị cực tiểu của hàm số $y = x^2 \\ln x$ là:',
    options: [
      { key: 'A', text: '$-\\frac{1}{e}$' },
      { key: 'B', text: '$-\\frac{1}{e^2}$' },
      { key: 'C', text: '$-\\frac{1}{2e}$' },
      { key: 'D', text: '$\\frac{1}{2e}$' }
    ],
    correct: 'C',
    explanation: 'Tập xác định: $D = (0; +\\infty)$. Ta có đạo hàm $y\' = 2x \\ln x + x^2 \\cdot \\frac{1}{x} = x(2\\ln x + 1)$. Với $x > 0$, $y\' = 0 \\iff 2\\ln x + 1 = 0 \\iff \\ln x = -\\frac{1}{2} \\iff x = e^{-1/2}$. Đạo hàm đổi dấu từ âm sang dương khi qua $x = e^{-1/2}$, nên giá trị cực tiểu là $y_{CT} = (e^{-1/2})^2 \\ln(e^{-1/2}) = e^{-1} \\cdot \\left(-\\frac{1}{2}\\right) = -\\frac{1}{2e}$.'
  },
  {
    id: '1.34',
    title: 'Câu 1.34 (SGK Trang 42)',
    topic: 'Giá trị lớn nhất trên đoạn',
    question: 'Giá trị lớn nhất của hàm số $y = (x - 2)^2 \\cdot e^x$ trên đoạn $[1; 3]$ là:',
    options: [
      { key: 'A', text: '$0$' },
      { key: 'B', text: '$e^3$' },
      { key: 'C', text: '$e^4$' },
      { key: 'D', text: '$e$' }
    ],
    correct: 'B',
    explanation: 'Ta có $y\' = 2(x - 2)e^x + (x - 2)^2 e^x = (x - 2)e^x(2 + x - 2) = x(x - 2)e^x$. Trên $[1; 3]$, $y\' = 0 \\iff x = 2$. Tính các giá trị: $y(1) = (1 - 2)^2 e^1 = e$; $y(2) = 0$; $y(3) = (3 - 2)^2 e^3 = e^3$. So sánh thấy $e^3 > e > 0$, do đó $\\max_{[1; 3]} y = e^3$.'
  },
  {
    id: '1.35',
    title: 'Câu 1.35 (SGK Trang 42)',
    topic: 'Khái niệm đường tiệm cận',
    question: 'Cho hàm số $y = f(x)$ thoả mãn: $\\lim_{x \\to 2^+} f(x) = 1$, $\\lim_{x \\to 2^-} f(x) = 1$, $\\lim_{x \\to -\\infty} f(x) = 2$ và $\\lim_{x \\to +\\infty} f(x) = 2$. Khẳng định nào sau đây là đúng?',
    options: [
      { key: 'A', text: 'Đường thẳng $x = 2$ là tiệm cận đứng của đồ thị hàm số.' },
      { key: 'B', text: 'Đường thẳng $y = 2$ là tiệm cận ngang của đồ thị hàm số.' },
      { key: 'C', text: 'Đường thẳng $y = 1$ là tiệm cận ngang của đồ thị hàm số.' },
      { key: 'D', text: 'Đường thẳng $x = 2$ là tiệm cận ngang của đồ thị hàm số.' }
    ],
    correct: 'B',
    explanation: 'Theo định nghĩa, vì $\\lim_{x \\to +\\infty} f(x) = 2$ (hoặc $\\lim_{x \\to -\\infty} f(x) = 2$) nên đường thẳng $y = 2$ là tiệm cận ngang của đồ thị hàm số. Tại $x = 2$, giới hạn hai phía đều hữu hạn bằng 1 nên $x = 2$ không phải tiệm cận đứng.'
  },
  {
    id: '1.36',
    title: 'Câu 1.36 (SGK Trang 42)',
    topic: 'Tiệm cận xiên (GDPT 2018)',
    question: 'Tiệm cận xiên của đồ thị hàm số $y = \\frac{x^2 + 2x - 2}{x + 2}$ là:',
    options: [
      { key: 'A', text: '$y = -2$' },
      { key: 'B', text: '$y = 1$' },
      { key: 'C', text: '$y = x + 2$' },
      { key: 'D', text: '$y = x$' }
    ],
    correct: 'D',
    explanation: 'Thực hiện phép chia đa thức: $\\frac{x^2 + 2x - 2}{x + 2} = \\frac{x(x + 2) - 2}{x + 2} = x - \\frac{2}{x + 2}$. Vì $\\lim_{x \\to \\pm\\infty} [y - x] = \\lim_{x \\to \\pm\\infty} \\left(-\\frac{2}{x + 2}\\right) = 0$, nên đường thẳng $y = x$ là tiệm cận xiên của đồ thị hàm số.'
  },
  {
    id: '1.37',
    title: 'Câu 1.37 (SGK Trang 43)',
    topic: 'Nhận biết tiệm cận từ bảng biến thiên',
    question: 'Cho hàm số $y = f(x)$ xác định trên $\\mathbb{R} \\setminus \\{1; 3\\}$, liên tục trên mỗi khoảng xác định và có: $\\lim_{x \\to -\\infty} f(x) = 1$, $\\lim_{x \\to 1^-} f(x) = -1$, $\\lim_{x \\to 1^+} f(x) = 7$, $\\lim_{x \\to 3^-} f(x) = +\\infty$, $\\lim_{x \\to +\\infty} f(x) = -1$. Khẳng định nào sau đây là SAI?',
    options: [
      { key: 'A', text: 'Đường thẳng $y = 1$ là tiệm cận ngang của đồ thị hàm số.' },
      { key: 'B', text: 'Đường thẳng $y = -1$ là tiệm cận ngang của đồ thị hàm số.' },
      { key: 'C', text: 'Đường thẳng $x = 3$ là tiệm cận đứng của đồ thị hàm số.' },
      { key: 'D', text: 'Đường thẳng $x = 1$ là tiệm cận đứng của đồ thị hàm số.' }
    ],
    correct: 'D',
    explanation: 'Tại $x = 1$, giới hạn bên trái là $-1$ và giới hạn bên phải là $7$, cả hai đều là các giá trị hữu hạn (không tiến ra vô cực $\\pm\\infty$). Do đó đường thẳng $x = 1$ KHÔNG phải là tiệm cận đứng. Vì vậy khẳng định D là SAI.'
  },
  {
    id: '1.38',
    title: 'Câu 1.38 (SGK Trang 43)',
    topic: 'Nhận dạng đồ thị hàm phân thức bậc 1/1',
    question: 'Đồ thị có tiệm cận đứng $x = -1$, tiệm cận ngang $y = 2$ và cắt trục tung tại điểm $(0; 1)$ là đồ thị của hàm số nào dưới đây?',
    options: [
      { key: 'A', text: '$y = \\frac{x + 2}{x + 1}$' },
      { key: 'B', text: '$y = \\frac{2x + 1}{x + 1}$' },
      { key: 'C', text: '$y = \\frac{x - 1}{x + 1}$' },
      { key: 'D', text: '$y = \\frac{x + 3}{1 - x}$' }
    ],
    correct: 'B',
    explanation: 'Đồ thị có tiệm cận đứng $x = -1$, tiệm cận ngang $y = 2$. Xét hàm số $y = \\frac{2x + 1}{x + 1}$: Tiệm cận đứng $x = -1$, tiệm cận ngang $y = \\frac{2}{1} = 2$. Giao điểm với trục tung $Oy$ ($x = 0$): $y = \\frac{2(0) + 1}{0 + 1} = 1$. Đúng hoàn toàn với đồ thị.'
  },
  {
    id: '1.39',
    title: 'Câu 1.39 (SGK Trang 43)',
    topic: 'Nhận dạng đồ thị hàm phân thức bậc 2/1',
    question: 'Đồ thị có tiệm cận đứng $x = -1$, tiệm cận xiên $y = x$ và cắt trục tung tại điểm $(0; 1)$ là đồ thị của hàm số nào?',
    options: [
      { key: 'A', text: '$y = x - \\frac{1}{x + 1}$' },
      { key: 'B', text: '$y = \\frac{2x + 1}{x + 1}$' },
      { key: 'C', text: '$y = \\frac{x^2 - x + 1}{x + 1}$' },
      { key: 'D', text: '$y = \\frac{x^2 + x + 1}{x + 1}$' }
    ],
    correct: 'D',
    explanation: 'Ta phân tích $y = \\frac{x^2 + x + 1}{x + 1} = \\frac{x(x + 1) + 1}{x + 1} = x + \\frac{1}{x + 1}$. Đồ thị có tiệm cận đứng $x = -1$, tiệm cận xiên $y = x$. Cắt trục tung tại điểm có $x = 0 \\implies y = 1$. Đáp án đúng là D.'
  }
];

/* ============================================================
   2. DỮ LIỆU ĐỀ THI TN THPT (MÔ PHỎNG FORMAT MỚI BỘ GD&ĐT)
   ============================================================ */
// PHẦN I: Trắc nghiệm 4 lựa chọn (4 câu)
const EXAM_PART_1 = [
  {
    id: 'E1_1',
    num: 1,
    question: 'Cho hàm số $y = x^3 - 3x^2 + 2$. Khoảng đồng biến của hàm số là:',
    options: [
      { key: 'A', text: '$(0; 2)$' },
      { key: 'B', text: '$(-\\infty; 0)$ và $(2; +\\infty)$' },
      { key: 'C', text: '$(-\\infty; 2)$' },
      { key: 'D', text: '$(0; +\\infty)$' }
    ],
    correct: 'B',
    explanation: 'Đạo hàm $y\' = 3x^2 - 6x = 3x(x - 2)$. Ta có $y\' > 0 \\iff x < 0$ hoặc $x > 2$. Do đó hàm số đồng biến trên các khoảng $(-\\infty; 0)$ và $(2; +\\infty)$.'
  },
  {
    id: 'E1_2',
    num: 2,
    question: 'Tọa độ điểm cực đại của đồ thị hàm số $y = -x^3 + 3x + 2$ là:',
    options: [
      { key: 'A', text: '$(1; 4)$' },
      { key: 'B', text: '$(-1; 0)$' },
      { key: 'C', text: '$(1; 2)$' },
      { key: 'D', text: '$(4; 1)$' }
    ],
    correct: 'A',
    explanation: 'Đạo hàm $y\' = -3x^2 + 3 = 0 \\iff x = \\pm 1$. Bảng xét dấu: $y\'$ đổi dấu từ $+$ sang $-$ khi qua $x = 1$, do đó điểm cực đại là $x = 1$. Thay vào hàm số: $y(1) = -1 + 3 + 2 = 4$. Tọa độ điểm cực đại là $(1; 4)$.'
  },
  {
    id: 'E1_3',
    num: 3,
    question: 'Giá trị nhỏ nhất của hàm số $y = x + \\frac{4}{x}$ trên khoảng $(0; +\\infty)$ bằng:',
    options: [
      { key: 'A', text: '$2$' },
      { key: 'B', text: '$4$' },
      { key: 'C', text: '$5$' },
      { key: 'D', text: '$\\frac{5}{2}$' }
    ],
    correct: 'B',
    explanation: 'Áp dụng bất đẳng thức Cauchy cho hai số dương $x$ và $\\frac{4}{x}$: $y = x + \\frac{4}{x} \\ge 2\\sqrt{x \\cdot \\frac{4}{x}} = 4$. Dấu bằng xảy ra khi $x = \\frac{4}{x} \\iff x = 2 > 0$. Vậy giá trị nhỏ nhất bằng 4.'
  },
  {
    id: 'E1_4',
    num: 4,
    question: 'Phương trình đường tiệm cận xiên của đồ thị hàm số $y = \\frac{2x^2 - 3x + 3}{x - 1}$ là:',
    options: [
      { key: 'A', text: '$y = 2x - 1$' },
      { key: 'B', text: '$y = 2x + 1$' },
      { key: 'C', text: '$y = 2x$' },
      { key: 'D', text: '$y = x - 1$' }
    ],
    correct: 'A',
    explanation: 'Thực hiện phép chia: $\\frac{2x^2 - 3x + 3}{x - 1} = 2x - 1 + \\frac{2}{x - 1}$. Do $\\lim_{x \\to \\pm\\infty} \\frac{2}{x - 1} = 0$ nên tiệm cận xiên là $y = 2x - 1$.'
  }
];

// PHẦN II: Trắc nghiệm Đúng / Sai (2 câu x 4 ý)
const EXAM_PART_2 = [
  {
    id: 'E2_1',
    num: 1,
    statement: 'Cho hàm số $y = f(x) = \\frac{2x - 1}{x + 1}$ có đồ thị là $(C)$.',
    items: [
      { key: 'a', text: 'Tập xác định của hàm số là $D = \\mathbb{R} \\setminus \\{-1\\}$.', correct: true, explain: 'Mẫu số $x + 1 \\neq 0 \\iff x \\neq -1$ nên tập xác định là $\\mathbb{R} \\setminus \\{-1\\}$ (ĐÚNG).' },
      { key: 'b', text: 'Đạo hàm $f\'(x) = \\frac{3}{(x + 1)^2} > 0, \\forall x \\neq -1$.', correct: true, explain: 'Đạo hàm $f\'(x) = \\frac{2(1) - (-1)(1)}{(x+1)^2} = \\frac{3}{(x+1)^2} > 0$ với mọi $x \\neq -1$ (ĐÚNG).' },
      { key: 'c', text: 'Đồ thị $(C)$ nhận điểm $I(1; 2)$ làm tâm đối xứng.', correct: false, explain: 'Tiệm cận đứng là $x = -1$, tiệm cận ngang là $y = 2$. Giao điểm 2 tiệm cận là $I(-1; 2)$, không phải $(1; 2)$ (SAI).' },
      { key: 'd', text: 'Tiếp tuyến của đồ thị $(C)$ tại giao điểm với trục tung có phương trình $y = 3x - 1$.', correct: true, explain: 'Giao điểm với trục tung là $M(0; -1)$. Hệ số góc tiếp tuyến $k = f\'(0) = 3$. Phương trình tiếp tuyến: $y = 3(x - 0) + (-1) = 3x - 1$ (ĐÚNG).' }
    ]
  },
  {
    id: 'E2_2',
    num: 2,
    statement: 'Một xưởng sản xuất thùng chứa hàng bằng tôn không có nắp dạng hình hộp chữ nhật có thể tích $V = 32\\text{ m}^3$, đáy là hình vuông cạnh $x\\text{ (m)}$ và chiều cao $h\\text{ (m)}$.',
    items: [
      { key: 'a', text: 'Chiều cao của thùng biểu diễn theo cạnh đáy là $h = \\frac{32}{x^2}\\text{ (m)}$.', correct: true, explain: 'Thể tích $V = x^2 \\cdot h = 32 \\implies h = \\frac{32}{x^2}$ (ĐÚNG).' },
      { key: 'b', text: 'Tổng diện tích tôn cần dùng làm thùng (bỏ qua mép hàn) là $S(x) = x^2 + \\frac{128}{x}\\text{ (m}^2\\text{)}$.', correct: true, explain: 'Hộp không nắp có 1 đáy và 4 mặt bên: $S(x) = x^2 + 4xh = x^2 + 4x \\cdot \\frac{32}{x^2} = x^2 + \\frac{128}{x}$ (ĐÚNG).' },
      { key: 'c', text: 'Đạo hàm của hàm diện tích tôn là $S\'(x) = 2x - \\frac{128}{x^2}$.', correct: true, explain: '$S\'(x) = (x^2)\' + (128x^{-1})\' = 2x - \\frac{128}{x^2}$ (ĐÚNG).' },
      { key: 'd', text: 'Để tiết kiệm nguyên liệu tôn nhất thì kích thước cạnh đáy hộp phải bằng $x = 2\\text{ m}$.', correct: false, explain: '$S\'(x) = 0 \\iff 2x = \\frac{128}{x^2} \\iff x^3 = 64 \\iff x = 4\\text{ m}$. Cạnh đáy tối ưu phải là $4\\text{ m}$, không phải $2\\text{ m}$ (SAI).' }
    ]
  }
];

// PHẦN III: Trắc nghiệm Trả lời ngắn (2 câu)
const EXAM_PART_3 = [
  {
    id: 'E3_1',
    num: 1,
    question: 'Một mảnh đất hình chữ nhật có diện tích $900\\text{ m}^2$. Để chi phí xây hàng rào bao quanh mảnh đất là nhỏ nhất thì chu vi mảnh đất phải đạt giá trị nhỏ nhất. Chiều dài một cạnh của mảnh đất khi đó bằng bao nhiêu mét?',
    correctAnswer: 30,
    tolerance: 0.1,
    unit: 'm',
    explanation: 'Gọi hai kích thước là $x$ và $y$ ($x, y > 0$). Diện tích $xy = 900 \\implies y = \\frac{900}{x}$. Chu vi $P(x) = 2(x + y) = 2\\left(x + \\frac{900}{x}\\right) \\ge 2 \\cdot 2\\sqrt{x \\cdot \\frac{900}{x}} = 120\\text{ m}$. Dấu bằng xảy ra khi $x = y = \\sqrt{900} = 30\\text{ m}$.'
  },
  {
    id: 'E3_2',
    num: 2,
    question: 'Một doanh nghiệp ước tính tổng lợi nhuận thu được khi sản xuất và bán $x$ sản phẩm ($0 \\le x \\le 100$) được cho bởi hàm số $P(x) = -x^3 + 90x^2 + 2100x - 5000$ (nghìn đồng). Doanh nghiệp cần sản xuất bao nhiêu sản phẩm để đạt lợi nhuận tối đa?',
    correctAnswer: 70,
    tolerance: 0.1,
    unit: 'sản phẩm',
    explanation: 'Xét $P\'(x) = -3x^2 + 180x + 2100$. Cho $P\'(x) = 0 \\iff -3(x^2 - 60x - 700) = 0 \\iff (x - 70)(x + 10) = 0$. Vì $x \\in [0; 100]$, ta nhận nghiệm duy nhất $x = 70$. Đạo hàm đổi dấu từ $+$ sang $-$ khi qua $x = 70$, do đó lợi nhuận đạt cực đại khi sản xuất 70 sản phẩm.'
  }
];

export default function Part2ExerciseBank() {
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

  /* Tính điểm thi thử theo thang điểm 10 chuẩn Bộ GD&ĐT */
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
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-sky-700 to-indigo-800 text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-sky-100 inline-flex items-center gap-1.5 border border-white/20">
            <Award className="w-3.5 h-3.5" />
            CHƯƠNG I: KHẢO SÁT HÀM SỐ • GDPT 2018
          </span>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight">
            Ngân Hàng Câu Hỏi Luyện Tập & Phòng Thi Thử Trực Tuyến
          </h3>
          <p className="text-sky-100 text-xs md:text-sm leading-relaxed">
            Hệ thống hóa toàn bộ các câu hỏi trắc nghiệm SGK Toán 12 Tập 1 (Trang 42 - 43) và bài thi chuẩn cấu trúc định dạng đề thi Tốt nghiệp THPT mới nhất của Bộ GD&ĐT.
          </p>
        </div>
      </div>

      {/* Switcher: Luyện tập vs Luyện thi TN THPT */}
      <div className="flex bg-sky-100/70 p-1.5 rounded-2xl border border-sky-200/80 gap-2 max-w-md">
        <button
          onClick={() => setActiveSubTab('practice')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'practice'
              ? 'bg-white text-blue-700 shadow-sm'
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
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          2. Luyện Thi TN THPT
        </button>
      </div>

      {/* ========================================================
          SUB-TAB 1: LUYỆN TẬP BÀI TẬP SGK
          ======================================================== */}
      {activeSubTab === 'practice' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  10 Câu Trắc Nghiệm Bài Tập Cuối Chương I (SGK Trang 42 - 43)
                </h4>
                <p className="text-xs text-slate-500">
                  Chọn phương án để kiểm tra kết quả ngay lập tức và xem lời giải chi tiết.
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500">Đã trả lời:</span>
              <span className="text-sm font-bold text-blue-600 ml-1.5 font-mono">
                {Object.keys(practiceAnswers).length} / {PRACTICE_QUESTIONS.length}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {PRACTICE_QUESTIONS.map((q, idx) => {
              const selected = practiceAnswers[q.id];
              const isCorrect = selected === q.correct;
              const isAnswered = !!selected;

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs space-y-4 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
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

                  {/* Danh sách 4 lựa chọn */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt) => {
                      const isOptionSelected = selected === opt.key;
                      let btnStyle = 'border-slate-200 hover:border-blue-400 bg-slate-50/50 text-slate-700';

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
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      {showPracticeExp[q.id] ? 'Ẩn lời giải chi tiết' : 'Xem lời giải chi tiết'}
                      {showPracticeExp[q.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {showPracticeExp[q.id] && (
                      <div className="mt-3 p-3.5 rounded-xl bg-sky-50/60 border border-sky-100 text-xs text-slate-700 leading-relaxed space-y-1">
                        <span className="font-bold text-sky-800 block">Hướng dẫn giải:</span>
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
          {/* Exam Header & Timer Bar */}
          <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 sticky top-4 z-20">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                <Award className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Đề Thi Thử Tốt Nghiệp THPT 2025 • Chuyên Đề Khảo Sát Hàm Số
                </h4>
                <p className="text-xs text-slate-500">
                  Cấu trúc mới: 4 câu Trắc nghiệm 4 lựa chọn + 2 câu Đúng/Sai (8 ý) + 2 câu Trả lời ngắn.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <Clock className="w-4 h-4 text-blue-600 animate-spin-slow" />
                <span className="text-sm font-mono font-bold text-slate-800">
                  {formatTime(timeLeft)}
                </span>
              </div>

              {!isExamRunning && !isExamSubmitted ? (
                <button
                  onClick={startExam}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
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

          {/* Exam Result Banner when submitted */}
          {isExamSubmitted && scoreData && (
            <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-sky-600 rounded-2xl p-6 text-white shadow-md space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-emerald-100 block">
                    KẾT QUẢ BÀI THI CỦA BẠN
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
                    ? '🎉 Xuất sắc! Bạn đã nắm rất vững kiến thức và kỹ năng khảo sát hàm số theo chuẩn GDPT 2018.'
                    : scoreData.scaledScore >= 6.5
                    ? '👍 Khá tốt! Bạn đã giải quyết được phần lớn câu hỏi, hãy rà soát kỹ các bẫy ở câu Đúng/Sai nhé.'
                    : '💡 Cố gắng lên! Hãy xem lại các bước giải chi tiết bên dưới để bổ sung kiến thức còn thiếu.'}
                </span>
                <span className="font-bold underline cursor-pointer" onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}>
                  Xem chi tiết từng câu ↓
                </span>
              </div>
            </div>
          )}

          {/* ====================================================
              PHẦN I: TRẮC NGHIỆM 4 LỰA CHỌN
              ==================================================== */}
          <div className="space-y-4">
            <div className="border-l-4 border-blue-600 pl-3">
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
                    className="bg-white rounded-2xl p-4 border border-sky-100 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
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
                        let optStyle = 'border-slate-200 hover:border-blue-300 bg-slate-50/50 text-slate-700';

                        if (isExamSubmitted) {
                          if (opt.key === q.correct) {
                            optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold';
                          } else if (isChosen && !isCorrect) {
                            optStyle = 'border-red-400 bg-red-50 text-red-700';
                          } else {
                            optStyle = 'border-slate-100 text-slate-400 opacity-60';
                          }
                        } else if (isChosen) {
                          optStyle = 'border-blue-600 bg-blue-50 text-blue-800 font-bold ring-1 ring-blue-500';
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
                                isChosen ? 'bg-blue-600 text-white' : 'bg-white border text-slate-700'
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

          {/* ====================================================
              PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI
              ==================================================== */}
          <div className="space-y-4">
            <div className="border-l-4 border-purple-600 pl-3">
              <h4 className="font-bold text-slate-800 text-sm">
                PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG / SAI (ĐỊNH DẠNG MỚI BỘ GD&ĐT)
              </h4>
              <p className="text-xs text-slate-500">
                Thí sinh trả lời từ câu 1 đến câu 2. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn Đúng hoặc Sai.
                <br />
                (Quy tắc tính điểm Bộ: Đúng 1 ý = 0.1đ; Đúng 2 ý = 0.25đ; Đúng 3 ý = 0.5đ; Đúng 4 ý = 1.0đ / câu).
              </p>
            </div>

            <div className="space-y-4">
              {EXAM_PART_2.map((q) => {
                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                        Câu {q.num}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">
                        <MathView math={q.statement} />
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {q.items.map((item) => {
                        const ansKey = `${q.id}_${item.key}`;
                        const userVal = examPart2Answers[ansKey]; // true | false | undefined
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
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
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
                      <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200 text-xs text-slate-700 space-y-1.5">
                        <span className="font-bold text-purple-900 block">Lời giải chi tiết câu {q.num}:</span>
                        {q.items.map((item) => (
                          <div key={item.key} className="pl-2 border-l-2 border-purple-300">
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

          {/* ====================================================
              PHẦN III: TRẮC NGHIỆM TRẢ LỜI NGẮN
              ==================================================== */}
          <div className="space-y-4">
            <div className="border-l-4 border-amber-500 pl-3">
              <h4 className="font-bold text-slate-800 text-sm">
                PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (TOÁN THỰC TẾ STEM)
              </h4>
              <p className="text-xs text-slate-500">
                Thí sinh giải và nhập đáp số cuối cùng (số nguyên hoặc số thập phân) vào ô trống (0.5 điểm / câu).
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
                          {isCorrect ? 'Chính xác (+0.5đ)' : `Sai (0đ) • Đáp án: ${q.correctAnswer} ${q.unit}`}
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
                        placeholder="Nhập số..."
                        className="w-36 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      {q.unit && <span className="text-xs text-slate-500 font-medium">{q.unit}</span>}
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
