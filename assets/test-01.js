
const QUIZ = [
  // ===== EASY (1-12) =====
  {d:"easy", q_jp:"1ビット(bit)で表すことのできる状態の数はいくつか。", q_vn:"1 bit có thể biểu diễn bao nhiêu trạng thái khác nhau?",
    opts:["1通り","2通り","8通り","256通り"], ans:1,
    why_correct:"1 bit chỉ nhận giá trị 0 hoặc 1 → 2¹ = 2 trạng thái.",
    why_wrong:["(A) Sai: 1 trạng thái nghĩa là không có thông tin để phân biệt.","(C) Sai: 8 là số trạng thái của 3 bit (2³).","(D) Sai: 256 là số trạng thái của 8 bit = 1 byte (2⁸)."],
    topic:"データの単位 · Bit"},

  {d:"easy", q_jp:"1バイトは何ビットか。", q_vn:"1 byte gồm bao nhiêu bit?",
    opts:["1 bit","4 bit","8 bit","16 bit"], ans:2,
    why_correct:"Theo định nghĩa, 1 byte = 8 bit. Với 8 bit ta có 2⁸ = 256 trạng thái.",
    why_wrong:["(A) Sai: 1 bit là bit, không phải byte.","(B) Sai: 4 bit gọi là nibble, không phải byte.","(D) Sai: 16 bit = 2 byte (word)."],
    topic:"データの単位 · Byte"},

  {d:"easy", q_jp:"16進数の \"A\" は10進数でいくつか。", q_vn:"Trong hệ 16, ký hiệu \"A\" có giá trị bằng bao nhiêu trong hệ 10?",
    opts:["9","10","15","16"], ans:1,
    why_correct:"Vì 0–9 chỉ có 10 chữ số, 16進数 mượn A–F để biểu diễn 10–15. Do đó A = 10.",
    why_wrong:["(A) Sai: 9 vẫn là chữ số 9 (không cần ký hiệu chữ).","(C) Sai: 15 là F, ký hiệu cuối cùng trong A–F.","(D) Sai: 16 trong hệ 10 được viết là \"10\" trong hệ 16."],
    topic:"16進数"},

  {d:"easy", q_jp:"16進数の \"F\" は10進数でいくつか。", q_vn:"Trong hệ 16, ký hiệu \"F\" có giá trị bằng bao nhiêu trong hệ 10?",
    opts:["14","15","16","17"], ans:1,
    why_correct:"Bảng đối chiếu A=10, B=11, C=12, D=13, E=14, F=15.",
    why_wrong:["(A) Sai: 14 là E.","(C) Sai: 16 trong hệ 10 viết là \"10\" trong hệ 16.","(D) Sai: 17 trong hệ 10 viết là \"11\" trong hệ 16."],
    topic:"16進数"},

  {d:"easy", q_jp:"単位記号 \"T\" (テラ) は何を表すか。", q_vn:"Ký hiệu \"T\" (Tera) tương ứng với lũy thừa nào của 10?",
    opts:["10⁶","10⁹","10¹²","10⁻¹²"], ans:2,
    why_correct:"Theo bảng đơn vị dữ liệu, テラ (T) = 10¹² = 1,000,000,000,000.",
    why_wrong:["(A) Sai: 10⁶ là メガ (M).","(B) Sai: 10⁹ là ギガ (G).","(D) Sai: 10⁻¹² là ピコ (p), phía nhỏ."],
    topic:"データの単位"},

  {d:"easy", q_jp:"単位記号 \"p\" (ピコ) は何を表すか。", q_vn:"Ký hiệu \"p\" (Pico) tương ứng với lũy thừa nào của 10?",
    opts:["10⁻³","10⁻⁶","10⁻⁹","10⁻¹²"], ans:3,
    why_correct:"Theo bảng đơn vị, ピコ (p) = 10⁻¹² = 0.000000000001 — đơn vị nhỏ nhất trong dãy chuẩn.",
    why_wrong:["(A) Sai: 10⁻³ là ミリ (m).","(B) Sai: 10⁻⁶ là マイクロ (μ).","(C) Sai: 10⁻⁹ là ナノ (n)."],
    topic:"データの単位"},

  {d:"easy", q_jp:"16進数では何種類の記号を使うか。", q_vn:"Hệ 16 (16進数) dùng bao nhiêu ký hiệu khác nhau?",
    opts:["8","10","16","32"], ans:2,
    why_correct:"16進数 = n進数 với n=16, dùng 16 ký hiệu: 0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F.",
    why_wrong:["(A) Sai: 8 ký hiệu là 8進数.","(B) Sai: 10 ký hiệu là 10進数 (chỉ 0–9).","(D) Sai: không có hệ 32進数 chuẩn trong giáo trình."],
    topic:"n進数の概念"},

  {d:"easy", q_jp:"2進数で使用する記号はどれか。", q_vn:"Hệ 2 (2進数) dùng những ký hiệu nào?",
    opts:["0 và 1","0, 1, 2","Từ 0 đến 9","0 đến 9 và A, B"], ans:0,
    why_correct:"2進数 = n進数 với n=2, chỉ dùng 2 ký hiệu: 0 và 1. Khi đạt giá trị 2 thì nhảy hàng.",
    why_wrong:["(B) Sai: nếu có cả \"2\" thì không cần nhảy hàng tại giá trị 2.","(C) Sai: đó là 10進数.","(D) Sai: đó gần với 16進数 (nhưng vẫn không đủ A–F)."],
    topic:"n進数の概念"},

  {d:"easy", q_jp:"「基数」(きすう) の正しい説明はどれか。", q_vn:"\"基数 (kisuu — cơ số)\" có nghĩa là gì?",
    opts:["Đơn vị nhỏ nhất của dữ liệu","Số làm chuẩn để nhảy hàng (桁上がり)","Trọng số của hàng đầu tiên","Số bit dùng để biểu diễn"], ans:1,
    why_correct:"基数 là số làm chuẩn để 桁上がり (nhảy hàng). 10進数 → 基数=10; 2進数 → 基数=2; 16進数 → 基数=16.",
    why_wrong:["(A) Sai: đơn vị nhỏ nhất là bit.","(C) Sai: trọng số (桁の重み) là khái niệm khác, gắn với từng hàng.","(D) Sai: số bit không liên quan đến khái niệm 基数."],
    topic:"基数"},

  {d:"easy", q_jp:"0.5 はどの種類の小数か。", q_vn:"Số 0.5 thuộc loại số thập phân nào?",
    opts:["有限小数","無限小数","循環小数","2進小数"], ans:0,
    why_correct:"0.5 có đúng 1 chữ số sau dấu chấm — phần thập phân có số chữ số hữu hạn → 有限小数 (hữu hạn).",
    why_wrong:["(B) Sai: 無限小数 có phần thập phân kéo dài vô tận (vd: π).","(C) Sai: 循環小数 phải lặp 1 cụm số vô hạn (vd: 0.333…).","(D) Sai: 2進小数 chỉ phân loại theo cơ số, không loại trừ với hữu hạn/vô hạn."],
    topic:"小数の種類"},

  {d:"easy", q_jp:"1ギガバイト(1GB)は何バイトに相当するか。", q_vn:"1 GB bằng bao nhiêu byte?",
    opts:["10³ バイト","10⁶ バイト","10⁹ バイト","10¹² バイト"], ans:2,
    why_correct:"Theo bảng đơn vị: ギガ (G) = 10⁹, nên 1 GB = 10⁹ byte = 10 億バイト.",
    why_wrong:["(A) Sai: 10³ byte = 1 kB.","(B) Sai: 10⁶ byte = 1 MB.","(D) Sai: 10¹² byte = 1 TB."],
    topic:"データの単位"},

  {d:"easy", q_jp:"単位 \"k\" (キロ) は何を表すか。", q_vn:"Ký hiệu \"k\" (Kilo) tương đương với lũy thừa nào của 10?",
    opts:["10²","10³","10⁶","10⁹"], ans:1,
    why_correct:"Kilo (k) = 10³ = 1,000. Đây là cấp nhỏ nhất ở phía \"lớn\" trong bảng đơn vị FE.",
    why_wrong:["(A) Sai: 10² (= 100) không có ký hiệu chuẩn trong dãy này.","(C) Sai: 10⁶ là メガ (M).","(D) Sai: 10⁹ là ギガ (G)."],
    topic:"データの単位"},

  // ===== MEDIUM (13-28) =====
  {d:"med", q_jp:"2ビットで表すことができる状態の数はいくつか。", q_vn:"2 bit biểu diễn được bao nhiêu trạng thái khác nhau?",
    opts:["2","4","8","16"], ans:1,
    why_correct:"Mỗi bit có 2 trạng thái. n bit → 2ⁿ trạng thái. 2 bit → 2² = 4 trạng thái: [00], [01], [10], [11].",
    why_wrong:["(A) Sai: 2 là số trạng thái của 1 bit (2¹).","(C) Sai: 8 là số trạng thái của 3 bit (2³).","(D) Sai: 16 là số trạng thái của 4 bit (2⁴)."],
    topic:"ビットで表せる状態数"},

  {d:"med", q_jp:"4ビットで表すことができる状態の数はいくつか。", q_vn:"4 bit biểu diễn được bao nhiêu trạng thái khác nhau?",
    opts:["4","8","16","256"], ans:2,
    why_correct:"4 bit → 2⁴ = 16 trạng thái. Các trạng thái: 0000, 0001, …, 1111.",
    why_wrong:["(A) Sai: nhầm với số bit chính nó.","(B) Sai: 8 là 2³ (3 bit).","(D) Sai: 256 là 2⁸ (8 bit = 1 byte)."],
    topic:"ビットで表せる状態数"},

  {d:"med", q_jp:"16進数の \"D\" は10進数でいくつか。", q_vn:"Trong hệ 16, ký hiệu \"D\" tương đương với số nào trong hệ 10?",
    opts:["11","12","13","14"], ans:2,
    why_correct:"Bảng đối chiếu: A=10, B=11, C=12, D=13, E=14, F=15. Vậy D=13.",
    why_wrong:["(A) Sai: 11 là B.","(B) Sai: 12 là C.","(D) Sai: 14 là E."],
    topic:"16進数"},

  {d:"med", q_jp:"2進数で \"1011\" の次の数はいくつか。", q_vn:"Trong hệ 2, số ngay sau \"1011\" là số nào?",
    opts:["1012","1100","1101","10010"], ans:1,
    why_correct:"2進数 không có chữ số ≥2. 1011 + 1: hàng cuối 1+1=10 (carry); hàng tiếp 1+1=10 (carry); hàng tiếp 0+1=1, kết thúc → <b>1100</b>.",
    why_wrong:["(A) Sai: \"2\" không tồn tại trong 2進数.","(C) Sai: 1101 = 1011 + 10 (binary) = +2.","(D) Sai: 10010 quá xa, là 1011 + 111."],
    topic:"2進数 đếm/桁上がり"},

  {d:"med", q_jp:"16進数で \"F\" の次の数はいくつか。", q_vn:"Trong hệ 16, số ngay sau \"F\" là số nào?",
    opts:["G","10","11","16"], ans:1,
    why_correct:"16進数 chỉ có ký hiệu đến F (=15). Sau F là nhảy hàng → \"10\" (= 10進数 16). Không có chữ số mới.",
    why_wrong:["(A) Sai: chữ G không có trong 16進数.","(C) Sai: 11 là 2 bước sau F.","(D) Sai: 16 là cách viết trong hệ 10, không phải hệ 16."],
    topic:"16進数 đếm/桁上がり"},

  {d:"med", q_jp:"1MBは何バイトに相当するか。", q_vn:"1 MB bằng bao nhiêu byte?",
    opts:["10³ バイト","10⁶ バイト","10⁹ バイト","10¹² バイト"], ans:1,
    why_correct:"メガ (M) = 10⁶ → 1 MB = 10⁶ byte = 100 万バイト.",
    why_wrong:["(A) Sai: 10³ = kB.","(C) Sai: 10⁹ = GB.","(D) Sai: 10¹² = TB."],
    topic:"データの単位"},

  {d:"med", q_jp:"2進数 \"1101\" の各桁の重みとして正しいのはどれか。(左の桁から)", q_vn:"Trọng số các hàng của 2進数 \"1101\" (từ TRÁI sang phải) là?",
    opts:["1, 2, 4, 8","8, 4, 2, 1","2, 4, 8, 16","0.5, 0.25, 0.125, 0.0625"], ans:1,
    why_correct:"Phần nguyên 2進数 từ trái sang phải: 2³, 2², 2¹, 2⁰ = 8, 4, 2, 1.",
    why_wrong:["(A) Sai: đảo ngược thứ tự (đọc từ phải sang trái).","(C) Sai: bắt đầu từ 2¹ thay vì 2⁰.","(D) Sai: đó là trọng số phần thập phân (2⁻¹, 2⁻², 2⁻³, 2⁻⁴)."],
    topic:"桁の重み"},

  {d:"med", q_jp:"1÷3 = 0.333... の数はどの種類の小数か。", q_vn:"Số 1÷3 = 0.333… thuộc loại nào?",
    opts:["有限小数","循環小数","Không phải số thập phân","2進小数"], ans:1,
    why_correct:"Cụm \"3\" lặp lại vô hạn → 循環小数 (tuần hoàn). 循環小数 cũng là một dạng 無限小数.",
    why_wrong:["(A) Sai: phần thập phân vô hạn nên không phải hữu hạn.","(C) Sai: 0.333… là số thập phân hợp lệ.","(D) Sai: đây là 10進数 thập phân, không phải 2進小数."],
    topic:"小数の種類"},

  {d:"med", q_jp:"π = 3.14159265... はどの種類の小数か。", q_vn:"Số π = 3.14159265… thuộc loại nào?",
    opts:["有限小数","循環小数","無限小数 (không tuần hoàn)","Không phải số thập phân"], ans:2,
    why_correct:"π có phần thập phân vô hạn và KHÔNG có cụm số lặp đi lặp lại → 無限小数 (vô hạn, không tuần hoàn).",
    why_wrong:["(A) Sai: phần thập phân không có điểm dừng.","(B) Sai: π không lặp lại cụm nào.","(D) Sai: π là số thực, có biểu diễn thập phân."],
    topic:"小数の種類"},

  {d:"med", q_jp:"\"10010011\" のように0と1で表された数値の並びを何と呼ぶか。", q_vn:"Dãy \"10010011\" gồm các số 0 và 1 được gọi là gì trong FE?",
    opts:["10進数表記","ビット列 (ビットパターン)","16進小数","文字コード duy nhất"], ans:1,
    why_correct:"Sách Yasashii gọi rõ: dãy 0 và 1 nối tiếp = <b>ビット列</b> hay <b>ビットパターン</b>.",
    why_wrong:["(A) Sai: 10進数 chỉ dùng các chữ số 0–9 (không hạn chế ở 0/1).","(C) Sai: 16進小数 phải có dấu chấm và ký hiệu 0–F.","(D) Sai: 文字コード là sự ánh xạ chữ → dãy bit, không phải bản thân dãy."],
    topic:"ビットパターン"},

  {d:"med", q_jp:"単位 \"m\" (ミリ) は何を表すか。", q_vn:"Ký hiệu \"m\" (Milli) tương đương với lũy thừa nào của 10?",
    opts:["10⁻¹","10⁻²","10⁻³","10⁻⁶"], ans:2,
    why_correct:"Theo bảng đơn vị, ミリ (m) = 10⁻³ = 0.001 — cấp đầu tiên về phía nhỏ tính từ điểm gốc.",
    why_wrong:["(A) Sai: 10⁻¹ (=0.1) không có ký hiệu chuẩn ở dãy này.","(B) Sai: 10⁻² (=0.01) không có ký hiệu chuẩn ở dãy này.","(D) Sai: 10⁻⁶ là マイクロ (μ)."],
    topic:"データの単位"},

  {d:"med", q_jp:"1バイトで表すことのできる状態の数はいくつか。", q_vn:"1 byte biểu diễn được bao nhiêu trạng thái khác nhau?",
    opts:["8","16","128","256"], ans:3,
    why_correct:"1 byte = 8 bit → 2⁸ = 256 trạng thái.",
    why_wrong:["(A) Sai: 8 là số bit, không phải số trạng thái.","(B) Sai: 16 = 2⁴ (4 bit).","(C) Sai: 128 = 2⁷ (7 bit)."],
    topic:"バイトで表せる状態数"},

  {d:"med", q_jp:"2進数の小数点の右側、最初の桁の重みはいくつか。", q_vn:"Trọng số của hàng thập phân thứ nhất (ngay sau dấu chấm) trong 2進数 là?",
    opts:["0.1","0.25","0.5","0.05"], ans:2,
    why_correct:"Hàng thập phân thứ nhất sau dấu chấm có trọng số 2⁻¹ = 1/2 = 0.5.",
    why_wrong:["(A) Sai: 0.1 là 10⁻¹ — trọng số trong 10進数.","(B) Sai: 0.25 = 2⁻² là hàng thứ hai sau dấu chấm.","(D) Sai: không có hàng nào có trọng số 0.05 trong 2進数."],
    topic:"桁の重み"},

  {d:"med", q_jp:"\"38.45\" の \"38\" と \"45\" の部分はそれぞれ何と呼ばれるか。", q_vn:"Trong số \"38.45\", \"38\" và \"45\" tương ứng được gọi là gì?",
    opts:["整数部 và 小数部","小数部 và 整数部","基数 và 小数点","Phần thực và phần ảo"], ans:0,
    why_correct:"小数点 (.) chia số thành 2 phần: bên TRÁI là <b>整数部</b> (phần nguyên = 38), bên PHẢI là <b>小数部</b> (phần thập phân = 45).",
    why_wrong:["(B) Sai: thứ tự bị đảo.","(C) Sai: 基数 là khái niệm cơ số (n), 小数点 là dấu chấm.","(D) Sai: phần thực/ảo là khái niệm trong số phức, không phải số thập phân thông thường."],
    topic:"整数部・小数部"},

  {d:"med", q_jp:"コンピュータが2進数で処理を行う理由として最も適切なのはどれか。", q_vn:"Lý do chính khiến máy tính dùng 2進数 để xử lý dữ liệu là?",
    opts:["Hệ 2 ngắn gọn nhất khi viết","Điện chỉ phân biệt được ON (1) / OFF (0)","Vì IPA quy định","Hệ 2 dễ học hơn hệ 10"], ans:1,
    why_correct:"Sách Yasashii và Slide 第1回 nêu rõ: máy tính dùng điện, mà điện chỉ có 2 trạng thái ON / OFF → ánh xạ thành 1 / 0. Đó là lý do dùng 2進数.",
    why_wrong:["(A) Sai: thật ra 2進数 viết DÀI hơn hệ 10 (10進 \"10\" = 2進 \"1010\").","(C) Sai: nguyên do là kỹ thuật, không phải quy định.","(D) Sai: không phải lý do thực sự."],
    topic:"なぜ2進数を使うか"},

  {d:"med", q_jp:"同じ文字 \"あ\" でも、Shift JIS と Unicode で値が異なるのはなぜか。", q_vn:"Vì sao cùng chữ \"あ\" nhưng mã trong Shift JIS và Unicode lại khác nhau?",
    opts:["Máy tính cũ và mới khác nhau","Mỗi 文字コード định nghĩa cách ánh xạ riêng chữ → dãy bit","Shift JIS dùng 8進数, Unicode dùng 16進数","Mã là số ngẫu nhiên"], ans:1,
    why_correct:"文字コード là bộ quy ước gán mỗi chữ thành 1 dãy bit. Mỗi bộ mã (Shift JIS, Unicode…) có quy ước riêng, nên cùng chữ vẫn có thể có dãy bit khác nhau.",
    why_wrong:["(A) Sai: không phải vấn đề tuổi của máy tính.","(C) Sai: cả 2 bộ mã đều biểu diễn cuối cùng dưới dạng 2進数 trên máy.","(D) Sai: mã không phải ngẫu nhiên — được quy ước chính thức."],
    topic:"文字コード"},

  // ===== HARD (29-40) =====
  {d:"hard", q_jp:"100種類の状態を区別して表現するためには、最低何ビット必要か。", q_vn:"Để phân biệt được 100 trạng thái khác nhau, tối thiểu cần bao nhiêu bit?",
    opts:["6 bit","7 bit","8 bit","10 bit"], ans:1,
    why_correct:"n bit biểu diễn 2ⁿ trạng thái. Cần 2ⁿ ≥ 100. 2⁶ = 64 (chưa đủ), 2⁷ = 128 ≥ 100 (đủ). Vậy tối thiểu <b>7 bit</b>.",
    why_wrong:["(A) Sai: 2⁶ = 64 < 100, không đủ.","(C) Sai: 8 bit (= 256) là dư, không phải \"tối thiểu\".","(D) Sai: 10 bit (= 1024) càng dư hơn."],
    topic:"ビット数の計算"},

  {d:"hard", q_jp:"1GBは何ビットに相当するか。", q_vn:"1 GB bằng bao nhiêu bit?",
    opts:["10⁹ bit","8 × 10⁹ bit","10¹² bit","8 × 10⁶ bit"], ans:1,
    why_correct:"1 GB = 10⁹ byte. 1 byte = 8 bit → 1 GB = 10⁹ × 8 = <b>8 × 10⁹ bit = 80 億ビット</b>.",
    why_wrong:["(A) Sai: thiếu hệ số ×8 cho việc đổi byte→bit.","(C) Sai: 10¹² bit là cách tính nhầm (× 1000 thay vì ×8).","(D) Sai: 8 × 10⁶ là 8 MB tính sang bit."],
    topic:"単位換算"},

  {d:"hard", q_jp:"2進数で表現された \"1.1\" は10進数でいくつか。", q_vn:"Số 2進数 \"1.1\" (= 1.1 trong hệ 2) tương đương số nào trong hệ 10?",
    opts:["1.1","1.5","1.25","2.1"], ans:1,
    why_correct:"Phần nguyên: 1 × 2⁰ = 1. Phần thập phân: 1 × 2⁻¹ = 0.5. Tổng = <b>1.5</b>.",
    why_wrong:["(A) Sai: chỉ đúng nếu là hệ 10.","(C) Sai: 1.25 = 2進 \"1.01\" (= 1 + 0.25).","(D) Sai: 2.1 không khớp với cách tính trọng số."],
    topic:"桁の重み (2進小数)"},

  {d:"hard", q_jp:"2進小数 \"0.111\" の各桁の重みは、小数点の右から順にいくつか。", q_vn:"Trọng số các hàng của 2進小数 \"0.111\" (từ TRÁI sang phải, sau dấu chấm) là?",
    opts:["0.1, 0.01, 0.001","0.5, 0.25, 0.125","1, 0.5, 0.25","2, 4, 8"], ans:1,
    why_correct:"Phần thập phân 2進: 2⁻¹ = 0.5; 2⁻² = 0.25; 2⁻³ = 0.125. Nên 3 hàng đầu sau dấu chấm: <b>0.5, 0.25, 0.125</b>.",
    why_wrong:["(A) Sai: đó là 10進数 (10⁻¹, 10⁻², 10⁻³).","(C) Sai: bắt đầu từ 2⁰ (= 1) là phần nguyên, không phải phần thập phân.","(D) Sai: đó là trọng số phần nguyên 2¹, 2², 2³."],
    topic:"桁の重み (2進小数)"},

  {d:"hard", q_jp:"16進数の \"10\" は10進数でいくつか。", q_vn:"Số 16進数 \"10\" tương đương với số nào trong hệ 10?",
    opts:["10","15","16","17"], ans:2,
    why_correct:"Trong 16進数: 1×16¹ + 0×16⁰ = 16. Theo bảng đối chiếu, sau F (=15) là \"10\" = 10進数 16.",
    why_wrong:["(A) Sai: đó là cách đọc theo hệ 10.","(B) Sai: 15 = ký hiệu F.","(D) Sai: 17 = 16進数 \"11\"."],
    topic:"16進数 đọc giá trị"},

  {d:"hard", q_jp:"16進数の \"1F\" は10進数でいくつか。", q_vn:"Số 16進数 \"1F\" tương đương với số nào trong hệ 10?",
    opts:["19","25","31","100"], ans:2,
    why_correct:"Áp dụng trọng số: 1 × 16¹ + F × 16⁰ = 16 + 15 = <b>31</b>.",
    why_wrong:["(A) Sai: nhầm \"1F\" → \"19\" (đọc F như chữ số 9).","(B) Sai: kết quả không khớp với cách tính nào.","(D) Sai: 100 quá lớn — 100 trong hệ 10 = 16進 \"64\"."],
    topic:"16進数 đọc giá trị"},

  {d:"hard", q_jp:"3ビットで表せるビット列の総数はいくつか。", q_vn:"3 bit có thể tạo ra bao nhiêu ビット列 (bit pattern) khác nhau?",
    opts:["4 cái","6 cái","8 cái","16 cái"], ans:2,
    why_correct:"3 bit → 2³ = 8 patterns. Cụ thể: 000, 001, 010, 011, 100, 101, 110, 111 (theo Yasashii Ch.1 Lesson 01-01).",
    why_wrong:["(A) Sai: 4 là 2 bit.","(B) Sai: 6 không phải lũy thừa của 2.","(D) Sai: 16 là 4 bit."],
    topic:"ビット数とパターン数"},

  {d:"hard", q_jp:"10進数の \"10\" は \"じゅう\" と読むが、2進数の \"10\"₂ の正しい読み方はどれか。", q_vn:"10進数 \"10\" đọc là \"じゅう (juu)\". Vậy 2進数 \"(10)₂\" đọc đúng như thế nào?",
    opts:["\"Mười\" (juu)","\"Một không\" (いちぜろ ichi-zero)","\"Hai\" (ni)","\"じゅう\" như hệ 10"], ans:1,
    why_correct:"Sách Yasashii nêu rõ: dù viết giống nhau, 2進数 \"(10)₂\" đọc là <b>「いちぜろ」</b> để phân biệt với 10進数. Ghi cơ số dưới ngoặc giúp người đọc biết hệ nào.",
    why_wrong:["(A) Sai: \"mười\" là cách đọc của 10進数.","(C) Sai: \"hai\" là giá trị, không phải cách đọc ký hiệu.","(D) Sai: cùng cách đọc thì không phân biệt được hệ."],
    topic:"数字の読み方"},

  {d:"hard", q_jp:"次の中で、無限小数に該当しないものはどれか。", q_vn:"Trong các số sau, số nào KHÔNG phải là 無限小数 (số vô hạn)?",
    opts:["π = 3.14159265…","1 ÷ 7 = 0.142857142857…","1 ÷ 3 = 0.333…","0.625"], ans:3,
    why_correct:"0.625 có 3 chữ số sau dấu chấm và dừng → là 有限小数 (hữu hạn), không phải 無限小数.",
    why_wrong:["(A) Sai: π vô hạn, không tuần hoàn → vẫn là 無限小数.","(B) Sai: 1÷7 vô hạn, có lặp → 循環小数 (cũng thuộc 無限小数).","(C) Sai: 1÷3 vô hạn, có lặp → 循環小数."],
    topic:"小数の種類"},

  {d:"hard", q_jp:"2進数で重み \"32\" を持つ桁は、左から何桁目か(小数点を基準とする桁の重みは何か)。", q_vn:"Hàng có trọng số \"32\" trong 2進数 tương ứng với lũy thừa nào của 2?",
    opts:["2³","2⁴","2⁵","2⁶"], ans:2,
    why_correct:"32 = 2 × 2 × 2 × 2 × 2 = 2⁵. Bảng trọng số: 1, 2, 4, 8, 16, <b>32</b>, 64, … (= 2⁰, 2¹, 2², 2³, 2⁴, 2⁵, 2⁶).",
    why_wrong:["(A) Sai: 2³ = 8.","(B) Sai: 2⁴ = 16.","(D) Sai: 2⁶ = 64."],
    topic:"桁の重み"},

  {d:"hard", q_jp:"1 GB と 1000 MB の関係について正しいのはどれか。", q_vn:"So sánh giữa 1 GB và 1000 MB, quan hệ nào đúng?",
    opts:["1 GB > 1000 MB","1 GB = 1000 MB","1 GB < 1000 MB","Không thể so sánh"], ans:1,
    why_correct:"1 GB = 10⁹ byte. 1000 MB = 1000 × 10⁶ = 10⁹ byte. Vậy <b>1 GB = 1000 MB</b>.",
    why_wrong:["(A) Sai: hai bên bằng nhau, không lớn hơn.","(C) Sai: hai bên bằng nhau, không nhỏ hơn.","(D) Sai: cùng đơn vị byte nên hoàn toàn so sánh được."],
    topic:"単位換算"},

  {d:"hard", q_jp:"16進数で \"1F\" の次の数はいくつか。", q_vn:"Trong hệ 16, số ngay sau \"1F\" là số nào?",
    opts:["1G","1A","20","200"], ans:2,
    why_correct:"1F (= 10進 31) + 1 = 10進 32 = 16進 <b>20</b>. Sau F là carry: hàng cuối F→0, hàng tiếp +1 → 1F → 20.",
    why_wrong:["(A) Sai: chữ G không tồn tại trong 16進数.","(B) Sai: 1A = 10進 26, đi NGƯỢC lại.","(D) Sai: 200 = 10進 512, nhảy quá xa."],
    topic:"16進数 đếm/桁上がり"},
];

