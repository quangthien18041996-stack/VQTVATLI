import React, { useState } from 'react';
import MathView from './MathView';
import { 
  Calculator, 
  HelpCircle, 
  ChevronRight, 
  Sparkles, 
  TrendingUp, 
  Box, 
  Compass, 
  GitBranch, 
  Key, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Search,
  BookOpen,
  Sliders,
  ExternalLink
} from 'lucide-react';

/* ============================================================
   DANH SÁCH DỮ LIỆU THỦ THUẬT CASIO FX-580VNX & FX-880BTG (4 CHƯƠNG)
   ============================================================ */
const CASIO_DATA = [
  /* ------------------ CHƯƠNG I: ĐẠO HÀM & KHẢO SÁT HÀM SỐ ------------------ */
  {
    id: 'c1_table_minmax',
    chapter: 'part1',
    chapterTitle: 'Chương I • Đạo Hàm & Khảo Sát Đồ Thị',
    title: 'Tìm Giá Trị Lớn Nhất & Nhỏ Nhất (Min - Max) Trên Đoạn [a; b]',
    desc: 'Quét bảng giá trị hàm số f(x) để tìm cực trị, GTLN và GTNN nhanh chóng không cần tính đạo hàm f\'(x).',
    badge: 'Kỹ Năng Kinh Điển',
    fx580: {
      mode: 'MENU 8 (Table - Bảng giá trị)',
      steps: [
        'Nhập hàm số: f(x) = [Biểu thức cần tính]',
        'Nếu máy hỏi g(x), bấm = để bỏ qua (hoặc cài đặt 1 hàm: SHIFT MENU ▾ 1 1)',
        'Cài đặt bảng: Start = a, End = b, Step = (b - a) / 29 (hoặc / 44 khi tắt g(x))',
        'Quan sát cột f(x): Giá trị cao nhất là Max, giá trị thấp nhất là Min'
      ],
      keys: ['MENU', '8', 'f(x)', '=', 'Start', 'End', 'Step = (b-a)/29', '=']
    },
    fx880: {
      mode: 'HOME ➔ Bảng giá trị (Table)',
      steps: [
        'Chọn ứng dụng "Bảng giá trị" (Table), bấm OK',
        'Bấm TOOLS ➔ Chọn "f(x)" ➔ "Định nghĩa f(x)" ➔ Nhập hàm số f(x)',
        'Bấm TOOLS ➔ Chọn "Phạm vi bảng" (Table Range)',
        'Đặt Bắt đầu = a, Kết thúc = b, Bước = (b - a) / 30',
        'Bấm EXECUTE để hiển thị bảng ➔ Cuộn xuống xem Min / Max'
      ],
      keys: ['HOME', 'Table', 'TOOLS', 'f(x)', 'Range', 'Step', 'EXE']
    },
    example: {
      question: 'Tìm giá trị lớn nhất và nhỏ nhất của hàm số $y = x^3 - 3x^2 + 2$ trên đoạn $[0; 3]$.',
      calc580: 'MENU 8 ➔ Nhập $f(x) = x^3 - 3x^2 + 2$ ➔ Start: 0, End: 3, Step: (3-0)/29 ≈ 0.1 ➔ Max = 2 (tại x = 0 và x = 3), Min = -2 (tại x = 2).',
      tip: 'Nếu đoạn có chứa căn hoặc lượng giác (ví dụ [0; 2π]), luôn chuyển đơn vị góc sang Radian: SHIFT MENU 2 2 (580) hoặc SETTINGS ➔ Phép tính ➔ Góc ➔ Radian (880).'
    }
  },
  {
    id: 'c1_derivative_calc',
    chapter: 'part1',
    chapterTitle: 'Chương I • Đạo Hàm & Khảo Sát Đồ Thị',
    title: 'Tính Giá Trị Đạo Hàm Tại 1 Điểm & Viết Phương Trình Tiếp Tuyến',
    desc: 'Tính chính xác hệ số góc k = f\'(x₀) của tiếp tuyến mà không cần tính đạo hàm bằng tay.',
    badge: 'Giải Nhanh Tiếp Tuyến',
    fx580: {
      mode: 'Phím d/dx (SHIFT ∫)',
      steps: [
        'Bấm SHIFT ∫ để mở chức năng tính đạo hàm d/dx(...) | x = ...',
        'Nhập biểu thức hàm số f(x) vào trong dấu ngoặc',
        'Nhập hoành độ tiếp điểm x = x₀ vào ô bên phải',
        'Bấm = ➔ Kết quả chính là hệ số góc tiếp tuyến k = f\'(x₀)'
      ],
      keys: ['SHIFT', '∫ (d/dx)', 'f(x)', '►', 'x₀', '=']
    },
    fx880: {
      mode: 'CATALOG ➔ Phân tích ➔ Đạo hàm',
      steps: [
        'Vào màn hình Tính toán chuẩn ➔ Bấm phím CATALOG',
        'Chọn "Giải tích" (Calculus) ➔ Chọn "Đạo hàm" (d/dx)',
        'Nhập hàm số f(x), bấm phím qua phải nhập x = x₀',
        'Bấm phím EXE để nhận hệ số góc k'
      ],
      keys: ['CATALOG', 'Calculus', 'd/dx', 'f(x)', 'x₀', 'EXE']
    },
    example: {
      question: 'Cho hàm số $y = \\frac{2x - 1}{x + 1}$. Tính hệ số góc của tiếp tuyến của đồ thị tại điểm có hoành độ $x_0 = 1$.',
      calc580: 'Bấm SHIFT ∫ ➔ Nhập $(2x - 1)/(x + 1)$ ➔ Cho $x = 1$ ➔ Bấm = ➔ Máy hiện $0.75 = \\frac{3}{4}$. Vậy $k = \\frac{3}{4}$.',
      tip: 'Phương trình tiếp tuyến tại $M(x_0, y_0)$ là: $y = k(x - x_0) + y_0$. Tính $y_0$ bằng phím CALC tại $x = x_0$.'
    }
  },
  {
    id: 'c1_asymptote_limit',
    chapter: 'part1',
    chapterTitle: 'Chương I • Đạo Hàm & Khảo Sát Đồ Thị',
    title: 'Tìm Đường Tiệm Cận Đứng, Tiệm Cận Ngang Bằng Phím CALC (Limit)',
    desc: 'Kiểm tra giới hạn vô cực lim f(x) để xác định chính xác tiệm cận đứng và tiệm cận ngang khi hàm số phức tạp.',
    badge: 'Chống Sai Bẫy Giới Hạn',
    fx580: {
      mode: 'Phím CALC (Tính giá trị)',
      steps: [
        'Nhập biểu thức f(x) vào màn hình chuẩn (MENU 1)',
        'Tiệm cận ngang (x ➔ +∞): Bấm CALC ➔ Nhập 10⁹ (10 mũ 9) ➔ =',
        'Tiệm cận ngang (x ➔ -∞): Bấm CALC ➔ Nhập -10⁹ ➔ =',
        'Tiệm cận đứng (x ➔ x₀⁺): Bấm CALC ➔ Nhập x₀ + 10⁻⁷ ➔ Nếu ra số cực lớn (10¹⁰) thì x = x₀ là TCĐ'
      ],
      keys: ['MENU', '1', 'f(x)', 'CALC', '10^9', '=']
    },
    fx880: {
      mode: 'Phím VARIABLE ➔ Gán giá trị hoặc phím TOOLS',
      steps: [
        'Nhập biểu thức f(x) vào màn hình Tính toán',
        'Bấm phím TOOLS ➔ Chọn "Tính toán hàm" (Calculate Value)',
        'Gán x = 10^9 để tìm tiệm cận ngang $y = \\lim_{x \\to +\\infty} f(x)$',
        'Gán x = x₀ + 0.000001 để kiểm tra tiệm cận đứng'
      ],
      keys: ['HOME', 'Calculate', 'f(x)', 'TOOLS', 'Calc Value', 'EXE']
    },
    example: {
      question: 'Tìm tiệm cận ngang của đồ thị hàm số $y = \\frac{\\sqrt{x^2 + 1} - x}{2x + 3}$.',
      calc580: 'Nhập hàm số ➔ CALC $x = 10^9$ ➔ Kết quả xấp xỉ $0$ ➔ $y = 0$ là TCN. CALC $x = -10^9$ ➔ Kết quả $-1$ ➔ $y = -1$ là TCN thứ hai!',
      tip: 'Chú ý hàm chứa căn thường có 2 tiệm cận ngang khác nhau ở +∞ và -∞!'
    }
  },

  /* ------------------ CHƯƠNG IV: NGUYÊN HÀM & TÍCH PHÂN ------------------ */
  {
    id: 'c2_definite_integral',
    chapter: 'part2',
    chapterTitle: 'Chương IV • Nguyên Hàm & Tích Phân',
    title: 'Tính Tích Phân Xác Định & Tìm Hằng Số a, b Trong Đề Thi',
    desc: 'Tính tích phân trực tiếp và kỹ thuật bấm máy giải hệ phương trình tìm các hệ số hữu tỉ a, b, c.',
    badge: 'Chống Gian Lận Đề Thi',
    fx580: {
      mode: 'Phím ∫ dx trực tiếp',
      steps: [
        'Bấm phím ∫ dx',
        'Nhập biểu thức f(x) dưới dấu tích phân',
        'Nhập cận dưới a, cận trên b',
        'Bấm = để nhận kết quả số thập phân hoặc phân số',
        'Lưu kết quả vào biến A: Bấm STO ➔ A'
      ],
      keys: ['∫ dx', 'f(x)', '▼ a', '▲ b', '=', 'STO', 'A']
    },
    fx880: {
      mode: 'Phím CATALOG ➔ Giải tích ➔ Tích phân',
      steps: [
        'Màn hình chuẩn ➔ Bấm phím ∫ dx (hoặc CATALOG ➔ Calculus ➔ Integration)',
        'Nhập hàm f(x), cận a và cận b',
        'Bấm EXE để tính toán',
        'Lưu vào biến A: Bấm VARIABLE ➔ Chọn A ➔ Chọn "Lưu kết quả Ans"'
      ],
      keys: ['∫ dx', 'f(x)', 'a, b', 'EXE', 'VARIABLE', 'Store A']
    },
    example: {
      question: 'Biết $\\int_0^1 \\frac{2x + 3}{x + 1} dx = a + b\\ln 2$ với $a, b$ là các số nguyên. Tính $S = a + 2b$.',
      calc580: 'Bấm $\\int_0^1 \\frac{2x+3}{x+1} dx$ ➔ Máy ra $2.693147...$ ➔ Bấm STO A. Ta có $A = a + b\\ln 2 \\implies a = A - b\\ln 2$. Vào MENU 8 (Table): Nhập $f(x) = A - x\\ln 2$ với Start = -5, End = 5, Step = 1. Nhìn bảng thấy tại $x = 1$ thì $f(x) = 2$ nguyên! Vậy $b = 1, a = 2 \\implies S = 2 + 2(1) = 4$.',
      tip: 'Phương pháp bảng Table kết hợp biến A lưu tích phân giúp dò ra đáp án dạng a + b.ln(c) cực nhanh trong 15 giây!'
    }
  },
  {
    id: 'c2_derivative_check_antiderivative',
    chapter: 'part2',
    chapterTitle: 'Chương IV • Nguyên Hàm & Tích Phân',
    title: 'Thử Nghiệm Tìm Nguyên Hàm F(x) Của Hàm Số f(x) Bằng Đạo Hàm',
    desc: 'Nguyên lý: F(x) là nguyên hàm của f(x) khi và chỉ khi F\'(x) - f(x) = 0 với mọi x thuộc tập xác định.',
    badge: 'Xác Suất Đúng 100%',
    fx580: {
      mode: 'Phím d/dx kết hợp trừ f(x₀)',
      steps: [
        'Chọn một giá trị x₀ bất kỳ thuộc TXĐ (ví dụ x₀ = 2.5 hoặc 3.14)',
        'Bấm: d/dx( [Đáp án F(x)] ) | x = x₀  -  [Đề bài f(x₀)]',
        'Bấm =',
        'Nếu kết quả = 0 (hoặc dạng 10⁻¹³ xấp xỉ 0) ➔ Đó là đáp án đúng!'
      ],
      keys: ['SHIFT ∫ (d/dx)', 'Đáp án F(x)', 'x = x₀', '-', 'Đề bài f(x₀)', '=']
    },
    fx880: {
      mode: 'Chức năng d/dx trừ f(x₀)',
      steps: [
        'Nhập d/dx( F(x) ) | x = x₀',
        'Trừ đi giá trị hàm số tại x₀: - f(x₀)',
        'Bấm EXE',
        'Đáp án nào cho kết quả bằng 0 là nguyên hàm chính xác'
      ],
      keys: ['d/dx', 'F(x)', 'x₀', '-', 'f(x₀)', 'EXE']
    },
    example: {
      question: 'Họ tất cả các nguyên hàm của hàm số $f(x) = 2x + \\sin x$ là gì?',
      calc580: 'Bấm $\\left.\\frac{d}{dx}(x^2 - \\cos x)\\right|_{x=2} - (2(2) + \\sin 2)$. Máy hiện đúng bằng $0$. Kết luận ngay đáp án là $F(x) = x^2 - \\cos x + C$.',
      tip: 'Tránh chọn các điểm x₀ đặc biệt như 0, 1 hoặc các điểm làm mẫu số bằng 0. Nên chọn x₀ lẻ như 1.35 hoặc 2.7.'
    }
  },

  /* ------------------ CHƯƠNG V: TỌA ĐỘ TRONG KHÔNG GIAN OXYZ ------------------ */
  {
    id: 'c3_vector_cross_product',
    chapter: 'part3',
    chapterTitle: 'Chương V • Phương Pháp Tọa Độ Trong Không Gian',
    title: 'Tính Tích Có Hướng [u, v], Diện Tích Tam Giác & Thể Tích Khối Hộp',
    desc: 'Sử dụng phân hệ Vector để tính tích có hướng [u, v], tích vô hướng u.v, góc và tích hỗn tạp [u, v].w.',
    badge: 'Cứu Tinh Hình Không Gian',
    fx580: {
      mode: 'MENU 5 (Vector)',
      steps: [
        'Vào MENU 5 ➔ Chọn 1: VctA ➔ Kích thước: 3 ➔ Nhập tọa độ vectơ u',
        'Bấm OPTN ➔ 1 (Tạo vectơ) ➔ Chọn 2: VctB ➔ Kích thước: 3 ➔ Nhập tọa độ vectơ v',
        'Bấm AC để về màn hình tính toán Vector',
        'Tích có hướng [u, v]: Bấm OPTN 3 (VctA) × OPTN 4 (VctB) ➔ Bấm =',
        'Tích vô hướng u · v: Bấm OPTN 3 (VctA) ➔ OPTN ▾ 2 (Tích vô hướng) ➔ OPTN 4 (VctB) ➔ =',
        'Diện tích tam giác: Bấm SHIFT ( (Abs) ➔ Nhập VctA × VctB ➔ Bấm = ➔ Chia 2'
      ],
      keys: ['MENU', '5', 'VctA (3D)', 'OPTN 1', 'VctB (3D)', 'AC', 'VctA × VctB', '=']
    },
    fx880: {
      mode: 'HOME ➔ Vector',
      steps: [
        'Tại màn hình chính HOME ➔ Chọn biểu tượng "Vectơ" (Vector) ➔ OK',
        'Chọn "VctA" ➔ Số chiều: 3 ➔ Nhập tọa độ',
        'Chọn "VctB" ➔ Số chiều: 3 ➔ Nhập tọa độ',
        'Bấm AC về màn hình tính toán',
        'Bấm CATALOG ➔ Vectơ ➔ Chọn VctA, nhân × với VctB ➔ Bấm EXE nhận tích có hướng'
      ],
      keys: ['HOME', 'Vector', 'VctA 3D', 'VctB 3D', 'AC', 'VctA × VctB', 'EXE']
    },
    example: {
      question: 'Cho hai vectơ $\\vec{u} = (1; 2; 3)$ và $\\vec{v} = (2; -1; 1)$. Tính tích có hướng $[\\vec{u}, \\vec{v}]$ và diện tích tam giác tạo bởi hai vectơ.',
      calc580: 'MENU 5 ➔ Gán VctA = (1, 2, 3), VctB = (2, -1, 1). Bấm VctA × VctB ➔ Máy ra (5; 5; -5). Diện tích $S = \\frac{1}{2}|[\\vec{u}, \\vec{v}]| = \\frac{1}{2}\\sqrt{5^2+5^2+(-5)^2} = \\frac{5\\sqrt{3}}{2} \\approx 4.33$.',
      tip: 'Thể tích tứ diện ABCD: Nhập 3 vectơ AB, AC, AD vào VctA, VctB, VctC. Bấm |(VctA × VctB) · VctC| / 6 là ra ngay thể tích chính xác tuyệt đối!'
    }
  },
  {
    id: 'c3_plane_sphere_system',
    chapter: 'part3',
    chapterTitle: 'Chương V • Phương Pháp Tọa Độ Trong Không Gian',
    title: 'Giải Hệ 4 Phương Trình Tìm Tâm & Bán Kính Mặt Cầu Ngoại Tiếp Tứ Diện',
    desc: 'Tìm phương trình mặt cầu x² + y² + z² - 2ax - 2by - 2cz + d = 0 đi qua 4 điểm bằng hệ 4 ẩn số.',
    badge: 'Xử Lý Bài Vận Dụng',
    fx580: {
      mode: 'MENU 9 ➔ 1 ➔ 4 (Hệ 4 phương trình bậc nhất)',
      steps: [
        'Phương trình tổng quát: 2a.x + 2b.y + 2c.z - d = x² + y² + z²',
        'Vào MENU 9 ➔ 1 (Hệ phương trình) ➔ Chọn 4 (4 ẩn a, b, c, d)',
        'Thay lần lượt tọa độ 4 điểm A, B, C, D vào hệ số',
        'Bấm = ➔ Nhận được tâm I(a, b, c) và hệ số d',
        'Bán kính: R = √(a² + b² + c² - d)'
      ],
      keys: ['MENU', '9', '1 (Hệ PT)', '4 (4 ẩn)', 'Nhập ma trận', '=']
    },
    fx880: {
      mode: 'HOME ➔ Phương trình ➔ Hệ phương trình 4 ẩn',
      steps: [
        'Vào HOME ➔ Chọn "Phương trình" (Equation)',
        'Chọn "Hệ phương trình tuyến tính" (Simul Equation) ➔ 4 ẩn số (4 Unknowns)',
        'Nhập các hệ số 2x_i, 2y_i, 2z_i, -1 và x_i² + y_i² + z_i²',
        'Bấm phím EXE để nhận nghiệm a, b, c, d'
      ],
      keys: ['HOME', 'Equation', 'Simul Eq', '4 Unknowns', 'EXE']
    },
    example: {
      question: 'Viết phương trình mặt cầu đi qua 4 điểm $O(0;0;0), A(2;0;0), B(0;4;0), C(0;0;6)$.',
      calc580: 'Vì qua O nên d = 0. Qua A(2;0;0) ➔ 4a = 4 ➔ a = 1. Qua B(0;4;0) ➔ 8b = 16 ➔ b = 2. Qua C(0;0;6) ➔ 12c = 36 ➔ c = 3. Vậy tâm I(1; 2; 3), bán kính $R = \\sqrt{1^2+2^2+3^2} = \\sqrt{14}$.',
      tip: 'Nếu tứ diện có góc tam diện vuông tại O, tâm mặt cầu luôn là I(xA/2; yB/2; zC/2).'
    }
  },

  /* ------------------ CHƯƠNG VI: XÁC SUẤT CÓ ĐIỀU KIỆN ------------------ */
  {
    id: 'c4_bayes_statistics',
    chapter: 'part4',
    chapterTitle: 'Chương VI • Xác Suất Có Điều Kiện & Định Lý Bayes',
    title: 'Tính Xác Suất Toàn Phần & Công Thức Bayes Bằng Biểu Thức Phân Số',
    desc: 'Kỹ thuật nhập chuẩn biểu thức Bayes P(A|B) = P(A).P(B|A) / P(B) tránh sai sót dấu ngoặc phân số phức tạp.',
    badge: 'Đột Phá Toán 12 Mới',
    fx580: {
      mode: 'MENU 1 (Tính toán thường kết hợp phím phân số)',
      steps: [
        'Bước 1: Tính mẫu số P(B) trước: P(B) = P(A₁).P(B|A₁) + P(A₂).P(B|A₂)',
        'Bấm = và lưu vào biến M: Bấm STO ➔ M (Mẫu số)',
        'Bước 2: Tính tử số P(A₁B) = P(A₁).P(B|A₁)',
        'Bấm phím chia: ÷ M (hoặc RECALL M) ➔ Bấm =',
        'Bấm phím S<=>D để chuyển đổi linh hoạt giữa số thập phân và phân số'
      ],
      keys: ['P(B) = ...', 'STO', 'M', 'P(A)×P(B|A)', '÷', 'RCL M', '=']
    },
    fx880: {
      mode: 'Lưu biến qua phím VARIABLE',
      steps: [
        'Tính xác suất toàn phần mẫu số P(B)',
        'Bấm phím VARIABLE ➔ Chọn biến z hoặc M ➔ Lưu kết quả',
        'Nhập tử số P(A).P(B|A) chia cho biến M',
        'Bấm EXE để nhận kết quả phân số tối giản'
      ],
      keys: ['Calculate P(B)', 'VARIABLE', 'Store M', 'Numerator ÷ M', 'EXE']
    },
    example: {
      question: 'Tỷ lệ người nhiễm bệnh là $1\\%$. Xét nghiệm có độ chính xác $95\\%$ (người có bệnh xét nghiệm dương tính $95\\%$, người không bệnh dương tính giả $2\\%$). Tính xác suất một người thực sự mắc bệnh biết rằng kết quả xét nghiệm là dương tính.',
      calc580: 'Mẫu số (tổng dương tính): $P(+) = 0.01 \\times 0.95 + 0.99 \\times 0.02 = 0.0293$ ➔ Bấm STO M. Tử số (có bệnh và dương tính): $0.01 \\times 0.95 = 0.0095$. Bấm $0.0095 \\div M = \\frac{95}{293} \\approx 32.42\\%$.',
      tip: 'Nhớ quy tắc biến đối: nếu đề bài cho tỷ lệ nhiễm bệnh P(A) thì người không nhiễm bệnh là P(A ngang) = 1 - P(A)!'
    }
  },
  {
    id: 'c4_combination_permutation',
    chapter: 'part4',
    chapterTitle: 'Chương VI • Xác Suất Có Điều Kiện & Định Lý Bayes',
    title: 'Tính Tổ Hợp nCr & Chỉnh Hợp nPr Cho Các Bài Toán Lấy Mẫu Không Hoàn Lại',
    desc: 'Tính số phần tử không gian mẫu n(Ω) và số kết quả thuận lợi n(A) trong bài toán rút bi, rút thẻ.',
    badge: 'Tốc Độ Tuyệt Đối',
    fx580: {
      mode: 'Phím SHIFT ÷ (nCr) và SHIFT × (nPr)',
      steps: [
        'Tính tổ hợp chập k của n phần tử: Nhập n ➔ SHIFT ÷ (sẽ hiện chữ C) ➔ Nhập k ➔ Bấm =',
        'Tính chỉnh hợp chập k của n phần tử: Nhập n ➔ SHIFT × (sẽ hiện chữ P) ➔ Nhập k ➔ Bấm =',
        'Tính phân số xác suất trực tiếp: Bấm phím phân số, nhập tử nCr rồi nhập mẫu nCr'
      ],
      keys: ['n', 'SHIFT ÷ (nCr)', 'k', '=']
    },
    fx880: {
      mode: 'CATALOG ➔ Xác suất (Probability) ➔ Tổ hợp / Chỉnh hợp',
      steps: [
        'Bấm phím CATALOG ➔ Chọn mục "Xác suất" (Probability)',
        'Chọn "Tổ hợp" (Combination - C) hoặc "Chỉnh hợp" (Permutation - P)',
        'Nhập số phần tử n, phím qua phải nhập k ➔ Bấm EXE'
      ],
      keys: ['CATALOG', 'Probability', 'Combination (C)', 'n, k', 'EXE']
    },
    example: {
      question: 'Hộp có 7 bi đỏ và 5 bi xanh. Lấy ngẫu nhiên không hoàn lại 3 viên bi. Tính xác suất lấy được đúng 2 viên bi đỏ.',
      calc580: 'Bấm phím phân số: Tử số là $(7\\text{C}2 \\times 5\\text{C}1)$, Mẫu số là $12\\text{C}3$. Bấm = ➔ Máy hiện ngay $\\frac{21}{44} \\approx 0.477$.',
      tip: 'Chức năng nCr xử lý được các số n lên tới 99 mà không bị tràn bộ nhớ màn hình.'
    }
  }
];

