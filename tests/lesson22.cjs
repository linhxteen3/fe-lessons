const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');

(async()=>{
 const catalog=JSON.parse(fs.readFileSync('lessons.json','utf8')).lessons;
 assert.equal(catalog.find(l=>l.stt===22).topic,'ハードウェア入出力');
 assert.equal(catalog.find(l=>l.stt===23).topic,'ファイル管理+Ôn Ch.1-5');
 assert.equal(catalog.find(l=>l.stt===24).topic,'MILESTONE: 50 câu tổng GĐ1');
 const ids=JSON.parse(fs.readFileSync('roadmap.json','utf8')).stages.flatMap(s=>s.lessons);
 assert.equal(new Set(ids).size,catalog.length);
 assert.deepEqual(ids.slice(ids.indexOf(21),ids.indexOf(21)+4),[21,22,23,24]);
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1191,height:668}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(path.resolve('ly-thuyet/22.html')).href);
  assert.equal(await page.locator('.fc-card').count(),18);
  assert.equal(await page.locator('#quizArea .quiz-q').count(),10);
  assert.ok((await page.locator('.source-intro').innerText()).includes('Lesson 04-04'));
  assert.ok(await page.evaluate(()=>document.querySelector('.reading-sidebar').getBoundingClientRect().left>=document.querySelector('main').getBoundingClientRect().right));
  await page.locator('#reading-language').selectOption('ja');
  assert.ok((await page.locator('#lesson-22-topic-1').innerText()).includes('入力装置'));
  await page.locator('.fc-toggle').first().click();assert.ok(await page.locator('.fc-back').first().isVisible());
  await page.locator('#zen-toggle').click();assert.ok(!(await page.locator('.reading-sidebar').isVisible()));
  await page.setViewportSize({width:390,height:844});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:path.join(require('node:os').tmpdir(),'lesson22-theory-mobile.png')});
  await page.goto(pathToFileURL(path.resolve('kiem-tra/22.html')).href);
  await page.locator('.quiz-option').first().waitFor();
  const bank=await page.locator('#quiz-data').evaluate(el=>JSON.parse(el.textContent));
  assert.equal(bank.length,40);assert.equal(new Set(bank.map(q=>q.q)).size,40);
  assert.ok((await page.locator('.lesson-sources').innerText()).includes('Slide 91–106'));
  for(let i=0;i<40;i++){
   await page.locator(`[data-pick="${bank[i].ans}"]`).click();
   if(i===0){await page.locator('#quiz-explain-toggle').click();assert.ok(await page.locator('#quiz-explanation').isVisible());await page.reload();assert.equal(await page.locator('.quiz-option.correct').count(),1);}
   await page.locator('#quiz-next').click();
  }
  assert.equal(await page.locator('.quiz-score').textContent(),'40 / 40');
  assert.equal(await page.evaluate(()=>FE.read('status:22',null)),'p4');
  await page.locator('#quiz-reset').click();
  assert.equal(await page.locator('.quiz-option:disabled').count(),0);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:path.join(require('node:os').tmpdir(),'lesson22-test-mobile.png')});
  await page.setViewportSize({width:1191,height:668});
  await page.screenshot({path:path.join(require('node:os').tmpdir(),'lesson22-test-desktop.png')});
  assert.deepEqual(errors,[]);
  console.log('Lesson 22: catalog/order, source headers, offline theory/test, mobile width, 40/40 score, resume/reset passed.');
 } finally {await browser.close();}
})();
