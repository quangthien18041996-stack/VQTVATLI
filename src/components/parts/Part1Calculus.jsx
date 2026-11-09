import React from 'react';
import SolidOfRevolution3D from './SolidOfRevolution3D';
import RiemannIntegralLab from './RiemannIntegralLab';
import StemSimulations from './StemSimulations';
import ExerciseBank from './ExerciseBank';
import TheoryTables from './TheoryTables';
import { Box, Activity, Cpu, CheckSquare, BookMarked, Calculator } from 'lucide-react';

const SUB_TABS = [
  { id: '3d-solid', label: '1. Khối Tròn Xoay 3D', icon: Box },
  { id: 'riemann', label: '2. Tích Phân Riemann', icon: Activity },
  { id: 'stem', label: '3. Mô Phỏng STEM Thực Tế', icon: Cpu },
  { id: 'exercises', label: '4. Luyện Đề & Chấm Điểm', icon: CheckSquare },
  { id: 'theory', label: '5. Sổ Tay Bảng Nguyên Hàm', icon: BookMarked },
];

export default function Part1Calculus({ activeSubTab = '3d-solid', onSelectSubTab, onOpenCasioModal }) {
  const currentTab = activeSubTab || '3d-solid';

  return (
    <div className="space-y-6">
      {/* Overview intro card */}
      <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50/60 border border-sky-200/80 rounded-2xl p-6 relative overflow-hidden shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 inline-block mb-3">
            CHUYÊN ĐỀ 2 • TOÁN 12 KNTT (CHƯƠNG IV)
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Nguyên Hàm, Tích Phân & Trực Quan Hóa Khối Tròn Xoay
          </h2>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
            Hệ thống hóa toàn bộ kiến thức Bài 11 (Nguyên hàm), Bài 12 (Tích phân) và Bài 13 (Ứng dụng hình học). Tích hợp phòng thí nghiệm 3D thời gian thực giúp giải quyết triệt để rào cản tư duy hình học không gian.
          </p>
        </div>

        {onOpenCasioModal && (
          <button
            onClick={onOpenCasioModal}
            className="relative z-10 self-start md:self-center px-4 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <Calculator className="w-4 h-4 text-white" />
            <span>Mẹo Casio Chương IV</span>
          </button>
        )}
      </div>

      {/* Sub-navigation pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {SUB_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectSubTab && onSelectSubTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm font-semibold'
                  : 'bg-white border-sky-200/80 text-slate-600 hover:bg-sky-50 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content view */}
      <div>
        {currentTab === '3d-solid' && <SolidOfRevolution3D />}
        {currentTab === 'riemann' && <RiemannIntegralLab />}
        {currentTab === 'stem' && <StemSimulations />}
        {currentTab === 'exercises' && <ExerciseBank />}
        {currentTab === 'theory' && <TheoryTables />}
      </div>
    </div>
  );
}
