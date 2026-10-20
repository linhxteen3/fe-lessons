const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require('playwright');

(async () => {
  const file = path.resolve('ly-thuyet/21.html');
  const html = fs.readFileSync(file, 'utf8');
  assert.ok(!/<(?:link|script)[^>]+(?:href|src)=/.test(html), 'No external CSS, fonts or scripts');
  const browser = await chromium.launch({channel:'msedge', headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1000}});
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(pathToFileURL(file).href);
    assert.equal(await page.locator('.fc-card').count(),24);
    assert.equal(await page.locator('#quizArea .quiz-q').count(),10);
    assert.ok(await page.locator('.reading-subitem').count()>=8,'Contents include explanations and worked examples');
    await page.setViewportSize({width:1191,height:668});
    const layout = await page.evaluate(() => {
      const main = document.querySelector('.reading-main').getBoundingClientRect();
      const sidebar = document.querySelector('.reading-sidebar').getBoundingClientRect();
      return {right:sidebar.left >= main.right, open:document.querySelector('.reading-sidebar details').open};
    });
    assert.ok(layout.right && layout.open, 'Desktop contents are open on the right');
    await page.locator('.fc-toggle').first().click();
    assert.ok(await page.locator('.fc-back').first().isVisible());
    await page.locator('#reading-language').selectOption('ja');
    assert.ok((await page.locator('#lesson-21-topic-4').textContent()).includes('ページフォールト'));
    assert.ok((await page.locator('#quizArea .qtext').first().innerText()).includes('分類'));
    assert.ok(!(await page.locator('#p1 .reading-vi').first().isVisible()));
    const answers = await page.evaluate(() => LESSON.quiz.map(q => q.ans));
    for (let i=0; i<answers.length; i++)
      await page.locator('#quizArea .quiz-q').nth(i).locator('button').nth(answers[i]).click();
    assert.equal(await page.locator('#qScore').textContent(),'10 / 10');
    await page.locator('#reading-theme').click();
    assert.equal(await page.locator('html').getAttribute('data-reading-theme'),'dark');
    await page.locator('#zen-toggle').click();
    assert.ok(!(await page.locator('.reading-sidebar').isVisible()));
    await page.reload();
    assert.equal(await page.locator('#qScore').textContent(),'10 / 10');
    await page.locator('#quiz-reset').click();
    assert.equal(await page.locator('#quizArea .expl:not([hidden])').count(),0);
    await page.setViewportSize({width:390,height:844});
    await page.locator('#reading-language').selectOption('dual');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({path:path.join(require('node:os').tmpdir(),'fe-lesson21-mobile.png')});
    assert.deepEqual(errors,[]);
    console.log('Lesson 21 passed offline: languages, cards, scoring, resume, reset, theme, focus and mobile width.');
  } finally { await browser.close(); }
})();