const saved = FE.read("test:1", {});
let cur = Number.isInteger(saved.cur) ? Math.max(0,Math.min(QUIZ.length-1,saved.cur)) : 0;
const answered = new Array(QUIZ.length).fill(null); // null | true | false
const userPick = new Array(QUIZ.length).fill(null);
const total = QUIZ.length;
if(Array.isArray(saved.picks)) saved.picks.forEach((p,i)=>{if(i<total && Number.isInteger(p) && p>=0 && p<QUIZ[i].opts.length){userPick[i]=p;answered[i]=p===QUIZ[i].ans;}});
function saveAttempt(){FE.write('test:1',{cur,picks:userPick,updatedAt:new Date().toISOString()});}

function render(){
  saveAttempt();
  const item = QUIZ[cur];
  const diffMap = {easy:["DỄ","easy"], med:["TB","med"], hard:["KHÓ","hard"]};
  const [diffLabel, diffCls] = diffMap[item.d];
  const locked = answered[cur] !== null;
  let optsHtml = '';
  item.opts.forEach((opt, oi)=>{
    const letter = ['A','B','C','D'][oi];
    let cls = 'opt';
    if(locked){
      cls += ' locked';
      if(oi === item.ans) cls += ' correct';
      else if(oi === userPick[cur]) cls += ' wrong';
    }
    optsHtml += `<div class="${cls}" onclick="pick(${oi})"><span class="ltr">${letter}.</span><span>${opt}</span></div>`;
  });

  const wrongList = item.why_wrong.map(w=>`<div>${w}</div>`).join('');
  const exHtml = `
    <div class="row"><b>Đáp án đúng:</b> ${['A','B','C','D'][item.ans]}</div>
    <div class="row"><b>Vì sao đúng:</b> ${item.why_correct}</div>
    <div class="row wrong-list"><b>Vì sao các phương án khác sai:</b>${wrongList}</div>
    <div class="row link"><b>Liên hệ FE:</b> ${item.topic} (Yasashii Ch.1)</div>
  `;

  const container = document.getElementById('quizContainer');
  container.innerHTML = `
    <div class="quiz-card ${locked?'locked':''}" id="curCard">
      <div class="q-header">
        <div class="q-num">CÂU <b>${cur+1}</b> / ${total}</div>
        <div class="diff-badge ${diffCls}">[${diffLabel}]</div>
      </div>
      <div class="q-text">
        <span class="jp-q">🇯🇵 ${item.q_jp}</span>
        <span class="vn-q">🇻🇳 ${item.q_vn}</span>
      </div>
      <div class="opts">${optsHtml}</div>
      <button class="expl-toggle" onclick="toggleExpl()">▾ XEM GIẢI THÍCH</button>
      <div class="expl" id="explBox">${exHtml}</div>
    </div>
  `;
  updateProgress();
  updateNav();
  document.getElementById('prevBtn').disabled = (cur === 0);
  document.getElementById('nextBtn').textContent = (cur === total-1) ? 'XEM KẾT QUẢ →' : 'CÂU TIẾP →';
}

