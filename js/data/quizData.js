/**
 * NGÂN HÀNG CÂU HỎI TRẮC NGHIỆM VẬT LÍ THPT
 * Chuẩn cấu trúc đề thi tốt nghiệp THPT mới nhất (3 định dạng: Nhiều lựa chọn, Đúng/Sai, Trả lời ngắn)
 */

const QUIZ_DATA = {
  // === BỘ CÂU HỎI THEO LỚP 10 ===
  grade10: [
    {
      id: "q10_1",
      type: "mcq",
      question: "Một chất điểm chuyển động thẳng biến đổi đều với phương trình vận tốc $v = 4 + 2t$ (m/s). Gia tốc của chất điểm là:",
      options: [
        "A. $2 \\; m/s^2$",
        "B. $4 \\; m/s^2$",
        "C. $1 \\; m/s^2$",
        "D. $0.5 \\; m/s^2$"
      ],
      correct: 0,
      explain: "So sánh phương trình $v = v_0 + at$ với $v = 4 + 2t$, ta có vận tốc đầu $v_0 = 4 \\; m/s$ và gia tốc $a = 2 \\; m/s^2$."
    },
    {
      id: "q10_2",
      type: "mcq",
      question: "Một vật có khối lượng $m = 2 \\; kg$ được kéo bởi lực $F = 10 \\; N$ theo phương ngang. Bỏ qua ma sát. Gia tốc của vật là:",
      options: [
        "A. $20 \\; m/s^2$",
        "B. $5 \\; m/s^2$",
        "C. $2 \\; m/s^2$",
        "D. $8 \\; m/s^2$"
      ],
      correct: 1,
      explain: "Theo định luật II Newton: $a = \\frac{F}{m} = \\frac{10}{2} = 5 \\; m/s^2$."
    },
    {
      id: "q10_3",
      type: "mcq",
      question: "Một vật rơi tự do từ độ cao $h = 20 \\; m$ xuống đất. Lấy $g = 10 \\; m/s^2$. Thời gian chạm đất của vật là:",
      options: [
        "A. $1 \\; s$",
        "B. $2 \\; s$",
        "C. $4 \\; s$",
        "D. $0.5 \\; s$"
      ],
      correct: 1,
      explain: "Thời gian rơi: $t = \\sqrt{\\frac{2h}{g}} = \\sqrt{\\frac{2 \\times 20}{10}} = \\sqrt{4} = 2 \\; s$."
    },
    {
      id: "q10_4",
      type: "mcq",
      question: "Đại lượng nào sau đây là đại lượng vectơ?",
      options: [
        "A. Quãng đường",
        "B. Khối lượng",
        "C. Độ dịch chuyển",
        "D. Thời gian"
      ],
      correct: 2,
      explain: "Độ dịch chuyển là đại lượng vectơ vì có cả độ lớn và hướng xác định (nối điểm đầu và điểm cuối)."
    },
    {
      id: "q10_5",
      type: "mcq",
      question: "Khi góc hợp bởi lực tác dụng và hướng chuyển động là $\\alpha = 90^\\circ$ thì công của lực đó bằng:",
      options: [
        "A. Lớn hơn 0",
        "B. Nhỏ hơn 0",
        "C. Bằng 0",
        "D. Vô cùng lớn"
      ],
      correct: 2,
      explain: "Công cơ học $A = F \\cdot s \\cdot \\cos 90^\\circ = 0$. Ví dụ lực hướng tâm không sinh công."
    }
  ],

  // === BỘ CÂU HỎI THEO LỚP 11 ===
  grade11: [
    {
      id: "q11_1",
      type: "mcq",
      question: "Một con lắc lò xo gồm vật nặng $m = 100 \\; g$ và lò xo có độ cứng $k = 100 \\; N/m$. Chu kỳ dao động riêng của con lắc là (lấy $\\pi^2 \\approx 10$):",
      options: [
        "A. $0.2 \\; s$",
        "B. $0.4 \\; s$",
        "C. $1 \\; s$",
        "D. $2 \\; s$"
      ],
      correct: 0,
      explain: "Đổi $m = 100 \\; g = 0.1 \\; kg$. Chu kỳ $T = 2\\pi \\sqrt{\\frac{m}{k}} = 2\\pi \\sqrt{\\frac{0.1}{100}} = 2\\pi \\cdot \\frac{1}{10\\sqrt{10}} = \\frac{2\\pi}{10\\pi} = 0.2 \\; s$."
    },
    {
      id: "q11_2",
      type: "mcq",
      question: "Trong dao động điều hòa, gia tốc của vật biến thiên:",
      options: [
        "A. Cùng pha với li độ",
        "B. Sớm pha $\\pi/2$ so với vận tốc",
        "C. Ngược pha với vận tốc",
        "D. Trễ pha $\\pi/2$ so với li độ"
      ],
      correct: 1,
      explain: "Gia tốc sớm pha $\\pi/2$ so với vận tốc và ngược pha (lệch pha $\\pi$) so với li độ ($a = -\\omega^2 x$)."
    },
    {
      id: "q11_3",
      type: "mcq",
      question: "Một sóng cơ có tần số $f = 50 \\; Hz$ truyền với tốc độ $v = 100 \\; m/s$. Bước sóng của sóng này là:",
      options: [
        "A. $2 \\; m$",
        "B. $0.5 \\; m$",
        "C. $5000 \\; m$",
        "D. $20 \\; m$"
      ],
      correct: 0,
      explain: "Bước sóng $\\lambda = \\frac{v}{f} = \\frac{100}{50} = 2 \\; m$."
    },
    {
      id: "q11_4",
      type: "mcq",
      question: "Trong hiện tượng giao thoa sóng cơ trên mặt nước với hai nguồn cùng pha, những điểm dao động với biên độ cực đại thỏa mãn:",
      options: [
        "A. $d_2 - d_1 = k \\lambda$",
        "B. $d_2 - d_1 = (k + 0.5)\\lambda$",
        "C. $d_2 - d_1 = (2k + 1)\\frac{\\lambda}{4}$",
        "D. $d_2 - d_1 = \\frac{k\\lambda}{2}$"
      ],
      correct: 0,
      explain: "Hiệu khoảng cách tới 2 nguồn đồng pha tại cực đại bằng một số nguyên lần bước sóng: $d_2 - d_1 = k\\lambda$."
    },
    {
      id: "q11_5",
      type: "mcq",
      question: "Đơn vị của điện dung của tụ điện trong hệ SI là:",
      options: [
        "A. Vôn (V)",
        "B. Cu-lông (C)",
        "C. Fara (F)",
        "D. Ôm (Ω)"
      ],
      correct: 2,
      explain: "Điện dung $C = Q/U$, đơn vị trong hệ SI là Fara (F)."
    }
  ],

  // === BỘ CÂU HỎI THEO LỚP 12 ===
  grade12: [
    {
      id: "q12_1",
      type: "mcq",
      question: "Nhiệt độ $27^{\\circ}C$ tương ứng với nhiệt độ nào trong thang Kelvin?",
      options: [
        "A. $300.15 \\; K$",
        "B. $273.15 \\; K$",
        "C. $-246.15 \\; K$",
        "D. $373.15 \\; K$"
      ],
      correct: 0,
      explain: "$T(K) = t(^{\\circ}C) + 273.15 = 27 + 273.15 = 300.15 \\; K$."
    },
    {
      id: "q12_2",
      type: "mcq",
      question: "Một khối khí lí tưởng được nén đẳng nhiệt từ thể tích $8 \\; L$ xuống $2 \\; L$. Biết áp suất ban đầu là $1 \\; atm$. Áp suất của khối khí sau khi nén là:",
      options: [
        "A. $0.25 \\; atm$",
        "B. $2 \\; atm$",
        "C. $4 \\; atm$",
        "D. $8 \\; atm$"
      ],
      correct: 2,
      explain: "Theo định luật Boyle (đẳng nhiệt): $p_1 V_1 = p_2 V_2 \\implies p_2 = \\frac{p_1 V_1}{V_2} = \\frac{1 \\times 8}{2} = 4 \\; atm$."
    },
    {
      id: "q12_3",
      type: "mcq",
      question: "Đại lượng nào sau đây đặc trưng cho mức độ BỀN VỮNG của hạt nhân?",
      options: [
        "A. Khối lượng của hạt nhân",
        "B. Năng lượng liên kết riêng",
        "C. Năng lượng liên kết toàn phần",
        "D. Độ hụt khối"
      ],
      correct: 1,
      explain: "Năng lượng liên kết riêng $\\varepsilon = W_{lk}/A$ (năng lượng liên kết tính trên một nucleon) là thước đo chính xác nhất cho độ bền vững của hạt nhân."
    },
    {
      id: "q12_4",
      type: "mcq",
      question: "Chất phóng xạ có chu kỳ bán rã $T = 10$ ngày. Sau $20$ ngày, tỉ lệ phần trăm số hạt nhân bị phân rã là:",
      options: [
        "A. $25\\%$",
        "B. $50\\%$",
        "C. $75\\%$",
        "D. $87.5\\%$"
      ],
      correct: 2,
      explain: "Sau $t = 2T = 20$ ngày, số hạt còn lại là $N = N_0 \\cdot 2^{-2} = \\frac{N_0}{4} = 25\\%$. Vậy số hạt đã bị phân rã là $100\\% - 25\\% = 75\\%$."
    },
    {
      id: "q12_5",
      type: "mcq",
      question: "Một đoạn dây dẫn dài $0.2 \\; m$ đặt vuông góc với vectơ cảm ứng từ $B = 0.5 \\; T$. Cường độ dòng điện qua dây là $4 \\; A$. Lực từ tác dụng lên đoạn dây là:",
      options: [
        "A. $0.4 \\; N$",
        "B. $0.2 \\; N$",
        "C. $0.1 \\; N$",
        "D. $0.8 \\; N$"
      ],
      correct: 0,
      explain: "Lực từ $F = B I L \\sin(90^\\circ) = 0.5 \\times 4 \\times 0.2 \\times 1 = 0.4 \\; N$."
    }
  ],

  // === ĐỀ THI THỬ TỐT NGHIỆP THPT QUỐC GIA 2025 (FULL 3 PHẦN CHUẨN ĐỔI MỚI) ===
  nationalExam2025: {
    title: "Đề Thi Thử Tốt Nghiệp THPT 2025 - Môn Vật Lí (Cấu Trúc Mới)",
    duration: 50, // phút
    totalQuestions: 28, // 18 mcq + 4 tf + 6 short
    
    // PHẦN I: 18 CÂU TRẮC NGHIỆM NHIỀU LỰA CHỌN (4.5 ĐIỂM - MỖI CÂU 0.25 ĐIỂM)
    part1: [
      {
        id: "p1_1",
        q: "Công thức tính chu kỳ dao động của con lắc lò xo có độ cứng $k$ mang vật nặng khối lượng $m$ là:",
        options: [
          "A. $T = 2\\pi \\sqrt{\\frac{m}{k}}$",
          "B. $T = 2\\pi \\sqrt{\\frac{k}{m}}$",
          "C. $T = \\frac{1}{2\\pi} \\sqrt{\\frac{m}{k}}$",
          "D. $T = 2\\pi \\sqrt{\\frac{g}{l}}$"
        ],
        correct: 0,
        explain: "Chu kỳ dao động riêng của con lắc lò xo: $T = 2\\pi \\sqrt{\\frac{m}{k}}$."
      },
      {
        id: "p1_2",
        q: "Một chất điểm dao động điều hòa có phương trình $x = 6\\cos(4\\pi t - \\pi/3)$ (cm). Vận tốc cực đại của chất điểm là:",
        options: [
          "A. $24\\pi \\; cm/s$",
          "B. $6\\pi \\; cm/s$",
          "C. $12\\pi \\; cm/s$",
          "D. $24 \\; cm/s$"
        ],
        correct: 0,
        explain: "$v_{max} = \\omega A = 4\\pi \\times 6 = 24\\pi \\; cm/s$."
      },
      {
        id: "p1_3",
        q: "Khi một sóng âm truyền từ không khí vào nước thì:",
        options: [
          "A. Bước sóng giảm, tần số không đổi",
          "B. Bước sóng tăng, tần số không đổi",
          "C. Vận tốc truyền sóng giảm, tần số tăng",
          "D. Cả tần số và bước sóng đều tăng"
        ],
        correct: 1,
        explain: "Khi truyền qua các môi trường khác nhau, tần số $f$ không đổi. Tốc độ âm trong nước lớn hơn trong không khí ($v_{nuoc} > v_{kk}$) nên bước sóng $\\lambda = \\frac{v}{f}$ tăng."
      },
      {
        id: "p1_4",
        q: "Nội năng của một lượng khí lí tưởng đơn nguyên tử chỉ phụ thuộc vào:",
        options: [
          "A. Áp suất của chất khí",
          "B. Thể tích của chất khí",
          "C. Nhiệt độ của chất khí",
          "D. Khối lượng riêng của chất khí"
        ],
        correct: 2,
        explain: "Đối với khí lí tưởng, bỏ qua thế năng tương tác phân tử, nội năng chỉ gồm động năng nhiệt phân tử nên chỉ phụ thuộc vào nhiệt độ tuyệt đối $T$."
      },
      {
        id: "p1_5",
        q: "Hạt nhân $_{11}^{23}Na$ có cấu tạo gồm:",
        options: [
          "A. 11 proton và 23 neutron",
          "B. 11 neutron và 12 proton",
          "C. 11 proton và 12 neutron",
          "D. 23 proton và 11 neutron"
        ],
        correct: 2,
        explain: "Số hiệu nguyên tử $Z = 11$ (11 proton). Số neutron $N = A - Z = 23 - 11 = 12$ neutron."
      },
      {
        id: "p1_6",
        q: "Một vật có khối lượng $m = 500 \\; g$ chuyển động với tốc độ $v = 4 \\; m/s$. Động năng của vật bằng:",
        options: [
          "A. $4 \\; J$",
          "B. $2 \\; J$",
          "C. $8 \\; J$",
          "D. $1 \\; J$"
        ],
        correct: 0,
        explain: "Đổi $m = 0.5 \\; kg$. $W_d = \\frac{1}{2} m v^2 = \\frac{1}{2} \\times 0.5 \\times 4^2 = 4 \\; J$."
      }
    ],

    // PHẦN II: 4 CÂU ĐÚNG / SAI (4.0 ĐIỂM)
    // Mỗi câu có 4 ý a, b, c, d
    // Thang điểm Bộ GD&ĐT: Đúng 1 ý: 0.1đ; đúng 2 ý: 0.25đ; đúng 3 ý: 0.5đ; đúng 4 ý: 1.0đ
    part2: [
      {
        id: "p2_1",
        title: "Câu 1: Xét một con lắc lò xo treo thẳng đứng gồm vật nặng m = 200g và lò xo nhẹ có độ cứng k = 50 N/m. Kéo vật xuống dưới vị trí cân bằng 4 cm rồi thả nhẹ cho dao động điều hòa. Lấy g = 10 m/s², π² = 10.",
        statements: [
          { text: "a) Độ dãn của lò xo ở vị trí cân bằng là Δl₀ = 4 cm.", correct: true, explain: "Δl₀ = mg/k = (0.2 × 10) / 50 = 0.04 m = 4 cm." },
          { text: "b) Biên độ dao động của con lắc là A = 2 cm.", correct: false, explain: "Thả nhẹ tại vị trí kéo 4 cm nên biên độ A = 4 cm." },
          { text: "c) Chu kỳ dao động của con lắc là T = 0.4 s.", correct: true, explain: "T = 2π√(m/k) = 2π√(0.2/50) = 2π√(0.004) = 2π × 0.0632 ≈ 0.4 s." },
          { text: "d) Lực đàn hồi cực tiểu của lò xo trong quá trình dao động bằng 0 N.", correct: true, explain: "Vì A = Δl₀ = 4 cm nên ở vị trí cao nhất lò xo không biến dạng, F_dh_min = 0." }
        ]
      },
      {
        id: "p2_2",
        title: "Câu 2: Một khối khí lí tưởng xác định thực hiện quá trình giãn nở đẳng nhiệt từ thể tích V₁ = 2 lít, áp suất p₁ = 4 atm đến thể tích V₂ = 8 lít.",
        statements: [
          { text: "a) Trong quá trình đẳng nhiệt, nhiệt độ của khối khí không thay đổi.", correct: true, explain: "Đúng theo định nghĩa quá trình đẳng nhiệt (T = hằng số)." },
          { text: "b) Áp suất chất khí ở trạng thái 2 là p₂ = 16 atm.", correct: false, explain: "p₂ = p₁V₁ / V₂ = (4 × 2) / 8 = 1 atm (áp suất giảm khi giãn nở)." },
          { text: "c) Tích áp suất và thể tích p·V luôn là một hằng số trong suốt quá trình.", correct: true, explain: "Theo định luật Boyle: pV = const." },
          { text: "d) Độ biến thiên nội năng của khối khí trong quá trình này bằng 0 (ΔU = 0).", correct: true, explain: "Vì nhiệt độ không đổi nên nội năng khí lí tưởng không đổi: ΔU = 0." }
        ]
      }
    ],

    // PHẦN III: CÂU HỎI TRẢ LỜI NGẮN (ĐIỀN SỐ) (1.5 ĐIỂM - MỖI CÂU 0.25 ĐIỂM)
    part3: [
      {
        id: "p3_1",
        q: "Một vật nhỏ chuyển động trên quỹ đạo thẳng với gia tốc không đổi $a = 2 \\; m/s^2$. Vận tốc ban đầu là $v_0 = 3 \\; m/s$. Tính quãng đường vật đi được trong $4$ giây đầu tiên (tính theo đơn vị mét).",
        answer: 28,
        tolerance: 0.1,
        unit: "m",
        explain: "$s = v_0 t + \\frac{1}{2} a t^2 = 3 \\times 4 + \\frac{1}{2} \\times 2 \\times 4^2 = 12 + 16 = 28 \\; m$."
      },
      {
        id: "p3_2",
        q: "Một lượng nước có khối lượng $m = 2 \\; kg$ ở nhiệt độ $20^{\\circ}C$ được đun nóng đến $50^{\\circ}C$. Biết nhiệt dung riêng của nước là $c = 4200 \\; J/(kg\\cdot K)$. Nhiệt lượng cần cung cấp cho nước là bao nhiêu kilôjun (kJ)?",
        answer: 252,
        tolerance: 1,
        unit: "kJ",
        explain: "$Q = mc\\Delta t = 2 \\times 4200 \\times (50 - 20) = 252000 \\; J = 252 \\; kJ$."
      },
      {
        id: "p3_3",
        q: "Đồng vị phóng xạ $_{53}^{131}I$ có chu kỳ bán rã là $8$ ngày. Sau $24$ ngày, từ $160 \\; mg$ chất phóng xạ ban đầu thì còn lại bao nhiêu miligam (mg)?",
        answer: 20,
        tolerance: 0.1,
        unit: "mg",
        explain: "$t = 24 = 3T$. Khối lượng còn lại: $m = m_0 \\cdot 2^{-3} = \\frac{160}{8} = 20 \\; mg$."
      }
    ]
  }
};
