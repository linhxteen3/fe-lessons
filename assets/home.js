const $ = selector => document.querySelector(selector);
let DATA = [], ROADMAP = null, currentLesson = null, lastViewedLesson = null, track = 'a', expanded = false;

function nextLesson() {
  const unfinished = DATA.filter(l => (l.theory || l.test) && l.status !== 'p4');
  const started = unfinished.filter(l => FE.read('activity:' + l.stt, null));
  started.sort((a, b) => String(FE.read('activity:' + b.stt, {}).startedAt || '').localeCompare(String(FE.read('activity:' + a.stt, {}).startedAt || '')));
  return started[0] || unfinished[0] || DATA.find(l => l.theory || l.test);
}
function refreshProgress() {
  DATA.forEach(l => l.status = FE.read('status:' + l.stt, 'p0'));
  const done = DATA.filter(l => l.status === 'p4').length;
  const available = DATA.filter(l => l.theory || l.test).length;
  const percent = DATA.length ? Math.round(done / DATA.length * 100) : 0;
  $('#lessonCount').textContent = DATA.length;
  $('#goalCount').textContent = ROADMAP.stages.length;
  $('#pnum').textContent = `${done} / ${DATA.length}`;
  $('#percentDone').textContent = percent + '%';
  $('#progBarFill').style.width = percent + '%';
  $('#courseProgress').setAttribute('aria-valuemax', DATA.length);
  $('#courseProgress').setAttribute('aria-valuenow', done);
  const progressCard = $('#progress');
  if (progressCard) {
    let cat = progressCard.querySelector('.progress-cat');
    if (!cat) {
      cat = document.createElement('img');
      cat.className = 'progress-cat';
      cat.alt = '';
      cat.setAttribute('aria-hidden', 'true');
      cat.loading = 'lazy';
      progressCard.querySelector('.section-topline')?.prepend(cat);
    }
    cat.src = percent >= 100 ? 'assets/cats/love.jpg'
      : percent >= 80 ? 'assets/cats/cool-flowers.jpg'
      : percent >= 40 ? 'assets/cats/coffee.jpg'
      : percent > 0 ? 'assets/cats/work.jpg'
      : 'assets/cats/grumpy.jpg';
  }
  const next = nextLesson();
  $('#continueTopic').textContent = next ? `${FE.t("Bài")} ${String(next.stt).padStart(2, '0')} · ${next.topic}` : FE.t("Chưa có nội dung bài học.");
  $('#resumeCourse').disabled = $('#resumeTop').disabled = !next;
  render();
}
function render() {
  const query = $('#q').value.trim().toLocaleLowerCase();
  const openGoals = new Set([...document.querySelectorAll('.goal[open]')].map(el => el.dataset.goal));
  const firstRender = !$('#list').children.length;
  const next = nextLesson();
  const list = $('#list');
  list.replaceChildren();
  let found = 0;
  ROADMAP.stages.forEach((stage, index) => {
    const lessons = stage.lessons.map(id => DATA.find(l => l.stt === id));
    const matched = lessons.filter(l => !query || l.topic.toLocaleLowerCase().includes(query) || String(l.stt).includes(query) || stage.title.toLocaleLowerCase().includes(query) || stage.jp.includes(query));
    if (!matched.length) return;
    found += matched.length;
    const completed = lessons.filter(l => l.status === 'p4').length;
    const ready = lessons.filter(l => l.theory || l.test).length;
    const li = document.createElement('li');
    li.className = 'goal-item';
    const details = document.createElement('details');
    details.className = 'goal';
    details.dataset.goal = String(index);
    details.open = !!query || expanded || openGoals.has(String(index)) || (firstRender && stage.lessons.includes(next?.stt));
    details.innerHTML = `<summary><span class="goal-emblem" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><span class="goal-heading"><span class="goal-eyebrow">${FE.t("MỤC TIÊU")} ${String(index + 1).padStart(2, '0')} <span>· ${stage.area}</span></span><h3><span lang="vi">${stage.title}</span><span class="goal-jp" lang="ja">${stage.jp}</span></h3></span><span class="goal-count">${completed}/${lessons.length}<span class="goal-chevron" aria-hidden="true"></span></span></summary><div class="goal-body"><p class="goal-description">${FE.read("language", "vi") === "ja" ? stage.goalJa : stage.goal}</p><div class="goal-status">${lessons.length} ${FE.t("bài học")}</div><ol class="lesson-path"></ol><div class="checkpoint"><span>${FE.t("ĐÍCH ĐẾN CỦA CHẶNG")}</span><p>${FE.read("language", "vi") === "ja" ? stage.checkpointJa : stage.checkpoint}</p></div></div>`;
    const path = details.querySelector('.lesson-path');
    matched.forEach((lesson, i) => {
      const ready = !!(lesson.theory || lesson.test);
      const done = lesson.status === 'p4';
      const active = ready && !done && FE.read('activity:' + lesson.stt, null);
      const isNext = lesson.stt === next?.stt;
      const row = document.createElement('li');
      row.className = `lesson-step ${done ? 'completed' : ''} ${isNext ? 'next-step' : ''} ${!ready ? 'unavailable' : ''}`;
      row.style.setProperty('--offset', [0, 48, 76, 48, 0, -48, -76, -48][i % 8] + 'px');
      row.dataset.lesson = lesson.stt;
      row.innerHTML = `<div class="step-content">${isNext ? `<span class="next-label">${active ? FE.t("TIẾP TỤC Ở ĐÂY") : FE.t("BẮT ĐẦU Ở ĐÂY")}</span>` : ''}<button class="lesson-node" ${ready ? '' : 'disabled'} aria-label="${FE.t("Bài")} ${lesson.stt}: ${lesson.topic}${done ? ', ' + FE.t('Đã hoàn thành') : !ready ? ', ' + FE.t('Chưa có nội dung') : ''}" ${isNext ? 'aria-current="step"' : ''}><span class="node-top">${done ? '✓' : ready ? String(lesson.stt).padStart(2, '0') : '⌑'}</span></button><div class="lesson-title"></div><span class="lesson-state">${done ? FE.t("Đã hoàn thành") : !ready ? FE.t("Chưa có nội dung") : active ? FE.t("Đang học") : FE.t('Bài') + ' ' + String(lesson.stt).padStart(2, '0')}</span><div class="lesson-links"></div></div>`;
      row.querySelector('.lesson-title').textContent = lesson.topic;
      row.querySelector('.lesson-node').onclick = () => openPane(lesson, lesson.theory ? 'theory' : 'test');
      for (const [kind, label] of [['theory', FE.t("Lý thuyết")], ['test', FE.t("Luyện tập")]]) {
        if (!lesson[kind]) continue;
        const button = document.createElement('button');
        button.className = 'lesson-link';
        button.textContent = FE.t(label);
        button.onclick = () => openPane(lesson, kind);
        row.querySelector('.lesson-links').append(button);
      }
      path.append(row);
    });
    li.append(details);
    list.append(li);
  });
  $('#empty').hidden = !!found || track !== 'a';
  renderSubjectB();
  FE.translateUI();
}
function renderSubjectB() {
  const section = $('#subjectB');
  const ja = FE.read("language", "vi") === "ja";
  section.innerHTML = `<div class="b-intro"><div class="eyebrow">${FE.t("PRACTICE IN PARALLEL")}</div><h2>${FE.t("Từ hiểu kiến thức")}<br>${FE.t("đến đọc được chương trình.")}</h2><p>${ja ? "IPA公式仕様（Ver.5.1）と公式サンプル・公開問題を出典付きで収録しています。B1〜B5で分野別に学び、B6で20問・100分の模擬試験に挑戦できます。" : "Toàn bộ hướng dẫn giả mã và câu hỏi thực hành trích từ tài liệu chính thức của IPA (Ver.5.1 & Đề mẫu 20 câu) có gắn nguồn đối chiếu từng câu. Học theo B1–B5 rồi luyện thi 20 câu · 100 phút ở B6."}</p></div>`;
  ROADMAP.subjectB.forEach((step, index) => {
    const card = document.createElement('section');
    card.className = 'practice-step';
    const bLesson = {
      stt: (step.id || ('B' + (index + 1))).toUpperCase(),
      topic: ja ? step.titleJa : step.title,
      theory: step.theory || '',
      test: step.test || ''
    };
    const sourcesHtml = (step.sources || []).map(s => `<a class="official-link" href="${s.url}" target="_blank" rel="noopener">${s.label} ↗</a>`).join('');
    card.innerHTML = `<span class="practice-index">B${index + 1}</span><div class="eyebrow">${step.jp}</div><h3>${ja ? step.titleJa : step.title}</h3><p>${ja ? step.practiceJa : step.practice}</p><div class="b-actions"></div><div class="practice-gap"><b>${ja ? "収録内容・出典" : "NỘI DUNG CHÍNH THỨC"}</b><p>${ja ? step.gapJa : step.gap}</p></div><div class="related-lessons"></div><div class="b-sources">${sourcesHtml || `<a class="official-link" href="${ROADMAP.sources[3].url}" target="_blank" rel="noopener">${FE.t("Đề mẫu & quy ước IPA ↗")}</a>`}</div>`;
    const actions = card.querySelector('.b-actions');
    if (step.theory) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'b-action-btn b-theory-btn';
      btn.textContent = ja ? '📘 公式ガイド・理論' : '📘 Lý thuyết & Quy ước IPA';
      btn.onclick = () => openPane(bLesson, 'theory');
      actions.append(btn);
    }
    if (step.test) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'b-action-btn b-test-btn';
      btn.textContent = step.theory
        ? (ja ? '✍ 公式問題で演習' : '✍ Luyện tập (Đề IPA)')
        : (ja ? '⏱ 模擬試験を始める（20問・100分）' : '⏱ Bắt đầu thi thử (20 câu · 100 phút)');
      btn.onclick = () => openPane(bLesson, 'test');
      actions.append(btn);
    }
    step.related.forEach(id => {
      const lesson = DATA.find(l => l.stt === id);
      if (!lesson) return;
      const button = document.createElement('button');
      button.textContent = `${FE.t("Bài")} ${String(id).padStart(2, '0')} · ${lesson.topic}`;
      button.disabled = !lesson.theory && !lesson.test;
      button.onclick = () => openPane(lesson, lesson.theory ? 'theory' : 'test');
      card.querySelector('.related-lessons').append(button);
    });
    section.append(card);
  });
}
function openPane(lesson, kind) {
  if (!lesson[kind]) return;
  currentLesson = lesson;
  lastViewedLesson = lesson;
  FE.write('activity:' + lesson.stt, { startedAt: new Date().toISOString() });
  $('#pPstt').textContent = /^\d+$/.test(String(lesson.stt)) ? String(lesson.stt).padStart(2, '0') : String(lesson.stt);
  $('#pTopic').textContent = lesson.topic;
  $('#tabTheory').hidden = !lesson.theory;
  $('#tabTest').hidden = !lesson.test;
  showTab(kind);
  if (!$('#pane').open) $('#pane').showModal();
  const pf = document.getElementById('pomodoroFloating');
  if (pf && $('#pane').contains && !$('#pane').contains(pf)) $('#pane').appendChild?.(pf);
  document.body.style.overflow = 'hidden';
  if (ROADMAP) refreshProgress();
}
function showTab(kind) {
  const src = currentLesson?.[kind];
  if (!src) return;
  $('#tabTheory').setAttribute('aria-pressed', kind === 'theory');
  $('#tabTest').setAttribute('aria-pressed', kind === 'test');
  $('#pNew').href = src;
  $('#frame').src = src;
}
function closePane() { $('#pane').close(); }
$('#pane').addEventListener('close', () => {
  document.body.style.overflow = '';
  const pf = document.getElementById('pomodoroFloating');
  if (pf && $('#pane').contains?.(pf)) document.body.appendChild?.(pf);
  $('#frame').src = 'about:blank';
  if (currentLesson) lastViewedLesson = currentLesson;
  currentLesson = null;
  if (ROADMAP) refreshProgress();
  $('#resumeCourse').focus({ preventScroll: true });
});
$('#pane').onclick = event => { if (event.target === $('#pane')) closePane(); };
$('#pClose').onclick = closePane;
$('#frame').addEventListener('load', () => { if ($('#pane').open) try { $('#frame').contentWindow?.focus(); } catch {} });
$('#tabTheory').onclick = () => showTab('theory');
$('#tabTest').onclick = () => showTab('test');
$('#resumeCourse').onclick = $('#resumeTop').onclick = () => {
  const lesson = nextLesson();
  if (lesson) openPane(lesson, lesson.theory ? 'theory' : 'test');
};
$('#q').addEventListener('input', () => { if (ROADMAP) render(); });
$('#expandGoals').onclick = () => {
  expanded = !expanded;
  document.querySelectorAll('.goal').forEach(goal => goal.open = expanded || ROADMAP.stages[Number(goal.dataset.goal)].lessons.includes(nextLesson()?.stt));
  $('#expandGoals').setAttribute('aria-expanded', expanded);
  $('#expandGoals').textContent = expanded ? FE.t("Thu gọn mục tiêu ↑") : FE.t("Mở tất cả mục tiêu ↓");
};