export default function CasioGuideModal({ isOpen, onClose }) {
  const [selectedChapter, setSelectedChapter] = useState('all');
  const [selectedModel, setSelectedModel] = useState('both'); // 'both' | '580' | '880'
  const [copiedId, setCopiedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Filter items
  const filteredData = CASIO_DATA.filter((item) => {
    const matchesChapter = selectedChapter === 'all' || item.chapter === selectedChapter;
    const matchesSearch = searchTerm.trim() === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.example.question.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesChapter && matchesSearch;
  });

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-sky-100 flex flex-col overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-start justify-between gap-4 border-b border-indigo-900/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-slate-950">
                  BẢN NÂNG CẤP ĐẶC BIỆT
                </span>
                <span className="text-xs text-amber-300 font-semibold">• Sát Sườn Phòng Thi 2025</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white mt-1">
                Sổ Tay Bấm Máy Tính Casio fx-580VNX & fx-880BTG
              </h2>
              <p className="text-xs text-slate-300">
                Thủ thuật giải nhanh trắc nghiệm 4 chương trọng tâm Toán 12 chuẩn SGK Kết nối tri thức
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Filter Toolbar - 2 Distinct Rows for 100% Visibility */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 space-y-3">
          {/* Row 1: All 5 Chapter Tabs - flex-wrap ensures all 4 chapters + All are 100% visible */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'Tất Cả 4 Chương' },
              { id: 'part1', label: 'Chương I: Đạo Hàm' },
              { id: 'part2', label: 'Chương IV: Tích Phân' },
              { id: 'part3', label: 'Chương V: Oxyz' },
              { id: 'part4', label: 'Chương VI: Xác Suất' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedChapter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedChapter === tab.id
                    ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-400/30'
                    : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-blue-600 border border-slate-200 shadow-2xs'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Row 2: Search Input & Model Switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2.5 border-t border-slate-200/70">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm nhanh thủ thuật (min, max, tích có hướng, tiếp tuyến, bayes...)"
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>

            {/* Model Filter */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setSelectedModel('both')}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  selectedModel === 'both' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cả 2 Dòng Máy
              </button>
              <button
                onClick={() => setSelectedModel('580')}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  selectedModel === '580' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                fx-580VNX
              </button>
              <button
                onClick={() => setSelectedModel('880')}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  selectedModel === '880' ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                fx-880BTG
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {filteredData.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Calculator className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold">Không tìm thấy thủ thuật phù hợp với từ khóa.</p>
              <p className="text-xs">Vui lòng thử tìm với từ khóa khác như "min", "max", "tích phân", "vectơ".</p>
            </div>
          ) : (
            filteredData.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-sky-100 shadow-sm hover:border-sky-300 transition-all overflow-hidden space-y-4 p-5 sm:p-6"
              >
                {/* Header of Item */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                        {item.chapterTitle}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {idx + 1}. {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopy(item.id, `${item.title}\nfx-580VNX: ${item.fx580.steps.join(' -> ')}\nfx-880BTG: ${item.fx880.steps.join(' -> ')}`)}
                    className="self-start sm:self-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === item.id ? 'Đã sao chép' : 'Chép quy trình'}</span>
                  </button>
                </div>

                {/* Machine Step Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* CASIO FX-580VNX (Classic Blue) */}
                  {(selectedModel === 'both' || selectedModel === '580') && (
                    <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                          <span className="font-extrabold text-blue-950 text-xs sm:text-sm">
                            CASIO fx-580VNX
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-blue-700 font-bold bg-blue-100/70 px-2 py-0.5 rounded-md">
                          {item.fx580.mode}
                        </span>
                      </div>

                      {/* Key Sequence Badges */}
                      <div className="flex items-center gap-1 flex-wrap">
                        {item.fx580.keys.map((k, kIdx) => (
                          <span
                            key={kIdx}
                            className="px-2 py-0.5 bg-white border border-blue-200 text-blue-900 rounded font-mono font-bold text-[11px] shadow-2xs"
                          >
                            {k}
                          </span>
                        ))}
                      </div>

                      {/* Detailed Steps */}
                      <ol className="text-xs text-slate-700 space-y-1.5 list-decimal pl-4 leading-relaxed font-sans">
                        {item.fx580.steps.map((st, sIdx) => (
                          <li key={sIdx}>{st}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* CASIO FX-880BTG (Modern Dark Gold) */}
                  {(selectedModel === 'both' || selectedModel === '880') && (
                    <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                          <span className="font-extrabold text-amber-950 text-xs sm:text-sm">
                            CASIO fx-880BTG
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-amber-800 font-bold bg-amber-100/70 px-2 py-0.5 rounded-md">
                          {item.fx880.mode}
                        </span>
                      </div>

                      {/* Key Sequence Badges */}
                      <div className="flex items-center gap-1 flex-wrap">
                        {item.fx880.keys.map((k, kIdx) => (
                          <span
                            key={kIdx}
                            className="px-2 py-0.5 bg-white border border-amber-200 text-amber-900 rounded font-mono font-bold text-[11px] shadow-2xs"
                          >
                            {k}
                          </span>
                        ))}
                      </div>

                      {/* Detailed Steps */}
                      <ol className="text-xs text-slate-700 space-y-1.5 list-decimal pl-4 leading-relaxed font-sans">
                        {item.fx880.steps.map((st, sIdx) => (
                          <li key={sIdx}>{st}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>

                {/* Practical Example Box */}
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>Ví Dụ Thực Chiến Trong Phòng Thi:</span>
                  </div>

                  <p className="text-xs font-semibold text-slate-900 leading-relaxed">
                    <MathView math={item.example.question} />
                  </p>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
                    <strong>Bấm máy & Đọc kết quả:</strong> {item.example.calc580}
                  </div>

                  <div className="text-[11px] text-amber-800 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Mẹo vàng tránh bẫy:</strong> {item.example.tip}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Khuyên dùng cho kỳ thi Tốt Nghiệp THPT 2025 (Chương trình GDPT 2018)</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition-colors"
          >
            Đóng Cẩm Nang
          </button>
        </div>

      </div>
    </div>
  );
}
