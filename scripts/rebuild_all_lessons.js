const { execSync } = require('child_process');
const fs = require('fs');

const catalog = JSON.parse(fs.readFileSync('lessons.json'));
const roadmap = JSON.parse(fs.readFileSync('roadmap.json'));
const lessonFiles = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21];
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

// 1. Data Extractor
function extractDataAndContent(id) {
  let raw = '';
  try {
    raw = execSync(`git show cf4dc34:ly-thuyet/${id}.html`, { encoding: 'utf8' });
  } catch {
    raw = execSync(`git show HEAD~2:ly-thuyet/${id}.html`, { encoding: 'utf8' });
  }

  // Title
  const titleMatch = raw.match(/<title>([\s\S]*?)<\/title>/i);
  let cleanTitle = titleMatch ? titleMatch[1].replace(/—.*$/, '').replace(/\|.*$/, '').replace(/STT\s*\d+\s*[—–-]?\s*/i, '').replace(/FE\s*[—–-]\s*/i, '').trim() : '';

  // Extract Flashcards
  const fcList = [];
  const fcMatch = raw.match(/(?:const|let|var)\s+(?:FLASHCARDS|FC|FLASH|flashData|flashcards)\s*=\s*(\[[\s\S]*?\]);\s*(?:function|const|let|var|\/\/)/i)
               || raw.match(/(?:const|let|var)\s+(?:FLASHCARDS|FC|FLASH|flashData|flashcards)\s*=\s*(\[[\s\S]*?\]);/i);
  if (fcMatch) {
    try {
      const arr = eval(fcMatch[1]);
      arr.forEach(item => {
        if (Array.isArray(item)) {
          fcList.push({ cat: 'all', front: item[0], back: item[1] });
        } else if (typeof item === 'object') {
          fcList.push({
            cat: item.cat || item.category || 'all',
            front: item.front_ja || item.front || item.f || item.jp || item.q || '',
            back: item.back_ja || item.back || item.b || item.b_vn || item.a || ''
          });
        }
      });
    } catch (e) {
      console.error(`Eval error FC ${id}:`, e.message);
    }
  }

  if (fcList.length === 0) {
    // HTML flashcards: pair fronts with backs
    const fronts = [...raw.matchAll(/class=["'](?:flashcard-front|front|fc-front|fc-f)["'][^>]*>([\s\S]*?)<\/div>/gi)];
    const backs = [...raw.matchAll(/class=["'](?:flashcard-back|back|fc-back|fc-b)["'][^>]*>([\s\S]*?)<\/div>/gi)];
    const count = Math.min(fronts.length, backs.length);
    for (let i = 0; i < count; i++) {
      const f = fronts[i][1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const b = backs[i][1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (f && b) fcList.push({ cat: 'all', front: f, back: b });
    }
  }

  // Extract Quiz
  const quizList = [];
  const qMatch = raw.match(/(?:const|let|var)\s+(?:QUIZ|Q|quizData|quiz)\s*=\s*(\[[\s\S]*?\]);\s*(?:function|const|let|var|\/\/)/i)
              || raw.match(/(?:const|let|var)\s+(?:QUIZ|Q|quizData|quiz)\s*=\s*(\[[\s\S]*?\]);/i);
  if (qMatch) {
    try {
      const arr = eval(qMatch[1]);
      arr.forEach(item => {
        let q_text = item.q || item.question || item.q_ja || item.q_vi || '';
        if (!q_text && (item.jp || item.vn)) {
          q_text = item.jp ? (item.vn ? `${item.jp} (${item.vn})` : item.jp) : item.vn;
        }
        const opts = (item.opts || item.options || item.o || item.o_jp || []).map(o => String(o).replace(/^[A-D①-④0-9][.:\s]+/i, '').trim());
        let ans = item.ans !== undefined ? item.ans : item.correct !== undefined ? item.correct : item.a;
        if (typeof ans === 'string') {
          ans = ['A','B','C','D'].indexOf(ans.toUpperCase());
          if (ans === -1) ans = parseInt(ans, 10) - 1 || 0;
        }
        const expl = item.expl || item.explain || item.e || item.explanation || item.exp_jp || item.exp_vn || item.expl_ja || item.expl_vi || '';
        if (q_text && opts.length >= 2) {
          quizList.push({
            q: q_text,
            opts: opts,
            ans: Number.isInteger(ans) && ans >= 0 && ans < opts.length ? ans : 0,
            expl: expl
          });
        }
      });
    } catch (e) {
      console.error(`Eval error Quiz ${id}:`, e.message);
    }
  }

  // HTML quiz fallback
  if (quizList.length === 0) {
    // 1. check radio quiz-item
    const radioItems = [...raw.matchAll(/<div class=["']quiz-item["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi)];
    radioItems.forEach(ri => {
      const qTextMatch = ri[1].match(/class=["']quiz-question["'][^>]*>([\s\S]*?)<\/div>/i);
      const optsMatches = [...ri[1].matchAll(/<label[^>]*>[\s\S]*?<input[^>]*>([\s\S]*?)<\/label>/gi)];
      const btnMatch = ri[1].match(/checkAnswer\([^,]+,\s*['"]([A-D0-9])['"]\s*,\s*['"]([\s\S]*?)['"]\)/i);
      if (qTextMatch && optsMatches.length >= 2) {
        const qText = qTextMatch[1].replace(/<[^>]+>/g, '').trim();
        const opts = optsMatches.map(m => m[1].replace(/^[A-D①-④0-9][.:\s]+/i, '').replace(/<[^>]+>/g, '').trim());
        let ans = 0;
        if (btnMatch) {
          const letter = btnMatch[1].toUpperCase();
          ans = ['A','B','C','D'].indexOf(letter);
          if (ans === -1) ans = parseInt(letter, 10) - 1 || 0;
        }
        quizList.push({
          q: qText,
          opts: opts,
          ans: ans >= 0 && ans < opts.length ? ans : 0,
          expl: btnMatch ? btnMatch[2] : ''
        });
      }
    });

    // 2. check quiz-q / qbox
    if (quizList.length === 0) {
      const qBoxes = [...raw.matchAll(/<div class=["'](?:quiz-q|qbox)["']([^>]*)>([\s\S]*?)(?=<div class=["'](?:quiz-q|qbox)["']|<!--.*?PART 5|<section id="p5"|<section id="part5"|<section id="mindmap"|<footer>|<script|$)/gi)];
      qBoxes.forEach(qb => {
        const correctAttr = qb[1].match(/data-correct=["']([^"']+)["']/i);
        const qTextMatch = qb[2].match(/<(?:h4|div class=["'](?:quiz-question|q-title|qtitle|qtext|qtxt)["'])[^>]*>([\s\S]*?)<\/(?:h4|div)>/i);
        const optsMatches = [...qb[2].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
        const explMatch = qb[2].match(/class=["'](?:quiz-reveal|explain|explain-box)["'][^>]*>([\s\S]*?)<\/div>/i);
        if (qTextMatch && optsMatches.length >= 2) {
          const qText = qTextMatch[1].replace(/<[^>]+>/g, '').trim();
          const opts = optsMatches.map(m => m[1].replace(/^[A-D①-④0-9][.:\s]+/i, '').replace(/<[^>]+>/g, '').trim());
          let ans = 0;
          if (correctAttr) {
            const letter = correctAttr[1].toUpperCase();
            ans = ['A','B','C','D'].indexOf(letter);
            if (ans === -1) ans = parseInt(letter, 10) - 1 || 0;
          } else if (explMatch) {
            const ansInExpl = explMatch[1].match(/Đáp án:\s*([A-D①-④1-4])/i);
            if (ansInExpl) {
              const char = ansInExpl[1];
              if ('ABCD'.includes(char.toUpperCase())) ans = 'ABCD'.indexOf(char.toUpperCase());
              else if ('①②③④'.includes(char)) ans = '①②③④'.indexOf(char);
              else ans = parseInt(char, 10) - 1 || 0;
            }
          }
          quizList.push({
            q: qText,
            opts: opts,
            ans: ans >= 0 && ans < opts.length ? ans : 0,
            expl: explMatch ? explMatch[1].replace(/<[^>]+>/g, '').trim() : ''
          });
        }
      });
    }

    // 3. check lesson 9 quiz-item with answer(this, 'correct')
    if (quizList.length === 0) {
      const q9Items = [...raw.matchAll(/<div class=["']quiz-item["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi)];
      q9Items.forEach(qi => {
        const qMatch = qi[1].match(/class=["']quiz-q["'][^>]*>([\s\S]*?)<\/div>/i);
        const optMatches = [...qi[1].matchAll(/<div class=["']quiz-opt["']([^>]*)>([\s\S]*?)<\/div>/gi)];
        const explMatch = qi[1].match(/class=["']quiz-explain["'][^>]*>([\s\S]*?)<\/div>/i);
        if (qMatch && optMatches.length >= 2) {
          const q = qMatch[1].replace(/<[^>]+>/g, ' ').trim();
          const opts = optMatches.map(m => m[2].replace(/^[ア-エA-D0-9][.:\s]+/i, '').replace(/<[^>]+>/g, '').trim());
          let ans = 0;
          optMatches.forEach((m, idx) => {
            if (m[1].includes("'correct'") || m[1].includes('"correct"')) ans = idx;
          });
          quizList.push({
            q: q,
            opts: opts,
            ans: ans,
            expl: explMatch ? explMatch[1].replace(/<[^>]+>/g, '').trim() : ''
          });
        }
      });
    }

    // 4. check lesson 10 qi
    if (quizList.length === 0) {
      const qiBoxes = [...raw.matchAll(/<div class=["']qi["'][^>]*>([\s\S]*?)(?=<div class=["']qi["']|<!--.*?PART 5|<section id="p5"|<section id="part5"|<section id="mindmap"|<footer>|<script|$)/gi)];
      qiBoxes.forEach(qb => {
        const qTextMatch = qb[1].match(/class=["']qq["'][^>]*>([\s\S]*?)<\/div>/i);
        const optsMatches = [...qb[1].matchAll(/class=["']qopt["'][^>]*>([\s\S]*?)<\/div>/gi)];
        const explMatch = qb[1].match(/class=["']qans["'][^>]*>([\s\S]*?)<\/div>/i);
        if (qTextMatch && optsMatches.length >= 2) {
          const qText = qTextMatch[1].replace(/<[^>]+>/g, '').trim();
          const opts = optsMatches.map(m => m[1].replace(/^[A-D①-④0-9][.:\s]+/i, '').replace(/<[^>]+>/g, '').trim());
          let ans = 0;
          optsMatches.forEach((m, idx) => {
            if (m[0].includes('data-ok') || m[0].includes('correct') || m[0].includes('ok')) ans = idx;
          });
          quizList.push({
            q: qText,
            opts: opts,
            ans: ans,
            expl: explMatch ? explMatch[1].replace(/<[^>]+>/g, '').trim() : ''
          });
        }
      });
    }
  }

  // Extract Theory (Part 1) and Examples (Part 2) Content cleanly
  // Look for sections or headings
  let p1Html = '';
  let p2Html = '';

  // Remove nav, header, footer, script, mindmap
  let cleanBody = raw;
  cleanBody = cleanBody.replace(/<nav[\s\S]*?<\/nav>/gi, '');
  cleanBody = cleanBody.replace(/<header[\s\S]*?<\/header>/gi, '');
  cleanBody = cleanBody.replace(/<footer[\s\S]*?<\/footer>/gi, '');
  cleanBody = cleanBody.replace(/<script[\s\S]*?<\/script>/gi, '');

  // Remove mindmap
  cleanBody = cleanBody.replace(/<section[^>]*id=["'](?:p5|part5|mindmap|sec-5)["'][^>]*>[\s\S]*?<\/section>/gi, '');
  cleanBody = cleanBody.replace(/<section[^>]*>(?:(?!<\/section>)[\s\S])*?(?:マインドマップ|mind\s*map|sơ\s*đồ\s*tư\s*duy)[\s\S]*?<\/section>/gi, '');
  cleanBody = cleanBody.replace(/<!--.*?PHẦN 5.*?-->[\s\S]*?(?=<footer|<script|$)/gi, '');
  cleanBody = cleanBody.replace(/<h2[^>]*>(?:(?!<\/h2>)[\s\S])*?(?:マインドマップ|mind\s*map|sơ\s*đồ\s*tư\s*duy)[\s\S]*?<\/h2>[\s\S]*?(?:<svg[\s\S]*?<\/svg>|<div class=["'][^"']*mindmap[\s\S]*?<\/div>)(?:<\/div>|<\/section>)?/gi, '');

  // Extract Part 1
  const p1Match = cleanBody.match(/(?:<section[^>]*id=["'](?:p1|part1|theory)["'][^>]*>|<h2[^>]*>(?:(?!<\/h2>)[\s\S])*(?:Phần 1|Lý thuyết|理論)[\s\S]*?<\/h2>)([\s\S]*?)(?:<section[^>]*id=["'](?:p2|part2|example)["']|<h2[^>]*>(?:(?!<\/h2>)[\s\S])*(?:Phần 2|Ví dụ|例題)|$)/i);
  if (p1Match) {
    p1Html = p1Match[1].replace(/<\/section>\s*$/i, '').trim();
  }

  // Extract Part 2
  const p2Match = cleanBody.match(/(?:<section[^>]*id=["'](?:p2|part2|example)["'][^>]*>|<h2[^>]*>(?:(?!<\/h2>)[\s\S])*(?:Phần 2|Ví dụ|例題)[\s\S]*?<\/h2>)([\s\S]*?)(?:<section[^>]*id=["'](?:p3|part3|flash)["']|<h2[^>]*>(?:(?!<\/h2>)[\s\S])*(?:Phần 3|Flashcard|暗記カード)|$)/i);
  if (p2Match) {
    p2Html = p2Match[1].replace(/<\/section>\s*$/i, '').trim();
  }

  // If p1Html or p2Html are missing, fallback to splitting by h2
  if (!p1Html) {
    const h2Splits = cleanBody.split(/<h2[^>]*>/i);
    if (h2Splits.length >= 2) {
      p1Html = h2Splits[1].replace(/^[\s\S]*?<\/h2>/, '').replace(/<\/section>[\s\S]*$/, '').trim();
    }
  }
  if (!p2Html) {
    const h2Splits = cleanBody.split(/<h2[^>]*>/i);
    if (h2Splits.length >= 3) {
      p2Html = h2Splits[2].replace(/^[\s\S]*?<\/h2>/, '').replace(/<\/section>[\s\S]*$/, '').trim();
    }
  }

  return { cleanTitle, p1Html, p2Html, fcList, quizList };
}

// 2. Build Unified Lesson Page
function generateUnifiedLesson(id) {
  const meta = getLessonMeta(id);
  const data = extractDataAndContent(id);
  const title = data.cleanTitle || meta.topic;

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

  return `<!DOCTYPE html>
<html lang="vi" data-theme="light" data-lang="dual">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bài ${meta.padStt}: ${title} — FE Master</title>
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
        ${title}
      </h1>
      <div class="lesson-stats">
        <span>⏱ ~30-45 phút đọc</span>
        <span>·</span>
        <span>Active Recall & Flashcards</span>
      </div>
    </div>

    <!-- PHẦN 1: TÓM TẮT LÝ THUYẾT -->
    <section class="content-section" id="sec-1">
      <h2 class="section-heading">
        <span class="num-badge">①</span>
        <span class="text-ja">重要理論 (Theory)</span>
        <span class="text-vi">Tóm tắt lý thuyết cốt lõi</span>
      </h2>
      <div class="lesson-body-content">
${data.p1Html}
      </div>
    </section>

    <!-- PHẦN 2: VÍ DỤ MINH HỌA -->
    <section class="content-section" id="sec-2">
      <h2 class="section-heading">
        <span class="num-badge">②</span>
        <span class="text-ja">演習例題 (Worked Examples)</span>
        <span class="text-vi">Ví dụ minh hoạ & từng bước giải</span>
      </h2>
      <div class="lesson-body-content">
${data.p2Html || '<p class="text-muted">Các ví dụ minh hoạ đã được tích hợp trong phần lý thuyết và bài tập kiểm tra.</p>'}
      </div>
    </section>

    <!-- PHẦN 3: FLASHCARDS TƯƠNG TÁC (EXACT LESSON 1 ENGINE) -->
    <section class="content-section" id="sec-3">
      <h2 class="section-heading">
        <span class="num-badge">③</span>
        <span class="text-ja">暗記カード (Flashcards)</span>
        <span class="text-vi">Flashcards thuật ngữ · Bấm để lật</span>
      </h2>
      <p style="color:var(--text-muted);font-size:0.92rem;margin-bottom:16px">
        <span class="text-ja">カードをクリックして裏面の定義・意味を確認できます。</span>
        <span class="text-vi">Nhấp chuột hoặc chạm vào thẻ để kiểm tra trí nhớ định nghĩa tiếng Nhật và tiếng Việt.</span>
      </p>

      <div class="fc-grid" id="fcGrid"></div>
    </section>

    <!-- PHẦN 4: QUIZ TRẮC NGHIỆM TỰ CHẤM ĐIỂM (EXACT LESSON 1 ENGINE) -->
    <section class="content-section" id="sec-4">
      <h2 class="section-heading">
        <span class="num-badge">④</span>
        <span class="text-ja">確認テスト (${data.quizList.length}問)</span>
        <span class="text-vi">Luyện tập củng cố · ${data.quizList.length} câu trắc nghiệm</span>
      </h2>
      <p style="color:var(--text-muted);font-size:0.92rem;margin-bottom:20px">
        <span class="text-ja">選択肢をクリックすると即座に正誤判定と解説が表示されます。</span>
        <span class="text-vi">Chọn đáp án tốt nhất. Hệ thống sẽ khóa và hiển thị phản hồi ngay lập tức để ghi nhớ chủ động.</span>
      </p>

      <div id="quizArea"></div>

      <div class="quiz-result-box" id="quiz-result">
        <div style="font-family:var(--font-mono);font-size:0.8rem;letter-spacing:0.1em;color:var(--text-muted)">TEST RESULT · 採点結果</div>
        <div class="quiz-result-score" id="qScore">0 / ${data.quizList.length}</div>
        <div id="qVerdict" style="font-size:1.1rem;font-weight:700;color:var(--text-main);margin-bottom:16px"></div>
        <button class="btn-complete" onclick="resetQuiz()">↻ もう一度解く / LÀM LẠI</button>
      </div>
    </section>

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
          <li><a href="#sec-1" class="toc-link active"><span class="text-ja">① 重要理論</span><span class="text-vi">① Tóm tắt lý thuyết</span></a></li>
          <li><a href="#sec-2" class="toc-link"><span class="text-ja">② 演習例題</span><span class="text-vi">② Ví dụ minh hoạ</span></a></li>
          <li><a href="#sec-3" class="toc-link"><span class="text-ja">③ 暗記カード</span><span class="text-vi">③ Flashcards</span></a></li>
          <li><a href="#sec-4" class="toc-link"><span class="text-ja">④ 確認テスト</span><span class="text-vi">④ Quiz ${data.quizList.length} câu</span></a></li>
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

<!-- EXACT LESSON 1 ENGINE FOR FLASHCARDS & QUIZ -->
<script>
const FLASHCARDS = ${JSON.stringify(data.fcList, null, 2)};
const QUIZ = ${JSON.stringify(data.quizList, null, 2)};

// Render Flashcards with reliable click-to-flip
function renderFC() {
  const grid = document.getElementById('fcGrid');
  if (!grid) return;
  grid.innerHTML = '';

  FLASHCARDS.forEach(f => {
    const card = document.createElement('div');
    card.className = 'fc-card';
    card.innerHTML = \`
      <div>
        <span class="fc-cat">\${f.cat || 'FE VOCAB'}</span>
        <div class="fc-front">\${f.front}</div>
        <div class="fc-back">\${f.back}</div>
      </div>
      <div class="fc-hint">▸ クリックで反転 / Nhấp để lật</div>
    \`;
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    grid.appendChild(card);
  });
}

// Render Interactive Quiz with tactile 4-option cards & instant feedback
let quizScore = 0;
let quizAnswered = 0;

function renderQuiz() {
  const area = document.getElementById('quizArea');
  if (!area) return;
  area.innerHTML = '';
  quizScore = 0;
  quizAnswered = 0;

  QUIZ.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'quiz-q-card';
    card.dataset.idx = idx;

    let optsHtml = '';
    item.opts.forEach((opt, oi) => {
      const letter = ['A', 'B', 'C', 'D'][oi] || String(oi + 1);
      optsHtml += \`<div class="opt" data-oi="\${oi}"><span class="ltr">\${letter}</span><span>\${opt}</span></div>\`;
    });

    card.innerHTML = \`
      <div class="q-num">問 \${idx + 1} / \${QUIZ.length}</div>
      <div class="q-text">\${item.q}</div>
      <div class="opts">\${optsHtml}</div>
      <div class="expl">\${item.expl || '<b>Đã hoàn thành câu hỏi.</b>'}</div>
    \`;

    card.querySelectorAll('.opt').forEach(optEl => {
      optEl.addEventListener('click', () => {
        if (card.classList.contains('locked')) return;
        card.classList.add('locked');

        const chosen = parseInt(optEl.dataset.oi, 10);
        const correct = item.ans;

        const correctEl = card.querySelector(\`.opt[data-oi="\${correct}"]\`);
        if (correctEl) correctEl.classList.add('correct');

        if (chosen !== correct) {
          optEl.classList.add('wrong');
        } else {
          quizScore++;
        }

        quizAnswered++;
        if (quizAnswered === QUIZ.length) showQuizResult();
      });
    });

    area.appendChild(card);
  });

  const resBox = document.getElementById('quiz-result');
  if (resBox) resBox.classList.remove('show');
}

function showQuizResult() {
  const pct = Math.round((quizScore / QUIZ.length) * 100);
  document.getElementById('qScore').textContent = \`\${quizScore} / \${QUIZ.length}\`;
  let verdict = '';
  if (pct >= 90) verdict = '🏆 合格点到達！完璧に理解できています。/ Xuất sắc!';
  else if (pct >= 70) verdict = '👍 合格圏内です。間違えた問題を確認しましょう。/ Rất tốt!';
  else if (pct >= 50) verdict = '📚 あと一歩！復習して再挑戦しましょう。/ Khá!';
  else verdict = '💪 もう一度本文を読んで挑戦してみましょう！/ Hãy đọc lại nhé!';
  document.getElementById('qVerdict').textContent = \`\${verdict} (\${pct}%)\`;
  const res = document.getElementById('quiz-result');
  if (res) {
    res.classList.add('show');
    res.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function resetQuiz() {
  renderQuiz();
  const area = document.getElementById('quizArea');
  if (area) area.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Initialize on DOM ready
renderFC();
renderQuiz();
</script>
<script src="../assets/reader.js"></script>
</body>
</html>
`;
}

// Rebuild all lessons
lessonFiles.forEach(id => {
  try {
    const html = generateUnifiedLesson(id);
    fs.writeFileSync(`ly-thuyet/${id}.html`, html);
    console.log(`✓ Rebuilt ly-thuyet/${id}.html with exact Lesson 1 layout & interactive engine!`);
  } catch (err) {
    console.error(`Error rebuilding ${id}:`, err);
  }
});

console.log('All 19 lessons completely rebuilt and synchronized with Lesson 1!');
