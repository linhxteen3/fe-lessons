"""Build only the previously empty roadmap entries, using existing page shells."""
import copy
import html
import json
import random
import re
from pathlib import Path
from bs4 import BeautifulSoup
import build_lessons_23_35 as base
from remaining_lesson_data import DATA

ROOT = Path(__file__).resolve().parents[1]
REVIEW = {27:([22,25,26],40),28:([25,26],40),38:([34,35,36,37],40),
          43:([39,40,41,42],40),44:([20,21,22,23,25,26,29,30,31,32,33,34,35,36,37,39,40,41,42],40),
          45:([*range(1,14),14,*range(15,24),25,26,*range(29,38),39,40,41,42],80),
          51:([47,48,49,50],40),56:([52,53,54,55],40)}
TITLES = {14:'Lập trình hướng đối tượng và UML',36:'Thiết bị mạng · DNS, DHCP, NAT',37:'Web, HTTP và thư điện tử',
39:'An toàn thông tin · CIA và rủi ro',40:'Nhận diện tấn công mạng',41:'Mật mã, hàm băm và chữ ký điện tử',42:'Bảo vệ mạng và kiểm soát truy cập',
47:'Vòng đời phát triển hệ thống',48:'Phương pháp phát triển phần mềm',49:'Mô hình nghiệp vụ · UML và DFD',50:'Chia module và kỹ thuật kiểm thử',
52:'Quản lý dự án',53:'Lập lịch, đường găng và EVM',54:'Quản lý dịch vụ IT',55:'Kiểm toán và vận hành hệ thống',
57:'Chiến lược hệ thống và lập kế hoạch',58:'Chiến lược kinh doanh · SWOT, PPM, BSC',59:'Hệ thống kinh doanh · IoT và AI',
60:'Hoạt động doanh nghiệp · OR, IE và kế toán',61:'Pháp luật và ôn tập giai đoạn 3'}
GROUPS = {
14:['Đối tượng và che giấu thông tin / オブジェクトと情報隠蔽','Kế thừa và đa hình / 継承と多態性','Cấu trúc trong UML / UMLの構造','Hành vi và tương tác / 振舞いと相互作用'],
36:['Thiết bị tầng thấp / 下位層の機器','Kết nối và chuyển tiếp / 接続と中継','Tra tên và cấp địa chỉ / 名前解決とアドレス割当て','Chuyển đổi địa chỉ / アドレス変換'],
37:['Web và yêu cầu HTTP / WebとHTTP要求','Lưu trạng thái và chuyển thư / 状態とメール転送','Định dạng thư và người nhận / メール形式と宛先','Ứng dụng và nhận biết dịch vụ / 応用とサービス識別'],
39:['Tài sản và CIA / 資産とCIA','Đánh giá và xử lý rủi ro / リスクの評価と対応','Quản lý an toàn / セキュリティの管理','Liên tục kinh doanh và đe dọa / 事業継続と脅威'],
40:['Các loại mã độc / マルウェア','Lừa đảo và lấy thông tin / 詐欺と情報窃取','Tấn công xác thực và dịch vụ / 認証とサービスへの攻撃','Ứng dụng và xâm nhập / アプリと侵入'],
41:['Thông điệp và khóa chung / メッセージと共通鍵','Khóa công khai và thuật toán / 公開鍵とアルゴリズム','Mã hóa kết hợp và băm / 組合せとハッシュ','Chữ ký và chứng thư / 署名と証明書'],
42:['Tường lửa và phát hiện / 防壁と検知','Vùng mạng và xác thực / 領域と認証','Quyền và bảo vệ đầu cuối / 権限と端末保護','Giám sát và thiết bị di động / 監視とモバイル'],
47:['Mục tiêu và yêu cầu / 目的と要求','Kiến trúc và thiết kế / 構成と設計','Hiện thực và kiểm thử / 実装とテスト','Bàn giao và duy trì / 受入れと維持'],
48:['Mô hình phát triển / 開発モデル','Scrum và công việc lặp / スクラムと反復','Phản hồi và kỹ thuật / フィードバックと技術','Cải tiến và quản lý thay đổi / 改善と変更の管理'],
49:['Luồng dữ liệu / データの流れ','Phân rã và hướng tiếp cận / 詳細化と設計アプローチ','Dữ liệu và cấu trúc / データと構造','Tương tác và hành vi / 相互作用と振舞い'],
50:['Module và phụ thuộc / モジュールと依存','Cấu trúc và chiến lược kiểm thử / 構造とテスト方針','Dữ liệu và độ bao phủ / 入力と網羅','Tích hợp và kiểm tra lại / 結合と再確認'],
52:['Dự án và các bên liên quan / プロジェクトと関係者','Phạm vi và nguồn lực / 範囲と資源','Tiến độ, chất lượng và rủi ro / 日程・品質・リスク','Thông tin, thay đổi và ước lượng / 情報・変更・見積り'],
53:['Phân rã và lập lịch / 分解と日程','Tính xuôi và ngược / 順算と逆算','Rút ngắn và đo giá trị / 短縮と価値の測定','Chi phí và các chỉ số EVM / 費用とEVM指標'],
54:['Dịch vụ và thỏa thuận / サービスと合意','Khôi phục và tìm nguyên nhân / 復旧と原因分析','Thay đổi và năng lực dịch vụ / 変更とサービス能力','Cải tiến và đầu mối hỗ trợ / 改善と窓口'],
55:['Kiểm toán và bằng chứng / 監査と証拠','Theo dõi và kiểm soát nội bộ / 追跡と内部統制','Cơ sở vật chất và chuyển đổi / 設備と移行','Vận hành và phục hồi / 運用と回復'],
57:['Chiến lược và quy trình / 戦略と業務','Tự động hóa và hạ tầng / 自動化と基盤','Dịch vụ và phân tích / サービスと分析','Mua sắm và đánh giá đầu tư / 調達と投資評価'],
58:['Môi trường và SWOT / 環境とSWOT','Danh mục và PPM / 事業とPPM','Đánh giá và lợi thế / 評価と強み','Giá trị và vòng đời / 価値とライフサイクル'],
59:['Bán hàng và sản xuất / 販売と生産','Giao dịch điện tử / 電子取引','Nhận dạng và thiết bị kết nối / 識別と接続機器','Xử lý gần nguồn và ứng dụng / 現場処理と応用'],
60:['Tổ chức và đào tạo / 組織と教育','Phân tích và tối ưu / 分析と最適化','Xác suất, chi phí và hòa vốn / 確率・費用・損益分岐','Báo cáo và khấu hao / 財務諸表と償却'],
61:['Quyền và biểu đạt / 権利と表現','Thiết kế và bí mật kinh doanh / デザインと営業秘密','Thông tin và trách nhiệm / 情報と責任','Hợp đồng và sử dụng / 契約と利用']}

