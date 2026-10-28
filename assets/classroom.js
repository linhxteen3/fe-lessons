'use strict';
const classroomMain = document.querySelector('.reading-main');
const classroomSteps = ['bit-lab', 'p1', 'p2', 'p3', 'p4'];
let classroomStep = 0;
let classroomAll = false;
let byteValue = 0;
let selectedBit = 0;
const classroomLabels = [
  ['Thử với 8 bit', '8ビットを試す'], ['Hiểu kiến thức', '理論を学ぶ'],
  ['Xem ví dụ', '例を読む'], ['Lật thẻ ôn tập', '暗記カード'], ['Tự kiểm tra', '確認テスト']
];
const classroomToolbar = document.createElement('nav');
classroomToolbar.className = 'classroom-toolbar';
classroomToolbar.setAttribute('aria-label', 'Các bước học / 学習ステップ');
const classroomLab = document.createElement('section');
classroomLab.id = 'bit-lab';
classroomLab.className = 'bit-lab';
classroomMain.querySelector('.lesson-hero').after(classroomToolbar, classroomLab);
const classroomNext = document.createElement('button');
classroomNext.type = 'button';
classroomNext.className = 'btn primary classroom-next';
classroomMain.querySelector('.lesson-footer').before(classroomNext);

function renderClassroomNavigation(scroll = false) {
  stopByteDemo();
  classroomToolbar.replaceChildren();
  classroomLabels.forEach((labels, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `${index + 1}. ${t(...labels)}`;
    if (!classroomAll && index === classroomStep) button.setAttribute('aria-current', 'step');
    button.onclick = () => { classroomStep = index; classroomAll = false; renderClassroomNavigation(true); };
    classroomToolbar.append(button);
  });
  const all = document.createElement('button');
  all.type = 'button';
  all.textContent = t('Xem toàn bộ bài', '全文を表示');
  all.setAttribute('aria-pressed', String(classroomAll));
  all.onclick = () => { classroomAll = !classroomAll; renderClassroomNavigation(); };
  classroomToolbar.append(all);
  classroomSteps.forEach((id, index) => { document.getElementById(id).hidden = !classroomAll && index !== classroomStep; });
  document.querySelector('.lesson-recap').hidden = !classroomAll && classroomStep !== 1;
  classroomNext.hidden = classroomAll || classroomStep === classroomSteps.length - 1;
  classroomNext.textContent = t('Phần tiếp theo', '次のステップ');
  classroomNext.onclick = () => { classroomStep++; renderClassroomNavigation(true); };
  if (scroll) {
    classroomToolbar.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start'});
    document.getElementById(classroomSteps[classroomStep]).setAttribute('tabindex', '-1');
    document.getElementById(classroomSteps[classroomStep]).focus({preventScroll: true});
  }
}

classroomLab.innerHTML = `
  <div class="lab-heading"><span>01 / ビットとバイト</span><h2 id="lab-title"></h2><p id="lab-intro"></p></div>
  <div class="byte-switches" role="group" aria-labelledby="lab-title"></div>
  <div class="byte-result" aria-live="polite" aria-atomic="true"></div>
  <div class="lab-inspector"><label for="bit-position"></label><select id="bit-position"></select><p id="bit-weight"></p></div>
  <div class="base-controls"><label for="base-choice"></label><select id="base-choice"><option value="2">2</option><option value="10">10</option><option value="16">16</option></select><output id="base-output" for="base-choice"></output><button type="button" class="btn" id="byte-reset"></button></div>
  <div class="lab-question"><h3 id="lab-question-title"></h3><div class="lab-answers"></div><p role="status" id="lab-feedback"></p></div>`;
