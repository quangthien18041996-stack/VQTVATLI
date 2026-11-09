import React from 'react';
import { Sparkles, Globe, Share2, Layers, BookOpen, HelpCircle } from 'lucide-react';

export default function Navbar({ activeModule, onSelectModule, onOpenDeployModal }) {
  const modules = [
    { id: 'part1', num: '1', title: 'Nguyên Hàm & Tích Phân' },
    { id: 'part2', num: '2', title: 'Tọa Độ Không Gian Oxyz' },
    { id: 'part3', num: '3', title: 'Đạo Hàm & Tối Ưu Hóa' },
    { id: 'part4', num: '4', title: 'Xác Suất & Định Lý Bayes' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Project Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 font-black text-lg">
              ∫
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base md:text-lg tracking-tight">
                  MathVerse<span className="text-cyan-400">12</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  DỰ THI KHKT
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Nền tảng trực quan hóa Toán học THPT • GDPT 2018
              </p>
            </div>
          </div>

          {/* Module Selector Pills */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {modules.map((m) => {
              const isActive = activeModule === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onSelectModule(m.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    isActive ? 'bg-slate-950 text-cyan-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {m.num}
                  </span>
                  <span>{m.title}</span>
                </button>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenDeployModal}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Đẩy Lên Web (Deploy)</span>
            </button>
          </div>
        </div>

        {/* Mobile Module Selector Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-slate-850 gap-1.5 scrollbar-none">
          {modules.map((m) => {
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectModule(m.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400'
                }`}
              >
                P.{m.num}: {m.title}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
