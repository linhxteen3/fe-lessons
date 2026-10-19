const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
  const root = process.cwd();
  const server = http.createServer((req, res) => {
    const file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0]));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    res.setHeader('Content-Type', ({ '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json' })[path.extname(file)] || 'application/octet-stream');
    const stream = fs.createReadStream(file);
    stream.on('error', () => res.writeHead(404).end());
    stream.pipe(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    await page.route('https://fonts.googleapis.com/**', route => route.abort());
    await page.route('https://fonts.gstatic.com/**', route => route.abort());
    const paths = process.argv.length > 2 ? process.argv.slice(2) : ['index.html', ...['kiem-tra'].flatMap(dir =>
      fs.readdirSync(dir).filter(file => file.endsWith('.html')).map(file => `${dir}/${file}`))];
    const issues = [];
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of paths) {
        await page.goto(`${origin}/${path}`, { waitUntil: 'domcontentloaded' });
        if (path !== 'index.html') {
          await page.locator('.lesson-hero').waitFor();
          assert.equal(await page.locator('.lesson-shell').count(), 1, path);
          assert.equal(await page.locator('.lesson-hero > h1.lesson-title').count(), 1, path);
          assert.equal(await page.locator('h1').count(), 1, path);
          assert.equal(await page.locator('.lesson-hero > .lesson-eyebrow').count(), 1, path);
          assert.equal(await page.locator('.lesson-hero').evaluate(el => getComputedStyle(el).padding), width === 390 ? '20px 16px' : '32px 28px', path);
          assert.equal(Math.round(await page.locator('.lesson-hero').evaluate(el => el.getBoundingClientRect().width)), width === 390 ? 366 : 960, path);
          if (path.startsWith('ly-thuyet')) {
            assert.equal(await page.locator('.lesson-toc').count(), 1, path);
            assert.ok(await page.locator('.lesson-part').count() >= 4, path);
            assert.ok(await page.locator('.lesson-toc li').count() >= 4, path);
            assert.ok(await page.locator('.lesson-toc a').evaluateAll(links => links.every(a => document.getElementById(a.hash.slice(1)))), path);
          } else {
            const bank = await page.locator('#quiz-data').evaluate(el => JSON.parse(el.textContent));
            assert.equal(await page.locator('.quiz-option').count(), 4, path);
            assert.equal(await page.locator('[data-jump]').count(), bank.length, path);
            assert.equal(await page.locator('#quiz-prev').isDisabled(), true, path);
            await page.locator(`[data-pick="${bank[0].ans}"]`).click();
            assert.equal(await page.locator('.quiz-option.correct').count(), 1, path);
            assert.equal(await page.locator('.quiz-option:disabled').count(), 4, path);
            assert.equal(await page.locator('[role="progressbar"]').getAttribute('aria-valuenow'), '1', path);
            await page.locator('#quiz-explain-toggle').click();
            assert.ok(await page.locator('#quiz-explanation').isVisible(), path);
            await page.locator('#quiz-next').click();
            await page.locator('#quiz-prev').click();
            assert.equal(await page.locator('.quiz-option.correct').count(), 1, path);
            await page.locator('[data-jump]').last().click();
            await page.locator('#quiz-next').click();
            assert.equal(await page.locator('.quiz-score').textContent(), `1 / ${bank.length}`, path);
            assert.ok((await page.locator('.quiz-result').textContent()).includes(`Chưa trả lời: ${bank.length - 1}`), path);
            await page.locator('#quiz-reset').click();
            await page.locator(`[data-pick="${(bank[0].ans + 1) % 4}"]`).click();
            assert.equal(await page.locator('.quiz-option.wrong').count(), 1, path);
            await page.locator('[data-jump]').last().click();
            await page.locator('#quiz-next').click();
            await page.locator('#quiz-mistakes').click();
            assert.ok(await page.locator('.quiz-option.wrong').isVisible(), path);
            await page.locator('[data-jump]').last().click();
            await page.locator('#quiz-next').click();
            await page.locator('#quiz-reset').click();
          }
        }
        const result = await page.evaluate(isHome => ({
          theme: !!document.querySelector(isHome ? 'link[href$="home.css"]' : 'link[href$="learning.css"], style[data-source="learning.css"]'),
          overflow: document.documentElement.scrollWidth > innerWidth + 1, offenders: [...document.querySelectorAll("body *")].filter(e => e.getBoundingClientRect().right > innerWidth + 1).slice(0, 8).map(e => e.tagName + "." + e.className),
          invisible: [...document.querySelectorAll('body *')].filter(el => {
            const style = getComputedStyle(el);
            return !el.children.length && el.textContent.trim() && el.getBoundingClientRect().height &&
              style.color === style.backgroundColor;
          }).map(el => el.className)
        }), path === 'index.html');
        if (!result.theme || result.overflow || result.invisible.length) issues.push({ path, width, ...result });
      }
    }
    console.log(JSON.stringify(issues, null, 2));
    assert.deepEqual(issues, []);
    // Theory interactions and responsive layout are covered by tests/reader.cjs.
    await page.goto(`${origin}/kiem-tra/13.html`);
    await page.locator('.quiz-option').first().click();
    assert.ok(await page.locator('.quiz-option.correct, .quiz-option.wrong').count());
    await page.screenshot({ path: require('node:path').join(require('node:os').tmpdir(), 'fe-preview-test.png') });
    // All 61 original lessons belong to one goal each, in their original order.
    await page.goto(`${origin}/index.html`);
    await page.locator('.lesson-node').first().waitFor({ state: 'attached' });
    const catalog = JSON.parse(fs.readFileSync('lessons.json', 'utf8'));
    assert.equal(await page.locator('.goal').count(), 10);
    assert.equal(await page.locator('.course-art').count(), 1);
    const headingStyles = await page.locator('.goal-heading h3').first().locator('span').evaluateAll(nodes => nodes.map(el => {
      const style = getComputedStyle(el);
      return [style.fontSize, style.fontWeight, style.color];
    }));
    assert.deepEqual(headingStyles[0], headingStyles[1]);
    async function checkNavFont() {
      assert.ok(await page.locator('.main-nav a').evaluateAll(links => links.every(link => {
        const label = link.querySelector('[data-ui]');
        return getComputedStyle(label).fontSize === getComputedStyle(link).fontSize &&
          getComputedStyle(label).fontWeight === getComputedStyle(link).fontWeight;
      })));
    }
    await checkNavFont();

    assert.equal(await page.locator('.gap-review, .sidebar-note, .study-banner').count(), 0);
    await page.locator('#languageToggle').click();
    await page.waitForFunction(() => document.documentElement.lang === 'ja');
    assert.equal(await page.locator('#resumeTop').textContent(), '学習を続ける ↗');
    assert.equal(await page.locator('#q').getAttribute('placeholder'), 'レッスン・テーマを検索…');
    assert.ok((await page.locator('.goal-eyebrow').first().textContent()).startsWith('目標'));
    assert.ok((await page.locator('.goal-description').first().textContent()).includes('データ表現'));
    const uiText = await page.locator('.course-facts, .progress-card, .goal-status, .checkpoint, .exam-guide').allTextContents();
    assert.ok(!/[ăâđêôơưĂÂĐÊÔƠƯạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/u.test(uiText.join(' ')), 'Japanese chrome must not retain Vietnamese labels');
    await page.locator('[data-track="b"]').click();
    assert.ok((await page.locator('.practice-gap').first().textContent()).includes('今後'));
    await page.locator('[data-track="a"]').click();

    await checkNavFont();
    await page.locator('#languageToggle').click();
    await page.waitForFunction(() => document.documentElement.lang === 'vi');
    await page.locator('.lesson-step').first().waitFor({ state: 'attached' });
    assert.deepEqual(await page.locator('[data-lesson]').evaluateAll(rows => rows.map(row => Number(row.dataset.lesson))), catalog.lessons.map(l => l.stt));
    assert.equal(await page.locator('.toggle-btn, [data-f], .chip').count(), 0);
    await page.locator('#q').fill('基数変換');
    assert.equal(await page.locator('.lesson-step').count(), 1);
    await page.locator('#q').fill('khong-co-bai-nay-xyz');
    assert.ok(await page.locator('#empty').isVisible());
    await page.locator('#q').fill('');
    await page.locator('#expandGoals').click();
    assert.equal(await page.locator('.goal[open]').count(), 10);
    assert.equal(await page.locator('.lesson-node:disabled').count(), catalog.lessons.filter(l => !l.theory && !l.test).length);
    await page.locator('[data-track="b"]').click();
    assert.equal(await page.locator('.practice-step').count(), 6);
    assert.ok(await page.locator('#subjectB').isVisible());
    await page.locator('[data-track="a"]').click();
    await page.locator('[data-lesson="2"] .lesson-link').first().click();
    assert.ok(await page.locator('dialog[open]').isVisible());
    await page.frameLocator('#frame').locator('.lesson-hero h1').waitFor();
    assert.equal(await page.frameLocator('#frame').locator('.btn-done, .fe-toolbar button').count(), 0);
    await page.locator('#tabTest').click();
    await page.frameLocator('#frame').locator('.quiz-option').first().waitFor();
    await page.locator('#pClose').click();
    assert.equal(await page.locator('dialog[open]').count(), 0);
    await page.waitForFunction(() => document.activeElement.id === 'resumeCourse');
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: require('node:path').join(require('node:os').tmpdir(), `fe-home-${width}.png`) });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    }
    // Completing an attempt is automatic; partial submissions cannot mark a lesson done.
    await page.goto(`${origin}/kiem-tra/6.html`);
    await page.locator('.quiz-option').first().waitFor();
    const practiceBank = await page.locator('#quiz-data').evaluate(el => JSON.parse(el.textContent));
    await page.locator('[data-jump]').last().click();
    await page.locator('#quiz-next').click();
    assert.notEqual(await page.evaluate(() => FE.read('status:6', 'p0')), 'p4');
    await page.locator('#quiz-reset').click();
    for (let i = 0; i < practiceBank.length; i++) {
      await page.locator(`[data-pick="${practiceBank[i].ans}"]`).click();
      if (i === 0) {
        await page.reload();
        assert.equal(await page.locator('.quiz-option.correct').count(), 1);
      }
      await page.locator('#quiz-next').click();
    }
    assert.equal(await page.locator('.quiz-score').textContent(), `${practiceBank.length} / ${practiceBank.length}`);
    assert.equal(await page.evaluate(() => FE.read('status:6', 'p0')), 'p4');
    await page.goto(`${origin}/index.html`);
    await page.locator('[data-lesson="6"].completed').waitFor({ state: 'attached' });
    assert.ok((await page.locator('#pnum').textContent()).startsWith('1 /'));
    console.log(`${paths.length} requested pages checked at desktop and mobile widths; lesson, roadmap, resume and automatic completion checks passed.`);
  } finally {
    await browser.close();
    server.close();
  }
})();
