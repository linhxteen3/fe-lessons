const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const {chromium}=require('playwright');
const counts=require('./reader-counts.json');
(async()=>{
 const root=process.cwd();
 const server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+req.url.split('?')[0]);
  if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
  res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.json':'application/json'})[path.extname(file)]||'text/html; charset=utf-8');
  fs.createReadStream(file).on('error',()=>res.writeHead(404).end()).pipe(res);
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  await page.route('https://**',route=>route.abort());
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  const origin=`http://127.0.0.1:${server.address().port}`;
  for(let n=Number(process.argv[2]||1);n<=21;n++){
   await page.goto(`${origin}/ly-thuyet/${n}.html`);await page.locator('.lesson-toc a').first().waitFor();
   assert.equal(await page.locator('main').count(),1,`main ${n}`);
   assert.equal(await page.locator('.reading-main').evaluate(el=>el.getBoundingClientRect().width),[14,21].includes(n)?888:720,`measure ${n}`);
   assert.equal(await page.locator('.reading-sidebar').evaluate(el=>el.getBoundingClientRect().width),280,`sidebar ${n}`);
   assert.equal(await page.locator('.mindmap-wrap,#p5,body > section').count(),0,`structure ${n}`);
   assert.equal(await page.locator('.fc-card').count(),counts[n].cards,`cards ${n}`);
   assert.equal(await page.locator('#quizArea .quiz-q').count(),counts[n].quiz,`quiz ${n}`);
   assert.equal(await page.locator('#quizArea .expl:not([hidden])').count(),0,`no answer leaks ${n}`);
   if(counts[n].cards){
    await page.locator('.fc-toggle').first().focus();await page.keyboard.press('Enter');assert.ok(await page.locator('.fc-back').first().isVisible(),`open card ${n}`);
    await page.keyboard.press('Enter');assert.ok(!(await page.locator('.fc-back').first().isVisible()),`close card ${n}`);
    const bank=await page.evaluate(()=>LESSON.quiz);
    assert.equal(await page.locator('#quizArea .quiz-q').first().locator('button').count(),bank[0].opts.length);
    await page.locator('#quizArea .quiz-q').first().locator('button').nth(bank[0].ans).click();
    assert.equal(await page.locator('#quizArea .expl:not([hidden])').count(),1,`one explanation ${n}`);
    assert.equal(await page.locator('#quizArea .correct').count(),1);
    await page.locator('#reading-language').selectOption('ja');
    assert.equal(await page.locator('#quizArea .expl:not([hidden])').count(),1);
    assert.ok((await page.locator('.lesson-part h2').first().textContent()).includes('理論'));
    await page.locator('#reading-language').selectOption('dual');
    await page.locator('#reading-theme').click();assert.equal(await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor),[14,21].includes(n)?'rgb(15, 23, 42)':'rgb(17, 24, 39)');
    await page.locator('#reading-theme').click();await page.locator('#quiz-reset').click();
    assert.equal(await page.locator('#quizArea .expl:not([hidden])').count(),0);
   }else{assert.equal(await page.locator('.empty-lesson').count(),1);assert.equal(await page.locator('#complete-lesson').count(),0);}
   await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`mobile overflow ${n}: `+JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1&&!e.closest('.table-scroll')).slice(0,6).map(e=>({tag:e.tagName,cls:e.className,width:e.getBoundingClientRect().width})))));
   if([1,5,9,15,21].includes(n))await page.screenshot({path:path.join(require('node:os').tmpdir(),`fe-reader-${n}-mobile.png`)});
   await page.setViewportSize({width:1440,height:1000});console.log(`Lesson ${n} passed.`);
  }

  // Regression for the annotated Japanese-only view of Lesson 01.
  await page.goto(`${origin}/ly-thuyet/1.html`);
  await page.locator('#reading-language').selectOption('ja');
  assert.equal(await page.locator('.lesson-meta').count(),0,'Remove the requested metadata line');
  assert.ok(await page.locator('.lesson-hero h1').evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>38),'Larger lesson title');
  assert.equal(await page.locator('#lesson-1-topic-2').textContent(),'1.2 さまざまなデータの単位');
  assert.equal(await page.locator('#lesson-1-topic-3').textContent(),'1.3 文字の表現（スライド第1回）');
  await page.locator('.fc-toggle').evaluateAll(buttons=>buttons.forEach(button=>button.click()));
  const lessonOneAnswers=await page.evaluate(()=>LESSON.quiz.map(q=>q.ans));
  for(let i=0;i<lessonOneAnswers.length;i++)await page.locator('#quizArea .quiz-q').nth(i).locator('button').nth(lessonOneAnswers[i]).click();
  await page.locator('.quick-check .opt').first().click();
  async function japaneseOnly(){
    const leaks=await page.evaluate(()=>{
      const found=[];
      const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
      let node;
      while(node=walker.nextNode()){
        if(node.parentElement.closest('script,style,option'))continue;
        const text=node.textContent.trim();
        if(!/[ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýăđơưĂĐƠƯ\u1EA0-\u1EF9]/u.test(text))continue;
        const range=document.createRange();range.selectNodeContents(node);
        if(range.getClientRects().length)found.push(text.slice(0,140));
      }
      return found;
    });
    assert.deepEqual(leaks,[],'Japanese mode must not display Vietnamese anywhere in Lesson 01');
  }
  await japaneseOnly();
  await page.setViewportSize({width:799,height:668});await japaneseOnly();
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:path.join(require('node:os').tmpdir(),'fe-reader-one-japanese.png')});
  await page.locator('#reading-theme').click();await japaneseOnly();await page.locator('#reading-theme').click();
  await page.locator('#reading-language').selectOption('vi');
  assert.ok((await page.locator('.lesson-recap .reading-vi').textContent()).includes('Nhớ 3 ý chính'));
  assert.ok(await page.locator('.callout .reading-vi').first().isVisible(),'Vietnamese original is retained');
  await page.locator('#reading-language').selectOption('dual');
  assert.ok((await page.locator('#lesson-1-topic-2').textContent()).includes('Các đơn vị dữ liệu'));
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(`${origin}/ly-thuyet/2.html`);const answers=await page.evaluate(()=>LESSON.quiz.map(q=>q.ans));
  for(let i=0;i<answers.length;i++)await page.locator('#quizArea .quiz-q').nth(i).locator('button').nth(answers[i]).click();
  assert.equal(await page.locator('#qScore').textContent(),`${answers.length} / ${answers.length}`);
  await page.reload();assert.equal(await page.locator('#quizArea .correct').count(),answers.length);
  await page.locator('#reading-language').selectOption('ja');await page.locator('#zen-toggle').click();assert.ok(!(await page.locator('.reading-sidebar').isVisible()));
  await page.locator('#reading-theme').click();await page.reload();assert.equal(await page.locator('#reading-language').inputValue(),'ja');assert.equal(await page.locator('html').getAttribute('data-reading-theme'),'dark');assert.ok(!(await page.locator('.reading-sidebar').isVisible()));
  await page.locator('#zen-toggle').click();await page.locator('#reading-theme').click();await page.locator('#reading-language').selectOption('dual');
  const topic=page.locator('.reading-subitem').nth(3);const hash=await topic.getAttribute('href');await topic.click();
  await page.waitForFunction(hash=>document.querySelector('.lesson-toc a[aria-current="location"]')?.getAttribute('href')===hash,hash);
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(require('node:os').tmpdir(),'fe-reader-shared-desktop.png')});
  assert.deepEqual(errors,[]);console.log('All 21 pages passed; resume/score, preferences and scrollspy verified.');
 }finally{await browser.close();server.close();}
})();
