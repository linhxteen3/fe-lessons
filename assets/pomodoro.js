/**
 * Pomodoro Study Timer Widget - Corodomo Focus Room Style
 * Supports 25m focus / 5m break cycle with wall-clock drift prevention,
 * horizontal glowing progress bar, localStorage cross-tab synchronization,
 * sleek minimize toggle, and custom event dispatches.
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'fe-lessons:v1:pomodoro';
  const DEFAULT_STUDY_DURATION = 25 * 60; // 1500 seconds (25 minutes)
  const DEFAULT_BREAK_DURATION = 5 * 60;  // 300 seconds (5 minutes)

  let studyDuration = DEFAULT_STUDY_DURATION;
  let breakDuration = DEFAULT_BREAK_DURATION;

  // Internal state
  let state = {
    mode: 'study',          // 'study' | 'break'
    status: 'idle',         // 'idle' | 'running' | 'paused'
    remaining: studyDuration,
    targetEndTime: null,
    isMinimized: false,
    lastUpdated: Date.now()
  };

  let tickTimer = null;
  let storageHandler = null;
  let audioCtx = null;
  let floatingElement = null;
  const mountedContainers = new Set();

  function getDuration(mode) {
    return mode === 'break' ? breakDuration : studyDuration;
  }

  function readStorage() {
    try {
      if (typeof localStorage === 'undefined') return null;
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeStorage() {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, minimized: state.isMinimized }));
    } catch (e) {
      // Ignore quota or disabled storage errors
    }
  }

  function emit(eventName, detail) {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent(eventName, { detail }));
    }
  }

  function playChime() {
    try {
      const AudioContextClass = global.AudioContext || global.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtx) audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }

      const now = audioCtx.currentTime;
      // Gentle chime: C5 (523.25Hz) -> E5 (659.25Hz)
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch (e) {
      // Audio playback is optional; fail gracefully
    }
  }

  function formatTime(seconds) {
    const s = Math.max(0, Math.floor(seconds));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${String(m).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  }

  function updateStateFromWallClock() {
    if (state.status !== 'running' || !state.targetEndTime) return;
    const now = Date.now();
    const diff = Math.ceil((state.targetEndTime - now) / 1000);
    state.remaining = Math.max(0, diff);
    state.lastUpdated = now;

    if (state.remaining <= 0) {
      handlePhaseTransition();
    }
  }

  function handlePhaseTransition() {
    playChime();
    if (state.mode === 'study') {
      // Transition from study to break
      state.mode = 'break';
      state.remaining = breakDuration;
      state.targetEndTime = Date.now() + breakDuration * 1000;
      state.status = 'running';
      state.lastUpdated = Date.now();
      writeStorage();
      emit('fe-pomodoro-break', { mode: 'break', duration: breakDuration });
    } else {
      // Transition from break to study
      state.mode = 'study';
      state.remaining = studyDuration;
      state.targetEndTime = null;
      state.status = 'idle';
      state.lastUpdated = Date.now();
      stopTickLoop();
      writeStorage();
      emit('fe-pomodoro-study', { mode: 'study', duration: studyDuration });
    }
    renderAll();
  }

  function calcProgress(remaining, duration) {
    if (!duration || duration <= 0) return 0;
    return Math.min(100, Math.max(0, Math.round(((duration - remaining) / duration) * 100)));
  }

  function startTickLoop() {
    if (tickTimer) return;
    tickTimer = setInterval(() => {
      if (state.status === 'running') {
        updateStateFromWallClock();
        const duration = getDuration(state.mode);
        emit('fe-pomodoro-tick', {
          mode: state.mode,
          remaining: state.remaining,
          duration,
          progress: calcProgress(state.remaining, duration)
        });
        renderAll();
      }
    }, 1000);
  }

  function stopTickLoop() {
    if (tickTimer) {
      clearInterval(tickTimer);
      tickTimer = null;
    }
  }

  function start() {
    if (state.status === 'running') return;
    const duration = getDuration(state.mode);
    if (state.remaining <= 0 || state.status === 'idle') {
      state.remaining = duration;
    }
    state.status = 'running';
    state.targetEndTime = Date.now() + state.remaining * 1000;
    state.lastUpdated = Date.now();
    writeStorage();
    startTickLoop();
    renderAll();
    emit('fe-pomodoro-tick', {
      mode: state.mode,
      remaining: state.remaining,
      duration,
      progress: calcProgress(state.remaining, duration)
    });
  }

  function pause() {
    if (state.status !== 'running') return;
    updateStateFromWallClock();
    if (state.status !== 'running') return;
    state.status = 'paused';
    state.targetEndTime = null;
    state.lastUpdated = Date.now();
    stopTickLoop();
    writeStorage();
    renderAll();
  }

  function reset() {
    stopTickLoop();
    state.mode = 'study';
    state.status = 'idle';
    state.remaining = studyDuration;
    state.targetEndTime = null;
    state.lastUpdated = Date.now();
    writeStorage();
    renderAll();
    emit('fe-pomodoro-reset', {
      mode: state.mode,
      remaining: state.remaining,
      duration: studyDuration
    });
  }

  function toggle() {
    if (state.status === 'running') {
      pause();
    } else {
      start();
    }
  }

  function setMode(mode) {
    if (mode !== 'study' && mode !== 'break') return;
    if (state.mode === mode && state.status !== 'idle') return;
    stopTickLoop();
    state.mode = mode;
    state.status = 'idle';
    state.remaining = getDuration(mode);
    state.targetEndTime = null;
    state.lastUpdated = Date.now();
    writeStorage();
    renderAll();
  }

  function toggleMinimize() {
    state.isMinimized = !state.isMinimized;
    writeStorage();
    renderAll();
  }

  function syncFromStorage() {
    const saved = readStorage();
    if (!saved) return;

    const prevMode = state.mode;
    state.mode = saved.mode === 'break' ? 'break' : 'study';
    state.status = ['idle', 'running', 'paused'].includes(saved.status) ? saved.status : 'idle';
    state.remaining = Math.max(0, typeof saved.remaining === 'number' && !isNaN(saved.remaining) ? saved.remaining : getDuration(state.mode));
    state.targetEndTime = typeof saved.targetEndTime === 'number' && !isNaN(saved.targetEndTime) ? saved.targetEndTime : null;
    const isMin = typeof saved.minimized === 'boolean' ? saved.minimized : saved.isMinimized;
    if (typeof isMin === 'boolean') {
      state.isMinimized = isMin;
    }
    state.lastUpdated = saved.lastUpdated || Date.now();

    const syncedMode = state.mode;
    if (state.status === 'running') {
      if (state.targetEndTime) {
        updateStateFromWallClock();
        if (state.status === 'running') {
          startTickLoop();
        }
      } else {
        state.status = 'paused';
        stopTickLoop();
      }
    } else {
      stopTickLoop();
    }
    renderAll();

    if (state.mode === syncedMode) {
      if (prevMode === 'study' && state.mode === 'break') {
        emit('fe-pomodoro-break', { mode: 'break', duration: getDuration('break') });
      } else if (prevMode === 'break' && state.mode === 'study') {
        emit('fe-pomodoro-study', { mode: 'study', duration: getDuration('study') });
      }
    }
  }

  // Icons
  const PLAY_SVG = '<svg viewBox="0 0 24 24"><polygon points="7,5 19,12 7,19"></polygon></svg>';
  const PAUSE_SVG = '<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1"></rect><rect x="14" y="5" width="4" height="14" rx="1"></rect></svg>';
  const RESET_SVG = '<svg viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path></svg>';
  const MINIMIZE_SVG = '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" fill="none"><line x1="5" y1="12" x2="19" y2="12"></line></svg>';

  function renderWidget(container) {
    if (!container) return;
    const isRunning = state.status === 'running';
    const isBreak = state.mode === 'break';
    const totalDuration = getDuration(state.mode);
    const progressPercent = Math.min(100, Math.max(0, Math.round(((totalDuration - state.remaining) / totalDuration) * 100)));
    const timeFormatted = formatTime(state.remaining);
    const modeBadgeText = isBreak ? '5 Min Break' : '25 Min Study';
    const modeSubtext = isBreak ? 'Nghỉ giải lao' : 'Thời gian tập trung';

    if (state.isMinimized) {
      // Minimized pill view
      container.innerHTML = `
        <div class="coro-pill mode-${state.mode}" id="pomodoroWidget" role="timer" aria-live="polite" aria-label="Đồng hồ Pomodoro: ${timeFormatted} (${modeSubtext})" title="Bấm để mở rộng đồng hồ">
          <span class="coro-pill-dot" aria-hidden="true"></span>
          <span class="coro-pill-digits">${timeFormatted}</span>
          <button class="coro-pill-action" type="button" aria-label="${isRunning ? 'Tạm dừng' : 'Bắt đầu'}" title="${isRunning ? 'Tạm dừng' : 'Bắt đầu'}">
            ${isRunning ? PAUSE_SVG : PLAY_SVG}
          </button>
        </div>
      `;

      const pill = container.querySelector('.coro-pill');
      if (pill) {
        pill.onclick = () => toggleMinimize();
      }
      const pillAction = container.querySelector('.coro-pill-action');
      if (pillAction) {
        pillAction.onclick = (e) => {
          e.stopPropagation();
          toggle();
        };
      }
      return;
    }

    // Expanded Frosted Card View (Corodomo Focus Room)
    container.innerHTML = `
      <div class="coro-card mode-${state.mode}" id="pomodoroWidget" role="timer" aria-live="polite" aria-label="Đồng hồ Pomodoro: ${timeFormatted}">
        <div class="coro-header">
          <div class="coro-mode-tabs" role="tablist">
            <button class="coro-mode-btn tab-study ${!isBreak ? 'active' : ''}" type="button" role="tab" aria-selected="${!isBreak}">25 Min Study</button>
            <button class="coro-mode-btn tab-break ${isBreak ? 'active' : ''}" type="button" role="tab" aria-selected="${isBreak}">5 Min Break</button>
          </div>
          <button class="coro-btn-minimize" type="button" aria-label="Thu nhỏ đồng hồ" title="Thu nhỏ">
            ${MINIMIZE_SVG}
          </button>
        </div>
        <div class="coro-progress-track" aria-hidden="true">
          <div class="coro-progress-bar" style="width: ${progressPercent}%;"></div>
        </div>
        <div class="coro-body">
          <div class="coro-time">${timeFormatted}</div>
          <div class="coro-mode-label">${modeSubtext}</div>
        </div>
        <div class="coro-controls">
          <button class="coro-sub-btn coro-btn-reset" type="button" aria-label="Đặt lại đếm giờ" title="Đặt lại">
            ${RESET_SVG}
          </button>
          <button class="coro-play-btn" type="button" aria-label="${isRunning ? 'Tạm dừng' : 'Bắt đầu'}" title="${isRunning ? 'Tạm dừng' : 'Bắt đầu'}">
            ${isRunning ? PAUSE_SVG : PLAY_SVG}
          </button>
        </div>
      </div>
    `;

    // Bind card events
    const tabStudy = container.querySelector('.tab-study');
    if (tabStudy) tabStudy.onclick = () => setMode('study');

    const tabBreak = container.querySelector('.tab-break');
    if (tabBreak) tabBreak.onclick = () => setMode('break');

    const btnMin = container.querySelector('.coro-btn-minimize');
    if (btnMin) btnMin.onclick = () => toggleMinimize();

    const playBtn = container.querySelector('.coro-play-btn');
    if (playBtn) playBtn.onclick = () => toggle();

    const resetBtn = container.querySelector('.coro-btn-reset');
    if (resetBtn) resetBtn.onclick = () => reset();
  }

  function syncDialogPosition() {
    if (typeof document === 'undefined' || !floatingElement) return;
    const pane = typeof document.getElementById === 'function' ? document.getElementById('pane') : null;
    if (!pane || typeof pane.contains !== 'function') return;
    if (pane.open && !pane.contains(floatingElement)) {
      pane.appendChild(floatingElement);
    } else if (!pane.open && pane.contains(floatingElement)) {
      document.body.appendChild(floatingElement);
    }
  }

  function renderAll() {
    if (floatingElement) {
      syncDialogPosition();
      renderWidget(floatingElement);
    }
    mountedContainers.forEach(container => {
      renderWidget(container);
    });
  }

  function mount(target) {
    const el = typeof target === 'string' ? (typeof document !== 'undefined' ? document.querySelector(target) : null) : target;
    if (!el) return;
    mountedContainers.add(el);
    renderWidget(el);
  }

  function unmount(target) {
    const el = typeof target === 'string' ? (typeof document !== 'undefined' ? document.querySelector(target) : null) : target;
    if (el) {
      mountedContainers.delete(el);
      el.innerHTML = '';
    }
  }

  function mountFloating() {
    if (typeof document === 'undefined') return;
    if (floatingElement && document.body.contains(floatingElement)) {
      renderWidget(floatingElement);
      return;
    }
    let container = document.getElementById('pomodoroFloating');
    if (!container) {
      container = document.createElement('div');
      container.id = 'pomodoroFloating';
      container.className = 'pomodoro-floating-container';
      document.body.appendChild(container);
    }
    floatingElement = container;
    renderWidget(floatingElement);
    handleDialogSync();
  }

  function handleDialogSync() {
    if (typeof document === 'undefined') return;
    const pane = typeof document.getElementById === 'function' ? document.getElementById('pane') : null;
    if (!pane) return;
    syncDialogPosition();
    if (pane._pomoObserved) return;
    pane._pomoObserved = true;

    const observer = new MutationObserver(() => {
      syncDialogPosition();
    });
    observer.observe(pane, { attributes: true, attributeFilter: ['open'] });
  }

  function init(options) {
    if (options) {
      if (typeof options.studyDuration === 'number') studyDuration = options.studyDuration;
      if (typeof options.breakDuration === 'number') breakDuration = options.breakDuration;
      if (options.mount) {
        if (Array.isArray(options.mount)) {
          options.mount.forEach(m => mount(m));
        } else {
          mount(options.mount);
        }
      }
    }

    // Attempt to hydrate from storage
    const saved = readStorage();
    if (saved) {
      syncFromStorage();
    } else {
      state.remaining = studyDuration;
      renderAll();
    }

    if (typeof window !== 'undefined' && !storageHandler) {
      storageHandler = (e) => {
        if (e.key === STORAGE_KEY) {
          syncFromStorage();
        }
      };
      window.addEventListener('storage', storageHandler);
    }

    // Mount floating UI by default if in browser and not explicitly disabled
    if (typeof document !== 'undefined' && (!options || options.floating !== false)) {
      mountFloating();
    }

    return PomodoroTimer;
  }

  function getState() {
    return { ...state };
  }

  function setCustomDurations(studySec, breakSec) {
    studyDuration = studySec;
    breakDuration = breakSec;
    if (state.status === 'idle') {
      state.remaining = getDuration(state.mode);
      renderAll();
    }
  }

  function destroy() {
    stopTickLoop();
    if (typeof window !== 'undefined' && storageHandler) {
      window.removeEventListener('storage', storageHandler);
      storageHandler = null;
    }
    studyDuration = DEFAULT_STUDY_DURATION;
    breakDuration = DEFAULT_BREAK_DURATION;
    mountedContainers.clear();
    if (floatingElement && floatingElement.parentElement) {
      floatingElement.parentElement.removeChild(floatingElement);
      floatingElement = null;
    }
    state = {
      mode: 'study',
      status: 'idle',
      remaining: studyDuration,
      targetEndTime: null,
      isMinimized: false,
      lastUpdated: Date.now()
    };
  }

  const PomodoroTimer = {
    init,
    start,
    pause,
    reset,
    toggle,
    setMode,
    toggleMinimize,
    mount,
    unmount,
    mountFloating,
    getState,
    formatTime,
    setCustomDurations,
    syncFromStorage,
    destroy
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PomodoroTimer;
  }

  global.PomodoroTimer = PomodoroTimer;

  // Auto-init when document is ready in browser
  if (typeof document !== 'undefined') {
    const autoInit = () => {
      const slots = [...document.querySelectorAll('#pomodoroHeader, #pomodoroPane, .pomodoro-slot')];
      init(slots.length ? { mount: slots } : undefined);
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', autoInit);
    } else {
      autoInit();
      if (typeof document.addEventListener === 'function') {
        document.addEventListener('DOMContentLoaded', handleDialogSync);
      }
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