def path(folder,prefix):
    return next((ROOT/folder).glob(prefix+'_*'))

def source(n,primary,jp,vn,section):
    return [str(path('ichibanyashashi',primary).relative_to(ROOT)).replace('\\','/')+' · '+section,
            str(path('FE_JP',jp).relative_to(ROOT)).replace('\\','/')+' · đối chiếu thuật ngữ và ví dụ / 用語と例の照合',
            str(path('FE_VN',vn).relative_to(ROOT)).replace('\\','/')+' · đối chiếu giải thích / 説明の照合']

SOURCES={
14:source(14,'12','2','9','12-04 プログラミングとオブジェクト指向; UML bổ sung từ FE_JP 第2回'),
36:source(36,'10','7','7','10-03 IPアドレス; 10-05 NAT/NAPT・DHCP; 10-06 DNS; 10-07 ネットワーク機器'),
37:source(37,'10','7','7','10-06 URL; 10-07 プロトコル・NTP; 10-08 インターネット応用'),
39:source(39,'11','8','8','11-01 脅威; 11-04 リスクマネジメント; 11-05 ISMS'),
40:source(40,'11','8','8','11-01 情報セキュリティの脅威'),
41:source(41,'11','8','8','11-02 暗号技術; 11-03 デジタル署名と認証局'),
42:source(42,'11','8','8','11-06 脅威への対策'),
47:source(47,'12','9','9','12-01 システム開発技術; 12-02 要件定義; 12-03 設計; 12-05 テスト'),
48:source(48,'13','9','9','13-01 ソフトウェアの開発モデル・XP・構成管理'),
49:source(49,'12','9','9','12-03 業務モデル・DFD; 12-04 UML; chi tiết ký pháp bổ sung từ FE_JP'),
50:source(50,'12','9','9','12-03 モジュール結合度; 12-05 テスト; FE_VN 3.2.4 モジュール分割'),
52:source(52,'14','10','10&11','14-01 プロジェクトマネジメント; 14-02 スコープ; 14-03 資源; 14-04 時間; 14-05 コスト; 14-06 リスク'),
53:source(53,'14','10','10&11','14-02 WBS; 14-04 アローダイアグラム・クリティカルパス; FE_VN Trang 18–21'),
54:source(54,'15','10','10&11','15-01 サービスマネジメント; 15-02 SLA; 15-03 サービスデスク; FE_VN chỉ bổ trợ quản lý / 管理の補足'),
55:source(55,'15','10','10&11','15-01 システム移行; 15-04 ファシリティ; 15-05 監査; 15-06 内部統制'),
57:source(57,'16','11','10&11','16-01〜04 システム戦略・業務・クラウド・BI'),
58:source(58,'18','11','10&11','18-01〜06 SWOT・PPM・BSC・マーケティング'),
59:source(59,'19','11','10&11','19-01〜04 ビジネス・生産・EC・IoT'),
60:source(60,'20','11','10&11','20-01 企業活動; 20-02 経営組織; 20-03 OR・IE; 20-04 損益分岐点; 20-05 財務諸表; 20-06 資産管理'),
61:source(61,'21','11','8','知的財産権・セキュリティ関連法・個人情報・契約; FE_VN đối chiếu chuẩn hóa, không thay luật Nhật')}
SOURCES[57].append(str(path('ichibanyashashi','17').relative_to(ROOT)).replace('\\','/')+' · 17-01 企画と要件定義; 17-02 RFI・RFP')
SOURCES[59].append(str(path('ichibanyashashi','02').relative_to(ROOT)).replace('\\','/')+' · AI・機械学習; xem thêm bài 33 / レッスン33も参照')
SUPPLEMENT = {
53:[('NSF · EVM Gold Card: PV, EV, AC, CV, SV, CPI, SPI (nguồn bổ sung đã được đồng ý / 承認済み補足資料)', 'https://www.nsf.gov/od/ori/evm-gold-card')],
61:[('PPC · Phân biệt 個人情報 và 個人データ (đối chiếu 2026-10-20)', 'https://www.ppc.go.jp/all_faq_index/faq2-q2-3/'),
    ('METI · 営業秘密: ba điều kiện / 三要件','https://www.meti.go.jp/policy/economy/chizai/chiteki/trade-secret.html'),
    ('文化庁 · 著作権テキスト 令和8年度版','https://www.bunka.go.jp/seisaku/chosakuken/seidokaisetsu/pdf/94383901_01.pdf')]}

