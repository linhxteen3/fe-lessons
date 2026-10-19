"""Build the requested FE batch from reviewed bilingual notes and existing page shells."""
import copy
import html
import ipaddress
import json
import random
import re
import sqlite3
from pathlib import Path
from lesson_batch_data import DATA

ROOT = Path(__file__).resolve().parents[1]
CATALOG = json.loads((ROOT/'lessons.json').read_text(encoding='utf-8'))
LESSONS = {l['stt']: l for l in CATALOG['lessons']}

COMMON_DB = ['FE_JP/6_データベースコース資料.md · データベースの基本・正規化・SQL・トランザクション処理', 'FE_VN/6_Cơ sở dữ liệu-1.md · Cơ sở dữ liệu, thiết kế và thao tác dữ liệu']
VI_TITLES={23:'Quản lý tệp · Đường dẫn · Sao lưu và ôn tập',25:'Giao diện người dùng và khả năng sử dụng',26:'Đa phương tiện · Hình ảnh và âm thanh',29:'Cơ sở dữ liệu · Khóa và sơ đồ E-R',30:'Chuẩn hóa dữ liệu từ 1NF đến 3NF',31:'SQL · Truy vấn, kết nối và tổng hợp',32:'Giao dịch · ACID, khóa và phục hồi',33:'Học máy AI/ML và ôn cơ sở dữ liệu',34:'Nền tảng mạng · Mô hình OSI',35:'TCP/IP · Địa chỉ IP và chia subnet'}
SOURCES = {
23: ['ichibanyashashi/06_第６章_ソフトウェア.md · Lesson 06-02 データ管理とファイルシステム / 06-03 バックアップ', 'FE_JP/4_ソフトウェアコース資料.md · 第5回 ファイル管理 · Slide 42–58', 'FE_VN/3&4&5_Phần cứng&Phần Mềm&Cấu trúc hệ thống.md · Phần mềm, quản lý tệp'],
25: ['ichibanyashashi/08_第８章_ユーザーインタフェースとマルチメディア.md · 08-01 ユーザーインタフェース / 08-02 ユーザーインタフェース設計', 'FE_JP/9_システム開発技術コース資料.md · ユーザーインターフェース · Slide 56–60', 'FE_VN/9_Phát triển hệ thống.md · GUI và thao tác theo sự kiện (đối chiếu bổ sung)'],
26: ['ichibanyashashi/08_第８章_ユーザーインタフェースとマルチメディア.md · 08-03 マルチメディア技術', 'FE_JP/4_ソフトウェアコース資料.md · 第6回 マルチメディア · Slide 59–60', 'FE_VN/1&2_Cơ sở khoa học máy tính&Thuật toán và dữ liệu cấu trúc.md · Biểu diễn hình ảnh và âm thanh'],
29: ['ichibanyashashi/09_第９章_データベース.md · 09-01 データベース / 09-02 関係データベース / 09-03 データベース設計']+COMMON_DB,
30: ['ichibanyashashi/09_第９章_データベース.md · 09-03 データベース設計 · 関数従属・正規化']+COMMON_DB,
31: ['ichibanyashashi/09_第９章_データベース.md · 09-04 SQL · SELECT・WHERE・GROUP BY・HAVING']+COMMON_DB,
32: ['ichibanyashashi/09_第９章_データベース.md · 09-05 トランザクション管理 / 09-06 排他制御']+COMMON_DB,
33: ['ichibanyashashi/02_第２章_基礎理論②.md · AI・機械学習・教師あり学習・教師なし学習', 'ichibanyashashi/09_第９章_データベース.md · DB設計・SQL・トランザクションの復習', 'FE_JP/6_データベースコース資料.md · AI・機械学習 · Slide 157–165; DB復習', 'FE_VN/6_Cơ sở dữ liệu-1.md · Đối chiếu phần ôn DB; phần AI ưu tiên hai nguồn Nhật'],
34: ['ichibanyashashi/10_第10章_ネットワーク.md · 10-01 回線 / 10-02 LAN / 10-07 通信プロトコル・OSI基本参照モデル', 'FE_JP/7_ネットワークコース資料.md · OSI基本参照モデル・LAN間接続装置', 'FE_VN/7_Mạng máy tính.md · Giao thức, chức năng các tầng OSI và TCP/IP'],
35: ['ichibanyashashi/10_第10章_ネットワーク.md · 10-03 IPアドレス / 10-04 サブネットマスク / 10-05 グローバルIPアドレスとプライベートIPアドレス / 10-07 通信プロトコル', 'FE_JP/7_ネットワークコース資料.md · 第3回 TCP/IPネットワーク / 第4回 IPアドレスとサブネットマスク', 'FE_VN/7_Mạng máy tính.md · TCP/IP, địa chỉ IP và mặt nạ mạng']}

