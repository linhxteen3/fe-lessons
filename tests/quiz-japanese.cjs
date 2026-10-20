const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {execFileSync}=require('node:child_process');
const {chromium}=require('playwright');

const bank=text=>JSON.parse(text.match(/<script[^>]*id="quiz-data"[^>]*>([\s\S]*?)<\/script>/)[1]);
(async()=>{
 const files=fs.readdirSync('kiem-tra').filter(f=>/^\d+\.html$/.test(f)).sort((a,b)=>parseInt(a)-parseInt(b));
 for(const f of files){
  const current=bank(fs.readFileSync(path.join('kiem-tra',f),'utf8'));
  const tracked=execFileSync('git',['ls-files',`kiem-tra/${f}`],{encoding:'utf8'}).trim();
  if(tracked){
   const before=bank(execFileSync('git',['show',`HEAD:kiem-tra/${f}`],{encoding:'utf8',maxBuffer:10*1024*1024}));
   assert.deepEqual(current.map(q=>[q.q,q.opts,q.ans]),before.map(q=>[q.q,q.opts,q.ans]),`original answers/order ${f}`);
  }
  current.forEach((q,i)=>{
   assert.ok(q.qJa,`Japanese question ${f}:${i}`);
   assert.equal(q.optsJa.length,4);assert.ok(q.optsJa.every(o=>typeof o==='string'&&o.length));
   assert.equal(q.detailsJa.length,(q.details||[]).length,`all explanation details ${f}:${i}`);
   if(q.why)assert.ok(q.whyJa,`Japanese explanation ${f}:${i}`);
   if(q.extra)assert.ok(q.extraJa,`Japanese table ${f}:${i}`);
   const text=values=>values.map(v=>v.replace(/<[^>]*>/g,'').replace(/[\s*]/g,'').normalize('NFKC'));
   if(new Set(text(q.opts)).size===4)assert.equal(new Set(text(q.optsJa)).size,4,`translation must not merge distinct choices ${f}:${i}`);
  });
 }
 const root=process.cwd();
 const server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
  res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.json':'application/json'})[path.extname(file)]||'text/html; charset=utf-8');
  fs.createReadStream(file).on('error',()=>res.writeHead(404).end()).pipe(res);
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1191,height:668}});
  await page.route('https://**',r=>r.abort());
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const origin=`http://127.0.0.1:${server.address().port}`;
  for(const f of files){
   await page.goto(`${origin}/kiem-tra/${f}`);await page.locator('#quiz-language').waitFor();
   await page.locator('#quiz-language').selectOption('vi');
   const b=bank(fs.readFileSync(path.join('kiem-tra',f),'utf8'));
   const n=parseInt(f);
   await page.locator(`[data-pick="${b[0].ans}"]`).click();
   await page.locator('#quiz-explain-toggle').click();
   const saved=await page.evaluate(n=>FE.read('test:'+n,null),n);
   await page.locator('#quiz-language').selectOption('ja');
   assert.equal(await page.locator('.quiz-question-jp').count(),0,`no duplicate stem ${f}`);
   assert.equal(await page.locator('.quiz-option.correct').count(),1,`answer retained ${f}`);
   assert.ok(await page.locator('#quiz-explanation').isVisible(),`open explanation retained ${f}`);
   assert.deepEqual(await page.evaluate(n=>FE.read('test:'+n,null),n),saved,`language does not alter saved attempt ${f}`);
   assert.equal(await page.locator('html').getAttribute('lang'),'ja');
   await page.reload();assert.equal(await page.locator('#quiz-language').inputValue(),'ja');
   assert.equal(await page.locator('.quiz-option.correct').count(),1);
   await page.locator('#quiz-next').click();
   await page.locator('#quiz-language').selectOption('vi');
   assert.equal(await page.locator('.quiz-number').textContent(),`Câu 2/${b.length}`);
   await page.setViewportSize({width:390,height:844});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`mobile width ${f}`);
   await page.setViewportSize({width:1191,height:668});
   if(f==='35.html'){
    await page.locator('#quiz-language').selectOption('ja');
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:path.join(require('node:os').tmpdir(),'fe-quiz-japanese-desktop.png')});
    await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(require('node:os').tmpdir(),'fe-quiz-japanese-mobile.png')});
   }
   console.log(`Japanese switching and progress passed: ${f}`);
  }
  // Changing language on the result screen must not submit a fresh result.
  await page.goto(`${origin}/kiem-tra/6.html`);const b=bank(fs.readFileSync('kiem-tra/6.html','utf8'));
  for(let i=1;i<b.length;i++){await page.locator(`[data-pick="${b[i].ans}"]`).click();await page.locator('#quiz-next').click();}
  const result=await page.evaluate(()=>FE.read('test-result:6',null));
  await page.locator('#quiz-language').selectOption('ja');
  assert.ok(await page.locator('.quiz-result').isVisible());
  assert.deepEqual(await page.evaluate(()=>FE.read('test-result:6',null)),result);
  assert.deepEqual(errors,[]);
  console.log(`All ${files.length} tests have Japanese questions, four choices and full explanations; scores/order preserved.`);
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
