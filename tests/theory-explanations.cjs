const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {execFileSync}=require('node:child_process');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const ids=[14,21,22,23,25,26,29,30,31,32,33,34,35,36,37,39,40,41,42,47,48,49,50,52,53,54,55,57,58,59,60,61];
const lesson=s=>JSON.parse(s.match(/<script[^>]*id="lesson-data"[^>]*>([\s\S]*?)<\/script>/)[1]);
(async()=>{
 for(const n of ids){
  const file=`ly-thuyet/${n}.html`,now=fs.readFileSync(file,'utf8');
  const before=execFileSync('git',['show',`HEAD:${file}`],{encoding:'utf8',maxBuffer:5e6});
  assert.deepEqual(lesson(now),lesson(before),`cards, review and saved indices ${n}`);
 }
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1191,height:668}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://**',r=>r.abort());
  for(const n of ids){
   await page.goto(pathToFileURL(path.resolve(`ly-thuyet/${n}.html`)).href);await page.locator('.fc-toggle').first().waitFor();
   const data=lesson(fs.readFileSync(`ly-thuyet/${n}.html`,'utf8'));
   assert.equal(await page.locator('.teaching-unit').count(),4);assert.equal(await page.locator('.teaching-analogy').count(),4);
   assert.ok(await page.locator('.teaching-flow li').count()>=3);
   assert.equal(await page.locator('.worked-example').count(),1);
   if(n===21){
    await page.goto(pathToFileURL(path.resolve('ly-thuyet/21.html')).href+'#lesson-21-topic-4');
    await page.waitForFunction(()=>document.querySelector('.preserved-theory').open);
    assert.ok(await page.locator('#lesson-21-topic-4').isVisible(),'Existing fragment opens the native details');
   }
   assert.ok(await page.evaluate(()=>document.querySelector('.reading-sidebar').getBoundingClientRect().left>=document.querySelector('main').getBoundingClientRect().right));
   assert.ok(await page.evaluate(()=>document.querySelector('.source-intro').getBoundingClientRect().top<document.querySelector('#p1').getBoundingClientRect().top));
   await page.locator('#reading-language').selectOption('vi');
   for(const unit of await page.locator('.teaching-unit').all()){
    const prose=await unit.locator(':scope > .reading-vi').innerText();assert.ok(prose.split(/\s+/).length>=60,`explain, not a dictionary line ${n}`);
    assert.ok(await unit.locator('.teaching-analogy .reading-vi').isVisible());
   }
   await page.locator('.worked-reasoning summary').click();
   assert.equal(await page.locator('.worked-reasoning > .reading-vi li').count(),3);
   await page.locator('#reading-language').selectOption('ja');
   assert.ok(await page.locator('.teaching-unit > .reading-ja').first().isVisible());
   assert.ok(!(await page.locator('.teaching-unit > .reading-vi').first().isVisible()));
   assert.ok(await page.locator('.worked-reasoning > .reading-ja').isVisible());
   assert.ok(await page.locator('.teaching-analogy .reading-ja').first().isVisible());
   await page.locator('#reading-language').selectOption('dual');
   if(n!==21&&n!==22){await page.locator('.term-reference summary').first().click();assert.ok(await page.locator('.reference-body').first().isVisible());}
   await page.locator('.fc-toggle').first().click();assert.ok(await page.locator('.fc-back').first().isVisible());
   await page.evaluate(answers=>answers.forEach((a,i)=>document.querySelectorAll('#quizArea .quiz-q')[i].querySelectorAll('button')[a].click()),data.quiz.map(q=>q.ans));
   assert.equal(await page.locator('#qScore').textContent(),`${data.quiz.length} / ${data.quiz.length}`);
   await page.reload();assert.equal(await page.locator('#qScore').textContent(),`${data.quiz.length} / ${data.quiz.length}`);
   await page.locator('#reading-theme').click();assert.equal(await page.locator('html').getAttribute('data-reading-theme'),'dark');await page.locator('#reading-theme').click();
   await page.locator('#zen-toggle').click();assert.ok(!(await page.locator('.reading-sidebar').isVisible()));await page.locator('#zen-toggle').click();
   await page.setViewportSize({width:390,height:844});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`mobile ${n}`);
   await page.locator('.teaching-unit').first().scrollIntoViewIfNeeded();
   if([21,30,31,41,53].includes(n))await page.screenshot({path:path.join(os.tmpdir(),`fe-teaching-${n}-mobile.png`)});
   await page.setViewportSize({width:1191,height:668});
   if([21,30,31,41,53].includes(n)){await page.locator('.teaching-unit').first().scrollIntoViewIfNeeded();await page.screenshot({path:path.join(os.tmpdir(),`fe-teaching-${n}-desktop.png`)});}
   console.log(`Theory ${n}: detailed explanations, analogies, worked solution, bilingual layout and saved learning passed.`);
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
