
const FLASHCARDS = [
  {cat:"unit", front:"ビット (bit)", back:"Đơn vị dữ liệu nhỏ nhất của máy tính. 1 bit chỉ nhận giá trị <b>0 hoặc 1</b>."},
  {cat:"unit", front:"バイト (byte)", back:"Tập hợp <b>8 bit</b>. 1 byte biểu diễn được 2⁸ = <b>256</b> trạng thái khác nhau."},
  {cat:"unit", front:"ビットパターン", back:"Dãy 0 và 1 (ví dụ '10010011'). Còn gọi là <b>ビット列 (bit string)</b>."},
  {cat:"unit", front:"テラ (T)", back:"10¹² = 1,000,000,000,000. Lớn nhất trong các đơn vị FE hay dùng."},
  {cat:"unit", front:"ピコ (p)", back:"10⁻¹² = 0.000000000001. Nhỏ nhất trong các tiền tố FE hay dùng."},
  {cat:"unit", front:"1 GB = ? bit", back:"1 GB = 10⁹ byte = 10⁹ × 8 = <b>8 × 10⁹ bit (80 億ビット)</b>."},
  {cat:"unit", front:"ミリ (m)", back:"10⁻³ = 0.001. Cấp đầu tiên của phía 'nhỏ' tính từ điểm gốc."},
  {cat:"unit", front:"文字コード", back:"Bộ mã quy định mỗi chữ tương ứng với dãy bit nào. Ví dụ: <b>Shift JIS, Unicode</b>. Cùng chữ \"あ\" có mã khác nhau ở các bộ mã khác nhau."},
  {cat:"base", front:"n進数 là gì?", back:"Cách biểu diễn số dùng <b>n ký hiệu</b>. Khi giá trị đạt n thì <b>nhảy lên 1 hàng (carry)</b>. n gọi là <b>基数 (cơ số)</b>."},
  {cat:"base", front:"基数 (cơ số)", back:"Số dùng làm chuẩn để nhảy hàng (桁上がり). 10進数 → 10; 2進数 → 2; 16進数 → 16."},
  {cat:"base", front:"2進数 dùng mấy ký hiệu?", back:"<b>2 ký hiệu: 0 và 1</b>. Đạt 2 thì carry. Đây là hệ máy tính dùng vì điện chỉ có Bật/Tắt."},
  {cat:"base", front:"16進数 dùng ký hiệu nào?", back:"<b>0–9 và A,B,C,D,E,F</b> (16 ký hiệu). A=10, B=11, C=12, D=13, E=14, F=15."},
  {cat:"base", front:"10進数 'A' trong 16進数 = ?", back:"A trong 16進数 = <b>10</b> trong 10進数. Ngược lại 10進数 \"10\" = 16進数 \"A\"."},
  {cat:"base", front:"Cách ghi (10)₂ vs (10)₁₀", back:"Vì viết giống nhau nhưng giá trị khác, phải ghi cơ số ở dưới ngoặc. (10)₂ = 2 trong 10進数; (10)₁₀ vẫn là 10."},
  {cat:"base", front:"Cách đọc 2進数 (10)₂", back:"Đọc là \"<b>いちぜろ</b>\" (ichi-zero) — KHÔNG đọc là \"じゅう\" như 10進数."},
  {cat:"weight", front:"桁の重み là gì?", back:"<b>Trọng số của mỗi hàng</b>. Đi sang trái dấu chấm thập phân thì ×n; đi sang phải thì ×1/n (chia n)."},
  {cat:"weight", front:"Công thức trọng số", back:"<b>Phần nguyên:</b> n⁰, n¹, n², n³…<br><b>Phần thập phân:</b> n⁻¹, n⁻², n⁻³…"},
  {cat:"weight", front:"Trọng số hàng 2進数", back:"Từ phải sang trái phần nguyên: <b>1, 2, 4, 8, 16, 32, 64</b>… Phần thập phân: <b>0.5, 0.25, 0.125</b>…"},
  {cat:"weight", front:"Trọng số hàng 10進数", back:"Phần nguyên: <b>1, 10, 100, 1000</b>… Phần thập phân: <b>0.1, 0.01, 0.001</b>…"},
  {cat:"dec", front:"整数部 vs 小数部", back:"Số thập phân chia bởi <b>小数点 (.)</b>: bên trái là <b>整数部 (phần nguyên)</b>, bên phải là <b>小数部 (phần thập phân)</b>."},
  {cat:"dec", front:"有限小数 (yuugen shousuu)", back:"Số thập phân <b>HỮU HẠN</b> — phần thập phân có số chữ số nhất định. Ví dụ: 0.5, 1.1, 0.25."},
  {cat:"dec", front:"無限小数 (mugen shousuu)", back:"Số thập phân <b>VÔ HẠN</b> — phần thập phân kéo dài mãi. Ví dụ: π = 3.1415…"},
  {cat:"dec", front:"循環小数 (junkan shousuu)", back:"Số thập phân <b>tuần hoàn</b> — vô hạn nhưng một cụm chữ số <b>lặp đi lặp lại</b>. Ví dụ: 1÷7 = 0.142857142857…"},
  {cat:"dec", front:"2進小数 / 16進小数", back:"Số thập phân không chỉ có ở hệ 10. Hệ 2 và hệ 16 cũng có số thập phân, gọi là <b>2進小数</b> và <b>16進小数</b>."},
];