document.querySelectorAll('[data-track]').forEach(button => button.onclick = () => {
  track = button.dataset.track;
  document.querySelectorAll('[data-track]').forEach(tab => tab.setAttribute('aria-pressed', tab === button));
  $('#list').hidden = $('#catalogControls').hidden = $('#pathIntro').hidden = track !== 'a';
  $('#subjectB').hidden = track !== 'b';
  $('#empty').hidden = true;
});
window.addEventListener('storage', () => { if (ROADMAP) refreshProgress(); });
async function load() {
  try {
    const responses = await Promise.all([fetch('./lessons.json'), fetch('./roadmap.json')]);
    if (responses.some(r => !r.ok)) throw new Error('Missing catalog');
    const [catalog, roadmap] = await Promise.all(responses.map(r => r.json()));
    const ids = roadmap.stages.flatMap(stage => stage.lessons);
    if (!Array.isArray(catalog.lessons) || ids.length !== catalog.lessons.length || new Set(ids).size !== ids.length || ids.some(id => !catalog.lessons.some(l => l.stt === id))) throw new Error('Invalid roadmap');
    DATA = catalog.lessons;
    ROADMAP = roadmap;
    $('#reviewedDate').textContent = roadmap.reviewed;
    roadmap.sources.forEach(source => {
      const link = document.createElement('a');
      link.href = source.url; link.textContent = FE.t(source.label) + ' ↗'; link.target = '_blank'; link.rel = 'noopener';
      $('#sourceLinks').append(link);
    });
    refreshProgress();
  } catch {
    $('#banner').hidden = false;
    $('#continueTopic').textContent = FE.t("Chưa tải được danh mục. Hãy tải lại trang.");
    $('#resumeCourse').disabled = $('#resumeTop').disabled = true;
  }
}
load();

