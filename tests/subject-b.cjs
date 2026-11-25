const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');

test('Subject B: All roadmap files exist and every question cites an official ipa.go.jp source', () => {
  const roadmap = JSON.parse(fs.readFileSync(path.join(ROOT, 'roadmap.json'), 'utf8'));
  assert.equal(roadmap.subjectB.length, 6, 'roadmap.subjectB should have 6 steps (B1–B6)');

  const quizFiles = [];
  for (const step of roadmap.subjectB) {
    assert.ok(Array.isArray(step.sources) && step.sources.length >= 2, `${step.id}: must cite at least 2 verified sources`);
    for (const s of step.sources) {
      assert.match(s.url, /^https:\/\/(www\.ipa\.go\.jp|www\.fe-siken\.com)\//, `${step.id}: source URL must be verified official/online domain`);
    }
    if (step.theory) {
      const theoryPath = path.join(ROOT, step.theory);
      assert.ok(fs.existsSync(theoryPath), `Missing theory file ${step.theory}`);
      const html = fs.readFileSync(theoryPath, 'utf8');
      assert.ok(html.includes('https://www.ipa.go.jp/'), `${step.theory}: must include IPA official citation links`);
    }
    assert.ok(step.test && fs.existsSync(path.join(ROOT, step.test)), `Missing test file ${step.test}`);
    quizFiles.push(step.test);
  }

  let b1ToB5Count = 0;
  for (const rel of quizFiles) {
    const html = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    const match = html.match(/<script type="application\/json" id="quiz-data">([\s\S]*?)<\/script>/);
    assert.ok(match, `${rel}: missing #quiz-data`);
    const bank = JSON.parse(match[1]);
    assert.ok(bank.length > 0, `${rel}: quiz bank must not be empty`);
    if (rel === 'mon-b/b6-exam.html') {
      assert.equal(bank.length, 20, 'B6 mock exam must have all 20 official IPA sample questions');
      assert.ok(html.includes('data-exam-minutes="100"'), 'B6 exam must enable 100-minute timer');
    } else {
      b1ToB5Count += bank.length;
    }
    for (const q of bank) {
      assert.ok(q.source && q.source.includes('IPA'), `${rel}: every question must cite IPA`);
      assert.match(q.sourceUrl, /^https:\/\/www\.ipa\.go\.jp\//, `${rel}: sourceUrl must point to ipa.go.jp`);
      assert.ok(q.q && q.qJa, `${rel}: every question must have VI and JA text`);
      assert.ok(!q.q.includes('$') && !String(q.why || '').includes('$'), `${rel}: must not contain raw LaTeX $ delimiters`);
      assert.ok(Array.isArray(q.opts) && q.opts.length >= 2 && q.opts.length <= 10, `${rel}: invalid opts length`);
      assert.ok(Number.isInteger(q.ans) && q.ans >= 0 && q.ans < q.opts.length, `${rel}: invalid ans index`);
    }
  }
  assert.equal(b1ToB5Count, 50, 'B1–B5 categorized practice should cover all 50 official IPA questions (2022–2026)');
});

test('Subject B: Interactive UI flow (homepage tab, B1 theory/practice, keyboard shortcut, B6 100-min timer)', async () => {
  const server = http.createServer((req, res) => {
    const file = path.resolve(ROOT, '.' + decodeURIComponent(req.url.split('?')[0]));
    if (!file.startsWith(ROOT + path.sep)) return res.writeHead(403).end();
    const types = { '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.jpg': 'image/jpeg' };
    res.setHeader('Content-Type', types[path.extname(file)] || 'text/html; charset=utf-8');
    fs.createReadStream(file).on('error', () => res.writeHead(404).end()).pipe(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    await page.route('https://**', r => r.abort());

    // 1. Homepage 科目B tab shows B1–B6 with action buttons
    await page.goto(`${origin}/index.html`, { waitUntil: 'domcontentloaded' });
    await page.click('[data-track="b"]');
    await page.waitForSelector('#subjectB .b-test-btn');
    assert.equal(await page.locator('#subjectB .practice-step').count(), 6);

    // 2. B1 practice renders pseudocode, IPA source citation, and accepts 6th option via key "6"
    await page.goto(`${origin}/mon-b/b1-test.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.quiz-code');
    assert.ok((await page.textContent('.quiz-source')).includes('IPA 科目B'));
    await page.keyboard.press('6');
    assert.equal(await page.getAttribute('.quiz-option[data-pick="5"]', 'aria-pressed'), 'true');
    assert.match(await page.textContent('.quiz-feedback'), /Chính xác/);

    // 3. B6 exam renders 100:00 countdown timer and 20 questions
    await page.goto(`${origin}/mon-b/b6-exam.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#quiz-exam-clock');
    assert.equal(await page.textContent('#quiz-exam-clock'), '100:00');
    assert.match(await page.textContent('.quiz-number'), /1\/20/);
  } finally {
    await browser.close();
    server.close();
  }
});
