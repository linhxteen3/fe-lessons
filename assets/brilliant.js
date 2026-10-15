/**
 * Brilliant.org Interactivity & Streak Engine for FE Lessons
 */

window.Brilliant = {
  // SVG Icon of the Brilliant Emerald Gem Mascot
  mascotSvg: `
    <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gemGrad" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#4ADE80"/>
          <stop offset="50%" stop-color="#22C55E"/>
          <stop offset="100%" stop-color="#16A34A"/>
        </linearGradient>
        <filter id="gemShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#15803D" flood-opacity="0.25"/>
        </filter>
      </defs>
      <rect x="18" y="18" width="64" height="64" rx="20" transform="rotate(45 50 50)" fill="url(#gemGrad)" filter="url(#gemShadow)"/>
      <!-- Inner eye/sensor -->
      <rect x="36" y="36" width="28" height="28" rx="8" fill="#FFFFFF"/>
      <rect x="42" y="42" width="16" height="16" rx="4" fill="#0F172A"/>
      <circle cx="47" cy="47" r="3" fill="#38BDF8"/>
    </svg>
  `,

  // Streak logic (Daily study streak calculation)
  getStreak() {
    try {
      const data = JSON.parse(localStorage.getItem('fe-lessons:v1:streak')) || { lastDate: '', count: 1 };
      const today = new Date().toISOString().slice(0, 10);
      
      if (!data.lastDate) {
        data.lastDate = today;
        data.count = 1;
        localStorage.setItem('fe-lessons:v1:streak', JSON.stringify(data));
        return data.count;
      }

      if (data.lastDate === today) {
        return data.count;
      }

      const last = new Date(data.lastDate);
      const now = new Date(today);
      const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        data.count += 1;
      } else if (diffDays > 1) {
        data.count = 1; // Streak reset if a day was skipped
      }
      data.lastDate = today;
      localStorage.setItem('fe-lessons:v1:streak', JSON.stringify(data));
      return data.count;
    } catch {
      return 1;
    }
  },

  // Setup reading scroll progress bar
  initReadingProgressBar() {
    let track = document.querySelector('.br-progress-track');
    if (!track) {
      track = document.createElement('div');
      track.className = 'br-progress-track';
      track.innerHTML = '<div class="br-progress-bar" id="brReadingBar"></div>';
      document.body.prepend(track);
    }

    const bar = document.getElementById('brReadingBar') || track.querySelector('.br-progress-bar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      bar.style.width = progress + '%';
    }, { passive: true });
  },

  // Helper to create a Robot Tutor bubble
  createTutor(message, title = 'Gia sư Robot') {
    const tutor = document.createElement('div');
    tutor.className = 'br-tutor';
    tutor.innerHTML = `
      <div class="br-tutor-mascot">${this.mascotSvg}</div>
      <div class="br-tutor-bubble">
        <div class="br-tutor-title">⚡ ${title}</div>
        <div>${message}</div>
      </div>
    `;
    return tutor;
  },

  // Initialize page decorations
  init() {
    const streak = this.getStreak();
    document.querySelectorAll('.br-streak-val, #streakCount, #streakVal').forEach(el => {
      el.textContent = streak;
    });

    // Auto-inject Reading progress on theory pages
    if (location.pathname.includes('ly-thuyet')) {
      this.initReadingProgressBar();

      // If page doesn't already have a tutor, inject one at top of first section
      const firstPart = document.querySelector('.part, section');
      if (firstPart && !document.querySelector('.br-tutor')) {
        const welcome = this.createTutor(
          'Chào bạn! Hãy học từng bước nhỏ (Bite-sized), ghi nhớ từ khoá tiếng Nhật và làm thử bài tập ngay bên dưới để hiểu sâu bản chất nhé!',
          'Gia sư FE'
        );
        firstPart.prepend(welcome);
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Brilliant.init();
});
