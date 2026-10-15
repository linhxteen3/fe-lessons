/**
 * FE Lessons - Shared JavaScript Module (common.js)
 * Provides shared utilities, progress tracking (LocalStorage),
 * top navigation bar builder, toast notifications, keyboard shortcuts,
 * scroll-to-top, and theme management.
 *
 * Applicable across all pages (index, ly-thuyet/*.html, kiem-tra/*.html).
 */

(function (global) {
  'use strict';

  /* ==========================================================================
     1. LocalStorage Progress Manager (FEProgress)
     ========================================================================== */
  const FEProgress = {
    KEY: 'fe-lessons-progress',

    _read() {
      try {
        const raw = localStorage.getItem(this.KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) ? parsed : {};
      } catch (err) {
        console.warn('[FEProgress] Failed to read from localStorage:', err);
        return {};
      }
    },

    _write(data) {
      try {
        localStorage.setItem(this.KEY, JSON.stringify(data));
        return true;
      } catch (err) {
        console.error('[FEProgress] Failed to write to localStorage:', err);
        return false;
      }
    },

    // Get all saved progress
    // Returns object like { "1": { status: "done", quizScore: 35, quizTotal: 40, lastStudied: "2024-01-01" }, ... }
    getAll() {
      return this._read();
    },

    // Get progress for a specific lesson
    get(stt) {
      if (stt === undefined || stt === null) return null;
      const all = this._read();
      const key = String(stt);
      if (all[key]) {
        return all[key];
      }
      return {
        status: 'todo',
        quizScore: null,
        quizTotal: null,
        quizPercentage: null,
        lastStudied: null,
        history: []
      };
    },

    // Save lesson status ('done' or 'todo')
    setStatus(stt, status) {
      if (stt === undefined || stt === null) return null;
      const all = this._read();
      const key = String(stt);
      const normalizedStatus = (status === 'done' || status === 'p4') ? 'done' : 'todo';

      if (!all[key]) {
        all[key] = {
          status: normalizedStatus,
          quizScore: null,
          quizTotal: null,
          quizPercentage: null,
          lastStudied: new Date().toISOString(),
          history: []
        };
      } else {
        all[key].status = normalizedStatus;
      }

      this._write(all);
      return all[key];
    },

    // Save quiz result
    // type: 'theory-quiz' (10 questions in lesson) or 'exam' (40 questions test)
    // saves: { score, total, percentage, date, type }
    saveQuizResult(stt, score, total, type) {
      if (stt === undefined || stt === null) return null;
      const all = this._read();
      const key = String(stt);

      const numScore = Math.max(0, parseInt(score, 10) || 0);
      const numTotal = Math.max(0, parseInt(total, 10) || 0);
      const percentage = numTotal > 0 ? Math.round((numScore / numTotal) * 100) : 0;
      const now = new Date().toISOString();
      const quizType = type || (numTotal <= 15 ? 'theory-quiz' : 'exam');

      const attempt = {
        score: numScore,
        total: numTotal,
        percentage: percentage,
        date: now,
        type: quizType
      };

      if (!all[key]) {
        all[key] = {
          status: percentage >= 80 ? 'done' : 'todo',
          quizScore: numScore,
          quizTotal: numTotal,
          quizPercentage: percentage,
          lastStudied: now,
          history: [attempt]
        };
      } else {
        all[key].quizScore = numScore;
        all[key].quizTotal = numTotal;
        all[key].quizPercentage = percentage;
        all[key].lastStudied = now;
        if (!Array.isArray(all[key].history)) {
          all[key].history = [];
        }
        all[key].history.push(attempt);

        // Auto mark as done if user achieved passing percentage (>=80%)
        if (percentage >= 80 && all[key].status !== 'done') {
          all[key].status = 'done';
        }
      }

      this._write(all);
      return attempt;
    },

    // Get quiz history for a lesson
    getQuizHistory(stt) {
      if (stt === undefined || stt === null) return [];
      const item = this.get(stt);
      return Array.isArray(item.history) ? item.history : [];
    },

    // Mark lesson as studied (update lastStudied timestamp)
    markStudied(stt) {
      if (stt === undefined || stt === null) return null;
      const all = this._read();
      const key = String(stt);
      const now = new Date().toISOString();

      if (!all[key]) {
        all[key] = {
          status: 'todo',
          quizScore: null,
          quizTotal: null,
          quizPercentage: null,
          lastStudied: now,
          history: []
        };
      } else {
        all[key].lastStudied = now;
      }

      this._write(all);
      return all[key];
    },

    // Get overall stats
    // returns { totalLessons, completedLessons, totalQuizAttempts, averageScore }
    getStats() {
      const all = this._read();
      const keys = Object.keys(all);
      const totalLessons = (FENav._cachedLessons && FENav._cachedLessons.length) ? FENav._cachedLessons.length : 61;

      let completedLessons = 0;
      let totalQuizAttempts = 0;
      let totalPercentage = 0;
      let ratedAttempts = 0;

      keys.forEach(k => {
        const item = all[k];
        if (item.status === 'done' || item.status === 'p4') {
          completedLessons++;
        }
        if (Array.isArray(item.history) && item.history.length > 0) {
          item.history.forEach(att => {
            totalQuizAttempts++;
            if (typeof att.percentage === 'number') {
              totalPercentage += att.percentage;
              ratedAttempts++;
            }
          });
        } else if (typeof item.quizPercentage === 'number') {
          totalQuizAttempts++;
          totalPercentage += item.quizPercentage;
          ratedAttempts++;
        }
      });

      const averageScore = ratedAttempts > 0 ? Math.round(totalPercentage / ratedAttempts) : 0;

      return {
        totalLessons,
        completedLessons,
        totalQuizAttempts,
        averageScore
      };
    },

    // Export all data as JSON string
    export() {
      try {
        return JSON.stringify(this._read(), null, 2);
      } catch (err) {
        console.error('[FEProgress] Export failed:', err);
        return '{}';
      }
    },

    // Import from JSON string
    import(jsonStr) {
      try {
        if (!jsonStr || typeof jsonStr !== 'string') return false;
        const parsed = JSON.parse(jsonStr);
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
          return false;
        }
        return this._write(parsed);
      } catch (err) {
        console.error('[FEProgress] Import failed:', err);
        return false;
      }
    },

    // Clear all progress
    clear() {
      try {
        localStorage.removeItem(this.KEY);
        return true;
      } catch (err) {
        console.error('[FEProgress] Clear failed:', err);
        return false;
      }
    }
  };


  /* ==========================================================================
     Theme Manager (FETheme)
     ========================================================================== */
  const FETheme = {
    KEY: 'fe-theme',

    get() {
      try {
        const saved = localStorage.getItem(this.KEY);
        if (saved === 'light' || saved === 'dark') return saved;
      } catch (e) {}
      return 'dark'; // Default to dark theme following project guidelines
    },

    set(theme) {
      const mode = theme === 'light' ? 'light' : 'dark';
      try {
        localStorage.setItem(this.KEY, mode);
      } catch (e) {}
      document.documentElement.setAttribute('data-theme', mode);
      this._updateButtons(mode);
      return mode;
    },

    toggle() {
      const current = this.get();
      const next = current === 'dark' ? 'light' : 'dark';
      this.set(next);
      FEToast.show(next === 'dark' ? '🌙 Chế độ tối' : '☀️ Chế độ sáng', 1500);
      return next;
    },

    init() {
      const theme = this.get();
      this.set(theme);
    },

    _updateButtons(theme) {
      const isDark = theme === 'dark';
      document.querySelectorAll('.fe-theme-btn').forEach(btn => {
        const icon = btn.querySelector('.fe-theme-icon');
        if (icon) icon.textContent = isDark ? '🌙' : '☀️';
        btn.setAttribute('aria-label', isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối');
        btn.setAttribute('title', isDark ? 'Chế độ tối (Bấm để đổi sáng)' : 'Chế độ sáng (Bấm để đổi tối)');
      });
    }
  };


  /* ==========================================================================
     2. Top Navigation Builder (FENav)
     ========================================================================== */
  const FENav = {
    _cachedLessons: null,
    _currentStt: null,
    _pageType: 'index',

    _getBasePath() {
      const path = (window.location.pathname || '').replace(/\\/g, '/');
      if (path.includes('/ly-thuyet/') || path.includes('/kiem-tra/')) {
        return '../';
      }
      return './';
    },

    async _loadLessons() {
      if (this._cachedLessons && this._cachedLessons.length > 0) {
        return this._cachedLessons;
      }
      const basePath = this._getBasePath();
      try {
        const r = await fetch(basePath + 'lessons.json', { cache: 'no-cache' });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const data = await r.json();
        this._cachedLessons = Array.isArray(data.lessons) ? data.lessons : [];
        return this._cachedLessons;
      } catch (e) {
        console.warn('[FENav] Could not load lessons.json:', e);
        if (!this._cachedLessons) this._cachedLessons = [];
        return this._cachedLessons;
      }
    },

    async init(currentStt, pageType) {
      this._currentStt = currentStt;
      this._pageType = pageType || 'index';

      const lessons = await this._loadLessons();
      this._injectStyles();

      const existingNav = document.getElementById('fe-top-nav');
      if (existingNav) existingNav.remove();

      const navContainer = document.createElement('header');
      navContainer.id = 'fe-top-nav';
      navContainer.className = 'fe-top-nav';
      navContainer.innerHTML = this._buildNavHTML(currentStt, pageType, lessons);

      document.body.prepend(navContainer);

      this._bindEvents(currentStt, pageType, lessons);
      FETheme._updateButtons(FETheme.get());
    },

    _buildNavHTML(currentStt, pageType, lessons) {
      const basePath = this._getBasePath();
      const currLesson = lessons.find(l => Number(l.stt) === Number(currentStt));
      const topic = currLesson ? (currLesson.topic || '') : (currentStt ? `Bài ${currentStt}` : '');
      const paddedStt = currentStt ? String(currentStt).padStart(2, '0') : '';

      // Check current lesson progress status
      const prog = currentStt ? FEProgress.get(currentStt) : null;
      const isDone = prog && prog.status === 'done';

      // Determine prev/next lessons
      let prevStt = null;
      let nextStt = null;
      if (currentStt) {
        const currIdx = lessons.findIndex(l => Number(l.stt) === Number(currentStt));
        if (currIdx > 0) {
          prevStt = lessons[currIdx - 1].stt;
        } else if (Number(currentStt) > 1) {
          prevStt = Number(currentStt) - 1;
        }

        if (currIdx >= 0 && currIdx < lessons.length - 1) {
          nextStt = lessons[currIdx + 1].stt;
        } else if (Number(currentStt) < 61) {
          nextStt = Number(currentStt) + 1;
        }
      }

      // Lesson options for select jump dropdown
      let lessonOptions = `<option value="" disabled ${!currentStt ? 'selected' : ''}>-- Chọn bài học (1-61) --</option>`;
      if (lessons.length > 0) {
        lessons.forEach(l => {
          const optStt = String(l.stt).padStart(2, '0');
          const isSelected = Number(l.stt) === Number(currentStt);
          const safeTopic = (l.topic || '').replace(/"/g, '&quot;');
          lessonOptions += `<option value="${l.stt}" ${isSelected ? 'selected' : ''}>${optStt}. ${safeTopic}</option>`;
        });
      } else {
        for (let i = 1; i <= 61; i++) {
          const optStt = String(i).padStart(2, '0');
          const isSelected = i === Number(currentStt);
          lessonOptions += `<option value="${i}" ${isSelected ? 'selected' : ''}>Bài ${optStt}</option>`;
        }
      }

      // Build Nav HTML
      return `
        <div class="fe-nav-container">
          <!-- LEFT: Brand & Back link -->
          <div class="fe-nav-left">
            <a href="${basePath}index.html" class="fe-nav-brand" title="Về trang chủ FE 学習">
              <span class="fe-brand-badge">FE</span>
              <span class="fe-brand-text">FE 学習</span>
            </a>
            ${(pageType === 'theory' || pageType === 'quiz') ? `
              <a href="${basePath}index.html" class="fe-nav-btn fe-btn-back" title="Danh sách bài học (H)">
                <span class="fe-icon">←</span>
                <span class="fe-btn-text">Danh sách</span>
              </a>
            ` : ''}
          </div>

          <!-- CENTER: Current Lesson Info or Tagline -->
          <div class="fe-nav-center">
            ${(pageType === 'theory' || pageType === 'quiz') ? `
              <div class="fe-nav-lesson-badge" title="Bài số ${currentStt}">STT ${paddedStt}</div>
              <div class="fe-nav-topic" title="${topic.replace(/"/g, '&quot;')}">${topic}</div>
              <div class="fe-nav-tabs" role="tablist">
                <a href="${basePath}ly-thuyet/${currentStt}.html"
                   class="fe-nav-tab ${pageType === 'theory' ? 'active' : ''}"
                   role="tab"
                   aria-selected="${pageType === 'theory'}"
                   title="Lý thuyết (Phím T)">
                  📖 Lý thuyết
                </a>
                <a href="${basePath}kiem-tra/${currentStt}.html"
                   class="fe-nav-tab ${pageType === 'quiz' ? 'active' : ''}"
                   role="tab"
                   aria-selected="${pageType === 'quiz'}"
                   title="Kiểm tra 40 câu (Phím K)">
                  📝 Kiểm tra 40 câu
                </a>
              </div>
              <button class="fe-nav-btn fe-status-btn ${isDone ? 'done' : 'todo'}"
                      id="fe-status-toggle"
                      data-stt="${currentStt}"
                      title="Bấm để chuyển trạng thái hoàn thành">
                <span class="fe-status-dot"></span>
                <span class="fe-status-text">${isDone ? '✓ Đã xong' : '○ Chưa xong'}</span>
              </button>
            ` : `
              <div class="fe-nav-tagline">
                <span class="fe-tagline-main">Tài liệu ôn thi FE · 基本情報技術者試験</span>
                <span class="fe-tagline-sub">61 bài học lý thuyết & luyện đề chuẩn cấu trúc IPA</span>
              </div>
            `}
          </div>

          <!-- RIGHT: Navigation controls & theme toggle -->
          <div class="fe-nav-right">
            <select id="fe-lesson-select" class="fe-nav-select" aria-label="Chọn nhanh bài học">
              ${lessonOptions}
            </select>

            ${(pageType === 'theory' || pageType === 'quiz') ? `
              <button class="fe-nav-btn fe-btn-arrow"
                      id="fe-prev-btn"
                      ${prevStt ? `data-stt="${prevStt}"` : 'disabled'}
                      title="Bài trước (Phím ←)">
                <span class="fe-icon">←</span>
                <span class="fe-btn-text">Trước</span>
              </button>
              <button class="fe-nav-btn fe-btn-arrow"
                      id="fe-next-btn"
                      ${nextStt ? `data-stt="${nextStt}"` : 'disabled'}
                      title="Bài sau (Phím →)">
                <span class="fe-btn-text">Sau</span>
                <span class="fe-icon">→</span>
              </button>
            ` : ''}

            <button class="fe-nav-btn fe-theme-btn" id="fe-theme-toggle" aria-label="Đổi giao diện">
              <span class="fe-theme-icon">🌙</span>
            </button>
          </div>
        </div>
      `;
    },

    _bindEvents(currentStt, pageType, lessons) {
      // Prev button
      const prevBtn = document.getElementById('fe-prev-btn');
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          this.prevLesson();
        });
      }

      // Next button
      const nextBtn = document.getElementById('fe-next-btn');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.nextLesson();
        });
      }

      // Select jump
      const select = document.getElementById('fe-lesson-select');
      if (select) {
        select.addEventListener('change', (e) => {
          const val = parseInt(e.target.value, 10);
          if (val) {
            const targetType = (pageType === 'quiz') ? 'quiz' : 'theory';
            this.goTo(val, targetType);
          }
        });
      }

      // Status toggle button
      const statusBtn = document.getElementById('fe-status-toggle');
      if (statusBtn && currentStt) {
        statusBtn.addEventListener('click', () => {
          const curProg = FEProgress.get(currentStt);
          const nextStatus = (curProg.status === 'done') ? 'todo' : 'done';
          FEProgress.setStatus(currentStt, nextStatus);

          const isNowDone = (nextStatus === 'done');
          statusBtn.className = `fe-nav-btn fe-status-btn ${isNowDone ? 'done' : 'todo'}`;
          const textEl = statusBtn.querySelector('.fe-status-text');
          if (textEl) {
            textEl.textContent = isNowDone ? '✓ Đã xong' : '○ Chưa xong';
          }

          if (isNowDone) {
            FEToast.success(`Bài ${currentStt} → Đã hoàn thành!`);
          } else {
            FEToast.show(`Bài ${currentStt} → Đã chuyển về chưa hoàn thành`);
          }
        });
      }

      // Theme toggle button
      const themeBtn = document.getElementById('fe-theme-toggle');
      if (themeBtn) {
        themeBtn.addEventListener('click', () => {
          FETheme.toggle();
        });
      }
    },

    goTo(stt, type) {
      if (!stt) return;
      const basePath = this._getBasePath();
      const folder = (type === 'quiz') ? 'kiem-tra' : 'ly-thuyet';
      window.location.href = `${basePath}${folder}/${stt}.html`;
    },

    prevLesson() {
      if (!this._currentStt) return;
      const curNum = Number(this._currentStt);
      if (this._cachedLessons && this._cachedLessons.length > 0) {
        const idx = this._cachedLessons.findIndex(l => Number(l.stt) === curNum);
        if (idx > 0) {
          this.goTo(this._cachedLessons[idx - 1].stt, this._pageType);
          return;
        }
      }
      if (curNum > 1) {
        this.goTo(curNum - 1, this._pageType);
      }
    },

    nextLesson() {
      if (!this._currentStt) return;
      const curNum = Number(this._currentStt);
      if (this._cachedLessons && this._cachedLessons.length > 0) {
        const idx = this._cachedLessons.findIndex(l => Number(l.stt) === curNum);
        if (idx >= 0 && idx < this._cachedLessons.length - 1) {
          this.goTo(this._cachedLessons[idx + 1].stt, this._pageType);
          return;
        }
      }
      if (curNum < 61) {
        this.goTo(curNum + 1, this._pageType);
      }
    },

    _injectStyles() {
      if (document.getElementById('fe-common-injected-styles')) return;

      const style = document.createElement('style');
      style.id = 'fe-common-injected-styles';
      style.textContent = `
        /* Root & Theming Defaults */
        :root {
          --fe-accent: #ff6b35;
          --fe-accent-2: #4ecdc4;
          --fe-bg: #0f1419;
          --fe-bg-2: #161c24;
          --fe-bg-3: #1e2733;
          --fe-border: #2a3441;
          --fe-text: #e8eef5;
          --fe-text-dim: #a0adbb;
        }
        [data-theme="light"] {
          --fe-bg: #f7f8fc;
          --fe-bg-2: #ffffff;
          --fe-bg-3: #f0f2fa;
          --fe-border: #e4e6f0;
          --fe-text: #111827;
          --fe-text-dim: #6b7280;
          --bg: #f7f8fc !important;
          --bg-2: #ffffff !important;
          --bg-3: #f0f2fa !important;
          --border: #e4e6f0 !important;
          --text: #111827 !important;
          --text-dim: #6b7280 !important;
        }

        /* Top Navigation Header */
        .fe-top-nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          background: var(--bg-2, var(--fe-bg-2));
          border-bottom: 1px solid var(--border, var(--fe-border));
          box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 4px 14px rgba(0,0,0,0.06);
          font-family: var(--font-jp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
          color: var(--text, var(--fe-text));
          transition: background .2s ease, border-color .2s ease;
        }
        @supports (backdrop-filter: blur(12px)) or (-webkit-backdrop-filter: blur(12px)) {
          .fe-top-nav {
            background: rgba(22, 28, 36, 0.92);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
          }
          [data-theme="light"] .fe-top-nav {
            background: rgba(255, 255, 255, 0.94);
          }
        }

        .fe-nav-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: 52px;
        }

        /* Left side */
        .fe-nav-left {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .fe-nav-brand {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          color: inherit;
          font-weight: 700;
        }
        .fe-brand-badge {
          background: var(--accent, var(--fe-accent));
          color: #ffffff;
          font-family: var(--font-mono, "Space Mono", monospace);
          font-size: 11px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: .05em;
        }
        .fe-brand-text {
          font-family: var(--font-display, "Syne", sans-serif);
          font-size: 15px;
          letter-spacing: -.01em;
          white-space: nowrap;
        }

        /* Center */
        .fe-nav-center {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          overflow: hidden;
        }
        .fe-nav-lesson-badge {
          font-family: var(--font-mono, "Space Mono", monospace);
          font-size: 11.5px;
          font-weight: 700;
          color: var(--accent-2, var(--fe-accent-2));
          background: rgba(78, 205, 196, 0.12);
          border: 1px solid rgba(78, 205, 196, 0.3);
          padding: 3px 8px;
          border-radius: 6px;
          flex-shrink: 0;
          white-space: nowrap;
        }
        .fe-nav-topic {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text, var(--fe-text));
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 280px;
        }
        .fe-nav-tagline {
          display: flex;
          flex-direction: column;
        }
        .fe-tagline-main {
          font-size: 13.5px;
          font-weight: 600;
        }
        .fe-tagline-sub {
          font-size: 11.5px;
          color: var(--text-dim, var(--fe-text-dim));
        }

        /* Tabs */
        .fe-nav-tabs {
          display: inline-flex;
          align-items: center;
          background: var(--bg-3, var(--fe-bg-3));
          border: 1px solid var(--border, var(--fe-border));
          border-radius: 8px;
          padding: 2px;
          gap: 2px;
          flex-shrink: 0;
        }
        .fe-nav-tab {
          text-decoration: none;
          padding: 5px 11px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 6px;
          color: var(--text-dim, var(--fe-text-dim));
          transition: all .15s ease;
          white-space: nowrap;
        }
        .fe-nav-tab:hover {
          color: var(--text, var(--fe-text));
        }
        .fe-nav-tab.active {
          background: var(--accent, var(--fe-accent));
          color: #ffffff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }

        /* Buttons & Actions */
        .fe-nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .fe-nav-btn {
          font: inherit;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          font-size: 12.5px;
          font-weight: 600;
          padding: 6px 11px;
          border-radius: 8px;
          border: 1px solid var(--border, var(--fe-border));
          background: var(--bg-3, var(--fe-bg-3));
          color: var(--text, var(--fe-text));
          cursor: pointer;
          text-decoration: none;
          transition: all .15s ease;
          white-space: nowrap;
        }
        .fe-nav-btn:hover:not([disabled]) {
          border-color: var(--accent, var(--fe-accent));
          color: var(--accent, var(--fe-accent));
          transform: translateY(-1px);
        }
        .fe-nav-btn[disabled] {
          opacity: 0.35;
          cursor: not-allowed;
          pointer-events: none;
        }
        .fe-status-btn {
          border-radius: 99px;
          font-family: var(--font-mono, "Space Mono", monospace);
          font-size: 11.5px;
          padding: 4px 10px;
        }
        .fe-status-btn.done {
          background: rgba(16, 185, 129, 0.14);
          border-color: rgba(16, 185, 129, 0.35);
          color: #10b981;
        }
        .fe-status-btn.done:hover {
          background: rgba(16, 185, 129, 0.22);
          border-color: #10b981;
          color: #10b981;
        }
        .fe-status-btn.todo {
          background: var(--bg-3, var(--fe-bg-3));
          border-color: var(--border, var(--fe-border));
          color: var(--text-dim, var(--fe-text-dim));
        }
        .fe-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }

        /* Select Dropdown */
        .fe-nav-select {
          font: inherit;
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid var(--border, var(--fe-border));
          background: var(--bg-3, var(--fe-bg-3));
          color: var(--text, var(--fe-text));
          max-width: 170px;
          cursor: pointer;
          outline: none;
          transition: border-color .15s ease;
        }
        .fe-nav-select:focus {
          border-color: var(--accent, var(--fe-accent));
        }

        /* Toast */
        .fe-toast {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          background: rgba(15, 20, 25, 0.95);
          color: #ffffff;
          border: 1px solid var(--accent, var(--fe-accent));
          padding: 10px 22px;
          border-radius: 99px;
          font-family: var(--font-jp, -apple-system, BlinkMacSystemFont, sans-serif);
          font-size: 13.5px;
          font-weight: 500;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
          opacity: 0;
          visibility: hidden;
          transition: opacity .25s ease, transform .25s ease, visibility .25s;
          pointer-events: none;
          z-index: 10000;
          white-space: nowrap;
        }
        .fe-toast.show {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }
        [data-theme="light"] .fe-toast {
          background: rgba(17, 24, 39, 0.95);
          color: #ffffff;
        }

        /* Scroll-to-top button */
        .fe-scroll-top {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: var(--bg-3, var(--fe-bg-3));
          color: var(--accent, var(--fe-accent));
          border: 1px solid var(--border, var(--fe-border));
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transform: translateY(12px);
          transition: opacity .25s ease, transform .25s ease, visibility .25s, background .15s, border-color .15s;
          z-index: 990;
        }
        .fe-scroll-top.visible {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .fe-scroll-top:hover {
          background: var(--accent, var(--fe-accent));
          color: #ffffff;
          border-color: var(--accent, var(--fe-accent));
          transform: translateY(-2px);
        }

        /* Responsive */
        @media (max-width: 960px) {
          .fe-nav-topic {
            display: none;
          }
          .fe-tagline-sub {
            display: none;
          }
        }
        @media (max-width: 768px) {
          .fe-nav-container {
            flex-wrap: wrap;
            padding: 8px 12px;
            gap: 8px;
          }
          .fe-nav-center {
            order: 3;
            width: 100%;
            justify-content: space-between;
          }
          .fe-nav-select {
            max-width: 110px;
          }
          .fe-btn-text {
            display: none;
          }
        }
      `;
      document.head.appendChild(style);
    }
  };


  /* ==========================================================================
     3. Toast Notification System (FEToast)
     ========================================================================== */
  const FEToast = {
    _timeout: null,
    _el: null,

    _getOrCreate() {
      let el = document.getElementById('fe-toast');
      if (!el) {
        // Check if page already had an existing toast element
        el = document.getElementById('toast');
        if (!el) {
          el = document.createElement('div');
          el.id = 'fe-toast';
          el.className = 'fe-toast';
          el.setAttribute('role', 'status');
          el.setAttribute('aria-live', 'polite');
          document.body.appendChild(el);
        }
      }
      this._el = el;
      return el;
    },

    show(message, duration = 2500) {
      const el = this._getOrCreate();
      el.textContent = message;
      el.classList.add('show');

      if (this._timeout) {
        clearTimeout(this._timeout);
      }
      this._timeout = setTimeout(() => {
        el.classList.remove('show');
      }, duration);
    },

    success(message) {
      this.show('✓ ' + message);
    },

    error(message) {
      this.show('✕ ' + message);
    },

    info(message) {
      this.show('ℹ ' + message);
    }
  };


  /* ==========================================================================
     4. Keyboard Shortcuts (FEKeyboard)
     ========================================================================== */
  const FEKeyboard = {
    init() {
      document.addEventListener('keydown', (e) => {
        // Ignore typing in input fields
        const tag = (e.target.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) {
          if (e.key === 'Escape') {
            e.target.blur();
          }
          return;
        }

        // Avoid overriding standard browser keybindings (Ctrl+T, Ctrl+H, Alt+Left, etc.)
        if (e.ctrlKey || e.altKey || e.metaKey) {
          return;
        }

        switch (e.key) {
          case 'Escape': {
            // Close any modal or reading pane
            const pane = document.getElementById('pane') || document.querySelector('.pane.open');
            if (pane) {
              if (typeof window.closePane === 'function') {
                window.closePane();
              } else {
                pane.classList.remove('open');
                document.body.style.overflow = '';
              }
            }
            break;
          }

          case 'ArrowLeft': {
            // Previous lesson if on lesson or quiz page
            if (FENav._currentStt) {
              e.preventDefault();
              FENav.prevLesson();
            }
            break;
          }

          case 'ArrowRight': {
            // Next lesson
            if (FENav._currentStt) {
              e.preventDefault();
              FENav.nextLesson();
            }
            break;
          }

          case 'h':
          case 'H': {
            // Go to home / index
            e.preventDefault();
            window.location.href = FENav._getBasePath() + 'index.html';
            break;
          }

          case 't':
          case 'T': {
            // Switch to theory tab (on index page pane or navigate on quiz page)
            e.preventDefault();
            const tabTheory = document.getElementById('tabTheory');
            if (tabTheory && tabTheory.offsetParent !== null) {
              tabTheory.click();
            } else if (FENav._currentStt && FENav._pageType !== 'theory') {
              FENav.goTo(FENav._currentStt, 'theory');
            }
            break;
          }

          case 'k':
          case 'K': {
            // Switch to quiz tab (on index page pane or navigate on theory page)
            e.preventDefault();
            const tabTest = document.getElementById('tabTest');
            if (tabTest && tabTest.offsetParent !== null) {
              tabTest.click();
            } else if (FENav._currentStt && FENav._pageType !== 'quiz') {
              FENav.goTo(FENav._currentStt, 'quiz');
            }
            break;
          }

          case '?': {
            // Show shortcut hints
            e.preventDefault();
            FEToast.info('Phím tắt: ←/→ (Trước/Sau), T (Lý thuyết), K (Kiểm tra), H (Trang chủ), Esc (Đóng)');
            break;
          }
        }
      });
    }
  };


  /* ==========================================================================
     5. Scroll-To-Top Button (FEScroll)
     ========================================================================== */
  const FEScroll = {
    _btn: null,

    init() {
      let btn = document.getElementById('fe-scroll-top');
      if (!btn) {
        btn = document.createElement('button');
        btn.id = 'fe-scroll-top';
        btn.className = 'fe-scroll-top';
        btn.setAttribute('aria-label', 'Lên đầu trang');
        btn.setAttribute('title', 'Lên đầu trang');
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`;
        document.body.appendChild(btn);
      }
      this._btn = btn;

      btn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });

      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            if (window.scrollY > 300) {
              btn.classList.add('visible');
            } else {
              btn.classList.remove('visible');
            }
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }
  };


  /* ==========================================================================
     6. Universal Quiz Result Tracker (FEQuizTracker)
     ========================================================================== */
  const FEQuizTracker = {
    _lastSaved: null,

    init(currentStt, pageType) {
      if (!currentStt || (pageType !== 'theory' && pageType !== 'quiz')) return;

      const self = this;
      const stt = currentStt;
      const quizType = pageType === 'quiz' ? 'exam' : 'theory-quiz';

      // 1. Intercept known result functions
      const fnNames = ['showResult', 'renderResult', 'showResults'];
      fnNames.forEach(fnName => {
        if (typeof global[fnName] === 'function') {
          const original = global[fnName];
          global[fnName] = function (...args) {
            const ret = original.apply(this, args);
            setTimeout(() => self._tryExtractAndSave(stt, quizType), 150);
            return ret;
          };
        }
      });

      // 2. Fallback: MutationObserver on results containers
      const observer = new MutationObserver(() => {
        self._tryExtractAndSave(stt, quizType);
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['class', 'style']
      });

      // 3. Click listener on submit buttons
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('button, .btn');
        if (!btn) return;
        const text = (btn.textContent || '').toLowerCase();
        if (text.includes('nộp bài') || text.includes('xem kết quả') || text.includes('kết quả') || text.includes('submit')) {
          setTimeout(() => self._tryExtractAndSave(stt, quizType), 300);
        }
      });
    },

    _tryExtractAndSave(stt, quizType) {
      // Look for result containers
      const resultContainers = document.querySelectorAll(
        '#result-screen, #result, #quiz-result, .card.result, [id*="result"]'
      );

      let isVisible = false;
      for (const rc of resultContainers) {
        if (!rc) continue;
        const style = window.getComputedStyle(rc);
        if (style.display !== 'none' && style.visibility !== 'hidden' && !rc.classList.contains('hidden')) {
          isVisible = true;
          break;
        }
      }

      if (!isVisible) return;

      // Find score element
      const scoreEls = document.querySelectorAll(
        '.score-big, .score, #resScore, #qScore, .score-pct, .breakdown'
      );

      for (const el of scoreEls) {
        const text = el.textContent || '';
        // Look for pattern "X / Y" or "X/Y"
        const m = text.match(/(\d+)\s*\/\s*(\d+)/);
        if (m) {
          const score = parseInt(m[1], 10);
          const total = parseInt(m[2], 10);
          if (total > 0 && score <= total) {
            const key = `${stt}-${score}-${total}`;
            if (this._lastSaved === key) return; // already saved
            this._lastSaved = key;

            const pct = Math.round((score / total) * 100);
            FEProgress.saveQuizResult(stt, score, total, quizType);

            // Auto-mark as done if score is passing (>= 60%)
            if (pct >= 60) {
              FEProgress.setStatus(stt, 'done');
              // Update navbar status toggle button if present
              const navBtn = document.getElementById('fe-status-toggle');
              if (navBtn) {
                navBtn.className = 'fe-nav-btn fe-status-btn done';
                const txt = navBtn.querySelector('.fe-status-text');
                if (txt) txt.textContent = '✓ Đã xong';
              }
            }

            FEToast.success(`Đã lưu kết quả: ${score}/${total} (${pct}%)`);
            console.log(`[FEQuizTracker] Successfully recorded: STT ${stt}, ${score}/${total} (${pct}%)`);
            return;
          }
        }
      }
    }
  };


  /* ==========================================================================
     7. Auto-initialization
     ========================================================================== */
  function boot() {
    // Detect page type from URL
    const path = (window.location.pathname || '').replace(/\\/g, '/');
    let pageType = 'index';
    let currentStt = null;

    if (path.includes('/ly-thuyet/')) {
      pageType = 'theory';
      const match = path.match(/(\d+)\.html/);
      currentStt = match ? parseInt(match[1], 10) : null;
    } else if (path.includes('/kiem-tra/')) {
      pageType = 'quiz';
      const match = path.match(/(\d+)\.html/);
      currentStt = match ? parseInt(match[1], 10) : null;
    }

    // Initialize Theme
    FETheme.init();

    // Initialize components
    FENav.init(currentStt, pageType);
    FEKeyboard.init();
    FEScroll.init();
    FEQuizTracker.init(currentStt, pageType);

    // Mark lesson as studied if on lesson/quiz page
    if (currentStt) {
      FEProgress.markStudied(currentStt);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Export to window for global access across scripts
  global.FEProgress = FEProgress;
  global.FENav = FENav;
  global.FEToast = FEToast;
  global.FEKeyboard = FEKeyboard;
  global.FEScroll = FEScroll;
  global.FETheme = FETheme;
  global.FEQuizTracker = FEQuizTracker;

})(typeof window !== 'undefined' ? window : this);
