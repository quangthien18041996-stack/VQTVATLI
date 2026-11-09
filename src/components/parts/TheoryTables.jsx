import React, { useState } from 'react';
import MathView from '../MathView';
import { Search, BookOpen, BookmarkCheck } from 'lucide-react';

const FORMULA_GROUPS = [
  {
    category: 'Nguyên hàm hàm số luỹ thừa',
    items: [
      { formula: '\\int 0 dx = C', note: 'Hằng số C' },
      { formula: '\\int 1 dx = x + C', note: 'Hàm số bậc nhất' },
      { formula: '\\int x^\\alpha dx = \\frac{x^{\\alpha+1}}{\\alpha+1} + C \\quad (\\alpha \\neq -1)', note: 'Luỹ thừa tổng quát' },
      { formula: '\\int \\frac{1}{x} dx = \\ln|x| + C \\quad (x \\neq 0)', note: 'Phân thức nghịch đảo' },
      { formula: '\\int \\frac{1}{x^2} dx = -\\frac{1}{x} + C', note: 'Trường hợp đặc biệt thường gặp' },
      { formula: '\\int \\frac{1}{\\sqrt{x}} dx = 2\\sqrt{x} + C \\quad (x > 0)', note: 'Căn bậc hai' }
    ]
  },
  {
    category: 'Nguyên hàm hàm số lượng giác',
    items: [
      { formula: '\\int \\cos x dx = \\sin x + C', note: 'Đạo hàm sin là cos' },
      { formula: '\\int \\sin x dx = -\\cos x + C', note: 'Đạo hàm cos là -sin' },
      { formula: '\\int \\frac{1}{\\cos^2 x} dx = \\tan x + C', note: 'Có thể viết là 1 + tan²x' },
      { formula: '\\int \\frac{1}{\\sin^2 x} dx = -\\cot x + C', note: 'Có thể viết là 1 + cot²x' }
    ]
  },
  {
    category: 'Nguyên hàm hàm số mũ',
    items: [
      { formula: '\\int e^x dx = e^x + C', note: 'Hàm số mũ tự nhiên' },
      { formula: '\\int a^x dx = \\frac{a^x}{\\ln a} + C \\quad (0 < a \\neq 1)', note: 'Hàm số mũ cơ số a' }
    ]
  },
  {
    category: 'Ứng dụng hình học của Tích phân',
    items: [
      { formula: 'S = \\int_a^b |f(x)| dx', note: 'Diện tích giới hạn bởi y=f(x), Ox, x=a, x=b' },
      { formula: 'S = \\int_a^b |f(x) - g(x)| dx', note: 'Diện tích giới hạn bởi 2 đồ thị y=f(x) và y=g(x)' },
      { formula: 'V = \\int_a^b S(x) dx', note: 'Thể tích vật thể có diện tích thiết diện S(x)' },
      { formula: 'V = \\pi \\int_a^b [f(x)]^2 dx', note: 'Thể tích khối tròn xoay quanh trục Ox' }
    ]
  }
];

export default function TheoryTables() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = FORMULA_GROUPS.map((grp) => ({
    ...grp,
    items: grp.items.filter(
      (item) =>
        item.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.note.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter((grp) => grp.items.length > 0);

  return (
    <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-sm space-y-6">
      {/* Header & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-sky-100">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="text-base md:text-lg font-bold text-slate-800">
              Sổ Tay Công Thức & Bảng Nguyên Hàm Chuẩn SGK
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng hợp toàn bộ công thức cốt lõi Bài 11, 12, 13 giúp ôn tập và ghi nhớ siêu tốc.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm công thức, hàm số..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-sky-50/60 border border-sky-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Formula cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGroups.map((grp, gIdx) => (
          <div
            key={gIdx}
            className="bg-sky-50/40 border border-sky-200/80 rounded-xl p-4 flex flex-col justify-between shadow-2xs"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookmarkCheck className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                  {grp.category}
                </h4>
              </div>

              <div className="space-y-2">
                {grp.items.map((it, iIdx) => (
                  <div
                    key={iIdx}
                    className="p-2.5 bg-white rounded-lg border border-sky-150 hover:border-blue-300 transition-colors flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="text-slate-800 font-mono text-sm min-w-0 flex-1 overflow-x-auto scrollbar-none py-0.5">
                      <MathView math={it.formula} />
                    </div>
                    <span className="text-[11px] text-slate-500 text-right shrink-0">
                      {it.note}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
