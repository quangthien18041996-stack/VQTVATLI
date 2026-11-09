import React from 'react';
import { X, Globe, UploadCloud, Terminal, QrCode, CheckCircle2 } from 'lucide-react';

export default function DeploymentGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-sky-100 rounded-2xl max-w-2xl w-full p-6 shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-sky-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Hướng Dẫn Đẩy Lên Web Miễn Phí (Deploy)</h3>
              <p className="text-xs text-slate-500">Cách đưa website lên Internet để Ban Giám Khảo KHKT chấm thi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mt-5 text-sm">
          {/* Method 1 */}
          <div className="p-4 bg-sky-50/70 rounded-xl border border-sky-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-800 flex items-center gap-2">
                <Globe className="w-4 h-4" /> Cách 1: Đẩy lên Vercel (Khuyên dùng - Nhanh nhất 1 phút)
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                Miễn phí 100%
              </span>
            </div>
            <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1.5 pl-1 leading-relaxed">
              <li>Mở terminal trong thư mục này, chạy lệnh: <code className="bg-white text-blue-700 px-1.5 py-0.5 rounded border border-sky-200 font-mono">npm run build</code> để tạo thư mục <code className="bg-white text-blue-700 px-1 rounded border border-sky-200">dist</code>.</li>
              <li>Truy cập <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">vercel.com</a>, đăng nhập bằng GitHub hoặc Email.</li>
              <li>Nhấn <strong>Add New... &rarr; Project</strong> rồi kéo thả thư mục dự án hoặc kết nối kho Git.</li>
              <li>Vercel tự động build và cấp cho bạn 1 đường link web (ví dụ: <code className="text-amber-700 font-mono font-bold">toan-12-khkt.vercel.app</code>) có HTTPS cực nhanh.</li>
            </ol>
          </div>

          {/* Method 2 */}
          <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
            <span className="font-bold text-emerald-800 flex items-center gap-2">
              <UploadCloud className="w-4 h-4" /> Cách 2: Kéo thả lên Netlify Drop (Không cần gõ lệnh)
            </span>
            <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1.5 pl-1 leading-relaxed">
              <li>Chạy file <code className="bg-white text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 font-mono">dong_goi_de_day_len_web.bat</code> hoặc gõ <code className="bg-white text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 font-mono">npm run build</code>.</li>
              <li>Vào trang <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-medium">app.netlify.com/drop</a>.</li>
              <li>Kéo thẳng thư mục <code className="bg-white text-emerald-700 px-1 rounded border border-emerald-200 font-mono">dist</code> vừa tạo thả vào trình duyệt. Web sẽ lập tức online!</li>
            </ol>
          </div>

          {/* Tip */}
          <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 flex items-start gap-3">
            <QrCode className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 space-y-1">
              <strong className="text-amber-800 block">Mẹo ăn điểm khi thi KHKT:</strong>
              <p>
                Sau khi có link web trên Vercel/Netlify, bạn dùng trang web tạo mã QR (như <em>me-qr.com</em>) in mã QR dán lên <strong>Poster gian hàng dự thi KHKT</strong>. Khi Giám khảo đến xem gian hàng, mời thầy cô quét mã QR bằng điện thoại để trực tiếp xoay mô hình 3D và làm bài test!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-sky-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
          >
            Đã hiểu & Đóng lại
          </button>
        </div>
      </div>
    </div>
  );
}
