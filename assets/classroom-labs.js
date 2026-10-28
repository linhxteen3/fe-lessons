'use strict';
const extraLabs = document.createElement('div');
extraLabs.className = 'extra-labs';
classroomLab.append(extraLabs);
function renderExtraLabs() {
  extraLabs.innerHTML = `
  <section class="experiment" aria-labelledby="units-title">
    <span class="experiment-number">02 / データ量</span>
    <h2 id="units-title">${t('Đi từ bit đến megabyte', 'ビットからメガバイトへ')}</h2>
    <p>${t('Chọn quy ước rồi kéo thang để xem mỗi bước tăng dung lượng.', '規則を選び、スライダーでデータ量の変化を確認します。')}</p>
    <label for="unit-convention">${t('Quy ước đơn vị', '単位の規則')}</label>
    <select id="unit-convention"><option value="1000">SI: kB / MB / GB (× 1000)</option><option value="1024">IEC: KiB / MiB / GiB (× 1024)</option></select>
    <label for="unit-level">${t('Bậc dung lượng', 'データ量の段階')}</label>
    <input id="unit-level" type="range" min="0" max="4" step="1" value="1"/>
    <div class="unit-ladder" role="group" aria-label="Đơn vị / 単位"></div><output id="unit-result" for="unit-level unit-convention" aria-live="polite"></output>
  </section>
  <section class="experiment" aria-labelledby="character-title">
    <span class="experiment-number">03 / 文字コード</span>
    <h2 id="character-title">${t('Một ký tự được lưu thế nào?', '文字はどのように保存される？')}</h2>
    <p>${t('Unicode định danh ký tự; UTF-8 mã hóa thành byte. Chọn một ví dụ để xem sự khác nhau.', 'Unicodeは文字を識別し、UTF-8はそれをバイト列に符号化します。')}</p>
    <label for="character-choice">${t('Ký tự mẫu', '文字の例')}</label>
    <select id="character-choice"><option>A</option><option>あ</option><option>đ</option><option>😀</option></select>
    <div class="encoding-flow"><div class="character-stage"></div><span aria-hidden="true">→</span><div class="codepoint-stage"></div></div>
    <div class="encoded-bytes" aria-live="polite"></div>
  </section>
  <section class="experiment" aria-labelledby="fraction-title">
    <span class="experiment-number">04 / 小数</span>
    <h2 id="fraction-title">${t('Ghép một số nhỏ hơn 1', '1未満の数を組み立てる')}</h2>
    <p>${t('Bật các phần ½, ¼, ⅛. Thanh bên dưới thể hiện phần đã ghép trên tổng một đơn vị.', '½、¼、⅛を選びます。バーは1に対する合計の割合を表します。')}</p>
    <div class="fraction-controls" role="group" aria-labelledby="fraction-title">${[2,4,8].map((denominator,index)=>`<button type="button" class="fraction-bit" data-fraction="${index}" aria-pressed="false"><strong>1/${denominator}</strong><span>2${['⁻¹','⁻²','⁻³'][index]}</span></button>`).join('')}</div>
    <div class="fraction-meter" aria-hidden="true">${Array.from({length:8},()=>'<span></span>').join('')}</div>
    <output id="fraction-result" aria-live="polite">0.000₂ = 0₁₀</output>
    <div class="fraction-challenge"><p>${t('Tự thử: hãy tạo ra 0.625.', '挑戦：0.625を作ってみましょう。')}</p><p id="fraction-feedback" role="status"></p></div>
  </section>`;
  const unitRange = extraLabs.querySelector('#unit-level');
  const convention = extraLabs.querySelector('#unit-convention');
  function updateUnits() {
    const base = Number(convention.value), level = Number(unitRange.value);
    const units = base === 1000 ? ['bit','byte','kB','MB','GB'] : ['bit','byte','KiB','MiB','GiB'];
    extraLabs.querySelector('.unit-ladder').innerHTML = units.map((unit,index)=>`<button type="button" data-level="${index}" aria-pressed="${index===level}">${unit}</button>`).join('');
    extraLabs.querySelector('#unit-result').textContent = level === 0 ? '1 bit = 0.125 byte' : `1 ${units[level]} = ${(base ** (level - 1)).toLocaleString('en-US')} byte = ${(8 * base ** (level - 1)).toLocaleString('en-US')} bit`;
    unitRange.setAttribute('aria-valuetext', units[level]);
  }
  unitRange.oninput = convention.onchange = updateUnits;
  extraLabs.querySelector('.unit-ladder').onclick = event => {
    const button = event.target.closest('button[data-level]');
    if (!button) return;
    unitRange.value = button.dataset.level;
    updateUnits();
  };
  updateUnits();
  const character = extraLabs.querySelector('#character-choice');
  function updateCharacter() {
    const value = character.value;
    extraLabs.querySelector('.character-stage').textContent = value;
    extraLabs.querySelector('.codepoint-stage').textContent = `Unicode U+${value.codePointAt(0).toString(16).toUpperCase().padStart(4,'0')}`;
    const bytes = [...new TextEncoder().encode(value)];
    extraLabs.querySelector('.encoded-bytes').innerHTML = `<p>UTF-8 / ${bytes.length} byte</p><div>${bytes.map(byte=>`<span><strong>${byte.toString(16).toUpperCase().padStart(2,'0')}</strong><small>${byte.toString(2).padStart(8,'0')}</small></span>`).join('')}</div>`;
  }
  character.onchange = updateCharacter;
  updateCharacter();
  const fractionButtons = [...extraLabs.querySelectorAll('.fraction-bit')];
  fractionButtons.forEach(button => button.onclick = () => {
    button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
    const digits = fractionButtons.map(button => Number(button.getAttribute('aria-pressed') === 'true'));
    const eighths = digits[0] * 4 + digits[1] * 2 + digits[2];
    const terms = digits.flatMap((digit,index)=>digit ? [`1/${2 ** (index+1)}`] : []);
    extraLabs.querySelector('#fraction-result').textContent = `0.${digits.join('')}₂ = ${terms.length ? terms.join(' + ') + ' = ' : ''}${eighths/8}₁₀`;
    extraLabs.querySelectorAll('.fraction-meter span').forEach((segment,index)=>segment.classList.toggle('filled',index<eighths));
    extraLabs.querySelector('#fraction-feedback').textContent = eighths === 5 ? t('Đúng! ½ + ⅛ = 0.625.', '正解！½ + ⅛ = 0.625。') : t('Bật hoặc tắt các phần để thử tiếp.', '選ぶ部分を変えて試しましょう。');
  });
}
renderExtraLabs();
document.getElementById('reading-language').addEventListener('change',renderExtraLabs);

