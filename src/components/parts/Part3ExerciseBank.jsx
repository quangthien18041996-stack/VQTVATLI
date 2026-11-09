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
   1. BÀI TẬP SGK TOÁN 12 KẾT NỐI TRI THỨC (CHƯƠNG V - HÌNH HỌC OXYZ)
   ============================================================ */
const PRACTICE_QUESTIONS = [
  {
    id: '5.1',
    title: 'Bài 5.1 (SGK KNTT - Tọa độ vectơ)',
    topic: 'Vectơ trong không gian Oxyz',
    question: 'Trong không gian $Oxyz$, cho vectơ $\\vec{u} = 2\\vec{i} - 3\\vec{j} + 5\\vec{k}$. Tọa độ của vectơ $\\vec{u}$ là:',
    options: [
      { key: 'A', text: '$(2; -3; 5)$' },
      { key: 'B', text: '$(2; 3; 5)$' },
      { key: 'C', text: '$(-3; 2; 5)$' },
      { key: 'D', text: '$(5; -3; 2)$' }
    ],
    correct: 'A',
    explanation: 'Theo định nghĩa hệ tọa độ trong không gian: nếu $\\vec{u} = x\\vec{i} + y\\vec{j} + z\\vec{k}$ thì $\\vec{u} = (x; y; z)$. Do đó $\\vec{u} = (2; -3; 5)$.'
  },
  {
    id: '5.2',
    title: 'Bài 5.2 (SGK KNTT - Tích có hướng)',
    topic: 'Tích có hướng của 2 vectơ',
    question: 'Cho hai vectơ $\\vec{a} = (1; 2; 3)$ và $\\vec{b} = (2; -1; 1)$. Tọa độ của vectơ tích có hướng $[\\vec{a}, \\vec{b}]$ là:',
    options: [
      { key: 'A', text: '$(5; 5; -5)$' },
      { key: 'B', text: '$(5; 7; -5)$' },
      { key: 'C', text: '$(5; 5; 5)$' },
      { key: 'D', text: '(-5; 5; 5)$' }
    ],
    correct: 'A',
    explanation: 'Công thức tính tích có hướng $[\\vec{a}, \\vec{b}] = \\left( y_1 z_2 - z_1 y_2;\\; z_1 x_2 - x_1 z_2;\\; x_1 y_2 - y_1 x_2 \\right)$. Thay số: $x = 2(1) - 3(-1) = 5$; $y = 3(2) - 1(1) = 5$; $z = 1(-1) - 2(2) = -5$. Vậy $[\\vec{a}, \\vec{b}] = (5; 5; -5)$.'
  },
  {
    id: '5.3',
    title: 'Bài 5.3 (SGK KNTT - Phương trình mặt phẳng)',
    topic: 'Mặt phẳng đi qua 1 điểm có VTPT',
    question: 'Mặt phẳng $(\\alpha)$ đi qua điểm $M(1; -2; 3)$ và nhận vectơ $\\vec{n} = (2; 1; -4)$ làm vectơ pháp tuyến có phương trình là:',
    options: [
      { key: 'A', text: '$2x + y - 4z + 12 = 0$' },
      { key: 'B', text: '$2x + y - 4z - 12 = 0$' },
      { key: 'C', text: '$2x - y + 4z - 14 = 0$' },
      { key: 'D', text: '$x - 2y + 3z - 12 = 0$' }
    ],
    correct: 'A',
    explanation: 'Phương trình mặt phẳng: $A(x - x_0) + B(y - y_0) + C(z - z_0) = 0 \\iff 2(x - 1) + 1(y + 2) - 4(z - 3) = 0 \\iff 2x + y - 4z - 2 + 2 + 12 = 0 \\iff 2x + y - 4z + 12 = 0$.'
  },
  {
    id: '5.4',
    title: 'Bài 5.4 (SGK KNTT - Khoảng cách)',
    topic: 'Khoảng cách từ điểm đến mặt phẳng',
    question: 'Khoảng cách từ điểm $A(2; 4; -1)$ đến mặt phẳng $(P): 2x - y + 2z - 9 = 0$ bằng:',
    options: [
      { key: 'A', text: '$3$' },
      { key: 'B', text: '$\\frac{9}{3}$' },
      { key: 'C', text: '$1$' },
      { key: 'D', text: '$5$' }
    ],
    correct: 'A',
    explanation: 'Áp dụng công thức khoảng cách: $d(A, P) = \\frac{|2(2) - 1(4) + 2(-1) - 9|}{\\sqrt{2^2 + (-1)^2 + 2^2}} = \\frac{|4 - 4 - 2 - 9|}{\\sqrt{9}} = \\frac{|-11 - 0|}{3} = \\frac{11 - 2}{3} = \\frac{9}{3} = 3$.'
  },
  {
    id: '5.5',
    title: 'Bài 5.5 (SGK KNTT - Phương trình mặt cầu)',
    topic: 'Mặt cầu tâm I bán kính R',
    question: 'Mặt cầu $(S): x^2 + y^2 + z^2 - 4x + 6y - 2z - 2 = 0$ có tọa độ tâm $I$ và bán kính $R$ lần lượt là:',
    options: [
      { key: 'A', text: '$I(2; -3; 1)$ và $R = 4$' },
      { key: 'B', text: '$I(-2; 3; -1)$ và $R = 4$' },
      { key: 'C', text: '$I(2; -3; 1)$ và $R = 16$' },
      { key: 'D', text: '$I(-4; 6; -2)$ và $R = 2$' }
    ],
    correct: 'A',
    explanation: 'Ta có $a = 2, b = -3, c = 1, d = -2$. Tâm $I(a; b; c) = (2; -3; 1)$. Bán kính $R = \\sqrt{a^2 + b^2 + c^2 - d} = \\sqrt{2^2 + (-3)^2 + 1^2 - (-2)} = \\sqrt{4 + 9 + 1 + 2} = \\sqrt{16} = 4$.'
  },
  {
    id: '5.6',
    title: 'Bài 5.6 (SGK KNTT - Vị trí tương đối mặt phẳng và mặt cầu)',
    topic: 'Thiết diện đường tròn',
    question: 'Cho mặt cầu $(S)$ có bán kính $R = 5$ và mặt phẳng $(P)$ cắt $(S)$ theo giao tuyến là đường tròn có bán kính $r = 4$. Khoảng cách từ tâm mặt cầu đến mặt phẳng $(P)$ bằng:',
    options: [
      { key: 'A', text: '$3$' },
      { key: 'B', text: '$1$' },
      { key: 'C', text: '$\\sqrt{41}$' },
      { key: 'D', text: '$9$' }
    ],
    correct: 'A',
    explanation: 'Theo hệ thức Pythagore trong tam giác vuông tạo bởi tâm mặt cầu, tâm đường tròn thiết diện và một điểm trên đường tròn: $R^2 = d^2 + r^2 \\implies d = \\sqrt{R^2 - r^2} = \\sqrt{5^2 - 4^2} = \\sqrt{9} = 3$.'
  }
];