GROUPS = {
23:['File và cây thư mục / ファイルと木構造','Đường dẫn / パス','Sao lưu / バックアップ','Khôi phục và quy ước / 復旧と表記'],
25:['Bộ phận giao diện / GUI部品','Khả năng sử dụng / ユーザビリティ','Đánh giá và kiểm tra / 評価と検査','Phòng lỗi và tiếp cận / 誤り防止と利用'],
26:['Chữ và tín hiệu / 文字と信号','PCM và thông số / PCMと設定','Dung lượng và nén / 容量と圧縮','Xử lý ảnh và video / 画像・動画処理'],
29:['Mô hình và bảng / モデルと表','Khóa và miền giá trị / キーと値域','Ràng buộc và E-R / 制約とE-R','Quan hệ và phép toán / 関連と演算'],
30:['Phụ thuộc hàm / 関数従属','Dạng chuẩn và bất thường / 正規形と異常','Tách bảng đơn hàng / 注文表の分解','Kiểm tra thiết kế / 設計の確認'],
31:['Cấu trúc truy vấn / 検索の構造','Nhóm và đếm / グループ化と件数','Tổng hợp và kết nối / 集計と結合','Điều kiện và cập nhật / 条件と更新'],
32:['Đơn vị giao dịch và ACID / トランザクションとACID','Xác nhận và khóa / 確定とロック','Xung đột và phạm vi / 競合と範囲','Log và phục hồi / ログと回復'],
33:['AI và cách học / AIと学習方式','Mô hình và nhiệm vụ / モデルと課題','Ôn thiết kế DB / DB設計の復習','Ôn SQL và giao dịch / SQLと取引の復習'],
34:['Quy tắc và mạng / 規則とネットワーク','Mô hình và lớp dưới / モデルと下位層','Lớp trên và thiết bị / 上位層と装置','Chuyển tiếp và địa chỉ / 中継とアドレス'],
35:['Địa chỉ và mask / アドレスとマスク','Prefix và subnet / プレフィックスとサブネット','Khối địa chỉ và vận chuyển / アドレス範囲と転送','Giao thức và phân loại / プロトコルと分類']}

def esc(s): return html.escape(str(s), quote=True)
def dual(vi, ja): return f'<div class="reading-vi" lang="vi">{vi}</div><div class="reading-ja" lang="ja">{ja}</div>'
def json_text(data): return json.dumps(data,ensure_ascii=False).replace('</','<\\/')
def src_box(n, test=False):
    css = 'lesson-sources' if test else 'card source-intro'
    return f'<section class="{css}" aria-label="Tài liệu dùng để biên soạn"><h2 data-vi="Tài liệu dùng để biên soạn" data-ja="この教材の出典">Tài liệu dùng để biên soạn · 出典</h2><ul>'+''.join('<li>'+esc(s)+'</li>' for s in SOURCES[n])+'</ul>'+dual('<p>Giải thích và tình huống luyện do biên soạn từ các nguồn trên; không phải bản chép đề thi chính thức.</p>','<p>説明と演習の事例は上記教材を基に作成しています。公式過去問の転載ではありません。</p>')+'</section>'

def rotate(opts, answer, n):
    shift = n % 4
    return opts[shift:]+opts[:shift], (answer-shift)%4