function pick(oi){
  if(answered[cur] !== null) return;
  const item = QUIZ[cur];
  userPick[cur] = oi;
  answered[cur] = (oi === item.ans);
  render();
}

function toggleExpl(){
  document.getElementById('explBox').classList.toggle('show');
}

function goPrev(){
  if(cur > 0){ cur--; render(); window.scrollTo({top:0, behavior:'smooth'}); }
}

function goNext(){
  if(cur < total-1){ cur++; render(); window.scrollTo({top:0, behavior:'smooth'}); }
  else { showResult(); }
}

function gotoQ(i){
  cur = i; render(); window.scrollTo({top:0, behavior:'smooth'});
}

function updateProgress(){
  const doneCount = answered.filter(x=>x!==null).length;
  const correctCount = answered.filter(x=>x===true).length;
  const wrongCount = answered.filter(x=>x===false).length;
  const pct = (doneCount/total)*100;
  document.getElementById('progFill').style.width = pct+'%';
  document.getElementById('progText').textContent = `Câu ${cur+1} / ${total} · Đã làm ${doneCount}`;
  document.getElementById('progStats').textContent = `Đúng: ${correctCount} · Sai: ${wrongCount}`;
}

function updateNav(){
  const grid = document.getElementById('navGrid');
  grid.innerHTML = '';
  for(let i=0;i<total;i++){
    const cell = document.createElement('div');
    cell.className = 'nav-cell';
    if(i === cur) cell.classList.add('current');
    else if(answered[i] === true) cell.classList.add('correct');
    else if(answered[i] === false) cell.classList.add('wrong');
    cell.textContent = i+1;
    cell.onclick = ()=>gotoQ(i);
    grid.appendChild(cell);
  }
}