/* ============================================================
   2. ĐỀ THI THỬ 50 PHÚT CHUẨN MA TRẬN BỘ GD&ĐT 2025 (CHƯƠNG V)
   ============================================================ */

// PHẦN I: 12 CÂU TRẮC NGHIỆM 4 PHƯƠNG ÁN (3.0 ĐIỂM - 0.25đ/câu)
const EXAM_PART_1 = [
  {
    id: 'p1_1',
    question: 'Trong không gian $Oxyz$, cho điểm $M(2; -3; 4)$. Hình chiếu vuông góc của điểm $M$ lên mặt phẳng $(Oxy)$ có tọa độ là:',
    options: [
      { key: 'A', text: '$(2; -3; 0)$' },
      { key: 'B', text: '$(0; 0; 4)$' },
      { key: 'C', text: '$(2; 0; 4)$' },
      { key: 'D', text: '$(0; -3; 4)$' }
    ],
    correct: 'A',
    explanation: 'Hình chiếu vuông góc của $M(x_0; y_0; z_0)$ lên mặt phẳng $(Oxy)$ có $z = 0$, giữ nguyên $x, y$. Vậy hình chiếu là $(2; -3; 0)$.'
  },
  {
    id: 'p1_2',
    question: 'Cho hai điểm $A(1; 3; -2)$ và $B(3; -1; 4)$. Tọa độ trung điểm $I$ của đoạn thẳng $AB$ là:',
    options: [
      { key: 'A', text: '$(2; 1; 1)$' },
      { key: 'B', text: '$(4; 2; 2)$' },
      { key: 'C', text: '$(2; -2; 3)$' },
      { key: 'D', text: '$(1; -2; 3)$' }
    ],
    correct: 'A',
    explanation: 'Tọa độ trung điểm: $I = \\left( \\frac{x_A+x_B}{2}; \\frac{y_A+y_B}{2}; \\frac{z_A+z_B}{2} \\right) = \\left( \\frac{1+3}{2}; \\frac{3-1}{2}; \\frac{-2+4}{2} \\right) = (2; 1; 1)$.'
  },
  {
    id: 'p1_3',
    question: 'Vectơ nào sau đây là một vectơ pháp tuyến của mặt phẳng $(\\alpha): 3x - 2y + z - 7 = 0$?',
    options: [
      { key: 'A', text: '$\\vec{n}_1 = (3; -2; 1)$' },
      { key: 'B', text: '$\\vec{n}_2 = (3; 2; 1)$' },
      { key: 'C', text: '$\\vec{n}_3 = (3; -2; -7)$' },
      { key: 'D', text: '$\\vec{n}_4 = (-2; 1; -7)$' }
    ],
    correct: 'A',
    explanation: 'Mặt phẳng có phương trình tổng quát $Ax + By + Cz + D = 0$ có một vectơ pháp tuyến là $\\vec{n} = (A; B; C) = (3; -2; 1)$.'
  },
  {
    id: 'p1_4',
    question: 'Trong không gian $Oxyz$, đường thẳng $d: \\frac{x-1}{2} = \\frac{y+2}{-3} = \\frac{z-5}{4}$ đi qua điểm nào dưới đây?',
    options: [
      { key: 'A', text: '$M(1; -2; 5)$' },
      { key: 'B', text: '$N(-1; 2; -5)$' },
      { key: 'C', text: '$P(2; -3; 4)$' },
      { key: 'D', text: '$Q(1; 2; 5)$' }
    ],
    correct: 'A',
    explanation: 'Đường thẳng $d: \\frac{x-x_0}{a} = \\frac{y-y_0}{b} = \\frac{z-z_0}{c}$ đi qua điểm $M_0(x_0; y_0; z_0) = (1; -2; 5)$.'
  },
  {
    id: 'p1_5',
    question: 'Góc giữa hai mặt phẳng $(P): x + y - z + 3 = 0$ và $(Q): x - y + z - 1 = 0$ có cosin bằng:',
    options: [
      { key: 'A', text: '$\\frac{1}{3}$' },
      { key: 'B', text: '$\\frac{2}{3}$' },
      { key: 'C', text: '$-\\frac{1}{3}$' },
      { key: 'D', text: '$\\frac{\\sqrt{3}}{3}$' }
    ],
    correct: 'A',
    explanation: '$\\vec{n}_P = (1; 1; -1)$, $\\vec{n}_Q = (1; -1; 1)$. $\\cos((P), (Q)) = \\frac{|\\vec{n}_P \\cdot \\vec{n}_Q|}{|\\vec{n}_P| \\cdot |\\vec{n}_Q|} = \\frac{|1(1) + 1(-1) + (-1)(1)|}{\\sqrt{3} \\cdot \\sqrt{3}} = \\frac{|-1|}{3} = \\frac{1}{3}$.'
  },
  {
    id: 'p1_6',
    question: 'Phương trình mặt phẳng đi qua ba điểm $A(3; 0; 0), B(0; -2; 0), C(0; 0; 4)$ là:',
    options: [
      { key: 'A', text: '$\\frac{x}{3} + \\frac{y}{-2} + \\frac{z}{4} = 1$' },
      { key: 'B', text: '$\\frac{x}{3} + \\frac{y}{2} + \\frac{z}{4} = 1$' },
      { key: 'C', text: '$3x - 2y + 4z = 1$' },
      { key: 'D', text: '$\\frac{x}{3} + \\frac{y}{-2} + \\frac{z}{4} = 0$' }
    ],
    correct: 'A',
    explanation: 'Áp dụng phương trình mặt phẳng theo đoạn chắn: $\\frac{x}{a} + \\frac{y}{b} + \\frac{z}{c} = 1$ với $a = 3, b = -2, c = 4$.'
  },
  {
    id: 'p1_7',
    question: 'Cho hai vectơ $\\vec{u} = (2; 1; 0)$ và $\\vec{v} = (-1; 0; 3)$. Độ dài của vectơ $\\vec{u} + \\vec{v}$ bằng:',
    options: [
      { key: 'A', text: '$\\sqrt{11}$' },
      { key: 'B', text: '$\\sqrt{5} + \\sqrt{10}$' },
      { key: 'C', text: '$3$' },
      { key: 'D', text: '$\\sqrt{14}$' }
    ],
    correct: 'A',
    explanation: '$\\vec{u} + \\vec{v} = (2 + (-1); 1 + 0; 0 + 3) = (1; 1; 3)$. Độ dài $|\\vec{u} + \\vec{v}| = \\sqrt{1^2 + 1^2 + 3^2} = \\sqrt{11}$.'
  },
  {
    id: 'p1_8',
    question: 'Phương trình tham số của đường thẳng đi qua điểm $A(1; 2; -3)$ và nhận $\\vec{u} = (3; -1; 2)$ làm VTCP là:',
    options: [
      { key: 'A', text: '$\\begin{cases} x = 1 + 3t \\\\ y = 2 - t \\\\ z = -3 + 2t \\end{cases}$' },
      { key: 'B', text: '$\\begin{cases} x = 3 + t \\\\ y = -1 + 2t \\\\ z = 2 - 3t \\end{cases}$' },
      { key: 'C', text: '$\\begin{cases} x = 1 - 3t \\\\ y = 2 - t \\\\ z = -3 - 2t \\end{cases}$' },
      { key: 'D', text: '$\\begin{cases} x = 1 + 3t \\\\ y = 2 + t \\\\ z = -3 + 2t \\end{cases}$' }
    ],
    correct: 'A',
    explanation: 'Phương trình tham số của đường thẳng đi qua $A(x_0; y_0; z_0)$ có VTCP $(a; b; c)$ là $\\begin{cases} x = x_0 + at \\\\ y = y_0 + bt \\\\ z = z_0 + ct \\end{cases}$.'
  },
  {
    id: 'p1_9',
    question: 'Mặt cầu tâm $I(1; -2; 3)$ và tiếp xúc với mặt phẳng $(Oxy)$ có bán kính bằng:',
    options: [
      { key: 'A', text: '$3$' },
      { key: 'B', text: '$1$' },
      { key: 'C', text: '$2$' },
      { key: 'D', text: '$\\sqrt{14}$' }
    ],
    correct: 'A',
    explanation: 'Mặt phẳng $(Oxy)$ có phương trình $z = 0$. Khoảng cách từ $I(1; -2; 3)$ đến $(Oxy)$ là $d = |z_I| = |3| = 3$. Vì mặt cầu tiếp xúc với $(Oxy)$ nên $R = d = 3$.'
  },
  {
    id: 'p1_10',
    question: 'Khoảng cách giữa hai mặt phẳng song song $(P): 2x - 2y + z + 1 = 0$ và $(Q): 2x - 2y + z - 8 = 0$ bằng:',
    options: [
      { key: 'A', text: '$3$' },
      { key: 'B', text: '$7$' },
      { key: 'C', text: '$9$' },
      { key: 'D', text: '$\\frac{7}{3}$' }
    ],
    correct: 'A',
    explanation: 'Khoảng cách giữa hai mặt phẳng song song $Ax + By + Cz + D_1 = 0$ và $Ax + By + Cz + D_2 = 0$ là: $d = \\frac{|D_1 - D_2|}{\\sqrt{A^2 + B^2 + C^2}} = \\frac{|1 - (-8)|}{\\sqrt{2^2 + (-2)^2 + 1^2}} = \\frac{9}{3} = 3$.'
  },
  {
    id: 'p1_11',
    question: 'Cho điểm $A(1; 0; 2)$ và mặt phẳng $(P): x + 2y - z + 4 = 0$. Đường thẳng đi qua $A$ và vuông góc với $(P)$ có vectơ chỉ phương là:',
    options: [
      { key: 'A', text: '$\\vec{u} = (1; 2; -1)$' },
      { key: 'B', text: '$\\vec{u} = (1; 0; 2)$' },
      { key: 'C', text: '$\\vec{u} = (1; -2; 1)$' },
      { key: 'D', text: '$\\vec{u} = (2; -1; 4)$' }
    ],
    correct: 'A',
    explanation: 'Đường thẳng vuông góc với mặt phẳng $(P)$ nhận luôn vectơ pháp tuyến $\\vec{n}_P = (1; 2; -1)$ làm vectơ chỉ phương.'
  },
  {
    id: 'p1_12',
    question: 'Diện tích của tam giác $ABC$ với $A(1; 0; 0), B(0; 2; 0), C(0; 0; 3)$ bằng:',
    options: [
      { key: 'A', text: '$\\frac{7}{2}$' },
      { key: 'B', text: '$7$' },
      { key: 'C', text: '$\\frac{\\sqrt{14}}{2}$' },
      { key: 'D', text: '$3$' }
    ],
    correct: 'A',
    explanation: '$\\vec{AB} = (-1; 2; 0), \\vec{AC} = (-1; 0; 3) \\implies [\\vec{AB}, \\vec{AC}] = (6; 3; 2)$. Diện tích $S = \\frac{1}{2}|[\\vec{AB}, \\vec{AC}]| = \\frac{1}{2}\\sqrt{6^2 + 3^2 + 2^2} = \\frac{1}{2}\\sqrt{49} = \\frac{7}{2}$.'
  }
];