function renderFC(cat){
  const grid = document.getElementById('fcGrid');
  grid.innerHTML = '';
  const items = cat==='all' ? FLASHCARDS : FLASHCARDS.filter(f=>f.cat===cat);
  items.forEach(f=>{
    const card = document.createElement('div');
    card.className='fc-card';
    const catLabel = {unit:'BIT/BYTE',base:'N進数',weight:'重み',dec:'小数'}[f.cat];
    card.innerHTML = `
      <span class="fc-cat">${catLabel}</span>
      <div class="fc-front">${f.front}</div>
      <div class="fc-back">${f.back}</div>
      <div class="hint">▸ CLICK ĐỂ LẬT</div>
    `;
    card.addEventListener('click', ()=>card.classList.toggle('flipped'));
    grid.appendChild(card);
  });
}
document.querySelectorAll('#fcFilter button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('#fcFilter button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderFC(btn.dataset.cat);
  });
});
renderFC('all');

const QUIZ = [
  {
    q: "1 ビット (bit) で表すことのできる状態の数はいくつか？<br><span style='color:var(--text-dim);font-size:0.88rem'>1 bit biểu diễn được bao nhiêu trạng thái?</span>",
    opts: ["1 通り (1 trạng thái)", "2 通り (2 trạng thái)", "8 通り (8 trạng thái)", "256 通り (256 trạng thái)"],
    ans: 1,
    expl: "<b>Đáp án: B.</b> 1 bit chỉ nhận giá trị 0 hoặc 1 → 2 trạng thái (2¹). 256 là số trạng thái của <b>1 byte (8 bit)</b> = 2⁸."
  },
  {
    q: "1 バイト (byte) は何ビットか？<br><span style='color:var(--text-dim);font-size:0.88rem'>1 byte gồm bao nhiêu bit?</span>",
    opts: ["4 bit", "8 bit", "16 bit", "32 bit"],
    ans: 1,
    expl: "<b>Đáp án: B.</b> 1 byte = <b>8 bit</b>. Đây là định nghĩa chuẩn. Với 8 bit ta có 2⁸ = 256 trạng thái."
  },
  {
    q: "次のうち、無限小数（循環小数）に該当するものはどれか？<br><span style='color:var(--text-dim);font-size:0.88rem'>Số nào là số thập phân vô hạn tuần hoàn (循環小数)?</span>",
    opts: ["0.5", "0.25", "1 ÷ 7 = 0.142857142857…", "π = 3.14159265…"],
    ans: 2,
    expl: "<b>Đáp án: C.</b> 1÷7 = 0.142857142857… lặp cụm \"142857\" → <b>循環小数</b>. (A) 0.5 và (B) 0.25 là <b>有限小数</b>. (D) π là <b>無限小数</b> nhưng KHÔNG tuần hoàn."
  },
  {
    q: "16進数の \"A\" は10進数でいくつか？<br><span style='color:var(--text-dim);font-size:0.88rem'>Hex \"A\" tương ứng số nào trong hệ 10?</span>",
    opts: ["9", "10", "15", "16"],
    ans: 1,
    expl: "<b>Đáp án: B.</b> Trong 16進数: A=10, B=11, C=12, D=13, E=14, F=15. (D) 16 là khi viết \"10\" trong hệ 16."
  },
  {
    q: "2進数で \"111\" の次の数はいくつか？<br><span style='color:var(--text-dim);font-size:0.88rem'>Trong hệ 2, số tiếp theo sau 111 là?</span>",
    opts: ["112", "120", "1000", "1111"],
    ans: 2,
    expl: "<b>Đáp án: C.</b> 2進数 chỉ có 0/1. 111 + 1: hàng cuối 1+1=10 (carry); lan truyền carry hết các hàng → <b>1000</b>. = 10進数 8. (A) và (B) sai vì 2進数 không có chữ số ≥ 2."
  },
  {
    q: "1 GB は何バイトか？<br><span style='color:var(--text-dim);font-size:0.88rem'>1 GB bằng bao nhiêu byte?</span>",
    opts: ["10³ バイト", "10⁶ バイト", "10⁹ バイト", "10¹² バイト"],
    ans: 2,
    expl: "<b>Đáp án: C.</b> Theo bảng đơn vị: G = 10⁹ (Giga). Nên 1 GB = <b>10⁹ byte = 10 億バイト</b>. (A) là kB, (B) là MB, (D) là TB."
  },
  {
    q: "2進数 \"1011\" の各桁の重みとして正しい組合せはどれか？(左から)<br><span style='color:var(--text-dim);font-size:0.88rem'>Trọng số từng hàng của 2進数 \"1011\" (từ trái sang) là?</span>",
    opts: ["1, 2, 4, 8", "8, 4, 2, 1", "2, 4, 8, 16", "0.5, 0.25, 0.125, 0.0625"],
    ans: 1,
    expl: "<b>Đáp án: B.</b> Trọng số 2進数 từ <b>trái sang phải</b> phần nguyên: <b>8, 4, 2, 1</b> (= 2³, 2², 2¹, 2⁰). (A) bị đảo ngược. (D) là phần thập phân."
  },
  {
    q: "10進数の \"15\" を16進数で表したものはどれか？<br><span style='color:var(--text-dim);font-size:0.88rem'>Số 15 (hệ 10) viết trong hệ 16 là?</span>",
    opts: ["F", "10", "15", "1F"],
    ans: 0,
    expl: "<b>Đáp án: A.</b> Theo bảng đối chiếu, 10進数 15 = 16進数 <b>F</b>. (B) \"10\" trong hệ 16 là 10進数 16. (C) \"15\" trong hệ 16 là 10進数 21. (D) \"1F\" là 31."
  },
  {
    q: "「ある桁から同じ数字の列が無限に繰り返される小数」を何と呼ぶか？<br><span style='color:var(--text-dim);font-size:0.88rem'>Số thập phân mà từ một hàng nào đó <b>cùng cụm chữ số lặp đi lặp lại vô hạn</b> gọi là gì?</span>",
    opts: ["有限小数", "無限小数", "循環小数", "2進小数"],
    ans: 2,
    expl: "<b>Đáp án: C.</b> Đó là <b>循環小数 (tuần hoàn)</b> — ví dụ 1÷7. (A) có số chữ số nhất định. (B) chỉ vô hạn (có thể không tuần hoàn như π). (D) là số thập phân hệ 2."
  },
  {
    q: "コンピュータが文字を扱う際に使うのはどれか？<br><span style='color:var(--text-dim);font-size:0.88rem'>Khi máy tính xử lý chữ thì nó dùng cái gì?</span>",
    opts: ["小数点", "基数", "文字コード", "ビットパターン辞書"],
    ans: 2,
    expl: "<b>Đáp án: C.</b> Máy tính chỉ xử lý 0/1, nên cần <b>文字コード (bộ mã ký tự)</b> để gán mỗi chữ thành 1 dãy bit. Ví dụ \"あ\" trong Shift JIS = 1000 0010 1010 0000, trong Unicode = mã khác. (A) là dấu chấm thập phân. (B) là cơ số. (D) không phải khái niệm chuẩn."
  }
];

