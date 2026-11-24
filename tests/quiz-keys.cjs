const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');

(async () => {
  const root = process.cwd();
  const server = http.createServer((req, res) => {
    const file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0]));
    if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
    const types = { '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.jpg': 'image/jpeg' };
    res.setHeader('Content-Type', types[path.extname(file)] || 'text/html; charset=utf-8');
    fs.createReadStream(file).on('error', () => res.writeHead(404).end()).pipe(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/kiem-tra/1.html`;
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    await page.route('https://**', r => r.abort());
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.quiz-option');

    // Default key "1" selects option A (index 0)
    await page.keyboard.press('1');
    assert.equal(await page.getAttribute('.quiz-option[data-pick="0"]', 'aria-pressed'), 'true', 'Key 1 should pick A');

    // ArrowRight moves to question 2
    await page.keyboard.press('ArrowRight');
    assert.match(await page.textContent('.quiz-number'), /2\//, 'ArrowRight should advance to question 2');

    // Customize keybinding for A -> "q" and verify persistence + usage
    await page.click('#quiz-keys-toggle');
    await page.click('.quiz-key-btn[data-slot="opt0"]');
    await page.keyboard.press('q');
    assert.equal(await page.textContent('.quiz-option[data-pick="0"] .quiz-kbd'), 'Q', 'Option A hint should update to Q');

    // Reload and verify custom binding persists and works on question 2
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.quiz-option');
    await page.keyboard.press('q');
    assert.equal(await page.getAttribute('.quiz-option[data-pick="0"]', 'aria-pressed'), 'true', 'Custom key q should pick A after reload');

    // Reset back to defaults
    await page.click('#quiz-keys-toggle');
    await page.click('#quiz-keys-reset');
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.textContent('.quiz-option[data-pick="0"] .quiz-kbd'), '1', 'Reset should restore key 1');

    // Verify redundant hero .meta pills are hidden and "Làm lại tất cả" resets answers
    assert.equal(await page.isVisible('.hero .meta'), false, 'Hero .meta pills should be hidden');
    page.once('dialog', d => d.accept());
    await page.click('#quiz-reset-all');
    assert.match(await page.textContent('.quiz-number'), /1\//, 'Reset all should return to question 1');
    assert.equal(await page.getAttribute('.quiz-option[data-pick="0"]', 'aria-pressed'), 'false', 'Reset all should clear previous answer');

    console.log('Quiz keyboard shortcuts and custom keybindings passed.');
  } finally {
    await browser.close();
    server.close();
  }
})();
