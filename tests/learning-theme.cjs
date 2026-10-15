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
    const paths = ['index.html', ...['ly-thuyet', 'kiem-tra'].flatMap(dir =>
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
          }
        }
        const result = await page.evaluate(() => ({
          theme: !!document.querySelector('link[href$="learning.css"]'),
          overflow: document.documentElement.scrollWidth > innerWidth + 1, offenders: [...document.querySelectorAll("body *")].filter(e => e.getBoundingClientRect().right > innerWidth + 1).slice(0, 8).map(e => e.tagName + "." + e.className),
          invisible: [...document.querySelectorAll('body *')].filter(el => {
            const style = getComputedStyle(el);
            return !el.children.length && el.textContent.trim() && el.getBoundingClientRect().height &&
              style.color === style.backgroundColor;
          }).map(el => el.className)
        }));
        if (!result.theme || result.overflow || result.invisible.length) issues.push({ path, width, ...result });
      }
    }
    console.log(JSON.stringify(issues, null, 2));
    assert.deepEqual(issues, []);
    for (const [number, nav] of [[9, 'mainnav'], [10, 'nav']]) {
      await page.goto(`${origin}/ly-thuyet/${number}.html`);
      await page.locator('.fe-toolbar button').waitFor();
      await page.locator(`#${nav} button`).nth(1).click();
      assert.equal(await page.locator(`#${nav} button`).nth(1).getAttribute('class'), 'active');
      assert.ok(await page.locator('section.active').isVisible());
    }
    await page.setViewportSize({ width: 1280, height: 900 });
    for (const number of [2, 8, 11, 12]) {
      await page.goto(`${origin}/ly-thuyet/${number}.html`);
      await page.locator('.fe-toolbar button').waitFor();
      await page.screenshot({ path: require('node:path').join(require('node:os').tmpdir(), `fe-layout-${number}.png`) });
    }
    await page.goto(`${origin}/ly-thuyet/4.html`);
    await page.locator('.flow').first().scrollIntoViewIfNeeded();
    assert.equal(await page.locator('.flow .node').first().evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(243, 244, 246)');
    await page.screenshot({ path: require('node:path').join(require('node:os').tmpdir(), 'fe-preview-theory.png') });
    await page.goto(`${origin}/kiem-tra/13.html`);
    await page.locator('.option').first().click();
    assert.ok(await page.locator('.option.correct, .option.incorrect').count());
    await page.screenshot({ path: require('node:path').join(require('node:os').tmpdir(), 'fe-preview-test.png') });
    console.log('41 pages checked at desktop and mobile widths; diagram and answer feedback passed.');
  } finally {
    await browser.close();
    server.close();
  }
})();
