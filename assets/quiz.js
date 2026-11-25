/* One question flow for every test, based on 基数変換. */
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('quiz-app');
  if (!app) return;
  let questions;
  try {
    questions = JSON.parse(document.getElementById('quiz-data').textContent);
    if (!Array.isArray(questions) || !questions.length || questions.some(q =>
      !Array.isArray(q.opts) || q.opts.length < 2 || q.opts.length > 10 || !Number.isInteger(q.ans) || q.ans < 0 || q.ans >= q.opts.length ||
      !['easy', 'med', 'hard', 'review'].includes(q.d))) throw new Error('Invalid question bank');
  } catch {
    app.textContent = FE.t("Không tải được câu hỏi. Hãy tải lại trang.");
    return;
  }
  const total = questions.length;
  let showingResult = false;
  const languageBox = document.createElement('div');
  languageBox.className = 'quiz-language';
  languageBox.innerHTML = '<button type="button" id="quiz-reset-all" class="quiz-keys-toggle">↻ Làm lại tất cả</button><button type="button" id="quiz-keys-toggle" class="quiz-keys-toggle" aria-expanded="false" aria-controls="quiz-keys-panel">⌨ Phím tắt</button><label for="quiz-language">Tiếng Việt / 日本語</label> <select id="quiz-language" aria-label="Ngôn ngữ / 言語"><option value="vi">Tiếng Việt</option><option value="ja">日本語</option></select>';
  const keysPanel = document.createElement('div');
  keysPanel.id = 'quiz-keys-panel';
  keysPanel.className = 'quiz-keys-panel';
  keysPanel.hidden = true;
  const controlsHost = document.querySelector('.lesson-hero');
  if (controlsHost) controlsHost.append(languageBox, keysPanel);
  else app.before(languageBox, keysPanel);
  const languageSelect = languageBox.querySelector('select');
  const keysToggle = languageBox.querySelector('#quiz-keys-toggle');
  const resetAllBtn = languageBox.querySelector('#quiz-reset-all');
  languageSelect.value = FE.read('language', 'vi') === 'ja' ? 'ja' : 'vi';
  const languageStyle = document.createElement('style');
  languageStyle.textContent = '.quiz-language{display:flex;justify-content:flex-end;align-items:center;flex-wrap:wrap;gap:10px;margin:16px 0;font-size:13px}.quiz-language select{font:inherit;background:#252525;color:#f5f5f5;border:1px solid #444;border-radius:8px;padding:8px 12px}.quiz-language select:focus-visible{outline:2px solid #a579ef;outline-offset:3px}';
  document.head.append(languageStyle);
  const DEFAULT_KEYS = { opt0: '1', opt1: '2', opt2: '3', opt3: '4', prev: 'arrowleft', next: 'arrowright' };
  const KEY_SLOTS = ['opt0', 'opt1', 'opt2', 'opt3', 'prev', 'next'];
  const normKey = key => key === ' ' ? 'space' : String(key || '').toLowerCase();
  const keyLabel = key => ({ arrowleft: '←', arrowright: '→', arrowup: '↑', arrowdown: '↓', space: 'Space', enter: 'Enter' }[key] || String(key || '').toUpperCase());
  const loadKeys = () => {
    const raw = FE.read('quiz-keys', null);
    const out = { ...DEFAULT_KEYS };
    if (raw && typeof raw === 'object') {
      KEY_SLOTS.forEach(slot => { if (typeof raw[slot] === 'string' && raw[slot].trim()) out[slot] = normKey(raw[slot]); });
    }
    return out;
  };
  let keys = loadKeys();
  let recordingSlot = null;
  const saveKeys = () => FE.write('quiz-keys', keys);
  function renderKeysPanel() {
    const ja = FE.read('language', 'vi') === 'ja';
    keysToggle.textContent = ja ? '⌨ ショートカット' : '⌨ Phím tắt';
    resetAllBtn.textContent = ja ? '↻ すべてやり直す' : '↻ Làm lại tất cả';
    const labels = ja
      ? { opt0: 'A', opt1: 'B', opt2: 'C', opt3: 'D', prev: '前へ', next: '次へ' }
      : { opt0: 'A', opt1: 'B', opt2: 'C', opt3: 'D', prev: 'Câu trước', next: 'Câu tiếp' };
    keysPanel.innerHTML = `
      <div class="quiz-keys-head">
        <span>${ja ? 'ボタンをクリックして割り当てるキーを押してください（Escでキャンセル）' : 'Bấm vào một ô rồi nhấn phím bất kỳ trên bàn phím để đổi (Esc để hủy)'}</span>
        <button type="button" class="quiz-keys-reset" id="quiz-keys-reset">${ja ? '初期設定に戻す' : 'Mặc định'}</button>
      </div>
      <div class="quiz-keys-grid">${KEY_SLOTS.map(slot => `
        <button type="button" class="quiz-key-btn ${recordingSlot === slot ? 'recording' : ''}" data-slot="${slot}">
          <span>${labels[slot]}</span>
          <kbd>${recordingSlot === slot ? (ja ? '入力待ち…' : 'Nhấn phím…') : keyLabel(keys[slot])}</kbd>
        </button>`).join('')}</div>`;
    keysPanel.querySelectorAll('[data-slot]').forEach(btn => btn.onclick = () => {
      recordingSlot = recordingSlot === btn.dataset.slot ? null : btn.dataset.slot;
      renderKeysPanel();
    });
    keysPanel.querySelector('#quiz-keys-reset').onclick = () => {
      recordingSlot = null;
      keys = { ...DEFAULT_KEYS };
      saveKeys();
      renderKeysPanel();
      if (!showingResult) render();
    };
  }
  keysToggle.onclick = () => {
    keysPanel.hidden = !keysPanel.hidden;
    keysToggle.setAttribute('aria-expanded', String(!keysPanel.hidden));
    if (keysPanel.hidden) recordingSlot = null;
    renderKeysPanel();
  };
  resetAllBtn.onclick = () => {
    const ja = FE.read('language', 'vi') === 'ja';
    if (stats().done > 0 && !confirm(ja ? 'すべての回答をリセットして最初からやり直しますか？' : 'Xóa tất cả đáp án đã chọn và làm lại từ đầu?')) return;
    picks.fill(null);
    jump(0);
  };
  const number = (location.pathname.match(/\/([^/]+)\.html$/) || ['', 'quiz'])[1];
  // Reuse the existing Bài 01 attempt format and storage keys for every lesson.
  const saved = FE.read('test:' + number, {});
  if (!FE.read('activity:' + number, null)) FE.write('activity:' + number, { startedAt: new Date().toISOString() });
  const picks = questions.map((q, i) => Number.isInteger(saved?.picks?.[i]) && saved.picks[i] >= 0 && saved.picks[i] < q.opts.length ? saved.picks[i] : null);
  let current = Number.isInteger(saved?.cur) ? Math.max(0, Math.min(total - 1, saved.cur)) : 0;
  const lettersVi = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const lettersJa = ['ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ'];
  const optionLetter = (i, q, japanese) => (japanese && (q.opts.length > 4 || q.source)) ? lettersJa[i] : lettersVi[i];
  const escapeCode = value => String(value || '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const examMinutes = Number(app.dataset.examMinutes || 0);
  let examRemaining = examMinutes > 0 ? examMinutes * 60 : 0;
  let examRunning = false;
  let examInterval = null;
  const formatExamClock = sec => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
  let examBar = null;
  if (examMinutes > 0) {
    examBar = document.createElement('div');
    examBar.className = 'quiz-exam-timer';
    examBar.id = 'quiz-exam-timer';
    examBar.innerHTML = `<span class="quiz-exam-label">⏱ ${examMinutes} phút · 科目B</span><strong class="quiz-exam-clock" id="quiz-exam-clock">${formatExamClock(examRemaining)}</strong><div class="quiz-exam-btns"><button type="button" id="quiz-exam-toggle">▶ Bắt đầu</button><button type="button" id="quiz-exam-reset">↻ Đặt lại</button></div>`;
    app.before(examBar);
    const updateExamClock = () => {
      const clock = examBar.querySelector('#quiz-exam-clock');
      const btn = examBar.querySelector('#quiz-exam-toggle');
      const ja = FE.read('language', 'vi') === 'ja';
      if (clock) clock.textContent = formatExamClock(examRemaining);
      examBar.classList.toggle('low', examRemaining <= 600);
      if (btn) btn.textContent = examRunning ? (ja ? '⏸ 一時停止' : '⏸ Tạm dừng') : (ja ? '▶ 開始' : '▶ Bắt đầu');
    };
    const stopExamTimer = () => { clearInterval(examInterval); examInterval = null; examRunning = false; updateExamClock(); };
    examBar.querySelector('#quiz-exam-toggle').onclick = () => {
      if (examRunning) { stopExamTimer(); return; }
      if (examRemaining <= 0) examRemaining = examMinutes * 60;
      examRunning = true;
      updateExamClock();
      examInterval = setInterval(() => {
        examRemaining = Math.max(0, examRemaining - 1);
        updateExamClock();
        if (examRemaining <= 0) { stopExamTimer(); if (!showingResult) showResult(); }
      }, 1000);
    };
    examBar.querySelector('#quiz-exam-reset').onclick = () => { stopExamTimer(); examRemaining = examMinutes * 60; updateExamClock(); };
    updateExamClock();
  }
  const levelNames = () => FE.read('language', 'vi') === 'ja'
    ? {easy:'易しい',med:'標準',hard:'難しい',review:'復習'}
    : {easy:'易 Dễ',med:'中 Trung bình',hard:'難 Khó',review:'Ôn tập'};
  // The bank is authored HTML from this repository, just like the original lessons.
  const format = value => String(value || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  const stats = () => {
    const done = picks.filter(p => p !== null).length;
    const correct = picks.filter((p, i) => p === questions[i].ans).length;
    return { done, correct, wrong: done - correct };
  };
  const save = () => FE.write('test:' + number, { cur: current, picks, total, updatedAt: new Date().toISOString() });
  let catPopupTimer = null;
  function flashCat(isCorrect) {
    let pop = document.getElementById('quiz-cat-pop');
    if (!pop) {
      pop = document.createElement('div');
      pop.id = 'quiz-cat-pop';
      pop.className = 'quiz-cat-pop';
      pop.setAttribute('aria-hidden', 'true');
      pop.innerHTML = '<img alt="">';
      document.body.append(pop);
    }
    const img = pop.querySelector('img');
    img.src = isCorrect ? '../assets/cats/love.jpg' : '../assets/cats/grumpy.jpg';
    pop.classList.remove('show', 'ok', 'ng');
    void pop.offsetWidth;
    pop.classList.add('show', isCorrect ? 'ok' : 'ng');
    clearTimeout(catPopupTimer);
    catPopupTimer = setTimeout(() => pop.classList.remove('show'), 1100);
  }
  function jump(index) { current = index; save(); render(); }
  function pickAnswer(choice) {
    if (picks[current] !== null || choice < 0 || choice >= questions[current].opts.length) return;
    picks[current] = choice;
    save();
    render();
    flashCat(choice === questions[current].ans);
    app.querySelector('#quiz-explain-toggle')?.focus({ preventScroll: true });
  }
  function render() {
    showingResult = false;
    const original = questions[current];
    const japanese = FE.read('language', 'vi') === 'ja';
    const q = japanese ? {...original, q:original.qJa || original.jp || original.q, jp:'', opts:original.optsJa || original.opts,
      why:original.whyJa ?? original.why, details:original.detailsJa || original.details, extra:original.extraJa || original.extra} : original;
    const levels = levelNames();
    const answered = picks[current] !== null;
    const { done, correct, wrong } = stats();
    app.innerHTML = `
      <div class="quiz-progress" aria-label="Tiến độ trả lời">
        <div class="quiz-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${done}"><div style="width:${done / total * 100}%"></div></div>
        <div class="quiz-meta"><span>${FE.t("Câu")} <strong>${current + 1}</strong> / ${total}</span><span>${FE.t("Đã làm:")} <strong>${done}</strong> · ${FE.t("Đúng:")} <strong class="quiz-good">${correct}</strong> · ${FE.t("Sai:")} <strong class="quiz-bad">${wrong}</strong></span></div>
      </div>
      <section class="quiz-question-card" aria-label="${FE.t("Câu")} ${current + 1}">
        <div class="quiz-question-head"><span class="quiz-number">${FE.t("Câu")} ${current + 1}/${total}</span><span class="quiz-level ${q.d}">${levels[q.d]}</span></div>
        <div class="quiz-question-text">${format(q.q)}</div>
        ${q.jp ? `<div class="quiz-question-jp" lang="ja">${format(q.jp)}</div>` : ''}
        ${q.code ? `<pre class="quiz-code" lang="ja"><code>${escapeCode(q.code)}</code></pre>` : ''}
        ${q.extra ? `<div class="quiz-extra">${format(q.extra)}</div>` : ''}
        <div class="quiz-options">${q.opts.map((option, i) => `
          <button type="button" class="quiz-option ${answered ? (i === q.ans ? 'correct' : i === picks[current] ? 'wrong' : '') : ''}" data-pick="${i}" aria-pressed="${i === picks[current]}" ${answered ? 'disabled' : ''}>
            <span class="quiz-letter">${optionLetter(i, q, japanese)}.</span><span>${format(option)}</span>
            ${answered && i === q.ans ? '<span class="quiz-answer-mark">✓</span>' : answered && i === picks[current] ? '<span class="quiz-answer-mark">✕</span>' : (i < 4 ? `<kbd class="quiz-kbd" aria-hidden="true">${keyLabel(keys['opt' + i])}</kbd>` : (i < 9 ? `<kbd class="quiz-kbd" aria-hidden="true">${i + 1}</kbd>` : '<kbd class="quiz-kbd" aria-hidden="true">0</kbd>'))}
          </button>`).join('')}</div>
        ${answered ? `<p class="quiz-feedback ${picks[current] === q.ans ? 'quiz-good' : 'quiz-bad'}" role="status">${picks[current] === q.ans ? FE.t("✓ Chính xác!") : FE.t("✕ Chưa đúng.")} ${FE.t("Đáp án đúng:")} ${optionLetter(q.ans, q, japanese)}.</p>
          <button type="button" id="quiz-explain-toggle" aria-expanded="false" aria-controls="quiz-explanation">${FE.t("📖 Xem giải thích")}</button>
          <div class="quiz-explanation" id="quiz-explanation" hidden>
            <h3>${FE.t("Đáp án đúng:")} ${optionLetter(q.ans, q, japanese)}</h3>
            ${q.why ? `<div>${format(q.why)}</div>` : ''}
            ${(q.details || []).map(detail => `<p>${format(detail)}</p>`).join('')}
            ${q.ref ? `<p class="quiz-reference">📌 FE Syllabus: ${format(q.ref)}</p>` : ''}
          </div>` : ''}
        ${q.source ? `<p class="quiz-source">${japanese ? '出典：' : 'Nguồn chính thức: '}${q.sourceUrl ? `<a href="${q.sourceUrl}" target="_blank" rel="noopener">${q.source} ↗</a>` : q.source}</p>` : ''}
        <div class="quiz-actions"><button type="button" id="quiz-prev" ${current === 0 ? 'disabled' : ''}>${FE.t("← Câu trước")}</button><button type="button" class="quiz-primary" id="quiz-next">${current === total - 1 ? FE.t("✓ Nộp bài") : FE.t("Câu tiếp →")}</button></div>
      </section>
      <nav class="quiz-jump-card" aria-label="Điều hướng câu hỏi">
        <h2>${FE.t("Điều hướng nhanh")}</h2><p>${FE.t("Chọn số để chuyển câu · Xanh: đúng · Đỏ: sai")}</p>
        <div class="quiz-jump-grid">${questions.map((item, i) => `<button type="button" data-jump="${i}" class="${picks[i] === null ? '' : picks[i] === item.ans ? 'done' : 'miss'}" ${i === current ? 'aria-current="step"' : ''} aria-label="${FE.t("Câu")} ${i + 1}, ${picks[i] === null ? FE.t("chưa trả lời") : picks[i] === item.ans ? FE.t("đúng") : FE.t("sai")}">${i + 1}</button>`).join('')}</div>
      </nav>`;
    FE.translateUI();
    app.querySelectorAll('[data-pick]').forEach(button => button.onclick = () => pickAnswer(Number(button.dataset.pick)));
    app.querySelectorAll('[data-jump]').forEach(button => button.onclick = () => jump(Number(button.dataset.jump)));
    app.querySelector('#quiz-prev').onclick = () => jump(current - 1);
    app.querySelector('#quiz-next').onclick = () => current === total - 1 ? showResult() : jump(current + 1);
    const toggle = app.querySelector('#quiz-explain-toggle');
    if (toggle) toggle.onclick = () => {
      const panel = app.querySelector('#quiz-explanation');
      panel.hidden = !panel.hidden;
      toggle.setAttribute('aria-expanded', String(!panel.hidden));
    };
  }
  function showResult(record = true) {
    showingResult = true;
    const { done, correct, wrong } = stats();
    if (record) {
      FE.write('test-result:' + number, { answered: done, correct, total, submittedAt: new Date().toISOString() });
      if (done === total) FE.write('status:' + number, 'p4');
    }
    const levels = levelNames();
    const percent = Math.round(correct / total * 100);
    const resultCat = percent >= 80 ? '../assets/cats/love.jpg'
      : percent >= 60 ? '../assets/cats/cool-flowers.jpg'
      : percent >= 30 ? '../assets/cats/coffee.jpg'
      : '../assets/cats/grumpy.jpg';
    app.innerHTML = `<section class="quiz-result">
      <img class="quiz-result-cat" src="${resultCat}" alt="" aria-hidden="true" loading="lazy">
      <h2>${FE.t("Kết quả")}</h2><div class="quiz-score">${correct} / ${total}</div><p>${percent}${FE.t("% đúng")}</p>
      <p class="quiz-verdict">${percent >= 80 ? FE.t("🏆 Xuất sắc — Bạn đã nắm vững chủ đề!") : percent >= 60 ? FE.t("👍 Khá — Ôn lại các câu sai để tiến bộ hơn.") : FE.t("💪 Cần luyện thêm — Đọc lại lý thuyết và thử lại nhé.")}</p>
      <p>${FE.t("Đã làm:")} ${done} · ${FE.t("Sai:")} ${wrong} · ${FE.t("Chưa trả lời:")} ${total - done}</p>
      <div class="quiz-breakdown">${Object.entries(levels).filter(([level]) => questions.some(q => q.d === level)).map(([level, label]) => {
        const indices = questions.map((q, i) => q.d === level ? i : -1).filter(i => i >= 0);
        return `<div><span>${label}</span><strong>${indices.filter(i => picks[i] === questions[i].ans).length} / ${indices.length}</strong></div>`;
      }).join('')}</div>
      <div class="quiz-result-actions"><button class="quiz-primary" id="quiz-reset">${FE.t("↻ Làm lại từ đầu")}</button><button id="quiz-review">${FE.t("Xem lại từng câu")}</button><button id="quiz-mistakes" ${wrong === 0 ? 'disabled' : ''}>${FE.t("Ôn câu sai")}</button></div>
    </section>`;
    app.querySelector('#quiz-reset').onclick = () => { picks.fill(null); jump(0); };
    app.querySelector('#quiz-review').onclick = () => jump(0);
    app.querySelector('#quiz-mistakes').onclick = () => jump(picks.findIndex((p, i) => p !== null && p !== questions[i].ans));
    FE.translateUI();
  }
  languageSelect.onchange = () => {
    const explanationOpen = app.querySelector('#quiz-explanation')?.hidden === false;
    FE.write('language', languageSelect.value);
    if (showingResult) showResult(false);
    else {
      render();
      if (explanationOpen) {
        app.querySelector('#quiz-explanation').hidden = false;
        app.querySelector('#quiz-explain-toggle').setAttribute('aria-expanded','true');
      }
    }
    FE.translateUI();
    renderKeysPanel();
  };
  document.addEventListener('keydown', e => {
    if (recordingSlot) {
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;
      e.preventDefault();
      if (e.key === 'Escape') { recordingSlot = null; renderKeysPanel(); return; }
      const nextKey = normKey(e.key);
      const conflict = KEY_SLOTS.find(s => s !== recordingSlot && keys[s] === nextKey);
      if (conflict) keys[conflict] = keys[recordingSlot];
      keys[recordingSlot] = nextKey;
      recordingSlot = null;
      saveKeys();
      renderKeysPanel();
      if (!showingResult) render();
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey || showingResult) return;
    const tag = e.target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target?.isContentEditable) return;
    const pressed = normKey(e.key);
    const optIndex = ['opt0', 'opt1', 'opt2', 'opt3'].findIndex(slot => keys[slot] === pressed);
    if (optIndex !== -1) {
      if (picks[current] === null && optIndex < questions[current].opts.length) { e.preventDefault(); pickAnswer(optIndex); }
      return;
    }
    if (questions[current].opts.length > 4) {
      const extraIndex = pressed === '0' ? 9 : (/^[5-9]$/.test(pressed) ? Number(pressed) - 1 : -1);
      if (extraIndex !== -1 && extraIndex < questions[current].opts.length && picks[current] === null) {
        e.preventDefault();
        pickAnswer(extraIndex);
        return;
      }
    }
    if (pressed === keys.prev && current > 0) { e.preventDefault(); jump(current - 1); }
    else if (pressed === keys.next) { e.preventDefault(); current === total - 1 ? showResult() : jump(current + 1); }
  });
  renderKeysPanel();
  render();
});
