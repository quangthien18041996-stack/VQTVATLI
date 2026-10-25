/**
 * QUIZ ENGINE: BỘ MÁY THI THỬ & CHẤM ĐIỂM TRẮC NGHIỆM CHUẨN CẤU TRÚC 2025
 */

class QuizEngine {
  constructor() {
    this.currentMode = null; // 'grade10', 'grade11', 'grade12', 'national'
    this.userAnswers = {};
    this.timer = null;
    this.timeRemaining = 0; // giây
    this.isSubmitted = false;
  }

  startQuiz(mode) {
    this.currentMode = mode;
    this.userAnswers = {};
    this.isSubmitted = false;

    if (mode === 'national') {
      this.timeRemaining = QUIZ_DATA.nationalExam2025.duration * 60;
      this.startTimer();
      this.renderNationalExam();
    } else {
      this.timeRemaining = 15 * 60; // 15 phút cho bài tập lớp
      this.startTimer();
      this.renderGradeQuiz(mode);
    }
  }

  startTimer() {
    if (this.timer) clearInterval(this.timer);
    this.updateTimerDisplay();

    this.timer = setInterval(() => {
      this.timeRemaining--;
      this.updateTimerDisplay();

      if (this.timeRemaining <= 0) {
        clearInterval(this.timer);
        alert('Đã hết giờ làm bài! Hệ thống sẽ tự động thu bài và chấm điểm.');
        this.submitQuiz();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const timerEl = document.getElementById('quiz-timer');
    if (!timerEl) return;

    const m = Math.floor(this.timeRemaining / 60);
    const s = this.timeRemaining % 60;
    timerEl.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

    if (this.timeRemaining < 300) {
      timerEl.classList.add('timer-warning');
    } else {
      timerEl.classList.remove('timer-warning');
    }
  }

  renderGradeQuiz(mode) {
    const container = document.getElementById('quiz-content-area');
    if (!container) return;

    const questions = QUIZ_DATA[mode];
    const title = mode === 'grade10' ? 'Lớp 10' : mode === 'grade11' ? 'Lớp 11' : 'Lớp 12';

    let html = `
      <div class="quiz-header-card">
        <div>
          <h2 class="text-xl font-bold">Luyện Tập Trắc Nghiệm: Vật Lí ${title}</h2>
          <p class="text-slate-500 text-sm mt-1">Gồm ${questions.length} câu hỏi trắc nghiệm rèn luyện tư duy và phản xạ.</p>
        </div>
        <div class="quiz-timer-badge">
          <i data-lucide="clock"></i>
          <span id="quiz-timer">15:00</span>
        </div>
      </div>
      <div class="questions-list space-y-6 mt-6">
    `;

    questions.forEach((q, idx) => {
      html += `
        <div class="question-card" id="q-card-${q.id}">
          <div class="question-num">Câu ${idx + 1}:</div>
          <div class="question-title mt-1">${q.question}</div>
          <div class="options-group mt-3 space-y-2">
            ${q.options.map((opt, optIdx) => `
              <label class="option-label" data-qid="${q.id}" data-opt="${optIdx}">
                <input type="radio" name="${q.id}" value="${optIdx}" onchange="window.quizEngine.selectAnswer('${q.id}', ${optIdx})">
                <span class="opt-text">${opt}</span>
              </label>
            `).join('')}
          </div>
          <div class="solution-box hidden mt-4" id="sol-${q.id}"></div>
        </div>
      `;
    });

    html += `
      </div>
      <div class="quiz-action-bar mt-8 flex justify-end gap-3">
        <button class="btn btn-outline" onclick="window.quizEngine.resetQuiz()">Làm lại</button>
        <button class="btn btn-primary" onclick="window.quizEngine.submitQuiz()">Nộp Bài & Chấm Điểm</button>
      </div>
    `;

    container.innerHTML = html;
    if (window.renderMathInElement) {
      window.renderMathInElement(container);
    }
    if (window.lucide) window.lucide.createIcons();
  }

  renderNationalExam() {
    const container = document.getElementById('quiz-content-area');
    if (!container) return;

    const exam = QUIZ_DATA.nationalExam2025;

    let html = `
      <div class="quiz-header-card">
        <div>
          <div class="badge badge-accent mb-1">Cấu Trúc Mới 2025</div>
          <h2 class="text-xl font-bold">${exam.title}</h2>
          <p class="text-slate-500 text-sm mt-1">Thời gian làm bài: 50 phút | Gồm 3 phần (Nhiều lựa chọn, Đúng/Sai, Trả lời ngắn).</p>
        </div>
        <div class="quiz-timer-badge">
          <i data-lucide="clock"></i>
          <span id="quiz-timer">50:00</span>
        </div>
      </div>

      <!-- PHẦN I -->
      <div class="exam-part-header mt-8">
        <h3>PHẦN I: CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN</h3>
        <p>Thí sinh trả lời từ câu 1 đến câu ${exam.part1.length}. Mỗi câu hỏi thí sinh chỉ chọn một phương án (0.25 điểm / câu).</p>
      </div>
      <div class="questions-list space-y-5 mt-4">
    `;

    exam.part1.forEach((q, idx) => {
      html += `
        <div class="question-card" id="q-card-${q.id}">
          <div class="question-num font-semibold text-sky-600">Câu ${idx + 1}:</div>
          <div class="question-title mt-1">${q.q}</div>
          <div class="options-group grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            ${q.options.map((opt, optIdx) => `
              <label class="option-label" data-qid="${q.id}" data-opt="${optIdx}">
                <input type="radio" name="${q.id}" value="${optIdx}" onchange="window.quizEngine.selectAnswer('${q.id}', ${optIdx})">
                <span class="opt-text">${opt}</span>
              </label>
            `).join('')}
          </div>
          <div class="solution-box hidden mt-4" id="sol-${q.id}"></div>
        </div>
      `;
    });

    // PHẦN II: ĐÚNG / SAI
    html += `
      </div>
      <div class="exam-part-header mt-10">
        <h3>PHẦN II: CÂU TRẮC NGHIỆM ĐÚNG SAI</h3>
        <p>Thí sinh trả lời từ câu 1 đến câu ${exam.part2.length}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn Đúng hoặc Sai.</p>
        <span class="badge badge-info text-xs mt-1">Thang điểm: Đúng 1 ý: 0.1đ | Đúng 2 ý: 0.25đ | Đúng 3 ý: 0.5đ | Đúng 4 ý: 1.0đ</span>
      </div>
      <div class="questions-list space-y-6 mt-4">
    `;

    exam.part2.forEach((q, qIdx) => {
      html += `
        <div class="question-card border-l-4 border-indigo-500" id="q-card-${q.id}">
          <div class="font-bold text-slate-800 dark:text-slate-100">${q.title}</div>
          <div class="tf-statements-table mt-4">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b text-slate-500">
                  <th class="text-left pb-2">Ý kiến / Nhận định</th>
                  <th class="w-20 text-center pb-2">Đúng</th>
                  <th class="w-20 text-center pb-2">Sai</th>
                </tr>
              </thead>
              <tbody>
                ${q.statements.map((st, stIdx) => `
                  <tr class="border-b border-slate-100 dark:border-slate-800">
                    <td class="py-2.5 pr-2">${st.text}</td>
                    <td class="text-center">
                      <input type="radio" name="${q.id}_${stIdx}" value="true" onchange="window.quizEngine.selectTFAnswer('${q.id}', ${stIdx}, true)">
                    </td>
                    <td class="text-center">
                      <input type="radio" name="${q.id}_${stIdx}" value="false" onchange="window.quizEngine.selectTFAnswer('${q.id}', ${stIdx}, false)">
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="solution-box hidden mt-4" id="sol-${q.id}"></div>
        </div>
      `;
    });

    // PHẦN III: TRẢ LỜI NGẮN
    html += `
      </div>
      <div class="exam-part-header mt-10">
        <h3>PHẦN III: CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (ĐIỀN SỐ)</h3>
        <p>Thí sinh điền kết quả tính toán vào ô đáp án. Mỗi câu đúng được 0.25 điểm.</p>
      </div>
      <div class="questions-list space-y-5 mt-4">
    `;

    exam.part3.forEach((q, idx) => {
      html += `
        <div class="question-card" id="q-card-${q.id}">
          <div class="question-num font-semibold text-emerald-600">Câu ${idx + 1}:</div>
          <div class="question-title mt-1">${q.q}</div>
          <div class="short-answer-input mt-3 flex items-center gap-3">
            <span class="text-sm font-medium text-slate-600 dark:text-slate-300">Đáp án của bạn:</span>
            <input type="number" step="any" class="input-field w-36" placeholder="Nhập số..." id="input-${q.id}" onchange="window.quizEngine.selectShortAnswer('${q.id}', this.value)">
            <span class="text-sm font-bold text-slate-500">${q.unit}</span>
          </div>
          <div class="solution-box hidden mt-4" id="sol-${q.id}"></div>
        </div>
      `;
    });

    html += `
      </div>
      <div class="quiz-action-bar mt-10 flex justify-end gap-3">
        <button class="btn btn-outline" onclick="window.quizEngine.resetQuiz()">Làm lại từ đầu</button>
        <button class="btn btn-primary" onclick="window.quizEngine.submitQuiz()">Nộp Toàn Bộ Bài Thi</button>
      </div>
    `;

    container.innerHTML = html;
    if (window.renderMathInElement) {
      window.renderMathInElement(container);
    }
    if (window.lucide) window.lucide.createIcons();
  }

  selectAnswer(qid, optIdx) {
    this.userAnswers[qid] = optIdx;
  }

  selectTFAnswer(qid, stIdx, val) {
    if (!this.userAnswers[qid]) this.userAnswers[qid] = {};
    this.userAnswers[qid][stIdx] = val;
  }

  selectShortAnswer(qid, val) {
    this.userAnswers[qid] = parseFloat(val);
  }

  submitQuiz() {
    if (this.isSubmitted) return;
    if (this.timer) clearInterval(this.timer);
    this.isSubmitted = true;

    if (this.currentMode === 'national') {
      this.gradeNationalExam();
    } else {
      this.gradeStandardQuiz();
    }
  }

  gradeStandardQuiz() {
    const questions = QUIZ_DATA[this.currentMode];
    let correctCount = 0;

    questions.forEach((q) => {
      const userAns = this.userAnswers[q.id];
      const isCorrect = userAns === q.correct;
      if (isCorrect) correctCount++;

      const card = document.getElementById(`q-card-${q.id}`);
      const sol = document.getElementById(`sol-${q.id}`);

      if (card && sol) {
        card.classList.add(isCorrect ? 'border-green-500' : 'border-red-500');
        sol.classList.remove('hidden');
        sol.innerHTML = `
          <div class="p-3 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200'}">
            <div class="font-bold flex items-center gap-2">
              <i data-lucide="${isCorrect ? 'check-circle' : 'alert-circle'}"></i>
              ${isCorrect ? 'Chính xác!' : `Chưa đúng! Đáp án đúng là: ${q.options[q.correct]}`}
            </div>
            <div class="mt-2 text-sm text-slate-700 dark:text-slate-300"><strong>Giải thích:</strong> ${q.explain}</div>
          </div>
        `;
      }
    });

    const score = ((correctCount / questions.length) * 10).toFixed(1);
    this.showResultModal(score, correctCount, questions.length, 10);
    if (window.renderMathInElement) window.renderMathInElement(document.getElementById('quiz-content-area'));
    if (window.lucide) window.lucide.createIcons();
  }

  gradeNationalExam() {
    const exam = QUIZ_DATA.nationalExam2025;
    let scoreP1 = 0;
    let scoreP2 = 0;
    let scoreP3 = 0;

    // Chấm Phần 1 (Nhiều lựa chọn: mỗi câu 0.25đ)
    exam.part1.forEach((q) => {
      const userAns = this.userAnswers[q.id];
      const isCorrect = userAns === q.correct;
      if (isCorrect) scoreP1 += 0.25;

      const card = document.getElementById(`q-card-${q.id}`);
      const sol = document.getElementById(`sol-${q.id}`);
      if (card && sol) {
        card.classList.add(isCorrect ? 'border-green-500' : 'border-red-500');
        sol.classList.remove('hidden');
        sol.innerHTML = `
          <div class="p-3 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-950/40' : 'bg-red-50 dark:bg-red-950/40'}">
            <span class="font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}">${isCorrect ? '✓ Đúng (+0.25đ)' : `✗ Sai - Đáp án đúng: ${q.options[q.correct]}`}</span>
            <div class="mt-1 text-sm text-slate-700 dark:text-slate-300"><strong>Lời giải:</strong> ${q.explain}</div>
          </div>
        `;
      }
    });

    // Chấm Phần 2 (Đúng/Sai: 1 ý=0.1, 2 ý=0.25, 3 ý=0.5, 4 ý=1.0)
    exam.part2.forEach((q) => {
      const uObj = this.userAnswers[q.id] || {};
      let numMatch = 0;

      let explainHtml = '<div class="space-y-1 mt-2 text-sm">';
      q.statements.forEach((st, idx) => {
        const uChoice = uObj[idx];
        const isMatch = uChoice === st.correct;
        if (isMatch) numMatch++;

        explainHtml += `
          <div>
            <strong>${st.text.slice(0, 2)}:</strong> ${st.correct ? '<span class="text-green-600 font-bold">ĐÚNG</span>' : '<span class="text-red-600 font-bold">SAI</span>'} 
            - <em>${st.explain}</em>
          </div>
        `;
      });
      explainHtml += '</div>';

      let pts = 0;
      if (numMatch === 1) pts = 0.1;
      else if (numMatch === 2) pts = 0.25;
      else if (numMatch === 3) pts = 0.5;
      else if (numMatch === 4) pts = 1.0;

      scoreP2 += pts;

      const card = document.getElementById(`q-card-${q.id}`);
      const sol = document.getElementById(`sol-${q.id}`);
      if (card && sol) {
        sol.classList.remove('hidden');
        sol.innerHTML = `
          <div class="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200">
            <span class="font-bold text-indigo-700">Đúng ${numMatch}/4 ý &rarr; Đạt +${pts} điểm</span>
            ${explainHtml}
          </div>
        `;
      }
    });

    // Chấm Phần 3 (Điền số ngắn: mỗi câu 0.25đ)
    exam.part3.forEach((q) => {
      const uVal = this.userAnswers[q.id];
      const isCorrect = typeof uVal === 'number' && !isNaN(uVal) && Math.abs(uVal - q.answer) <= (q.tolerance || 0.05);
      if (isCorrect) scoreP3 += 0.25;

      const card = document.getElementById(`q-card-${q.id}`);
      const sol = document.getElementById(`sol-${q.id}`);
      if (card && sol) {
        card.classList.add(isCorrect ? 'border-green-500' : 'border-red-500');
        sol.classList.remove('hidden');
        sol.innerHTML = `
          <div class="p-3 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-950/40' : 'bg-red-50 dark:bg-red-950/40'}">
            <span class="font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}">${isCorrect ? `✓ Đúng (+0.25đ) [${q.answer} ${q.unit}]` : `✗ Chưa chính xác. Đáp án đúng: ${q.answer} ${q.unit}`}</span>
            <div class="mt-1 text-sm text-slate-700 dark:text-slate-300"><strong>Lời giải:</strong> ${q.explain}</div>
          </div>
        `;
      }
    });

    const totalScore = (scoreP1 + scoreP2 + scoreP3).toFixed(2);
    this.showNationalResultModal(totalScore, scoreP1.toFixed(2), scoreP2.toFixed(2), scoreP3.toFixed(2));
    if (window.renderMathInElement) window.renderMathInElement(document.getElementById('quiz-content-area'));
    if (window.lucide) window.lucide.createIcons();
  }

  showResultModal(score, correct, total, maxPoints) {
    const modal = document.getElementById('result-modal');
    if (!modal) return;
    document.getElementById('res-score').textContent = score;
    document.getElementById('res-details').textContent = `Trả lời đúng ${correct}/${total} câu hỏi.`;

    let feedback = 'Cần cố gắng ôn luyện thêm!';
    if (score >= 8.5) feedback = 'Xuất sắc! Bạn nắm rất vững kiến thức!';
    else if (score >= 7.0) feedback = 'Khá tốt! Hãy rà soát lại các câu sai để hoàn thiện điểm số!';
    else if (score >= 5.0) feedback = 'Đạt mức trung bình, cần ôn lại lý thuyết trọng tâm!';
    document.getElementById('res-feedback').textContent = feedback;

    modal.classList.remove('hidden');
  }

  showNationalResultModal(total, p1, p2, p3) {
    const modal = document.getElementById('result-modal');
    if (!modal) return;
    document.getElementById('res-score').textContent = total;
    document.getElementById('res-details').innerHTML = `
      <div class="grid grid-cols-3 gap-2 text-center text-xs mt-2">
        <div class="p-2 bg-slate-100 dark:bg-slate-800 rounded">Phần I: <strong>${p1}đ</strong></div>
        <div class="p-2 bg-slate-100 dark:bg-slate-800 rounded">Phần II: <strong>${p2}đ</strong></div>
        <div class="p-2 bg-slate-100 dark:bg-slate-800 rounded">Phần III: <strong>${p3}đ</strong></div>
      </div>
    `;

    let feedback = '';
    const num = parseFloat(total);
    if (num >= 8.5) feedback = 'Mục tiêu 9+ trong tầm tay! Kỹ năng giải trắc nghiệm rất chắc chắn!';
    else if (num >= 7.0) feedback = 'Kết quả tốt! Cần chú ý bẫy ở Phần II (Đúng/Sai) để tối ưu điểm!';
    else feedback = 'Nên dành thêm thời gian luyện đề và xem lại các công thức cốt lõi.';
    document.getElementById('res-feedback').textContent = feedback;

    modal.classList.remove('hidden');
  }

  resetQuiz() {
    this.startQuiz(this.currentMode);
  }
}

window.QuizEngine = QuizEngine;
window.quizEngine = new QuizEngine();
