"""Reviewed bilingual notes: term ~ explanation VI/JA ~ application VI/JA."""
DATA = {}
DATA[14] = '''
クラス~Khuôn mô tả thuộc tính và phương thức chung của các đối tượng.~オブジェクトに共通する属性と操作を定義する型。~Mô tả chung tên và cách tính lương cho nhân viên.~社員の氏名と給与計算の共通定義を作る。
インスタンス~Đối tượng cụ thể được tạo từ lớp.~クラスから生成した具体的な実体。~Từ lớp Employee tạo nhân viên có mã E01.~Employeeから社員E01を生成する。
属性~Dữ liệu biểu diễn trạng thái của đối tượng.~オブジェクトの状態を表すデータ。~Số dư hiện tại của tài khoản.~口座が現在保持する残高。
メソッド~Thao tác được định nghĩa cho đối tượng.~オブジェクトに対して定義された操作。~Thao tác rút tiền kiểm tra rồi cập nhật số dư.~残高を確認し更新する出金操作。
カプセル化~Gói dữ liệu và thao tác, che chi tiết bên trong sau giao diện.~データと操作をまとめ、内部をインタフェースで隠す。~Chỉ cho đổi số dư qua phương thức, không ghi trực tiếp.~残高は直接書き換えず操作を通して変更する。
継承~Lớp con tiếp nhận đặc trưng của lớp cha và mở rộng.~上位クラスの性質を下位クラスへ引き継ぎ拡張する。~SavingsAccount dùng đặc trưng chung của Account.~SavingsAccountがAccountの性質を引き継ぐ。
汎化~Rút đặc trưng chung của nhiều lớp thành lớp tổng quát.~複数のクラスの共通性を上位クラスにまとめる。~Gộp điểm chung của Cat và Dog vào Animal.~CatとDogの共通性をAnimalへまとめる。
特化~Tạo lớp cụ thể hơn từ khái niệm tổng quát.~一般的なクラスから具体的な下位クラスを作る。~Từ Vehicle xác định riêng lớp Bus.~VehicleからBusという具体的な種類を定義する。
ポリモーフィズム~Cùng lời gọi nhưng hành vi phụ thuộc đối tượng nhận.~同じ操作の呼出しでも受け手に応じて動作が変わる。~draw gọi trên Circle và Rectangle cho cách vẽ khác nhau.~CircleとRectangleにdrawを呼ぶと各図形を描く。
オーバーライド~Lớp con định nghĩa lại phương thức kế thừa.~継承した操作を下位クラスで再定義する。~Bus thay cách tính fare được định nghĩa ở Vehicle.~BusがVehicleのfare処理を再定義する。
UML~Ngôn ngữ mô hình hóa bằng các loại sơ đồ thống nhất.~システムを統一した図で表すモデリング言語。~Nhóm thống nhất ký pháp để mô tả thiết kế đối tượng.~設計の表現に共通の図式言語を採用する。
クラス図~Sơ đồ cấu trúc tĩnh của lớp và quan hệ giữa lớp.~クラスとその関係を表す静的な構造図。~Biểu diễn Customer liên hệ với Order và các thuộc tính.~CustomerとOrderの関連や属性を表す。
関連~Quan hệ cấu trúc giữa các lớp.~クラス間の構造的なつながり。~Customer đặt Order, hai loại đối tượng có liên hệ.~CustomerとOrderのつながりを示す。
多重度~Số đối tượng có thể tham gia ở một đầu quan hệ.~関連の一端に対応できるインスタンス数。~Một khách có từ không đến nhiều đơn hàng: 0..*.~顧客に対応する注文数を0..*で示す。
集約~Quan hệ tổng thể–bộ phận, biểu diễn một dạng gom nhóm.~全体と部分の関係を表す関連の一種。~Nhóm và các thành viên được mô hình bằng quan hệ chứa.~グループと構成員の全体・部分関係を示す。
コンポジション~Quan hệ tổng thể–bộ phận mạnh, bộ phận thuộc vòng đời tổng thể.~部分が全体と強く結び付き、そのライフサイクルに従う関係。~Phần được mô hình không tồn tại độc lập với tổng thể.~部分を全体から独立して存続させない設計。
ユースケース図~Mô tả tác nhân và chức năng hệ thống cung cấp cho họ.~アクタとシステムが提供する機能を表す図。~Khách hàng có thể tìm sản phẩm và đặt hàng.~顧客が商品検索と注文を行えることを表す。
シーケンス図~Thể hiện thông điệp trao đổi theo thứ tự thời gian.~オブジェクト間のメッセージを時系列で表す図。~Theo dõi UI gọi service rồi service gọi repository.~UI、サービス、保存処理の呼出し順を示す。
アクティビティ図~Thể hiện luồng hoạt động gồm rẽ nhánh và xử lý.~処理や分岐などの活動の流れを表す図。~Mô tả luồng kiểm tra đơn rồi duyệt hoặc từ chối.~注文確認後に承認か却下へ分かれる流れを示す。
ステートマシン図~Mô tả các trạng thái và sự kiện gây chuyển trạng thái.~状態と、事象による状態遷移を表す図。~Đơn chuyển từ chờ sang đã thanh toán khi nhận tiền.~入金の事象で注文が未払いから支払済みへ移る。
'''
DATA[36] = '''
リピータ~Tái tạo tín hiệu ở tầng vật lý để kéo dài đường truyền.~物理層で信号を再生して伝送距離を延ばす装置。~Chỉ phục hồi tín hiệu, không đọc địa chỉ MAC hay IP.~MACやIPを判断せず信号を再生する。
リピータハブ~Phân phối tín hiệu nhận tới các cổng khác ở tầng vật lý.~受信信号を物理層で他のポートへ送る装置。~Thiết bị nhiều cổng không học bảng MAC.~MACアドレスを学習しない多ポートの装置。
ブリッジ~Kết nối các đoạn LAN và lọc theo địa chỉ MAC.~MACアドレスでフレームを選別してLANを接続する装置。~Chỉ chuyển khung sang đoạn mạng cần thiết dựa vào MAC.~宛先MACを基に必要なLANへフレームを渡す。
レイヤー2スイッチ~Chuyển khung tới cổng thích hợp bằng bảng MAC.~MACアドレス表を使って適切なポートへ転送する装置。~Biết MAC đích ở cổng 3 nên chuyển khung tới đó.~宛先MACがポート3にあると学習済みなのでそこへ送る。
ルータ~Chuyển gói giữa mạng dựa vào IP và bảng định tuyến.~IPと経路表に基づき異なるネットワークへ中継する装置。~Nối LAN nội bộ tới một mạng IP khác.~社内LANから別のIPネットワークへ中継する。
レイヤー3スイッチ~Thiết bị chuyển mạch có chức năng định tuyến tầng mạng.~ネットワーク層の経路制御も行うスイッチ。~Định tuyến giữa các mạng con trong hệ thống LAN.~LAN内の異なるサブネット間を経路制御する。
ゲートウェイ~Chuyển đổi giữa các hệ thống có giao thức khác nhau.~異なるプロトコルのシステム間を変換して接続する機能。~Hai hệ thống khác giao thức ứng dụng cần bộ chuyển đổi.~異なるアプリケーションの通信規約を変換する。
アクセスポイント~Điểm kết nối thiết bị không dây với mạng LAN.~無線端末をLANへ接続するための機器。~Máy tính xách tay nối vào mạng qua Wi-Fi.~ノートPCを無線でLANへ接続する。
MACアドレス~Địa chỉ dùng để nhận biết giao diện trên liên kết dữ liệu.~データリンクでインタフェースを識別するアドレス。~Switch tra thông tin đích trong khung Ethernet.~スイッチがEthernetフレームの宛先を調べる。
経路表~Bảng cho biết mạng đích và đường chuyển tiếp tương ứng.~宛先ネットワークと転送先を対応付ける表。~Router tra mạng đích để chọn nơi gửi tiếp gói.~ルータが宛先網に対応する次の転送先を調べる。
DNS~Phân giải tên miền thành địa chỉ IP và thông tin tên liên quan.~ドメイン名に対応するIPなどの情報を調べる仕組み。~Biết tên máy chủ nhưng cần tìm địa chỉ để kết nối.~サーバ名から接続先のIPを求める。
ドメイン名~Tên phân cấp để nhận biết tổ chức hay máy trên Internet.~インターネット上の対象を表す階層的な名前。~Dùng tên dễ nhớ thay cho một chuỗi số IP.~数値のIPの代わりに覚えやすい名前を使う。
DHCP~Tự động cấp địa chỉ IP và các tham số cấu hình mạng.~IPアドレスなどのネットワーク設定を自動配布する規約。~Máy mới vào LAN được nhận IP tự động.~LANへ接続したPCにIPを自動設定する。
DHCPリース~Việc cấp phát địa chỉ có thời hạn sử dụng.~期限を定めてIPアドレスを割り当てる仕組み。~Máy phải gia hạn để tiếp tục dùng địa chỉ được cấp.~割当てアドレスの利用期限を更新する。
NAT~Chuyển đổi địa chỉ IP giữa hai miền địa chỉ.~異なるアドレス空間の間でIPアドレスを変換する技術。~Địa chỉ nội bộ được đổi thành địa chỉ công cộng.~内部用IPを外部向けIPへ変換する。
NAPT~Dùng cả số cổng để nhiều IP riêng dùng chung IP công cộng.~ポート番号も変換し複数の私用IPで公開IPを共有する技術。~Hai máy cùng ra Internet qua một IP nhờ phân biệt cổng.~複数PCがポートを区別して1個の公開IPを共有する。
プライベートIPアドレス~Địa chỉ dành cho mạng riêng, không định tuyến trực tiếp trên Internet.~内部網向けでインターネットへ直接経路制御しないIP。~192.168.1.10 được dùng bên trong LAN.~192.168.1.10をLAN内で使用する。
グローバルIPアドレス~Địa chỉ được phân bổ để nhận biết trên Internet.~インターネット上で識別できるよう割り当てられるIP。~Cổng ra Internet cần địa chỉ có thể định tuyến công cộng.~外部から到達できる公開用のアドレスを使う。
デフォルトゲートウェイ~Nơi gửi gói khi không có đường đi cụ thể hơn.~宛先へのより具体的な経路がない場合の転送先。~Máy gửi gói ra ngoài subnet qua router mặc định.~端末が外部宛てのパケットを既定のルータへ渡す。
ARP~Tìm địa chỉ MAC ứng với IPv4 trên liên kết cục bộ.~同一リンク上のIPv4に対応するMACを求める規約。~Đã biết IPv4 của router nội bộ nhưng cần MAC để đóng khung.~同一LANのルータへ送るためIPv4からMACを調べる。
'''
DATA[37] = '''
HTTP~Giao thức trao đổi yêu cầu và phản hồi tài nguyên Web.~Web資源を要求と応答でやり取りする通信規約。~Trình duyệt yêu cầu một trang từ máy chủ Web.~ブラウザがWebサーバへページを要求する。
HTTPS~Truyền HTTP qua kênh được TLS bảo vệ.~TLSで保護した通信路でHTTPを利用する方式。~Cần bảo vệ nội dung truyền giữa trình duyệt và máy chủ.~ブラウザとサーバ間の通信内容を保護する。
URL~Chuỗi chỉ cách truy cập và vị trí của tài nguyên.~資源の場所とアクセス方法を表す文字列。~Chỉ rõ scheme, tên máy và đường dẫn tài liệu.~スキーム、ホスト、文書のパスを指定する。
GET~Phương thức HTTP yêu cầu lấy biểu diễn tài nguyên.~資源の表現を取得するHTTPメソッド。~Yêu cầu hiển thị nội dung trang sản phẩm.~商品ページの内容を取得する要求。
POST~Phương thức gửi dữ liệu để tài nguyên xử lý.~資源にデータを送信して処理を依頼するメソッド。~Gửi dữ liệu biểu mẫu đặt hàng tới máy chủ.~注文フォームのデータをサーバへ送る。
Cookie~Dữ liệu máy chủ yêu cầu trình duyệt lưu và gửi lại khi phù hợp.~サーバがブラウザに保存させ、条件に応じて再送させる情報。~Trình duyệt gửi mã phiên để máy chủ nhận ra phiên trước.~ブラウザがセッション識別子を再送する。
プロキシサーバ~Máy chủ thay mặt máy khách truy cập dịch vụ khác.~利用者の代わりに外部サーバへアクセスする中継サーバ。~Các máy nội bộ truy cập Web thông qua máy trung gian.~社内PCのWebアクセスを代理サーバ経由にする。
キャッシュ~Lưu bản sao dữ liệu để có thể dùng lại nhanh hơn.~再利用を速くするためにデータの複製を保存する仕組み。~Dùng lại bản tài nguyên đã lưu khi còn hợp lệ.~有効な保存済み資源を再利用する。
SMTP~Giao thức chuyển thư giữa bên gửi và máy chủ thư.~電子メールの送信・転送に使う通信規約。~Máy chủ thư chuyển email tới máy chủ bên nhận.~メールサーバから相手のメールサーバへ転送する。
POP3~Giao thức lấy thư từ hộp thư trên máy chủ về máy khách.~メールサーバから受信メールを取り出す通信規約。~Ứng dụng tải email từ hộp thư về máy cá nhân.~クライアントがサーバのメールを取り出す。
IMAP~Truy cập và quản lý thư giữ trên máy chủ.~サーバ上のメールを参照・管理する通信規約。~Nhiều thiết bị cùng làm việc với hộp thư trên máy chủ.~複数端末がサーバ上の同じメールボックスを利用する。
MIME~Mở rộng định dạng email cho nhiều kiểu dữ liệu và bảng mã.~メールで多様な文字やデータ形式を扱うための拡張規格。~Đính kèm ảnh và dùng ký tự tiếng Nhật trong thư.~日本語や画像添付をメールで扱う。
S/MIME~Mở rộng MIME hỗ trợ mã hóa và chữ ký điện tử.~メールの暗号化とディジタル署名を実現する規格。~Cần thư có thể kiểm tra người gửi và được mã hóa.~メールを暗号化し送信者と改ざんを確認する。
To~Trường ghi người nhận chính của thư.~メールの主な宛先を記載する欄。~Gửi yêu cầu trực tiếp tới người phải xử lý.~対応を依頼する主な相手を指定する。
Cc~Gửi bản sao cho người được thông báo, địa chỉ hiển thị với người nhận.~他の受信者にも見える形で写しを送る宛先欄。~Người phụ trách và quản lý cùng thấy ai được nhận bản sao.~写しの宛先を他の受信者にも知らせる。
Bcc~Gửi bản sao mà địa chỉ đó không hiện với các người nhận khác.~その宛先を他の受信者へ表示せずに写しを送る欄。~Thông báo nhiều người nhưng không công khai danh sách Bcc.~Bccの宛先一覧を他の受信者へ公開しない。
FTP~Giao thức truyền tệp giữa máy khách và máy chủ.~クライアントとサーバの間でファイルを転送する規約。~Chuyển một tệp tới máy chủ bằng giao thức chuyên dụng.~専用の通信規約でサーバへファイルを転送する。
NTP~Đồng bộ thời gian giữa các thiết bị qua mạng.~ネットワーク経由で機器の時刻を同期する規約。~Các máy cần mốc giờ nhất quán cho nhật ký.~ログの時刻を合わせるため各機器を同期する。
ポート番号~Số nhận biết dịch vụ hoặc đầu cuối truyền thông trên máy.~ホスト上のサービスや通信の端点を識別する番号。~Cùng IP nhưng cần phân biệt dịch vụ Web và thư.~同一IP上のWebとメールを区別する。
名前解決~Tra thông tin địa chỉ tương ứng với tên máy chủ.~ホスト名に対応するアドレス情報を取得する処理。~Trước kết nối Web, tra DNS cho tên trong URL.~Web接続前にURLのホスト名をDNSで調べる。
'''
DATA[39] = '''
機密性~Chỉ người có quyền được tiếp cận thông tin.~許可された者だけが情報を利用できる性質。~Ngăn người ngoài đọc bảng lương.~権限のない人に給与表を読ませない。
完全性~Giữ dữ liệu chính xác, đầy đủ và tránh thay đổi trái phép.~情報の正確さと完全さを保ち、不正な変更を防ぐ性質。~Phát hiện số tiền hóa đơn bị sửa trái phép.~請求額の不正な書換えを検出する。
可用性~Người có quyền sử dụng được thông tin khi cần.~許可された利用者が必要なときに利用できる性質。~Dịch vụ vẫn phục vụ khi một máy hỏng.~一台が故障してもサービスを利用できる。
情報資産~Thông tin và tài nguyên liên quan có giá trị cần bảo vệ.~保護すべき価値を持つ情報や関連する資源。~Danh sách khách hàng là đối tượng phải bảo vệ.~顧客名簿を守る対象として特定する。
脅威~Nguyên nhân tiềm ẩn gây thiệt hại cho tài sản.~資産に損害を与える可能性のある原因。~Cháy, trộm cắp hoặc tấn công có thể gây mất dữ liệu.~火災や攻撃が情報の損失を引き起こし得る。
脆弱性~Điểm yếu có thể bị mối đe dọa khai thác.~脅威によって利用され得る弱点。~Máy chủ chưa sửa lỗi bảo mật đã biết.~既知の欠陥を修正していないサーバ。
リスク~Khả năng và ảnh hưởng của sự kiện bất lợi đối với mục tiêu.~望ましくない事象が目標に及ぼす可能性と影響。~Đánh giá cả xác suất lộ dữ liệu và mức thiệt hại.~漏えいの発生可能性と損失を併せて評価する。
リスクアセスメント~Nhận diện, phân tích và đánh giá rủi ro.~リスクを特定・分析・評価する活動。~Liệt kê nguy cơ rồi xếp mức cần ưu tiên xử lý.~危険を洗い出し対応の優先順位を評価する。
リスク回避~Bỏ hoạt động làm phát sinh rủi ro được xét.~リスクを生む活動自体を行わない対応。~Dừng một dịch vụ không thể bảo vệ ở mức chấp nhận được.~許容できない危険のあるサービスを中止する。
リスク低減~Giảm xác suất hoặc mức ảnh hưởng bằng biện pháp kiểm soát.~対策によって発生可能性や影響を小さくする対応。~Vá lỗi và tăng kiểm soát truy cập.~修正パッチとアクセス制御を導入する。
リスク移転~Chuyển hoặc chia sẻ hậu quả tài chính theo thỏa thuận.~契約などでリスクの負担を他者と分担する対応。~Mua bảo hiểm cho một phần tổn thất có thể xảy ra.~保険によって損失の一部を他者に負担させる。
リスク保有~Chấp nhận giữ lại rủi ro sau khi đánh giá.~評価したうえでリスクを引き受ける対応。~Chấp thuận rủi ro nhỏ còn lại và theo dõi.~小さな残留リスクを了承して監視する。
残留リスク~Rủi ro còn lại sau khi áp dụng biện pháp.~対策を講じた後にも残るリスク。~Đã có kiểm soát nhưng không thể loại hết khả năng sự cố.~対策済みでも事故の可能性が一部残る。
ISMS~Hệ thống quản lý an toàn thông tin theo tổ chức và cải tiến liên tục.~組織的かつ継続的に情報セキュリティを管理する仕組み。~Chính sách, trách nhiệm, đánh giá và cải tiến cùng vận hành.~方針、役割、評価、改善を組織として運用する。
PDCA~Lập kế hoạch, thực hiện, kiểm tra rồi cải tiến.~計画・実施・点検・改善を繰り返す管理の流れ。~Sau đánh giá hiệu quả kiểm soát, sửa kế hoạch bảo vệ.~対策の効果を点検し計画を改善する。
セキュリティポリシ~Chính sách và quy tắc bảo vệ thông tin của tổ chức.~組織の情報保護に関する方針と規則。~Quy định trách nhiệm và cách sử dụng thông tin công ty.~会社情報の扱い方と責任を定める。
BCP~Kế hoạch duy trì hoặc khôi phục nghiệp vụ quan trọng khi gián đoạn.~中断時に重要な事業を継続・復旧する計画。~Xác định cách tiếp tục dịch vụ cốt lõi khi có thiên tai.~災害時にも重要事業を続ける手順を定める。
BCM~Quản lý liên tục các hoạt động duy trì kinh doanh, gồm lập và luyện BCP.~BCPの策定・訓練など事業継続を継続的に管理する活動。~Cập nhật kế hoạch và diễn tập phục hồi định kỳ.~事業継続計画を定期的に見直して訓練する。
人的脅威~Đe dọa do hành vi con người, cố ý hoặc sai sót.~故意や過失など人の行動による脅威。~Nhân viên gửi nhầm danh sách khách hàng.~社員が顧客名簿を誤送信する。
物理的脅威~Đe dọa do môi trường, thiên tai hoặc tác động vật lý.~災害や設備など物理的な原因による脅威。~Ngập nước làm hỏng phòng máy.~浸水によってサーバ室の設備が故障する。
'''
DATA[40] = '''
マルウェア~Phần mềm được tạo để thực hiện hành vi có hại.~有害な動作を行うよう作られたソフトウェア。~Chương trình bí mật phá dữ liệu hoặc đánh cắp thông tin.~データ破壊や情報窃取を行うプログラム。
ワーム~Mã độc tự sao chép và lan qua mạng.~ネットワーク経由で自己増殖する不正プログラム。~Tự lây sang máy khác mà không cần gắn vào tệp chủ.~宿主ファイルに寄生せず他の端末へ増殖する。
トロイの木馬~Mã độc giả dạng phần mềm hữu ích để người dùng chạy.~有用なプログラムに見せかけて実行させる不正ソフト。~Ứng dụng giả công cụ tiện ích nhưng bí mật lấy dữ liệu.~便利なツールを装って情報を盗む。
ランサムウェア~Mã độc khóa hoặc mã hóa dữ liệu để đòi tiền chuộc.~データを暗号化するなどして身代金を要求する不正ソフト。~Tệp không mở được và xuất hiện yêu cầu trả tiền.~ファイルを暗号化され金銭を要求される。
スパイウェア~Phần mềm bí mật thu thập thông tin người dùng.~利用者に気付かれずに情報を収集するソフト。~Lén ghi thông tin cá nhân và gửi ra ngoài.~個人情報を密かに収集して外部へ送る。
フィッシング~Giả mạo bên tin cậy để lừa cung cấp thông tin nhạy cảm.~信頼できる相手を装い秘密情報を入力させる詐欺。~Email dẫn tới trang ngân hàng giả để lấy mật khẩu.~銀行を装う偽サイトへ誘導しパスワードを盗む。
ソーシャルエンジニアリング~Lợi dụng tâm lý hay sơ hở con người để lấy thông tin.~人の心理や行動の隙を利用して情報を得る手法。~Giả nhân viên hỗ trợ và gọi hỏi mật khẩu.~担当者を装って電話でパスワードを聞き出す。
ショルダーハッキング~Nhìn trộm thao tác nhập hoặc nội dung màn hình.~肩越しなどから入力や画面を盗み見る手法。~Đứng sau người dùng để xem họ gõ mã PIN.~利用者の背後からPIN入力を盗み見る。
ブルートフォース攻撃~Thử lần lượt mọi ứng viên trong không gian tìm kiếm.~候補となる組合せを総当たりで試す攻撃。~Thử mọi mật khẩu bốn chữ số cho một tài khoản.~1個のIDに4桁の全パスワードを試す。
辞書攻撃~Thử mật khẩu từ danh sách từ hoặc chuỗi có khả năng cao.~辞書にある語などを候補として試す攻撃。~Dùng danh sách từ thông dụng thay vì mọi chuỗi.~よくある単語の一覧を使って試行する。
パスワードリスト攻撃~Dùng cặp ID–mật khẩu rò rỉ để thử dịch vụ khác.~漏えいしたIDとパスワードの組を別サービスで試す攻撃。~Mật khẩu dùng lại ở hai website bị khai thác.~他サイトの漏えい情報で使い回しの認証を狙う。
リバースブルートフォース~Cố định một mật khẩu và thử nhiều ID.~パスワードを固定して多数のIDで試す攻撃。~Thử cùng mật khẩu phổ biến trên nhiều tài khoản.~同じありがちなパスワードを多くのIDに試す。
DoS~Làm dịch vụ khó hoặc không thể sử dụng bằng gây quá tải hay lỗi.~過負荷などでサービスの利用を妨げる攻撃。~Một nguồn gửi lượng lớn yêu cầu để làm tê liệt máy chủ.~1か所から大量要求を送りサーバを停止させる。
DDoS~Tấn công từ nhiều nguồn phân tán để làm gián đoạn dịch vụ.~多数の分散した発信元からサービスを妨害する攻撃。~Nhiều máy bị điều khiển cùng gửi tải tới một dịch vụ.~多数の端末が一斉に同じサービスへ負荷をかける。
SQLインジェクション~Đầu vào độc hại làm thay đổi ý nghĩa lệnh SQL của ứng dụng.~入力を利用してSQLの意味を不正に変える攻撃。~Chuỗi nhập làm điều kiện truy vấn bị biến đổi.~入力値によって本来の検索条件が改変される。
クロスサイトスクリプティング~Chèn nội dung script để chạy trong trình duyệt người xem.~不正なスクリプトを閲覧者のブラウザで実行させる攻撃。~Bình luận không được xử lý chứa script chạy khi người khác xem.~投稿内容のスクリプトが他の閲覧者に実行される。
DNSキャッシュポイズニング~Đưa thông tin DNS giả vào bộ nhớ đệm để chuyển hướng.~DNSキャッシュへ偽の情報を入れて誘導する攻撃。~Tên đúng nhưng kết quả DNS trỏ tới máy chủ giả.~正しい名前の検索結果が偽サーバのIPになる。
ドライブバイダウンロード~Làm máy tải hoặc nhiễm mã độc khi truy cập trang bị gài bẫy.~細工したサイトの閲覧を通して不正ソフトを取り込ませる攻撃。~Chỉ xem trang cũng bị lợi dụng lỗ hổng để nhiễm mã độc.~ページ閲覧時に脆弱性を悪用され感染する。
標的型攻撃~Tấn công được chuẩn bị nhắm vào tổ chức hoặc người cụ thể.~特定の組織や人物を狙って準備する攻撃。~Thư giả nội dung công việc gửi riêng cho một phòng ban.~特定部署の業務に合わせた偽メールを送る。
バックドア~Cửa truy cập bí mật bỏ qua đường xác thực thông thường.~通常の認証経路を迂回して侵入するための裏口。~Kẻ tấn công để lại cách quay lại sau khi đã xâm nhập.~侵入後に再び入るための秘密の入口を残す。
'''
DATA[41] = '''
平文~Thông tin ban đầu chưa được mã hóa.~暗号化する前の元の情報。~Thông điệp còn đọc được trước bước bảo vệ bằng mật mã.~暗号化前に読めるメッセージ。
暗号文~Dữ liệu thu được sau khi mã hóa bằng thuật toán và khóa.~暗号化によって得られたデータ。~Bản thông điệp đã biến đổi cần khóa để giải mã.~復号するために鍵が必要な変換済みの情報。
暗号化~Biến thông tin thành dạng được bảo vệ bằng mật mã.~情報を暗号によって保護された形に変換する処理。~Đổi thông điệp đọc được thành dữ liệu mật.~読めるメッセージを暗号文へ変える。
復号~Khôi phục bản rõ từ bản mã bằng khóa thích hợp.~適切な鍵で暗号文を平文へ戻す処理。~Người nhận có khóa lấy lại nội dung ban đầu.~受信者が鍵を使って元の内容を得る。
共通鍵暗号~Mã hóa và giải mã dùng cùng khóa bí mật.~暗号化と復号に同じ秘密の鍵を使う方式。~Hai bên giữ chung một khóa để trao đổi dữ liệu lớn.~同じ鍵を共有して大量のデータを保護する。
公開鍵暗号~Dùng cặp khóa công khai và bí mật tương ứng.~対応する公開鍵と秘密鍵の対を使う方式。~Công bố một khóa nhưng vẫn giữ kín khóa còn lại.~一方の鍵を公開し、対の鍵は秘密にする。
受信者の公開鍵~Khóa dùng mã hóa nội dung bí mật gửi cho người nhận đó.~その受信者に秘密の情報を送る際の暗号化に使う鍵。~A muốn chỉ B đọc được nên dùng khóa công khai của B.~AがBだけに読ませるためBの公開鍵を使う。
受信者の秘密鍵~Khóa giải mã nội dung được mã bằng khóa công khai của người nhận.~受信者の公開鍵で暗号化した内容を復号する鍵。~B mở thông điệp bí mật được gửi bằng khóa công khai của B.~Bが自分宛ての暗号文を秘密鍵で復号する。
AES~Thuật toán mật mã khóa chung.~共通鍵暗号のアルゴリズム。~Chọn thuật toán để hai phía dùng cùng khóa xử lý dữ liệu.~同じ鍵でデータを暗号化・復号する方式を選ぶ。
RSA~Thuật toán thuộc nhóm mật mã khóa công khai.~公開鍵暗号のアルゴリズム。~Dùng cặp khóa công khai và bí mật thay vì khóa chung.~公開鍵と秘密鍵の組を使うアルゴリズムを選ぶ。
ハイブリッド暗号~Kết hợp khóa công khai để bảo vệ trao đổi khóa và khóa chung cho dữ liệu.~公開鍵方式で鍵を保護し共通鍵方式で本文を処理する構成。~Dữ liệu lớn dùng khóa chung, khóa chung được bảo vệ riêng.~大きな本文は共通鍵、その鍵は公開鍵方式で保護する。
ハッシュ関数~Ánh xạ dữ liệu thành giá trị băm có độ dài xác định theo thuật toán.~データからアルゴリズムごとの一定長の値を計算する関数。~Tạo dấu kiểm tra từ toàn bộ nội dung tệp.~ファイル全体から確認用の値を計算する。
ダイジェスト~Giá trị đầu ra của hàm băm.~ハッシュ関数によって得られる値。~So hai giá trị băm để hỗ trợ phát hiện thay đổi.~改変確認に使うハッシュ関数の出力を比較する。
原像計算困難性~Khó tìm đầu vào tương ứng từ một giá trị băm đã cho.~与えられたハッシュ値から対応する入力を求めるのが困難な性質。~Biết giá trị băm không dễ suy ngược thông điệp.~ハッシュ値だけから元の入力を求めにくい。
衝突~Hai đầu vào khác nhau cho cùng một giá trị băm.~異なる入力から同じハッシュ値が得られること。~Hai tệp khác nhau nhưng giá trị băm trùng nhau.~内容の異なるファイルのハッシュ値が一致する。
ディジタル署名~Dùng khóa ký để tạo chữ ký, hỗ trợ kiểm tra nguồn gốc và sửa đổi.~署名鍵で署名を作り、作成者と改ざんを検証する技術。~Người nhận cần kiểm tra ai ký và nội dung có bị đổi không.~誰が署名し内容が変わっていないかを確かめる。
署名者の秘密鍵~Khóa người ký phải giữ kín để tạo chữ ký.~署名を生成するため署名者が秘密に保持する鍵。~A tạo chữ ký của mình bằng khóa chỉ A giữ.~Aが自分だけの秘密鍵で署名を作る。
署名者の公開鍵~Khóa dùng để xác minh chữ ký của người ký tương ứng.~対応する署名者の署名を検証するための鍵。~B kiểm tra chữ ký A bằng khóa công khai A.~BがAの公開鍵でAの署名を検証する。
ディジタル証明書~Chứng nhận liên hệ giữa danh tính và khóa công khai.~主体と公開鍵の対応を証明する電子的な証明書。~Cần xác nhận khóa công khai thật sự thuộc máy chủ nào.~公開鍵がどのサーバに属するかを確認する。
認証局（CA）~Tổ chức cấp và ký chứng thư trong hạ tầng khóa công khai.~公開鍵基盤で証明書を発行・署名する機関。~Bên tin cậy xác nhận quan hệ danh tính–khóa.~信頼する機関が主体と鍵の対応を証明する。
'''
DATA[42] = '''
ファイアウォール~Kiểm soát truyền thông qua ranh giới mạng theo chính sách.~ネットワーク境界の通信を規則に基づいて制御する仕組み。~Chỉ cho những luồng được cho phép đi vào mạng.~許可した通信だけをネットワークへ通す。
パケットフィルタリング~Lọc bằng thông tin như IP, cổng và giao thức.~IP、ポート、プロトコルなどでパケットを選別する方式。~Chặn kết nối tới một cổng không cần dùng.~不要な宛先ポートへの通信を拒否する。
WAF~Lọc các yêu cầu Web nhằm bảo vệ ứng dụng Web.~Web要求を検査してWebアプリを保護する仕組み。~Cần kiểm tra yêu cầu HTTP có dấu hiệu tấn công ứng dụng.~HTTP要求中の不正なアプリ攻撃を検査する。
IDS~Phát hiện dấu hiệu xâm nhập và đưa ra cảnh báo.~侵入の兆候を検知して通知する仕組み。~Hệ thống giám sát báo quản trị viên khi thấy tấn công.~不正な通信を検知して管理者へ警告する。
IPS~Phát hiện và chủ động ngăn chặn lưu lượng xâm nhập.~侵入を検知し通信を遮断する仕組み。~Cần tự chặn luồng tấn công khi phát hiện.~攻撃を見つけたらその通信を遮断する。
DMZ~Phân vùng mạng cho dịch vụ công cộng, tách khỏi mạng nội bộ.~公開サーバなどを内部網から分離して置くネットワーク領域。~Đặt Web công cộng ở vùng riêng, không đặt chung DB nội bộ.~公開Webを社内DBとは別の領域に置く。
VPN~Tạo kết nối riêng trên hạ tầng mạng dùng chung.~共用の通信基盤上に仮想的な専用接続を作る技術。~Nhân viên từ xa cần đường kết nối được bảo vệ tới công ty.~外出先から会社へ保護された接続を作る。
TLS~Bảo vệ kênh truyền bằng xác thực, mã hóa và kiểm tra toàn vẹn.~認証、暗号化、完全性確認によって通信路を保護する規約。~Cần bảo vệ dữ liệu Web trên đường truyền.~Webの通信路上のデータを保護する。
認証~Xác minh chủ thể khai báo danh tính là ai.~主体が名乗る本人であることを確認する処理。~Kiểm tra người đăng nhập đúng là chủ tài khoản.~ログイン者がアカウントの本人かを確かめる。
認可~Quyết định chủ thể đã được xác định được phép làm gì.~識別した主体にどの操作を許すか決めること。~Đã đăng nhập nhưng chỉ quản lý mới được duyệt chi.~ログイン後も承認操作は管理者だけに許す。
最小権限~Chỉ cấp quyền tối thiểu cần cho nhiệm vụ.~業務に必要な最小限の権限だけを与える原則。~Nhân viên chỉ đọc báo cáo không được cấp quyền xóa.~閲覧担当には削除権限を与えない。
多要素認証~Kết hợp ít nhất hai loại yếu tố xác thực khác nhau.~異なる種類の認証要素を二つ以上組み合わせる方式。~Dùng mật khẩu và thiết bị sở hữu để xác thực.~パスワードと所持する端末で認証する。
生体認証~Dùng đặc trưng sinh học hoặc hành vi của người.~身体や行動の特徴を使って本人を確認する方式。~Xác thực bằng vân tay.~指紋によって本人を確認する。
ワンタイムパスワード~Mật khẩu dùng một lần hoặc chỉ hợp lệ trong thời gian ngắn.~一度限り又は短時間だけ有効なパスワード。~Mã xác thực thay đổi, không dùng lại mã trước.~認証コードが更新され以前のものを再利用できない。
パッチ管理~Theo dõi và áp dụng bản sửa lỗi có kiểm soát.~修正プログラムを把握し計画的に適用する活動。~Lập danh sách lỗ hổng và triển khai bản vá sau kiểm tra.~脆弱性を把握し確認した修正を適用する。
マルウェア対策~Phát hiện, ngăn chặn và xử lý phần mềm có hại.~不正プログラムを検知・防止・処理する対策。~Cập nhật nhận diện và quét tệp có nguy cơ.~検知情報を更新し危険なファイルを検査する。
検疫ネットワーク~Kiểm tra tình trạng an toàn trước khi cho thiết bị vào mạng chính.~端末の安全性を確認してから本来の網へ接続する仕組み。~Máy chưa đạt điều kiện được cách ly để cập nhật.~条件を満たさない端末を隔離して更新させる。
ログ監視~Thu thập và xem nhật ký để phát hiện sự kiện bất thường.~ログを収集・確認して異常を見つける活動。~Phát hiện nhiều lần đăng nhập thất bại liên tiếp.~ログから連続した認証失敗を見つける。
MDM~Quản lý tập trung cấu hình và bảo vệ thiết bị di động.~モバイル端末の設定や安全性を集中管理する仕組み。~Công ty quản lý chính sách trên điện thoại cấp cho nhân viên.~会社配布のスマートフォンに共通の設定を適用する。
リモートワイプ~Xóa dữ liệu trên thiết bị từ xa.~遠隔操作で端末のデータを消去する機能。~Điện thoại công ty bị mất cần xóa dữ liệu từ xa.~紛失した会社端末の情報を遠隔で消去する。
'''
DATA[47] = '''
ソフトウェアライフサイクル~Các hoạt động từ nhu cầu, phát triển tới vận hành và bảo trì phần mềm.~要求から開発、運用、保守に至るソフトウェアの活動全体。~Xem xét cả tạo mới, đưa vào dùng và sửa sau bàn giao.~新規開発だけでなく運用と引渡し後の修正も考える。
共通フレーム~Khung chung quy định công việc và vai trò trong vòng đời hệ thống.~システムのライフサイクルで作業や役割を共通化する枠組み。~Khách hàng và nhà cung cấp thống nhất các hoạt động phải làm.~発注者と供給者が実施する作業を共通に理解する。
企画~Làm rõ nhu cầu kinh doanh và định hướng hệ thống hóa.~経営上のニーズを確認しシステム化の方針を定める活動。~Xác định vì sao cần hệ thống và lợi ích dự kiến.~システム化の目的と期待する効果を整理する。
システム要件定義~Xác định chức năng, chất lượng và ràng buộc hệ thống phải đáp ứng.~システムに必要な機能、品質、制約を明らかにする工程。~Thống nhất phải xử lý nghiệp vụ nào với mức dịch vụ nào.~必要な業務とサービス水準を合意する。
機能要件~Yêu cầu về những việc hệ thống phải thực hiện.~システムが行う処理や機能に関する要求。~Hệ thống phải cho phép hủy đơn chưa giao.~未発送の注文を取り消せる機能を求める。
非機能要件~Yêu cầu về chất lượng như hiệu năng, độ tin cậy và khả năng vận hành.~性能、信頼性、運用性など機能以外の要求。~Màn hình phải trả kết quả trong thời gian đã thống nhất.~画面の応答時間について基準を決める。
システム方式設計~Phân bổ chức năng và xác định cấu trúc tổng thể phần cứng, phần mềm.~ハードウェアとソフトウェアへの割当てや全体構成を決める工程。~Quyết định hệ thống gồm những máy và phần mềm nào.~どの機器とソフトでシステムを構成するか決める。
ソフトウェア要件定義~Cụ thể hóa yêu cầu phần mềm từ yêu cầu hệ thống.~システム要件からソフトウェアに必要な要求を具体化する工程。~Làm rõ đầu vào, đầu ra và hành vi của phần mềm.~ソフトの入力、出力、振舞いを明確にする。
ソフトウェア方式設計~Chia phần mềm thành thành phần và xác định giao diện giữa chúng.~ソフトを構成要素へ分け相互のインタフェースを定める工程。~Chia hệ thống đặt hàng thành các thành phần và cách kết nối.~注文ソフトの構成要素とその接続を決める。
ソフトウェア詳細設計~Thiết kế chi tiết dữ liệu và xử lý để có thể lập trình.~プログラムを作れる粒度でデータや処理を設計する工程。~Xác định thuật toán và dữ liệu bên trong module.~モジュール内部のアルゴリズムとデータを決める。
外部設計~Thiết kế từ góc nhìn người dùng như màn hình và đầu ra.~画面や出力など利用者から見える仕様を設計する活動。~Thiết kế giao diện nhập đơn hàng cho người dùng.~利用者が使う注文入力画面を設計する。
内部設計~Thiết kế cách hiện thực bên trong hệ thống.~システム内部の実現方法を設計する活動。~Xác định cấu trúc chương trình không hiện trực tiếp với người dùng.~利用者に直接見えないプログラム構造を決める。
プログラミング~Chuyển thiết kế thành mã chương trình thực thi được.~設計を実行できるプログラムとして記述する工程。~Viết mã xử lý kiểm tra đơn hàng theo thiết kế.~設計に従って注文検査のコードを作る。
単体テスト~Kiểm tra từng đơn vị chương trình riêng lẻ.~個々のプログラム単位を検証するテスト。~Kiểm tra riêng hàm tính giảm giá.~割引計算の関数だけを検証する。
結合テスト~Kiểm tra sự phối hợp và giao diện giữa các thành phần.~複数の構成要素の接続や連携を検証するテスト。~Kiểm tra module đặt hàng gọi thanh toán đúng hợp đồng.~注文と決済モジュールの連携を確認する。
システムテスト~Kiểm tra hệ thống tích hợp đối chiếu yêu cầu hệ thống.~統合したシステムをシステム要件に照らして検証するテスト。~Đánh giá toàn hệ thống có đạt chức năng và hiệu năng yêu cầu.~全体で要求された機能と性能を満たすか調べる。
受入テスト~Bên nhận đánh giá hệ thống có đạt điều kiện chấp nhận hay không.~受入側が受入条件を満たすか判断するテスト。~Khách hàng xác nhận hệ thống đáp ứng thỏa thuận bàn giao.~利用者側が納入条件を満たすか確認する。
運用テスト~Kiểm tra các thủ tục và điều kiện vận hành thực tế.~実際の運用条件や手順を検証するテスト。~Diễn tập sao lưu, khôi phục và tác nghiệp vận hành.~バックアップ、復旧、日常運用を試す。
保守~Sửa lỗi và thay đổi hệ thống sau khi đưa vào sử dụng.~利用開始後の修正や変更によってシステムを維持する活動。~Sửa lỗi phát hiện sau bàn giao và điều chỉnh theo nhu cầu.~稼働後に見つかった不具合や要求変更へ対応する。
レビュー~Xem xét sản phẩm công việc để phát hiện sai sót sớm.~作業成果物を検討し早期に誤りを見つける活動。~Đọc đặc tả để tìm mâu thuẫn trước khi lập trình.~実装前に仕様書を確認して矛盾を見つける。
'''
DATA[48] = '''
ウォーターフォール~Tiến hành phát triển qua các công đoạn theo trình tự.~工程を順に進める段階的な開発モデル。~Yêu cầu ổn định, hoàn tất thiết kế rồi triển khai theo kế hoạch.~要求が安定しており設計を固めてから実装する。
プロトタイピング~Làm mẫu thử để xác nhận hoặc làm rõ yêu cầu.~試作品を作り要求を確認・具体化する手法。~Người dùng thử màn hình mẫu trước khi chốt đặc tả.~仕様を固める前に画面の試作品を利用者に見せる。
スパイラルモデル~Lặp chu kỳ phát triển kèm đánh giá rủi ro.~リスク評価を伴う開発サイクルを繰り返すモデル。~Mỗi vòng xác định rủi ro rồi phát triển và đánh giá.~各周回でリスクを確認し開発・評価する。
アジャイル開発~Phát triển tăng dần qua vòng ngắn, nhận phản hồi để thích ứng.~短い反復で作り、フィードバックに応じて適応する開発。~Bàn giao phần hoạt động từng đợt và điều chỉnh ưu tiên.~動く部分をこまめに示して優先順位を調整する。
スクラム~Khung làm việc lặp với vai trò, sự kiện và sản phẩm công việc.~役割、イベント、作成物を定めた反復的な枠組み。~Nhóm tổ chức công việc theo sprint và cùng xem lại kết quả.~スプリントで仕事を進め成果を確認する。
スプリント~Khoảng thời gian cố định để tạo phần tăng trưởng của sản phẩm.~決まった期間で製品の増分を作る反復。~Nhóm tập trung hoàn thành mục tiêu trong một đợt ngắn cố định.~一定期間で目標に沿う成果を完成させる。
プロダクトバックログ~Danh sách công việc sản phẩm được sắp thứ tự ưu tiên.~製品に必要な項目を優先順に並べた一覧。~Các nhu cầu được xếp thứ tự để chọn phần làm tiếp.~要求を優先順位順に整理して次の作業を選ぶ。
プロダクトオーナー~Vai trò chịu trách nhiệm tối đa hóa giá trị sản phẩm và quản lý backlog.~製品の価値とバックログの管理に責任を持つ役割。~Người quyết định ưu tiên giá trị cho danh sách yêu cầu.~価値を考えて要求一覧の順序を決める。
スクラムマスター~Hỗ trợ nhóm hiểu và thực hành Scrum, tháo gỡ trở ngại.~スクラムの理解と実践を支援し障害の解消を助ける役割。~Hỗ trợ nhóm cải thiện cách làm việc theo Scrum.~チームがスクラムを効果的に実践できるよう支援する。
デイリースクラム~Buổi ngắn để nhóm kiểm tra tiến triển và điều chỉnh kế hoạch làm việc.~進捗を確認し作業計画を調整する短い日次イベント。~Hằng ngày nhóm chia sẻ vướng mắc và phối hợp công việc.~毎日、障害や作業の進め方をチームで確認する。
スプリントレビュー~Cùng bên liên quan kiểm tra sản phẩm và hướng điều chỉnh.~利害関係者と成果を検査し今後の適応を考えるイベント。~Cho người dùng xem phần vừa hoàn thành để lấy phản hồi.~完成した増分を関係者に示して意見を得る。
レトロスペクティブ~Xem lại cách làm việc để chọn cải tiến cho đợt sau.~働き方を振り返り次の改善を決める活動。~Nhóm bàn cách giảm nghẽn khi phối hợp ở sprint tới.~次のスプリントで協働の問題を減らす方法を話す。
XP~Phương pháp Agile chú trọng các thực hành kỹ thuật và phản hồi nhanh.~技術的な実践と素早いフィードバックを重視する開発手法。~Nhóm áp dụng lập trình cặp và kiểm thử thường xuyên.~ペア作業や頻繁なテストを開発に取り入れる。
ペアプログラミング~Hai người cùng làm việc trên một phần mã, thường xuyên trao đổi.~二人が同じコードに共同で取り組む実践。~Một người viết, người kia xem xét và trao đổi ngay.~一人が入力し、もう一人が確認して意見を出す。
テスト駆動開発~Viết kiểm thử trước rồi viết mã đủ để vượt kiểm thử và cải tiến.~先にテストを書き、通る実装を作り、改善する進め方。~Xác định kiểm thử mong đợi trước khi hiện thực hàm.~関数の実装前に期待する動作のテストを作る。
リファクタリング~Cải thiện cấu trúc bên trong mà giữ nguyên hành vi quan sát được.~外部から見た動作を保ち内部構造を改善する作業。~Tách mã trùng mà không đổi kết quả chương trình.~出力を変えず重複したコードを整理する。
リバースエンジニアリング~Phân tích sản phẩm hiện có để hiểu cấu trúc hoặc đặc tả.~既存製品を解析して構造や仕様を明らかにする作業。~Từ chương trình cũ tìm lại thiết kế đã thất lạc.~古いコードから失われた仕様を調べる。
リエンジニアリング~Phân tích và tái cấu trúc hệ thống hiện có để cải thiện.~既存システムを分析し再構築して改善する活動。~Làm lại cấu trúc hệ thống cũ dựa trên phân tích của nó.~既存システムを理解したうえで再構築する。
構成管理~Nhận biết và kiểm soát phiên bản, thay đổi của các sản phẩm công việc.~成果物の版や変更を識別し統制する活動。~Đảm bảo đúng phiên bản mã, tài liệu và cấu hình được bàn giao.~正しい版のコード、文書、設定を揃える。
マッシュアップ~Tạo dịch vụ bằng kết hợp nhiều dịch vụ hoặc dữ liệu có sẵn.~複数の既存サービスやデータを組み合わせて新しい機能を作る方法。~Ghép bản đồ với dữ liệu cửa hàng để tạo dịch vụ tra cứu.~地図と店舗情報を組み合わせ新サービスを作る。
'''
DATA[49] = '''
業務モデル~Biểu diễn cấu trúc và hoạt động nghiệp vụ để phân tích.~業務の構造や活動を分析のために表したもの。~Mô tả ai tiếp nhận đơn và dữ liệu đi đâu.~誰が受注し情報がどこへ渡るか整理する。
DFD~Sơ đồ thể hiện dữ liệu chuyển qua xử lý, nơi lưu và tác nhân ngoài.~処理、蓄積、外部とのデータの流れを示す図。~Theo dõi dữ liệu đơn hàng từ khách tới xử lý và kho dữ liệu.~注文情報が顧客から処理と保存先へ流れる様子を示す。
プロセス（DFD）~Phần biến đổi dữ liệu đầu vào thành dữ liệu đầu ra.~入力データを処理して出力データへ変換する要素。~Từ số lượng và đơn giá tính ra tiền hàng.~数量と単価から金額を計算する部分。
データフロー~Luồng dữ liệu nối các phần tử trong DFD.~DFDの要素間を移動するデータ。~Mũi tên ghi thông tin yêu cầu thanh toán.~支払要求の情報が移動する矢印。
データストア~Nơi dữ liệu được giữ lại trong mô hình DFD.~DFDでデータを蓄積する場所。~Tập đơn hàng đã lưu để tra cứu về sau.~後から参照する注文情報を蓄える場所。
外部実体~Người hoặc hệ thống ngoài ranh giới trao đổi dữ liệu với hệ thống.~対象の外側でデータを授受する人やシステム。~Khách gửi đơn vào hệ thống đang mô hình hóa.~対象システムへ注文を送る顧客。
コンテキスト図~Sơ đồ cấp cao thể hiện hệ thống như một xử lý và giao tiếp bên ngoài.~システム全体を一つの処理として外部との授受を示す図。~Chốt ranh giới hệ thống trước khi phân rã chi tiết.~詳細化前にシステム境界と外部の関係を示す。
段階的詳細化~Chia xử lý cấp cao thành các xử lý chi tiết hơn.~上位の処理を下位の細かな処理へ分解すること。~Tách xử lý đơn thành kiểm tra, tính tiền và ghi nhận.~受注処理を検査、計算、記録へ分ける。
プロセス中心アプローチ~Thiết kế dựa vào các chức năng và luồng xử lý nghiệp vụ.~業務の機能や処理の流れを中心に設計する方法。~Bắt đầu từ việc nghiệp vụ phải làm rồi phân chia chức năng.~必要な処理を起点に機能を分割する。
データ中心アプローチ~Thiết kế dựa vào cấu trúc dữ liệu tương đối ổn định.~比較的安定したデータの構造を中心に設計する方法。~Bắt đầu từ Customer, Order và quan hệ dữ liệu.~顧客、注文とその関係を起点に設計する。
E-R図~Biểu diễn thực thể, thuộc tính và quan hệ trong dữ liệu.~実体、属性、実体間の関連を表す図。~Thiết kế dữ liệu khách hàng và đơn hàng.~顧客と注文のデータ関係を整理する。
UML~Bộ ký pháp mô hình hóa thống nhất cho hệ thống.~システムを表現する統一されたモデリング言語。~Dùng nhiều loại sơ đồ để mô tả những góc nhìn khác nhau.~異なる観点に応じて共通の図式言語を使う。
ユースケース図~Thể hiện tác nhân và chức năng có giá trị với họ.~アクタと利用するシステム機能を示す図。~Người mua tìm hàng, đặt hàng và theo dõi giao hàng.~購入者の検索、注文、配送確認の機能を示す。
アクタ~Vai trò bên ngoài tương tác với hệ thống trong use case.~ユースケースでシステムとやり取りする外部の役割。~Cổng thanh toán bên ngoài tham gia thao tác thanh toán.~外部の決済システムが操作に参加する。
クラス図~Thể hiện lớp, thuộc tính, thao tác và các quan hệ tĩnh.~クラス、属性、操作、静的な関連を示す図。~Cần mô hình cấu trúc các lớp phần mềm.~ソフトのクラス構造を整理する。
シーケンス図~Thể hiện trao đổi thông điệp giữa đối tượng theo thời gian.~オブジェクト間のメッセージを時間順に示す図。~Xác định lời gọi nào diễn ra trước khi lưu dữ liệu.~保存前にどの呼出しが行われるか示す。
アクティビティ図~Mô tả luồng hoạt động, rẽ nhánh và đồng bộ.~活動の流れ、分岐、同期などを示す図。~Mô tả quy trình duyệt gồm các nhánh quyết định.~判断分岐を含む承認の流れを示す。
ステートマシン図~Mô tả trạng thái của đối tượng và sự kiện chuyển trạng thái.~対象の状態と事象による遷移を示す図。~Theo dõi vòng đời yêu cầu từ mở đến đóng.~依頼が受付状態から完了状態へ移る様子を示す。
オブジェクト指向アプローチ~Kết hợp dữ liệu và thao tác trong các đối tượng để mô hình hóa.~データと操作を持つオブジェクトを中心にモデル化する方法。~Xác định đối tượng cùng trách nhiệm thay vì chỉ luồng chức năng.~処理だけでなく対象とその責務を起点に考える。
データ辞書~Tập định nghĩa thống nhất tên và ý nghĩa các mục dữ liệu.~データ項目の名前や意味を統一して記述したもの。~Các bộ phận cùng hiểu OrderDate là ngày nào.~OrderDateの意味を関係者間で統一する。
'''
DATA[50] = '''
モジュール~Đơn vị phần mềm được chia để có trách nhiệm xác định.~役割を定めて分割したソフトウェアの単位。~Tách phần tính thuế thành đơn vị riêng.~税額計算を独立した単位へ分ける。
モジュール強度~Mức liên quan giữa các chức năng bên trong một module.~一つのモジュール内部の機能のまとまりの強さ。~Các xử lý cùng phục vụ một mục đích nên được gom hợp lý.~同じ目的の処理を一つにまとめる度合いを評価する。
モジュール結合度~Mức phụ thuộc giữa các module, thường nên giữ thấp.~モジュール間の依存の強さで、一般に弱くする。~Đổi một phần không kéo theo sửa nhiều phần khác.~一部の変更が他へ広く波及しないようにする。
データ結合~Các module chỉ trao đổi dữ liệu cần thiết qua tham số.~必要なデータを引数として受け渡す結合。~Hàm tính tiền nhận đơn giá và số lượng riêng.~計算関数へ単価と数量だけを渡す。
スタンプ結合~Truyền cấu trúc dữ liệu gồm cả mục không cần dùng.~必要な一部を含むデータ構造全体を渡す結合。~Chỉ cần mã khách nhưng truyền cả hồ sơ khách hàng.~顧客番号だけ使う処理へ顧客構造体全体を渡す。
制御結合~Truyền thông tin điều khiển quyết định xử lý của module khác.~相手の処理を指示する制御情報を渡す結合。~Truyền cờ để buộc module chọn nhánh hoạt động.~処理内容を指定するフラグを相手へ渡す。
共通結合~Các module phụ thuộc dữ liệu dùng chung.~複数のモジュールが共通のデータを参照する結合。~Nhiều module cùng đọc ghi biến toàn cục.~複数モジュールが同じ大域変数を使う。
内容結合~Module can thiệp trực tiếp vào nội dung bên trong module khác.~別モジュールの内部へ直接依存・干渉する結合。~Sửa trực tiếp vùng dữ liệu nội bộ của module khác.~他モジュールの内部データを直接書き換える。
ブラックボックステスト~Kiểm tra theo đầu vào và đầu ra từ đặc tả, không dựa cấu trúc mã.~内部構造ではなく仕様の入力と出力で検証するテスト。~Chọn bộ dữ liệu từ yêu cầu nghiệp vụ.~要求仕様から入力と期待結果を決める。
ホワイトボックステスト~Thiết kế kiểm thử dựa cấu trúc bên trong chương trình.~プログラム内部の構造に基づいて設計するテスト。~Chọn dữ liệu để chạy các nhánh trong mã.~コードの分岐を通る入力を選ぶ。
同値分割~Chia miền đầu vào thành lớp có hành vi tương đương để chọn đại diện.~同様に扱われる入力の集合に分け代表値を選ぶ方法。~Chọn một giá trị trong mỗi nhóm hợp lệ và không hợp lệ.~有効・無効な入力グループから代表値を選ぶ。
境界値分析~Tập trung kiểm tra các giá trị sát ranh giới miền dữ liệu.~入力範囲の境界付近を重点的に調べる方法。~Khoảng 1–100 cần xét 0,1,100,101.~1〜100の範囲に対し0、1、100、101を確認する。
命令網羅~Thực thi mỗi câu lệnh ít nhất một lần.~すべての命令を少なくとも一度実行する基準。~Tất cả lệnh được chạy dù chưa kiểm tra mọi nhánh.~全命令を実行したが全分岐とは限らない。
分岐網羅~Thực thi mỗi kết quả đúng và sai của từng quyết định.~各判定の真・偽の分岐を少なくとも一度通す基準。~Cần ca kiểm thử cho cả hai đầu ra của if.~ifの真と偽の両方を通す。
条件網羅~Mỗi điều kiện đơn phải nhận cả đúng và sai.~各単一条件が真と偽を取るようにする基準。~A và B đều từng đúng và sai, chưa chắc quyết định đủ nhánh.~AとBが各々真偽を取っても判定全体の網羅とは限らない。
複数条件網羅~Kiểm tra tất cả tổ hợp đúng–sai của các điều kiện đơn.~単一条件の真偽の組合せをすべて確認する基準。~Hai điều kiện độc lập về tổ hợp cần xét TT,TF,FT,FF.~二条件のTT、TF、FT、FFを確認する。
トップダウンテスト~Kết hợp từ module cấp cao xuống cấp thấp.~上位モジュールから下位へ結合して検証する方法。~Phần cấp dưới chưa có được thay tạm trong lúc kiểm tra.~未完成の下位部分を代用品にして上位から試す。
スタブ~Module thay tạm phần cấp dưới được gọi khi kiểm thử.~テスト中に呼び出される下位モジュールの代用品。~Phần thanh toán chưa xong, dùng bộ trả kết quả giả.~未完成の決済処理の代わりに結果を返す。
ドライバ~Chương trình thay tạm phần cấp trên để gọi module cần kiểm thử.~テスト対象を呼び出す上位プログラムの代用品。~Cần gọi và kiểm tra module cấp thấp trước khi có UI.~画面完成前に下位モジュールを呼んで試す。
リグレッションテスト~Kiểm tra lại để phát hiện thay đổi làm hỏng phần vốn hoạt động.~変更が既存機能へ悪影響を与えていないか確かめるテスト。~Sau sửa lỗi thanh toán, kiểm tra lại việc đặt hàng cũ.~決済修正後に従来の注文機能も再確認する。
'''
DATA[52] = '''
プロジェクト~Hoạt động có thời hạn nhằm tạo ra kết quả riêng biệt.~期限を定めて独自の成果を作る活動。~Phát triển một hệ thống mới trước ngày bàn giao.~納期までに新しいシステムを開発する。
定常業務~Hoạt động lặp thường xuyên để tạo kết quả ổn định.~同じような成果を継続的に生み出す日常業務。~Xử lý nghiệp vụ vận hành hằng ngày sau triển khai.~稼働後に日々の定型運用を続ける。
プロジェクトマネージャ~Người quản lý dự án để đạt mục tiêu đã thống nhất.~合意した目標へ向けてプロジェクトを管理する人。~Điều phối người, lịch trình và chi phí toàn dự án.~要員、日程、費用を総合的に調整する。
ステークホルダ~Cá nhân hay tổ chức có lợi ích hoặc chịu tác động từ dự án.~プロジェクトと利害関係を持つ人や組織。~Người dùng, khách hàng và bộ phận vận hành đều liên quan.~利用者、発注者、運用部門の利害を把握する。
PMBOK~Hệ thống hóa kiến thức quản lý dự án; cách tổ chức phụ thuộc phiên bản.~プロジェクト管理の知識体系で、整理方法は版によって異なる。~Dùng kiến thức quản lý làm tham chiếu, không coi mọi bản giống nhau.~管理知識を参照し、版による整理の違いにも注意する。
統合マネジメント~Điều phối các thành phần quản lý dự án thành tổng thể.~プロジェクトの各管理活動を全体として調整すること。~Một thay đổi phải cân bằng cả phạm vi, lịch và chi phí.~変更の影響を範囲、日程、費用から総合的に判断する。
スコープ~Phạm vi công việc và kết quả mà dự án bao gồm.~プロジェクトが対象とする作業と成果の範囲。~Làm rõ chức năng nào nằm trong lần bàn giao.~今回の納入に含める機能を明確にする。
WBS~Phân rã công việc theo cấu trúc phân cấp để quản lý.~作業を管理可能な単位へ階層的に分解したもの。~Chia việc tạo hệ thống thành gói công việc cụ thể.~システム構築を具体的な作業単位へ分ける。
スコープクリープ~Phạm vi tăng ngoài kiểm soát mà không điều chỉnh tương ứng.~適切な統制なしに作業範囲が拡大すること。~Liên tục thêm chức năng nhưng không duyệt lịch hay ngân sách.~承認や日程調整なしに機能が追加され続ける。
資源マネジメント~Lập kế hoạch và điều phối nguồn lực cần thiết.~必要な資源を計画し効果的に配置・調整する活動。~Phân công người có kỹ năng phù hợp cho công việc.~作業に合う技能の要員を配置する。
スケジュールマネジメント~Lập và kiểm soát tiến độ thực hiện dự án.~作業の日程を計画し進捗を管理する活動。~Theo dõi mốc bàn giao và các công việc có thể gây trễ.~納期と遅延につながる作業を管理する。
コストマネジメント~Ước lượng, lập ngân sách và kiểm soát chi phí.~費用の見積り、予算設定、実績の管理を行う活動。~So chi phí thực tế với ngân sách để xử lý lệch.~実際の支出を予算と比較し差を管理する。
品質マネジメント~Bảo đảm quy trình và kết quả đáp ứng yêu cầu chất lượng.~工程と成果が品質の要求を満たすよう管理する活動。~Xác định tiêu chí rồi tổ chức đánh giá chất lượng.~品質基準を定めて達成状況を確認する。
リスクマネジメント~Nhận diện, đánh giá và theo dõi ứng phó rủi ro dự án.~プロジェクトのリスクを特定・評価し対応を管理する活動。~Chuẩn bị ứng phó nguy cơ nhà cung cấp giao trễ.~調達先の遅延リスクに対応策を用意する。
調達マネジメント~Quản lý việc mua sản phẩm và dịch vụ từ bên ngoài.~外部から製品やサービスを取得する活動を管理すること。~Chọn và quản lý hợp đồng cung cấp hạ tầng.~設備の調達先と契約を管理する。
コミュニケーション管理~Quyết định thông tin nào được gửi cho ai, khi nào và bằng cách nào.~誰に何をいつどの方法で伝えるかを管理すること。~Quy định báo cáo tiến độ hằng tuần tới khách hàng.~顧客向けの週次進捗報告を計画する。
変更管理~Đánh giá và phê duyệt thay đổi trước khi cập nhật kế hoạch.~変更の影響を評価し承認して計画へ反映する活動。~Khách yêu cầu thêm tính năng, cần xem ảnh hưởng trước khi nhận.~追加機能の依頼について影響と承認を確認する。
ファンクションポイント法~Ước lượng quy mô dựa chức năng nhìn từ bên ngoài.~外部から見た機能を基にソフトウェア規模を見積もる方法。~Đánh giá đầu vào, đầu ra và tệp thay vì đếm dòng mã.~入力、出力、ファイルなどで規模を評価する。
類推見積り~Dùng kinh nghiệm dự án tương tự để ước lượng.~過去の類似プロジェクトを基に見積もる方法。~Dự án gần giống đã làm được dùng làm mốc ước lượng.~以前の似た開発実績を見積りの基準にする。
ボトムアップ見積り~Ước lượng từng công việc nhỏ rồi cộng lên tổng thể.~細かな作業ごとに見積もって全体へ積み上げる方法。~Tổng hợp công sức từ các gói việc của WBS.~WBSの作業単位の工数を合計する。
'''
DATA[53] = '''
WBS~Phân rã phạm vi công việc theo cấu trúc phân cấp.~作業範囲を階層的に分解した構造。~Cần liệt kê đủ việc trước khi sắp lịch.~日程を作る前に必要な作業を洗い出す。
ワークパッケージ~Đơn vị công việc ở cấp thấp được quản lý trong WBS.~WBSで管理する下位の作業単位。~Một gói có trách nhiệm, đầu ra và ước lượng cụ thể.~担当と成果と見積りを定めた作業のまとまり。
アローダイアグラム~Sơ đồ quan hệ thứ tự và phụ thuộc giữa các công việc.~作業の順序や依存関係を矢線で表す図。~Cần biết việc nào phải xong trước khi việc khác bắt đầu.~どの作業完了後に次の作業を始められるか示す。
クリティカルパス~Đường có tổng thời gian dài nhất, quyết định thời gian dự án trong mô hình.~所要時間が最長で全体の完了時期を決める経路。~Đường dài nhất tăng một ngày làm ngày hoàn thành tăng theo.~最長経路の作業が遅れると全体の完了も遅れる。
最早開始時刻~Thời điểm sớm nhất việc có thể bắt đầu khi đủ tiền nhiệm.~先行条件を満たして最も早く作業を開始できる時刻。~Hai việc trước xong ngày 3 và 5 thì bắt đầu sớm nhất ngày 5.~前提が時刻3と5に終わるなら開始は最短で5。
最早終了時刻~Thời điểm bắt đầu sớm nhất cộng thời gian thực hiện.~最早開始時刻に作業時間を加えた時刻。~Bắt đầu sớm nhất ngày 4, làm 3 ngày thì xong ngày 7.~最早開始4、所要3なら最早終了は7。
最遅開始時刻~Thời điểm bắt đầu muộn nhất mà vẫn giữ hạn hoàn thành đã xét.~全体の期限を守れる最も遅い開始時刻。~Việc phải xong trước ngày 10 và làm 3 ngày thì bắt đầu chậm nhất 7.~時刻10までに終え所要3なら最遅開始は7。
最遅終了時刻~Thời điểm muộn nhất việc được kết thúc để không trễ hạn toàn thể.~全体を遅らせずに作業を終えられる最も遅い時刻。~Tính ngược từ ngày bàn giao qua các công việc kế tiếp.~納期から後続作業を逆向きにたどって求める。
総余裕時間~Độ trễ cho phép của công việc mà không đổi hạn toàn thể.~全体の完了を遅らせずに作業を遅らせられる時間。~Bắt đầu sớm nhất 2, muộn nhất 6 thì có dư 4.~最早開始2、最遅開始6なら余裕は4。
ダミー作業~Mũi tên thời gian bằng không để biểu diễn quan hệ phụ thuộc.~依存関係を表す所要時間ゼロの矢線。~Cần biểu diễn ràng buộc trước–sau mà không thêm công việc thực.~実作業を増やさず順序制約だけを表す。
PERT三点見積り~Ước lượng kỳ vọng từ lạc quan, khả dĩ nhất và bi quan theo trọng số.~楽観値、最頻値、悲観値から重み付きで期間を見積もる方法。~Dùng công thức (a+4m+b)/6 khi mô hình đề cho quy định này.~指定されたモデルで(a+4m+b)/6を使う。
クラッシング~Thêm nguồn lực để rút ngắn thời gian, thường làm tăng chi phí.~資源を追加して期間を短縮する方法。~Tăng nhân lực cho việc găng để rút ngắn dự án.~クリティカルな作業へ資源を追加して短縮する。
ファストトラッキング~Cho công việc vốn tuần tự chạy chồng lấp khi có thể.~本来順次行う作業を可能な範囲で重ねて実施する方法。~Bắt đầu phần triển khai khi phần thiết kế tương ứng đã đủ ổn định.~対応する設計が固まった部分から実装を重ねて始める。
PV~Giá trị ngân sách của công việc dự kiến hoàn thành tới mốc đánh giá.~評価時点までに完了する予定の作業の予算額。~Đã lên kế hoạch hoàn thành phần việc trị giá 100.~その時点で予算額100の作業を終える計画だった。
EV~Giá trị ngân sách của khối lượng công việc thực sự đã hoàn thành.~実際に完了した作業を予算額で評価した値。~Đã hoàn thành phần việc có ngân sách 80, dù chi thực tế khác.~完了した作業の予算額が80だった。
AC~Chi phí thực tế phát sinh cho công việc đã thực hiện.~実施した作業に実際に支出した費用。~Đã chi 90 để làm phần việc được đánh giá EV bằng 80.~EVが80の作業に実際は90を支出した。
CV~Chênh lệch chi phí bằng EV trừ AC.~EVからACを引いたコストの差異。~EV nhỏ hơn AC nên chi phí không thuận lợi.~EVがACより小さく費用面で不利と判断する。
SV~Chênh lệch tiến độ theo giá trị bằng EV trừ PV.~EVからPVを引いた進捗の差異。~EV nhỏ hơn PV nghĩa là hoàn thành ít hơn kế hoạch theo giá trị.~EVがPVより小さく予定より出来高が少ない。
CPI~Chỉ số hiệu quả chi phí bằng EV chia AC.~EVをACで割ったコスト効率の指標。~Mỗi đơn vị chi tiêu tạo ra bao nhiêu giá trị ngân sách hoàn thành.~支出1単位に対する出来高の割合を求める。
SPI~Chỉ số hiệu quả tiến độ bằng EV chia PV.~EVをPVで割った進捗効率の指標。~So tỷ lệ giá trị hoàn thành với giá trị dự kiến.~予定の出来高に対する実績の割合を求める。
'''
DATA[54] = '''
ITサービスマネジメント~Quản lý dịch vụ IT để đáp ứng nhu cầu và giá trị cho khách hàng.~顧客のニーズと価値を満たすようITサービスを管理すること。~Không chỉ sửa máy mà quản lý chất lượng dịch vụ cung cấp.~機器だけでなく提供するサービスの品質を管理する。
ITIL~Tập kiến thức và thực hành quản lý dịch vụ IT.~ITサービス管理の知識や実践をまとめた枠組み。~Dùng hướng dẫn thực hành quản lý dịch vụ làm tham chiếu.~サービス管理の実践知識を参照する。
SLA~Thỏa thuận về mức dịch vụ giữa bên cung cấp và bên sử dụng.~提供者と利用者が合意したサービス水準。~Hai bên thống nhất khả dụng và thời gian phản hồi.~可用性や応答時間の水準を双方で合意する。
サービスレベル管理~Thống nhất, đo lường và cải thiện mức dịch vụ.~サービス水準を合意し測定・改善する活動。~So chỉ số vận hành thực tế với mức đã cam kết.~実績を合意した水準と比較して改善する。
サービスデスク~Đầu mối liên hệ giữa người dùng và nhà cung cấp dịch vụ.~利用者とサービス提供者の連絡窓口。~Người dùng báo lỗi và hỏi hỗ trợ tại cùng một đầu mối.~利用者が障害や問い合わせを一つの窓口へ伝える。
インシデント管理~Khôi phục dịch vụ bình thường nhanh, giảm ảnh hưởng gián đoạn.~通常のサービスを早く回復し影響を抑える活動。~Dùng biện pháp tạm để dịch vụ hoạt động lại trước.~まず暫定手段でサービスを再開する。
問題管理~Tìm và xử lý nguyên nhân của sự cố để giảm tái diễn.~インシデントの原因を調べ再発を防ぐ活動。~Nhiều lỗi lặp lại cần xác định nguyên nhân gốc.~繰り返す障害の根本原因を調べる。
既知の誤り~Vấn đề đã phân tích và biết nguyên nhân hoặc cách xử lý tạm theo hồ sơ.~分析済みで原因や回避方法を記録した問題。~Nhân viên hỗ trợ tra hồ sơ nguyên nhân đã biết.~担当者が分析済みの原因や対処法を参照する。
ワークアラウンド~Cách tránh hoặc giảm ảnh hưởng khi chưa sửa triệt để.~恒久解決まで影響を軽減する回避方法。~Chuyển sang máy dự phòng trong khi điều tra nguyên nhân.~原因調査中は代替機で業務を続ける。
変更管理~Đánh giá và kiểm soát rủi ro khi thay đổi dịch vụ.~サービス変更のリスクを評価して統制する活動。~Duyệt thay đổi cấu hình trước triển khai.~設定変更の影響を確認して承認する。
リリース管理~Lập kế hoạch và quản lý đưa phiên bản mới vào sử dụng.~新しい版を利用できるよう計画して導入する活動。~Điều phối phiên bản, lịch triển khai và thông báo bàn giao.~版と導入日程と利用案内をまとめて管理する。
構成管理~Quản lý thông tin cấu hình và quan hệ của các thành phần dịch vụ.~サービスを構成する要素と関係の情報を管理する活動。~Biết ứng dụng phụ thuộc máy chủ và cấu hình nào.~アプリがどの機器や設定に依存するか把握する。
可用性管理~Quản lý khả năng dịch vụ sử dụng được theo mức yêu cầu.~要求水準でサービスを利用できるよう管理する活動。~Theo dõi thời gian hoạt động và cơ chế dự phòng.~稼働時間と冗長化の仕組みを管理する。
キャパシティ管理~Bảo đảm năng lực tài nguyên đáp ứng tải hiện tại và tương lai.~現在と将来の需要に応じた処理能力を確保する活動。~Dự báo tải tăng để lên kế hoạch bổ sung năng lực.~負荷増加を予測し必要な処理能力を計画する。
ITサービス継続管理~Chuẩn bị duy trì hoặc phục hồi dịch vụ IT sau gián đoạn lớn.~重大な中断時にITサービスを継続・復旧するための管理。~Có phương án địa điểm dự phòng để phục hồi dịch vụ.~大きな障害に備え代替拠点で復旧する計画を用意する。
PDCA~Chu trình kế hoạch, thực hiện, đánh giá rồi cải tiến dịch vụ.~計画、実行、点検、改善を繰り返すサイクル。~Dựa kết quả đo mức dịch vụ để sửa cách vận hành.~水準の測定結果から運用を改善する。
ローカルサービスデスク~Bộ phận hỗ trợ đặt gần người dùng tại địa điểm đó.~利用者の拠点近くに設置する窓口。~Mỗi chi nhánh có nhóm hỗ trợ trực tiếp tại chỗ.~各支店に利用者向けの現地窓口を置く。
集中サービスデスク~Tập trung đầu mối hỗ trợ nhiều nơi tại một trung tâm.~複数拠点の対応を一か所へ集約した窓口。~Một trung tâm tiếp nhận yêu cầu toàn công ty.~会社全体の問い合わせを一つのセンターで受ける。
バーチャルサービスデスク~Các nhóm phân tán cùng tạo một đầu mối nhờ kết nối IT.~離れた担当者がITを使い一体の窓口として対応する形。~Người dùng thấy một đầu mối dù nhân sự ở nhiều nơi.~担当者は各地にいても利用者には一つの窓口に見える。
フォローザサン~Chuyển hỗ trợ giữa các vùng múi giờ để phục vụ liên tục.~時差のある拠点を引き継いで継続対応する方式。~Đội ca ngày ở mỗi khu vực lần lượt nhận việc hỗ trợ.~地域ごとの日中担当が順に対応を引き継ぐ。
'''
DATA[55] = '''
システム監査~Đánh giá hệ thống có hệ thống dựa trên bằng chứng và tiêu chuẩn.~証拠と基準に基づき情報システムを体系的に評価する活動。~Kiểm tra việc kiểm soát hệ thống có phù hợp và hiệu quả.~システムの管理が適切に機能しているか評価する。
監査人の独立性~Người kiểm toán có vị trí độc lập với đối tượng được đánh giá.~監査対象から独立した立場で評価する性質。~Người phát triển không tự đưa kết luận kiểm toán độc lập cho phần mình.~開発担当者自身を独立した監査の評価者にしない。
客観性~Đánh giá công bằng dựa bằng chứng, không thiên vị.~偏りなく証拠に基づいて判断する性質。~Không kết luận chỉ vì tin tưởng người quản trị.~管理者への信頼だけで結論を出さない。
監査証拠~Thông tin hỗ trợ phát hiện và kết luận kiểm toán.~監査の発見や結論を裏付ける情報。~Đối chiếu nhật ký, tài liệu và kết quả kiểm tra thực tế.~ログ、文書、実際の検査結果で裏付ける。
監査計画~Xác định mục tiêu, phạm vi và cách thực hiện kiểm toán.~監査の目的、範囲、方法を定める計画。~Trước kiểm tra phải thống nhất bộ phận và nội dung đánh giá.~調査前に対象部門と評価内容を定める。
予備調査~Thu thập hiểu biết tổng thể để chuẩn bị kiểm toán chi tiết.~本格的な調査前に対象の全体像を把握する活動。~Đọc quy trình và cấu trúc tổ chức trước lập thủ tục chi tiết.~詳細な確認の前に業務と組織を把握する。
監査報告~Trình bày kết quả, căn cứ và kiến nghị tới bên yêu cầu.~結果、根拠、改善への意見を依頼者へ報告すること。~Người kiểm toán báo điểm yếu và đề xuất, không tự vận hành thay.~監査人が弱点と改善案を報告する。
フォローアップ~Theo dõi việc thực hiện cải tiến sau báo cáo kiểm toán.~監査後に改善の実施状況を確認する活動。~Kiểm tra kiến nghị đã được xử lý đúng hạn chưa.~勧告された改善が実施されたか確認する。
内部統制~Cơ chế trong tổ chức giúp đạt mục tiêu và bảo đảm hoạt động phù hợp.~組織の目標達成と適切な業務を支える内部の仕組み。~Phân quyền, kiểm tra và phê duyệt trong quy trình nghiệp vụ.~業務に権限、確認、承認の仕組みを組み込む。
職務分掌~Phân tách trách nhiệm để tránh một người tự làm mọi khâu nhạy cảm.~不正や誤りを防ぐため役割を適切に分けること。~Người tạo khoản thanh toán không tự phê duyệt khoản đó.~支払を登録する人と承認する人を分ける。
コーポレートガバナンス~Cơ chế giám sát và điều hành doanh nghiệp để hoạt động phù hợp.~企業を適切に運営・監督する仕組み。~Làm rõ trách nhiệm giám sát của cấp quản trị doanh nghiệp.~経営を監督する責任と仕組みを整える。
ファシリティマネジメント~Quản lý thiết bị, cơ sở vật chất và môi trường cho hệ thống.~情報システムの設備や施設・環境を管理する活動。~Quản lý điện, làm mát và chống cháy phòng máy.~サーバ室の電源、空調、防火を管理する。
UPS~Cấp điện tạm thời khi điện lưới gián đoạn.~停電時に一時的な電力を供給する装置。~Đủ thời gian lưu dữ liệu và tắt máy an toàn khi mất điện.~停電後に保存と安全な停止を行う時間を確保する。
サージ保護~Bảo vệ thiết bị khỏi điện áp tăng đột ngột.~瞬間的な過電圧から機器を保護する対策。~Ngăn ảnh hưởng của xung điện do sét hoặc đóng cắt.~雷などによる電圧の急上昇から守る。
一斉移行~Chuyển toàn hệ thống sang mới tại một thời điểm.~全体を一度に新システムへ切り替える移行方式。~Đổi đồng loạt, cần chuẩn bị tốt vì phạm vi ảnh hưởng lớn.~一括切替えに備えて全体への影響を確認する。
段階移行~Chuyển từng phần sang hệ thống mới theo các giai đoạn.~部分ごとに段階を分け新システムへ切り替える方式。~Triển khai lần lượt theo chi nhánh.~支店ごとに順次、新システムへ移す。
並行移行~Chạy hệ thống cũ và mới cùng lúc một thời gian để kiểm tra.~一定期間、旧・新システムを並行して動かす方式。~So kết quả hai hệ thống trước khi dừng hệ thống cũ.~旧新の結果を比較してから旧を停止する。
バックアップ運用~Lập lịch và quản lý bản sao để khôi phục dữ liệu.~復旧のための複製を計画的に取得・管理する運用。~Có lịch lưu, quản lý thế hệ và kiểm tra bản sao.~取得日程、世代管理、複製の確認を行う。
復旧訓練~Thực hành khôi phục để xác nhận kế hoạch và bản sao dùng được.~回復の手順とデータが使えるか実際に訓練すること。~Không chỉ có tệp sao lưu mà thử phục hồi thật.~保存しただけでなく実際に復元を試す。
運用手順書~Tài liệu quy định bước vận hành và xử lý tình huống.~運用や対処の手順を定めた文書。~Người trực theo hướng dẫn khi dừng, khởi động hoặc gặp lỗi.~停止、起動、障害時に担当者が共通の手順に従う。
'''
DATA[57] = '''
情報システム戦略~Định hướng hệ thống thông tin phù hợp với mục tiêu kinh doanh.~経営方針に沿って情報システムの方向を定めること。~Đầu tư IT để hỗ trợ mục tiêu công ty, không chỉ từng phòng.~各部門だけでなく経営目標に沿ってITを考える。
全体最適~Tối ưu trên toàn tổ chức thay vì riêng từng bộ phận.~各部門だけでなく組織全体として最適化する考え。~Chuẩn hóa dữ liệu để toàn công ty phối hợp thuận lợi.~全社の連携のためデータを共通化する。
部分最適~Tối ưu riêng một bộ phận mà chưa xét hiệu quả tổng thể.~一部の部門や機能だけに着目した最適化。~Một phòng tiết kiệm nhưng làm chi phí phòng khác tăng lớn.~一部署の節約で他部署の負担が大きくなる。
EA~Kiến trúc tổng thể phối hợp nghiệp vụ, dữ liệu, ứng dụng và công nghệ.~業務、データ、アプリ、技術を全体的に整える構造。~Mô hình hiện tại và mục tiêu được xem xuyên các lớp của doanh nghiệp.~現状と目標を業務から技術まで横断して整理する。
BPR~Thiết kế lại căn bản quy trình nghiệp vụ nhằm cải thiện lớn.~業務の手順を抜本的に見直して改革すること。~Bỏ luồng duyệt cũ và thiết kế lại toàn quy trình.~従来の承認手順を前提にせず根本から再設計する。
BPM~Quản lý và cải tiến quy trình nghiệp vụ liên tục.~業務プロセスを継続して管理・改善すること。~Đo lường quy trình rồi cải tiến qua nhiều vòng.~業務の流れを測り継続的に改善する。
RPA~Tự động hóa thao tác có quy tắc bằng phần mềm.~定型的な操作をソフトウェアで自動化する技術。~Tự chép dữ liệu theo quy tắc giữa hai màn hình.~決まった規則で画面間の転記を自動化する。
BPO~Thuê bên ngoài thực hiện một phần quy trình nghiệp vụ.~業務プロセスの一部を外部に委託すること。~Giao nghiệp vụ xử lý lương cho công ty dịch vụ.~給与処理業務を外部の会社へ委託する。
オンプレミス~Tổ chức tự bố trí hệ thống trên cơ sở do mình quản lý.~自社管理の環境にシステムを設置して運用する形。~Doanh nghiệp vận hành máy chủ tại cơ sở của mình.~自社設備でサーバを運用する。
IaaS~Dịch vụ cung cấp hạ tầng như máy tính, lưu trữ và mạng.~計算、記憶、ネットワークなど基盤を提供するサービス。~Thuê máy ảo rồi tự quản lý hệ điều hành và ứng dụng.~仮想マシンを借りてOSとアプリを自分で管理する。
PaaS~Cung cấp nền tảng chạy và phát triển ứng dụng.~アプリの開発・実行の基盤を提供するサービス。~Đưa mã lên nền tảng mà không tự quản lý hạ tầng thấp.~基盤を自分で構築せずアプリを配置する。
SaaS~Cung cấp chức năng phần mềm hoàn chỉnh qua dịch vụ.~完成したソフトの機能をサービスとして提供する形。~Sử dụng ứng dụng quản lý khách hàng do nhà cung cấp vận hành.~提供者が運用する顧客管理アプリを利用する。
SOA~Xây dựng hệ thống bằng các dịch vụ có giao diện rõ ràng.~明確なインタフェースを持つサービスの組合せで構成する考え。~Các chức năng nghiệp vụ được tổ chức thành dịch vụ tái sử dụng.~業務機能を再利用できるサービスとして組み合わせる。
BI~Dùng dữ liệu để hỗ trợ phân tích và ra quyết định kinh doanh.~データの分析によって経営判断を支援すること。~Tổng hợp số liệu bán hàng để tìm xu hướng.~販売データを集計・分析して判断を助ける。
要件定義~Làm rõ và thống nhất nhu cầu với các bên liên quan.~利害関係者の要求を具体化し合意する活動。~Thống nhất chức năng và chất lượng trước khi thiết kế.~設計前に機能と品質の要求を合意する。
RFI~Yêu cầu cung cấp thông tin để hiểu thị trường và phương án.~調達検討のため製品や供給者の情報を求める文書。~Chưa rõ giải pháp có gì, cần thu thập thông tin nhà cung cấp.~提案募集の前に市場の製品情報を集める。
RFP~Yêu cầu nhà cung cấp đề xuất phương án dựa yêu cầu đã nêu.~要求を示して供給者に提案を求める文書。~Gửi yêu cầu và tiêu chí để các hãng đề xuất hệ thống.~要件と評価基準を示し各社に提案を求める。
ROI~Tỷ lệ lợi ích hoặc lợi nhuận đầu tư so với chi phí đầu tư theo định nghĩa đã chọn.~定義した利益を投資額で割って投資効率を評価する指標。~Khi đề quy định lợi nhuận ròng, lấy lợi nhuận đó chia vốn đầu tư.~設問で定めた純利益を投資額で割る。
TCO~Tổng chi phí sở hữu trong vòng đời, gồm mua và vận hành.~導入から運用などを含む所有の総費用。~So giải pháp bằng cả chi phí ban đầu và chi phí dùng nhiều năm.~初期費用だけでなく継続運用費も比較する。
プライバシーバイデザイン~Đưa bảo vệ riêng tư vào thiết kế ngay từ đầu.~設計の初めからプライバシー保護を組み込む考え。~Giảm thu thập dữ liệu cá nhân từ khâu xác định yêu cầu.~要件の段階から個人情報の収集を抑える。
'''
DATA[58] = '''
SWOT分析~Phân tích điểm mạnh, yếu bên trong và cơ hội, nguy cơ bên ngoài.~内部の強み・弱みと外部の機会・脅威を整理する分析。~Tách nguồn lực nội bộ khỏi biến động của thị trường.~社内の能力と市場環境の変化を分けて考える。
強み（S）~Yếu tố nội bộ tạo lợi thế cho tổ chức.~組織内部の有利な特性。~Doanh nghiệp sở hữu công nghệ vượt trội.~自社に優れた独自技術がある。
弱み（W）~Yếu tố nội bộ gây bất lợi cho tổ chức.~組織内部の不利な特性。~Quy trình nội bộ chậm hơn đối thủ.~自社の業務手順に非効率がある。
機会（O）~Yếu tố môi trường bên ngoài thuận lợi.~外部環境の有利な変化。~Nhu cầu thị trường cho sản phẩm đang tăng.~市場で対象商品の需要が伸びる。
脅威（T）~Yếu tố môi trường bên ngoài bất lợi.~外部環境の不利な変化。~Đối thủ mới gia nhập với sản phẩm thay thế.~新たな競合が代替品で参入する。
PPM~Phân loại danh mục kinh doanh theo tăng trưởng thị trường và thị phần tương đối.~市場成長率と相対的市場占有率で事業を分類する方法。~Cân nhắc phân bổ nguồn lực giữa các mảng kinh doanh.~複数事業への資源配分を検討する。
花形~Trong PPM, tăng trưởng cao và thị phần tương đối cao.~PPMで市場成長率も相対的市場占有率も高い事業。~Mảng kinh doanh mạnh trong thị trường tăng nhanh.~成長市場で高いシェアを持つ事業。
金のなる木~Trong PPM, tăng trưởng thấp và thị phần tương đối cao.~PPMで成長率が低く相対的シェアが高い事業。~Mảng trưởng thành giữ vị thế cao và tạo nguồn tiền.~成熟市場で高シェアを保ち資金を生む事業。
問題児~Trong PPM, tăng trưởng cao nhưng thị phần tương đối thấp.~PPMで成長率が高く相対的シェアが低い事業。~Thị trường hấp dẫn nhưng doanh nghiệp chưa có vị thế mạnh.~市場は伸びるが自社の占有率はまだ低い。
負け犬~Trong PPM, tăng trưởng thấp và thị phần tương đối thấp.~PPMで成長率も相対的シェアも低い事業。~Thị trường chậm tăng và vị thế doanh nghiệp yếu.~成長の小さい市場でシェアも低い。
バランススコアカード~Đánh giá chiến lược theo tài chính, khách hàng, quy trình, học tập–phát triển.~財務、顧客、内部業務、学習と成長の四視点で評価する枠組み。~Không chỉ xem lợi nhuận mà còn khả năng tạo kết quả tương lai.~利益以外の顧客や成長の要因も評価する。
CSF~Yếu tố thành công quan trọng cần đạt để hiện thực chiến lược.~戦略実現に重要な成功要因。~Xác định giao hàng đúng hẹn là điều cốt yếu để giữ khách.~顧客維持には納期遵守が重要と定める。
KPI~Chỉ số đo mức thực hiện mục tiêu hoặc yếu tố thành công.~目標や成功要因の達成状況を測る指標。~Theo dõi tỷ lệ giao đúng hẹn theo từng tháng.~納期遵守率を毎月測る。
コアコンピタンス~Năng lực cốt lõi tạo lợi thế mà đối thủ khó bắt chước.~他社が模倣しにくい競争力の中核となる能力。~Bí quyết tích lũy tạo ra sản phẩm khác biệt.~蓄積した能力によって独自の商品を生む。
ベンチマーキング~So sánh với thực hành tốt để tìm hướng cải tiến.~優れた実践と比較して改善につなげる方法。~Đối chiếu quy trình với tổ chức dẫn đầu để tìm khoảng cách.~先進的な業務と比較して改善点を見つける。
バリューチェーン~Phân tích các hoạt động tạo giá trị và quan hệ của chúng.~価値を生む企業活動のつながりを分析する考え。~Tìm khâu tạo lợi thế trong mua hàng, sản xuất và bán hàng.~調達、生産、販売のどこが価値を生むか分析する。
4P~Sản phẩm, giá, phân phối và xúc tiến trong marketing.~製品、価格、流通、販売促進の四要素。~Kết hợp quyết định hàng bán, giá, kênh và quảng bá.~商品、値付け、販路、宣伝を組み合わせる。
プロダクトライフサイクル~Các giai đoạn giới thiệu, tăng trưởng, trưởng thành và suy thoái của sản phẩm.~導入、成長、成熟、衰退という製品の段階。~Chiến lược được điều chỉnh theo giai đoạn nhu cầu sản phẩm.~製品需要の段階に応じて戦略を変える。
規模の経済~Quy mô tăng giúp giảm chi phí bình quân trong điều kiện thích hợp.~規模の拡大によって平均費用が下がる効果。~Phân bổ chi phí cố định cho nhiều sản phẩm hơn.~固定費をより多くの製品へ配分する。
経験曲線~Chi phí đơn vị có xu hướng giảm khi sản lượng tích lũy tăng.~累積生産量が増えると単位費用が下がる傾向。~Kinh nghiệm sản xuất tích lũy giúp nâng hiệu quả.~生産経験の蓄積によって効率を高める。
'''
DATA[59] = '''
POS~Thu thập dữ liệu bán hàng tại thời điểm thanh toán.~販売時点で売上データを記録する仕組み。~Quét hàng tại quầy để ghi mặt hàng và số lượng bán.~レジで商品と販売数を記録する。
ID-POS~Kết hợp dữ liệu bán hàng với mã nhận biết khách hàng.~販売データに顧客の識別情報を対応付けたもの。~Phân tích cùng khách đã mua những sản phẩm nào.~同じ顧客が何を購入したか分析する。
MRP~Lập nhu cầu vật tư dựa kế hoạch sản xuất, cấu thành và tồn kho.~生産計画、部品構成、在庫から資材所要量を求める方法。~Tính phải đặt bao nhiêu linh kiện cho đơn sản xuất.~生産予定に必要な部品の発注量を求める。
JIT~Cung ứng thứ cần thiết, đúng lượng vào thời điểm cần.~必要な物を必要な量だけ必要な時に供給する考え。~Giảm tồn bằng đưa linh kiện tới gần lúc sử dụng.~使う時に合わせて部品を供給し在庫を抑える。
セル生産方式~Nhóm nhỏ hoặc cá nhân đảm nhận nhiều công đoạn trong một đơn vị sản xuất.~少人数で複数工程を担当する生産方式。~Một nhóm hoàn thành nhiều bước lắp ráp của sản phẩm.~小さなチームで組立ての複数工程を担当する。
EC~Giao dịch thương mại dùng mạng điện tử.~ネットワークを利用した商取引。~Đặt mua hàng qua cửa hàng trực tuyến.~オンライン店舗で商品を注文する。
BtoB~Giao dịch giữa doanh nghiệp với doanh nghiệp.~企業と企業の間の取引。~Nhà máy đặt linh kiện từ doanh nghiệp cung ứng.~工場が部品メーカーから調達する。
BtoC~Giao dịch giữa doanh nghiệp với người tiêu dùng.~企業と消費者の間の取引。~Công ty bán sản phẩm trực tiếp cho khách cá nhân.~会社が個人の消費者へ商品を販売する。
CtoC~Giao dịch giữa những người tiêu dùng.~消費者同士の取引。~Hai cá nhân mua bán đồ đã dùng qua nền tảng.~個人同士が中古品を売買する。
EDI~Trao đổi dữ liệu giao dịch có cấu trúc theo quy tắc thống nhất.~取引データを共通の形式で電子的に交換する仕組み。~Đơn đặt hàng được trao trực tiếp giữa hệ thống hai doanh nghiệp.~企業のシステム間で注文データを交換する。
RFID~Nhận dạng và trao đổi dữ liệu bằng sóng vô tuyến với thẻ.~電波を使ってタグの情報を識別・交換する技術。~Đọc thông tin hàng qua thẻ không cần quét mã nhìn thấy.~見えるバーコードを読まず電波でタグ情報を得る。
ロングテール~Nhiều mặt hàng ít bán có thể tạo doanh thu tổng đáng kể.~販売数の少ない多数の商品が合計で大きな売上を作る考え。~Cửa hàng mạng khai thác danh mục hàng ngách rất rộng.~オンラインで多数のニッチ商品を扱う。
組込みシステム~Hệ thống máy tính tích hợp vào sản phẩm để điều khiển chức năng của nó.~機器へ組み込まれ機能を制御するコンピュータシステム。~Bộ điều khiển trong máy giặt.~洗濯機の動きを制御する内部システム。
IoT~Kết nối các vật thể với mạng để trao đổi dữ liệu và điều khiển.~物をネットワークにつなぎ情報の収集や制御を行う考え。~Cảm biến nhà máy gửi dữ liệu trạng thái qua mạng.~工場のセンサが状態をネットワークへ送る。
センサ~Thiết bị đo đại lượng vật lý để chuyển thành thông tin.~物理的な量を検知し情報として取り出す装置。~Đo nhiệt độ để gửi cho hệ thống giám sát.~温度を測定し監視システムへ渡す。
アクチュエータ~Thiết bị nhận điều khiển và tạo tác động vật lý.~制御信号を受け物理的な動作を起こす装置。~Hệ thống phát lệnh đóng van nước.~指示を受けて水のバルブを閉める。
エッジコンピューティング~Xử lý gần nơi tạo dữ liệu thay vì chuyển hết về trung tâm.~データ発生源の近くで処理する構成。~Máy gần cảm biến phân tích ngay trước khi gửi kết quả.~センサ近くで解析し結果を送る。
スマートグリッド~Lưới điện dùng thông tin để phối hợp cung và cầu điện.~情報技術で電力の供給と需要を調整する電力網。~Dữ liệu sử dụng điện hỗ trợ điều phối lưới.~利用状況の情報を使って電力網を調整する。
HEMS~Quản lý năng lượng trong gia đình bằng hệ thống thông tin.~家庭内のエネルギー利用を管理する仕組み。~Theo dõi và điều chỉnh tiêu thụ điện trong nhà.~家庭の電力消費を把握・調整する。
機械学習の活用~Dùng mô hình học từ dữ liệu để dự đoán hay phân loại, cần đánh giá phù hợp.~データから学習したモデルを予測や分類に使い性能を評価すること。~Dữ liệu cảm biến giúp mô hình dự báo dấu hiệu hỏng, cần kiểm chứng.~センサデータで故障の兆候を予測し精度を検証する。
'''
DATA[60] = '''
職能別組織~Tổ chức bộ phận theo chuyên môn hoặc chức năng.~営業や開発など職能ごとに分ける組織。~Nhân sự tập trung theo phòng bán hàng, kế toán, kỹ thuật.~営業、経理、技術という機能別に人を配置する。
マトリックス組織~Kết hợp hai trục quản lý như chức năng và dự án.~職能とプロジェクトなど二つの軸を組み合わせた組織。~Nhân viên vừa thuộc phòng chuyên môn vừa tham gia dự án.~担当者が職能部門とプロジェクトの両方に属する。
OJT~Đào tạo thông qua làm việc thực tế với hướng dẫn.~実際の業務を通じて指導・教育する方法。~Nhân viên mới học công việc ngay khi làm cùng người hướng dẫn.~新人が現場の仕事をしながら指導を受ける。
Off-JT~Đào tạo tách khỏi công việc thực tế hằng ngày.~通常の業務から離れて行う教育。~Tham dự khóa đào tạo riêng ngoài thời gian tác nghiệp trực tiếp.~通常業務から離れ研修を受講する。
パレート図~Sắp nhóm dữ liệu giảm dần cùng đường tỷ lệ tích lũy.~項目を大きい順に並べ累積比率を示す図。~Xác định vài nguyên nhân chiếm phần lớn lỗi.~不良の大部分を占める原因を見つける。
ABC分析~Phân nhóm ưu tiên dựa mức đóng góp tích lũy.~累積した重要度で対象を区分する分析。~Ưu tiên quản lý nhóm hàng đóng góp giá trị lớn.~金額への寄与が大きい品目を重点管理する。
散布図~Biểu diễn các cặp số liệu để quan sát quan hệ hai biến.~二つの量の組を点で表し関係を見る図。~Quan sát nhiệt độ và số lượng bán có liên hệ không.~気温と販売数の関係を点で調べる。
特性要因図~Sơ đồ các nguyên nhân có thể tác động tới một kết quả.~特性に影響する要因を整理して示す図。~Tổ chức giả thuyết về nguyên nhân lỗi theo nhánh.~不良の原因候補を枝分かれで整理する。
線形計画法~Tối ưu hàm mục tiêu tuyến tính dưới các ràng buộc tuyến tính.~線形の制約の下で線形の目的関数を最適化する方法。~Chọn sản lượng hai hàng để tối đa lợi nhuận với giới hạn vật tư.~材料制約の下で二商品の利益を最大化する。
実行可能領域~Tập các điểm đồng thời thỏa mọi ràng buộc.~すべての制約を同時に満たす解の集合。~Một phương án phải đủ cả nguyên liệu và giờ công.~材料と作業時間の両方の条件を満たす範囲。
期待値~Tổng giá trị từng kết quả nhân xác suất tương ứng.~各結果の値とその確率の積を合計した値。~Lợi ích trung bình theo các kịch bản có xác suất cho trước.~確率付きのシナリオから平均的な利益を求める。
固定費~Chi phí không đổi theo sản lượng trong phạm vi mô hình.~想定範囲で生産量によらず一定の費用。~Tiền thuê cơ sở được giữ cố định trong bài tính.~計算上、数量によらず同じ家賃を扱う。
変動費~Chi phí biến đổi theo sản lượng hoặc doanh thu trong mô hình.~生産量や売上に応じて変化する費用。~Chi phí vật tư tăng theo số sản phẩm làm ra.~製造数に応じて材料費が増える。
限界利益~Doanh thu trừ chi phí biến đổi.~売上高から変動費を引いたもの。~Phần còn lại để bù định phí rồi tạo lợi nhuận.~固定費の回収と利益に充てる部分を求める。
損益分岐点売上高~Mức doanh thu lợi nhuận bằng không: định phí chia tỷ lệ lãi góp.~利益がゼロの売上高で、固定費を限界利益率で割る。~Tìm doanh thu đủ bù cả định phí và biến phí.~固定費と変動費をちょうど回収する売上を求める。
貸借対照表~Bảng tài sản, nợ phải trả và vốn chủ tại một thời điểm.~ある時点の資産、負債、純資産を示す表。~Xem doanh nghiệp có gì và được tài trợ từ đâu tại cuối kỳ.~期末時点の財産とその調達元を確認する。
損益計算書~Báo cáo doanh thu, chi phí và lợi nhuận của một kỳ.~一定期間の収益、費用、利益を示す表。~Đánh giá kết quả kinh doanh trong cả năm.~一年間の経営成績を確認する。
キャッシュフロー計算書~Báo cáo luồng tiền vào và ra trong kỳ.~一定期間の現金の流れを示す表。~Kiểm tra vì sao có lợi nhuận nhưng tiền mặt giảm.~利益があっても現金が減る理由を確認する。
減価償却~Phân bổ giá trị tài sản sử dụng nhiều kỳ vào chi phí.~長期利用する資産の取得費用を期間へ配分する処理。~Máy dùng nhiều năm được ghi chi phí theo từng năm.~長年使う設備の費用を各年に配分する。
定額法~Phân bổ cùng một khoản khấu hao mỗi kỳ theo điều kiện đã định.~定めた条件で毎期同じ額を償却する方法。~Khấu hao hằng năm bằng giá trị cần phân bổ chia số năm.~償却対象額を年数で割って毎年同額にする。
'''
DATA[61] = '''
著作権~Bảo vệ biểu đạt sáng tạo; không bảo vệ ý tưởng tự thân.~創作的な表現を保護し、アイデア自体とは区別する権利。~Mã chương trình cụ thể và ý tưởng thuật toán phải phân biệt.~プログラムの具体的な表現と算法の考えを区別する。
プログラムの著作物~Biểu đạt sáng tạo của chương trình có thể thuộc phạm vi quyền tác giả.~創作性のあるプログラムの表現は著作物として保護され得る。~Không tự do chép mã chỉ vì hiểu cùng thuật toán.~同じ算法を知っていても他人のコードを自由に複製しない。
アルゴリズム~Phương pháp giải, không được bảo vệ như biểu đạt bởi quyền tác giả tự thân.~解法そのものは著作権による表現の保護とは区別される。~Hai người tự viết mã khác nhau cho cùng phương pháp giải.~同じ解法を別々の表現のコードで実装する。
特許権~Quyền bảo hộ sáng chế đáp ứng điều kiện và được đăng ký.~条件を満たして登録された発明を保護する権利。~Cần phân biệt bảo hộ phát minh kỹ thuật với hình thức sản phẩm.~技術的な発明の保護を考える。
実用新案権~Bảo hộ sáng kiến về hình dạng, cấu trúc hoặc tổ hợp của vật phẩm.~物品の形状、構造、組合せに関する考案を保護する権利。~Xem xét sáng kiến cấu tạo của một dụng cụ.~器具の構造に関する考案の保護を考える。
意匠権~Bảo hộ thiết kế thẩm mỹ được đăng ký theo phạm vi pháp luật.~法律の対象となる登録されたデザインを保護する権利。~Bảo vệ kiểu dáng sản phẩm khác với tên nhãn hiệu.~商品のデザインをブランド名とは別に保護する。
商標権~Bảo hộ dấu hiệu dùng phân biệt hàng hóa hoặc dịch vụ.~商品やサービスを識別する登録商標を保護する権利。~Tên và biểu tượng thương hiệu cần phân biệt với phát minh.~ブランドの名称やマークを保護する。
営業秘密~Thông tin hữu ích, được quản lý bí mật và chưa công khai.~有用性、秘密管理性、非公知性を満たす情報。~Bí quyết phải có đủ ba điều kiện, không chỉ gọi là bí mật.~ノウハウは秘密と呼ぶだけでなく三要件を満たす必要がある。
秘密管理性~Thông tin được quản lý để nhận biết là bí mật.~秘密として管理されているという要件。~Hạn chế truy cập và thể hiện thông tin được quản lý bí mật.~アクセスを制限し秘密情報と分かるように管理する。
有用性~Thông tin hữu ích cho sản xuất hay hoạt động kinh doanh.~生産方法など事業活動に役立つという要件。~Bí quyết có giá trị sử dụng trong công việc.~業務に活用できる価値のある情報。
非公知性~Thông tin không được biết công khai.~公然とは知られていないという要件。~Nội dung chưa phổ biến công khai trên thị trường.~世間に一般公開されていない情報。
不正アクセス禁止法~Luật quy định cấm truy cập trái phép và các hành vi liên quan theo điều kiện luật.~不正なアクセスなどを禁止する法律。~Dùng trái phép thông tin xác thực của người khác để đăng nhập.~他人の認証情報を無断で利用してログインする。
個人情報~Thông tin về cá nhân còn sống có thể định danh, kể cả qua đối chiếu dễ dàng.~生存する個人を識別できる情報で容易な照合によるものも含む。~Mã nội bộ có thể dễ nối tới tên người vẫn cần xem xét.~社内コードでも氏名へ容易に照合できる場合を考える。
個人データ~Thông tin cá nhân cấu thành cơ sở dữ liệu thông tin cá nhân.~個人情報データベース等を構成する個人情報。~Thông tin trong danh sách khách được tổ chức để tìm kiếm.~検索できる顧客データベースに含まれる個人情報。
雇用契約~Người lao động được bên sử dụng lao động tuyển và chỉ đạo.~労働者が雇用主に雇われ指揮命令を受ける契約。~Công ty trực tiếp tuyển người và giao việc hằng ngày.~会社が直接雇用し仕事を指示する。
労働者派遣~Bên phái cử tuyển dụng, bên tiếp nhận chỉ đạo công việc.~派遣元が雇用し派遣先が指揮命令する形態。~Phân biệt ai thuê người với ai giao việc trực tiếp.~雇用する会社と現場で指示する会社が異なる。
請負契約~Hợp đồng lấy hoàn thành công việc làm đối tượng; bên nhận quản lý thực hiện.~仕事の完成を目的とし、請負側が作業を管理する契約。~Bên đặt yêu cầu kết quả, không trực tiếp chỉ huy nhân viên bên nhận.~注文者は成果を求め、請負者側が担当者を指揮する。
守秘義務~Nghĩa vụ không tiết lộ thông tin thuộc phạm vi cam kết hoặc quy định.~契約や規則の対象となる秘密を漏らさない義務。~Đã tham gia dự án thì không tự công bố dữ liệu khách hàng.~業務で知った顧客の秘密を勝手に公開しない。
ライセンス~Điều kiện cho phép sử dụng quyền hoặc phần mềm.~権利やソフトウェアの利用を認める条件。~Miễn phí tải về không có nghĩa được làm mọi việc tùy ý.~無料で入手できても利用条件を確認する。
標準化~Thống nhất quy tắc và đặc tính để tăng tương thích và sử dụng chung.~互換性や共通利用のため規則や仕様を揃えること。~Các tổ chức dùng cùng chuẩn để sản phẩm phối hợp được.~共通仕様によって異なる製品を連携させる。
'''
