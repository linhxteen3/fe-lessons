const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');

const theory=[23,25,26,29,30,31,32,33,34,35];
const tests=[23,24,25,26,29,30,31,32,33,34,35];
const bankOf=(file,id)=>JSON.parse(fs.readFileSync(file,'utf8').match(new RegExp(`<script[^>]*id="${id}"[^>]*>([\\s\\S]*?)</script>`))[1]);
(async()=>{
 const catalog=JSON.parse(fs.readFileSync('lessons.json','utf8')).lessons;
 const ids=JSON.parse(fs.readFileSync('roadmap.json','utf8')).stages.flatMap(s=>s.lessons);
 assert.equal(ids.length,61);assert.equal(new Set(ids).size,61);
 for(const n of [27,28]){const l=catalog.find(l=>l.stt===n);assert.equal(l.theory,null);assert.equal(l.test,`kiem-tra/${n}.html`);}
 assert.equal(catalog.find(l=>l.stt===24).theory,null);
 for(const n of tests){
  const file=`kiem-tra/${n}.html`,bank=bankOf(file,'quiz-data');
  assert.equal(bank.length,n===24?50:40,`count ${n}`);
  assert.equal(new Set(bank.map(q=>q.q)).size,bank.length,`distinct stems ${n}`);
  for(const q of bank){assert.ok(q.q&&q.ref);assert.equal(q.opts.length,4);assert.equal(new Set(q.opts).size,4);assert.ok(Number.isInteger(q.ans)&&q.ans>=0&&q.ans<4);assert.ok(q.why||q.details?.length,`explanation ${n}`);}
  assert.equal(catalog.find(l=>l.stt===n).test,file);
 }
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1191,height:668}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://**',route=>route.abort());
  for(const n of theory){
   await page.goto(pathToFileURL(path.resolve(`ly-thuyet/${n}.html`)).href);
   await page.locator('.fc-toggle').first().waitFor();
   assert.equal(await page.locator('.fc-card').count(),20,`cards ${n}`);
   assert.equal(await page.locator('#quizArea .quiz-q').count(),10,`review ${n}`);
   const d=bankOf(`ly-thuyet/${n}.html`,'lesson-data');assert.equal(d.number,n);
   assert.ok((await page.locator('.source-intro').innerText()).includes('ichibanyashashi'),`source ${n}`);
   assert.ok(await page.evaluate(()=>document.querySelector('.source-intro').getBoundingClientRect().top < document.querySelector('#p1').getBoundingClientRect().top),`source comes first ${n}`);
   assert.ok(await page.evaluate(()=>document.querySelector('.reading-sidebar').getBoundingClientRect().left>=document.querySelector('main').getBoundingClientRect().right),`right sidebar ${n}`);
   await page.locator('.fc-toggle').first().click();assert.ok(await page.locator('.fc-back').first().isVisible());
   await page.locator('#reading-language').selectOption('ja');
   assert.ok(!(await page.locator('#p1 .reading-vi').first().isVisible()));
   await page.locator('#reading-language').selectOption('dual');
   for(let i=0;i<d.quiz.length;i++)await page.locator('#quizArea .quiz-q').nth(i).locator('button').nth(d.quiz[i].ans).click();
   assert.equal(await page.locator('#qScore').textContent(),'10 / 10');
   await page.locator('#reading-theme').click();assert.equal(await page.locator('html').getAttribute('data-reading-theme'),'dark');
   await page.locator('#reading-theme').click();
   await page.locator('#zen-toggle').click();assert.ok(!(await page.locator('.reading-sidebar').isVisible()));await page.locator('#zen-toggle').click();
   await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`mobile theory ${n}`);
   await page.waitForFunction(()=>!document.querySelector('.reading-sidebar details').open);
   assert.equal(await page.locator('.reading-sidebar details').getAttribute('open'),null,`mobile contents collapsed ${n}`);
   await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(os.tmpdir(),`fe-${n}-theory-mobile.png`)});
   await page.setViewportSize({width:1191,height:668});await page.screenshot({path:path.join(os.tmpdir(),`fe-${n}-theory-desktop.png`)});
   console.log(`Theory ${n}: source header, languages, cards, review, theme, focus, mobile passed.`);
  }
  for(const n of process.argv.includes('--theory-only')?[]:tests){
   await page.goto(pathToFileURL(path.resolve(`kiem-tra/${n}.html`)).href);await page.locator('.quiz-option').first().waitFor();
   const bank=bankOf(`kiem-tra/${n}.html`,'quiz-data');
   assert.ok((await page.locator('.lesson-sources').innerText()).includes('出典'),`test source ${n}`);
   assert.ok(await page.evaluate(()=>document.querySelector('.lesson-sources').getBoundingClientRect().top<document.querySelector('#quiz-app').getBoundingClientRect().top));
   for(let i=0;i<bank.length;i++){
    await page.locator(`[data-pick="${bank[i].ans}"]`).click();
    if(i===0){await page.locator('#quiz-explain-toggle').click();assert.ok(await page.locator('#quiz-explanation').isVisible());await page.reload();assert.equal(await page.locator('.quiz-option.correct').count(),1);}
    await page.locator('#quiz-next').click();
   }
   assert.equal(await page.locator('.quiz-score').textContent(),`${bank.length} / ${bank.length}`,`score ${n}`);
   assert.equal(await page.evaluate(n=>FE.read('status:'+n,null),n),'p4');
   await page.locator('#quiz-reset').click();assert.equal(await page.locator('.quiz-option:disabled').count(),0);
   await page.locator(`[data-pick="${(bank[0].ans+1)%4}"]`).click();assert.equal(await page.locator('.quiz-option.wrong').count(),1);
   await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`mobile test ${n}`);
   await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(os.tmpdir(),`fe-${n}-test-mobile.png`)});
   await page.setViewportSize({width:1191,height:668});await page.screenshot({path:path.join(os.tmpdir(),`fe-${n}-test-desktop.png`)});
   console.log(`Test ${n}: ${bank.length} answers, score, explanation, resume/reset, source and mobile passed.`);
  }
  assert.deepEqual(errors,[]);console.log('All batch pages passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
