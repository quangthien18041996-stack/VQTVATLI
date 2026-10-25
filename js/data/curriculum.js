/**
 * DỮ LIỆU CHƯƠNG TRÌNH VẬT LÍ THPT (LỚP 10, 11, 12 - GDPT 2018 MỚI NHẤT)
 */

const CURRICULUM_DATA = {
  10: {
    title: "Vật Lí Lớp 10: Cơ Học & Năng Lượng",
    badge: "Lớp 10",
    description: "Nền tảng về chuyển động, các định luật Newton, năng lượng, động lượng và chuyển động tròn.",
    chapters: [
      {
        id: "c10_1",
        title: "Chương 1: Mở đầu & Các phép đo trong Vật lí",
        icon: "ruler",
        lessons: [
          {
            id: "l10_1_1",
            title: "Bài 1: Khái quát về môn Vật lí & Phương pháp nghiên cứu",
            summary: "Đối tượng nghiên cứu của Vật lí, phương pháp thực nghiệm và phương pháp lý thuyết. Quy tắc an toàn trong phòng thí nghiệm.",
            content: `
              <h4>1. Đối tượng và mục tiêu nghiên cứu của Vật lí</h4>
              <p>Vật lí là ngành khoa học tự nhiên nghiên cứu về các dạng vận động của vật chất và năng lượng, từ vi mô (hạt sơ cấp, nguyên tử) đến vĩ mô (vũ trụ).</p>
              
              <h4>2. Các phương pháp nghiên cứu Vật lí</h4>
              <ul>
                <li><strong>Phương pháp thực nghiệm:</strong> Quan sát hiện tượng &rarr; Đề xuất giả thuyết &rarr; Thiết kế thí nghiệm kiểm chứng &rarr; Rút ra quy luật / định luật.</li>
                <li><strong>Phương pháp lý thuyết:</strong> Xuất phát từ định luật đã biết &rarr; Sử dụng toán học suy luận &rarr; Đưa ra dự đoán &rarr; Thực nghiệm kiểm chứng.</li>
              </ul>

              <h4>3. Sai số trong phép đo vật lí</h4>
              <p>Kết quả đo một đại lượng $A$: <strong>$A = \\bar{A} \\pm \\Delta A$</strong></p>
              <ul>
                <li><strong>Sai số ngẫu nhiên:</strong> Do thao tác đo, giác quan người làm thí nghiệm, hoặc biến đổi ngẫu nhiên của môi trường. Khắc phục bằng cách đo nhiều lần và lấy trung bình.</li>
                <li><strong>Sai số hệ thống:</strong> Do dụng cụ chưa chuẩn (lệch điểm 0), áp dụng công thức gần đúng. Khắc phục bằng hiệu chỉnh dụng cụ.</li>
                <li><strong>Sai số tuyệt đối:</strong> $\\Delta A = \\overline{\\Delta A} + \\Delta A_{dc}$ (với $\\Delta A_{dc}$ thường lấy bằng nửa hoặc một độ chia nhỏ nhất).</li>
                <li><strong>Sai số tương đối:</strong> $\\delta A = \\frac{\\Delta A}{\\bar{A}} \\times 100\\%$ (đặc trưng cho độ chính xác của phép đo).</li>
              </ul>
            `,
            keyFormulas: [
              { name: "Giá trị trung bình", math: "\\bar{A} = \\frac{A_1 + A_2 + ... + A_n}{n}" },
              { name: "Sai số tương đối", math: "\\delta A = \\frac{\\Delta A}{\\bar{A}} \\times 100\\%" }
            ],
            tips: "Khi viết kết quả đo, chữ số có nghĩa của sai số thường lấy tối đa 1 hoặc 2 chữ số; số chữ số thập phân của $\\bar{A}$ phải tương ứng với $\\Delta A$."
          },
          {
            id: "l10_1_2",
            title: "Bài 2: Độ dịch chuyển và Vận tốc",
            summary: "Phân biệt quãng đường đi được và độ dịch chuyển. Vận tốc trung bình và tốc độ tức thời.",
            content: `
              <h4>1. Quãng đường và Độ dịch chuyển</h4>
              <ul>
                <li><strong>Quãng đường ($s$):</strong> Độ dài quỹ đạo chuyển động, là đại lượng vô hướng luôn dương ($s \\ge 0$).</li>
                <li><strong>Độ dịch chuyển ($\\vec{d}$):</strong> Vectơ nối từ vị trí đầu đến vị trí cuối của chuyển động. Có thể âm, dương hoặc bằng 0.</li>
                <li>$d \\le s$, dấu bằng xảy ra khi vật chuyển động thẳng và không đổi chiều.</li>
              </ul>

              <h4>2. Tốc độ và Vận tốc</h4>
              <ul>
                <li><strong>Tốc độ trung bình:</strong> $v_{tb} = \\frac{s}{t}$ (đặc trưng cho sự nhanh chậm của chuyển động).</li>
                <li><strong>Vận tốc trung bình:</strong> $\\vec{v}_{tb} = \\frac{\\vec{d}}{\\Delta t}$ (đặc trưng cho độ nhanh chậm và hướng dịch chuyển).</li>
                <li><strong>Vận tốc tổng hợp:</strong> $\\vec{v}_{13} = \\vec{v}_{12} + \\vec{v}_{23}$ (vật 1 đối với vật 3 bằng vận tốc vật 1 đối với vật 2 cộng vận tốc vật 2 đối với vật 3).</li>
              </ul>
            `,
            keyFormulas: [
              { name: "Độ dịch chuyển", math: "d = x_2 - x_1" },
              { name: "Tốc độ trung bình", math: "v_{tb} = \\frac{s}{t}" },
              { name: "Vận tốc tổng hợp", math: "\\vec{v}_{13} = \\vec{v}_{12} + \\vec{v}_{23}" }
            ],
            tips: "Khi hai chuyển động cùng phương ngược chiều: $v_{13} = |v_{12} - v_{23}|$. Khi vuông góc: $v_{13} = \\sqrt{v_{12}^2 + v_{23}^2}$."
          }
        ]
      },
      {
        id: "c10_2",
        title: "Chương 2: Động học - Chuyển động biến đổi",
        icon: "activity",
        lessons: [
          {
            id: "l10_2_1",
            title: "Bài 3: Chuyển động thẳng biến đổi đều",
            summary: "Gia tốc, phương trình vận tốc, phương trình tọa độ và công thức liên hệ độc lập thời gian.",
            content: `
              <h4>1. Khái niệm Gia tốc</h4>
              <p>Gia tốc là đại lượng vectơ đặc trưng cho sự thay đổi nhanh hay chậm của vận tốc:</p>
              <p>$$\\vec{a} = \\frac{\\Delta \\vec{v}}{\\Delta t} = \\frac{\\vec{v} - \\vec{v}_0}{t - t_0} \\quad (m/s^2)$$</p>
              <ul>
                <li><strong>Nhanh dần đều:</strong> $\\vec{a}$ cùng chiều $\\vec{v} \\iff a \\cdot v > 0$.</li>
                <li><strong>Chậm dần đều:</strong> $\\vec{a}$ ngược chiều $\\vec{v} \\iff a \\cdot v < 0$.</li>
              </ul>

              <h4>2. Hệ thống công thức cốt lõi</h4>
              <ul>
                <li>Vận tốc theo thời gian: $v = v_0 + a t$</li>
                <li>Độ dịch chuyển: $d = v_0 t + \\frac{1}{2} a t^2$</li>
                <li>Công thức độc lập thời gian (hệ thức Torricelli): $v^2 - v_0^2 = 2 a d$</li>
              </ul>
            `,
            keyFormulas: [
              { name: "Vận tốc tức thời", math: "v = v_0 + a t" },
              { name: "Độ dịch chuyển", math: "d = v_0 t + \\frac{1}{2} a t^2" },
              { name: "Hệ thức độc lập", math: "v^2 - v_0^2 = 2ad" }
            ],
            tips: "Chú ý dấu của $a$ và $v_0$: chọn chiều dương là chiều chuyển động thì $v_0 > 0$. Nếu nhanh dần đều thì $a > 0$, nếu chậm dần đều (như hãm phanh) thì $a < 0$."
          },
          {
            id: "l10_2_2",
            title: "Bài 4: Rơi tự do & Chuyển động ném",
            summary: "Sự rơi tự do dưới tác dụng của trọng lực. Chuyển động ném ngang và ném xiên.",
            content: `
              <h4>1. Sự rơi tự do</h4>
              <p>Rơi tự do là chuyển động rơi chỉ dưới tác dụng của trọng lực trong chân không (hoặc lực cản không khí không đáng kể).</p>
              <p>Tính chất: Là chuyển động thẳng nhanh dần đều theo phương thẳng đứng, hướng xuống dưới với gia tốc rơi tự do $g \\approx 9.8$ hoặc $9.81 \\approx 10 m/s^2$.</p>
              <ul>
                <li>Vận tốc: $v = g t$</li>
                <li>Quãng đường rơi: $h = \\frac{1}{2} g t^2 \\implies t = \\sqrt{\\frac{2h}{g}}$</li>
                <li>Vận tốc chạm đất: $v_{cd} = \\sqrt{2gh}$</li>
              </ul>

              <h4>2. Chuyển động ném ngang</h4>
              <p>Phân tích thành 2 chuyển động thành phần độc lập:</p>
              <ul>
                <li><strong>Theo phương $Ox$ (ngang):</strong> Chuyển động thẳng đều: $a_x = 0; \\; v_x = v_0; \\; x = v_0 t$.</li>
                <li><strong>Theo phương $Oy$ (thẳng đứng hướng xuống):</strong> Rơi tự do: $a_y = g; \\; v_y = gt; \\; y = \\frac{1}{2}gt^2$.</li>
                <li>Phương trình quỹ đạo: $y = \\frac{g}{2 v_0^2} x^2$ (là một nhánh parabol).</li>
                <li>Thời gian bay: $t = \\sqrt{\\frac{2h}{g}}$ (không phụ thuộc vào $v_0$!).</li>
                <li>Tầm ném xa: $L = x_{max} = v_0 \\sqrt{\\frac{2h}{g}}$.</li>
              </ul>
            `,
            keyFormulas: [
              { name: "Thời gian rơi / bay", math: "t = \\sqrt{\\frac{2h}{g}}" },
              { name: "Tầm xa ném ngang", math: "L = v_0 \\sqrt{\\frac{2h}{g}}" },
              { name: "Vận tốc chạm đất", math: "v = \\sqrt{v_0^2 + 2gh}" }
            ],
            tips: "Một vật ném ngang và một vật thả rơi tự do từ cùng độ cao sẽ chạm đất đồng thời!"
          }
        ]
      },
      {
        id: "c10_3",
        title: "Chương 3: Động lực học - Các định luật Newton",
        icon: "zap",
        lessons: [
          {
            id: "l10_3_1",
            title: "Bài 5: Ba định luật Newton & Các lực cơ học",
            summary: "Định luật I (quán tính), Định luật II ($F = ma$), Định luật III (tương tác). Lực ma sát, trọng lực, lực đàn hồi.",
            content: `
              <h4>1. Ba định luật Newton</h4>
              <ul>
                <li><strong>Định luật I:</strong> Nếu một vật không chịu tác dụng của lực nào hoặc chịu tác dụng của các lực có hợp lực bằng 0 thì vật đang đứng yên tiếp tục đứng yên, đang chuyển động sẽ tiếp tục chuyển động thẳng đều (Quán tính).</li>
                <li><strong>Định luật II:</strong> Gia tốc của một vật cùng hướng với lực tác dụng, tỉ lệ thuận với độ lớn của lực và tỉ lệ nghịch với khối lượng của vật:
                  $$\\vec{a} = \\frac{\\vec{F}_{hl}}{m} \\iff \\vec{F}_{hl} = m \\vec{a}$$
                </li>
                <li><strong>Định luật III:</strong> Trong mọi trường hợp, khi vật A tác dụng lên vật B một lực thì vật B cũng tác dụng lại vật A một lực. Hai lực này là hai lực trực đối:
                  $$\\vec{F}_{BA} = - \\vec{F}_{AB}$$
                  <em>Lưu ý: Hai lực trực đối tác dụng lên hai vật khác nhau nên không triệt tiêu nhau!</em>
                </li>
              </ul>

              <h4>2. Các lực cơ học thường gặp</h4>
              <ul>
                <li><strong>Trọng lực:</strong> $\\vec{P} = m \\vec{g}$, điểm đặt tại trọng tâm vật.</li>
                <li><strong>Lực ma sát trượt:</strong> $F_{mst} = \\mu_t N$ (cản trở chuyển động trượt, không phụ thuộc diện tích tiếp xúc).</li>
                <li><strong>Lực đàn hồi (Định luật Hooke):</strong> $F_{dh} = k |\\Delta l|$ ($k$ là độ cứng, $\\Delta l$ là độ biến dạng).</li>
              </ul>
            `,
            keyFormulas: [
              { name: "Định luật II Newton", math: "\\vec{F} = m\\vec{a}" },
              { name: "Lực ma sát trượt", math: "F_{mst} = \\mu_t N" },
              { name: "Định luật Hooke", math: "F_{dh} = k |\\Delta l|" }
            ],
            tips: "Khi giải bài toán động lực học, luôn vẽ hình, biểu diễn đầy đủ các lực tác dụng, chọn hệ trục tọa độ $Oxy$ phù hợp rồi chiếu lên hai trục."
          }
        ]
      },
      {
        id: "c10_4",
        title: "Chương 4: Năng lượng, Công & Động lượng",
        icon: "sun",
        lessons: [
          {
            id: "l10_4_1",
            title: "Bài 6: Công, Công suất & Định luật bảo toàn cơ năng",
            summary: "Công cơ học, công phát động, công cản. Động năng, thế năng trọng trường và sự bảo toàn cơ năng.",
            content: `
              <h4>1. Công cơ học & Công suất</h4>
              <p>Công của lực $\\vec{F}$ không đổi tác dụng làm vật dịch chuyển đoạn $s$:</p>
              <p>$$A = F \\cdot s \\cdot \\cos\\alpha \\quad (Joule - J)$$</p>
              <ul>
                <li>$\\alpha < 90^\\circ$: $\\cos\\alpha > 0 \\implies A > 0$ (Công phát động).</li>
                <li>$\\alpha = 90^\\circ$: $\\cos\\alpha = 0 \\implies A = 0$ (Lực không sinh công, ví dụ lực hướng tâm).</li>
                <li>$90^\\circ < \\alpha \\le 180^\\circ$: $\\cos\\alpha < 0 \\implies A < 0$ (Công cản, ví dụ lực ma sát).</li>
              </ul>
              <p><strong>Công suất:</strong> Tốc độ sinh công: $P = \\frac{A}{t} = F \\cdot v \\quad (Watt - W)$.</p>

              <h4>2. Động năng, Thế năng & Cơ năng</h4>
              <ul>
                <li><strong>Động năng:</strong> $W_d = \\frac{1}{2} m v^2$. Định lí động năng: $A_{ngoai\\_luc} = W_{d2} - W_{d1}$.</li>
                <li><strong>Thế năng trọng trường:</strong> $W_t = m g z$ ($z$ là độ cao so với mốc thế năng).</li>
                <li><strong>Cơ năng:</strong> $W = W_d + W_t = \\frac{1}{2} m v^2 + m g z$.</li>
                <li><strong>Định luật bảo toàn cơ năng:</strong> Khi vật chỉ chịu tác dụng của lực thế (trọng lực, lực đàn hồi), cơ năng được bảo toàn: $W = W_d + W_t = const$.</li>
                <li>Khi có lực cản/ma sát: $A_{Fc} = W_2 - W_1 = \\Delta W$.</li>
              </ul>
            `,
            keyFormulas: [
              { name: "Công cơ học", math: "A = F s \\cos\\alpha" },
              { name: "Động năng", math: "W_d = \\frac{1}{2}mv^2" },
              { name: "Thế năng", math: "W_t = mgz" },
              { name: "Bảo toàn cơ năng", math: "W = W_d + W_t = \\text{hằng số}" }
            ],
            tips: "Chọn mốc thế năng hợp lí (thường ở mặt đất hoặc vị trí thấp nhất) để đơn giản hóa biểu thức tính thế năng."
          }
        ]
      }
    ]
  },

  11: {
    title: "Vật Lí Lớp 11: Dao Động, Sóng & Điện Trường",
    badge: "Lớp 11",
    description: "Trọng tâm dao động điều hòa, sóng cơ, giao thoa sóng, điện trường, điện thế và dòng điện không đổi.",
    chapters: [
      {
        id: "c11_1",
        title: "Chương 1: Dao động điều hòa",
        icon: "repeat",
        lessons: [
          {
            id: "l11_1_1",
            title: "Bài 1: Phương trình dao động điều hòa",
            summary: "Li độ, vận tốc, gia tốc, pha dao động và mối quan hệ về pha giữa các đại lượng.",
            content: `
              <h4>1. Định nghĩa và Phương trình</h4>
              <p>Dao động điều hòa là dao động mà li độ của vật là một hàm cosin (hoặc sin) theo thời gian.</p>
              <p>$$x = A \\cos(\\omega t + \\varphi)$$</p>
              <ul>
                <li>$x$: Li độ (cm hoặc m) - độ lệch khỏi vị trí cân bằng.</li>
                <li>$A$: Biên độ dao động ($A > 0$), li độ cực đại.</li>
                <li>$\\omega$: Tần số góc ($rad/s$), $\\omega = \\frac{2\\pi}{T} = 2\\pi f$.</li>
                <li>$(\\omega t + \\varphi)$: Pha dao động tại thời điểm $t$ ($rad$).</li>
                <li>$\\varphi$: Pha ban đầu tại thời điểm $t = 0$ ($rad$).</li>
              </ul>

              <h4>2. Vận tốc và Gia tốc trong dao động điều hòa</h4>
              <ul>
                <li><strong>Vận tốc:</strong> $v = x' = -\\omega A \\sin(\\omega t + \\varphi) = \\omega A \\cos(\\omega t + \\varphi + \\frac{\\pi}{2})$.
                  <br>&rarr; $v$ sớm pha $\\frac{\\pi}{2}$ so với $x$. $v_{max} = \\omega A$ tại vị trí cân bằng theo chiều dương.
                </li>
                <li><strong>Gia tốc:</strong> $a = v' = x'' = -\\omega^2 A \\cos(\\omega t + \\varphi) = -\\omega^2 x$.
                  <br>&rarr; $a$ ngược pha (sớm pha $\\pi$) so với $x$. Gia tốc luôn hướng về vị trí cân bằng. $a_{max} = \\omega^2 A$ tại biên âm.
                </li>
              </ul>

              <h4>3. Công thức độc lập thời gian</h4>
              <p>$$A^2 = x^2 + \\frac{v^2}{\\omega^2} = \\frac{a^2}{\\omega^4} + \\frac{v^2}{\\omega^2}$$</p>
            `,
            keyFormulas: [
              { name: "Phương trình li độ", math: "x = A \\cos(\\omega t + \\varphi)" },
              { name: "Vận tốc cực đại", math: "v_{max} = \\omega A" },
              { name: "Gia tốc cực đại", math: "a_{max} = \\omega^2 A" },
              { name: "Hệ thức độc lập", math: "x^2 + \\frac{v^2}{\\omega^2} = A^2" }
            ],
            tips: "Ghi nhớ thần chú thứ tự pha: 'Gia tốc sớm hơn vận tốc $\\pi/2$, vận tốc sớm hơn li độ $\\pi/2$, gia tốc ngược pha với li độ'."
          },
          {
            id: "l11_1_2",
            title: "Bài 2: Con lắc lò xo & Con lắc đơn",
            summary: "Chu kỳ, tần số dao động riêng và năng lượng dao động của con lắc lò xo và con lắc đơn.",
            content: `
              <h4>1. Con lắc lò xo</h4>
              <ul>
                <li>Tần số góc: $\\omega = \\sqrt{\\frac{k}{m}}$</li>
                <li>Chu kỳ: $T = 2\\pi \\sqrt{\\frac{m}{k}}$</li>
                <li>Động năng: $W_d = \\frac{1}{2} m v^2$</li>
                <li>Thế năng: $W_t = \\frac{1}{2} k x^2$</li>
                <li>Cơ năng: $W = W_d + W_t = \\frac{1}{2} k A^2 = \\frac{1}{2} m \\omega^2 A^2 = const$.</li>
              </ul>

              <h4>2. Con lắc đơn</h4>
              <ul>
                <li>Điều kiện dao động điều hòa: Biên độ góc nhỏ ($\\alpha_0 \\le 10^\\circ \\approx 0.174 \\, rad$).</li>
                <li>Tần số góc: $\\omega = \\sqrt{\\frac{g}{l}}$</li>
                <li>Chu kỳ: $T = 2\\pi \\sqrt{\\frac{l}{g}}$ (không phụ thuộc vào khối lượng $m$ của vật nặng!).</li>
                <li>Cơ năng: $W = mgl(1 - \\cos\\alpha_0) \\approx \\frac{1}{2} mgl \\alpha_0^2$.</li>
              </ul>
            `,
            keyFormulas: [
              { name: "Chu kỳ con lắc lò xo", math: "T = 2\\pi \\sqrt{\\frac{m}{k}}" },
              { name: "Chu kỳ con lắc đơn", math: "T = 2\\pi \\sqrt{\\frac{l}{g}}" },
              { name: "Cơ năng lò xo", math: "W = \\frac{1}{2}kA^2" }
            ],
            tips: "Nhớ câu mẹo ghi nhớ: Con lắc lò xo $T = 2\\pi \\sqrt{m/k}$ ('Thấy tiền muôn kiếp'), Con lắc đơn $T = 2\\pi \\sqrt{l/g}$ ('Thấy tiền lú lẫn')."
          }
        ]
      },
      {
        id: "c11_2",
        title: "Chương 2: Sóng cơ & Giao thoa sóng",
        icon: "radio",
        lessons: [
          {
            id: "l11_2_1",
            title: "Bài 3: Sóng cơ và sự truyền sóng",
            summary: "Định nghĩa sóng cơ, bước sóng, tốc độ truyền sóng, phương trình sóng.",
            content: `
              <h4>1. Định nghĩa và Phân loại</h4>
              <p>Sóng cơ là sự lan truyền dao động cơ (năng lượng và trạng thái dao động) trong môi trường vật chất theo thời gian. <em>Lưu ý: Các phần tử vật chất chỉ dao động quanh VTCB, không truyền đi theo sóng!</em></p>
              <ul>
                <li><strong>Sóng ngang:</strong> Phương dao động vuông góc với phương truyền sóng (truyền được trong chất rắn và bề mặt chất lỏng).</li>
                <li><strong>Sóng dọc:</strong> Phương dao động trùng với phương truyền sóng (truyền được trong cả chất rắn, lỏng, khí).</li>
              </ul>

              <h4>2. Bước sóng và Tốc độ sóng</h4>
              <p>Bước sóng ($\\lambda$) là quãng đường sóng truyền đi được trong một chu kỳ dao động, hoặc là khoảng cách ngắn nhất giữa hai điểm trên cùng một phương truyền sóng dao động cùng pha:</p>
              <p>$$\\lambda = v \\cdot T = \\frac{v}{f}$$</p>
            `,
            keyFormulas: [
              { name: "Bước sóng", math: "\\lambda = v T = \\frac{v}{f}" },
              { name: "Độ lệch pha giữa 2 điểm", math: "\\Delta \\varphi = \\frac{2\\pi d}{\\lambda}" }
            ],
            tips: "Khi truyền từ môi trường này sang môi trường khác: Tần số $f$ KHÔNG đổi, vận tốc $v$ thay đổi nên bước sóng $\\lambda$ thay đổi ($v_{ran} > v_{long} > v_{khi}$)."
          },
          {
            id: "l11_2_2",
            title: "Bài 4: Giao thoa sóng cơ",
            summary: "Điều kiện giao thoa, phương trình sóng giao thoa, vị trí cực đại và cực tiểu giao thoa.",
            content: `
              <h4>1. Hiện tượng Giao thoa</h4>
              <p>Giao thoa sóng là hiện tượng hai hay nhiều sóng kết hợp gặp nhau tạo nên những vị trí dao động với biên độ cực đại và những vị trí đứng yên hoặc dao động với biên độ cực tiểu triệt tiêu nhau.</p>
              <p><strong>Điều kiện hai sóng kết hợp:</strong> Cùng tần số, cùng phương dao động và có hiệu số pha không đổi theo thời gian.</p>

              <h4>2. Hai nguồn kết hợp đồng pha ($S_1, S_2$)</h4>
              <ul>
                <li><strong>Vị trí cực đại:</strong> Hiệu đường đi bằng một số nguyên lần bước sóng:
                  $$d_2 - d_1 = k\\lambda \\quad (k = 0, \\pm 1, \\pm 2, ...)$$
                  Biên độ cực đại: $A_{max} = 2a$.
                </li>
                <li><strong>Vị trí cực tiểu:</strong> Hiệu đường đi bằng một số nửa nguyên lần bước sóng:
                  $$d_2 - d_1 = (k + 0.5)\\lambda \\quad (k = 0, \\pm 1, \\pm 2, ...)$$
                  Biên độ cực tiểu: $A_{min} = 0$.
                </li>
              </ul>
            `,
            keyFormulas: [
              { name: "Vân cực đại", math: "d_2 - d_1 = k\\lambda" },
              { name: "Vân cực tiểu", math: "d_2 - d_1 = (k + 0.5)\\lambda" },
              { name: "Khoảng cách 2 cực đại liên tiếp trên $S_1S_2$", math: "\\Delta d = \\frac{\\lambda}{2}" }
            ],
            tips: "Khoảng cách giữa hai cực đại liên tiếp trên đoạn nối hai nguồn luôn bằng nửa bước sóng ($\\lambda / 2$)."
          }
        ]
      },
      {
        id: "c11_3",
        title: "Chương 3: Điện trường & Dòng điện",
        icon: "battery-charging",
        lessons: [
          {
            id: "l11_3_1",
            title: "Bài 5: Định luật Coulomb & Điện trường",
            summary: "Tương tác tĩnh điện, cường độ điện trường, điện thế, hiệu điện thế và tụ điện.",
            content: `
              <h4>1. Định luật Coulomb</h4>
              <p>Lực tương tác tĩnh điện giữa hai điện tích điểm $q_1, q_2$ đứng yên đặt trong chân không (hoặc không khí):</p>
              <p>$$F = k \\frac{|q_1 q_2|}{r^2} \\quad (với \\; k = 9 \\times 10^9 \\; N\\cdot m^2/C^2)$$</p>
              <p>Cùng dấu: Đẩy nhau; Khác dấu: Hút nhau.</p>

              <h4>2. Cường độ điện trường</h4>
              <p>$$\\vec{E} = \\frac{\\vec{F}}{q} \\implies E = k \\frac{|Q|}{r^2} \\quad (V/m)$$</p>
              <p>Điện tích dương ($Q > 0$): $\\vec{E}$ hướng ra xa điện tích; Điện tích âm ($Q < 0$): $\\vec{E}$ hướng về phía điện tích.</p>

              <h4>3. Hiệu điện thế & Tụ điện</h4>
              <ul>
                <li>Hiệu điện thế giữa hai điểm: $U_{MN} = V_M - V_N = \\frac{A_{MN}}{q} = E \\cdot d$.</li>
                <li>Điện dung tụ điện: $C = \\frac{Q}{U} \\quad (Farad - F)$.</li>
                <li>Năng lượng điện trường dự trữ trong tụ: $W = \\frac{1}{2} C U^2 = \\frac{1}{2} \\frac{Q^2}{C} = \\frac{1}{2} Q U$.</li>
              </ul>
            `,
            keyFormulas: [
              { name: "Định luật Coulomb", math: "F = 9\\cdot 10^9 \\frac{|q_1 q_2|}{\\varepsilon r^2}" },
              { name: "Cường độ điện trường", math: "E = \\frac{U}{d}" },
              { name: "Điện dung tụ điện", math: "C = \\frac{Q}{U}" },
              { name: "Năng lượng tụ điện", math: "W = \\frac{1}{2}CU^2" }
            ],
            tips: "Lưu ý công của lực điện trường không phụ thuộc vào hình dạng đường đi mà chỉ phụ thuộc vào vị trí điểm đầu và điểm cuối (lực thế)."
          }
        ]
      }
    ]
  },

  12: {
    title: "Vật Lí Lớp 12: Nhiệt, Khí Lí Tưởng, Từ Trường & Hạt Nhân",
    badge: "Lớp 12",
    description: "Trọng tâm chương trình 2018: Vật lí nhiệt, Thuyết động học chất khí, Từ trường và Vật lí hạt nhân.",
    chapters: [
      {
        id: "c12_1",
        title: "Chương 1: Vật lí nhiệt",
        icon: "flame",
        lessons: [
          {
            id: "l12_1_1",
            title: "Bài 1: Cấu trúc vi mô & Nhiệt độ",
            summary: "Mô hình động học phân tử, cấu tạo chất, thang nhiệt độ Celsius và Kelvin.",
            content: `
              <h4>1. Cấu trúc vi mô của chất</h4>
              <ul>
                <li>Các chất được cấu tạo từ các phân tử, nguyên tử riêng biệt.</li>
                <li>Các phân tử chuyển động không ngừng (chuyển động nhiệt). Nhiệt độ càng cao, các phân tử chuyển động càng nhanh.</li>
                <li>Giữa các phân tử có lực hút và lực đẩy phân tử.</li>
              </ul>

              <h4>2. Thang nhiệt độ</h4>
              <ul>
                <li><strong>Thang Celsius ($^{\\circ}C$):</strong> Điểm đóng băng của nước tinh khiết là $0^{\\circ}C$, điểm sôi ở áp suất tiêu chuẩn là $100^{\\circ}C$.</li>
                <li><strong>Thang Kelvin ($K$ - Nhiệt độ tuyệt đối):</strong>
                  $$T(K) = t(^{\\circ}C) + 273.15$$
                  Độ không tuyệt đối ($0 K = -273.15^{\\circ}C$) là nhiệt độ mà mọi chuyển động nhiệt của phân tử lý tưởng đều ngừng lại.
                </li>
                <li>Độ biến thiên nhiệt độ: $\\Delta T(K) = \\Delta t(^{\\circ}C)$.</li>
              </ul>
            `,
            keyFormulas: [
              { name: "Chuyển đổi thang nhiệt", math: "T(K) = t(^{\\circ}C) + 273.15" },
              { name: "Độ chênh lệch nhiệt độ", math: "\\Delta T = \\Delta t" }
            ],
            tips: "Trong các công thức nhiệt động lực học và chất khí, nhiệt độ bắt buộc phải đổi sang Kelvin ($K$)!"
          },
          {
            id: "l12_1_2",
            title: "Bài 2: Nội năng, Nhiệt lượng & Nhiệt dung riêng",
            summary: "Nội năng, định luật I nhiệt động lực học, nhiệt lượng truyền đi và nhiệt hóa hơi/nóng chảy.",
            content: `
              <h4>1. Nội năng & Định luật I Nhiệt động lực học</h4>
              <p>Nội năng ($U$) là tổng động năng của chuyển động hỗn loạn của các phân tử và thế năng tương tác giữa chúng. Nội năng phụ thuộc vào nhiệt độ và thể tích ($U = f(T, V)$).</p>
              <p><strong>Định luật I Nhiệt động lực học:</strong></p>
              <p>$$\\Delta U = A + Q$$</p>
              <ul>
                <li>$Q > 0$: Hệ nhận nhiệt lượng; $Q < 0$: Hệ truyền nhiệt lượng.</li>
                <li>$A > 0$: Hệ nhận công; $A < 0$: Hệ thực hiện công sinh ra ngoài.</li>
              </ul>

              <h4>2. Các công thức tính nhiệt lượng</h4>
              <ul>
                <li>Nhiệt lượng làm thay đổi nhiệt độ: $Q = m c \\Delta t$ ($c$: Nhiệt dung riêng, $J/(kg\\cdot K)$).</li>
                <li>Nhiệt nóng chảy: $Q_{nc} = \\lambda m$ ($\\lambda$: Nhiệt nóng chảy riêng, $J/kg$).</li>
                <li>Nhiệt hóa hơi: $Q_{hh} = L m$ ($L$: Nhiệt hóa hơi riêng, $J/kg$).</li>
              </ul>
            `,
            keyFormulas: [
              { name: "Định luật I NĐLH", math: "\\Delta U = A + Q" },
              { name: "Nhiệt lượng tăng nhiệt", math: "Q = mc\\Delta t" },
              { name: "Nhiệt nóng chảy", math: "Q = \\lambda m" },
              { name: "Nhiệt hóa hơi", math: "Q = Lm" }
            ],
            tips: "Quy ước dấu của Định luật I: Cứ 'nhận' là DƯƠNG ($+$), 'truyền / sinh ra' là ÂM ($-$). Cực kỳ dễ nhớ!"
          }
        ]
      },
      {
        id: "c12_2",
        title: "Chương 2: Khí lí tưởng",
        icon: "wind",
        lessons: [
          {
            id: "l12_2_1",
            title: "Bài 3: Phương trình trạng thái khí lí tưởng",
            summary: "Các định luật chất khí (Boyle, Charles) và Phương trình Clapeyron - Mendeleev.",
            content: `
              <h4>1. Mô hình khí lí tưởng</h4>
              <ul>
                <li>Phân tử khí được coi là chất điểm (kích thước rất nhỏ so với khoảng cách giữa chúng).</li>
                <li>Chỉ tương tác khi va chạm, va chạm là va chạm đàn hồi hoàn toàn.</li>
              </ul>

              <h4>2. Phương trình Clapeyron - Mendeleev</h4>
              <p>$$p V = n R T = \\frac{m}{\\mu} R T$$</p>
              <ul>
                <li>$p$: Áp suất chất khí ($Pa$ hoặc $N/m^2; \\; 1 \\; atm = 1.013 \\times 10^5 \\; Pa$).</li>
                <li>$V$: Thể tích khí ($m^3; \\; 1 \\; m^3 = 1000 \\; L$).</li>
                <li>$n$: Số mol khí ($mol$).</li>
                <li>$R \\approx 8.314 \\; J/(mol\\cdot K)$: Hằng số khí lí tưởng.</li>
                <li>$T$: Nhiệt độ tuyệt đối ($K$).</li>
              </ul>

              <h4>3. Các đẳng quá trình đặc biệt</h4>
              <ul>
                <li><strong>Đẳng nhiệt ($T = const$ - Định luật Boyle):</strong> $p V = const \\iff p_1 V_1 = p_2 V_2$.</li>
                <li><strong>Đẳng áp ($p = const$ - Định luật Charles):</strong> $\\frac{V}{T} = const \\iff \\frac{V_1}{T_1} = \\frac{V_2}{T_2}$.</li>
                <li><strong>Đẳng tích ($V = const$):</strong> $\\frac{p}{T} = const \\iff \\frac{p_1}{T_1} = \\frac{p_2}{T_2}$.</li>
              </ul>
            `,
            keyFormulas: [
              { name: "Phương trình Mendeleev", math: "pV = nRT = \\frac{m}{\\mu}RT" },
              { name: "Phương trình trạng thái", math: "\\frac{p_1 V_1}{T_1} = \\frac{p_2 V_2}{T_2}" },
              { name: "Định luật Boyle", math: "p_1 V_1 = p_2 V_2 \\quad (T = const)" }
            ],
            tips: "Nhớ đổi thể tích sang $m^3$ ($1 \\; lít = 10^{-3} m^3$) và áp suất sang $Pa$ khi dùng $R = 8.314$."
          }
        ]
      },
      {
        id: "c12_3",
        title: "Chương 3: Từ trường & Cảm ứng điện từ",
        icon: "compass",
        lessons: [
          {
            id: "l12_3_1",
            title: "Bài 4: Từ trường & Lực từ",
            summary: "Cảm ứng từ, lực từ tác dụng lên đoạn dây dẫn mang dòng điện, lực Lorentz.",
            content: `
              <h4>1. Từ trường & Đường sức từ</h4>
              <p>Từ trường là một dạng vật chất tồn tại xung quanh hạt mang điện chuyển động (nam châm hoặc dòng điện), tác dụng lực từ lên dòng điện hoặc hạt mang điện khác đặt trong nó.</p>
              <p>Đường sức từ có hướng đi ra ở cực Bắc, đi vào ở cực Nam ('Vào Nam Ra Bắc').</p>

              <h4>2. Lực từ tác dụng lên đoạn dây dẫn mang dòng điện (Lực Ampere)</h4>
              <p>$$F = B \\cdot I \\cdot l \\cdot \\sin\\alpha$$</p>
              <ul>
                <li>$\\alpha = (\\vec{B}, \\vec{l})$: Góc hợp bởi vectơ cảm ứng từ và đoạn dây dẫn.</li>
                <li>Quy tắc bàn tay trái: Đặt bàn tay trái sao cho các đường sức từ hướng vào lòng bàn tay, chiều từ cổ tay đến ngón tay giữa chỉ chiều dòng điện, ngón cái choãi ra $90^\\circ$ chỉ chiều lực từ $\\vec{F}$.</li>
              </ul>

              <h4>3. Lực Lorentz</h4>
              <p>Lực từ tác dụng lên một hạt mang điện tích $q$ chuyển động với vận tốc $\\vec{v}$ trong từ trường:</p>
              <p>$$f_L = |q| v B \\sin\\alpha$$</p>
            `,
            keyFormulas: [
              { name: "Lực từ (Ampere)", math: "F = B I l \\sin\\alpha" },
              { name: "Lực Lorentz", math: "f_L = |q| v B \\sin\\alpha" },
              { name: "Từ thông qua khung dây", math: "\\Phi = N B S \\cos\\alpha" }
            ],
            tips: "Đối với lực Lorentz tác dụng lên hạt điện tích âm ($q < 0$), chiều lực ngược lại với ngón cái chỉ theo quy tắc bàn tay trái thông thường!"
          }
        ]
      },
      {
        id: "c12_4",
        title: "Chương 4: Vật lí hạt nhân",
        icon: "atom",
        lessons: [
          {
            id: "l12_4_1",
            title: "Bài 5: Cấu tạo hạt nhân & Năng lượng liên kết",
            summary: "Cấu tạo hạt nhân (proton, neutron), độ hụt khối, năng lượng liên kết và liên kết riêng.",
            content: `
              <h4>1. Cấu tạo hạt nhân nguyên tử</h4>
              <p>Kí hiệu hạt nhân: $_Z^A X$</p>
              <ul>
                <li>$Z$: Số proton (số hiệu nguyên tử, số electron trong vỏ).</li>
                <li>$A$: Số khối (tổng số nucleon = $Z + N$).</li>
                <li>$N = A - Z$: Số neutron.</li>
                <li>Đồng vị: Các hạt nhân có cùng số proton $Z$ nhưng khác số neutron $N$ (nên khác số khối $A$).</li>
              </ul>

              <h4>2. Độ hụt khối & Năng lượng liên kết</h4>
              <ul>
                <li>Độ hụt khối: $\\Delta m = [Z m_p + (A - Z) m_n] - m_X > 0$.</li>
                <li>Hệ thức Einstein: $E = m c^2$.</li>
                <li>Năng lượng liên kết: $W_{lk} = \\Delta m \\cdot c^2$.</li>
                <li><strong>Năng lượng liên kết riêng:</strong> $\\varepsilon = \\frac{W_{lk}}{A}$ (đặc trưng cho mức độ BỀN VỮNG của hạt nhân).
                  <br>&rarr; Các hạt nhân có số khối trong khoảng $50 < A < 95$ (như sắt $_{26}^{56}Fe$) là bền vững nhất.
                </li>
              </ul>
            `,
            keyFormulas: [
              { name: "Độ hụt khối", math: "\\Delta m = [Zm_p + (A-Z)m_n] - m_X" },
              { name: "Năng lượng liên kết", math: "W_{lk} = \\Delta m \\cdot c^2" },
              { name: "Năng lượng liên kết riêng", math: "\\varepsilon = \\frac{W_{lk}}{A}" }
            ],
            tips: "Năng lượng liên kết riêng $\\varepsilon$ càng lớn thì hạt nhân càng bền vững, không phải hạt nhân nào có $W_{lk}$ lớn hơn thì bền hơn!"
          },
          {
            id: "l12_4_2",
            title: "Bài 6: Phóng xạ & Định luật phóng xạ",
            summary: "Các loại tia phóng xạ (alpha, beta, gamma), chu kỳ bán rã và định luật phân rã phóng xạ.",
            content: `
              <h4>1. Các dạng tia phóng xạ</h4>
              <ul>
                <li><strong>Tia $\\alpha$ (Alpha):</strong> Dòng hạt nhân Heli $_2^4He$, ion hóa mạnh, khả năng đâm xuyên yếu (chặn bởi tờ giấy).</li>
                <li><strong>Tia $\\beta^-$ (Beta trừ):</strong> Dòng electron $_-1^0e$.</li>
                <li><strong>Tia $\\beta^+$ (Beta cộng):</strong> Dòng positron $_+1^0e$ (phản hạt của electron).</li>
                <li><strong>Tia $\\gamma$ (Gamma):</strong> Sóng điện từ có bước sóng cực ngắn, không mang điện, đâm xuyên rất mạnh (cần lớp chì dày hàng chục cm).</li>
              </ul>

              <h4>2. Định luật phân rã phóng xạ</h4>
              <p>Chu kỳ bán rã $T$ là khoảng thời gian sau đó một nửa số hạt nhân ban đầu bị phân rã.</p>
              <ul>
                <li>Số hạt nhân còn lại sau thời gian $t$: $N(t) = N_0 \\cdot 2^{-\\frac{t}{T}} = N_0 \\cdot e^{-\\lambda t}$</li>
                <li>Khối lượng còn lại sau thời gian $t$: $m(t) = m_0 \\cdot 2^{-\\frac{t}{T}} = m_0 \\cdot e^{-\\lambda t}$</li>
                <li>Hằng số phóng xạ: $\\lambda = \\frac{\\ln 2}{T} \\approx \\frac{0.693}{T}$.</li>
              </ul>
            `,
            keyFormulas: [
              { name: "Số hạt còn lại", math: "N(t) = N_0 \\cdot 2^{-t/T}" },
              { name: "Khối lượng còn lại", math: "m(t) = m_0 \\cdot 2^{-t/T}" },
              { name: "Số hạt bị phân rã", math: "\\Delta N = N_0 (1 - 2^{-t/T})" }
            ],
            tips: "Đề bài hỏi 'còn lại' hay 'đã bị phân rã': $N_{con\\_lai} = N_0 2^{-t/T}$, còn $N_{da\\_phan\\_ra} = N_0 (1 - 2^{-t/T})$."
          }
        ]
      }
    ]
  }
};