def questions(n, rows):
    result=[]
    for mode in range(2):
        for i,(term, vi,ja,case_vi,case_ja) in enumerate(rows):
            peers=[j for j in range((i//5)*5,(i//5)*5+5) if j!=i]
            chosen=[i]+random.Random(100*n+i).sample(peers,3)
            if mode==0:
                q=f'Chọn mô tả đúng nhất của {term}.'
                jp=f'「{term}」の説明として最も適切なものはどれか。'
                opts=['<span class="reading-vi" lang="vi">'+esc(rows[j][1])+'</span><span class="reading-ja" lang="ja">'+esc(rows[j][2])+'</span>' for j in chosen]
            else:
                q=f'{case_vi} Chọn mục phù hợp nhất với tình huống.'
                jp=f'{case_ja} 最も適切な項目を選べ。'
                opts=[esc(rows[j][0]) for j in chosen]
            opts,ans=rotate(opts,0,i+mode+len(term))
            why=dual('<p><b>'+esc(term)+'</b>: '+esc(vi)+'</p><p>Trong ví dụ: '+esc(case_vi)+'</p>', '<p><b>'+esc(term)+'</b>: '+esc(ja)+'</p><p>例: '+esc(case_ja)+'</p>')
            details=[dual(esc(rows[j][0])+': '+esc(rows[j][1]),esc(rows[j][0])+': '+esc(rows[j][2])) for j in chosen[1:]]
            result.append(dict(d='easy' if mode==0 else 'med',q=q,jp=jp,opts=opts,ans=ans,why=why,details=details,ref=SOURCES[n][0]))
    return result

def applied(vi,ja,answer,wrong,explain,explain_ja):
    return dict(d='hard',q=vi,jp=ja,opts=[esc(str(v)) for v in [answer]+wrong],ans=0,why=dual(esc(explain),esc(explain_ja)),details=[],ref='Bài tính/tình huống biên soạn theo nguồn ghi ở đầu trang · 出典に基づく自作演習')

def math_questions(n):
    out=[]
    if n==23:
        for current,target,relative in [('/a/b','/a/c/x.txt','../c/x.txt'),('/a/b','/a/b/x.txt','./x.txt'),('/a','/a/b/c.txt','b/c.txt'),('/a/b/c','/a/x.txt','../../x.txt')]:
            out.append(applied(f'Theo quy ước / của sách, đang ở {current}. Đường dẫn tương đối nào tới {target}?',f'教材の/表記で現在位置は{current}。{target}への相対パスはどれか。',relative,['/wrong/x.txt','../../../wrong.txt','missing/x.txt'],f'Ghép đường dẫn với mốc hiện tại, xử lý .. để đi lên thư mục cha: {relative}.',f'現在位置を基準に..で上位へたどると{relative}。'))
        out.append(applied('Có full F, incremental I1,I2,I3 liên tiếp. Phục hồi tới I3 cần gì?','全体Fと連続する増分I1,I2,I3からI3時点へ戻すには何が必要か。','F + I1 + I2 + I3',['I3','F + I3','I1 + I3'],'Incremental nối tiếp lần sao lưu trước, cần đủ chuỗi.','増分は直前からの変更なので、全系列が必要。'))
    if n==26:
        for rate,bits,channels,seconds in [(8000,8,1,10),(16000,16,1,5),(44100,16,2,1),(48000,16,2,10)]:
            answer=rate*bits*channels*seconds//8
            out.append(applied(f'PCM {rate} Hz, {bits} bit/mẫu, {channels} kênh, {seconds} giây. Không nén, bỏ header: bao nhiêu byte?',f'PCM {rate} Hz・{bits}ビット・{channels}チャネル・{seconds}秒。非圧縮、ヘッダなしで何バイトか。',f'{answer:,} byte',[f'{answer*8:,} byte',f'{answer//2:,} byte',f'{answer*2:,} byte'],f'{rate} × {bits} × {channels} × {seconds} ÷ 8 = {answer} byte.','標本化周波数×量子化ビット数×チャネル数×時間÷8。'))
        for w,h,bits in [(640,480,24),(100,100,8),(1920,1080,24),(800,600,16)]:
            answer=w*h*bits//8
            out.append(applied(f'Ảnh {w} × {h}, {bits} bit/pixel, không nén, không header. Dung lượng byte?',f'{w}×{h}画素・{bits}ビット、非圧縮でヘッダなしの容量は何バイトか。',f'{answer:,}',[f'{answer*8:,}',f'{answer//2:,}',f'{answer*2:,}'],f'{w} × {h} × {bits} ÷ 8 = {answer} byte.','横×縦×ビット/画素÷8。'))
    if n==30:
        out.append(applied('Khóa {OrderID,ProductID}; ProductID → ProductName; {OrderID,ProductID} → Qty. Thuộc tính nào phụ thuộc bộ phận?','キー{OrderID,ProductID}、ProductID→ProductName、組→Qty。部分従属する属性はどれか。','ProductName',['Qty','OrderID','ProductID'],'ProductName chỉ cần ProductID là một phần khóa; Qty cần cả khóa.','ProductNameはキーの一部ProductIDだけで決まる。'))
        out.append(applied('Khóa EmployeeID; EmployeeID → DeptID; DeptID → DeptName. Tách bảng nào để bỏ phụ thuộc bắc cầu?','キーEmployeeID、EmployeeID→DeptID、DeptID→DeptName。推移的従属を除く分解はどれか。','Employee(EmployeeID,DeptID) + Dept(DeptID,DeptName)',['Employee(EmployeeID,DeptID,DeptName)','Employee(EmployeeID) + Dept(DeptName)','Employee(DeptName) + Dept(EmployeeID)'],'Giữ DeptID làm thuộc tính liên kết, tên phòng chỉ lưu theo phòng.','DeptIDを連結に残し、部門名を部門表へ分ける。'))
        out.append(applied('Cho R(A,B,C), A là khóa; A → B và B → C; không có khóa khác. Mức chuẩn cao nhất trong 1NF–3NF nếu mọi ô đơn trị?','R(A,B,C)、キーA、A→B、B→C、他の候補キーなし。各項目単一値のとき、1〜3NFの最高は。','2NF',['1NF','3NF','Chưa 1NF / 非1NF'],'Không có phụ thuộc bộ phận của khóa đơn nên đạt 2NF; B → C tạo bắc cầu vi phạm 3NF.','単一キーに部分従属はないが、B→Cで推移的従属がある。'))
        out.append(applied('Khóa {StudentID,CourseID}; chỉ cả cặp xác định Grade. Grade thuộc loại phụ thuộc nào?','{StudentID,CourseID}全体でのみGradeが決まる。従属はどれか。','完全関数従属',['部分関数従属','推移的関数従属','Không phụ thuộc / 従属なし'],'Đề đã quy định không phần thực sự nào của khóa quyết định Grade.','キーの一部分ではGradeが決まらないという条件。'))
    if n==31:
        db=sqlite3.connect(':memory:')
        db.executescript("CREATE TABLE E(id INT,dept TEXT,salary INT); INSERT INTO E VALUES(1,'A',100),(2,'A',200),(3,'B',300),(4,'B',400); CREATE TABLE D(dept TEXT); INSERT INTO D VALUES('A'),('B'),('C');")
        cases=[('SELECT COUNT(*) FROM E','4',['3','2','1']),('SELECT COUNT(*) FROM E WHERE salary BETWEEN 100 AND 200','2',['4','3','1']),('SELECT SUM(salary) FROM E','1000',['400','300','150']),('SELECT AVG(salary) FROM E','250',['150','600','300']),('SELECT COUNT(*) FROM E WHERE salary > 150','3',['1','2','4']),('SELECT COUNT(DISTINCT dept) FROM E','2',['4','3','1']),("SELECT COUNT(*) FROM E WHERE dept IN ('A','C')",'2',['0','3','4']),('SELECT dept FROM E GROUP BY dept HAVING SUM(salary) > 500','B',['A','C','A, B']),('SELECT COUNT(*) FROM D,E WHERE D.dept=E.dept','4',['5','3','2']),('SELECT MAX(salary) FROM E WHERE salary < 400','300',['400','200','100'])]
        for sql,ans,wrong in cases:
            actual=db.execute(sql).fetchall()
            assert (not actual and ans.startswith('Không')) or (len(actual)==1 and str(actual[0][0]).replace('.0','')==ans)
            out.append(applied('Cho E(id,dept,salary) = (1,A,100),(2,A,200),(3,B,300),(4,B,400); D(dept) = A,B,C. Kết quả: '+sql+' ?', 'E(id,dept,salary)=(1,A,100),(2,A,200),(3,B,300),(4,B,400)、D(dept)=A,B,C。次のSQLの結果は。 '+sql,ans,wrong,'Áp dụng lọc, nhóm và điều kiện kết hợp theo truy vấn. Kết quả đã kiểm chứng trên bộ dữ liệu này: '+ans,'条件・集計・結合を順に適用する。このデータでの確認結果: '+ans))
        db.close()
    if n==35:
        for address in ['192.168.1.130/26','192.168.1.70/27','10.2.3.17/28','172.16.4.200/25']:
            net=ipaddress.ip_network(address,strict=False)
            out.append(applied(f'IPv4 {address}: địa chỉ mạng là gì?',f'IPv4 {address}のネットワークアドレスはどれか。',str(net.network_address),[str(net.broadcast_address),str(net.network_address+1),str(net.broadcast_address-1)],f'Mask {net.netmask}; IP AND mask = {net.network_address}.',f'マスク{net.netmask}とIPのANDで{net.network_address}。'))
        for prefix in [24,26,27,28]:
            answer=2**(32-prefix)-2
            out.append(applied(f'Subnet IPv4 thông thường /{prefix}: tối đa bao nhiêu địa chỉ gán host? Không xét /31,/32.',f'通常のIPv4 /{prefix}でホストに割り当てられる数は。/31・/32は扱わない。',str(answer),[str(answer+2),str(answer+1),str(answer//2)],f'2^(32-{prefix}) - 2 = {answer}; bỏ địa chỉ mạng và broadcast.',f'2の(32-{prefix})乗−2＝{answer}。ネットワークとブロードキャストを除く。'))
    return out

def make_theory(n,rows,bank):
    template=(ROOT/'ly-thuyet/22.html').read_text(encoding='utf-8')
    old=LESSONS[22]['topic'];title=LESSONS[n]['topic']
    template=template.replace(old,esc(title)).replace('Phần cứng · Thiết bị và giao tiếp vào/ra',esc(VI_TITLES[n]))
    for a,b in [('Bài 22',f'Bài {n}'),('BÀI 22',f'BÀI {n}'),('Lý thuyết 22',f'Lý thuyết {n}'),('レッスン22',f'レッスン{n}'),('解説22',f'解説{n}')]: template=template.replace(a,b)
    template=template.replace('18 flashcard','20 flashcard').replace('暗記カード18枚','暗記カード20枚')
    template=re.sub(r'<div class="card source-intro">.*?</div>',lambda m:src_box(n),template,count=1,flags=re.S)
    intro=dual('<p>Học khái niệm, phân biệt các mục gần nhau rồi tự giải tình huống trước khi xem giải thích. Ví dụ là dữ liệu minh họa theo các quy tắc trong nguồn, không phải đề thi chính thức.</p>','<p>概念を確認し、似た項目を区別してから事例を解いてください。事例は教材の規則から作成した練習で、公式過去問ではありません。</p>')
    sections=[intro]
    for g in range(4):
        vi,ja=GROUPS[n][g].split(' / ')
        body_vi='';body_ja=''
        for term,a,b,ca,cb in rows[g*5:g*5+5]:
            body_vi+='<h4>'+esc(term)+'</h4><p>'+esc(a)+'</p><p class="example-box"><b>Ví dụ:</b> '+esc(ca)+'</p>'
            body_ja+='<h4>'+esc(term)+'</h4><p>'+esc(b)+'</p><p class="example-box"><b>例:</b> '+esc(cb)+'</p>'
        sections.append(f'<div class="card"><h3 id="lesson-{n}-topic-{g+1}" data-vi="{esc(vi)}" data-ja="{esc(ja)}">{esc(vi)}</h3>'+dual(body_vi,body_ja)+'</div>')
    examples=[]
    for i,q in enumerate([b for b in bank if b['d']=='hard'][:3] or bank[20:23]):
        answer=q['opts'][q['ans']]
        examples.append(f'<div class="card"><h3 id="lesson-{n}-example-{i+1}" data-vi="Ví dụ {i+1}" data-ja="例題{i+1}">Ví dụ {i+1}</h3>'+dual('<p>'+esc(q['q'])+'</p>','<p>'+esc(q['jp'])+'</p>')+'<details><summary data-vi="Xem lời giải" data-ja="解説を表示">Xem lời giải</summary><p><b>'+answer+'</b></p>'+q['why']+'</details></div>')
    for section,content in [('p1',''.join(sections)),('p2',''.join(examples))]:
        template=re.sub(rf'(<section[^>]*id="{section}"><h2.*?</h2>).*?(</section>)',lambda m:m[1]+content+m[2],template,count=1,flags=re.S)
    cards=[dict(cat='concept',front=t,frontJa=t,back=esc(a),backJa=esc(b)) for t,a,b,_,_ in rows]
    review=[]
    for q in bank[:20:2]:
        # The authored test text and alternatives already contain both languages.
        review.append(dict(q=q['q'],qVi=q['q'],qJa=q['jp'],opts=q['opts'],ans=q['ans'],expl=q['why'],explJa=q['why']))
    data=dict(number=n,cards=cards,quiz=review,available=True)
    template=re.sub(r'(<script id="lesson-data" type="application/json">).*?(</script>)',lambda m:m[1]+json_text(data)+m[2],template,count=1,flags=re.S)
    template=template.replace('../kiem-tra/22.html',f'../kiem-tra/{n}.html')
    previous=max(k for k in [1,2,3,4,5,6,7,8,9,10,11,12,13,15,16,17,18,19,20,21,22]+list(DATA) if k<n)
    template=template.replace('href="21.html"',f'href="{previous}.html"')
    template=template.replace('</style></head>','body .source-intro { margin:0 0 28px; } .source-intro h2 { font-size:16px; } .source-intro ul { padding-left:20px; } .source-intro p { font-size:12px; } .card details { margin-top:16px; } .card details summary { cursor:pointer; color:var(--primary); } </style></head>')
    responsive_toc="""<script>
// Keep the source header and lesson reachable without scrolling past the mobile TOC.
const lessonSmallScreen=matchMedia('(max-width:800px)');
const lessonContents=document.querySelector('.reading-sidebar details');
function fitLessonContents(){lessonContents.open=!lessonSmallScreen.matches;}
fitLessonContents();lessonSmallScreen.addEventListener('change',fitLessonContents);
</script>"""
    return template.replace('</body>',responsive_toc+'</body>')

def make_test(n,bank):
    template=(ROOT/'kiem-tra/22.html').read_text(encoding='utf-8')
    template=template.replace(LESSONS[22]['topic'],esc(LESSONS[n]['topic']))
    template=template.replace('(40問)',f'({len(bank)}問)')
    template=template.replace('40 câu · Thiết bị và giao tiếp vào/ra · Bài luyện theo tài liệu nguồn',f'{len(bank)} câu · {esc(LESSONS[n]["topic"])} · Bài luyện biên soạn theo nguồn')
    template=re.sub(r'<section class="lesson-sources".*?</section>',lambda m:src_box(n,True),template,count=1,flags=re.S)
    template=re.sub(r'(<script type="application/json" id="quiz-data">).*?(</script>)',lambda m:m[1]+json_text(bank)+m[2],template,count=1,flags=re.S)
    # Keep all UI colors from earlier tests. Bound the new source header on phones.
    template=template.replace('</head>','<style>.lesson-sources { margin:20px 0; padding:18px; border:1px solid #444; border-radius:12px; font-size:13px; overflow-wrap:anywhere; } .lesson-sources h2 { font-size:16px; } .lesson-sources h2,#quiz-app h2,#quiz-app h3 { color:var(--text) !important; } .lesson-sources ul { padding-left:20px; } .lesson-sources li { margin:8px 0; } .lesson-sources p { font-size:12px; } </style></head>')
    return template

def run():
    SOURCES[23].append('Phần ôn Ch.1–5: câu đã có ở bài 1,5,8,10,13,15,19,21; xem ref từng lời giải. Chủ đề nền tảng từ ichibanyashashi 第1–5章 và phần bộ nhớ ở 第6章.')
    for n,text in DATA.items():
        rows=[tuple(row.split('~')) for row in text.strip().splitlines() if row.strip()]
        assert len(rows)==20 and all(len(row)==5 for row in rows),n
        assert len({r[0] for r in rows})==20
        bank=questions(n,rows)
        for i,q in enumerate(math_questions(n)):
            q['opts'],q['ans']=rotate(q['opts'],q['ans'],i+n)
            bank[20+i]=q
        if n==23:
            for offset,source in enumerate([1,5,8,10,13,15,19,21]):
                content=(ROOT/f'kiem-tra/{source}.html').read_text(encoding='utf-8')
                items=json.loads(re.search(r'<script[^>]*id="quiz-data"[^>]*>(.*?)</script>',content,re.S)[1])
                q=copy.deepcopy(items[0])
                q.setdefault('why',q.get('expl',''))
                q.setdefault('jp',q.get('qJa','両方の入力が1のときにだけ1となる論理演算はどれか。' if source==5 else q['q']))
                q['ref']=f'Ôn từ bài {source} · {LESSONS[source]["topic"]} · '+str(q.get('ref',''))
                bank[32+offset]=q
        assert len(bank)==40 and len({q['q'] for q in bank})==40
        assert all(len(q['opts'])==len(set(q['opts']))==4 and 0<=q['ans']<4 for q in bank)
        (ROOT/f'ly-thuyet/{n}.html').write_text(make_theory(n,rows,bank),encoding='utf-8')
        (ROOT/f'kiem-tra/{n}.html').write_text(make_test(n,bank),encoding='utf-8')
        LESSONS[n].update(theory=f'ly-thuyet/{n}.html',test=f'kiem-tra/{n}.html')
    # The milestone is a cumulative review, with its advertised 50 questions.
    pool=[];coverage=[]
    for n in [1,2,3,4,5,6,7,8,9,10,11,12,13,15,16,17,18,19,20,21,22,23]:
        file=ROOT/f'kiem-tra/{n}.html'
        match=re.search(r'<script[^>]*id="quiz-data"[^>]*>(.*?)</script>',file.read_text(encoding='utf-8'),re.S)
        if not match: continue
        items=json.loads(match[1]); chosen=random.Random(2400+n).sample(items,min(2,len(items)))
        for q in chosen:
            item=copy.deepcopy(q)
            item['ref']=f'Ôn từ bài {n} · {LESSONS[n]["topic"]} · '+str(q.get('ref',''))
            pool.append(item)
        coverage.append(n)
    # Add six additional, distinct items from the completed foundation lessons.
    for n in [1,3,10,15,21,23]:
        items=json.loads(re.search(r'<script[^>]*id="quiz-data"[^>]*>(.*?)</script>',(ROOT/f'kiem-tra/{n}.html').read_text(encoding='utf-8'),re.S)[1])
        q=next(q for q in items if q['q'] not in {p['q'] for p in pool})
        q=copy.deepcopy(q);q['ref']=f'Ôn từ bài {n} · {LESSONS[n]["topic"]} · '+str(q.get('ref',''));pool.append(q)
    assert len(pool)==50 and len({q['q'] for q in pool})==50
    # Replace ambiguous or incorrect legacy items instead of carrying them into the new review.
    fixes={
      6:applied('Trong từ 8 bit, dịch trái logic 00001100 một vị trí, bỏ bit tràn và điền 0. Kết quả?','8ビット00001100を論理左シフト1回。あふれを捨て0で埋める。結果は。','00011000',['00000110','10001100','00001101'],'Mỗi bit sang trái một vị trí, phải điền 0: 00011000.','各ビットを左へ1桁ずらし、右端を0で埋める。'),
      16:applied('A và B độc lập; P(A)=0,5 và P(B)=0,4. P(A và B) bằng bao nhiêu?','AとBは独立。P(A)=0.5、P(B)=0.4。共に起こる確率は。','0,2 / 0.2',['0,9 / 0.9','0,1 / 0.1','0,5 / 0.5'],'Độc lập là giả thiết cần thiết: 0,5 × 0,4 = 0,2.','独立なので確率を掛け、0.5×0.4＝0.2。'),
      24:applied('Quicksort: các giá trị [8,7,9], chọn pivot 7. Sau khi tách pivot, nhóm nhỏ hơn và lớn hơn là gì?','クイックソートで[8,7,9]のピボットを7とする。小さい群と大きい群は。','[] ; [8,9]',['[8] ; [9]','[7] ; [8,9]','[8,9] ; []'],'8 và 9 đều lớn hơn 7; không có phần tử nhỏ hơn. Pivot không thuộc hai nhóm.','8も9も7より大きい。小さい群は空、ピボットは両群から外す。'),
      33:applied('Theo bảng USB trong tài liệu, USB 3.0 SuperSpeed có tốc độ tối đa nào?','教材のUSB 3.0 SuperSpeedの最大転送速度は。','5 Gbps',['5 Mbps','480 Mbps','12 Mbps'],'Bảng sách và slide ghi 5 Gbps, không suy ra chỉ từ hình dạng đầu cắm.','教材では5 Gbps。コネクタ形状だけで判断しない。'),
      37:applied('Task đang chờ I/O; I/O đã hoàn tất nhưng CPU đang chạy task khác. Nó chuyển sang trạng thái nào?','I/O待ちが完了したがCPUは別タスクを実行中。通常どの状態へ移るか。','実行可能',['実行','消滅','I/O待ちのまま / 待ちのまま'],'Hoàn tất chờ làm task sẵn sàng; chưa đồng nghĩa được cấp CPU ngay.','I/O完了で実行可能になり、CPU割当ては別の段階。'),
      45:applied('Biểu diễn -5 bằng bù 2 trong đúng 8 bit là gì?','-5を8ビットの2の補数で表すとどれか。','11111011',['11111010','10000101','00000101'],'+5 = 00000101, đảo bit được 11111010, cộng 1 được 11111011.','5のビットを反転して1を加える。')}
    for i,q in fixes.items():
        q['opts'],q['ans']=rotate(q['opts'],q['ans'],i)
        q['ref']='Bài ôn đã hiệu chỉnh · '+pool[i].get('ref','')
        pool[i]=q
    SOURCES[24]=['Phạm vi ôn · 復習範囲: '+', '.join(str(n) for n in coverage), 'Chọn câu từ kiem-tra/1.html đến kiem-tra/23.html, bỏ bài 14; hiệu chỉnh những câu có dữ kiện chưa rõ hoặc đáp án chưa chính xác. Mỗi lời giải ghi bài nguồn.', 'Nguồn theo các chủ đề đã học: ichibanyashashi 第1章 基礎理論① / 第2章 基礎理論② / 第3章 アルゴリズムとプログラミング / 第4章 コンピュータの構成要素 / 第5章 システムの構成要素 / 第6章 ソフトウェア; FE_JP 基礎理論・アルゴリズム・ハードウェア・ソフトウェア・システム構成要素.', 'Phần bổ sung bài 23: Lesson 06-02 データ管理とファイルシステム / 06-03 バックアップ. Đây là đề ôn tích lũy biên soạn từ bộ câu trong dự án, không phải đề FE chính thức.']
    (ROOT/'kiem-tra/24.html').write_text(make_test(24,pool),encoding='utf-8')
    LESSONS[24].update(theory=None,test='kiem-tra/24.html')
    (ROOT/'lessons.json').write_text(json.dumps(CATALOG,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('Created 10 theory pages, ten 40-question tests and one 50-question milestone. Skipped 27/28: unclear source scope.')

if __name__=='__main__': run()
