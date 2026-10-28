'use strict';
function makeReadingExperiment(topicId) {
  const topic = document.getElementById(topicId);
  const reference = document.createElement('details');
  reference.className = 'radix-reference';
  const summary = document.createElement('summary');
  reference.append(summary);
  [...topic.children].filter(child => child.tagName !== 'H3' && !child.classList.contains('quick-check')).forEach(child => reference.append(child));
  const stage = document.createElement('div');
  stage.className = 'reading-experiment';
  topic.querySelector('h3').after(stage, reference);
  return {stage, summary};
}
const weightExperiment = makeReadingExperiment('topic-5');
let weightBase = 2, weightIndex = 0;
function renderWeights() {
  const digits = weightBase === 2 ? ['1','0','1','1','1'] : ['3','8','4','5'];
  const powers = weightBase === 2 ? [3,2,1,0,-1] : [1,0,-1,-2];
  weightExperiment.summary.textContent = t('Xem công thức và bảng đầy đủ', '公式と一覧表を見る');
  weightExperiment.stage.innerHTML = `<p>${t('Cùng chữ số 1, nhưng ở hàng khác nhau thì giá trị khác nhau. Bấm từng ô để xem hàng đó đóng góp bao nhiêu.', '同じ数字でも、置く桁によって値が変わります。各桁を押して、その桁の値を確認しましょう。')}</p>
    <label for="weight-base">${t('Ví dụ', '例')}</label> <select id="weight-base"><option value="2" ${weightBase===2?'selected':''}>1011.1₂</option><option value="10" ${weightBase===10?'selected':''}>38.45₁₀</option></select>
    <p class="weight-direction">${t(`← Sang trái × ${weightBase} | Sang phải ÷ ${weightBase} →`, `← 左へ × ${weightBase} | 右へ ÷ ${weightBase} →`)}</p>
    <div class="weight-digits" role="group" aria-label="${t('Các hàng của số', '各桁')}">${digits.map((digit,index)=>`${powers[index]===-1?'<span class="decimal-dot" aria-hidden="true">.</span>':''}<button type="button" class="weight-digit" data-weight-index="${index}"><small>${weightBase}<sup>${powers[index]}</sup></small><strong>${digit}</strong><small>× ${weightBase ** powers[index]}</small></button>`).join('')}</div>
    <output id="weight-selected" aria-live="polite"></output><div class="weight-total"></div>
    <p>${t('Trọng số là giá trị của vị trí, không phải bản thân chữ số. Hàng ngay bên trái dấu chấm luôn có trọng số 1.', '重みは数字そのものではなく、位置の値です。小数点のすぐ左の重みは常に1です。')}</p>`;
  function selectWeight(index) {
    weightIndex = index;
    weightExperiment.stage.querySelectorAll('.weight-digit').forEach((button,i)=>button.setAttribute('aria-pressed',String(index===i)));
    const weight = weightBase ** powers[index];
    weightExperiment.stage.querySelector('#weight-selected').textContent = t(`Chữ số ${digits[index]} × trọng số ${weight} = ${Number(digits[index]) * weight}`, `数字 ${digits[index]} × 重み ${weight} = ${Number(digits[index]) * weight}`);
  }
  weightExperiment.stage.querySelector('.weight-digits').onclick = event => {
    const button = event.target.closest('[data-weight-index]');
    if (button) selectWeight(Number(button.dataset.weightIndex));
  };
  weightExperiment.stage.querySelector('.weight-total').textContent = digits.map((digit,index)=>Number(digit) * weightBase ** powers[index]).join(' + ') + ' = ' + (weightBase===2?'11.5':'38.45');
  weightExperiment.stage.querySelector('#weight-base').onchange = event => { weightBase = Number(event.target.value); weightIndex=0; renderWeights(); };
  selectWeight(weightIndex);
}
const decimalExperiment = makeReadingExperiment('topic-6');
let decimalExample = 0;
function renderDecimals() {
  const examples = [
    {label:'38.45',integer:'38',fraction:'45',repeat:'',type:['Hữu hạn','有限小数'],why:['Có đúng 2 chữ số sau dấu chấm rồi kết thúc.','小数点以下は2桁で終わります。']},
    {label:'1 ÷ 3',integer:'0',fraction:'',repeat:'3',type:['Vô hạn tuần hoàn','循環小数'],why:['Chữ số 3 lặp mãi. Viết 0.333…; dấu … nghĩa là vẫn còn tiếp.','3が無限に繰り返されます。0.333…の「…」は続くことを表します。']},
    {label:'1 ÷ 7',integer:'0',fraction:'',repeat:'142857',type:['Vô hạn tuần hoàn','循環小数'],why:['Cả cụm 142857 lặp mãi, không chỉ một chữ số.','1桁ではなく、142857というまとまりが繰り返されます。']},
    {label:'π',integer:'3',fraction:'1415926535…',repeat:'',type:['Vô hạn không tuần hoàn','無限・非循環小数'],why:['Các chữ số tiếp tục mãi nhưng không lặp tuần hoàn một cụm cố định. Phần đang thấy chỉ là những chữ số đầu.','桁は無限に続きますが、一定のまとまりを周期的に繰り返しません。表示は最初の数桁です。']}
  ];
  const example = examples[decimalExample];
  decimalExperiment.summary.textContent = t('Đọc định nghĩa đầy đủ', '詳しい定義を読む');
  decimalExperiment.stage.innerHTML = `<p>${t('Dấu chấm ngăn hai phần. Bên trái là phần nguyên; bên phải là phần nhỏ hơn một đơn vị.', '小数点が2つの部分を分けます。左は整数部、右は1未満の部分です。')}</p>
    <div class="decimal-choices" role="group" aria-label="${t('Chọn ví dụ','例を選ぶ')}">${examples.map((entry,index)=>`<button type="button" class="btn" data-decimal-index="${index}" aria-pressed="${index===decimalExample}">${entry.label}</button>`).join('')}</div>
    <div class="decimal-anatomy"><div><strong>${example.integer}</strong><span>${t('Phần nguyên','整数部')}</span></div><b aria-label="${t('Dấu chấm','小数点')}">.</b><div><strong>${example.repeat?`<span class="repeating-digits">${example.repeat}</span>…`:example.fraction}</strong><span>${t('Phần lẻ','小数部')}</span></div></div>
    <h4 class="decimal-type">${t(...example.type)}</h4><p class="decimal-explanation" role="status">${t(...example.why)}</p>
    <p>${t('Tuần hoàn cũng là vô hạn. “Vô hạn” có thể tuần hoàn hoặc không tuần hoàn; đây không phải ba nhóm tách rời.', '循環小数も無限小数です。無限小数には循環するものとしないものがあります。')}</p>`;
  decimalExperiment.stage.querySelector('.decimal-choices').onclick = event => {
    const button = event.target.closest('[data-decimal-index]');
    if (!button) return;
    decimalExample = Number(button.dataset.decimalIndex);
    renderDecimals();
    decimalExperiment.stage.querySelector(`[data-decimal-index="${decimalExample}"]`).focus({preventScroll:true});
  };
}
// Keep questions visible; move every solution block into a closed native disclosure.
document.querySelectorAll('#p2 .example-box > .reading-ja, #p2 .example-box > .reading-vi').forEach(example => {
  const solution = document.createElement('details');
  solution.className = 'example-solution';
  const summary = document.createElement('summary');
  summary.dataset.vi = 'Mở các bước giải';
  summary.dataset.ja = '解説の手順を見る';
  summary.textContent = t(summary.dataset.vi,summary.dataset.ja);
  solution.append(summary);
  const children = [...example.children];
  const question = children.findIndex(child=>child.tagName==='P');
  children.slice(question+1).forEach(child=>solution.append(child));
  example.append(solution);
});
renderWeights();
renderDecimals();
document.getElementById('reading-language').addEventListener('change',()=>{renderWeights();renderDecimals();});
