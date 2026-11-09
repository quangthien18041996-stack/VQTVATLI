import React from 'react';
import { Award, Code2, Heart, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-sky-100 bg-white/70 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-800 font-bold text-sm">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Dự Án Nghiên Cứu Khoa Học Kỹ Thuật (KHKT) Dành Cho Học Sinh THPT</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Chủ đề: Phần mềm hệ thống & Nền tảng học tập trực quan tương tác môn Toán GDPT 2018
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>React • Three.js • KaTeX • Tailwind CSS</span>
            <span>•</span>
            <span>Tối ưu hóa chạy trên Web & Mobile</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