function showResult(){
  saveAttempt();
  const correct = answered.filter(x=>x===true).length;
  const pct = Math.round((correct/total)*100);
  document.getElementById('resScore').textContent = `${correct} / ${total}`;
  document.getElementById('resPct').textContent = `${pct}%`;
  let v = '';
  if(pct >= 80) v = '🏆 Xuất sắc — Mức ổn để bước sang STT 2 (基数変換).';
  else if(pct >= 65) v = '👍 Đạt — Ôn lại các câu sai rồi đi tiếp.';
  else if(pct >= 50) v = '📚 Trung bình — Đọc lại Phần 1 lý thuyết.';
  else v = '💪 Cần luyện thêm — Quay lại học lý thuyết trước.';
  document.getElementById('resVerdict').textContent = v;

  // Breakdown
  let eC=0,eT=0, mC=0,mT=0, hC=0,hT=0;
  QUIZ.forEach((q,i)=>{
    if(q.d==='easy'){ eT++; if(answered[i]===true) eC++; }
    if(q.d==='med'){ mT++; if(answered[i]===true) mC++; }
    if(q.d==='hard'){ hT++; if(answered[i]===true) hC++; }
  });
  document.getElementById('brEasy').textContent = `${eC} / ${eT}`;
  document.getElementById('brMed').textContent = `${mC} / ${mT}`;
  document.getElementById('brHard').textContent = `${hC} / ${hT}`;

  document.getElementById('quizContainer').style.display = 'none';
  document.querySelector('.controls').style.display = 'none';
  document.getElementById('result-screen').classList.add('show');
  document.getElementById('result-screen').scrollIntoView({behavior:'smooth',block:'start'});
}

function resetAll(){
  for(let i=0;i<total;i++){ answered[i] = null; userPick[i] = null; }
  cur = 0;
  document.getElementById('quizContainer').style.display = '';
  document.querySelector('.controls').style.display = '';
  document.getElementById('result-screen').classList.remove('show');
  render();
  window.scrollTo({top:0,behavior:'smooth'});
}

function reviewMistakes(){
  // Find first wrong
  const firstWrong = answered.findIndex(x=>x===false);
  if(firstWrong === -1){
    alert('🎉 Không có câu nào sai!');
    return;
  }
  document.getElementById('quizContainer').style.display = '';
  document.querySelector('.controls').style.display = '';
  document.getElementById('result-screen').classList.remove('show');
  cur = firstWrong;
  render();
  window.scrollTo({top:0,behavior:'smooth'});
}

render();