def fragment(value,lang):
    soup=BeautifulSoup(value,'html.parser')
    blocks=soup.select('.reading-'+lang)
    if blocks:return ''.join(str(b) for b in blocks)
    if ' / ' in value and '<' not in value:return value.split(' / ',1)[lang=='ja']
    return value

def bilingual(bank):
    for q in bank:
        q['qJa']=q['jp']
        q['optsJa']=[fragment(o,'ja') for o in q['opts']]
        q['opts']=[fragment(o,'vi') for o in q['opts']]
        q['whyJa']=fragment(q['why'],'ja');q['why']=fragment(q['why'],'vi')
        q['detailsJa']=[fragment(d,'ja') for d in q.get('details',[])]
        q['details']=[fragment(d,'vi') for d in q.get('details',[])]
    return bank

def questions(n,rows):
    bank=base.questions(n,rows)
    for i,q in enumerate(bank):
        term,vi,ja,cv,cj=rows[i%20]
        q['details']=[]
        # Label each alternative's meaning, so distractors are explained in displayed order.
        for option in q['opts']:
            if i<20:
                candidates=[r for r in rows if fragment(option,'vi')==f'<span class="reading-vi" lang="vi">{base.esc(r[1])}</span>']
            else:
                candidates=[r for r in rows if base.esc(r[0])==option]
            assert len(candidates)==1,(n,i,option)
            t,a,b,_,_=candidates[0]
            q['details'].append(base.dual(base.esc(t)+': '+base.esc(a),base.esc(t)+': '+base.esc(b)))
    return bank

