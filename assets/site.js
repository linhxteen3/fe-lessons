/* Guest progress stays on this browser; account progress has a separate namespace. */
window.FE = {
  owner: (() => { try { return localStorage.getItem('fe-lessons:account') || ''; } catch { return ''; } })(),
  isProgress: key => /^(activity|test|test-result|status):([1-9]|[1-5][0-9]|6[01])$/.test(key),
  prefix(owner) { return owner ? 'fe-lessons:user:' + owner + ':' : 'fe-lessons:v1:'; },
  record(key, owner = this.owner) {
    try { return JSON.parse(localStorage.getItem(this.prefix(owner) + key)); }
    catch { return null; }
  },
  read(key, fallback) {
    const owner = this.isProgress(key) ? this.owner : '';
    const record = this.record(key, owner);
    return (owner ? record?.value : record) ?? fallback;
  },
  keys(owner = this.owner) {
    const prefix = this.prefix(owner);
    return Object.keys(localStorage).filter(key => key.startsWith(prefix))
      .map(key => key.slice(prefix.length)).filter(key => this.isProgress(key));
  },
  validRecord(key, record) {
    if (!this.isProgress(key) || !record || !Number.isSafeInteger(record.updatedAt) || record.updatedAt < 0) return false;
    const value = record.value;
    if (key.startsWith('status:')) return value === 'p4';
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    if (key.startsWith('activity:')) return typeof value.startedAt === 'string' && Number.isFinite(Date.parse(value.startedAt));
    if (key.startsWith('test:')) return Number.isInteger(value.cur) && value.cur >= 0 && value.cur < 100 &&
      Array.isArray(value.picks) && value.picks.length <= 100 && value.picks.every(n => n === null || Number.isInteger(n) && n >= 0 && n < 4);
    return Number.isInteger(value.total) && value.total > 0 && value.total <= 100 &&
      Number.isInteger(value.answered) && value.answered >= 0 && value.answered <= value.total &&
      Number.isInteger(value.correct) && value.correct >= 0 && value.correct <= value.answered;
  },
  putRecord(key, record, owner = this.owner) {
    if (!owner || !this.validRecord(key, record)) return false;
    try { localStorage.setItem(this.prefix(owner) + key, JSON.stringify(record)); return true; }
    catch { document.documentElement.dataset.storageUnavailable = 'true'; return false; }
  },
  write(key, value) {
    const owner = this.isProgress(key) ? this.owner : '';
    try {
      if (this.isProgress(key) && (localStorage.getItem('fe-lessons:account') || '') !== this.owner) return;
      if (owner) {
        const previous = this.record(key);
        if (JSON.stringify(previous?.value) === JSON.stringify(value)) return;
        if (!this.putRecord(key, { value, updatedAt: Math.max(Date.now(), (previous?.updatedAt || 0) + 1) })) return;
      } else localStorage.setItem(this.prefix('') + key, JSON.stringify(value));
      if (this.isProgress(key)) window.dispatchEvent(new CustomEvent('fe-progress', { detail: key }));
    } catch { document.documentElement.dataset.storageUnavailable = 'true'; }
  }
};
window.addEventListener('storage', event => {
  if (event.key === 'fe-lessons:account' && (event.newValue || '') !== FE.owner) location.reload();
});

