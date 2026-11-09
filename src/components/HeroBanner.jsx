import React from 'react';
import { Box, Compass, TrendingUp, GitBranch, Sparkles, ArrowRight } from 'lucide-react';

export default function HeroBanner({ onSelectModule }) {
  const cards = [
    {
      id: 'part1',
      title: 'Phần 1: Nguyên Hàm & Tích Phân',
      tag: 'SGK Chương IV (Tập 2)',
      desc: 'Mô phỏng 3D Khối tròn xoay, Tổng Riemann và 4 bài toán STEM làng gốm Bát Tràng, đạn pháo, dòng máu.',
      icon: Box,
      accentBg: 'bg-blue-50 text-blue-600 border-blue-200',
      borderHover: 'hover:border-blue-400 hover:shadow-blue-500/10',
      badgeColor: 'text-blue-700 bg-blue-100',
    },
    {
      id: 'part2',
      title: 'Phần 2: Khảo Sát & Vẽ Đồ Thị Hàm Số',
      tag: 'SGK Chương I (Tập 1)',
      desc: 'Khảo sát 3 dạng đồ thị kinh điển (Bậc 3, Phân thức 1/1, Phân thức 2/1), 3 đường tiệm cận, điểm uốn và tối ưu hóa STEM.',
      icon: TrendingUp,
      accentBg: 'bg-amber-50 text-amber-600 border-amber-200',
      borderHover: 'hover:border-amber-400 hover:shadow-amber-500/10',
      badgeColor: 'text-amber-700 bg-amber-100',
    },
    {
      id: 'part3',
      title: 'Phần 3: Hình Học Không Gian Oxyz',
      tag: 'SGK Chương V (Tập 2)',
      desc: 'Hệ trục tọa độ Oxyz 3D tương tác, Mặt phẳng (α), Mặt cầu (S), góc và khoảng cách không gian.',
      icon: Compass,
      accentBg: 'bg-teal-50 text-teal-600 border-teal-200',
      borderHover: 'hover:border-teal-400 hover:shadow-teal-500/10',
      badgeColor: 'text-teal-700 bg-teal-100',
    },
    {
      id: 'part4',
      title: 'Phần 4: Xác Suất Có Điều Kiện',
      tag: 'SGK Chương VI (Tập 2)',
      desc: 'Mô phỏng Monty Hall 3 cánh cửa, bảng 2x2, sơ đồ cây xác suất động và định lý Bayes trong chẩn đoán y tế.',
      icon: GitBranch,
      accentBg: 'bg-purple-50 text-purple-600 border-purple-200',
      borderHover: 'hover:border-purple-400 hover:shadow-purple-500/10',
      badgeColor: 'text-purple-700 bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Top Banner with soft sky-blue gradient */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden border border-sky-100 bg-gradient-to-br from-white via-sky-50/70 to-blue-50/60 shadow-sm">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-sky-200/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 rounded-full bg-blue-200/30 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Đề Tài Nghiên Cứu Khoa Học Kỹ Thuật (KHKT) Dành Cho Học Sinh THPT</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Nền Tảng Trực Quan Hóa <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600">
              Toán Học 12 • GDPT 2018
            </span>
          </h1>

          <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-2xl">
            Giải quyết rào cản tư duy trừu tượng trong môn Toán thông qua <strong>mô phỏng 3D thời gian thực (WebGL/Three.js)</strong>, phòng thí nghiệm toán học ứng dụng STEM và hệ thống đánh giá năng lực chuẩn định dạng 2025.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5 text-xs">
            <div className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-xl border border-sky-200/80 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-700 font-medium">Bám sát 100% SGK Kết nối tri thức</span>
            </div>
            <div className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-xl border border-sky-200/80 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-slate-700 font-medium">Đồ họa 3D WebGL trực tiếp trên trình duyệt</span>
            </div>
            <div className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-xl border border-sky-200/80 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="text-slate-700 font-medium">Sẵn sàng xuất bản & quét mã QR chấm thi</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Cards Grid with soft background & clean typography */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              onClick={() => onSelectModule(c.id)}
              className={`p-5 rounded-2xl border border-sky-100 bg-white hover:bg-sky-50/50 transition-all cursor-pointer flex flex-col justify-between group shadow-xs hover:shadow-md ${c.borderHover}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl border ${c.accentBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.badgeColor}`}>
                    {c.tag}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-sky-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
                <span>Khám phá ngay</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
