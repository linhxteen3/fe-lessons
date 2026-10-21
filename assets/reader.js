/* Shared Lesson 01 reading layout and interactions, used by lessons 01–21. */
'use strict';
const LESSON = JSON.parse(document.getElementById('lesson-data').textContent);
const FLASHCARDS = LESSON.cards;
const QUIZ = LESSON.quiz;
const readerStorage = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem('fe-lessons:v1:' + key)) ?? fallback; } catch { return fallback; } },
  set(key,value) { try { localStorage.setItem('fe-lessons:v1:' + key,JSON.stringify(value)); return true; } catch { return false; } }
};
if (!Number.isInteger(LESSON.number) || !Array.isArray(FLASHCARDS) || !Array.isArray(QUIZ) ||
    QUIZ.some(q => !Array.isArray(q.opts) || q.opts.length < 2 || !Number.isInteger(q.ans) || q.ans < 0 || q.ans >= q.opts.length)) {
  throw new Error('Invalid lesson data');
}
let language = readerStorage.get('reading-language','dual');
if (!['vi','ja','dual'].includes(language)) language='dual';
const t=(vi,ja)=>language==='ja'?ja:vi;
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function bilingual(vi,ja) {
  if (!ja) return language==='ja'
    ? `<details class="original-source"><summary>原文の解説（ベトナム語）を表示</summary><div lang="vi">${vi}</div></details>`
    : `<span class="reading-vi" lang="vi">${vi}</span>`;
  return `<span class="reading-ja" lang="ja">${ja}</span><span class="reading-vi" lang="vi">${vi}</span>`;
}
const key='theory:'+LESSON.number;
const saved=readerStorage.get(key,[]);
const picks=QUIZ.map((q,i)=>Number.isInteger(saved?.[i])&&saved[i]>=0&&saved[i]<q.opts.length?saved[i]:null);
const quickPicks={};
let category='all';
const categories={
 unit:['Bit / Byte / Đơn vị','ビット・バイト・単位'],base:['Cơ số','基数'],weight:['Trọng số','桁の重み'],dec:['Số thập phân','小数'],concept:['Khái niệm','概念'],to10:['Đổi sang hệ 10','10進数へ'],from10:['Đổi từ hệ 10','10進数から'],basic:['Cơ bản','基本'],term:['Thuật ngữ','用語'],other:['Khác','その他'],quick:['Ôn nhanh','復習'],shortcut:['Mẹo tính','計算の工夫'],Architecture:['Kiến trúc','アーキテクチャ'],Cache:['Bộ nhớ đệm','キャッシュ'],Config:['Cấu hình','構成'],HDD:['HDD','HDD'],'Hieu nang':['Hiệu năng','性能'],IO:['Vào / Ra','入出力'],MTBF:['MTBF / MTTR','MTBF / MTTR'],Memory:['Bộ nhớ','メモリ'],Performance:['Hiệu năng','性能'],Pipeline:['Pipeline','パイプライン'],RAID:['RAID','RAID'],Reliability:['Độ tin cậy','信頼性'],Speed:['Tốc độ','速度'],Storage:['Lưu trữ','記憶装置'],Write:['Ghi dữ liệu','書込み']
};
function categoryLabel(value) {const labels=categories[value]||[value,value];return t(...labels);}
function renderFilters() {
  const filters=document.getElementById('fcFilter');if(!filters)return;
  filters.replaceChildren();
  ['all',...new Set(FLASHCARDS.map(card=>card.cat).filter(cat=>cat!=='all'))].forEach(cat=>{
    const button=document.createElement('button');button.type='button';button.dataset.cat=cat;button.classList.toggle('active',cat===category);button.setAttribute('aria-pressed',String(cat===category));button.textContent=cat==='all'?t('Tất cả','すべて'):categoryLabel(cat);
    button.onclick=()=>{category=cat;renderFilters();renderCards();};filters.append(button);
  });
}
function renderCards() {
  const grid=document.getElementById('fcGrid');if(!grid)return;grid.replaceChildren();
  FLASHCARDS.forEach(card=>{
    if(category!=='all'&&card.cat!==category)return;
    const wrapper=document.createElement('div');wrapper.className='fc-card';
    const button=document.createElement('button');button.type='button';button.className='fc-toggle';button.setAttribute('aria-expanded','false');
    button.innerHTML=`<span class="fc-cat">${escapeHTML(categoryLabel(card.cat))}</span><span class="fc-front">${language==='ja'?(card.frontJa||card.front):card.front}</span><span class="hint">${t('Bấm để lật thẻ','クリックして答えを表示')}</span>`;
    const back=document.createElement('div');back.className='fc-back';back.hidden=true;back.innerHTML=bilingual(card.back,card.backJa);
    button.onclick=()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));wrapper.classList.toggle('flipped',open);back.hidden=!open;button.querySelector('.hint').textContent=open?t('Bấm để úp thẻ','クリックして閉じる'):t('Bấm để lật thẻ','クリックして答えを表示');};
    wrapper.append(button,back);grid.append(wrapper);
  });
}
function questionCard(question,index,quick=false) {
  const card=document.createElement('div');card.className=quick?'quick-check':'quiz-q';
  const headingId=(quick?'quick-':'question-')+index;
  card.setAttribute('role','group');card.setAttribute('aria-labelledby',headingId);
  card.innerHTML=`<div class="${quick?'quick-label':'qnum'}">${quick?t('QUICK CHECK · KIỂM TRA NHANH','QUICK CHECK · 理解度チェック'):t('Câu','問題')+' '+(index+1)+' / '+QUIZ.length}</div><div class="qtext" id="${headingId}">${bilingual(question.qVi||question.q,question.qJa||question.q)}</div><div class="opts"></div><div class="expl" role="status" hidden></div>`;
  const options=card.querySelector('.opts');
  function choose(choice,restoring=false) {
    if(card.classList.contains('locked'))return;
    card.classList.add('locked');
    options.querySelectorAll('button').forEach((button,i)=>{
      button.disabled=true;button.setAttribute('aria-pressed',String(i===choice));
      if(i===question.ans||i===choice){button.classList.add(i===question.ans?'correct':'wrong');const mark=document.createElement('span');mark.className='answer-mark';mark.textContent=i===question.ans?'✓':'✕';button.append(mark);}
    });
    const explanation=card.querySelector('.expl');explanation.hidden=false;
    explanation.innerHTML=`<strong>${choice===question.ans?t('✓ Chính xác','✓ 正解'):t('✕ Chưa đúng','✕ 不正解')} · ${t('Đáp án','正解')}: ${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[question.ans]}</strong>${bilingual(question.expl||question.why||'',question.explJa||question.expl_ja)}`;
    if(quick)quickPicks[index]=choice;
    else if(!restoring){picks[index]=choice;readerStorage.set(key,picks);updateResult();}
  }
  const displayedOptions=language==='ja'&&Array.isArray(question.optsJa)&&question.optsJa.length===question.opts.length?question.optsJa:question.opts;
  displayedOptions.forEach((option,i)=>{
    const button=document.createElement('button');button.type='button';button.className='opt';button.setAttribute('aria-pressed','false');button.innerHTML=`<span class="ltr">${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[i]}.</span><span>${option}</span>`;button.onclick=()=>choose(i);options.append(button);
  });
  const choice=quick?quickPicks[index]:picks[index];
  if(Number.isInteger(choice))choose(choice,true);
  return card;
}
function renderQuiz() {
  const area=document.getElementById('quizArea');if(!area)return;
  area.replaceChildren(...QUIZ.map((question,i)=>questionCard(question,i)));updateResult();
}
function updateResult() {
  const result=document.getElementById('quiz-result');if(!result)return;
  result.hidden=!picks.every(pick=>pick!==null);
  document.getElementById('qScore').textContent=picks.filter((pick,i)=>pick===QUIZ[i].ans).length+' / '+QUIZ.length;
  document.getElementById('qVerdict').textContent=t('Xem lại các câu sai để củng cố kiến thức.','間違えた問題を復習して理解を深めましょう。');
  document.querySelector('.reading-resume-note').textContent=picks.some(pick=>pick!==null)?t('Đã khôi phục câu trả lời đã lưu.','保存済みの回答を表示しています。'):t('Chọn đáp án để xem lời giải.','回答を選ぶと解説が表示されます。');
  document.getElementById('quiz-reset').textContent=t('↻ Làm lại','↻ やり直す');
}
const reset=document.getElementById('quiz-reset');if(reset)reset.onclick=()=>{picks.fill(null);readerStorage.set(key,picks);renderQuiz();document.querySelector('#quizArea button')?.focus();};
function renderQuickChecks() {
  document.querySelectorAll('.quick-check').forEach(card=>card.remove());if(!QUIZ.length)return;
  const positions=LESSON.number===1?[[document.querySelector('#topic-1'),1],[document.querySelector('#topic-5'),6]]:[[document.querySelector('#p1'),0],[document.querySelector('#p1'),Math.min(1,QUIZ.length-1)]];
  positions.forEach(([target,index])=>{if(target&&QUIZ[index])target.append(questionCard(QUIZ[index],index,true));});
}
const toc=document.querySelector('.lesson-toc ul');
const targets=[...document.querySelectorAll('.lesson-part > h2, .lesson-part h3[id]')].map(heading=>{
  const target=heading.parentElement.classList.contains('lesson-part')?heading.parentElement:heading;
  const li=document.createElement('li');const link=document.createElement('a');link.href='#'+target.id;
  if(heading.tagName==='H3')link.className='reading-subitem';li.append(link);toc.append(li);return {heading,target,link};
});
const vocab=document.querySelector('.reading-vocab');
if(vocab)FLASHCARDS.slice(0,5).forEach((card,i)=>{
  const item=document.createElement('div');const button=document.createElement('button');button.type='button';button.className='vocab-toggle';button.setAttribute('aria-expanded','false');button.dataset.index=i;
  const meaning=document.createElement('div');meaning.className='vocab-meaning';meaning.hidden=true;
  button.onclick=()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));meaning.hidden=!open;};item.append(button,meaning);vocab.append(item);
});
let scheduled=false;
function updateReading() {
  scheduled=false;let active=targets[0];targets.forEach(item=>{if(item.target.getBoundingClientRect().top<=150)active=item;});
  targets.forEach(item=>{if(item===active)item.link.setAttribute('aria-current','location');else item.link.removeAttribute('aria-current');});
  const main=document.querySelector('.reading-main');const total=Math.max(1,main.offsetHeight-innerHeight+56);const percent=Math.round(Math.max(0,Math.min(1,(scrollY-main.offsetTop+56)/total))*100);
  document.getElementById('reader-progress').style.width=percent+'%';document.querySelector('.progress-track').setAttribute('aria-valuenow',String(percent));
}
function scheduleReading(){if(!scheduled){scheduled=true;requestAnimationFrame(updateReading);}}
window.addEventListener('scroll',scheduleReading,{passive:true});window.addEventListener('resize',scheduleReading);new ResizeObserver(scheduleReading).observe(document.querySelector('.reading-main'));document.fonts?.ready.then(scheduleReading);
const selector=document.getElementById('reading-language');
const themeButton=document.getElementById('reading-theme');
function updateThemeButton(){const dark=document.documentElement.dataset.readingTheme==='dark';themeButton.textContent=dark?t('☀ Sáng','☀ ライト'):t('☾ Tối','☾ ダーク');themeButton.setAttribute('aria-pressed',String(dark));}
const completion=document.getElementById('complete-lesson');
function showCompletion(){if(!completion)return;const complete=readerStorage.get('reader-complete:'+LESSON.number,false);completion.setAttribute('aria-pressed',String(complete));completion.textContent=complete?t('✓ Đã đọc · Bấm để bỏ đánh dấu','✓ 読了 · クリックして解除'):t('✓ Đánh dấu đã đọc','✓ 読了にする');}
if(completion)completion.onclick=()=>{const value=completion.getAttribute('aria-pressed')!=='true';const saved=readerStorage.set('reader-complete:'+LESSON.number,value);showCompletion();document.getElementById('completion-status').textContent=saved?t('Đã lưu trạng thái đọc trên trình duyệt này.','このブラウザに読了状態を保存しました。'):t('Trình duyệt không cho phép lưu.','このブラウザでは保存できません。');};
function applyLanguage(value) {
  language=value;document.documentElement.dataset.readingLang=value;document.documentElement.lang=value==='ja'?'ja':'vi';selector.value=value;
  document.querySelectorAll('[data-vi][data-ja]').forEach(el=>el.textContent=language==='dual'&&el.dataset.dual?el.dataset.dual:t(el.dataset.vi,el.dataset.ja));
  document.querySelectorAll('[data-aria-vi][data-aria-ja]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.ariaVi,el.dataset.ariaJa)));
  targets.forEach(item=>item.link.textContent=item.heading.textContent.trim());
  document.querySelectorAll('.vocab-toggle').forEach(button=>{const card=FLASHCARDS[Number(button.dataset.index)];button.innerHTML=language==='ja'?(card.frontJa||card.front):card.front;button.nextElementSibling.innerHTML=bilingual(card.back,card.backJa);});
  renderFilters();renderCards();renderQuiz();renderQuickChecks();showCompletion();updateThemeButton();scheduleReading();
}
selector.onchange=()=>{readerStorage.set('reading-language',selector.value);applyLanguage(selector.value);};
document.documentElement.dataset.readingTheme=readerStorage.get('reading-theme','light')==='dark'?'dark':'light';
themeButton.onclick=()=>{const theme=document.documentElement.dataset.readingTheme==='dark'?'light':'dark';readerStorage.set('reading-theme',theme);document.documentElement.dataset.readingTheme=theme;updateThemeButton();};
const zenButton=document.getElementById('zen-toggle');
function applyZen(value){document.body.classList.toggle('zen',value);zenButton.setAttribute('aria-pressed',String(value));scheduleReading();}
applyZen(readerStorage.get('reader-zen',false));zenButton.onclick=()=>{const value=!document.body.classList.contains('zen');readerStorage.set('reader-zen',value);applyZen(value);};
applyLanguage(language);updateReading();