FE.translations = {
  "Đăng nhập Google": "Googleでログイン",
  "Lộ trình": "ロードマップ",
  "Kỳ thi FE": "FE試験",
  "Tiến độ": "進捗",
  "Lộ trình FE": "FE 学習ロードマップ",
  "Tiến độ học": "学習の進捗",
  "Mục tiêu học tập": "学習目標",
  "Tiếp tục học": "学習を続ける",
  "Tiếp tục học ↗": "学習を続ける ↗",
  "Lý thuyết": "解説",
  "Luyện tập": "練習",
  "Kiểm tra": "テスト",
  "Mở tất cả mục tiêu ↓": "すべて展開 ↓",
  "Thu gọn mục tiêu ↑": "折りたたむ ↑",
  "Đang lưu trên trình duyệt này.": "このブラウザに一時保存しています。",
  "Đã hoàn thành": "完了",
  "Chưa có nội dung": "準備中",
  "Đang học": "学習中",
  "TIẾP TỤC Ở ĐÂY": "ここから再開",
  "BẮT ĐẦU Ở ĐÂY": "ここから開始",
  "⌂ Trang chủ": "⌂ ホーム",
  "← Bài trước": "← 前のレッスン",
  "Bài sau →": "次のレッスン →",
  "📝 Kiểm tra 40 câu": "📝 テスト",
  "📖 Đọc lý thuyết": "📖 解説を読む",
  "← Câu trước": "← 前の問題",
  "✓ Nộp bài": "✓ 提出",
  "Câu tiếp →": "次の問題 →",
  "📖 Xem giải thích": "📖 解説を見る",
  "Kết quả": "結果",
  "↻ Làm lại từ đầu": "↻ 最初からやり直す",
  "Xem lại từng câu": "回答を確認",
  "Ôn câu sai": "間違えた問題を復習",
  "Điều hướng nhanh": "問題一覧",
  "Chọn số để chuyển câu · Xanh: đúng · Đỏ: sai": "番号を選択 · 緑：正解 · 赤：不正解",
  "Ôn tập": "復習",
  "易 Dễ": "易",
  "中 Trung bình": "中",
  "難 Khó": "難",
  "ngày": "日",
  "bài học": "レッスン",
  "mục tiêu": "目標",
  "bài đã hoàn thành": "レッスン完了",
  "61 bài · số thứ tự gốc": "全61レッスン · 元の番号順",
  "Kiến thức nền tảng": "基礎知識",
  "Tư duy thực hành": "実践力",
  "Đến lộ trình học": "学習ロードマップへ",
  "Đang tải bài học…": "レッスンを読み込み中…",
  "Đang kiểm tra tài liệu…": "教材を確認中…",
  "Không tải được dữ liệu. Hãy tải lại trang để xem đủ lộ trình.": "データを読み込めませんでした。ページを再読み込みしてください。",
  "Không tìm thấy bài phù hợp. Hãy thử từ khóa khác.": "該当するレッスンがありません。別のキーワードをお試しください。",
  "KNOW YOUR DESTINATION": "試験について",
  "Hai môn thi. Hai cách rèn luyện.": "科目A・科目Bの学習方法",
  "Kiến thức IT tổng quát": "IT全般の基礎知識",
  "60 câu": "60問",
  "90 phút": "90分",
  "20 câu": "20問",
  "100 phút": "100分",
  "Công nghệ · Quản lý · Chiến lược. Các bài kiểm tra theo chủ đề giúp củng cố kiến thức cho môn này.": "テクノロジ・マネジメント・ストラテジ。テーマ別テストで知識を定着させます。",
  "Vận dụng & giải quyết vấn đề": "知識の活用と問題解決",
  "16 câu thuật toán/lập trình và 4 câu an toàn thông tin. Luyện giả mã, trace và tình huống thực tế song song.": "アルゴリズム・プログラミング16問、情報セキュリティ4問。擬似言語、トレース、事例問題を並行して練習します。",
  "Quiz theo bài chưa phải đề mô phỏng đủ cấu trúc FE. Các checkpoint 50/80 câu là mốc ôn của tài liệu gốc. Đề công khai có thể chỉ là một phần câu hỏi; cần nguồn luyện bổ sung cho buổi thi thử đủ số câu.": "各レッスンのテストは本試験形式の模試ではありません。50問・80問の確認テストは元の教材の復習区分です。公開問題は一部の場合があるため、模試には追加の問題が必要です。",
  "Lộ trình do FE Master đề xuất từ 61 mục tài liệu của bạn. Thông tin kỳ thi đối chiếu IPA ngày": "教材の61項目を基にFE Masterが提案する学習順です。IPAの試験情報の確認日：",
  "↑ Về đầu lộ trình": "↑ ロードマップの先頭へ",
  "↗ Tab mới": "↗ 新しいタブ",
  "Tìm bài học, chủ đề…": "レッスン・テーマを検索…",
  "Tìm bài học": "レッスンを検索",
  "Đóng bài học": "レッスンを閉じる",
  "Bài học": "レッスン",
  "Điều hướng chính": "メインナビゲーション",
  "Chuỗi ngày học": "連続学習日数",
  "Tổng quan khóa học": "コース概要",
  "Tiến độ học của bạn": "学習の進捗",
  "Tiến độ hoàn thành": "完了状況",
  "Chọn lộ trình": "学習コースを選択",
  "Các mục tiêu và bài học": "目標とレッスン",
  "Nội dung bài": "レッスンの内容",
  "Nội dung bài học": "レッスンの内容",
  "MỤC TIÊU": "目標",
  "ĐÍCH ĐẾN CỦA CHẶNG": "到達目標",
  "bài có nội dung": "レッスン公開中",
  "Nội dung sẽ bổ sung": "教材は準備中です",
  "Bài": "レッスン",
  "Chưa có nội dung bài học.": "教材はまだありません。",
  "Chưa tải được danh mục. Hãy tải lại trang.": "一覧を読み込めません。ページを再読み込みしてください。",
  "CẦN BỔ SUNG": "今後の追加内容",
  "PRACTICE IN PARALLEL": "並行して練習",
  "Từ hiểu kiến thức": "知識の理解から",
  "đến đọc được chương trình.": "プログラムを読み解く力へ",
  "Bắt đầu sau mục tiêu 02, luyện song song với 科目A. Đây là hướng ôn bổ trợ sử dụng bài gốc, không thêm bài hay đổi số thứ tự của danh mục 61 bài.": "目標02の後から科目Aと並行して練習します。元の教材を使った補助学習であり、61レッスンの番号や数は変更しません。",
  "Đề mẫu & quy ước IPA ↗": "IPAサンプル問題・表記規則 ↗",
  "Cấu trúc kỳ thi FE": "FE試験の構成",
  "Quy chế thi Ver.5.6": "試験要綱 Ver.5.6",
  "Đề mẫu IPA và quy ước giả mã": "IPAサンプル問題・擬似言語の規則",
  "Đề công khai IPA": "IPA公開問題",
  "Câu": "問題",
  "Đã làm:": "回答済み：",
  "Đúng:": "正解：",
  "Sai:": "不正解：",
  "Chưa trả lời:": "未回答：",
  "✓ Chính xác!": "✓ 正解！",
  "✕ Chưa đúng.": "✕ 不正解。",
  "Đáp án đúng:": "正解：",
  "chưa trả lời": "未回答",
  "đúng": "正解",
  "sai": "不正解",
  "% đúng": "% 正解",
  "🏆 Xuất sắc — Bạn đã nắm vững chủ đề!": "🏆 よく理解できています！",
  "👍 Khá — Ôn lại các câu sai để tiến bộ hơn.": "👍 間違えた問題を復習しましょう。",
  "💪 Cần luyện thêm — Đọc lại lý thuyết và thử lại nhé.": "💪 解説を読み直して、もう一度挑戦しましょう。",
  "Không tải được câu hỏi. Hãy tải lại trang.": "問題を読み込めません。ページを再読み込みしてください。",
  "Tiến độ trả lời": "回答の進捗",
  "Điều hướng câu hỏi": "問題ナビゲーション",
  "▸ MỤC LỤC": "▸ 目次",
  "Mục lục bài học": "レッスンの目次",
  "Điều hướng học tập": "学習ナビゲーション",
  "Chuỗi ngày học tập liên tiếp": "連続学習日数",
  "LÝ THUYẾT": "解説",
  "KIỂM TRA": "テスト",
  "BÀI": "レッスン"
};
FE.t = text => FE.read('language', 'vi') === 'ja' ? (FE.translations[text] || text) : text;
FE.translateUI = () => {
  document.documentElement.lang = FE.read('language', 'vi');
  document.querySelectorAll('[data-ui]').forEach(el => el.textContent = FE.t(el.dataset.ui));
  for (const attr of ['aria-label', 'placeholder', 'title']) {
    document.querySelectorAll('[' + attr + ']').forEach(el => el.setAttribute(attr, FE.t(el.getAttribute(attr))));
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
  eyebrow.textContent = `${FE.t("BÀI")} ${number.padStart(2, '0')} · ${type === 'ly-thuyet' ? FE.t('LÝ THUYẾT') : FE.t('KIỂM TRA')}`;
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
  label.textContent = FE.t('▸ MỤC LỤC');
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
    home.textContent = FE.t('⌂ Trang chủ');
    home.target = '_top';
    leftGroup.append(home);

    const rightGroup = document.createElement('div');
    rightGroup.className = 'fe-toolbar-right';

    bar.append(leftGroup, rightGroup);
    document.body.prepend(bar);

    try {
      if (location.protocol === 'file:') return;
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
        a.textContent = FE.t(label);
        a.href = base + path;
        parent.append(a);
      };

      addLink(leftGroup, '← Bài trước', available[index - 1]?.[kind]);
      addLink(leftGroup, 'Bài sau →', available[index + 1]?.[kind]);

      // Switch between theory and test
      addLink(rightGroup, kind === 'theory' ? '📝 Kiểm tra 40 câu' : '📖 Đọc lý thuyết', current?.[kind === 'theory' ? 'test' : 'theory']);

      // Streak badge in toolbar
      const streakVal = (window.Brilliant && window.Brilliant.getStreak) ? window.Brilliant.getStreak() : 1;
      const streakBadge = document.createElement('div');
      streakBadge.className = 'br-streak-badge';
      streakBadge.title = 'Chuỗi ngày học tập liên tiếp';
      streakBadge.innerHTML = `<span class="br-streak-fire">⚡</span> ${streakVal}`;
      rightGroup.append(streakBadge);
      FE.translateUI();
    } catch {
      /* Fallback retains basic home button */
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Skip only our lesson iframe, not a browser preview that embeds the whole site.
  try {
    if (window.parent !== window && window.parent.document.querySelector('#frame')?.contentWindow === window) return;
  } catch { /* A cross-origin preview still needs its own authentication UI. */ }
  if (location.protocol === 'file:') return;
  const script = document.createElement('script');
  script.type = 'module';
  script.src = new URL('auth.js', document.querySelector('script[src$="assets/site.js"]').src).href;
  document.head.append(script);
});
