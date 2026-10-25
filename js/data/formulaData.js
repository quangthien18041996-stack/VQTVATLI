/**
 * SỔ TAY CÔNG THỨC VẬT LÍ THPT TOÀN DIỆN (LỚP 10, 11, 12)
 */

const FORMULA_DATA = [
  // --- LỚP 10 ---
  {
    id: "f10_1",
    grade: 10,
    category: "Động học",
    name: "Vận tốc trong chuyển động thẳng biến đổi đều",
    latex: "v = v_0 + a t",
    variables: [
      { sym: "v", desc: "Vận tốc tại thời điểm t", unit: "m/s" },
      { sym: "v_0", desc: "Vận tốc ban đầu", unit: "m/s" },
      { sym: "a", desc: "Gia tốc của chuyển động", unit: "m/s²" },
      { sym: "t", desc: "Thời gian chuyển động", unit: "s" }
    ],
    note: "Nhanh dần đều: a và v cùng dấu (a·v > 0). Chậm dần đều: a và v trái dấu (a·v < 0)."
  },
  {
    id: "f10_2",
    grade: 10,
    category: "Động học",
    name: "Độ dịch chuyển chuyển động thẳng biến đổi đều",
    latex: "d = v_0 t + \\frac{1}{2} a t^2",
    variables: [
      { sym: "d", desc: "Độ dịch chuyển", unit: "m" },
      { sym: "v_0", desc: "Vận tốc ban đầu", unit: "m/s" },
      { sym: "a", desc: "Gia tốc", unit: "m/s²" },
      { sym: "t", desc: "Thời gian", unit: "s" }
    ],
    note: "Nếu vật chuyển động thẳng theo một chiều không đổi, d = s (quãng đường)."
  },
  {
    id: "f10_3",
    grade: 10,
    category: "Động học",
    name: "Hệ thức độc lập thời gian (Torricelli)",
    latex: "v^2 - v_0^2 = 2 a d",
    variables: [
      { sym: "v", desc: "Vận tốc lúc sau", unit: "m/s" },
      { sym: "v_0", desc: "Vận tốc lúc trước", unit: "m/s" },
      { sym: "a", desc: "Gia tốc", unit: "m/s²" },
      { sym: "d", desc: "Độ dịch chuyển", unit: "m" }
    ],
    note: "Dùng khi bài toán không cho hoặc không yêu cầu tính thời gian t."
  },
  {
    id: "f10_4",
    grade: 10,
    category: "Động học",
    name: "Rơi tự do - Vận tốc và quãng đường",
    latex: "v = g t; \\quad h = \\frac{1}{2} g t^2; \\quad v = \\sqrt{2gh}",
    variables: [
      { sym: "h", desc: "Độ cao rơi", unit: "m" },
      { sym: "g", desc: "Gia tốc trọng trường", unit: "m/s² (thường lấy 9.8 hoặc 10)" },
      { sym: "v", desc: "Vận tốc chạm đất", unit: "m/s" }
    ],
    note: "Thời gian rơi: t = √(2h/g). Không phụ thuộc vào khối lượng vật rơi."
  },
  {
    id: "f10_5",
    grade: 10,
    category: "Động lực học",
    name: "Định luật II Newton",
    latex: "\\vec{F} = m \\vec{a} \\implies a = \\frac{F}{m}",
    variables: [
      { sym: "F", desc: "Hợp lực tác dụng lên vật", unit: "N (Newton)" },
      { sym: "m", desc: "Khối lượng của vật", unit: "kg" },
      { sym: "a", desc: "Gia tốc thu được", unit: "m/s²" }
    ],
    note: "Vectơ gia tốc luôn cùng hướng với vectơ hợp lực."
  },
  {
    id: "f10_6",
    grade: 10,
    category: "Động lực học",
    name: "Lực ma sát trượt",
    latex: "F_{mst} = \\mu_t N",
    variables: [
      { sym: "F_{mst}", desc: "Độ lớn lực ma sát trượt", unit: "N" },
      { sym: "\\mu_t", desc: "Hệ số ma sát trượt", unit: "không có đơn vị" },
      { sym: "N", desc: "Áp lực vuông góc với mặt tiếp xúc", unit: "N" }
    ],
    note: "Không phụ thuộc vào diện tích bề mặt tiếp xúc và tốc độ của vật."
  },
  {
    id: "f10_7",
    grade: 10,
    category: "Năng lượng & Công",
    name: "Công cơ học & Công suất",
    latex: "A = F \\cdot s \\cdot \\cos\\alpha; \\quad P = \\frac{A}{t} = F \\cdot v",
    variables: [
      { sym: "A", desc: "Công của lực F", unit: "J (Joule)" },
      { sym: "s", desc: "Quãng đường dịch chuyển", unit: "m" },
      { sym: "\\alpha", desc: "Góc hợp bởi lực F và hướng chuyển động", unit: "độ (°)" },
      { sym: "P", desc: "Công suất", unit: "W (Watt)" }
    ],
    note: "α = 90° thì A = 0 (lực không sinh công)."
  },
  {
    id: "f10_8",
    grade: 10,
    category: "Năng lượng & Công",
    name: "Cơ năng và Định luật bảo toàn cơ năng",
    latex: "W = W_d + W_t = \\frac{1}{2} m v^2 + m g z = const",
    variables: [
      { sym: "W", desc: "Cơ năng", unit: "J" },
      { sym: "W_d", desc: "Động năng", unit: "J" },
      { sym: "W_t", desc: "Thế năng trọng trường", unit: "J" },
      { sym: "z", desc: "Độ cao so với mốc thế năng", unit: "m" }
    ],
    note: "Chỉ bảo toàn khi vật chỉ chịu tác dụng của trọng lực hoặc lực đàn hồi."
  },

  // --- LỚP 11 ---
  {
    id: "f11_1",
    grade: 11,
    category: "Dao động điều hòa",
    name: "Phương trình dao động điều hòa tổng quát",
    latex: "x = A \\cos(\\omega t + \\varphi)",
    variables: [
      { sym: "x", desc: "Li độ dao động", unit: "cm hoặc m" },
      { sym: "A", desc: "Biên độ dao động (A > 0)", unit: "cm hoặc m" },
      { sym: "\\omega", desc: "Tần số góc", unit: "rad/s" },
      { sym: "\\varphi", desc: "Pha ban đầu", unit: "rad" }
    ],
    note: "Vận tốc v = -ωA·sin(ωt+φ); Gia tốc a = -ω²x."
  },
  {
    id: "f11_2",
    grade: 11,
    category: "Dao động điều hòa",
    name: "Hệ thức độc lập thời gian giữa x, v, a",
    latex: "A^2 = x^2 + \\frac{v^2}{\\omega^2} = \\frac{a^2}{\\omega^4} + \\frac{v^2}{\\omega^2}",
    variables: [
      { sym: "v_{max}", desc: "Vận tốc cực đại = ωA (tại VTCB)", unit: "cm/s" },
      { sym: "a_{max}", desc: "Gia tốc cực đại = ω²A (tại biên)", unit: "cm/s²" }
    ],
    note: "Vận tốc vuông pha với li độ; Gia tốc ngược pha với li độ."
  },
  {
    id: "f11_3",
    grade: 11,
    category: "Dao động điều hòa",
    name: "Chu kỳ con lắc lò xo & con lắc đơn",
    latex: "T_{lx} = 2\\pi \\sqrt{\\frac{m}{k}}; \\quad T_{cd} = 2\\pi \\sqrt{\\frac{l}{g}}",
    variables: [
      { sym: "m", desc: "Khối lượng quả nặng", unit: "kg" },
      { sym: "k", desc: "Độ cứng lò xo", unit: "N/m" },
      { sym: "l", desc: "Chiều dài dây treo", unit: "m" },
      { sym: "g", desc: "Gia tốc trọng trường", unit: "m/s²" }
    ],
    note: "Chu kỳ con lắc đơn KHÔNG phụ thuộc vào khối lượng m."
  },
  {
    id: "f11_4",
    grade: 11,
    category: "Sóng cơ",
    name: "Bước sóng & Tốc độ truyền sóng",
    latex: "\\lambda = v \\cdot T = \\frac{v}{f}",
    variables: [
      { sym: "\\lambda", desc: "Bước sóng", unit: "m hoặc cm" },
      { sym: "v", desc: "Tốc độ truyền sóng", unit: "m/s" },
      { sym: "T", desc: "Chu kỳ dao động sóng", unit: "s" },
      { sym: "f", desc: "Tần số sóng", unit: "Hz" }
    ],
    note: "Khoảng cách giữa hai đỉnh sóng liên tiếp là một bước sóng λ."
  },
  {
    id: "f11_5",
    grade: 11,
    category: "Sóng cơ",
    name: "Giao thoa sóng cơ (2 nguồn đồng pha)",
    latex: "d_2 - d_1 = k\\lambda \\; (CĐ); \\quad d_2 - d_1 = (k + 0.5)\\lambda \\; (CT)",
    variables: [
      { sym: "d_1, d_2", desc: "Khoảng cách từ điểm xét đến 2 nguồn", unit: "m hoặc cm" },
      { sym: "k", desc: "Bậc giao thoa", unit: "0, ±1, ±2..." }
    ],
    note: "Khoảng cách giữa hai cực đại liên tiếp trên đường nối hai nguồn là λ/2."
  },
  {
    id: "f11_6",
    grade: 11,
    category: "Điện trường & Mạch điện",
    name: "Định luật Ohm toàn mạch",
    latex: "I = \\frac{\\mathcal{E}}{R_N + r}; \\quad U = \\mathcal{E} - I \\cdot r",
    variables: [
      { sym: "I", desc: "Cường độ dòng điện", unit: "A" },
      { sym: "\\mathcal{E}", desc: "Suất điện động của nguồn", unit: "V" },
      { sym: "R_N", desc: "Điện trở mạch ngoài", unit: "Ω" },
      { sym: "r", desc: "Điện trở trong của nguồn", unit: "Ω" }
    ],
    note: "Đoản mạch khi RN = 0, dòng điện cực đại I_dm = E / r có thể gây cháy nổ."
  },

  // --- LỚP 12 ---
  {
    id: "f12_1",
    grade: 12,
    category: "Vật lí nhiệt",
    name: "Nhiệt lượng biến thiên nhiệt độ",
    latex: "Q = m \\cdot c \\cdot \\Delta t = m \\cdot c \\cdot (t_2 - t_1)",
    variables: [
      { sym: "Q", desc: "Nhiệt lượng tỏa ra hoặc thu vào", unit: "J" },
      { sym: "m", desc: "Khối lượng vật chất", unit: "kg" },
      { sym: "c", desc: "Nhiệt dung riêng của chất", unit: "J/(kg·K)" },
      { sym: "\\Delta t", desc: "Độ tăng/giảm nhiệt độ", unit: "°C hoặc K" }
    ],
    note: "Nhiệt dung riêng của nước c_nuoc ≈ 4180 J/(kg·K)."
  },
  {
    id: "f12_2",
    grade: 12,
    category: "Vật lí nhiệt",
    name: "Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng",
    latex: "Q_{nc} = \\lambda \\cdot m; \\quad Q_{hh} = L \\cdot m",
    variables: [
      { sym: "\\lambda", desc: "Nhiệt nóng chảy riêng", unit: "J/kg" },
      { sym: "L", desc: "Nhiệt hóa hơi riêng", unit: "J/kg" },
      { sym: "m", desc: "Khối lượng", unit: "kg" }
    ],
    note: "Trong quá trình chuyển thể (nóng chảy, sôi), nhiệt độ của chất không đổi."
  },
  {
    id: "f12_3",
    grade: 12,
    category: "Khí lí tưởng",
    name: "Phương trình trạng thái khí lí tưởng (Clapeyron - Mendeleev)",
    latex: "p V = n R T = \\frac{m}{\\mu} R T",
    variables: [
      { sym: "p", desc: "Áp suất khí", unit: "Pa (1 atm ≈ 1.013·10⁵ Pa)" },
      { sym: "V", desc: "Thể tích", unit: "m³ (1 L = 10⁻³ m³)" },
      { sym: "n", desc: "Số mol khí", unit: "mol" },
      { sym: "R", desc: "Hằng số khí lí tưởng", unit: "≈ 8.314 J/(mol·K)" },
      { sym: "T", desc: "Nhiệt độ tuyệt đối", unit: "K (T = t°C + 273.15)" }
    ],
    note: "Phương trình tổng quát cho 2 trạng thái: (p1·V1)/T1 = (p2·V2)/T2."
  },
  {
    id: "f12_4",
    grade: 12,
    category: "Khí lí tưởng",
    name: "Định luật Boyle (Quá trình đẳng nhiệt)",
    latex: "p_1 V_1 = p_2 V_2 \\quad (T = const)",
    variables: [
      { sym: "p", desc: "Áp suất", unit: "Pa" },
      { sym: "V", desc: "Thể tích", unit: "m³" }
    ],
    note: "Khi nhiệt độ không đổi, áp suất tỉ lệ nghịch với thể tích."
  },
  {
    id: "f12_5",
    grade: 12,
    category: "Từ trường",
    name: "Lực từ tác dụng lên dòng điện (Lực Ampere)",
    latex: "F = B \\cdot I \\cdot L \\cdot \\sin\\alpha",
    variables: [
      { sym: "F", desc: "Lực từ", unit: "N" },
      { sym: "B", desc: "Độ lớn cảm ứng từ", unit: "T (Tesla)" },
      { sym: "I", desc: "Cường độ dòng điện", unit: "A" },
      { sym: "L", desc: "Chiều dài đoạn dây dẫn", unit: "m" },
      { sym: "\\alpha", desc: "Góc giữa đoạn dây dẫn và vectơ B", unit: "độ (°)" }
    ],
    note: "Xác định hướng bằng quy tắc bàn tay trái."
  },
  {
    id: "f12_6",
    grade: 12,
    category: "Hạt nhân",
    name: "Định luật phóng xạ",
    latex: "N(t) = N_0 \\cdot 2^{-\\frac{t}{T}} = N_0 \\cdot e^{-\\lambda t}",
    variables: [
      { sym: "N(t)", desc: "Số hạt nhân còn lại sau thời gian t", unit: "hạt" },
      { sym: "N_0", desc: "Số hạt nhân ban đầu", unit: "hạt" },
      { sym: "T", desc: "Chu kỳ bán rã", unit: "s, ngày, năm..." },
      { sym: "\\lambda", desc: "Hằng số phóng xạ = ln(2)/T", unit: "1/s" }
    ],
    note: "Khối lượng còn lại cũng tuân theo: m(t) = m_0 · 2^(-t/T)."
  },
  {
    id: "f12_7",
    grade: 12,
    category: "Hạt nhân",
    name: "Năng lượng liên kết & Năng lượng liên kết riêng",
    latex: "W_{lk} = \\Delta m \\cdot c^2; \\quad \\varepsilon = \\frac{W_{lk}}{A}",
    variables: [
      { sym: "\\Delta m", desc: "Độ hụt khối của hạt nhân", unit: "u hoặc kg" },
      { sym: "c", desc: "Tốc độ ánh sáng trong chân không", unit: "3·10⁸ m/s" },
      { sym: "A", desc: "Số khối (tổng số nucleon)", unit: "không có đơn vị" },
      { sym: "\\varepsilon", desc: "Năng lượng liên kết riêng", unit: "MeV/nucleon" }
    ],
    note: "Năng lượng liên kết riêng đặc trưng cho độ bền vững của hạt nhân. Bền nhất khi 50 < A < 95."
  }
];
