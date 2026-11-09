# MathVerse 12 - Dự Án Nghiên Cứu Khoa Học Kỹ Thuật (KHKT) Môn Toán THPT

Dự án website hỗ trợ học tập trực quan tương tác môn Toán 12 theo Chương trình Giáo dục Phổ thông 2018 (SGK Kết nối tri thức với cuộc sống), sẵn sàng tham dự cuộc thi Khoa học Kỹ thuật (ViSEF) các cấp.

---

## 🌟 Cấu trúc 4 Chuyên đề cốt lõi

1. **Phần 1: Nguyên hàm, Tích phân & Khối tròn xoay 3D** (Chương IV)
   - Mô phỏng khối tròn xoay 3D (WebGL / Three.js) xoay $360^\circ$ quanh trục Ox.
   - Trực quan hóa bản chất tích phân qua Tổng Riemann ($n \to \infty$).
   - Phòng thí nghiệm STEM giải quyết 4 bài toán thực tiễn từ SGK (Bình gốm Bát Tràng, chuyển động đạn pháo, đường cong bất bình đẳng Lorenz, dòng máu trong động mạch).
   - Ngân hàng bài tập trắc nghiệm & tự luận chuẩn 2025 có chấm điểm và lời giải chi tiết.
   - Sổ tay tra cứu công thức nguyên hàm KaTeX.

2. **Phần 2: Phương pháp tọa độ trong không gian Oxyz** (Chương V)
   - Không gian 3D tương tác tự do: quan sát mặt phẳng $(\alpha)$ cắt mặt cầu $(S)$.

3. **Phần 3: Ứng dụng Đạo hàm & Tối ưu hóa thực tế** (Chương I)
   - Bài toán kỹ thuật gấp hộp có thể tích cực đại từ tấm tôn phẳng.

4. **Phần 4: Xác suất có điều kiện & Định lý Bayes** (Chương VI)
   - Cây xác suất tương tác ứng dụng trong chẩn đoán y tế và phân tích rủi ro.

---

## 🚀 Hướng Dẫn Chạy Thử Nghiệm Trên Máy Tính (Local)

1. Mở cửa sổ dòng lệnh (Terminal / PowerShell) trong thư mục này.
2. Khởi động máy chủ phát triển:
   ```bash
   npm run dev
   ```
3. Mở trình duyệt truy cập đường link hiển thị (ví dụ: `http://localhost:5173`).

---

## 🌐 Hướng Dẫn Đẩy Lên Web Miễn Phí (Deploy Online)

### Cách 1: Đẩy lên Vercel (Khuyên dùng - 1 phút)
1. Chạy lệnh đóng gói:
   ```bash
   npm run build
   ```
2. Truy cập [vercel.com](https://vercel.com) (đăng nhập miễn phí).
3. Chọn **Add New Project** -> Kéo thả thư mục dự án hoặc kết nối tài khoản GitHub.
4. Nhận ngay link web chính thức có HTTPS (ví dụ: `https://mathverse12.vercel.app`).

### Cách 2: Kéo thả trực tiếp lên Netlify Drop (Không cần cài Git)
1. Chạy `npm run build` để sinh ra thư mục `dist`.
2. Vào trang [app.netlify.com/drop](https://app.netlify.com/drop).
3. Kéo toàn bộ thư mục `dist` thả vào khung trình duyệt. Netlify sẽ tự động kích hoạt website ngay lập tức!

---

## 🎯 Mẹo Trình Bày Khi Đi Thi KHKT
- In mã QR của link web dán lên **Poster gian hàng dự thi**.
- Khi Ban Giám Khảo đến chấm điểm, mời thầy cô dùng điện thoại quét mã QR để trực tiếp trải nghiệm xoay mô hình 3D và làm bài test đánh giá năng lực!