let score = 0, answered = 0;
let restoring = false;
let picks = FE.read("theory:1", []);
if(!Array.isArray(picks)) picks=[];

function renderQuiz(){
  const area = document.getElementById('quizArea');
  area.innerHTML = '';
  score = 0; answered = 0;
  QUIZ.forEach((item, idx)=>{
    const q = document.createElement('div');
    q.className = 'quiz-q';
    q.dataset.idx = idx;
    let optsHtml = '';
    item.opts.forEach((opt, oi)=>{
      const letter = ['A','B','C','D'][oi];
      optsHtml += `<div class="opt" data-oi="${oi}"><span class="ltr">${letter}.</span><span>${opt}</span></div>`;
    });
    q.innerHTML = `
      <div class="qnum">CÂU ${idx+1} / 10</div>
      <div class="qtext">${item.q}</div>
      <div class="opts">${optsHtml}</div>
      <div class="expl">${item.expl}</div>
    `;
    area.appendChild(q);
    q.querySelectorAll('.opt').forEach(optEl=>{
      optEl.addEventListener('click', ()=>{
        if(q.classList.contains('locked')) return;
        const chosen = parseInt(optEl.dataset.oi, 10);
        if(!restoring){picks[idx]=chosen;FE.write("theory:1",picks);}
        const correct = item.ans;
        q.classList.add('locked');
        const correctEl = q.querySelector('.opt[data-oi="'+correct+'"]');
        if(correctEl) correctEl.classList.add('correct');
        if(chosen !== correct){
          optEl.classList.add('wrong');
        } else {
          score++;
        }
        answered++;
        if(answered === QUIZ.length && !restoring) showResult();
      });
    });
  });
  document.getElementById('quiz-result').classList.remove('show');
}

