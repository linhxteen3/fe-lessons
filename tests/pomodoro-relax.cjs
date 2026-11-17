const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Mock localStorage and window for headless node testing
const storageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

global.localStorage = storageMock;
global.window = {
  dispatchEvent: (event) => {
    if (global.window._listeners && global.window._listeners[event.type]) {
      global.window._listeners[event.type].forEach(fn => fn(event));
    }
    return true;
  },
  addEventListener: (type, fn) => {
    global.window._listeners = global.window._listeners || {};
    global.window._listeners[type] = global.window._listeners[type] || [];
    global.window._listeners[type].push(fn);
  },
  removeEventListener: (type, fn) => {
    if (global.window._listeners && global.window._listeners[type]) {
      global.window._listeners[type] = global.window._listeners[type].filter(cb => cb !== fn);
    }
  }
};

global.CustomEvent = class CustomEvent {
  constructor(type, params = {}) {
    this.type = type;
    this.detail = params.detail || null;
  }
};

const PomodoroTimer = require('../assets/pomodoro.js');

test('Pomodoro Timer: Initial state and time formatting', () => {
  storageMock.clear();
  PomodoroTimer.destroy();
  PomodoroTimer.init({ floating: false });

  const state = PomodoroTimer.getState();
  assert.equal(state.mode, 'study', 'Initial mode should be study');
  assert.equal(state.status, 'idle', 'Initial status should be idle');
  assert.equal(state.remaining, 1500, 'Initial remaining should be 1500s (25 minutes)');
  assert.equal(state.targetEndTime, null, 'Initial targetEndTime should be null');

  assert.equal(PomodoroTimer.formatTime(1500), '25:00');
  assert.equal(PomodoroTimer.formatTime(300), '05:00');
  assert.equal(PomodoroTimer.formatTime(65), '01:05');
  assert.equal(PomodoroTimer.formatTime(9), '00:09');
  assert.equal(PomodoroTimer.formatTime(0), '00:00');
});

test('Pomodoro Timer: Controls (start, pause, toggle, reset)', () => {
  storageMock.clear();
  PomodoroTimer.destroy();
  PomodoroTimer.init({ floating: false });

  // Start
  PomodoroTimer.start();
  let state = PomodoroTimer.getState();
  assert.equal(state.status, 'running', 'Status should be running after start');
  assert.ok(state.targetEndTime > Date.now(), 'targetEndTime should be in the future');

  // Pause
  PomodoroTimer.pause();
  state = PomodoroTimer.getState();
  assert.equal(state.status, 'paused', 'Status should be paused after pause');
  assert.equal(state.targetEndTime, null, 'targetEndTime should be cleared when paused');

  // Toggle (resumes when paused)
  PomodoroTimer.toggle();
  state = PomodoroTimer.getState();
  assert.equal(state.status, 'running', 'Status should be running after toggle on paused');

  // Toggle (pauses when running)
  PomodoroTimer.toggle();
  state = PomodoroTimer.getState();
  assert.equal(state.status, 'paused', 'Status should be paused after toggle on running');

  // Reset
  PomodoroTimer.reset();
  state = PomodoroTimer.getState();
  assert.equal(state.status, 'idle', 'Status should be idle after reset');
  assert.equal(state.mode, 'study', 'Mode should reset to study');
  assert.equal(state.remaining, 1500, 'Remaining should reset to 1500s');
});

test('Pomodoro Timer: Manual mode selection and minimize toggle', () => {
  storageMock.clear();
  PomodoroTimer.destroy();
  PomodoroTimer.init({ floating: false });

  // Switch to break mode
  PomodoroTimer.setMode('break');
  let state = PomodoroTimer.getState();
  assert.equal(state.mode, 'break');
  assert.equal(state.remaining, 300, 'Break mode duration should be 300s (5 minutes)');
  assert.equal(state.status, 'idle');

  // Switch back to study mode
  PomodoroTimer.setMode('study');
  state = PomodoroTimer.getState();
  assert.equal(state.mode, 'study');
  assert.equal(state.remaining, 1500);

  // Minimize toggle
  assert.equal(state.isMinimized, false);
  PomodoroTimer.toggleMinimize();
  assert.equal(PomodoroTimer.getState().isMinimized, true);
  PomodoroTimer.toggleMinimize();
  assert.equal(PomodoroTimer.getState().isMinimized, false);
});