def applied(n):
    out=[]
    def add(vi,ja,answer,wrong,why,whyja):
        q=base.applied(vi,ja,answer,wrong,why,whyja)
        q['ref']=SOURCES[n][0]
        q['opts'],q['ans']=base.rotate(q['opts'],0,len(out)+n)
        q['details']=[base.dual('Đối chiếu từng lựa chọn với quy tắc đã nêu trong lời giải; chỉ kết quả thỏa toàn bộ dữ kiện là đúng.','各選択肢を解説の規則と照合し、全条件を満たす結果を選ぶ。')]
        out.append(q)
    if n==14:
        add('Quan hệ Customer (1) — Order (0..*): một khách có thể có bao nhiêu đơn?', 'Customer(1) — Order(0..*)の関連で顧客一人の注文数は。','0..*',['1','0..1','2..3'],'0..* nghĩa là không có hoặc có nhiều đơn; đầu 1 cho biết mỗi đơn thuộc một khách.','0..*は0件以上。反対側の1は一つの注文に顧客が一人対応することを示す。')
        add('Animal x nhận một đối tượng Dog. Gọi x.speak() chạy cách sủa của Dog. Tính chất nào?', 'Animal型のxにDogを入れ、x.speak()がDogの処理を実行する。性質は。','ポリモーフィズム',['暗号化','正規化','キャッシュ'],'Cùng lời gọi theo giao diện Animal nhưng hành vi phụ thuộc đối tượng Dog thực tế.','同じ操作でも受け手の実際の型に応じて処理が変わる。')
    if n==36:
        add('Hai máy 192.168.1.2:51000 và 192.168.1.3:51000 cùng ra ngoài dưới IP 203.0.113.10 với cổng 40001 và 40002. Cơ chế nào?', '192.168.1.2:51000と192.168.1.3:51000が203.0.113.10の40001と40002に変換される。方式は。','NAPT',['DNS','DHCP','ARP'],'Cả IP lẫn cổng được chuyển đổi, nhờ đó nhiều máy dùng chung một IP ngoài.','IPとポートを変換するため、一つの公開IPを複数の端末で共有できる。')
        add('Gõ IP thì Web hoạt động nhưng gõ tên miền không được. Nên kiểm tra trước chức năng nào?', 'IPを直接指定するとWebへ接続できるが名前では失敗する。まず確認する機能は。','DNS',['UPS','RAID','PCM'],'Tên cần được phân giải. Kết quả này gợi ý kiểm tra DNS, chưa đủ để khẳng định nguyên nhân duy nhất.','名前解決を確認する手掛かりになる。ただしこれだけで唯一の原因とは断定しない。')
    if n==37:
        add('Chỉ Bcc có địa chỉ C; To có A, Cc có B. Người nhận A có nhìn thấy C trong danh sách Bcc không?', 'ToがA、CcがB、BccだけにCがある。Aの受信メールにBccのCを表示するか。','Không / 表示しない',['Có / 表示する','Chỉ khi A trả tiền / 有料時だけ','Chỉ khi C dùng POP3 / POP3時だけ'],'Bcc không hiển thị địa chỉ đó với các người nhận khác; không có nghĩa nội dung thư được mã hóa.','Bccの宛先は他の受信者へ表示しない。本文が暗号化されるという意味ではない。')
        add('Mã hóa đường truyền Web có tự bảo đảm người dùng không gửi dữ liệu cho website lừa đảo không?', 'Webの通信暗号化だけで、偽サイトへの情報送信も必ず防げるか。','Không / 防げない',['Có, luôn luôn / 必ず防げる','DNS không còn cần / DNSが不要','Mọi dữ liệu đều công khai / 全データが公開'],'TLS bảo vệ kênh tới đầu bên kia; vẫn phải kiểm tra đúng website và nội dung hành động.','TLSは接続先までの通信を保護する。正しい相手かと送信内容の確認も必要。')
    if n==39:
        add('Số dư bị sửa trái phép, không có bằng chứng dữ liệu đã lộ hay dịch vụ đã ngừng. Đặc tính nào bị vi phạm trực tiếp?', '残高が不正に変更された。漏えいや停止は示されていない。直接損なわれた特性は。','完全性',['機密性','可用性','圧縮率'],'Thay đổi sai nội dung trực tiếp vi phạm tính toàn vẹn. Không tự suy thêm rò rỉ hay ngừng dịch vụ.','不正な変更は完全性の侵害。他の影響は設問にないため付け加えない。')
    if n==40:
        add('Một mật khẩu phổ biến được thử trên 1000 ID. Đây là kiểu nào?', '一つのよくあるパスワードを1000個のIDで試す。攻撃は。','リバースブルートフォース',['パスワードリスト攻撃','SQLインジェクション','DDoS'],'Giữ mật khẩu cố định và thay ID; khác dùng các cặp ID–mật khẩu đã rò rỉ.','パスワードを固定してIDを変える。漏えいした組を使う攻撃とは異なる。')
    if n==41:
        for people in [3,4,5,6]:
            keys=people*(people-1)//2
            add(f'{people} người, mỗi cặp giữ riêng một khóa chung, không dùng máy chủ phân phối. Tổng số khóa?', f'{people}人が各二者間専用の共通鍵を共有する。配布サーバは使わない。鍵の総数は。',str(keys),[str(keys+1),str(people*people),str(people*(people-1))],f'Có n(n−1)/2 cặp không phân biệt thứ tự: {people}×{people-1}/2 = {keys}.','順序を区別しない二人の組の数なのでn(n−1)/2。')
        add('A muốn vừa giữ bí mật cho B vừa chứng minh do A gửi. Chọn cặp khóa theo mô hình cơ bản?', 'AがBだけに読めるようにし、Aの署名も検証可能にする。基本の鍵の組は。','Mã hóa: B công khai; ký: A bí mật / 暗号化B公開・署名A秘密',['Mã hóa: A công khai; ký: B bí mật / 暗号化A公開・署名B秘密','Mã hóa: A bí mật; ký: B công khai / 暗号化A秘密・署名B公開','Chỉ dùng khóa công khai A / A公開鍵だけ'],'B dùng khóa bí mật B để giải mã; người nhận dùng khóa công khai A để xác minh chữ ký A.','BはBの秘密鍵で復号し、受信者はAの公開鍵でAの署名を検証する。')
    if n==42:
        add('Mật khẩu và câu hỏi bí mật đều là thông tin người dùng biết. Có phải hai loại yếu tố độc lập không?', 'パスワードと秘密の質問はどちらも知識情報である。異なる種類の二要素か。','Không / 異ならない',['Có / 異なる','Đều là sinh trắc / 両方生体','Đều là sở hữu / 両方所持'],'Hai bí mật cùng thuộc yếu tố kiến thức. Đếm loại yếu tố, không chỉ số bước.','どちらも知識要素。手順数ではなく要素の種類を数える。')
    if n==50:
        add('Với điều kiện A OR B, dùng (T,F) và (F,T). Đạt điều kiện đơn nhưng có đạt cả hai nhánh quyết định không?', 'A OR Bに(T,F)と(F,T)を使う。各条件の真偽を含むが判定全体の両分岐も通るか。','Không / 通らない',['Có / 通る','Không câu lệnh nào chạy / 命令は実行されない','Có đủ mọi tổ hợp / 全組合せを含む'],'Cả hai lần A OR B đều đúng; chưa có nhánh sai. Việc đánh giá ngắn mạch thực tế cần xét theo ngôn ngữ.','両方とも判定結果は真なので偽の分岐を通らない。実行時の短絡評価は言語の規則も考える。')
        for lo,hi in [(1,100),(10,20),(5,50)]:
            add(f'Đầu vào nguyên hợp lệ [{lo},{hi}]. Bộ nào kiểm tra hai ranh giới và ngay ngoài mỗi ranh giới?',f'整数の有効範囲[{lo},{hi}]。両端とその直外を調べる組は。',f'{lo-1}, {lo}, {hi}, {hi+1}',[f'{lo+1}, {lo+2}',f'{lo}, {lo+1}, {lo+2}',f'{hi-2}, {hi-1}'],'Cần điểm ngay dưới cận dưới, cận dưới, cận trên và ngay trên cận trên.','下限直前、下限、上限、上限直後を選ぶ。')
    if n==53:
        for a,b,c,d in [(3,4,2,5),(4,2,6,1),(2,7,4,3)]:
            answer=max(a+b,c+d)
            add(f'Hai nhánh độc lập A({a})→B({b}) và C({c})→D({d}) cùng bắt đầu lúc 0; phải xong cả hai mới bàn giao. Sớm nhất mấy ngày?',f'独立したA({a})→B({b})とC({c})→D({d})が時刻0に開始し、両方完了後に納入する。最短日数は。',str(answer),[str(a+b+c+d),str(answer-1),str(answer+1)],f'Hai nhánh song song dài {a+b} và {c+d}; lấy max = {answer}, không cộng cả hai nhánh.',f'並列経路の長さは{a+b}と{c+d}。長い方の{answer}が全体期間。')
        for pv,ev,ac in [(100,80,100),(120,90,100),(80,100,125)]:
            for metric,answer,formula in [('CV',ev-ac,'EV−AC'),('SV',ev-pv,'EV−PV')]:
                add(f'PV={pv}, EV={ev}, AC={ac} (cùng đơn vị tiền). {metric} bằng bao nhiêu?',f'PV={pv}、EV={ev}、AC={ac}（同一金額単位）。{metric}は。',str(answer),[str(-answer),str(answer+10),str(answer-10)],f'{metric}={formula}={answer}; âm là không thuận lợi theo chỉ số này.',f'{metric}={formula}={answer}。この差異は負なら不利。')
                out[-1]['ref']='NSF EVM Gold Card · https://www.nsf.gov/od/ori/evm-gold-card'
    if n==57:
        for investment,profit in [(100,20),(200,50),(80,24)]:
            answer=profit/investment*100
            add(f'Quy định ROI = lợi nhuận ròng / vốn đầu tư ×100%. Đầu tư {investment}, lợi nhuận ròng {profit}. ROI?',f'ROI＝純利益÷投資額×100%とする。投資{investment}、純利益{profit}のROIは。',f'{answer:g}%',[f'{100/answer:g}%',f'{answer+10:g}%',f'{answer/2:g}%'],f'Theo định nghĩa đề cho: {profit}/{investment}×100% = {answer:g}%. Không trừ vốn lần nữa vì đã cho lợi nhuận ròng.',f'設問の定義から{profit}/{investment}×100%＝{answer:g}%。純利益から投資額を再度引かない。')
    if n==60:
        for fixed,price,variable in [(1000,50,30),(1200,100,40),(600,40,10)]:
            qty=fixed//(price-variable);assert qty*(price-variable)==fixed
            add(f'Định phí {fixed}, giá mỗi sản phẩm {price}, biến phí mỗi sản phẩm {variable}. Không xét thuế; bán bao nhiêu để hòa vốn?',f'固定費{fixed}、単価{price}、単位変動費{variable}。税なしで損益分岐の数量は。',str(qty),[str(qty+10),str(qty-5),str(qty*2)],f'Lãi góp đơn vị = {price}−{variable}={price-variable}. Số lượng = {fixed}/{price-variable}={qty}.',f'単位限界利益は{price-variable}。固定費{fixed}を割ると{qty}個。')
        for cost,residual,years in [(1000,100,5),(600,0,3),(800,80,4)]:
            answer=(cost-residual)//years;assert answer*years==cost-residual
            add(f'Đề quy định khấu hao đều = (giá mua−giá trị còn lại)/số năm. Giá {cost}, còn lại {residual}, {years} năm. Mỗi năm?',f'定額の償却額＝(取得額−残存額)÷年数とする。取得{cost}、残存{residual}、{years}年。毎年の額は。',str(answer),[str(answer+1),str(answer+20),str(answer//2)],f'({cost}−{residual})/{years}={answer}. Đây là mô hình bài tính, không suy ra quy định thuế.',f'({cost}−{residual})/{years}＝{answer}。設問の計算条件であり税務規定の説明ではない。')
        # Enumerate integer candidates and check the continuous vertices for this small LP.
        feasible=[(3*x+2*y,x,y) for x in range(5) for y in range(4) if x+y<=4]
        assert max(feasible)[0]==12
        add('Tối đa 3x+2y; x≥0,y≥0,x≤4,y≤3,x+y≤4. Phương án tối ưu?', '3x+2yを最大化。x≥0,y≥0,x≤4,y≤3,x+y≤4。最適解は。','x=4, y=0',['x=0, y=3','x=1, y=3','x=4, y=3'],'Đỉnh khả thi (0,0),(4,0),(1,3),(0,3) cho giá trị 0,12,9,6. (4,3) vi phạm x+y≤4.','実行可能な頂点の値は0、12、9、6。(4,3)は制約違反。最大は(4,0)。')
    return out

def source_box(n,test=False):
    result=original_src_box(n,test)
    links=SUPPLEMENT.get(n,[])
    if links:
        result=result.replace('</ul>',''.join(f'<li><a href="{html.escape(url,quote=True)}">{base.esc(label)}</a></li>' for label,url in links)+'</ul>',1)
    return result

def load_bank(n):
    text=(ROOT/f'kiem-tra/{n}.html').read_text(encoding='utf-8')
    return json.loads(re.search(r'<script[^>]*id="quiz-data"[^>]*>(.*?)</script>',text,re.S)[1])

def review(n,sources,count):
    pools={i:copy.deepcopy(load_bank(i)) for i in sources}
    for i,bank in pools.items():
        random.Random(n*100+i).shuffle(bank)
    result=[];seen=set()
    while len(result)<count:
        added=0
        for origin,pool in pools.items():
            while pool:
                q=pool.pop()
                options=lambda values:[BeautifulSoup(v,'html.parser').get_text().replace(' ','').replace('*','') for v in values]
                if q['q'] in seen or len(set(options(q['opts'])))<4 or len(set(options(q['optsJa'])))<4:continue
                # Known legacy stack item has a wrong stored answer; do not propagate it.
                if origin==11 and q['q']==load_bank(11)[5]['q']:continue
                if not q.get('why') and not q.get('details'):continue
                seen.add(q['q']);q['d']='review'
                q['ref']=f'Ôn từ bài {origin} / 出典レッスン{origin}: '+q.get('ref','')
                result.append(q);added+=1;break
            if len(result)==count:break
        assert added,'Not enough distinct review questions'
    return result

def validate(n,bank,count):
    assert len(bank)==count and len({q['q'] for q in bank})==count,n
    for q in bank:
        assert len(q['opts'])==len(q['optsJa'])==4,(n,q['q'])
        assert len(set(q['opts']))==len(set(q['optsJa']))==4,(n,q['q'],q['opts'])
        assert isinstance(q['ans'],int) and 0<=q['ans']<4
        assert q['qJa'] and (q.get('whyJa') or q.get('detailsJa'))

original_src_box=base.src_box

def run():
    base.DATA.update(DATA);base.SOURCES.update(SOURCES);base.VI_TITLES.update(TITLES);base.GROUPS.update(GROUPS)
    base.src_box=source_box
    for n,text in DATA.items():
        rows=[tuple(line.split('~')) for line in text.strip().splitlines()]
        assert len(rows)==20 and all(len(r)==5 for r in rows),n
        bank=questions(n,rows)
        for offset,q in enumerate(applied(n)):bank[20+offset]=q
        theory_bank=copy.deepcopy(bank)
        bank=bilingual(bank)
        if n==61:
            for offset,origin in enumerate([47,48,49,50,52,53,54,55,57,58]):
                q=copy.deepcopy(load_bank(origin)[0]);q['d']='review';q['ref']=f'Ôn GĐ3 / 第3段階の復習: bài {origin} · '+q.get('ref','')
                bank[30+offset]=q
        validate(n,bank,40)
        theory=base.make_theory(n,rows,theory_bank)
        theory=theory.replace('../kiem-tra/22.html',f'../kiem-tra/{n}.html')
        (ROOT/f'ly-thuyet/{n}.html').write_text(theory,encoding='utf-8')
        (ROOT/f'kiem-tra/{n}.html').write_text(base.make_test(n,bank),encoding='utf-8')
        base.LESSONS[n].update(theory=f'ly-thuyet/{n}.html',test=f'kiem-tra/{n}.html')
    for n,(sources,count) in REVIEW.items():
        bank=review(n,sources,count);validate(n,bank,count)
        base.SOURCES[n]=['Phạm vi ôn / 復習範囲: '+', '.join(str(i) for i in sources),
          'Câu luyện chọn từ các bài trên; lời giải ghi bài nguồn. Không phải bản chép đề thi chính thức / 各レッスンから選んだ復習問題で、公式過去問の転載ではありません。']
        base.SOURCES[n]+=list(dict.fromkeys(source for origin in sources for source in base.SOURCES.get(origin,[]) if source.startswith(('ichibanyashashi','FE_JP','FE_VN'))))
        (ROOT/f'kiem-tra/{n}.html').write_text(base.make_test(n,bank),encoding='utf-8')
        base.LESSONS[n].update(theory=None,test=f'kiem-tra/{n}.html')
    (ROOT/'lessons.json').write_text(json.dumps(base.CATALOG,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'Created {len(DATA)} theory pages and {len(DATA)+len(REVIEW)} tests. Entry 46 pending choice.')

if __name__=='__main__':run()
