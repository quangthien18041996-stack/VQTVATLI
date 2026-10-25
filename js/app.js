/**
 * ỨNG DỤNG HỌC VẬT LÍ THPT (PHYSICSHUB THPT) - CONTROLLER CHÍNH
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Khởi tạo State
  const AppState = {
    currentGrade: 10,
    currentTab: 'curriculum',
    activeSim: 'pendulum',
    bookmarks: JSON.parse(localStorage.getItem('vatli_bookmarks') || '[]'),
    theme: localStorage.getItem('vatli_theme') || 'light'
  };

  // Khởi tạo các biến toàn cục mô phỏng
  let simInstances = {};

  // 2. Thiết lập Theme
  const initTheme = () => {
    if (AppState.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    AppState.theme = AppState.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('vatli_theme', AppState.theme);
    initTheme();
  };

  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);

  // 3. Chuyển đổi Tab chính
  const navTabs = document.querySelectorAll('.nav-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  const switchTab = (tabId) => {
    AppState.currentTab = tabId;
    navTabs.forEach((btn) => {
      if (btn.dataset.tab === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    tabPanes.forEach((pane) => {
      if (pane.id === `tab-${tabId}`) {
        pane.classList.remove('hidden');
      } else {
        pane.classList.add('hidden');
      }
    });

    if (tabId === 'simulations') {
      initOrUpdateSimulation(AppState.activeSim);
    } else if (tabId === 'formulas') {
      renderFormulas();
    } else if (tabId === 'tools') {
      renderConstants();
    }

    renderMath();
  };

  navTabs.forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // 4. Chọn Lớp (10, 11, 12)
  const gradeButtons = document.querySelectorAll('.grade-select-btn');
  const switchGrade = (grade) => {
    AppState.currentGrade = parseInt(grade, 10);
    gradeButtons.forEach((btn) => {
      if (parseInt(btn.dataset.grade, 10) === AppState.currentGrade) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    renderCurriculum();
    renderFormulas();
  };

  gradeButtons.forEach((btn) => {
    btn.addEventListener('click', () => switchGrade(btn.dataset.grade));
  });

  // 5. Render Chương trình Lý thuyết (Curriculum)
  const renderCurriculum = () => {
    const container = document.getElementById('curriculum-chapters-container');
    if (!container) return;

    const gradeData = CURRICULUM_DATA[AppState.currentGrade];
    if (!gradeData) return;

    document.getElementById('curriculum-grade-title').textContent = gradeData.title;
    document.getElementById('curriculum-grade-desc').textContent = gradeData.description;

    let html = '';
    gradeData.chapters.forEach((chap, cIdx) => {
      html += `
        <div class="chapter-card mb-6">
          <div class="chapter-header flex items-center justify-between cursor-pointer" onclick="window.toggleChapter('${chap.id}')">
            <div class="flex items-center gap-3">
              <span class="chapter-badge">${cIdx + 1}</span>
              <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">${chap.title}</h3>
            </div>
            <i data-lucide="chevron-down" class="transform transition-transform" id="icon-${chap.id}"></i>
          </div>
          <div class="lessons-container mt-4 space-y-4" id="${chap.id}">
            ${chap.lessons.map((lesson) => `
              <div class="lesson-card p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between">
                  <div>
                    <h4 class="font-bold text-sky-600 dark:text-sky-400 text-base">${lesson.title}</h4>
                    <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">${lesson.summary}</p>
                  </div>
                  <button class="btn btn-sm btn-outline flex items-center gap-1.5 ml-4" onclick="window.openLessonModal('${chap.id}', '${lesson.id}')">
                    <i data-lucide="book-open"></i>
                    <span>Chi tiết</span>
                  </button>
                </div>
                ${lesson.keyFormulas && lesson.keyFormulas.length > 0 ? `
                  <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap gap-2">
                    ${lesson.keyFormulas.map(f => `
                      <span class="formula-pill text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                        ${f.name}: $${f.math}$
                      </span>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    renderMath();
    if (window.lucide) window.lucide.createIcons();
  };

  window.toggleChapter = (chapId) => {
    const el = document.getElementById(chapId);
    const icon = document.getElementById(`icon-${chapId}`);
    if (el) {
      el.classList.toggle('hidden');
      if (icon) icon.classList.toggle('rotate-180');
    }
  };

  window.openLessonModal = (chapId, lessonId) => {
    const gradeData = CURRICULUM_DATA[AppState.currentGrade];
    const chap = gradeData.chapters.find(c => c.id === chapId);
    if (!chap) return;
    const lesson = chap.lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    const modal = document.getElementById('lesson-modal');
    document.getElementById('lesson-modal-title').textContent = lesson.title;
    document.getElementById('lesson-modal-summary').textContent = lesson.summary;
    document.getElementById('lesson-modal-body').innerHTML = lesson.content;

    let tipHtml = '';
    if (lesson.tips) {
      tipHtml = `
        <div class="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 mt-6">
          <div class="font-bold flex items-center gap-2 mb-1">
            <i data-lucide="lightbulb"></i>
            <span>Mẹo ghi nhớ & Bẫy trắc nghiệm:</span>
          </div>
          <p class="text-sm">${lesson.tips}</p>
        </div>
      `;
    }
    document.getElementById('lesson-modal-tips').innerHTML = tipHtml;

    modal.classList.remove('hidden');
    renderMath();
    if (window.lucide) window.lucide.createIcons();
  };

  window.closeLessonModal = () => {
    document.getElementById('lesson-modal')?.classList.add('hidden');
  };

  // 6. Quản lý Phòng Thí Nghiệm Ảo (Simulations)
  const simNavButtons = document.querySelectorAll('.sim-nav-btn');
  const simViews = document.querySelectorAll('.sim-view-card');

  const switchSim = (simId) => {
    AppState.activeSim = simId;
    simNavButtons.forEach((btn) => {
      if (btn.dataset.sim === simId) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    simViews.forEach((view) => {
      if (view.id === `sim-view-${simId}`) view.classList.remove('hidden');
      else view.classList.add('hidden');
    });

    initOrUpdateSimulation(simId);
  };

  simNavButtons.forEach((btn) => {
    btn.addEventListener('click', () => switchSim(btn.dataset.sim));
  });

  const initOrUpdateSimulation = (simId) => {
    if (simId === 'pendulum') {
      if (!simInstances.pendulum && window.PendulumSimulation) {
        simInstances.pendulum = new window.PendulumSimulation('canvas-pendulum');
        bindPendulumControls();
      }
    } else if (simId === 'wave') {
      if (!simInstances.wave && window.WaveInterferenceSimulation) {
        simInstances.wave = new window.WaveInterferenceSimulation('canvas-wave');
        bindWaveControls();
      }
    } else if (simId === 'projectile') {
      if (!simInstances.projectile && window.ProjectileSimulation) {
        simInstances.projectile = new window.ProjectileSimulation('canvas-projectile');
        bindProjectileControls();
      }
    } else if (simId === 'circuit') {
      if (!simInstances.circuit && window.CircuitSimulation) {
        simInstances.circuit = new window.CircuitSimulation('canvas-circuit');
        bindCircuitControls();
      }
    } else if (simId === 'gas') {
      if (!simInstances.gas && window.IdealGasSimulation) {
        simInstances.gas = new window.IdealGasSimulation('canvas-gas');
        bindGasControls();
      }
    }
  };

  // Ràng buộc điều khiển cho từng Lab
  const bindPendulumControls = () => {
    const sim = simInstances.pendulum;
    if (!sim) return;

    document.getElementById('sim-pendulum-mode')?.addEventListener('change', (e) => {
      sim.setMode(e.target.value);
      const isSimple = e.target.value === 'simple';
      document.getElementById('group-pendulum-simple')?.classList.toggle('hidden', !isSimple);
      document.getElementById('group-pendulum-spring')?.classList.toggle('hidden', isSimple);
    });

    document.getElementById('pendulum-length')?.addEventListener('input', (e) => {
      sim.setParam('length', e.target.value);
      document.getElementById('val-pendulum-length').textContent = `${e.target.value} m`;
    });
    document.getElementById('pendulum-mass')?.addEventListener('input', (e) => {
      sim.setParam('mass', e.target.value);
      document.getElementById('val-pendulum-mass').textContent = `${e.target.value} kg`;
    });
    document.getElementById('pendulum-gravity')?.addEventListener('input', (e) => {
      sim.setParam('gravity', e.target.value);
      document.getElementById('val-pendulum-gravity').textContent = `${e.target.value} m/s²`;
    });
    document.getElementById('pendulum-k')?.addEventListener('input', (e) => {
      sim.setParam('k', e.target.value);
      document.getElementById('val-pendulum-k').textContent = `${e.target.value} N/m`;
    });

    document.getElementById('btn-pendulum-play')?.addEventListener('click', () => sim.togglePlay());
    document.getElementById('btn-pendulum-reset')?.addEventListener('click', () => sim.reset());
  };

  const bindWaveControls = () => {
    const sim = simInstances.wave;
    if (!sim) return;

    document.getElementById('wave-dist')?.addEventListener('input', (e) => {
      sim.setParam('distance', e.target.value);
      document.getElementById('val-wave-dist').textContent = `${e.target.value} px`;
    });
    document.getElementById('wave-lambda')?.addEventListener('input', (e) => {
      sim.setParam('wavelength', e.target.value);
      document.getElementById('val-wave-lambda').textContent = `${e.target.value} px`;
    });
    document.getElementById('wave-phase')?.addEventListener('input', (e) => {
      sim.setParam('phaseDiff', e.target.value);
      document.getElementById('val-wave-phase').textContent = `${e.target.value}°`;
    });

    document.getElementById('btn-wave-hyperbola')?.addEventListener('click', () => sim.toggleHyperbolas());
    document.getElementById('btn-wave-play')?.addEventListener('click', () => sim.togglePlay());
    document.getElementById('btn-wave-reset')?.addEventListener('click', () => sim.reset());
  };

  const bindProjectileControls = () => {
    const sim = simInstances.projectile;
    if (!sim) return;

    document.getElementById('proj-angle')?.addEventListener('input', (e) => {
      sim.setParam('angle', e.target.value);
      document.getElementById('val-proj-angle').textContent = `${e.target.value}°`;
    });
    document.getElementById('proj-v0')?.addEventListener('input', (e) => {
      sim.setParam('v0', e.target.value);
      document.getElementById('val-proj-v0').textContent = `${e.target.value} m/s`;
    });
    document.getElementById('proj-h0')?.addEventListener('input', (e) => {
      sim.setParam('h0', e.target.value);
      document.getElementById('val-proj-h0').textContent = `${e.target.value} m`;
    });
    document.getElementById('proj-g')?.addEventListener('input', (e) => {
      sim.setParam('gravity', e.target.value);
      document.getElementById('val-proj-g').textContent = `${e.target.value} m/s²`;
    });

    document.getElementById('btn-proj-fire')?.addEventListener('click', () => sim.fire());
    document.getElementById('btn-proj-reset')?.addEventListener('click', () => sim.reset());
    document.getElementById('btn-proj-clear')?.addEventListener('click', () => sim.clearAllPaths());
  };

  const bindCircuitControls = () => {
    const sim = simInstances.circuit;
    if (!sim) return;

    document.getElementById('circuit-emf')?.addEventListener('input', (e) => {
      sim.setParam('emf', e.target.value);
      document.getElementById('val-circuit-emf').textContent = `${e.target.value} V`;
    });
    document.getElementById('circuit-r')?.addEventListener('input', (e) => {
      sim.setParam('r', e.target.value);
      document.getElementById('val-circuit-r').textContent = `${e.target.value} Ω`;
    });
    document.getElementById('circuit-R')?.addEventListener('input', (e) => {
      sim.setParam('R', e.target.value);
      document.getElementById('val-circuit-R').textContent = `${e.target.value} Ω`;
    });

    document.getElementById('btn-circuit-switch')?.addEventListener('click', () => sim.toggleSwitch());
  };

  const bindGasControls = () => {
    const sim = simInstances.gas;
    if (!sim) return;

    document.getElementById('gas-temp')?.addEventListener('input', (e) => {
      sim.setParam('temperature', e.target.value);
      document.getElementById('val-gas-temp').textContent = `${e.target.value} K (${Math.round(e.target.value - 273.15)}°C)`;
    });
    document.getElementById('gas-volume')?.addEventListener('input', (e) => {
      sim.setParam('volume', e.target.value);
      document.getElementById('val-gas-volume').textContent = `${(e.target.value * 10).toFixed(1)} L`;
    });
  };

  // 7. Sổ Tay Công Thức & Tìm kiếm
  const formulaSearchInput = document.getElementById('formula-search');
  formulaSearchInput?.addEventListener('input', () => renderFormulas());

  const renderFormulas = () => {
    const container = document.getElementById('formulas-list-container');
    if (!container) return;

    const query = (formulaSearchInput?.value || '').toLowerCase().trim();
    const filtered = FORMULA_DATA.filter((f) => {
      const matchGrade = AppState.currentGrade === 'all' || f.grade === AppState.currentGrade;
      const matchQuery = !query ||
        f.name.toLowerCase().includes(query) ||
        f.category.toLowerCase().includes(query) ||
        f.latex.toLowerCase().includes(query) ||
        (f.note && f.note.toLowerCase().includes(query));
      return matchGrade && matchQuery;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 text-slate-400">
          <i data-lucide="search-x" class="mx-auto w-10 h-10 mb-2"></i>
          <p>Không tìm thấy công thức phù hợp với từ khóa "${query}".</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    let html = '';
    filtered.forEach((f) => {
      html += `
        <div class="formula-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all">
          <div class="flex items-start justify-between">
            <span class="badge badge-primary text-xs">${f.category} (Lớp ${f.grade})</span>
            <button class="text-slate-400 hover:text-amber-500" onclick="window.toggleBookmark('${f.id}')">
              <i data-lucide="bookmark" class="${AppState.bookmarks.includes(f.id) ? 'fill-amber-500 text-amber-500' : ''}"></i>
            </button>
          </div>
          <h4 class="font-bold text-slate-800 dark:text-slate-100 text-base mt-2">${f.name}</h4>
          <div class="formula-latex-box p-3.5 my-3 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900 text-center font-mono text-base text-sky-800 dark:text-sky-300">
            $$${f.latex}$$
          </div>
          <div class="variables-list text-xs space-y-1 text-slate-600 dark:text-slate-300">
            ${f.variables.map(v => `<div>• <strong>${v.sym}</strong>: ${v.desc} (${v.unit})</div>`).join('')}
          </div>
          ${f.note ? `
            <div class="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-amber-600 dark:text-amber-400">
              <strong>Lưu ý:</strong> ${f.note}
            </div>
          ` : ''}
        </div>
      `;
    });

    container.innerHTML = html;
    renderMath();
    if (window.lucide) window.lucide.createIcons();
  };

  window.toggleBookmark = (fid) => {
    const idx = AppState.bookmarks.indexOf(fid);
    if (idx > -1) AppState.bookmarks.splice(idx, 1);
    else AppState.bookmarks.push(fid);
    localStorage.setItem('vatli_bookmarks', JSON.stringify(AppState.bookmarks));
    renderFormulas();
  };

  // 8. Bảng Hằng Số & Máy Tính Giải Nhanh
  const renderConstants = () => {
    const tbody = document.getElementById('constants-table-body');
    if (!tbody) return;

    let html = '';
    CONSTANTS_DATA.forEach((c) => {
      html += `
        <tr class="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40">
          <td class="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">${c.name}</td>
          <td class="py-2.5 px-3 font-mono font-bold text-sky-600 dark:text-sky-400">${c.symbol}</td>
          <td class="py-2.5 px-3 font-mono text-emerald-600 dark:text-emerald-400">${c.value}</td>
          <td class="py-2.5 px-3 font-mono text-slate-500">${c.unit}</td>
          <td class="py-2.5 px-3 text-xs text-slate-500">${c.desc}</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  };

  // Máy tính nhanh Spring
  window.calculateSpring = () => {
    const m = parseFloat(document.getElementById('calc-spring-m')?.value);
    const k = parseFloat(document.getElementById('calc-spring-k')?.value);
    const A = parseFloat(document.getElementById('calc-spring-A')?.value);

    const res = PhysicsCalculator.calcSpring(m, k, A);
    const outEl = document.getElementById('calc-spring-result');
    if (!res) {
      outEl.innerHTML = '<span class="text-red-500">Vui lòng nhập m > 0 và k > 0.</span>';
      return;
    }

    outEl.innerHTML = `
      <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
        <div class="p-2 bg-sky-50 dark:bg-sky-950/40 rounded text-center">
          <div class="text-xs text-slate-500">Chu kỳ T</div>
          <div class="font-bold text-sky-600">${res.T} s</div>
        </div>
        <div class="p-2 bg-sky-50 dark:bg-sky-950/40 rounded text-center">
          <div class="text-xs text-slate-500">Tần số f</div>
          <div class="font-bold text-sky-600">${res.f} Hz</div>
        </div>
        <div class="p-2 bg-sky-50 dark:bg-sky-950/40 rounded text-center">
          <div class="text-xs text-slate-500">Tần số góc ω</div>
          <div class="font-bold text-sky-600">${res.omega} rad/s</div>
        </div>
        <div class="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded text-center">
          <div class="text-xs text-slate-500">Cơ năng W</div>
          <div class="font-bold text-emerald-600">${res.W} J</div>
        </div>
        <div class="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded text-center">
          <div class="text-xs text-slate-500">Vận tốc max</div>
          <div class="font-bold text-emerald-600">${res.vmax} m/s</div>
        </div>
        <div class="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded text-center">
          <div class="text-xs text-slate-500">Gia tốc max</div>
          <div class="font-bold text-emerald-600">${res.amax} m/s²</div>
        </div>
      </div>
    `;
  };

  // Chuyển đổi đơn vị
  window.convertUnit = () => {
    const val = document.getElementById('unit-val')?.value;
    const type = document.getElementById('unit-type')?.value;
    const from = document.getElementById('unit-from')?.value;
    const to = document.getElementById('unit-to')?.value;

    const res = PhysicsCalculator.convertUnit(val, type, from, to);
    document.getElementById('unit-result').textContent = `${parseFloat(res.toPrecision(6))}`;
  };

  // Cập nhật các select đơn vị khi đổi type
  window.updateUnitOptions = () => {
    const type = document.getElementById('unit-type')?.value;
    const fromSel = document.getElementById('unit-from');
    const toSel = document.getElementById('unit-to');

    let opts = [];
    if (type === 'speed') {
      opts = [
        { val: 'ms', label: 'm/s (Mét trên giây)' },
        { val: 'kmh', label: 'km/h (Kilômét trên giờ)' }
      ];
    } else if (type === 'temp') {
      opts = [
        { val: 'c', label: '°C (Độ Celsius)' },
        { val: 'k', label: 'K (Độ Kelvin)' },
        { val: 'f', label: '°F (Độ Fahrenheit)' }
      ];
    } else if (type === 'energy') {
      opts = [
        { val: 'j', label: 'J (Joule)' },
        { val: 'kj', label: 'kJ (Kilôjoule)' },
        { val: 'ev', label: 'eV (Electron-vôn)' },
        { val: 'mev', label: 'MeV (Mega-eV)' },
        { val: 'cal', label: 'cal (Calo)' }
      ];
    } else if (type === 'pressure') {
      opts = [
        { val: 'pa', label: 'Pa (Pascal)' },
        { val: 'atm', label: 'atm (Atmosphere)' },
        { val: 'mmhg', label: 'mmHg (Milimét thủy ngân)' },
        { val: 'bar', label: 'bar' }
      ];
    }

    const html = opts.map(o => `<option value="${o.val}">${o.label}</option>`).join('');
    fromSel.innerHTML = html;
    toSel.innerHTML = html;
    if (opts.length > 1) toSel.selectedIndex = 1;
    window.convertUnit();
  };

  // 9. KaTeX Math Renderer Wrapper
  const renderMath = () => {
    if (window.renderMathInElement) {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  };

  // Khởi động
  initTheme();
  renderCurriculum();
  renderFormulas();
  renderConstants();
  window.updateUnitOptions?.();
  if (window.quizEngine) {
    window.quizEngine.startQuiz('grade10');
  }
});