const bitButtons = [];
for (let bit = 7; bit >= 0; bit--) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'bit-switch';
  button.dataset.bit = bit;
  button.onclick = () => { byteValue ^= 1 << bit; selectedBit = bit; updateByte(); };
  classroomLab.querySelector('.byte-switches').append(button);
  bitButtons.push(button);
  const option = document.createElement('option');
  option.value = bit;
  option.textContent = `2${'⁰¹²³⁴⁵⁶⁷'[bit]} = ${2 ** bit}`;
  classroomLab.querySelector('#bit-position').append(option);
}
function updateByte() {
  bitButtons.forEach(button => {
    const bit = Number(button.dataset.bit);
    const on = Boolean(byteValue & (1 << bit));
    button.setAttribute('aria-pressed', String(on));
    button.setAttribute('aria-label', t(`Bit ${bit}, trọng số ${2 ** bit}`, `ビット${bit}、重み${2 ** bit}`));
    button.innerHTML = `<span class="bit-power">2${'⁰¹²³⁴⁵⁶⁷'[bit]}</span><strong>${Number(on)}</strong><span>${2 ** bit}</span>`;
  });
  classroomLab.querySelector('.byte-result').innerHTML = `<div><span>${t('Nhị phân', '2進数')}</span><strong>${byteValue.toString(2).padStart(8, '0')}</strong></div><span aria-hidden="true">=</span><div><span>${t('Thập phân', '10進数')}</span><strong>${byteValue}</strong></div><span aria-hidden="true">=</span><div><span>${t('Thập lục phân', '16進数')}</span><strong>${byteValue.toString(16).toUpperCase().padStart(2, '0')}</strong></div>`;
  classroomLab.querySelector('#bit-position').value = selectedBit;
  const contribution = byteValue & (1 << selectedBit) ? 1 : 0;
  classroomLab.querySelector('#bit-weight').textContent = `${contribution} × 2${'⁰¹²³⁴⁵⁶⁷'[selectedBit]} = ${contribution * 2 ** selectedBit}`;
  const base = Number(classroomLab.querySelector('#base-choice').value);
  classroomLab.querySelector('#base-output').textContent = byteValue.toString(base).toUpperCase().padStart(base === 2 ? 8 : base === 16 ? 2 : 1, '0');
  const sum = bitButtons.filter(button => byteValue & (1 << Number(button.dataset.bit))).map(button => 2 ** Number(button.dataset.bit));
  classroomLab.querySelector('#bit-weight').textContent += ` | ${sum.length ? sum.join(' + ') : '0'} = ${byteValue}`;
}
function renderClassroomLab() {
  classroomLab.querySelector('#lab-title').textContent = t('Một byte. Tám công tắc.', '1バイト、8個のスイッチ。');
  classroomLab.querySelector('#lab-intro').textContent = t('Bật một bit và quan sát giá trị thay đổi. Mỗi vị trí có một trọng số riêng.', 'ビットを切り替えて値の変化を見ましょう。各桁には異なる重みがあります。');
  classroomLab.querySelector('label[for="bit-position"]').textContent = t('Khám phá trọng số', '桁の重みを確認');
  classroomLab.querySelector('label[for="base-choice"]').textContent = t('Cùng giá trị, đổi cách viết: hệ', '同じ値を別の基数で表示');
  classroomLab.querySelector('#byte-reset').textContent = t('Đưa về 0', '0に戻す');
  classroomLab.querySelector('#lab-question-title').textContent = t('8 bit biểu diễn được bao nhiêu trạng thái?', '8ビットで何通りの状態を表せますか？');
  const answers = classroomLab.querySelector('.lab-answers');
  answers.replaceChildren();
  classroomLab.querySelector('#lab-feedback').textContent = '';
  [8, 255, 256].forEach(answer => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn';
    button.textContent = answer;
    button.onclick = () => {
      answers.querySelectorAll('button').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
      classroomLab.querySelector('#lab-feedback').textContent = answer === 256
        ? t('Đúng! 2⁸ = 256 trạng thái, gồm các giá trị từ 0 đến 255.', '正解！2⁸ = 256通りで、値は0から255までです。')
        : t('Thử lại nhé: mỗi bit có 2 trạng thái, nên 8 bit có 2⁸ = 256 tổ hợp. 255 là giá trị lớn nhất.', '各ビットは2通りなので、8ビットは2⁸ = 256通りです。255は最大値です。');
    };
    answers.append(button);
  });
  updateByte();
}
classroomLab.querySelector('#bit-position').onchange = event => { selectedBit = Number(event.target.value); updateByte(); };
classroomLab.querySelector('#base-choice').onchange = updateByte;
classroomLab.querySelector('#byte-reset').onclick = () => { byteValue = 0; updateByte(); };

let byteDemoTimer = null;
const byteDemoButton = document.createElement('button');
byteDemoButton.type = 'button';
byteDemoButton.id = 'byte-demo';
byteDemoButton.className = 'btn';
classroomLab.querySelector('.base-controls').append(byteDemoButton);
function stopByteDemo() {
  clearInterval(byteDemoTimer);
  byteDemoTimer = null;
  byteDemoButton.setAttribute('aria-pressed', 'false');
  byteDemoButton.textContent = t('Chạy thử 0 → 255', '0 → 255を再生');
  classroomLab.querySelector('.byte-result').setAttribute('aria-live', 'polite');
  classroomLab.classList.remove('demo-running');
}
byteDemoButton.onclick = () => {
  if (byteDemoTimer !== null) { stopByteDemo(); return; }
  byteValue = 0;
  updateByte();
  byteDemoButton.setAttribute('aria-pressed', 'true');
  byteDemoButton.textContent = t('Dừng chạy thử', '再生を停止');
  classroomLab.querySelector('.byte-result').setAttribute('aria-live', 'off');
  classroomLab.classList.add('demo-running');
  byteDemoTimer = setInterval(() => {
    byteValue++;
    updateByte();
    if (byteValue === 255) stopByteDemo();
  }, 650);
};
classroomLab.addEventListener('click', event => {
  if (event.target.closest('.bit-switch, #byte-reset')) stopByteDemo();
}, true);
document.addEventListener('visibilitychange', () => { if (document.hidden) stopByteDemo(); });
window.addEventListener('pagehide', stopByteDemo);
document.getElementById('reading-language').addEventListener('change', () => { renderClassroomLab(); renderClassroomNavigation(); });
renderClassroomLab();
renderClassroomNavigation();
