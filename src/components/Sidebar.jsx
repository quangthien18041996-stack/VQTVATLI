import React, { useState } from 'react';
import { 
  Box, 
  Compass, 
  TrendingUp, 
  GitBranch, 
  Globe, 
  Award, 
  Menu, 
  X, 
  ChevronRight, 
  BookOpen, 
  Sparkles,
  Layers
} from 'lucide-react';

export default function Sidebar({ 
  activeModule, 
  onSelectModule, 
  part1SubTab, 
  onSelectPart1SubTab, 
  onOpenDeployModal 
}) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const modules = [
    { 
      id: 'part1', 
      num: '1', 
      title: 'Nguyên Hàm & Tích Phân', 
      chapter: 'Chương IV (Tập 2)',
      icon: Box,
      accent: 'from-blue-600 to-cyan-500',
      subTabs: [
        { id: '3d-solid', label: '1. Khối Tròn Xoay 3D' },
        { id: 'riemann', label: '2. Bản Chất Tích Phân' },
        { id: 'stem', label: '3. Mô Phỏng STEM Thực Tế' },
        { id: 'exercises', label: '4. Luyện Đề & Chấm Điểm' },
        { id: 'theory', label: '5. Sổ Tay Bảng Nguyên Hàm' },
      ]
    },
    { 
      id: 'part2', 
      num: '2', 
      title: 'Tọa Độ Không Gian Oxyz', 
      chapter: 'Chương V (Tập 2)',
      icon: Compass,
      accent: 'from-teal-600 to-emerald-500'
    },
    { 
      id: 'part3', 
      num: '3', 
      title: 'Đạo Hàm & Tối Ưu Hóa', 
      chapter: 'Chương I (Tập 1)',
      icon: TrendingUp,
      accent: 'from-amber-600 to-orange-500'
    },
    { 
      id: 'part4', 
      num: '4', 
      title: 'Xác Suất & Định Lý Bayes', 
      chapter: 'Chương VI (Tập 2)',
      icon: GitBranch,
      accent: 'from-purple-600 to-indigo-500'
    },
  ];

  const handleModuleClick = (modId) => {
    onSelectModule(modId);
    setIsOpenMobile(false);
  };

  const handleSubTabClick = (subId) => {
    if (onSelectPart1SubTab) onSelectPart1SubTab(subId);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-sky-100 z-40 px-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-sm">
            ∫
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-sm tracking-tight">
              MathVerse<span className="text-blue-600">12</span>
            </span>
            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              KHKT
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-sky-50 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpenMobile ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop overlay on mobile */}
      {isOpenMobile && (
        <div 
          onClick={() => setIsOpenMobile(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40"
        />
      )}

      {/* Left Sidebar Main Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 w-72 bg-white border-r border-sky-100 shadow-sm z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Header & Branding */}
        <div>
          <div className="p-5 border-b border-sky-100 bg-gradient-to-b from-sky-50/70 to-white">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20">
                ∫
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-extrabold text-slate-900 text-lg tracking-tight">
                    MathVerse<span className="text-blue-600">12</span>
                  </h1>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    KHKT
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  GDPT 2018 • Trực quan hóa 3D
                </p>
              </div>
            </div>
          </div>

          {/* Module Navigation List */}
          <div className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-230px)]">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              4 Chuyên Đề Nghiên Cứu
            </div>

            {modules.map((m) => {
              const Icon = m.icon;
              const isActive = activeModule === m.id;

              return (
                <div key={m.id} className="space-y-1">
                  <button
                    onClick={() => handleModuleClick(m.id)}
                    className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between group ${
                      isActive
                        ? 'bg-blue-50/90 text-blue-700 border border-blue-200/80 shadow-xs font-semibold'
                        : 'text-slate-600 hover:bg-sky-50/80 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive 
                          ? 'bg-blue-600 text-white shadow-xs' 
                          : 'bg-sky-100 text-blue-600 group-hover:bg-blue-100'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs truncate font-medium">
                          Phần {m.num}: {m.title}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {m.chapter}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-blue-600 rotate-90' : 'text-slate-300 group-hover:text-slate-400'
                    }`} />
                  </button>

                  {/* Sub-tabs for Part 1 when active */}
                  {isActive && m.subTabs && (
                    <div className="pl-11 pr-2 py-1 space-y-1">
                      {m.subTabs.map((sub) => {
                        const isSubActive = part1SubTab === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleSubTabClick(sub.id)}
                            className={`w-full text-left py-1.5 px-2.5 rounded-lg text-[11px] transition-colors block truncate ${
                              isSubActive
                                ? 'bg-blue-600 text-white font-medium shadow-xs'
                                : 'text-slate-600 hover:bg-sky-100/70 hover:text-slate-900'
                            }`}
                          >
                            {sub.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions & KHKT Info */}
        <div className="p-4 border-t border-sky-100 bg-gradient-to-t from-sky-50/70 to-white space-y-3">
          <button
            onClick={onOpenDeployModal}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            <span>Đẩy Lên Web (Deploy)</span>
          </button>

          <div className="p-2.5 rounded-xl bg-sky-50/80 border border-sky-100 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 mb-0.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Dự Thi KHKT Cấp Tỉnh / QG</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Hỗ trợ toàn diện dạy & học Toán 12 theo phương pháp trực quan hóa.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