// PHẦN II: 4 CÂU TRẮC NGHIỆM ĐÚNG / SAI (4.0 ĐIỂM - Mỗi câu 1.0đ)
const EXAM_PART_2 = [
  {
    id: 'p2_1',
    title: 'Câu 1 (Phần II)',
    prompt: 'Trong không gian $Oxyz$, cho mặt cầu $(S): x^2 + y^2 + z^2 - 2x + 4y - 6z - 11 = 0$ và mặt phẳng $(P): 2x + 2y - z + 17 = 0$. Xét tính đúng sai của các khẳng định sau:',
    items: [
      { key: 'a', text: 'Tâm của mặt cầu $(S)$ là điểm $I(1; -2; 3)$.', correct: true, explain: '$a = 1, b = -2, c = 3 \\implies I(1; -2; 3)$ (ĐÚNG).' },
      { key: 'b', text: 'Bán kính của mặt cầu $(S)$ là $R = 5$.', correct: true, explain: '$R = \\sqrt{1^2 + (-2)^2 + 3^2 - (-11)} = \\sqrt{1 + 4 + 9 + 11} = \\sqrt{25} = 5$ (ĐÚNG).' },
      { key: 'c', text: 'Khoảng cách từ tâm $I$ đến mặt phẳng $(P)$ bằng $3$.', correct: false, explain: '$d(I, P) = \\frac{|2(1) + 2(-2) - 1(3) + 17|}{\\sqrt{2^2 + 2^2 + (-1)^2}} = \\frac{|2 - 4 - 3 + 17|}{3} = \\frac{12}{3} = 4 \\neq 3$ (SAI).' },
      { key: 'd', text: 'Mặt phẳng $(P)$ cắt mặt cầu $(S)$ theo một đường tròn thiết diện có bán kính $r = 3$.', correct: true, explain: 'Vì $d = 4 < R = 5$ nên mặt phẳng cắt mặt cầu theo đường tròn có bán kính $r = \\sqrt{R^2 - d^2} = \\sqrt{5^2 - 4^2} = 3$ (ĐÚNG).' }
    ]
  },
  {
    id: 'p2_2',
    title: 'Câu 2 (Phần II)',
    prompt: 'Trong không gian $Oxyz$, cho bốn điểm $A(1; 1; 1), B(2; 3; 4), C(3; 1; 2)$ và $D(2; 4; 5)$. Xét tính đúng sai của các khẳng định:',
    items: [
      { key: 'a', text: 'Tọa độ vectơ $\\vec{AB} = (1; 2; 3)$ và $\\vec{AC} = (2; 0; 1)$.', correct: true, explain: '$\\vec{AB} = (2-1; 3-1; 4-1) = (1; 2; 3)$ và $\\vec{AC} = (3-1; 1-1; 2-1) = (2; 0; 1)$ (ĐÚNG).' },
      { key: 'b', text: 'Tích có hướng $[\\vec{AB}, \\vec{AC}] = (2; 5; -4)$.', correct: true, explain: '$x = 2(1) - 3(0) = 2; y = 3(2) - 1(1) = 5; z = 1(0) - 2(2) = -4 \\implies [\\vec{AB}, \\vec{AC}] = (2; 5; -4)$ (ĐÚNG).' },
      { key: 'c', text: 'Phương trình mặt phẳng $(ABC)$ là $2x + 5y - 4z - 3 = 0$.', correct: true, explain: '$2(x - 1) + 5(y - 1) - 4(z - 1) = 0 \\iff 2x + 5y - 4z - 3 = 0$ (ĐÚNG).' },
      { key: 'd', text: 'Bốn điểm $A, B, C, D$ cùng thuộc một mặt phẳng (đồng phẳng).', correct: false, explain: 'Thay tọa độ $D(2; 4; 5)$ vào phương trình $(ABC)$: $2(2) + 5(4) - 4(5) - 3 = 4 + 20 - 20 - 3 = 1 \\neq 0$. Vậy $D \\notin (ABC)$, bốn điểm không đồng phẳng (SAI).' }
    ]
  },
  {
    id: 'p2_3',
    title: 'Câu 3 (Phần II)',
    prompt: 'Cho đường thẳng $d: \\frac{x-1}{1} = \\frac{y-2}{2} = \\frac{z+1}{-1}$ và mặt phẳng $(P): 2x - y + 3z - 5 = 0$. Xét tính đúng sai của các mệnh đề:',
    items: [
      { key: 'a', text: 'Vectơ chỉ phương của đường thẳng $d$ là $\\vec{u} = (1; 2; -1)$.', correct: true, explain: 'VTCP của $d$ là $\\vec{u} = (1; 2; -1)$ (ĐÚNG).' },
      { key: 'b', text: 'Vectơ pháp tuyến của mặt phẳng $(P)$ là $\\vec{n} = (2; -1; 3)$.', correct: true, explain: 'VTPT của $(P)$ là $\\vec{n} = (2; -1; 3)$ (ĐÚNG).' },
      { key: 'c', text: 'Đường thẳng $d$ vuông góc với mặt phẳng $(P)$.', correct: false, explain: 'Hai vectơ $\\vec{u}$ và $\\vec{n}$ không cùng phương $\\left( \\frac{1}{2} \\neq \\frac{2}{-1} \\right)$, nên $d$ không vuông góc với $(P)$ (SAI).' },
      { key: 'd', text: 'Tích vô hướng $\\vec{u} \\cdot \\vec{n} = -3$, do đó đường thẳng $d$ cắt mặt phẳng $(P)$.', correct: true, explain: '$\\vec{u} \\cdot \\vec{n} = 1(2) + 2(-1) + (-1)(3) = 2 - 2 - 3 = -3 \\neq 0$. Vì $\\vec{u} \\cdot \\vec{n} \\neq 0$ nên đường thẳng $d$ cắt mặt phẳng $(P)$ (ĐÚNG).' }
    ]
  },
  {
    id: 'p2_4',
    title: 'Câu 4 (Phần II - Bài toán STEM thực tế)',
    prompt: 'Một kỹ sư thiết kế hệ thống đèn chiếu sáng cho sân bóng đá mô phỏng trong không gian $Oxyz$ (đơn vị: mét). Mặt sân là mặt phẳng $(Oxy)$ có phương trình $z = 0$. Trụ đèn $S$ đặt tại tọa độ $(0; 0; 12)$. Một camera giám sát đặt tại vị trí $C(15; 20; 8)$.',
    items: [
      { key: 'a', text: 'Khoảng cách từ trụ đèn $S$ đến camera $C$ bằng $25\\text{ m}$.', correct: true, explain: '$SC = \\sqrt{(15-0)^2 + (20-0)^2 + (8-12)^2} = \\sqrt{225 + 400 + 16} = \\sqrt{641} \\approx 25.32\\text{ m} \\neq 25\\text{ m}$ (SAI).' },
      { key: 'b', text: 'Vectơ chỉ phương của tia sáng nối từ đèn $S$ tới camera $C$ là $\\vec{SC} = (15; 20; -4)$.', correct: true, explain: '$\\vec{SC} = (15 - 0; 20 - 0; 8 - 12) = (15; 20; -4)$ (ĐÚNG).' },
      { key: 'c', text: 'Góc nghiêng của tia sáng $SC$ so với mặt phẳng sân bóng $(Oxy)$ có $\\sin\\varphi = \\frac{4}{\\sqrt{641}}$.', correct: true, explain: 'VTPT của $(Oxy)$ là $\\vec{k} = (0; 0; 1)$. $\\sin\\varphi = \\frac{|-4|}{\\sqrt{15^2 + 20^2 + (-4)^2} \\cdot 1} = \\frac{4}{\\sqrt{641}}$ (ĐÚNG).' },
      { key: 'd', text: 'Nếu vùng chiếu sáng hiệu dụng của đèn $S$ là một hình cầu bán kính $R = 26\\text{ m}$ thì camera $C$ nằm bên trong vùng chiếu sáng của đèn.', correct: true, explain: 'Khoảng cách $SC = \\sqrt{641} \\approx 25.32\\text{ m} < 26\\text{ m}$, do đó camera nằm trong vùng phủ sáng (ĐÚNG).' }
    ]
  }
];

