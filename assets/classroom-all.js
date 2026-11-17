/* Universal Interactive Classroom Engine for FE Master (Lessons 01–61) */
'use strict';
(() => {
  const dataEl = document.getElementById('lesson-data');
  if (!dataEl) return;
  let lessonData;
  try { lessonData = JSON.parse(dataEl.textContent); } catch { return; }
  const num = Number(lessonData.number);
  if (!Number.isInteger(num)) return;

  const isExplicitOriginal = location.search.includes('classroom=0');
  const isExplicitClassroom = location.search.includes('classroom=1') || document.body.classList.contains('classroom');
  const isLiveWeb = (window !== window.top) || (location.protocol.startsWith('http') && location.hostname !== '127.0.0.1');
  const getLang = () => document.getElementById('reading-language')?.value || document.documentElement.dataset.readingLang || 'dual';
  const tr = (vi, ja) => getLang() === 'ja' ? ja : vi;

  // Ensure standalone lesson pages also have the floating Pomodoro widget and break auto-scroll
  if (window === window.top && location.protocol.startsWith('http') && location.hostname !== '127.0.0.1') {
    if (!document.querySelector('link[href$="pomodoro.css"]')) {
      const pomoCss = document.createElement('link');
      pomoCss.rel = 'stylesheet';
      pomoCss.href = '../assets/pomodoro.css';
      document.head.append(pomoCss);
    }
    if (!window.PomodoroTimer && !document.querySelector('script[src$="pomodoro.js"]')) {
      const pomoScript = document.createElement('script');
      pomoScript.src = '../assets/pomodoro.js';
      document.head.append(pomoScript);
    }
    window.addEventListener('fe-pomodoro-break', () => {
      const relaxEl = document.getElementById('lesson-relax');
      if (relaxEl) {
        relaxEl.hidden = false;
        relaxEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  if (isExplicitOriginal) {
    const hero = document.querySelector('.lesson-hero');
    if (hero && !hero.querySelector('.classroom-switch')) {
      const link = document.createElement('a');
      link.className = 'reading-back classroom-switch';
      link.href = '?classroom=1';
      link.textContent = tr('✦ Mở Lớp học tương tác', '✦ 対話モードを開く');
      hero.prepend(link, document.createElement('br'));
    }
    return;
  }

  if (!isExplicitClassroom && !isLiveWeb) return;

  // Helper to attach interactive "Predict before opening solution" bar to examples in #p2
  function attachExamplePredictions() {
    const p2 = document.getElementById('p2');
    if (!p2) return;

    // 1. Standard .example-box (Lessons 1–20: both wrapped .reading-vi/.reading-ja and direct .example-box)
    const exampleTargets = [];
    p2.querySelectorAll('.example-box').forEach(eb => {
      const langChildren = [...eb.querySelectorAll(':scope > .reading-ja, :scope > .reading-vi')];
      if (langChildren.length) exampleTargets.push(...langChildren);
      else exampleTargets.push(eb);
    });
    exampleTargets.forEach((box, idx) => {
      const isJa = box.classList.contains('reading-ja') || (!box.classList.contains('reading-vi') && getLang() === 'ja');
      let solution = box.querySelector(':scope > details.example-solution');
      if (!solution) {
        solution = document.createElement('details');
        solution.className = 'example-solution';
        const summary = document.createElement('summary');
        summary.dataset.vi = '💡 Mở các bước giải';
        summary.dataset.ja = '💡 解説の手順を見る';
        summary.textContent = isJa ? summary.dataset.ja : summary.dataset.vi;
        solution.append(summary);
        const children = [...box.children];
        const qIdx = children.findIndex(c => c.tagName === 'P');
        if (qIdx !== -1 && children.length > qIdx + 1) {
          children.slice(qIdx + 1).forEach(c => solution.append(c));
          box.append(solution);
        }
      }
      if (box.querySelector(':scope > .example-predict')) return;
      const steps = [...solution.querySelectorAll('.step b, .step strong')].map(b => b.textContent.trim()).filter(s => s && s.length <= 32 && !/^(Bước|手順|Kết quả|答え|Giải|Chú ý|Lưu ý)/.test(s));
      const targetAns = steps[steps.length - 1];
      if (!targetAns) return;
      let alt1 = isJa ? '2倍の値' : 'Gấp đôi giá trị đó';
      let alt2 = isJa ? '半分 (1/2)' : 'Một nửa (1/2)';
      if (/^[01]{3,8}$/.test(targetAns)) {
        alt1 = targetAns.slice(0, -1) + (targetAns.endsWith('1') ? '0' : '1');
        alt2 = (targetAns[0] === '1' ? '10' : '11') + targetAns.slice(2);
        if (alt2 === targetAns) alt2 = targetAns + '0';
      } else if (/^-?\d+(\.\d+)?$/.test(targetAns)) {
        const nVal = Number(targetAns);
        alt1 = String(nVal + (Number.isInteger(nVal) ? 2 : 0.25));
        alt2 = String(Math.max(0, nVal - (Number.isInteger(nVal) ? 1 : 0.125)));
      }
      const choices = [...new Set([targetAns, alt1, alt2])];
      if (choices.length < 2) return;
      const rotated = choices.map((_, i) => choices[(i + idx) % choices.length]);

      const pred = document.createElement('div');
      pred.className = 'example-predict';
      pred.innerHTML = `<span class="example-predict-label">${isJa ? '🤔 解説を見る前に予想してみましょう：' : '🤔 Đoán nhanh kết quả trước khi mở bước giải:'}</span>
        <div class="example-predict-opts"></div>
        <p class="example-predict-feedback" role="status"></p>`;
      const optsWrap = pred.querySelector('.example-predict-opts');
      const fb = pred.querySelector('.example-predict-feedback');
      rotated.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isCorrect = opt === targetAns;
        btn.dataset.correct = String(isCorrect);
        btn.textContent = opt;
        btn.onclick = () => {
          optsWrap.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
          fb.textContent = isCorrect
            ? (isJa ? '✓ その通り！下の「解説の手順を見る」で途中の計算を確認しましょう。' : '✓ Chính xác! Hãy bấm mở các bước giải bên dưới để xem cách trình bày nhé.')
            : (isJa ? `💡 惜しい！正解は「${targetAns}」です。下の解説で手順を確認しましょう。` : `💡 Gợi ý: Kết quả đúng là "${targetAns}". Bấm mở bước giải bên dưới để xem vì sao nhé!`);
        };
        optsWrap.append(btn);
      });
      solution.before(pred);
    });

    // 2. Worked examples & cards in Lessons 14, 21–61
    p2.querySelectorAll('.worked-example, #p2 > .card:not(.worked-example)').forEach((card, idx) => {
      if (card.classList.contains('worked-example')) {
        const details = card.querySelector('details.worked-reasoning');
        if (details && !card.querySelector('.example-predict') && lessonData.quiz?.[0]) {
          const q0 = lessonData.quiz[0];
          const pred = document.createElement('div');
          pred.className = 'example-predict';
          const renderWorkedPred = () => {
            const ja = getLang() === 'ja';
            const opts = (ja && q0.optsJa?.length ? q0.optsJa : q0.opts).map(o => o.replace(/<[^>]+>/g, '').trim());
            pred.innerHTML = `<span class="example-predict-label">${ja ? '🤔 手順を開く前にクイック予想：' : '🤔 Thử phán đoán nhanh trước khi mở lời giải:'}</span>
              <div class="example-predict-opts"></div>
              <p class="example-predict-feedback" role="status"></p>`;
            const wrap = pred.querySelector('.example-predict-opts');
            const fb = pred.querySelector('.example-predict-feedback');
            opts.slice(0, 3).forEach((opt, i) => {
              const b = document.createElement('button');
              b.type = 'button';
              const ok = i === q0.ans || (q0.ans >= 3 && i === 0);
              const label = i === 0 && q0.ans >= 3 ? opts[q0.ans] : opt;
              const isAns = label === opts[q0.ans];
              b.dataset.correct = String(isAns);
              b.textContent = label;
              b.onclick = () => {
                wrap.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
                fb.textContent = isAns
                  ? (ja ? '✓ 正解！下の解説を開いて考え方を確認しましょう。' : '✓ Hợp lý! Mở lời giải từng bước bên dưới để kiểm chứng nhé.')
                  : (ja ? '💡 下の手順を開いて、どこがポイントか確認してみましょう。' : '💡 Hãy mở lời giải từng bước bên dưới để xem điểm mấu chốt nhé!');
              };
              wrap.append(b);
            });
          };
          renderWorkedPred();
          document.getElementById('reading-language')?.addEventListener('change', renderWorkedPred);
          details.before(pred);
        }
        return;
      }
      // Secondary example cards in #p2
      if (card.querySelector('details.example-solution')) return;
      const sol = document.createElement('details');
      sol.className = 'example-solution';
      const sum = document.createElement('summary');
      const updateSum = () => { sum.textContent = tr('💡 Mở phân tích & đáp án mẫu', '💡 解説と解答のポイントを見る'); };
      updateSum();
      document.getElementById('reading-language')?.addEventListener('change', updateSum);
      sol.append(sum);
      const children = [...card.children].filter(el => el.tagName !== 'H3');
      if (children.length > 0) {
        children.forEach(c => sol.append(c));
        card.append(sol);
      }
    });
  }

  // If Lesson 01 already has classroom.js in HTML (e.g. 1-classroom.html), run attachExamplePredictions after defer scripts
  if (num === 1 && (document.getElementById('bit-lab') || document.querySelector('script[src$="classroom.js"]'))) {
    setTimeout(attachExamplePredictions, 0);
    return;
  }

  // If Lesson 01 (1.html) is opened in Classroom Mode, load the dedicated Lesson 01 Classroom scripts
  if (num === 1 && !document.getElementById('bit-lab')) {
    document.body.classList.add('lesson-one', 'classroom');
    const hero = document.querySelector('.lesson-hero');
    if (hero && !hero.querySelector('.reading-back')) {
      const back = document.createElement('a');
      back.className = 'reading-back';
      back.href = '1.html?classroom=0';
      back.textContent = '← Bản đọc gốc / 元のページ';
      hero.prepend(back, document.createElement('br'));
    }
    const loadSeq = async () => {
      for (const src of ['../assets/classroom.js', '../assets/classroom-labs.js', '../assets/classroom-clarity.js']) {
        await new Promise((resolve) => {
          const s = document.createElement('script');
          s.src = src;
          s.onload = s.onerror = resolve;
          document.head.append(s);
        });
      }
      attachExamplePredictions();
    };
    loadSeq();
    return;
  }

  // For Lessons 02–61: Activate Universal Classroom Mode
  document.body.classList.add('classroom');
  const classroomMain = document.querySelector('.reading-main');
  if (!classroomMain) return;

  const hero = classroomMain.querySelector('.lesson-hero');
  if (hero && !hero.querySelector('.classroom-switch')) {
    const back = document.createElement('a');
    back.className = 'reading-back classroom-switch';
    back.href = '?classroom=0';
    back.textContent = tr('← Bản đọc gốc / 元のページ', '← 元のページへ戻る');
    hero.prepend(back, document.createElement('br'));
  }

  // Build 5-Step Classroom Toolbar & Micro-Lab Container (#bit-lab)
  const classroomSteps = ['bit-lab', 'p1', 'p2', 'p3', 'p4'];
  let classroomStep = 0;
  let classroomAll = false;
  const classroomLabels = [
    ['Thử nghiệm tương tác', '対話ラボを試す'],
    ['Hiểu kiến thức', '理論を学ぶ'],
    ['Xem ví dụ', '例を読む'],
    ['Lật thẻ ôn tập', '暗記カード'],
    ['Tự kiểm tra', '確認テスト']
  ];

  const classroomToolbar = document.createElement('nav');
  classroomToolbar.className = 'classroom-toolbar';
  classroomToolbar.setAttribute('aria-label', 'Các bước học / 学習ステップ');

  const classroomLab = document.createElement('section');
  classroomLab.id = 'bit-lab';
  classroomLab.className = 'bit-lab';
  hero.after(classroomToolbar, classroomLab);

  const classroomNext = document.createElement('button');
  classroomNext.type = 'button';
  classroomNext.className = 'btn primary classroom-next';
  const footer = classroomMain.querySelector('.lesson-footer');
  if (footer) footer.before(classroomNext);

  function renderClassroomNavigation(scroll = false) {
    classroomToolbar.replaceChildren();
    classroomLabels.forEach((labels, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = `${index + 1}. ${tr(...labels)}`;
      if (!classroomAll && index === classroomStep) button.setAttribute('aria-current', 'step');
      button.onclick = () => { classroomStep = index; classroomAll = false; renderClassroomNavigation(true); };
      classroomToolbar.append(button);
    });
    const all = document.createElement('button');
    all.type = 'button';
    all.textContent = tr('Xem toàn bộ bài', '全文を表示');
    all.setAttribute('aria-pressed', String(classroomAll));
    all.onclick = () => { classroomAll = !classroomAll; renderClassroomNavigation(); };
    classroomToolbar.append(all);

    classroomSteps.forEach((id, index) => {
      const el = document.getElementById(id);
      if (el) el.hidden = !classroomAll && index !== classroomStep;
    });
    const recap = document.querySelector('.lesson-recap');
    if (recap) recap.hidden = !classroomAll && classroomStep !== 1;
    const relax = document.getElementById('lesson-relax');
    if (relax) relax.hidden = false;

    classroomNext.hidden = classroomAll || classroomStep === classroomSteps.length - 1;
    classroomNext.textContent = tr('Phần tiếp theo →', '次のステップ →');
    classroomNext.onclick = () => { classroomStep++; renderClassroomNavigation(true); };

    if (scroll) {
      classroomToolbar.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      const activeEl = document.getElementById(classroomSteps[classroomStep]);
      if (activeEl) {
        activeEl.setAttribute('tabindex', '-1');
        activeEl.focus({ preventScroll: true });
      }
    }
  }

  // Topic-specific Interactive Micro-Lab definitions for Lessons 02–61
  function getMicroLabConfig(n) {
    const configs = {
      2: {
        tag: '02 / 基数変換 · ĐỔI CƠ SỐ',
        title: ['Máy đổi cơ số trực quan (10進 ↔ 2進 ↔ 16進)', '基数変換シミュレータ（10進 ↔ 2進 ↔ 16進）'],
        intro: ['Kéo thanh trượt hoặc chọn một con số để xem phép chia lấy dư từ dưới lên và cách gom 4 bit thành 1 chữ số Hex.', 'スライダーで値を選び、連続割り算の余り（下から上）と4ビットずつの16進変換を確認しましょう。'],
        hook: ['💡 Câu hỏi thực tế: Tại sao lập trình viên luôn nhìn địa chỉ bộ nhớ bằng hệ 16 (như 0xFF) thay vì hệ 2?', '💡 疑問：なぜプログラマはメモリアドレスを2進数ではなく16進数（0xFFなど）で読むのでしょうか？'],
        type: 'radix-converter'
      },
      3: {
        tag: '03 / 2の補数 · SỐ ÂM NHỊ PHÂN',
        title: ['Bàn thử Bù 2 (2の補数): Đảo bit rồi Cộng 1', '2の補数シミュレータ：ビット反転＋1'],
        intro: ['Chọn một số nguyên rồi bấm qua 3 bước để xem máy tính biến số dương thành số âm mà không cần dấu trừ.', '数値を選んで3つのステップを押し、マイナス記号なしで負の数を表す仕組みを体験しましょう。'],
        hook: ['💡 Câu hỏi thực tế: Vì sao máy tính chỉ có mạch Cộng nhưng lại tính được phép Trừ 25 - 7?', '💡 疑問：加算回路しか持たないCPUが、どうやって引き算（25 - 7）を計算しているのでしょうか？'],
        type: 'twos-complement'
      },
      4: {
        tag: '04 / シフト演算 · DỊCH BIT NHÂN CHIA',
        title: ['Thanh ghi dịch bit: Dịch trái ×2, Dịch phải ÷2', 'ビットシフト実験室：左シフト×2・右シフト÷2'],
        intro: ['Bấm dịch trái (<<) hoặc dịch phải (>>) để quan sát các bit trượt đi và giá trị tăng/giảm theo lũy thừa của 2.', '左右のシフトボタンを押して、ビットの移動と2ⁿ倍の計算を視覚的に確かめましょう。'],
        hook: ['💡 Mẹo phòng thi: Muốn nhân một số với 10 cực nhanh, CPU chỉ cần dịch trái 3 bit (×8) cộng dịch trái 1 bit (×2)!', '💡 試験のコツ：×10は「3ビット左シフト(×8)＋1ビット左シフト(×2)」に分解できます！'],
        type: 'bit-shift'
      },
      5: {
        tag: '05 / 論理演算 · PHÉP TOÁN LOGIC',
        title: ['Mặt nạ Bit (Bitmask): AND để lọc, OR để bật, XOR để đảo', 'ビットマスク実験：AND抽出・ORセット・XOR反転'],
        intro: ['Chọn phép toán rồi bấm thay đổi bit để hiểu cách dùng mặt nạ (Mask) điều khiển từng bit riêng lẻ.', '演算の種類を選び、ビットを切り替えてマスク処理の動きを確認しましょう。'],
        hook: ['💡 Ứng dụng thật: Subnet Mask trong mạng máy tính chính là phép AND bit để tìm ra địa chỉ mạng!', '💡 実例：ネットワークのサブネットマスクは、AND演算でネットワーク部を取り出しています。'],
        type: 'logic-gate'
      },
      6: {
        tag: '06 / 論理回路 · MẠCH LOGIC & BỘ CỘNG',
        title: ['Mạch cộng nửa (Half Adder): Ghép XOR và AND', '半加算器（Half Adder）回路シミュレータ'],
        intro: ['Bật tắt 2 công tắc đầu vào A và B để xem dòng điện chạy qua cổng XOR tạo ra Tổng (S) và cổng AND tạo ra Nhớ (C).', '入力A・Bを切り替えて、排他的論理和(XOR)で桁(S)、論理積(AND)で桁上がり(C)が作られる様子を見ましょう。'],
        hook: ['💡 Bản chất phần cứng: Hàng tỷ bóng bán dẫn trong CPU thực chất chỉ ghép từ các cổng AND, OR, NOT cơ bản này!', '💡 本質：最新のCPUも、基本はこのAND・OR・NOTゲートの組み合わせで計算しています。'],
        type: 'logic-gate'
      },
      7: {
        tag: '07 / 逆ポーランド表記法 · KÝ PHÁP BA LAN NGƯỢC',
        title: ['Máy tính Stack RPN: Không cần dấu ngoặc!', '逆ポーランド表記法（RPN）スタック計算機'],
        intro: ['Bấm từng bước để xem máy tính đọc biểu thức hậu tố, đẩy số vào Stack và lấy 2 số ra tính mỗi khi gặp dấu phép toán.', 'ステップを進めて、数値をスタックに積み、演算子で2つ取り出して計算する流れを体験しましょう。'],
        hook: ['💡 Tại sao máy tính thích viết "3 4 +" hơn "3 + 4"? Vì không bao giờ phải lo thứ tự ưu tiên nhân chia hay dấu ngoặc!', '💡 なぜ「3 4 +」と書くのか？ カッコや優先順位を気にせず左から1回読むだけで計算できるからです。'],
        type: 'stack-sim'
      },
      11: {
        tag: '11 / データ構造 · STACK vs QUEUE',
        title: ['Bàn thử Stack (LIFO) đối đầu Queue (FIFO)', 'スタック（LIFO）とキュー（FIFO）の比較実験'],
        intro: ['Thử đẩy các khối dữ liệu vào và lấy ra để thấy sự khác biệt giữa Vào sau ra trước (Stack) và Vào trước ra trước (Queue).', 'データの追加と取り出しを操作して、後入れ先出し(LIFO)と先入れ先出し(FIFO)の違いを比べましょう。'],
        hook: ['💡 Liên tưởng nhanh: Nút Back trên trình duyệt dùng Stack, còn hàng đợi lệnh in máy in dùng Queue!', '💡 身近な例：ブラウザの「戻る」ボタンはスタック、プリンタの印刷待ちはキューです。'],
        type: 'stack-sim'
      },
      12: {
        tag: '12 / 探索アルゴリズム · TÌM KIẾM NHỊ PHÂN',
        title: ['Đua tốc độ: Tìm tuần tự vs Tìm nhị phân (Binary Search)', '線形探索 vs 2分探索（バイナリサーチ）比較ラボ'],
        intro: ['Chọn con số cần tìm và bấm "Chia đôi" để thấy Tìm kiếm nhị phân loại bỏ một nửa mảng chỉ sau mỗi bước!', '探したい数値を選び、「半分に絞る」を押して2分探索の圧倒的な速さを体験しましょう。'],
        hook: ['💡 Sức mạnh log₂(N): Với 1 triệu phần tử đã sắp xếp, Tìm nhị phân chỉ cần tối đa 20 lần so sánh thay vì 1 triệu lần!', '💡 威力：100万件の整列済みデータでも、2分探索なら最大わずか20回の比較で見つかります。'],
        type: 'search-sim'
      },
      16: {
        tag: '16 / パイプライン処理 · ĐƯỜNG ỐNG CPU',
        title: ['Mô phỏng Pipeline CPU: Chạy gối đầu lệnh như dây chuyền', 'CPUパイプライン処理シミュレータ'],
        intro: ['Kéo thanh trượt chọn số lệnh để so sánh tổng số chu kỳ giữa chạy tuần tự từng lệnh và chạy chồng lấp Pipeline.', '命令数を変えて、逐次処理とパイプライン処理の所要クロック数の差を比べましょう。'],
        hook: ['💡 Giống giặt đồ: Thay vì đợi Giặt + Sấy + Gấp xong mẻ 1 mới giặt mẻ 2, vừa đưa mẻ 1 sang máy sấy là giặt luôn mẻ 2!', '💡 洗濯と同じ：1回目の乾燥中に2回目を洗い始めることで、全体の時間を大幅に短縮します。'],
        type: 'formula-sim'
      },
      17: {
        tag: '17 / キャッシュメモリ · BỘ NHỚ ĐỆM CACHE',
        title: ['Máy tính Thời gian truy cập hiệu dụng (EAT)', '実効アクセス時間（EAT）シミュレータ'],
        intro: ['Kéo thanh trượt thay đổi tỷ lệ Cache Hit (ヒット率) để thấy tốc độ truy cập bộ nhớ trung bình thay đổi mạnh thế nào.', 'ヒット率スライダーを動かして、キャッシュが実効アクセス時間をどれだけ短縮するか確認しましょう。'],
        hook: ['💡 Chỉ cần tăng Cache Hit từ 80% lên 95%, thời gian CPU phải chờ RAM đã giảm đi hơn một nửa!', '💡 ヒット率が80%から95%に上がるだけで、CPUの待ち時間は半分以下に減ります。'],
        type: 'formula-sim'
      },
      18: {
        tag: '18 / RAID構成 · AN TOÀN Ổ ĐĨA RAID',
        title: ['Phòng thử nghiệm RAID 0 / RAID 1 / RAID 5', 'RAID 0・RAID 1・RAID 5 耐障害性シミュレータ'],
        intro: ['Chọn cấu hình RAID để xem dung lượng thực dùng và thử giả lập hỏng 1 ổ đĩa xem dữ liệu có còn an toàn không.', 'RAIDレベルを切り替えて実効容量と1台故障時のデータ復旧可否を比較しましょう。'],
        hook: ['💡 Nhớ 3 chữ: RAID 0 = Chia nhanh nhưng mất hết nếu hỏng; RAID 1 = Soi gương 50%; RAID 5 = Parity (N-1 ổ)!', '💡 要点：RAID 0は高速だが無保証、RAID 1はミラーリング、RAID 5はパリティで1台故障に耐えます。'],
        type: 'formula-sim'
      },
      19: {
        tag: '19 / 稼働率 (MTBF・MTTR) · ĐỘ KHẢ DỤNG HỆ THỐNG',
        title: ['Mô phỏng Độ khả dụng: Nối tiếp vs Song song', '稼働率（MTBF/MTTR）と直列・並列システム実験'],
        intro: ['Điều chỉnh độ khả dụng của từng máy chủ để thấy vì sao ghép Song song (Dual/Duplex) giúp hệ thống đạt 99.99% uptime.', '各装置の稼働率を変えて、直列接続と並列接続でシステム全体の稼働率がどう変わるか試しましょう。'],
        hook: ['💡 Quy tắc vàng: Nối tiếp làm giảm độ tin cậy (A₁ × A₂), còn Song song làm tăng độ tin cậy (1 - (1-A₁)(1-A₂))!', '💡 鉄則：直列は稼働率が下がり（A₁×A₂）、並列は1台動けば継続できるため稼働率が上がります。'],
        type: 'formula-sim'
      }
    };
    return configs[n] || {
      tag: `${String(n).padStart(2, '0')} / INTERACTIVE MICRO-LAB`,
      title: [
        `Phòng thí nghiệm tương tác · Bài ${String(n).padStart(2, '0')}`,
        `インタラクティブ実験室 · レッスン${String(n).padStart(2, '0')}`
      ],
      intro: [
        'Bấm vào các nút tình huống bên dưới để kiểm nghiệm nhanh cơ chế cốt lõi trước khi vào phần lý thuyết.',
        '下のシナリオボタンを押して、本文を読む前に 핵심メカニズムを体感しましょう。'
      ],
      hook: [
        '💡 Mẹo học nhanh: Hiểu cơ chế "vì sao" qua tình huống thực tế giúp bạn làm câu hỏi biến tấu trong đề FE mà không cần học vẹt!',
        '💡 学習のコツ：丸暗記ではなく「なぜそうなるか」の仕組みを押さえると、応用問題も迷わず解けます。'
      ],
      type: 'card-explorer'
    };
  }

  const labConfig = getMicroLabConfig(num);

  // Render Step 1 (#bit-lab) interactive simulation
  function renderStepOneLab() {
    classroomLab.replaceChildren();
    const header = document.createElement('div');
    header.className = 'lab-heading';
    header.innerHTML = `<span>${labConfig.tag}</span>
      <h2 id="lab-title">${tr(...labConfig.title)}</h2>
      <p id="lab-intro">${tr(...labConfig.intro)}</p>`;
    classroomLab.append(header);

    const stage = document.createElement('div');
    stage.className = 'micro-lab-stage';
    classroomLab.append(stage);

    if (labConfig.type === 'radix-converter') {
      let val = 45, base = 2;
      const update = () => {
        const steps = [];
        let cur = val;
        if (cur === 0) steps.push({ q: 0, r: '0', from: 0 });
        while (cur > 0) {
          const r = (cur % base).toString(16).toUpperCase();
          const next = Math.floor(cur / base);
          steps.push({ from: cur, q: next, r });
          cur = next;
        }
        const converted = val.toString(base).toUpperCase();
        stage.innerHTML = `
          <div class="micro-lab-controls">
            <label for="mc-val">${tr('Giá trị hệ 10:', '10進数の値:')}</label>
            <input id="mc-val" type="range" min="1" max="255" value="${val}" style="max-width:220px"/>
            <strong>${val}₁₀</strong>
            <label for="mc-base">${tr('Đổi sang hệ:', '変換先の基数:')}</label>
            <select id="mc-base">
              <option value="2" ${base === 2 ? 'selected' : ''}>${tr('Hệ 2 (2進数)', '2進数 (Base 2)')}</option>
              <option value="8" ${base === 8 ? 'selected' : ''}>${tr('Hệ 8 (8進数)', '8進数 (Base 8)')}</option>
              <option value="16" ${base === 16 ? 'selected' : ''}>${tr('Hệ 16 (16進数)', '16進数 (Base 16)')}</option>
            </select>
          </div>
          <div class="micro-lab-cards">
            ${steps.map((s, i) => `<div class="micro-lab-cell ${i === steps.length - 1 ? 'active' : 'highlight'}">
              <small>${s.from} ÷ ${base} = ${s.q}</small>
              <strong>${tr('Dư', '余り')} ${s.r}</strong>
              <small>↑ #${steps.length - i}</small>
            </div>`).join('')}
          </div>
          <output class="micro-lab-output">${val}₁₀ = ${converted}₍${base}₎  |  2進: ${val.toString(2).padStart(8, '0')}₂  |  16進: 0x${val.toString(16).toUpperCase().padStart(2, '0')}</output>`;
        stage.querySelector('#mc-val').oninput = e => { val = Number(e.target.value); update(); };
        stage.querySelector('#mc-base').onchange = e => { base = Number(e.target.value); update(); };
      };
      update();
    } else if (labConfig.type === 'twos-complement') {
      let numVal = 18, stepIdx = 2;
      const update = () => {
        const binPos = numVal.toString(2).padStart(8, '0');
        const ones = [...binPos].map(b => b === '1' ? '0' : '1').join('');
        const twos = ((256 - numVal) & 0xFF).toString(2).padStart(8, '0');
        const activeBits = stepIdx === 0 ? binPos : stepIdx === 1 ? ones : twos;
        stage.innerHTML = `
          <div class="micro-lab-controls">
            <label for="tc-val">${tr('Chọn số cần đổi sang âm:', '負にする数値:')}</label>
            <input id="tc-val" type="range" min="1" max="127" value="${numVal}" style="max-width:200px"/>
            <strong>-${numVal}</strong>
            <button type="button" class="btn" data-tc="0" aria-pressed="${stepIdx === 0}">1. +${numVal} (${binPos})</button>
            <button type="button" class="btn" data-tc="1" aria-pressed="${stepIdx === 1}">${tr('2. Đảo bit (Bù 1)', '2. ビット反転 (1の補数)')}</button>
            <button type="button" class="btn" data-tc="2" aria-pressed="${stepIdx === 2}">${tr('3. Cộng 1 (Bù 2)', '3. +1する (2の補数)')}</button>
          </div>
          <div class="byte-switches">
            ${[...activeBits].map((b, i) => `<div class="bit-switch" aria-pressed="${b === '1'}">
              <span class="bit-power">${i === 0 ? 'Sign (-128)' : '2' + '⁰¹²³⁴⁵⁶'[7 - i]}</span>
              <strong>${b}</strong>
              <span>${i === 0 ? -128 : 2 ** (7 - i)}</span>
            </div>`).join('')}
          </div>
          <output class="micro-lab-output">${stepIdx === 0
            ? `+${numVal}₁₀ = ${binPos}₂`
            : stepIdx === 1
              ? `${tr('Đảo toàn bộ 0↔1:', '全ビット反転:')} ${binPos} → ${ones} (1の補数)`
              : `${ones} + 1 = ${twos}₂ (= -${numVal}₁₀)`}</output>`;
        stage.querySelector('#tc-val').oninput = e => { numVal = Number(e.target.value); update(); };
        stage.querySelectorAll('[data-tc]').forEach(b => b.onclick = () => { stepIdx = Number(b.dataset.tc); update(); });
      };
      update();
    } else if (labConfig.type === 'bit-shift') {
      let reg = 12;
      const update = (note = '') => {
        const bits = reg.toString(2).padStart(8, '0');
        stage.innerHTML = `
          <div class="micro-lab-controls">
            <button type="button" class="btn primary" id="sh-l1">&lt;&lt; 1 (×2)</button>
            <button type="button" class="btn" id="sh-l2">&lt;&lt; 2 (×4)</button>
            <button type="button" class="btn primary" id="sh-r1">&gt;&gt; 1 (÷2)</button>
            <button type="button" class="btn" id="sh-reset">${tr('Đặt lại (12)', 'リセット (12)')}</button>
          </div>
          <div class="byte-switches">
            ${[...bits].map((b, i) => `<button type="button" class="bit-switch" data-b="${7 - i}" aria-pressed="${b === '1'}">
              <span class="bit-power">2${'⁰¹²³⁴⁵⁶⁷'[7 - i]}</span>
              <strong>${b}</strong>
              <span>${2 ** (7 - i)}</span>
            </button>`).join('')}
          </div>
          <output class="micro-lab-output">${bits}₂ = ${reg}₁₀ ${note ? ' · ' + note : ''}</output>`;
        stage.querySelectorAll('[data-b]').forEach(btn => btn.onclick = () => { reg ^= (1 << Number(btn.dataset.b)); update(); });
        stage.querySelector('#sh-l1').onclick = () => { const old = reg; reg = (reg << 1) & 0xFF; update(`${old} × 2 = ${reg}`); };
        stage.querySelector('#sh-l2').onclick = () => { const old = reg; reg = (reg << 2) & 0xFF; update(`${old} × 4 = ${reg}`); };
        stage.querySelector('#sh-r1').onclick = () => { const old = reg; reg = reg >> 1; update(`${old} ÷ 2 = ${reg}`); };
        stage.querySelector('#sh-reset').onclick = () => { reg = 12; update(); };
      };
      update();
    } else if (labConfig.type === 'logic-gate') {
      let a = 1, b = 1, gate = 'XOR';
      const compute = (g, x, y) => g === 'AND' ? (x & y) : g === 'OR' ? (x | y) : g === 'XOR' ? (x ^ y) : g === 'NAND' ? ((x & y) ^ 1) : ((x | y) ^ 1);
      const update = () => {
        const out = compute(gate, a, b);
        const sum = a ^ b, carry = a & b;
        stage.innerHTML = `
          <div class="micro-lab-controls">
            <button type="button" class="btn" id="lg-a" aria-pressed="${a === 1}">Input A = ${a}</button>
            <button type="button" class="btn" id="lg-b" aria-pressed="${b === 1}">Input B = ${b}</button>
            ${['AND', 'OR', 'XOR', 'NAND', 'NOR'].map(g => `<button type="button" class="btn" data-g="${g}" aria-pressed="${gate === g}">${g}</button>`).join('')}
          </div>
          <div class="micro-lab-cards">
            <div class="micro-lab-cell ${a ? 'active' : ''}"><small>INPUT A</small><strong>${a}</strong></div>
            <div class="micro-lab-cell ${b ? 'active' : ''}"><small>INPUT B</small><strong>${b}</strong></div>
            <div class="micro-lab-cell ${out ? 'highlight' : ''}"><small>${gate} OUTPUT</small><strong>${out}</strong></div>
            <div class="micro-lab-cell ${sum || carry ? 'active' : ''}"><small>Half Adder (C, S)</small><strong>C=${carry}, S=${sum}</strong></div>
          </div>
          <output class="micro-lab-output">A (${a}) ${gate} B (${b}) = ${out}  |  ${tr('Mạch cộng nửa:', '半加算器:')} ${a} + ${b} = ${carry}${sum}₂</output>`;
        stage.querySelector('#lg-a').onclick = () => { a ^= 1; update(); };
        stage.querySelector('#lg-b').onclick = () => { b ^= 1; update(); };
        stage.querySelectorAll('[data-g]').forEach(btn => btn.onclick = () => { gate = btn.dataset.g; update(); });
      };
      update();
    } else if (labConfig.type === 'stack-sim') {
      let stack = ['A (10)', 'B (20)'], queue = ['A (10)', 'B (20)'], seq = 3;
      const update = (msg = '') => {
        stage.innerHTML = `
          <div class="micro-lab-controls">
            <button type="button" class="btn primary" id="st-push">+ Push / Enqueue</button>
            <button type="button" class="btn" id="st-pop">↑ Pop (Stack LIFO)</button>
            <button type="button" class="btn" id="qu-deq">→ Dequeue (Queue FIFO)</button>
            <button type="button" class="btn" id="st-rst">${tr('Đặt lại', 'リセット')}</button>
          </div>
          <div class="micro-lab-cards">
            <div class="micro-lab-cell active">
              <small>STACK (LIFO · Vào sau ra trước)</small>
              <strong>${stack.length ? stack.join(' → ') : '(Trống)'}</strong>
              <small>Top = ${stack[stack.length - 1] || 'none'}</small>
            </div>
            <div class="micro-lab-cell highlight">
              <small>QUEUE (FIFO · Vào trước ra trước)</small>
              <strong>${queue.length ? queue.join(' → ') : '(Trống)'}</strong>
              <small>Front = ${queue[0] || 'none'}</small>
            </div>
          </div>
          <output class="micro-lab-output">${msg || tr('Bấm Push rồi thử Pop / Dequeue để so sánh phần tử nào được lấy ra trước!', 'Pushで追加し、PopとDequeueでどちらが先に取り出されるか比較しましょう！')}</output>`;
        stage.querySelector('#st-push').onclick = () => {
          if (stack.length >= 6) return;
          const item = `${String.fromCharCode(64 + seq)} (${seq * 10})`;
          seq++;
          stack.push(item); queue.push(item);
          update(tr(`Đã thêm ${item} vào cuối danh sách.`, `${item} を追加しました。`));
        };
        stage.querySelector('#st-pop').onclick = () => {
          const out = stack.pop();
          update(out ? tr(`Stack Pop lấy phần tử MỚI NHẤT ở đỉnh: ${out}`, `スタック(LIFO)は最後に入れた ${out} を取り出しました。`) : 'Stack trống!');
        };
        stage.querySelector('#qu-deq').onclick = () => {
          const out = queue.shift();
          update(out ? tr(`Queue Dequeue lấy phần tử CŨ NHẤT ở đầu hàng: ${out}`, `キュー(FIFO)は最初に入れた ${out} を取り出しました。`) : 'Queue trống!');
        };
        stage.querySelector('#st-rst').onclick = () => { stack = ['A (10)', 'B (20)']; queue = ['A (10)', 'B (20)']; seq = 3; update(); };
      };
      update();
    } else if (labConfig.type === 'search-sim') {
      const arr = [12, 19, 24, 31, 38, 45, 52, 60, 67, 74, 81, 90];
      let target = 67, low = 0, high = arr.length - 1, steps = 0;
      const update = () => {
        const mid = Math.floor((low + high) / 2);
        const found = arr[mid] === target;
        stage.innerHTML = `
          <div class="micro-lab-controls">
            <label for="bs-target">${tr('Số cần tìm:', '探す値:')}</label>
            <select id="bs-target">${arr.map(x => `<option value="${x}" ${x === target ? 'selected' : ''}>${x}</option>`).join('')}</select>
            <button type="button" class="btn primary" id="bs-step" ${found || low > high ? 'disabled' : ''}>${tr('✂ Chia đôi phạm vi (Bước tiếp)', '✂ 範囲を半分に絞る')}</button>
            <button type="button" class="btn" id="bs-rst">${tr('Đặt lại', 'リセット')}</button>
          </div>
          <div class="micro-lab-cards" style="grid-template-columns:repeat(6,minmax(0,1fr))">
            ${arr.map((x, i) => `<div class="micro-lab-cell ${i === mid ? 'highlight' : (i >= low && i <= high ? 'active' : '')}" style="opacity:${i >= low && i <= high ? 1 : 0.3}">
              <small>[${i}]</small>
              <strong>${x}</strong>
              <small>${i === mid ? 'MID' : i === low ? 'L' : i === high ? 'R' : ''}</small>
            </div>`).join('')}
          </div>
          <output class="micro-lab-output">${found
            ? tr(`✓ Tìm thấy ${target} tại vị trí [${mid}] chỉ sau ${steps + 1} lần so sánh (Tìm tuần tự mất ${mid + 1} bước)!`, `✓ わずか ${steps + 1} 回の比較で [${mid}] の ${target} を発見！（線形探索なら ${mid + 1} 回）`)
            : tr(`Bước ${steps + 1}: So sánh MID [${mid}] = ${arr[mid]} với ${target} → ${arr[mid] < target ? 'Bỏ nửa trái' : 'Bỏ nửa phải'}`, `比較 ${steps + 1}回目: 中央[${mid}]=${arr[mid]} と ${target} を比較`)}</output>`;
        stage.querySelector('#bs-target').onchange = e => { target = Number(e.target.value); low = 0; high = arr.length - 1; steps = 0; update(); };
        stage.querySelector('#bs-step').onclick = () => {
          if (arr[mid] === target) return;
          steps++;
          if (arr[mid] < target) low = mid + 1;
          else high = mid - 1;
          update();
        };
        stage.querySelector('#bs-rst').onclick = () => { low = 0; high = arr.length - 1; steps = 0; update(); };
      };
      update();
    } else if (labConfig.type === 'formula-sim') {
      let param = 80;
      const update = () => {
        if (num === 17) {
          const cacheNs = 2, ramNs = 50;
          const hit = param / 100;
          const eat = (hit * cacheNs + (1 - hit) * ramNs).toFixed(1);
          stage.innerHTML = `
            <div class="micro-lab-controls">
              <label for="fm-range">${tr('Tỷ lệ Cache Hit (ヒット率):', 'キャッシュヒット率:')}</label>
              <input id="fm-range" type="range" min="10" max="99" value="${param}" style="max-width:240px"/>
              <strong>${param}%</strong>
            </div>
            <div class="micro-lab-cards">
              <div class="micro-lab-cell active"><small>Cache (2ns) × Hit</small><strong>${(hit * cacheNs).toFixed(2)} ns</strong></div>
              <div class="micro-lab-cell highlight"><small>RAM (50ns) × Miss (${100 - param}%)</small><strong>${((1 - hit) * ramNs).toFixed(2)} ns</strong></div>
              <div class="micro-lab-cell active"><small>EAT (Thời gian hiệu dụng)</small><strong>${eat} ns</strong></div>
            </div>
            <output class="micro-lab-output">EAT = ${hit.toFixed(2)} × 2ns + ${(1 - hit).toFixed(2)} × 50ns = ${eat} ns</output>`;
        } else if (num === 19) {
          const a = param / 100;
          const series = (a * a * 100).toFixed(2);
          const parallel = ((1 - (1 - a) * (1 - a)) * 100).toFixed(2);
          stage.innerHTML = `
            <div class="micro-lab-controls">
              <label for="fm-range">${tr('Độ khả dụng mỗi máy (A):', '単体の稼働率 (A):')}</label>
              <input id="fm-range" type="range" min="50" max="99" value="${param}" style="max-width:240px"/>
              <strong>${a.toFixed(2)} (${param}%)</strong>
            </div>
            <div class="micro-lab-cards">
              <div class="micro-lab-cell highlight"><small>${tr('Hệ Nối tiếp (A × A)', '直列システム (A × A)')}</small><strong>${series}%</strong></div>
              <div class="micro-lab-cell active"><small>${tr('Hệ Song song 1-(1-A)²', '並列システム 1-(1-A)²')}</small><strong>${parallel}%</strong></div>
            </div>
            <output class="micro-lab-output">${tr('Nối tiếp làm giảm độ khả dụng; Song song (dự phòng) nâng độ khả dụng lên', '直列では下がり、並列（二重化）では稼働率が向上：')} ${parallel}%</output>`;
        } else {
          const count = Math.max(2, Math.round(param / 12));
          const seqCycles = count * 4;
          const pipeCycles = 4 + (count - 1);
          stage.innerHTML = `
            <div class="micro-lab-controls">
              <label for="fm-range">${tr('Số lượng lệnh / ổ đĩa (N):', '命令数 / 構成数 (N):')}</label>
              <input id="fm-range" type="range" min="24" max="96" value="${param}" style="max-width:240px"/>
              <strong>N = ${count}</strong>
            </div>
            <div class="micro-lab-cards">
              <div class="micro-lab-cell"><small>${tr('Chạy tuần tự (4 × N)', '逐次処理 (4 × N)')}</small><strong>${seqCycles} chu kỳ</strong></div>
              <div class="micro-lab-cell active"><small>${tr('Chạy Pipeline (4 + N - 1)', 'パイプライン (4 + N - 1)')}</small><strong>${pipeCycles} chu kỳ</strong></div>
              <div class="micro-lab-cell highlight"><small>RAID 5 (${count} ổ × 1TB)</small><strong>${count - 1} TB dùng được</strong></div>
            </div>
            <output class="micro-lab-output">${tr(`Tăng tốc gấp ${(seqCycles / pipeCycles).toFixed(2)} lần nhờ xử lý chồng lấp!`, `パイプライン処理により ${(seqCycles / pipeCycles).toFixed(2)} 倍高速化！`)}</output>`;
        }
        stage.querySelector('#fm-range').oninput = e => { param = Number(e.target.value); update(); };
      };
      update();
    } else {
      // Interactive Concept Explorer built dynamically from the lesson's own flashcards & quiz!
      const cards = (lessonData.cards || []).slice(0, 4);
      let activeIdx = 0;
      const update = () => {
        const c = cards[activeIdx] || { front: 'FE Concept', back: '' };
        const front = getLang() === 'ja' ? (c.frontJa || c.front) : c.front;
        const back = getLang() === 'ja' ? (c.backJa || c.back) : c.back;
        stage.innerHTML = `
          <div class="micro-lab-controls" role="group" aria-label="${tr('Chọn khái niệm để mổ xẻ', '概念を選択')}">
            ${cards.map((item, i) => `<button type="button" class="btn" data-ci="${i}" aria-pressed="${i === activeIdx}">
              ${String(i + 1).padStart(2, '0')} · ${(getLang() === 'ja' ? (item.frontJa || item.front) : item.front).replace(/<[^>]+>/g, '').slice(0, 26)}
            </button>`).join('')}
          </div>
          <div class="micro-lab-cards">
            <div class="micro-lab-cell active" style="text-align:left;padding:18px">
              <small>${tr('ĐỐI TƯỢNG / THUẬT NGỮ TRỌNG TÂM', '重要キーワード・対象')}</small>
              <strong style="font-size:20px;margin:8px 0">${front}</strong>
            </div>
            <div class="micro-lab-cell highlight" style="text-align:left;padding:18px">
              <small>${tr('CƠ CHẾ HOẠT ĐỘNG & ĐIỂM THI', '仕組みと試験のポイント')}</small>
              <div style="font-size:15px;line-height:1.7;margin-top:8px;color:var(--text)">${back}</div>
            </div>
          </div>`;
        stage.querySelectorAll('[data-ci]').forEach(btn => btn.onclick = () => { activeIdx = Number(btn.dataset.ci); update(); });
      };
      update();
    }

    // Interactive Quick Challenge inside #bit-lab using the first quiz question of the lesson
    const q0 = lessonData.quiz?.[0];
    if (q0) {
      const qBox = document.createElement('div');
      qBox.className = 'lab-question';
      const qTitle = getLang() === 'ja' ? (q0.qJa || q0.q) : (q0.qVi || q0.q);
      const opts = (getLang() === 'ja' && q0.optsJa?.length ? q0.optsJa : q0.opts).map(o => o.replace(/<[^>]+>/g, '').trim());
      qBox.innerHTML = `<h3 id="lab-question-title">⚡ ${tr('Thử thách 10 giây:', '10秒チャレンジ：')} ${qTitle}</h3>
        <div class="lab-answers"></div>
        <p role="status" id="lab-feedback"></p>`;
      const ansWrap = qBox.querySelector('.lab-answers');
      const fb = qBox.querySelector('#lab-feedback');
      opts.forEach((optText, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn';
        b.textContent = optText;
        b.onclick = () => {
          ansWrap.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
          const expl = (getLang() === 'ja' ? (q0.explJa || q0.expl) : (q0.expl || q0.why || '')).replace(/<[^>]+>/g, '');
          fb.textContent = i === q0.ans
            ? `✓ ${tr('Chính xác!', '正解！')} ${expl}`
            : `💡 ${tr('Thử lại nhé:', 'もう一度：')} ${expl}`;
        };
        ansWrap.append(b);
      });
      classroomLab.append(qBox);
    }
  }

  // Step 2 (#p1): Insert curiosity hook & collapse walls of reference text into clean <details>
  function enhanceTheoryClarity() {
    const p1 = document.getElementById('p1');
    if (!p1) return;

    if (!p1.querySelector('.topic-hook')) {
      const hookBox = document.createElement('div');
      hookBox.className = 'topic-hook';
      const renderHook = () => { hookBox.innerHTML = `<strong>${tr(...labConfig.hook)}</strong>`; };
      renderHook();
      document.getElementById('reading-language')?.addEventListener('change', renderHook);
      const title = p1.querySelector('.lesson-part-title');
      if (title) title.after(hookBox);
      else p1.prepend(hookBox);
    }

    // Group flat h3.sub topics (Lessons 2–20) into .reading-topic cards & tuck heavy tables/ASCII into <details>
    const flatHeadings = [...p1.querySelectorAll(':scope > h3.sub')];
    flatHeadings.forEach(h3 => {
      const article = document.createElement('article');
      article.className = 'reading-topic';
      h3.before(article);
      article.append(h3);
      while (article.nextElementSibling && !article.nextElementSibling.matches('h3.sub, details.term-reference')) {
        article.append(article.nextElementSibling);
      }
      // Keep first .lang-block and first .callout visible; collapse extra ASCII/tables/sub2 into details
      const extras = [...article.children].filter((el, idx) =>
        idx > 0 && !el.classList.contains('quick-check') &&
        (el.matches('pre.ascii, .table-scroll, h4.sub2') || idx > 2)
      );
      if (extras.length > 0) {
        const ref = document.createElement('details');
        ref.className = 'radix-reference';
        const sum = document.createElement('summary');
        const updateRefSum = () => {
          sum.textContent = tr('📖 Mở bảng tra cứu & sơ đồ chi tiết', '📖 詳細な図表と解説を見る');
        };
        updateRefSum();
        document.getElementById('reading-language')?.addEventListener('change', updateRefSum);
        ref.append(sum, ...extras);
        article.append(ref);
      }
    });
  }

  renderStepOneLab();
  enhanceTheoryClarity();
  attachExamplePredictions();
  renderClassroomNavigation();

  document.getElementById('reading-language')?.addEventListener('change', () => {
    renderStepOneLab();
    renderClassroomNavigation();
  });
})();