const radixTopic = document.getElementById('topic-4');
const radixReference = document.createElement('details');
radixReference.className = 'radix-reference';
const radixSummary = document.createElement('summary');
radixReference.append(radixSummary);
while (radixTopic.children.length > 1) radixReference.append(radixTopic.children[1]);
const radixLab = document.createElement('div');
radixLab.className = 'radix-lab';
radixTopic.append(radixLab, radixReference);
let radixBase = 2, radixValue = 0;
function renderRadix(previous = null) {
  radixSummary.textContent = t('Đọc giải thích đầy đủ', '詳しい解説を読む');
  const digits = radixValue.toString(radixBase).toUpperCase().padStart(2,'0');
  const old = previous === null ? digits : previous.toString(radixBase).toUpperCase().padStart(digits.length,'0');
  const carry = previous !== null && radixValue % radixBase === 0;
  radixLab.innerHTML = `<p class="radix-intro">${t('Mỗi hàng chỉ dùng n ký hiệu. Khi hết ký hiệu, hàng đó về 0 và chuyển 1 sang hàng bên trái.', '各桁はn種類の記号を使います。記号を使い切ると0に戻り、左の桁に1を繰り上げます。')}</p>
    <div class="radix-controls"><label for="radix-base">${t('Chọn hệ cơ số','基数を選ぶ')}</label><select id="radix-base">${[2,10,16].map(base=>`<option value="${base}" ${base===radixBase?'selected':''}>${base}</option>`).join('')}</select></div>
    <div class="radix-symbols" aria-label="${t('Các ký hiệu được dùng','使用する記号')}">${Array.from({length:radixBase},(_,i)=>`<span>${i.toString(16).toUpperCase()}</span>`).join('')}</div>
    <div class="radix-digits">${[...digits].map((digit,index)=>`<div class="radix-digit ${digit!==old[index]?'changed':''}"><small>${radixBase}^${digits.length-index-1}</small><strong>${digit}</strong><small>× ${radixBase ** (digits.length-index-1)}</small></div>`).join('')}</div>
    <div class="radix-actions"><button type="button" class="btn primary" id="radix-add" ${radixValue>=4095?'disabled':''}>+1</button><button type="button" class="btn" id="radix-carry">${t('Thử chuyển hàng','繰り上がりを試す')}</button><button type="button" class="btn" id="radix-reset">${t('Về 0','0に戻す')}</button></div>
    <output id="radix-equation">${[...digits].map((digit,index)=>`${parseInt(digit,16)} × ${radixBase ** (digits.length-index-1)}`).join(' + ')} = ${radixValue} (${t('hệ 10','10進数')})</output>
    <p id="radix-feedback" role="status">${previous === null ? t('Bấm +1 để quan sát từng hàng.','+1で各桁の変化を見ましょう。') : carry ? t(`${old} → ${digits}: hàng cuối về 0, chuyển 1 sang trái.`,`${old} → ${digits}：末尾が0に戻り、左へ繰り上がります。`) : `${old} → ${digits}`}</p>`;
  radixLab.querySelector('#radix-base').onchange = event => { radixBase = Number(event.target.value); renderRadix(); };
  radixLab.querySelector('#radix-add').onclick = () => { const previous = radixValue; radixValue++; renderRadix(previous); radixLab.querySelector('#radix-add').focus({preventScroll:true}); };
  radixLab.querySelector('#radix-carry').onclick = () => { radixValue = radixBase - 1; renderRadix(); radixLab.querySelector('#radix-add').focus({preventScroll:true}); };
  radixLab.querySelector('#radix-reset').onclick = () => { radixValue = 0; renderRadix(); radixLab.querySelector('#radix-reset').focus({preventScroll:true}); };
}
renderRadix();
document.getElementById('reading-language').addEventListener('change',()=>renderRadix());
