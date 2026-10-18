/**
 * FE Master - Shared Reader Script
 * Handles: 3-Mode Language Switcher (dual/ja/vi), Reading Progress, Scrollspy TOC,
 * Zen Mode, Dark/Light Theme, Mini-Vocab, Flashcards, and Quiz Interaction.
 */

(function () {
  'use strict';

  // 1. Language Mode Management
  function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const savedLang = localStorage.getItem('fe-lessons:v1:lang') || 'dual';

    function setLanguageMode(mode) {
      document.documentElement.setAttribute('data-lang', mode);
      localStorage.setItem('fe-lessons:v1:lang', mode);

      langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
      });

      if (typeof window.onLanguageChange === 'function') {
        window.onLanguageChange(mode);
      }
      window.dispatchEvent(new CustomEvent('fe-lang-change', { detail: mode }));
    }

    langButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        setLanguageMode(btn.dataset.mode);
      });
    });

    setLanguageMode(savedLang);
    window.setLanguageMode = setLanguageMode;
  }

  // 2. Reading Progress Bar
  function initReadingProgress() {
    const bar = document.getElementById('readingProgress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      bar.style.width = scrolled + '%';
    }, { passive: true });
  }

  // 3. Theme Toggle (Light / Dark)
  function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const savedTheme = localStorage.getItem('fe-lessons:v1:theme') || 'light';

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('fe-lessons:v1:theme', theme);
      if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '◐';
      }
    }

    applyTheme(savedTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    }
  }

  // 4. Zen Mode Toggle
  function initZenMode() {
    const zenBtn = document.getElementById('zenModeBtn');
    const zenIcon = document.getElementById('zenIcon');
    const zenText = document.getElementById('zenText');
    if (!zenBtn) return;

    zenBtn.addEventListener('click', () => {
      const isZen = document.body.classList.toggle('zen-mode');
      zenBtn.classList.toggle('active', isZen);
      if (zenIcon) zenIcon.textContent = isZen ? '📄' : '📖';
      if (zenText) zenText.textContent = isZen ? 'Thường' : 'Zen';
    });
  }

  // 5. Scrollspy TOC
  function initScrollspy() {
    const sections = document.querySelectorAll('.content-section, section.part, section[id], article[id]');
    const tocLinks = document.querySelectorAll('.toc-link');
    if (!sections.length || !tocLinks.length) return;

    window.addEventListener('scroll', () => {
      let currentId = '';
      sections.forEach(sec => {
        const secTop = sec.offsetTop - 140;
        if (window.pageYOffset >= secTop) {
          currentId = sec.getAttribute('id');
        }
      });

      if (currentId) {
        tocLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + currentId) {
            link.classList.add('active');
          }
        });
      }
    }, { passive: true });
  }

  // 6. Mini-Vocab in Sidebar
  function initMiniVocab() {
    document.querySelectorAll('.mini-vocab-item').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('revealed');
      });
    });
  }

  // 7. Quick Check Active Recall
  function initQuickChecks() {
    document.querySelectorAll('.quick-check-box').forEach(box => {
      const correctIdx = parseInt(box.dataset.ans, 10);
      const opts = box.querySelectorAll('.qc-opt');
      const expl = box.querySelector('.qc-expl');

      opts.forEach(opt => {
        opt.addEventListener('click', () => {
          if (box.classList.contains('answered')) return;
          box.classList.add('answered');

          const chosenIdx = parseInt(opt.dataset.idx, 10);
          if (opts[correctIdx]) opts[correctIdx].classList.add('correct');
          if (chosenIdx !== correctIdx) {
            opt.classList.add('wrong');
          }
          if (expl) expl.classList.add('show');
        });
      });
    });
  }

  // 8. Completion Button
  function initCompletion() {
    const markBtn = document.getElementById('markDoneBtn');
    if (!markBtn) return;

    // Detect lesson number from URL (e.g. ly-thuyet/2.html -> "2")
    const match = window.location.pathname.match(/\/(\d+)\.html$/);
    const lessonNum = match ? match[1] : '1';
    const storageKey = 'fe-lessons:v1:status:' + lessonNum;

    function updateDoneState() {
      const isDone = localStorage.getItem(storageKey) === '"p4"';
      const lang = document.documentElement.getAttribute('data-lang') || 'dual';
      if (isDone) {
        markBtn.textContent = lang === 'ja' ? '✓ 学習完了済み' : '✓ Đã hoàn thành';
        markBtn.classList.add('done');
      } else {
        markBtn.textContent = lang === 'ja' ? '○ 完了としてマーク' : '○ Đánh dấu đã xong';
        markBtn.classList.remove('done');
      }
    }

    updateDoneState();
    window.addEventListener('fe-lang-change', updateDoneState);

    markBtn.addEventListener('click', () => {
      const current = localStorage.getItem(storageKey) === '"p4"';
      localStorage.setItem(storageKey, current ? '"p0"' : '"p4"');
      updateDoneState();
    });
  }

  // 9. Generic Flashcard Click Flip Handler
  function initFlashcards() {
    document.querySelectorAll('.fc-card, .fc').forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
        card.classList.toggle('show-back');
      });
    });
  }

  // 10. Generic Quiz Interaction Handler
  function initGenericQuiz() {
    document.querySelectorAll('.quiz-q-card, .quiz-q, .qz').forEach(card => {
      const opts = card.querySelectorAll('.opt, .qz-opt');
      opts.forEach(opt => {
        opt.addEventListener('click', () => {
          if (card.classList.contains('locked')) return;
          const isCorrect = opt.dataset.correct === 'true' || opt.classList.contains('ok') || opt.dataset.ans === 'true';
          card.classList.add('locked');
          if (isCorrect) {
            opt.classList.add('correct', 'ok');
          } else {
            opt.classList.add('wrong', 'ng');
            const rightOpt = card.querySelector('[data-correct="true"], .ok, [data-ans="true"]');
            if (rightOpt) rightOpt.classList.add('correct', 'ok');
          }
          const expl = card.querySelector('.expl, .qz-exp');
          if (expl) expl.classList.add('show');
        });
      });
    });
  }

  // Document Ready
  function onReady() {
    initLanguageSwitcher();
    initReadingProgress();
    initTheme();
    initZenMode();
    initScrollspy();
    initMiniVocab();
    initQuickChecks();
    initCompletion();
    initFlashcards();
    initGenericQuiz();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
