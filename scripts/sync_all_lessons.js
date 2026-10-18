const fs = require('fs');

const catalog = JSON.parse(fs.readFileSync('lessons.json'));
const roadmap = JSON.parse(fs.readFileSync('roadmap.json'));
const lessonFiles = [2,3,4,5,6,7,8,9,10,11,12,13,15,16,17,18,19,20,21];
const allFiles = [1, ...lessonFiles];

function getLessonMeta(id) {
  const item = catalog.lessons.find(l => l.stt === id);
  let goalNum = 1;
  roadmap.stages.forEach((st, sIdx) => {
    if (st.lessons.includes(id)) goalNum = sIdx + 1;
  });
  const idx = allFiles.indexOf(id);
  const prevId = idx > 0 ? allFiles[idx - 1] : null;
  const nextId = idx < allFiles.length - 1 ? allFiles[idx + 1] : null;
  return {
    stt: id,
    padStt: String(id).padStart(2, '0'),
    topic: item ? item.topic : '',
    goal: goalNum,
    prevId,
    nextId
  };
}

function syncLesson(id) {
  const meta = getLessonMeta(id);
  const filePath = `ly-thuyet/${id}.html`;
  if (!fs.existsSync(filePath)) {
    console.warn(`File ${filePath} not found, skipping.`);
    return;
  }
  let raw = fs.readFileSync(filePath, 'utf8');

  // Extract title
  const titleMatch = raw.match(/<title>([\s\S]*?)<\/title>/i);
  let cleanTitle = titleMatch ? titleMatch[1].replace(/—.*$/, '').replace(/\|.*$/, '').replace(/STT\s*\d+\s*[—–-]?\s*/i, '').replace(/FE\s*[—–-]\s*/i, '').trim() : meta.topic;

  // Extract inline scripts
  const scriptMatches = [...raw.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)];
  let inlineScripts = scriptMatches.map(m => m[1]).join('\n\n');

  // Remove nav, header, footer from old body
  let content = raw;
  content = content.replace(/<nav[\s\S]*?<\/nav>/gi, '');
  content = content.replace(/<header[\s\S]*?<\/header>/gi, '');
  content = content.replace(/<footer[\s\S]*?<\/footer>/gi, '');
  content = content.replace(/<script[\s\S]*?<\/script>/gi, '');

  // Extract body inner content
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let bodyInner = bodyMatch ? bodyMatch[1] : content;

  // Remove outer wraps
  bodyInner = bodyInner.replace(/^\s*<div class=["'](?:wrap|container)["'][^>]*>/i, '');
  bodyInner = bodyInner.replace(/<\/div>\s*$/i, '');

  // Remove Mind Map sections
  // Case A: <section ... id="p5" / "part5" / "mindmap" / "sec-5" ...> ... </section>
  bodyInner = bodyInner.replace(/<section[^>]*id=["'](?:p5|part5|mindmap|sec-5)["'][^>]*>[\s\S]*?<\/section>/gi, '');
  // Case B: Any section containing mindmap / マインドマップ
  bodyInner = bodyInner.replace(/<section[^>]*>(?:(?!<\/section>)[\s\S])*?(?:マインドマップ|mind\s*map|sơ\s*đồ\s*tư\s*duy)[\s\S]*?<\/section>/gi, '');
  // Case C: Heading with Mind Map + SVG/Container
  bodyInner = bodyInner.replace(/<!--.*?PHẦN 5.*?-->[\s\S]*?(?=<footer|<script|$)/gi, '');
  bodyInner = bodyInner.replace(/<h2[^>]*>(?:(?!<\/h2>)[\s\S])*?(?:マインドマップ|mind\s*map|sơ\s*đồ\s*tư\s*duy)[\s\S]*?<\/h2>[\s\S]*?(?:<svg[\s\S]*?<\/svg>|<div class=["'][^"']*mindmap[\s\S]*?<\/div>)(?:<\/div>|<\/section>)?/gi, '');
  // Case D: Any remaining stand-alone svg with mindmap class or container
  bodyInner = bodyInner.replace(/<div class=["'][^"']*mindmap[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '');

  // Standardize H2 IDs for TOC & Scrollspy
  let h2Count = 0;
  bodyInner = bodyInner.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attrs, text) => {
    h2Count++;
    const partId = `part-${h2Count}`;
    // Remove existing id if present in attrs
    const cleanAttrs = attrs.replace(/\sid=["'][^"']*["']/i, '');
    return `<h2 id="${partId}"${cleanAttrs}>${text}</h2>`;
  });

  // TOC items
  const tocItems = [
    { href: '#part-1', textJa: '① 重要理論', textVi: '① Tóm tắt lý thuyết' },
    { href: '#part-2', textJa: '② 演習例題', textVi: '② Ví dụ minh hoạ' },
    { href: '#part-3', textJa: '③ 暗記カード', textVi: '③ Flashcards' },
    { href: '#part-4', textJa: '④ 確認テスト', textVi: '④ Quiz ôn tập' }
  ];

  const tocHtml = tocItems.map(item => `
          <li><a href="${item.href}" class="toc-link"><span class="text-ja">${item.textJa}</span><span class="text-vi">${item.textVi}</span></a></li>
  `).join('');

  // Prev / Next Navigation Links
  const prevLink = meta.prevId ? `
        <a href="${meta.prevId}.html" class="nav-link-card prev">
          <span class="nav-dir">← BÀI TRƯỚC / PREV</span>
          <span class="nav-target">
            <span class="text-ja">レッスン ${String(meta.prevId).padStart(2, '0')}</span>
            <span class="text-vi">Bài học ${String(meta.prevId).padStart(2, '0')}</span>
          </span>
        </a>` : `
        <a href="../index.html" class="nav-link-card prev">
          <span class="nav-dir">← LỘ TRÌNH / ROADMAP</span>
          <span class="nav-target">
            <span class="text-ja">レッスン一覧に戻る</span>
            <span class="text-vi">Quay lại danh mục</span>
          </span>
        </a>`;

  const nextLink = meta.nextId ? `
        <a href="${meta.nextId}.html" class="nav-link-card next">
          <span class="nav-dir">BÀI TIẾP THEO / NEXT →</span>
          <span class="nav-target">
            <span class="text-ja">レッスン ${String(meta.nextId).padStart(2, '0')}</span>
            <span class="text-vi">Bài học ${String(meta.nextId).padStart(2, '0')}</span>
          </span>
        </a>` : `
        <a href="../kiem-tra/${id}.html" class="nav-link-card next">
          <span class="nav-dir">KIỂM TRA / TEST →</span>
          <span class="nav-target">
            <span class="text-ja">確認テストに挑戦</span>
            <span class="text-vi">Luyện thi trắc nghiệm</span>
          </span>
        </a>`;

  // Build clean unified reader HTML
  const unifiedHtml = `<!DOCTYPE html>
<html lang="vi" data-theme="light" data-lang="dual">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bài ${meta.padStt}: ${cleanTitle} — FE Master</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans+JP:wght@400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/reader.css">
</head>
<body>

<!-- Reading Progress Bar -->
<div class="reading-progress-track">
  <div class="reading-progress-bar" id="readingProgress"></div>
</div>

<!-- Minimal Sticky Top Header -->
<header class="site-header">
  <div class="header-container">
    <div class="header-left">
      <a href="../index.html" class="back-btn" title="Quay lại Lộ trình">
        <span class="text-ja">← ロードマップ</span>
        <span class="text-vi">← Lộ trình</span>
      </a>
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="../index.html"><span class="text-ja">FE学習</span><span class="text-vi">Lộ trình FE</span></a>
        <span class="sep">/</span>
        <span>Mục tiêu ${meta.goal}</span>
        <span class="sep">/</span>
        <span class="current">Bài ${meta.padStt}</span>
      </nav>
    </div>
    <div class="header-right">
      <div class="lang-selector">
        <button class="lang-btn active" data-mode="dual" title="Song ngữ">🌐 Song ngữ</button>
        <button class="lang-btn" data-mode="ja" title="Chế độ phòng thi tiếng Nhật">🇯🇵 日本語</button>
        <button class="lang-btn" data-mode="vi" title="Chế độ đọc nhanh tiếng Việt">🇻🇳 Tiếng Việt</button>
      </div>
      <button class="icon-btn" id="zenModeBtn" title="Chế độ tập trung (ẩn sidebar)">
        <span id="zenIcon">📖</span>
        <span id="zenText">Zen</span>
      </button>
      <button class="icon-btn" id="themeToggleBtn" title="Chuyển chế độ Sáng / Tối">
        <span id="themeIcon">◐</span>
      </button>
    </div>
  </div>
</header>

<!-- Main Two-Column Reader Layout -->
<div class="page-container">

  <!-- Left Content Column -->
  <main class="main-content">

    <div class="lesson-header">
      <div class="lesson-meta-bar">
        <span class="badge-lesson">BÀI ${meta.padStt} · CƠ SỞ LÝ THUYẾT</span>
        <span class="badge-tag">MỤC TIÊU ${meta.goal}</span>
        <span class="badge-tag">TRỌNG TÂM 科目A</span>
      </div>
      <h1 class="lesson-title">
        ${cleanTitle}
      </h1>
      <div class="lesson-stats">
        <span>⏱ ~30-45 phút đọc</span>
        <span>·</span>
        <span>Active Recall & Flashcards</span>
      </div>
    </div>

    <!-- Lesson Content Body -->
    <div class="lesson-body">
${bodyInner}
    </div>

    <!-- Footer Navigation & Lesson Completion -->
    <footer class="lesson-footer-nav">
      <div class="completion-card">
        <div>
          <div style="font-weight:700;font-size:1.05rem;color:var(--text-main)">
            <span class="text-ja">このレッスンの学習を完了しましたか？</span>
            <span class="text-vi">Bạn đã hoàn thành bài học này?</span>
          </div>
          <div style="font-size:0.86rem;color:var(--text-muted);margin-top:2px">
            <span class="text-ja">完了マークをつけると、ロードマップに進捗が保存されます。</span>
            <span class="text-vi">Đánh dấu để lưu tiến độ học tập trên trang tổng quan.</span>
          </div>
        </div>
        <button class="btn-complete" id="markDoneBtn">✓ Đánh dấu đã xong</button>
      </div>

      <div class="footer-nav-buttons">
        ${prevLink}
        ${nextLink}
      </div>
    </footer>

  </main>

  <!-- Right Sticky Sidebar -->
  <aside class="sticky-sidebar">
    <div class="sidebar-card">
      <div class="sidebar-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        <span class="text-ja">目次 (TOC)</span>
        <span class="text-vi">MỤC LỤC BÀI HỌC</span>
      </div>
      <nav>
        <ul class="toc-list" id="tocList">
${tocHtml}
        </ul>
      </nav>
    </div>

    <div class="sidebar-card">
      <div class="sidebar-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        <span class="text-ja">クイック復習</span>
        <span class="text-vi">HỌC CHỦ ĐỘNG</span>
      </div>
      <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:8px">
        <span class="text-ja">カードをクリックして暗記・確認テストで理解度を測りましょう。</span>
        <span class="text-vi">Nhấp vào thẻ để lật flashcard và làm bài trắc nghiệm bên dưới.</span>
      </p>
    </div>
  </aside>

</div>

${inlineScripts ? `<script>\n${inlineScripts}\n</script>` : ''}
<script src="../assets/reader.js"></script>
</body>
</html>
`;

  fs.writeFileSync(filePath, unifiedHtml);
  console.log(`✓ Synchronized ly-thuyet/${id}.html`);
}

// Run for all lessons
lessonFiles.forEach(id => {
  try {
    syncLesson(id);
  } catch (err) {
    console.error(`Error syncing lesson ${id}:`, err);
  }
});

// Remove test file if exists
if (fs.existsSync('ly-thuyet/2-test.html')) {
  fs.unlinkSync('ly-thuyet/2-test.html');
}
console.log('All remaining lessons synchronized successfully!');