test('Pomodoro Timer: State persistence and storage synchronization', () => {
  storageMock.clear();
  PomodoroTimer.destroy();
  PomodoroTimer.init({ floating: false });

  PomodoroTimer.setMode('break');
  PomodoroTimer.start();

  const savedRaw = storageMock.getItem('fe-lessons:v1:pomodoro');
  assert.ok(savedRaw, 'State should be saved to localStorage');
  const saved = JSON.parse(savedRaw);
  assert.equal(saved.mode, 'break');
  assert.equal(saved.status, 'running');
  assert.ok(saved.targetEndTime);

  // Simulate hydrating from storage in another tab
  PomodoroTimer.destroy();
  PomodoroTimer.init({ floating: false });
  const rehydrated = PomodoroTimer.getState();
  assert.equal(rehydrated.mode, 'break');
  assert.equal(rehydrated.status, 'running');
  PomodoroTimer.destroy();
  storageMock.clear();
});

test('Pomodoro Timer: Event dispatching on tick, break transition, and study transition', async () => {
  storageMock.clear();
  PomodoroTimer.destroy();
  PomodoroTimer.init({ floating: false, studyDuration: 1, breakDuration: 1 });

  const eventsReceived = [];
  const onTick = (e) => eventsReceived.push({ type: 'tick', detail: e.detail });
  const onBreak = (e) => eventsReceived.push({ type: 'break', detail: e.detail });
  const onStudy = (e) => eventsReceived.push({ type: 'study', detail: e.detail });

  window.addEventListener('fe-pomodoro-tick', onTick);
  window.addEventListener('fe-pomodoro-break', onBreak);
  window.addEventListener('fe-pomodoro-study', onStudy);

  try {
    const breakPromise = new Promise(resolve => {
      const cb = (e) => { window.removeEventListener('fe-pomodoro-break', cb); resolve(e); };
      window.addEventListener('fe-pomodoro-break', cb);
    });
    const studyPromise = new Promise(resolve => {
      const cb = (e) => { window.removeEventListener('fe-pomodoro-study', cb); resolve(e); };
      window.addEventListener('fe-pomodoro-study', cb);
    });

    PomodoroTimer.start();
    assert.ok(eventsReceived.some(e => e.type === 'tick'), 'fe-pomodoro-tick event dispatched on start');

    // Wait for transition to break
    await breakPromise;
    assert.ok(eventsReceived.some(e => e.type === 'break'), 'fe-pomodoro-break dispatched on transition to break');
    assert.equal(PomodoroTimer.getState().mode, 'break');

    // Wait for transition back to study
    await studyPromise;
    assert.ok(eventsReceived.some(e => e.type === 'study'), 'fe-pomodoro-study dispatched on transition back to study');
    assert.equal(PomodoroTimer.getState().mode, 'study');
    assert.equal(PomodoroTimer.getState().status, 'idle');
  } finally {
    window.removeEventListener('fe-pomodoro-tick', onTick);
    window.removeEventListener('fe-pomodoro-break', onBreak);
    window.removeEventListener('fe-pomodoro-study', onStudy);
    PomodoroTimer.destroy();
  }
});