// PHẦN III: 6 CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (3.0 ĐIỂM - 0.5đ/câu)
const EXAM_PART_3 = [
  {
    id: 'p3_1',
    question: 'Trong không gian $Oxyz$, cho mặt cầu $(S): x^2 + y^2 + z^2 - 4x + 6y - 2z - 11 = 0$. Bán kính $R$ của mặt cầu bằng bao nhiêu?',
    correctAnswer: '5',
    acceptAnswers: ['5', '5.0'],
    explanation: '$a = 2, b = -3, c = 1, d = -11$. Bán kính $R = \\sqrt{2^2 + (-3)^2 + 1^2 - (-11)} = \\sqrt{4 + 9 + 1 + 11} = \\sqrt{25} = 5$.'
  },
  {
    id: 'p3_2',
    question: 'Khoảng cách từ điểm $M(1; -2; 3)$ đến mặt phẳng $(P): 2x - y + 2z + 2 = 0$ bằng bao nhiêu?',
    correctAnswer: '4',
    acceptAnswers: ['4', '4.0'],
    explanation: '$d(M, P) = \\frac{|2(1) - (-2) + 2(3) + 2|}{\\sqrt{2^2 + (-1)^2 + 2^2}} = \\frac{|2 + 2 + 6 + 2|}{3} = \\frac{12}{3} = 4$.'
  },
  {
    id: 'p3_3',
    question: 'Cho mặt cầu $(S)$ có tâm $I(2; 1; -1)$, bán kính $R = 5$ và mặt phẳng $(P)$ cách tâm $I$ một khoảng $d = 4$. Bán kính $r$ của đường tròn giao tuyến bằng bao nhiêu?',
    correctAnswer: '3',
    acceptAnswers: ['3', '3.0'],
    explanation: 'Theo định lý Pythagore: $r = \\sqrt{R^2 - d^2} = \\sqrt{5^2 - 4^2} = \\sqrt{25 - 16} = 3$.'
  },
  {
    id: 'p3_4',
    question: 'Một radar hàng không đặt tại trạm kiểm soát mặt đất $O(0; 0; 0)$ phát hiện máy bay đang ở tọa độ $(6; 8; 24)$ (đơn vị: km). Khoảng cách đường chim bay từ trạm radar đến máy bay bằng bao nhiêu km?',
    correctAnswer: '26',
    acceptAnswers: ['26', '26.0'],
    explanation: 'Khoảng cách $d = \\sqrt{6^2 + 8^2 + 24^2} = \\sqrt{36 + 64 + 576} = \\sqrt{676} = 26\\text{ km}$.'
  },
  {
    id: 'p3_5',
    question: 'Khoảng cách giữa hai mặt phẳng song song $(\\alpha): 3x + 4y - 1 = 0$ và $(\\beta): 3x + 4y + 14 = 0$ bằng bao nhiêu?',
    correctAnswer: '3',
    acceptAnswers: ['3', '3.0'],
    explanation: '$d = \\frac{|14 - (-1)|}{\\sqrt{3^2 + 4^2 + 0^2}} = \\frac{15}{5} = 3$.'
  },
  {
    id: 'p3_6',
    question: 'Cho hai điểm $A(1; 2; 3)$ và $B(3; 4; 7)$. Điểm $M$ thuộc đoạn thẳng $AB$ sao cho $AM = 2MB$. Hoành độ $x_M$ của điểm $M$ bằng bao nhiêu? (Nhập số thập phân làm tròn 2 chữ số nếu cần)',
    correctAnswer: '2.33',
    acceptAnswers: ['2.33', '7/3'],
    explanation: 'Vì $M$ thuộc đoạn $AB$ và $AM = 2MB$ nên $\\vec{AM} = 2\\vec{MB} \\iff x_M - 1 = 2(3 - x_M) \\iff 3x_M = 7 \\iff x_M = \\frac{7}{3} \\approx 2.33$.'
  }
];

