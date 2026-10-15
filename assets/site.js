/* Shared preferences, progress, and toolbar for FE Lessons (Brilliant.org Style) */
window.FE = {
  read(key, fallback) {
    try { return JSON.parse(localStorage.getItem('fe-lessons:v1:' + key)) ?? fallback; }
    catch { return fallback; }
  },
  write(key, value) {
    try { localStorage.setItem('fe-lessons:v1:' + key, JSON.stringify(value)); }
    catch { document.documentElement.dataset.storageUnavailable = 'true'; }
  }
};

function initLessonLayout(type, number) {
  document.body.classList.add('lesson-page', type === 'ly-thuyet' ? 'lesson-theory' : 'lesson-test');
  const shell = document.createElement('div');
  shell.className = 'lesson-shell';
  const original = document.querySelector('body > .wrap, body > .container') ||
    (document.querySelector('body > main header') ? document.querySelector('body > main') : null);
  if (original) {
    original.classList.add('lesson-shell');
  } else {
    const content = [...document.body.children].filter(el => !['SCRIPT', 'STYLE'].includes(el.tagName));
    document.body.prepend(shell);
    shell.append(...content);
  }
  const root = original || shell;
  let heading = root.querySelector('h1');
  let hero = root.querySelector('header, .hero, .header');
  if (!hero) {
    hero = document.createElement('header');
    if (heading) {
      heading.before(hero);
      const info = heading.nextElementSibling;
      hero.append(heading);
      if (info?.matches('.sub, .meta, .subtitle')) hero.append(info);
    } else root.prepend(hero);
  }
  if (!heading) {
    heading = document.createElement('h1');
    const badge = hero.querySelector('.kanji-badge');
    heading.textContent = badge?.textContent || document.title;
    badge?.remove();
    hero.prepend(heading);
  }
  // Keep live counters and existing event listeners when unifying the header.
  const details = document.createElement('div');
  details.className = 'lesson-details';
  heading.remove();
  details.append(...hero.childNodes);
  const eyebrow = document.createElement('div');
  eyebrow.className = 'lesson-eyebrow';
  eyebrow.textContent = `BÀI ${number.padStart(2, '0')} · ${type === 'ly-thuyet' ? 'LÝ THUYẾT' : 'KIỂM TRA'}`;
  hero.replaceChildren(eyebrow, heading, details);
  hero.classList.add('lesson-hero');
  heading.classList.add('lesson-title');

  if (type !== 'ly-thuyet') return;
  // Flat documents become the same part cards as 基数変換; tab sections stay intact.
  root.querySelectorAll('h2').forEach(h => {
    if (h.parentElement !== root && h.parentElement.tagName !== 'MAIN') return;
    const part = document.createElement('section');
    h.before(part);
    part.append(h);
    while (part.nextSibling && !(part.nextSibling.nodeType === 1 && part.nextSibling.matches('h2, footer, script'))) {
      part.append(part.nextSibling);
    }
  });
  const parts = [...root.querySelectorAll('section')].filter(s => s.querySelector('h2') && !s.parentElement.closest('section'));
  const partLabel = text => text.trim().replace(/^[^\p{L}]+/u, '').replace(/^(?:Phần|PART)\s*\d+\s*[—–:.\-/]?\s*/i, '');
  parts.forEach((part, index) => {
    part.classList.add('lesson-part');
    if (!part.id) part.id = `lesson-part-${index + 1}`;
    const title = part.querySelector('h2');
    const label = title.cloneNode(true);
    label.querySelectorAll('.num, .icon, .ic, small').forEach(el => el.remove());
    title.title = title.textContent.trim();
    title.textContent = partLabel(label.textContent);
    title.classList.add('lesson-part-title');
    title.dataset.part = String(index + 1).padStart(2, '0');
  });
  let toc = root.querySelector('nav');
  if (!toc) {
    toc = document.createElement('nav');
    hero.after(toc);
    parts.forEach(part => {
      const link = document.createElement('a');
      link.href = '#' + part.id;
      link.textContent = part.querySelector('h2').textContent;
      toc.append(link);
    });
  }
  const items = [...toc.querySelectorAll('a, button')];
  const label = document.createElement('h3');
  label.textContent = '▸ MỤC LỤC';
  const list = document.createElement('ul');
  items.forEach(item => {
    item.textContent = partLabel(item.textContent);
    const li = document.createElement('li');
    li.append(item);
    list.append(li);
  });
  toc.replaceChildren(label, list);
  toc.classList.add('lesson-toc');
  toc.setAttribute('aria-label', 'Mục lục bài học');
}