function showResult(){
  const pct = Math.round((score/QUIZ.length)*100);
  document.getElementById('qScore').textContent = score + ' / ' + QUIZ.length;
  let verdict = '';
  if(pct >= 90) verdict = '🏆 Xuất sắc! Sẵn sàng cho Lesson tiếp theo.';
  else if(pct >= 70) verdict = '👍 Khá tốt — Ôn lại 1-2 câu sai là OK.';
  else if(pct >= 50) verdict = '📚 Trung bình — Đọc lại Phần 1.';
  else verdict = '💪 Cần cố gắng — Quay lại đọc lý thuyết từ đầu.';
  document.getElementById('qVerdict').textContent = verdict + ' (' + pct + '%)';
  document.getElementById('quiz-result').classList.add('show');
  document.getElementById('quiz-result').scrollIntoView({behavior:'smooth', block:'center'});
}

function resetQuiz(){
  picks=[];FE.write("theory:1",picks);
  renderQuiz();
  document.getElementById('quizArea').scrollIntoView({behavior:'smooth', block:'start'});
}

renderQuiz();

restoring=true;
picks.forEach((p,i)=>{if(Number.isInteger(p)&&p>=0&&p<4)document.querySelectorAll('#quizArea .quiz-q')[i]?.querySelector('[data-oi="'+p+'"]')?.click();});
restoring=false;
if(answered===QUIZ.length) {document.getElementById('qScore').textContent=score+' / '+QUIZ.length;document.getElementById('quiz-result').classList.add('show');}