test('Relax Content Section: DOM compliance across all 51 published theory lessons', () => {
  const rootDir = path.join(__dirname, '..');
  const catalog = JSON.parse(fs.readFileSync(path.join(rootDir, 'lessons.json'), 'utf8')).lessons;
  const theoryLessons = catalog.filter(l => l.theory);
  assert.equal(theoryLessons.length, 51, 'Catalog should contain 51 published theory lessons');

  const viCharRe = /[ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýăđơưĂĐƠƯ\u1EA0-\u1EF9]/u;
  const seenJaTitles = new Set();
  const seenViTitles = new Set();

  for (const lesson of theoryLessons) {
    const html = fs.readFileSync(path.join(rootDir, lesson.theory), 'utf8');

    // Verify #lesson-relax exists once
    assert.equal((html.match(/id="lesson-relax"/g) || []).length, 1, `${lesson.theory}: Must have exactly one id="lesson-relax"`);
    assert.ok(html.includes('class="lesson-part lesson-relax"'), `${lesson.theory}: Must have class="lesson-part lesson-relax"`);

    // Strict constraints
    assert.ok(!html.includes('id="p5"'), `${lesson.theory}: Strict constraint: must NOT use id="p5"`);
    assert.ok(!html.includes('class="mindmap-wrap"'), `${lesson.theory}: Strict constraint: must NOT use .mindmap-wrap`);
    assert.ok(!/<body[^>]*>\s*<section/i.test(html), `${lesson.theory}: Strict constraint: must NOT have body > section`);

    // Verify position immediately before <footer class="lesson-footer"> inside reading-main
    const mainOpen = html.indexOf('<main class="reading-main"');
    const mainClose = html.indexOf('</main>');
    const relaxPos = html.indexOf('id="lesson-relax"');
    const footerPos = html.indexOf('<footer class="lesson-footer">');

    assert.ok(mainOpen !== -1 && mainClose !== -1, `${lesson.theory}: Must have <main class="reading-main">`);
    assert.ok(relaxPos > mainOpen && relaxPos < mainClose, `${lesson.theory}: #lesson-relax must be inside <main class="reading-main">`);
    assert.ok(footerPos > relaxPos && footerPos < mainClose, `${lesson.theory}: #lesson-relax must precede <footer class="lesson-footer">`);

    const relaxSlice = html.slice(relaxPos, footerPos);
    assert.ok(relaxSlice.trimEnd().endsWith('</section>'), `${lesson.theory}: #lesson-relax must be immediately before <footer class="lesson-footer">`);

    // Verify script#lesson-data is untouched and valid JSON
    const scriptMatch = html.match(/<script id="lesson-data" type="application\/json">([\s\S]*?)<\/script>/);
    assert.ok(scriptMatch, `${lesson.theory}: <script id="lesson-data"> must be present`);
    const lessonData = JSON.parse(scriptMatch[1]);
    assert.equal(lessonData.number, lesson.stt, `${lesson.theory}: lessonData.number mismatch`);
    assert.ok(Array.isArray(lessonData.cards) && lessonData.cards.length > 0, `${lesson.theory}: cards must be non-empty`);
    assert.ok(Array.isArray(lessonData.quiz) && lessonData.quiz.length > 0, `${lesson.theory}: quiz must be non-empty`);

    // Bilingual support inside #lesson-relax
    assert.ok(relaxSlice.includes('reading-vi') && relaxSlice.includes('lang="vi"'), `${lesson.theory}: Must have bilingual reading-vi markup`);
    assert.ok(relaxSlice.includes('reading-ja') && relaxSlice.includes('lang="ja"'), `${lesson.theory}: Must have bilingual reading-ja markup`);
    assert.ok(relaxSlice.includes('data-vi=') && relaxSlice.includes('data-ja='), `${lesson.theory}: Must have data-vi and data-ja attributes`);
    assert.ok(relaxSlice.includes('relax-badge') && relaxSlice.includes('relax-title') && relaxSlice.includes('relax-text'), `${lesson.theory}: Must have relax-badge, relax-title, and relax-text`);

    // Ensure Japanese mode has zero Vietnamese character leaks
    const dataJaMatch = relaxSlice.match(/data-ja="([^"]*)"/);
    assert.ok(dataJaMatch && !viCharRe.test(dataJaMatch[1]), `${lesson.theory}: data-ja must not contain Vietnamese characters`);
    const jaBlockMatch = relaxSlice.match(/<div[^>]*class="reading-ja"[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*class="reading-vi"/);
    assert.ok(jaBlockMatch, `${lesson.theory}: Must have .reading-ja block`);
    assert.ok(!viCharRe.test(jaBlockMatch[1]), `${lesson.theory}: .reading-ja must not contain Vietnamese characters`);

    // Topic uniqueness check across catalog
    const jaTitleMatch = jaBlockMatch[1].match(/<h3 class="relax-title">([\s\S]*?)<\/h3>/);
    const viTitleMatch = relaxSlice.match(/<div[^>]*class="reading-vi"[\s\S]*?<h3 class="relax-title">([\s\S]*?)<\/h3>/);
    assert.ok(jaTitleMatch && viTitleMatch, `${lesson.theory}: Must have both ja and vi relax-title`);
    assert.ok(!seenJaTitles.has(jaTitleMatch[1]), `${lesson.theory}: Duplicate ja relax-title`);
    assert.ok(!seenViTitles.has(viTitleMatch[1]), `${lesson.theory}: Duplicate vi relax-title`);
    seenJaTitles.add(jaTitleMatch[1]);
    seenViTitles.add(viTitleMatch[1]);

    // Offline-first SVG icon
    assert.ok(relaxSlice.includes('<svg class="relax-icon"'), `${lesson.theory}: Must have inline SVG icon`);
    assert.ok(!/<img[^>]+src=["']https?:\/\//i.test(relaxSlice), `${lesson.theory}: Must not reference external network images`);

    // Interactive Classroom engine wired
    assert.ok(html.includes('assets/classroom-all.js'), `${lesson.theory}: Must load assets/classroom-all.js`);
  }
});

test('Break Auto-Scroll Behavior: Non-locking smooth scroll handler in assets/home.js', () => {
  const homeJs = fs.readFileSync(path.join(__dirname, '..', 'assets', 'home.js'), 'utf8');

  // Verifies fe-pomodoro-break listener exists
  assert.ok(homeJs.includes("'fe-pomodoro-break'"), "assets/home.js must listen for 'fe-pomodoro-break'");

  // Verifies smooth scrolling to #lesson-relax
  assert.ok(homeJs.includes('lesson-relax'), 'Must target element #lesson-relax');
  assert.ok(homeJs.includes('scrollIntoView'), 'Must call scrollIntoView');
  assert.ok(homeJs.includes('smooth'), 'Must specify smooth behavior');

  // Verifies unrestricted manual scrolling (no scroll locking)
  assert.ok(!/fe-pomodoro-break[\s\S]*?preventDefault\(\)/.test(homeJs), 'Must not call preventDefault on scroll/wheel events');
  assert.ok(!/fe-pomodoro-break[\s\S]*?style\.overflow\s*=\s*['"]hidden['"]/.test(homeJs), 'Must not lock document body overflow during break scroll');
});

test('Browser Preview: Integration in preview.html', () => {
  const previewHtml = fs.readFileSync(path.join(__dirname, '..', 'preview.html'), 'utf8');

  assert.ok(previewHtml.includes('assets/pomodoro.css'), 'preview.html must link assets/pomodoro.css');
  assert.ok(previewHtml.includes('assets/pomodoro.js'), 'preview.html must load assets/pomodoro.js');
  assert.ok(previewHtml.includes('assets/home.js'), 'preview.html must load assets/home.js');
  assert.ok(previewHtml.includes("new CustomEvent('fe-pomodoro-break'"), 'preview.html #previewTriggerBreak must dispatch fe-pomodoro-break');
});

test('Pomodoro Timer: Cross-tab transition event emission on storage sync', () => {
  storageMock.clear();
  PomodoroTimer.destroy();
  PomodoroTimer.init({ floating: false, studyDuration: 1500, breakDuration: 300 });

  const breakEvents = [];
  const studyEvents = [];
  const onBreak = (e) => breakEvents.push(e.detail);
  const onStudy = (e) => studyEvents.push(e.detail);
  window.addEventListener('fe-pomodoro-break', onBreak);
  window.addEventListener('fe-pomodoro-study', onStudy);

  try {
    // Initially in study mode; simulate Tab 1 transitioning to break in localStorage
    storageMock.setItem('fe-lessons:v1:pomodoro', JSON.stringify({
      mode: 'break',
      status: 'running',
      remaining: 300,
      targetEndTime: Date.now() + 300000,
      minimized: false
    }));
    window.dispatchEvent({ type: 'storage', key: 'fe-lessons:v1:pomodoro' });

    assert.equal(breakEvents.length, 1, 'Cross-tab sync from study to break must emit fe-pomodoro-break');
    assert.deepEqual(breakEvents[0], { mode: 'break', duration: 300 });
    assert.equal(PomodoroTimer.getState().mode, 'break');

    // Now simulate Tab 1 finishing break and returning to study
    storageMock.setItem('fe-lessons:v1:pomodoro', JSON.stringify({
      mode: 'study',
      status: 'idle',
      remaining: 1500,
      targetEndTime: null,
      minimized: false
    }));
    window.dispatchEvent({ type: 'storage', key: 'fe-lessons:v1:pomodoro' });

    assert.equal(studyEvents.length, 1, 'Cross-tab sync from break to study must emit fe-pomodoro-study');
    assert.deepEqual(studyEvents[0], { mode: 'study', duration: 1500 });
    assert.equal(PomodoroTimer.getState().mode, 'study');
  } finally {
    window.removeEventListener('fe-pomodoro-break', onBreak);
    window.removeEventListener('fe-pomodoro-study', onStudy);
    PomodoroTimer.destroy();
    storageMock.clear();
  }
});

test('Pomodoro Timer: Pause on expired timer stays idle instead of paused', () => {
  storageMock.clear();
  PomodoroTimer.destroy();
  PomodoroTimer.init({ floating: false, studyDuration: 1500, breakDuration: 300 });

  const realDateNow = Date.now;
  let fakeNow = 1000000;
  Date.now = () => fakeNow;

  try {
    PomodoroTimer.setMode('break');
    PomodoroTimer.start();
    assert.equal(PomodoroTimer.getState().status, 'running');

    // Advance wall clock past break expiration (300s)
    fakeNow += 305 * 1000;
    PomodoroTimer.pause();

    const state = PomodoroTimer.getState();
    assert.equal(state.status, 'idle', 'Expired break timer must settle to idle, not paused');
    assert.equal(state.mode, 'study', 'Mode should transition to study after break expiration');
    assert.equal(state.remaining, 1500);
  } finally {
    Date.now = realDateNow;
    PomodoroTimer.destroy();
    storageMock.clear();
  }
});

test('Pomodoro Timer: Storage sanitization for corrupt status, negative remaining, and minimized alias', () => {
  storageMock.clear();
  PomodoroTimer.destroy();
  PomodoroTimer.init({ floating: false, studyDuration: 1500, breakDuration: 300 });

  try {
    storageMock.setItem('fe-lessons:v1:pomodoro', JSON.stringify({
      mode: 'study',
      status: 'corrupt',
      remaining: -500,
      minimized: true
    }));
    PomodoroTimer.syncFromStorage();

    let state = PomodoroTimer.getState();
    assert.equal(state.status, 'idle', 'Corrupt status must be sanitized to idle');
    assert.equal(state.remaining, 0, 'Negative remaining must be clamped to >= 0');
    assert.equal(state.isMinimized, true, 'minimized field from storage must map to isMinimized');

    storageMock.setItem('fe-lessons:v1:pomodoro', JSON.stringify({
      mode: 'break',
      status: 'paused',
      remaining: Number.NaN,
      isMinimized: false
    }));
    PomodoroTimer.syncFromStorage();

    state = PomodoroTimer.getState();
    assert.equal(state.status, 'paused');
    assert.equal(state.remaining, 300, 'Non-numeric/NaN remaining must fall back to mode duration');
    assert.equal(state.isMinimized, false);
  } finally {
    PomodoroTimer.destroy();
    storageMock.clear();
  }
});

test('Pomodoro Timer: fe-pomodoro-tick includes accurate progress percentage', async () => {
  storageMock.clear();
  PomodoroTimer.destroy();
  PomodoroTimer.init({ floating: false, studyDuration: 100, breakDuration: 50 });

  const realDateNow = Date.now;
  let fakeNow = 2000000;
  Date.now = () => fakeNow;

  const ticks = [];
  const onTick = (e) => ticks.push(e.detail);
  window.addEventListener('fe-pomodoro-tick', onTick);

  try {
    PomodoroTimer.start();
    assert.equal(ticks.length, 1);
    assert.equal(ticks[0].progress, 0, 'Initial tick progress should be 0');
    assert.equal(ticks[0].duration, 100);
    assert.equal(ticks[0].remaining, 100);

    // Advance 40 seconds and wait for one interval tick
    fakeNow += 40 * 1000;
    await new Promise(resolve => setTimeout(resolve, 1100));

    const latestTick = ticks[ticks.length - 1];
    assert.equal(typeof latestTick.progress, 'number', 'fe-pomodoro-tick must include numeric progress');
    assert.equal(latestTick.remaining, 60);
    assert.equal(latestTick.progress, 40, 'Progress should be 40% when 40/100s elapsed');
  } finally {
    window.removeEventListener('fe-pomodoro-tick', onTick);
    Date.now = realDateNow;
    PomodoroTimer.destroy();
    storageMock.clear();
  }
});

test('Pomodoro Timer: Expired break in storage does not emit fe-pomodoro-break on syncFromStorage', () => {
  storageMock.clear();
  PomodoroTimer.destroy();
  PomodoroTimer.init({ floating: false, studyDuration: 1500, breakDuration: 300 });

  const breakEvents = [];
  const studyEvents = [];
  const onBreak = (e) => breakEvents.push(e.detail);
  const onStudy = (e) => studyEvents.push(e.detail);
  window.addEventListener('fe-pomodoro-break', onBreak);
  window.addEventListener('fe-pomodoro-study', onStudy);

  try {
    storageMock.setItem('fe-lessons:v1:pomodoro', JSON.stringify({
      mode: 'break',
      status: 'running',
      remaining: 5,
      targetEndTime: Date.now() - 10000,
      minimized: false
    }));
    window.dispatchEvent({ type: 'storage', key: 'fe-lessons:v1:pomodoro' });

    assert.equal(breakEvents.length, 0, 'Expired break in storage must NOT emit fe-pomodoro-break');
    assert.equal(studyEvents.length, 1, 'Expired break settling to study must emit fe-pomodoro-study');
    assert.equal(PomodoroTimer.getState().mode, 'study');
    assert.equal(PomodoroTimer.getState().status, 'idle');
  } finally {
    window.removeEventListener('fe-pomodoro-break', onBreak);
    window.removeEventListener('fe-pomodoro-study', onStudy);
    PomodoroTimer.destroy();
    storageMock.clear();
  }
});

test('Pomodoro Timer: autoInit() hydrates state and registers storage listener automatically', () => {
  const pomodoroCode = fs.readFileSync(path.join(__dirname, '..', 'assets', 'pomodoro.js'), 'utf8');
  const store = {
    'fe-lessons:v1:pomodoro': JSON.stringify({
      mode: 'break',
      status: 'paused',
      remaining: 180,
      targetEndTime: null,
      minimized: true
    })
  };
  const listeners = {};
  const makeEl = (id = '') => ({
    id,
    className: '',
    innerHTML: '',
    children: [],
    parentElement: null,
    contains: () => false,
    appendChild(child) { child.parentElement = this; this.children.push(child); return child; },
    removeChild(child) { child.parentElement = null; },
    querySelector: () => null
  });
  const body = makeEl('body');
  body.contains = (el) => el === body || body.children.includes(el);
  const sandbox = {
    Date,
    Math,
    JSON,
    Number,
    String,
    Array,
    Set,
    setInterval,
    clearInterval,
    CustomEvent: global.CustomEvent,
    MutationObserver: class { observe() {} },
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; }
    },
    document: {
      readyState: 'complete',
      body,
      createElement: () => makeEl(),
      getElementById: () => null,
      querySelectorAll: () => [],
      querySelector: () => null,
      addEventListener: () => {}
    },
    window: {
      addEventListener: (type, fn) => {
        listeners[type] = listeners[type] || [];
        listeners[type].push(fn);
      },
      removeEventListener: (type, fn) => {
        listeners[type] = (listeners[type] || []).filter(f => f !== fn);
      },
      dispatchEvent: (ev) => {
        (listeners[ev.type] || []).forEach(fn => fn(ev));
        return true;
      }
    }
  };
  sandbox.window.window = sandbox.window;
  sandbox.globalThis = sandbox;

  vm.runInNewContext(pomodoroCode, sandbox);

  try {
    const state = sandbox.window.PomodoroTimer.getState();
    assert.equal(state.mode, 'break', 'autoInit must hydrate mode from localStorage');
    assert.equal(state.status, 'paused', 'autoInit must hydrate status from localStorage');
    assert.equal(state.remaining, 180, 'autoInit must hydrate remaining from localStorage');
    assert.equal(state.isMinimized, true, 'autoInit must hydrate minimized flag from localStorage');
    assert.ok(Array.isArray(listeners.storage) && listeners.storage.length === 1, 'autoInit must attach storage event listener');

    // Verify cross-tab storage event updates state without manual init()
    store['fe-lessons:v1:pomodoro'] = JSON.stringify({
      mode: 'study',
      status: 'paused',
      remaining: 900,
      targetEndTime: null,
      minimized: false
    });
    sandbox.window.dispatchEvent({ type: 'storage', key: 'fe-lessons:v1:pomodoro' });
    const synced = sandbox.window.PomodoroTimer.getState();
    assert.equal(synced.mode, 'study');
    assert.equal(synced.remaining, 900);
    assert.equal(synced.isMinimized, false);
  } finally {
    sandbox.window.PomodoroTimer.destroy();
  }
});

test('Break Auto-Scroll Behavior: home.js waits for frame load on tab switch and opens last viewed lesson when pane is closed', () => {
  const homeCode = fs.readFileSync(path.join(__dirname, '..', 'assets', 'home.js'), 'utf8');
  const winListeners = {};
  const elements = new Map();
  let scrollCalls = [];

  const makeElement = (id) => {
    const attrs = {};
    const elListeners = {};
    const classes = new Set();
    return {
      id,
      open: false,
      hidden: false,
      disabled: false,
      src: '',
      href: '',
      value: '',
      textContent: '',
      innerHTML: '',
      style: {},
      dataset: {},
      children: [],
      classList: {
        add: (c) => classes.add(c),
        remove: (c) => classes.delete(c),
        contains: (c) => classes.has(c)
      },
      setAttribute: (k, v) => { attrs[k] = String(v); },
      getAttribute: (k) => (k in attrs ? attrs[k] : null),
      addEventListener: (type, fn, opts) => {
        elListeners[type] = elListeners[type] || [];
        elListeners[type].push({ fn, once: Boolean(opts && opts.once) });
      },
      dispatchEvent: (ev) => {
        const list = (elListeners[ev.type] || []).slice();
        elListeners[ev.type] = (elListeners[ev.type] || []).filter(item => !item.once);
        list.forEach(item => item.fn(ev));
      },
      focus: () => {},
      append: () => {},
      replaceChildren: () => {},
      showModal() { this.open = true; },
      close() { this.open = false; this.dispatchEvent({ type: 'close' }); }
    };
  };

  const getEl = (selector) => {
    if (!elements.has(selector)) elements.set(selector, makeElement(selector));
    return elements.get(selector);
  };

  const frame = getEl('#frame');
  frame.contentDocument = {
    readyState: 'complete',
    location: { pathname: '/kiem-tra/1.html' },
    getElementById: (id) => {
      if (id === 'lesson-relax' && frame.contentDocument.location.pathname.includes('ly-thuyet')) {
        return {
          scrollIntoView: (opts) => scrollCalls.push({
            path: frame.contentDocument.location.pathname,
            opts: { behavior: opts.behavior, block: opts.block }
          })
        };
      }
      return null;
    }
  };

  const sandbox = {
    Date,
    Math,
    JSON,
    Set,
    Array,
    String,
    Number,
    Promise,
    CustomEvent: global.CustomEvent,
    setTimeout: () => 0,
    fetch: () => Promise.reject(new Error('offline test')),
    FE: {
      read: (_, fb) => fb,
      write: () => {},
      t: (s) => s,
      translateUI: () => {}
    },
    document: {
      body: { style: {} },
      querySelector: getEl,
      querySelectorAll: () => [],
      getElementById: (id) => getEl('#' + id)
    },
    window: {
      addEventListener: (type, fn) => {
        winListeners[type] = winListeners[type] || [];
        winListeners[type].push(fn);
      },
      dispatchEvent: (ev) => {
        (winListeners[ev.type] || []).forEach(fn => fn(ev));
        return true;
      }
    }
  };

  vm.runInNewContext(homeCode, sandbox);

  const lesson1 = { stt: 1, topic: 'n進数', theory: 'ly-thuyet/1.html', test: 'kiem-tra/1.html' };
  const lesson2 = { stt: 2, topic: '基数変換', theory: 'ly-thuyet/2.html', test: 'kiem-tra/2.html' };

  // Case 1: Open Lesson 1 on Test tab (outgoing kiem-tra/1.html has readyState === 'complete')
  sandbox.openPane(lesson1, 'test');
  assert.equal(getEl('#pane').open, true);
  assert.equal(getEl('#tabTheory').getAttribute('aria-pressed'), 'false');
  assert.equal(frame.src, 'kiem-tra/1.html');

  // Fire break while on Test tab
  sandbox.window.dispatchEvent(new global.CustomEvent('fe-pomodoro-break', { detail: { mode: 'break', duration: 300 } }));
  assert.equal(getEl('#tabTheory').getAttribute('aria-pressed'), 'true', 'Should switch to theory tab');
  assert.equal(frame.src, 'ly-thuyet/1.html', 'Should navigate frame to theory page');
  assert.equal(scrollCalls.length, 0, 'Must NOT run scrollIntoView on stale outgoing test document');

  // Complete iframe load for ly-thuyet/1.html
  frame.contentDocument.location.pathname = '/ly-thuyet/1.html';
  frame.dispatchEvent({ type: 'load' });
  assert.equal(scrollCalls.length, 1, 'Must scroll to #lesson-relax after theory frame finishes loading');
  assert.deepEqual(scrollCalls[0].opts, { behavior: 'smooth', block: 'start' });

  // Case 2: Open Lesson 2, close pane (about:blank has readyState === 'complete'), then trigger break
  scrollCalls = [];
  sandbox.openPane(lesson2, 'theory');
  sandbox.closePane();
  assert.equal(getEl('#pane').open, false, 'Pane should be closed');
  assert.equal(frame.src, 'about:blank');
  frame.contentDocument.location.pathname = 'blank';

  sandbox.window.dispatchEvent(new global.CustomEvent('fe-pomodoro-break', { detail: { mode: 'break', duration: 300 } }));
  assert.equal(getEl('#pane').open, true, 'Break with closed pane must reopen most recently viewed lesson');
  assert.equal(frame.src, 'ly-thuyet/2.html', 'Must load most recently viewed lesson theory');
  assert.ok(getEl('#toast').classList.contains('show'), 'Must show break toast notification');
  assert.equal(scrollCalls.length, 0, 'Must wait for reopened frame load before scrolling');

  frame.contentDocument.location.pathname = '/ly-thuyet/2.html';
  frame.dispatchEvent({ type: 'load' });
  assert.equal(scrollCalls.length, 1, 'Must scroll to #lesson-relax after reopened lesson finishes loading');
  assert.equal(scrollCalls[0].path, '/ly-thuyet/2.html');
});