export default function Part3ExerciseBank() {
  const [activeTab, setActiveTab] = useState('practice'); // 'practice' | 'exam'
  
  // Practice state
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState({});

  // Exam state
  const [examStarted, setExamStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(50 * 60); // 50 phút
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userP1, setUserP1] = useState({}); // { [qId]: 'A' }
  const [userP2, setUserP2] = useState({}); // { [qId]: { a: true, b: false } }
  const [userP3, setUserP3] = useState({}); // { [qId]: 'string' }
  const [examResults, setExamResults] = useState(null);

  // Timer countdown
  useEffect(() => {
    let timer = null;
    if (examStarted && !isSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, isSubmitted, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle Practice Answer
  const handleSelectPracticeOption = (qId, optionKey) => {
    setPracticeAnswers((prev) => ({ ...prev, [qId]: optionKey }));
    setShowExplanation((prev) => ({ ...prev, [qId]: true }));
  };

  // Submit and Grade Exam
  const handleSubmitExam = () => {
    setIsSubmitted(true);
    setExamStarted(false);

    // 1. Grade Part 1: 0.25đ / correct question (Max: 3.0đ)
    let scoreP1 = 0;
    EXAM_PART_1.forEach((q) => {
      if (userP1[q.id] === q.correct) {
        scoreP1 += 0.25;
      }
    });

    // 2. Grade Part 2: Official MOET true/false scoring rules (Max: 4.0đ)
    // 1 correct item = 0.1đ; 2 correct = 0.25đ; 3 correct = 0.5đ; 4 correct = 1.0đ
    let scoreP2 = 0;
    EXAM_PART_2.forEach((q) => {
      const qAns = userP2[q.id] || {};
      let correctCount = 0;
      q.items.forEach((item) => {
        if (qAns[item.key] === item.correct) {
          correctCount++;
        }
      });
      if (correctCount === 1) scoreP2 += 0.1;
      else if (correctCount === 2) scoreP2 += 0.25;
      else if (correctCount === 3) scoreP2 += 0.5;
      else if (correctCount === 4) scoreP2 += 1.0;
    });

    // 3. Grade Part 3: 0.5đ / correct question (Max: 3.0đ)
    let scoreP3 = 0;
    EXAM_PART_3.forEach((q) => {
      const rawAns = (userP3[q.id] || '').trim().toLowerCase();
      if (rawAns && q.acceptAnswers.map(a => a.toLowerCase()).includes(rawAns)) {
        scoreP3 += 0.5;
      }
    });

    const totalScore = +(scoreP1 + scoreP2 + scoreP3).toFixed(2);
    setExamResults({
      total: totalScore,
      scoreP1: +scoreP1.toFixed(2),
      scoreP2: +scoreP2.toFixed(2),
      scoreP3: +scoreP3.toFixed(2)
    });

    if (totalScore >= 8.0) {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleResetExam = () => {
    setExamStarted(false);
    setIsSubmitted(false);
    setTimeLeft(50 * 60);
    setUserP1({});
    setUserP2({});
    setUserP3({});
    setExamResults(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Tab Switcher */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-sky-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Hệ Thống Luyện Đề & Kiểm Tra Đánh Giá Năng Lực (Chương V)
            </h3>
            <p className="text-xs text-slate-500">
              Chuẩn cấu trúc Đổi mới Giáo dục phổ thông 2018 & Định dạng Đề thi tốt nghiệp THPT 2025
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center p-1 bg-slate-100/80 rounded-xl border border-slate-200 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'practice'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Luyện Tập Tự Do
          </button>
          <button
            onClick={() => setActiveTab('exam')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'exam'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            Thi Thử 50 Phút (Có Chấm Điểm)
          </button>
        </div>
      </div>

      {/* =======================================================
          TAB 1: LUYỆN TẬP TỰ DO (XEM LỜI GIẢI TỨC THÌ)
          ======================================================= */}
      {activeTab === 'practice' && (
        <div className="space-y-4">
          <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong>Hướng dẫn luyện tập:</strong> Chọn đáp án bạn cho là đúng. Hệ thống sẽ ngay lập tức đối soát kết quả và hiển thị <strong>phân tích lời giải chi tiết bằng công thức toán học KaTeX</strong> chuẩn SGK Toán 12 Kết nối tri thức.
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {PRACTICE_QUESTIONS.map((q, idx) => {
              const selected = practiceAnswers[q.id];
              const isAnswered = selected !== undefined;
              const isCorrect = selected === q.correct;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl border p-5 transition-all shadow-2xs ${
                    isAnswered
                      ? isCorrect
                        ? 'border-emerald-300 bg-emerald-50/10'
                        : 'border-rose-300 bg-rose-50/10'
                      : 'border-sky-100 hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                      {q.title}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Chủ đề: {q.topic}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 leading-relaxed mb-4">
                    <MathView math={q.question} />
                  </p>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                    {q.options.map((opt) => {
                      let btnStyle = 'border-slate-200 bg-slate-50/50 hover:bg-sky-50/60 hover:border-sky-200 text-slate-700';

                      if (isAnswered) {
                        if (opt.key === q.correct) {
                          btnStyle = 'border-emerald-500 bg-emerald-100/60 text-emerald-900 font-bold';
                        } else if (selected === opt.key) {
                          btnStyle = 'border-rose-500 bg-rose-100/60 text-rose-900 font-bold';
                        } else {
                          btnStyle = 'border-slate-100 bg-slate-50/30 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={opt.key}
                          onClick={() => handleSelectPracticeOption(q.id, opt.key)}
                          className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                              {opt.key}
                            </span>
                            <span><MathView math={opt.text} /></span>
                          </div>
                          {isAnswered && opt.key === q.correct && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {isAnswered && selected === opt.key && opt.key !== q.correct && (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Immediate Explanation */}
                  {isAnswered && (
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold flex items-center gap-1.5 ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Chính xác
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" /> Chưa đúng (Đáp án đúng: {q.correct})
                            </>
                          )}
                        </span>
                        <button
                          onClick={() => setShowExplanation(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                          className="text-[11px] font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
                        >
                          {showExplanation[q.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          {showExplanation[q.id] ? 'Ẩn lời giải' : 'Xem lời giải'}
                        </button>
                      </div>

                      {showExplanation[q.id] && (
                        <div className="mt-3 p-3.5 rounded-xl bg-teal-50/60 border border-teal-100 text-xs text-slate-700 leading-relaxed space-y-1">
                          <div className="font-bold text-teal-900 flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5" /> Lời giải chi tiết:
                          </div>
                          <div><MathView math={q.explanation} /></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =======================================================
          TAB 2: THI THỬ 50 PHÚT CHUẨN MA TRẬN 2025
          ======================================================= */}
      {activeTab === 'exam' && (
        <div className="space-y-6">
          {/* Top Control Bar with Countdown Timer */}
          <div className="sticky top-20 z-30 bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 text-white shadow-xl border border-slate-700 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-500/20 rounded-xl text-teal-400 border border-teal-400/30">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                  Thời Gian Làm Bài
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!examStarted && !isSubmitted && (
                <button
                  onClick={() => setExamStarted(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white text-xs font-extrabold rounded-xl shadow-md shadow-teal-500/20 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Play className="w-4 h-4 fill-white" /> Bắt Đầu Làm Bài
                </button>
              )}

              {examStarted && !isSubmitted && (
                <button
                  onClick={handleSubmitExam}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-extrabold rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Send className="w-4 h-4" /> Nộp Bài & Chấm Điểm
                </button>
              )}

              {isSubmitted && (
                <button
                  onClick={handleResetExam}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-4 h-4" /> Làm Lại Bài Thi
                </button>
              )}
            </div>
          </div>

          {/* Exam Summary Result Card */}
          {isSubmitted && examResults && (
            <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-emerald-950 rounded-2xl p-6 text-white border border-teal-500/40 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-teal-500/20 pb-4">
                <div>
                  <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-bold rounded-full border border-teal-400/30">
                    KẾT QUẢ ĐÁNH GIÁ NĂNG LỰC
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-1">
                    Đề Thi Thử Tốt Nghiệp THPT 2025 • Chương V (Hình Học Oxyz)
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-medium">Tổng điểm đạt được:</span>
                  <span className="text-4xl font-black text-teal-400 font-mono">
                    {examResults.total} <span className="text-xl text-slate-400 font-normal">/ 10.0</span>
                  </span>
                </div>
              </div>

              {/* Detailed component scores */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-xs block">Phần I (Trắc nghiệm nhiều lựa chọn):</span>
                  <span className="text-lg font-bold text-teal-300 font-mono">
                    {examResults.scoreP1} / 3.0 điểm
                  </span>
                </div>
                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-xs block">Phần II (Trắc nghiệm Đúng / Sai):</span>
                  <span className="text-lg font-bold text-teal-300 font-mono">
                    {examResults.scoreP2} / 4.0 điểm
                  </span>
                </div>
                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-xs block">Phần III (Trắc nghiệm Trả lời ngắn):</span>
                  <span className="text-lg font-bold text-teal-300 font-mono">
                    {examResults.scoreP3} / 3.0 điểm
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* =======================================================
              PHẦN I: TRẮC NGHIỆM NHIỀU LỰA CHỌN (12 CÂU - 3.0 ĐIỂM)
              ======================================================= */}
          <div className="space-y-4">
            <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-teal-900 text-sm">
                  PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (3.0 ĐIỂM)
                </h4>
                <p className="text-xs text-teal-700">
                  Thí sinh trả lời từ câu 1 đến câu 12. Mỗi câu hỏi chỉ chọn một phương án (mỗi câu 0.25 điểm).
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-white text-teal-800 rounded-lg border border-teal-200">
                12 Câu
              </span>
            </div>

            <div className="space-y-3">
              {EXAM_PART_1.map((q, idx) => {
                const userAns = userP1[q.id];
                const isCorrect = userAns === q.correct;

                return (
                  <div key={q.id} className="bg-white rounded-2xl border border-sky-100 p-4 sm:p-5 shadow-2xs">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-800">
                        Câu {idx + 1}:
                      </span>
                      {isSubmitted && (
                        <span className={`text-xs font-bold flex items-center gap-1 ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {isCorrect ? '+0.25 điểm' : '0 điểm'}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-3 leading-relaxed">
                      <MathView math={q.question} />
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      {q.options.map((opt) => {
                        let btnStyle = 'border-slate-200 bg-slate-50/50 hover:bg-sky-50 text-slate-700';

                        if (!isSubmitted) {
                          if (userAns === opt.key) {
                            btnStyle = 'border-teal-500 bg-teal-50 text-teal-800 font-bold';
                          }
                        } else {
                          if (opt.key === q.correct) {
                            btnStyle = 'border-emerald-500 bg-emerald-100/70 text-emerald-900 font-bold';
                          } else if (userAns === opt.key) {
                            btnStyle = 'border-rose-500 bg-rose-100/70 text-rose-900 font-bold';
                          } else {
                            btnStyle = 'border-slate-100 bg-slate-50/30 text-slate-400 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={opt.key}
                            disabled={isSubmitted}
                            onClick={() => setUserP1(prev => ({ ...prev, [q.id]: opt.key }))}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 cursor-pointer ${btnStyle}`}
                          >
                            <span className="w-5 h-5 rounded-md bg-white border border-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                              {opt.key}
                            </span>
                            <span><MathView math={opt.text} /></span>
                          </button>
                        );
                      })}
                    </div>

                    {isSubmitted && (
                      <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 text-xs text-slate-700">
                        <strong>Giải thích:</strong> <MathView math={q.explanation} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* =======================================================
              PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI (4 CÂU - 4.0 ĐIỂM)
              ======================================================= */}
          <div className="space-y-4">
            <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-teal-900 text-sm">
                  PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG / SAI (4.0 ĐIỂM)
                </h4>
                <p className="text-xs text-teal-700">
                  Thí sinh trả lời từ câu 1 đến câu 4. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn Đúng hoặc Sai theo quy chế chấm điểm Bộ GD&ĐT.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-white text-teal-800 rounded-lg border border-teal-200">
                4 Câu
              </span>
            </div>

            <div className="space-y-4">
              {EXAM_PART_2.map((q, idx) => {
                const currentAnswers = userP2[q.id] || {};

                return (
                  <div key={q.id} className="bg-white rounded-2xl border border-sky-100 p-4 sm:p-5 shadow-2xs space-y-3">
                    <span className="text-xs font-bold text-slate-800 block">
                      {q.title}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                      <MathView math={q.prompt} />
                    </p>

                    <div className="divide-y divide-slate-100">
                      {q.items.map((item) => {
                        const userChoice = currentAnswers[item.key];
                        const isCorrect = userChoice === item.correct;

                        return (
                          <div key={item.key} className="py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <div className="text-xs text-slate-800 flex-1 leading-relaxed">
                              <strong>{item.key})</strong> <MathView math={item.text} />
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                              <button
                                disabled={isSubmitted}
                                onClick={() => setUserP2(prev => ({
                                  ...prev,
                                  [q.id]: { ...(prev[q.id] || {}), [item.key]: true }
                                }))}
                                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                  userChoice === true
                                    ? isSubmitted
                                      ? item.correct === true
                                        ? 'bg-emerald-600 text-white border-emerald-600'
                                        : 'bg-rose-600 text-white border-rose-600'
                                      : 'bg-teal-600 text-white border-teal-600'
                                    : isSubmitted && item.correct === true
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                                }`}
                              >
                                Đúng
                              </button>

                              <button
                                disabled={isSubmitted}
                                onClick={() => setUserP2(prev => ({
                                  ...prev,
                                  [q.id]: { ...(prev[q.id] || {}), [item.key]: false }
                                }))}
                                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                  userChoice === false
                                    ? isSubmitted
                                      ? item.correct === false
                                        ? 'bg-emerald-600 text-white border-emerald-600'
                                        : 'bg-rose-600 text-white border-rose-600'
                                      : 'bg-teal-600 text-white border-teal-600'
                                    : isSubmitted && item.correct === false
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                                }`}
                              >
                                Sai
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {isSubmitted && (
                      <div className="mt-3 p-3 bg-teal-50/60 rounded-xl border border-teal-100 text-xs text-slate-700 space-y-1">
                        <strong className="text-teal-900 block">Lời giải chi tiết từng ý:</strong>
                        {q.items.map(item => (
                          <div key={item.key} className="text-[11px]">
                            <strong>{item.key})</strong> <MathView math={item.explain} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* =======================================================
              PHẦN III: TRẮC NGHIỆM TRẢ LỜI NGẮN (6 CÂU - 3.0 ĐIỂM)
              ======================================================= */}
          <div className="space-y-4">
            <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-teal-900 text-sm">
                  PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (3.0 ĐIỂM)
                </h4>
                <p className="text-xs text-teal-700">
                  Thí sinh trả lời từ câu 1 đến câu 6. Điền kết quả số thực/nguyên thích hợp vào ô trống (mỗi câu 0.5 điểm).
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-white text-teal-800 rounded-lg border border-teal-200">
                6 Câu
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EXAM_PART_3.map((q, idx) => {
                const userVal = (userP3[q.id] || '').trim();
                const isCorrect = userVal && q.acceptAnswers.map(a => a.toLowerCase()).includes(userVal.toLowerCase());

                return (
                  <div key={q.id} className="bg-white rounded-2xl border border-sky-100 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-slate-800">
                          Câu {idx + 1}:
                        </span>
                        {isSubmitted && (
                          <span className={`text-xs font-bold flex items-center gap-1 ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            {isCorrect ? '+0.5 điểm' : '0 điểm'}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed mb-3">
                        <MathView math={q.question} />
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">Đáp số:</span>
                        <input
                          type="text"
                          disabled={isSubmitted}
                          placeholder="Nhập giá trị số..."
                          value={userP3[q.id] || ''}
                          onChange={(e) => setUserP3(prev => ({ ...prev, [q.id]: e.target.value }))}
                          className={`flex-1 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold focus:outline-none ${
                            isSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                                : 'bg-rose-50 border-rose-400 text-rose-800'
                              : 'bg-slate-50 border-slate-200 focus:border-teal-500 focus:bg-white'
                          }`}
                        />
                      </div>

                      {isSubmitted && (
                        <div className="p-2.5 bg-teal-50/60 rounded-xl border border-teal-100 text-[11px] text-slate-700">
                          <div><strong>Đáp án đúng:</strong> {q.correctAnswer}</div>
                          <div><MathView math={q.explanation} /></div>
                        </div>
                      )}
                    </div>
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