document.addEventListener('DOMContentLoaded', async () => {
  const page = location.pathname.match(/\/(ly-thuyet|kiem-tra)\/(\d+)\.html$/);
  const base = page ? '../' : './';

  // Inject brilliant.js if not present
  if (!window.Brilliant) {
    const script = document.createElement('script');
    script.src = base + 'assets/brilliant.js';
    document.head.appendChild(script);
  }

  // Setup toolbar for lesson pages
  if (page) {
    initLessonLayout(page[1], page[2]);
    const bar = document.createElement('nav');
    bar.className = 'fe-toolbar';
    bar.setAttribute('aria-label', 'Điều hướng học tập');

    const leftGroup = document.createElement('div');
    leftGroup.className = 'fe-toolbar-left';

    const home = document.createElement('a');
    home.href = base + 'index.html';
    home.innerHTML = '⌂ Trang chủ';
    home.target = '_top';
    leftGroup.append(home);

    const rightGroup = document.createElement('div');
    rightGroup.className = 'fe-toolbar-right';

    bar.append(leftGroup, rightGroup);
    document.body.prepend(bar);

    try {
      const response = await fetch(base + 'lessons.json');
      if (!response.ok) throw new Error('catalog unavailable');
      const { lessons } = await response.json();
      const id = Number(page[2]);
      const kind = page[1] === 'ly-thuyet' ? 'theory' : 'test';
      const current = lessons.find(l => l.stt === id);
      if (current) {
        const title = document.querySelector('.lesson-title');
        title.title = title.textContent.trim();
        const [name, ...translation] = current.topic.split(' · ');
        title.textContent = name;
        if (translation.length) {
          const subtitle = document.createElement('span');
          subtitle.textContent = translation.join(' · ');
          title.append(document.createElement('br'), subtitle);
        }
      }
      const available = lessons.filter(l => l[kind]).sort((a, b) => a.stt - b.stt);
      const index = available.findIndex(l => l.stt === id);

      const addLink = (parent, label, path) => {
        if (!path) return;
        const a = document.createElement('a');
        a.textContent = label;
        a.href = base + path;
        parent.append(a);
      };

      addLink(leftGroup, '← Bài trước', available[index - 1]?.[kind]);
      addLink(leftGroup, 'Bài sau →', available[index + 1]?.[kind]);

      // Switch between theory and test
      addLink(rightGroup, kind === 'theory' ? '📝 Kiểm tra 40 câu' : '📖 Đọc lý thuyết', current?.[kind === 'theory' ? 'test' : 'theory']);

      // Status mark button
      const done = document.createElement('button');
      const updateDoneBtn = () => {
        const isDone = FE.read('status:' + id, 'p0') === 'p4';
        if (isDone) {
          done.textContent = '✓ Đã hoàn thành';
          done.className = 'btn-done';
        } else {
          done.textContent = '○ Đánh dấu đã xong';
          done.className = '';
        }
      };
      updateDoneBtn();
      done.onclick = () => {
        const next = FE.read('status:' + id, 'p0') === 'p4' ? 'p0' : 'p4';
        FE.write('status:' + id, next);
        updateDoneBtn();
      };
      rightGroup.append(done);

      // Streak badge in toolbar
      const streakVal = (window.Brilliant && window.Brilliant.getStreak) ? window.Brilliant.getStreak() : 1;
      const streakBadge = document.createElement('div');
      streakBadge.className = 'br-streak-badge';
      streakBadge.title = 'Chuỗi ngày học tập liên tiếp';
      streakBadge.innerHTML = `<span class="br-streak-fire">⚡</span> ${streakVal}`;
      rightGroup.append(streakBadge);
    } catch {
      /* Fallback retains basic home button */
    }
  }
});
