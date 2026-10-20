const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {execFileSync}=require('node:child_process');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  for(const n of [21,31,35,53]){
   const file=`ly-thuyet/${n}.html`,html=fs.readFileSync(file,'utf8');
   const data=s=>JSON.parse(s.match(/<script[^>]*id="lesson-data"[^>]*>([\s\S]*?)<\/script>/)[1]);
   assert.deepEqual(data(html),data(execFileSync('git',['show','HEAD:'+file],{encoding:'utf8',maxBuffer:5e6})));
   const page=await browser.newPage({viewport:{width:1191,height:768}}),errors=[];
   page.on('pageerror',e=>errors.push(e.message));await page.route('https://**',r=>r.abort());
   await page.goto(pathToFileURL(path.resolve(file)).href);
   const lab=page.locator('#concept-lab'),next=()=>lab.locator('[data-action=next]').click();
   const end=async()=>{while(!await lab.locator('[data-action=next]').isDisabled())await next();};
   const reset=()=>lab.locator('[data-action=reset]').click();
   if(n!==53){
    const story=page.locator('#beginner-lab'),action=a=>story.locator(`[data-story="${a}"]`);
    const storyEnd=async()=>{while(!await action('next').isDisabled())await action('next').click();};
    await page.locator('#reading-language').selectOption('vi');assert.equal(await lab.locator('.story-advanced').getAttribute('open'),null);
    if(n===21){
     assert.equal(await story.getAttribute('data-slots'),'');
     for(let i=0;i<4;i++)await action('next').click();assert.equal(await story.getAttribute('data-slots'),'A,B,C');
     await action('next').click();assert.equal(await story.getAttribute('data-slots'),'D,B,C');
     await story.locator('[data-policy-choice=LRU]').click();assert.equal(await story.getAttribute('data-slots'),'A,D,C');
     await story.locator('[data-policy-choice=FIFO]').click();assert.equal(await story.getAttribute('data-slots'),'D,B,C');
    }
    if(n===31){
     await action('next').click();assert.equal(await story.locator('.story-removed').count(),1);
     await action('next').click();assert.equal(await story.getAttribute('data-totals'),'A:200,B:700');
     await action('next').click();assert.equal(await story.locator('.story-removed').count(),1);assert((await story.locator('.story-removed').textContent()).includes('200'));
    }
    if(n===35){
     for(let i=0;i<3;i++)await action('next').click();assert.equal(await story.getAttribute('data-hosts'),'62');
     await story.locator('[data-smaller]').click();assert.equal(await story.getAttribute('data-hosts'),'30');assert((await story.locator('[data-story-feedback]').innerText()).includes('158'));
     await story.locator('[data-smaller]').click();assert.equal(await story.getAttribute('data-hosts'),'62');
    }
    await storyEnd();await page.locator('#reading-language').selectOption('ja');assert(await story.locator('[data-story-task] .reading-ja').isVisible());assert(!await story.locator('[data-story-task] .reading-vi').isVisible());
    await page.setViewportSize({width:390,height:844});
    while(true){assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`story mobile ${n}`);if(await action('prev').isDisabled())break;await action('prev').click();}
    await action('next').focus();await page.keyboard.press('Enter');assert.equal(await story.getAttribute('data-step'),'1');await action('reset').click();assert.equal(await story.getAttribute('data-step'),'0');
    await page.locator('#reading-language').selectOption('vi');await page.setViewportSize({width:1191,height:768});
    await story.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await page.screenshot({path:path.join(process.env.TEMP,`fe-story-${n}.png`)});
    await lab.locator('.story-advanced>summary').click();
   }
   if(n===21){
    await page.locator('#refs').fill('1,2,3,1,4');await page.locator('#apply').click();await end();
    assert.equal(await lab.locator('[data-policy=FIFO] tbody tr').last().locator('td').last().textContent(),'1');
    assert.equal(await lab.locator('[data-policy=LRU] tbody tr').last().locator('td').last().textContent(),'2');
    await reset();await end();
    assert.equal(await lab.locator('[data-policy=FIFO]').getAttribute('data-faults'),'10');
    assert.equal(await lab.locator('[data-policy=LRU]').getAttribute('data-faults'),'10');
    await page.locator('#refs').fill('<script>');await page.locator('#apply').click();assert(await lab.locator('[data-error]').textContent());
   }
   if(n===31){
    const rows=async()=>lab.locator('tbody tr').allTextContents();
    await next();assert.equal((await rows()).length,3);await next();assert.equal((await rows()).length,2);
    await next();assert.deepEqual(await rows(),['B700']);await next();assert.deepEqual(await rows(),['B700']);
    await page.locator('#where').selectOption('500');await end();assert.equal((await rows()).length,0);
   }
   if(n===35){
    await end();assert.equal(await lab.getAttribute('data-network'),'192.168.1.128');assert.equal(await lab.getAttribute('data-hosts'),'62');
    assert((await lab.textContent()).includes('192.168.1.129 → 192.168.1.190'));
    for(const [prefix,network,hosts] of [['0','0.0.0.0','4294967294'],['30','192.168.1.128','2']]){
     await page.locator('#prefix').fill(prefix);await page.locator('#apply').click();assert.equal(await lab.getAttribute('data-network'),network);assert.equal(await lab.getAttribute('data-hosts'),hosts);
    }
    await page.locator('#ip').fill('256.1.2.3');await page.locator('#apply').click();assert(await lab.locator('[data-error]').textContent());assert.equal(await lab.getAttribute('data-hosts'),'2');
   }
   if(n===53){
    await end();assert.equal(await lab.getAttribute('data-duration'),'9');assert.equal(await lab.getAttribute('data-critical'),'A → B → D');
    assert((await lab.locator('tbody tr').nth(2).textContent()).endsWith('2'));
    await page.locator('#duration-C').fill('6');await page.locator('#apply').click();await end();assert.equal(await lab.getAttribute('data-duration'),'11');assert.equal(await lab.getAttribute('data-critical'),'A → C → D');
    await page.locator('#duration-B').fill('6');await page.locator('#apply').click();assert.equal(await lab.getAttribute('data-critical'),'A → B → D | A → C → D');
    await page.locator('#duration-A').fill('0');await page.locator('#apply').click();assert(await lab.locator('[data-error]').textContent());assert.equal(await lab.getAttribute('data-duration'),'11');
   }
   await reset();assert.equal(await lab.getAttribute('data-step'),'0');assert.equal(await lab.locator('[data-error]').textContent(),'');
   await page.locator('#reading-language').selectOption('ja');assert.equal(await lab.locator('[data-intro] .reading-vi').isVisible(),false);assert.equal(await lab.locator('[data-intro] .reading-ja').isVisible(),true);assert((await lab.locator('h3').textContent()).includes('体験'));
   await page.locator('#reading-language').selectOption('dual');await end();await page.setViewportSize({width:390,height:844});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`mobile overflow ${n}`);
   await lab.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await page.screenshot({path:path.join(process.env.TEMP,`fe-lab-${n}.png`)});
   assert.deepEqual(errors,[]);await page.close();console.log(`Lesson ${n}: OK`);
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
