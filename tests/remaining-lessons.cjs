const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const theory=[14,36,37,39,40,41,42,47,48,49,50,52,53,54,55,57,58,59,60,61];
const tests=[...theory,27,28,38,43,44,45,51,56].sort((a,b)=>a-b);
const data=(file,id)=>JSON.parse(fs.readFileSync(file,'utf8').match(new RegExp(`<script[^>]*id="${id}"[^>]*>([\\s\\S]*?)</script>`))[1]);
(async()=>{
 const catalog=JSON.parse(fs.readFileSync('lessons.json','utf8')).lessons;
 const roadmap=JSON.parse(fs.readFileSync('roadmap.json','utf8')).stages.flatMap(s=>s.lessons);
 assert.equal(new Set(roadmap).size,61);
 for(const l of catalog)for(const k of ['theory','test'])if(l[k])assert.ok(fs.existsSync(l[k]),`${l.stt} ${k}`);
 for(const n of tests){
  const file=`kiem-tra/${n}.html`,bank=data(file,'quiz-data');
  assert.equal(bank.length,n===45?80:40);assert.equal(new Set(bank.map(q=>q.q)).size,bank.length);
  for(const q of bank){
   assert.ok(q.qJa&&q.ref&&(q.whyJa||q.detailsJa?.length));
   for(const value of [q.qJa,...q.optsJa,q.whyJa||'',...(q.detailsJa||[])])assert.ok(!/[ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýăđơưĂĐƠƯ\u1EA0-\u1EF9]/u.test(value),`Vietnamese leak in Japanese ${n}`);
   assert.equal(q.opts.length,4);assert.equal(q.optsJa.length,4);assert.equal(new Set(q.optsJa).size,4);
   assert.ok(q.ans>=0&&q.ans<4);assert.equal(q.detailsJa.length,(q.details||[]).length);
  }
  assert.equal(catalog.find(l=>l.stt===n).test,file);
 }
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1191,height:668}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://**',r=>r.abort());
  for(const n of theory){
   const file=`ly-thuyet/${n}.html`,d=data(file,'lesson-data');
   await page.goto(pathToFileURL(path.resolve(file)).href);await page.locator('.fc-toggle').first().waitFor();
   assert.equal(d.number,n);assert.equal(await page.locator('.fc-card').count(),20);assert.equal(await page.locator('.quiz-q').count(),10);
   assert.equal(await page.locator('script[src],link[rel="stylesheet"]').count(),0,`standalone ${n}`);
   assert.ok(await page.evaluate(()=>document.querySelector('.reading-sidebar').getBoundingClientRect().left>=document.querySelector('main').getBoundingClientRect().right),`sidebar ${n}`);
   assert.ok(await page.evaluate(()=>document.querySelector('.source-intro').getBoundingClientRect().top<document.querySelector('#p1').getBoundingClientRect().top));
   await page.locator('.fc-toggle').first().click();assert.ok(await page.locator('.fc-back').first().isVisible());
   await page.locator('#reading-language').selectOption('ja');
   assert.ok(!(await page.locator('#p1 .reading-vi').first().isVisible()));
   await page.evaluate(answers=>answers.forEach((a,i)=>document.querySelectorAll('.quiz-q')[i].querySelectorAll('button')[a].click()),d.quiz.map(q=>q.ans));
   assert.equal(await page.locator('#qScore').textContent(),'10 / 10');
   assert.ok(await page.locator('#quizArea .expl .reading-ja').first().isVisible(),`Japanese review explanation ${n}`);
   await page.reload();assert.equal(await page.locator('#qScore').textContent(),'10 / 10');
   await page.locator('#reading-language').selectOption('dual');
   await page.locator('#reading-theme').click();assert.equal(await page.locator('html').getAttribute('data-reading-theme'),'dark');await page.locator('#reading-theme').click();
   await page.locator('#zen-toggle').click();assert.ok(!(await page.locator('.reading-sidebar').isVisible()));await page.locator('#zen-toggle').click();
   await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`mobile ${n}`);
   await page.waitForFunction(()=>!document.querySelector('.reading-sidebar details').open);
   if([14,41,53,60,61].includes(n))await page.screenshot({path:path.join(os.tmpdir(),`fe-remaining-${n}-mobile.png`)});
   await page.setViewportSize({width:1191,height:668});
   if([14,41,53,60,61].includes(n))await page.screenshot({path:path.join(os.tmpdir(),`fe-remaining-${n}-desktop.png`)});
   console.log(`Theory ${n}: languages, source, cards, review, preferences, mobile passed.`);
  }
  for(const n of tests){
   await page.goto(pathToFileURL(path.resolve(`kiem-tra/${n}.html`)).href);await page.locator('#quiz-language').waitFor();
   const bank=data(`kiem-tra/${n}.html`,'quiz-data');
   await page.locator('#quiz-language').selectOption('vi');
   assert.ok(await page.evaluate(()=>document.querySelector('.lesson-sources').getBoundingClientRect().top<document.querySelector('#quiz-app').getBoundingClientRect().top));
   await page.locator(`[data-pick="${bank[0].ans}"]`).click();await page.locator('#quiz-explain-toggle').click();
   const saved=await page.evaluate(n=>FE.read('test:'+n,null),n);
   await page.locator('#quiz-language').selectOption('ja');
   assert.ok(await page.locator('#quiz-explanation').isVisible());assert.equal(await page.locator('.quiz-option.correct').count(),1);
   assert.deepEqual(await page.evaluate(n=>FE.read('test:'+n,null),n),saved);
   await page.reload();assert.equal(await page.locator('#quiz-language').inputValue(),'ja');assert.equal(await page.locator('.quiz-option.correct').count(),1);
   await page.evaluate(answers=>{
    for(let i=0;i<answers.length;i++){
     document.querySelector(`[data-jump="${i}"]`).click();
     const button=document.querySelector(`[data-pick="${answers[i]}"]`);if(!button.disabled)button.click();
    }
    document.querySelector('#quiz-next').click();
   },bank.map(q=>q.ans));
   assert.equal(await page.locator('.quiz-score').textContent(),`${bank.length} / ${bank.length}`);
   const result=await page.evaluate(n=>FE.read('test-result:'+n,null),n);
   await page.locator('#quiz-language').selectOption('vi');assert.deepEqual(await page.evaluate(n=>FE.read('test-result:'+n,null),n),result);
   assert.equal(await page.evaluate(n=>FE.read('status:'+n,null),n),'p4');
   await page.locator('#quiz-reset').click();
   await page.locator(`[data-pick="${(bank[0].ans+1)%4}"]`).click();assert.equal(await page.locator('.quiz-option.wrong').count(),1);
   await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`mobile quiz ${n}`);
   if([45,53,61].includes(n))await page.screenshot({path:path.join(os.tmpdir(),`fe-remaining-${n}-test.png`)});
   await page.setViewportSize({width:1191,height:668});
   console.log(`Test ${n}: all answers, score, Japanese switch, resume, reset and mobile passed.`);
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