$('#languageToggle').onclick = () => {
  FE.write('language', FE.read('language', 'vi') === 'vi' ? 'ja' : 'vi');
  location.reload();
};
$('#languageToggle').textContent = FE.read('language', 'vi') === 'ja' ? 'Tiếng Việt' : '日本語';
FE.translateUI();

window.addEventListener('fe-synced', () => { if (ROADMAP) refreshProgress(); });

$('#accountTop').onclick = () => {
  const account = document.getElementById('account');
  if (account) account.scrollIntoView({ behavior: 'smooth', block: 'center' });
  else {
    $('#toast').textContent = FE.read('language', 'vi') === 'ja' ? 'ログイン機能を読み込み中です。接続を確認して再読み込みしてください。' : 'Đang tải đăng nhập. Hãy kiểm tra kết nối và tải lại trang nếu vẫn chưa hiện.';
    $('#toast').classList.add('show');
    setTimeout(() => $('#toast').classList.remove('show'), 6000);
  }
};

window.addEventListener('fe-pomodoro-break', () => {
  const pane = $('#pane');
  const frame = $('#frame');
  const showBreakToast = () => {
    const toast = $('#toast');
    if (toast) {
      toast.textContent = FE.read('language', 'vi') === 'ja'
        ? '☕ 休憩時間です！リラックスコーナーで一息つきましょう。'
        : '☕ Đến giờ giải lao 5 phút! Hãy thư giãn một chút nhé.';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 6000);
    }
  };
  const scrollFrameToRelax = () => {
    try {
      const doc = $('#frame')?.contentDocument;
      const relax = doc?.getElementById('lesson-relax');
      if (relax) {
        relax.hidden = false;
        relax.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch {
      // Cross-origin fallback
    }
  };

  let targetLesson = currentLesson || lastViewedLesson;
  if (!targetLesson) {
    targetLesson = DATA.find(l => l.stt === 1) || {
      stt: 1,
      topic: 'n進数の概念 · Khái niệm n進数',
      theory: 'ly-thuyet/1.html',
      test: 'kiem-tra/1.html'
    };
  }

  let navigated = false;
  if (pane && pane.open) {
    if (currentLesson?.theory && $('#tabTheory')?.getAttribute('aria-pressed') !== 'true') {
      showTab('theory');
      navigated = true;
    }
  } else {
    showBreakToast();
    if (pane && targetLesson?.theory) {
      openPane(targetLesson, 'theory');
      navigated = true;
    }
  }

  const activeLesson = pane?.open ? (currentLesson || targetLesson) : targetLesson;
  if (frame && activeLesson?.theory) {
    const isTheoryLoaded = !navigated
      && frame.contentDocument?.readyState === 'complete'
      && frame.contentDocument?.location?.pathname?.includes(activeLesson.theory);
    if (isTheoryLoaded) {
      scrollFrameToRelax();
    } else {
      frame.addEventListener('load', scrollFrameToRelax, { once: true });
    }
  }
});

