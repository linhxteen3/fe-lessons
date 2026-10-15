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
