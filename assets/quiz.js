/* One question flow for every test, based on 基数変換. */
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('quiz-app');
  if (!app) return;
  let questions;
  try {
    questions = JSON.parse(document.getElementById('quiz-data').textContent);
    if (!Array.isArray(questions) || !questions.length || questions.some(q =>
      !Array.isArray(q.opts) || q.opts.length !== 4 || !Number.isInteger(q.ans) || q.ans < 0 || q.ans > 3 ||
      !['easy', 'med', 'hard', 'review'].includes(q.d))) throw new Error('Invalid question bank');
  } catch {
    app.textContent = FE.t("Không tải được câu hỏi. Hãy tải lại trang.");
    return;
  }
  const total = questions.length;
  let showingResult = false;
  const languageBox = document.createElement('div');
  languageBox.className = 'quiz-language';
  languageBox.innerHTML = '<label for="quiz-language">Tiếng Việt / 日本語</label> <select id="quiz-language" aria-label="Ngôn ngữ / 言語"><option value="vi">Tiếng Việt</option><option value="ja">日本語</option></select>';
  const controlsHost = document.querySelector('.lesson-hero');
  if (controlsHost) controlsHost.append(languageBox);
  else app.before(languageBox);
  const languageSelect = languageBox.querySelector('select');
  languageSelect.value = FE.read('language', 'vi') === 'ja' ? 'ja' : 'vi';
  const languageStyle = document.createElement('style');
  languageStyle.textContent = '.quiz-language{display:flex;justify-content:flex-end;align-items:center;gap:10px;margin:16px 0;font-size:13px}.quiz-language select{font:inherit;background:#252525;color:#f5f5f5;border:1px solid #444;border-radius:8px;padding:8px 12px}.quiz-language select:focus-visible{outline:2px solid #a579ef;outline-offset:3px}';
  document.head.append(languageStyle);
  const number = Number(location.pathname.match(/\/(\d+)\.html$/)[1]);
  // Reuse the existing Bài 01 attempt format and storage keys for every lesson.
  const saved = FE.read('test:' + number, {});
  if (!FE.read('activity:' + number, null)) FE.write('activity:' + number, { startedAt: new Date().toISOString() });
  const picks = questions.map((q, i) => Number.isInteger(saved?.picks?.[i]) && saved.picks[i] >= 0 && saved.picks[i] < 4 ? saved.picks[i] : null);
  let current = Number.isInteger(saved?.cur) ? Math.max(0, Math.min(total - 1, saved.cur)) : 0;
  const letters = ['A', 'B', 'C', 'D'];
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
  function jump(index) { current = index; save(); render(); }
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
        ${q.extra ? `<div class="quiz-extra">${format(q.extra)}</div>` : ''}
        <div class="quiz-options">${q.opts.map((option, i) => `
          <button type="button" class="quiz-option ${answered ? (i === q.ans ? 'correct' : i === picks[current] ? 'wrong' : '') : ''}" data-pick="${i}" aria-pressed="${i === picks[current]}" ${answered ? 'disabled' : ''}>
            <span class="quiz-letter">${letters[i]}.</span><span>${format(option)}</span>
            ${answered && i === q.ans ? '<span class="quiz-answer-mark">✓</span>' : answered && i === picks[current] ? '<span class="quiz-answer-mark">✕</span>' : ''}
          </button>`).join('')}</div>
        ${answered ? `<p class="quiz-feedback ${picks[current] === q.ans ? 'quiz-good' : 'quiz-bad'}" role="status">${picks[current] === q.ans ? FE.t("✓ Chính xác!") : FE.t("✕ Chưa đúng.")} ${FE.t("Đáp án đúng:")} ${letters[q.ans]}.</p>
          <button type="button" id="quiz-explain-toggle" aria-expanded="false" aria-controls="quiz-explanation">${FE.t("📖 Xem giải thích")}</button>
          <div class="quiz-explanation" id="quiz-explanation" hidden>
            <h3>${FE.t("Đáp án đúng:")} ${letters[q.ans]}</h3>
            ${q.why ? `<div>${format(q.why)}</div>` : ''}
            ${(q.details || []).map(detail => `<p>${format(detail)}</p>`).join('')}
            ${q.ref ? `<p class="quiz-reference">📌 FE Syllabus: ${format(q.ref)}</p>` : ''}
          </div>` : ''}
        <div class="quiz-actions"><button type="button" id="quiz-prev" ${current === 0 ? 'disabled' : ''}>${FE.t("← Câu trước")}</button><button type="button" class="quiz-primary" id="quiz-next">${current === total - 1 ? FE.t("✓ Nộp bài") : FE.t("Câu tiếp →")}</button></div>
      </section>
      <nav class="quiz-jump-card" aria-label="Điều hướng câu hỏi">
        <h2>${FE.t("Điều hướng nhanh")}</h2><p>${FE.t("Chọn số để chuyển câu · Xanh: đúng · Đỏ: sai")}</p>
        <div class="quiz-jump-grid">${questions.map((item, i) => `<button type="button" data-jump="${i}" class="${picks[i] === null ? '' : picks[i] === item.ans ? 'done' : 'miss'}" ${i === current ? 'aria-current="step"' : ''} aria-label="${FE.t("Câu")} ${i + 1}, ${picks[i] === null ? FE.t("chưa trả lời") : picks[i] === item.ans ? FE.t("đúng") : FE.t("sai")}">${i + 1}</button>`).join('')}</div>
      </nav>`;
    FE.translateUI();
    app.querySelectorAll('[data-pick]').forEach(button => button.onclick = () => {
      picks[current] = Number(button.dataset.pick);
      save();
      render();
      app.querySelector('#quiz-explain-toggle').focus({ preventScroll: true });
    });
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
    app.innerHTML = `<section class="quiz-result">
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
  };
  render();
});
