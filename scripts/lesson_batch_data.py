"""Bilingual, source-grounded concepts and application examples for FE lessons."""

# term ~ explanation (vi) ~ explanation (ja) ~ application (vi) ~ application (ja)
DATA = {}
DATA[23] = '''
ファイル~Đơn vị lưu dữ liệu có tên; thư mục dùng để tổ chức các file.~名前を付けて保存するデータの単位。ディレクトリはファイルを整理する。~Một văn bản được lưu với tên note.txt.~文書をnote.txtという名前で保存する。
ディレクトリ~Vùng tổ chức file và thư mục con theo cây.~ファイルと下位ディレクトリを整理する入れ物。~Tạo nhóm chứa nhiều báo cáo và các nhóm con theo năm.~報告書と年別の下位フォルダをまとめる。
ルートディレクトリ~Thư mục ở đỉnh cây hệ thống file.~ディレクトリの木構造の最上位。~Bắt đầu lần theo cây từ vị trí cao nhất, không có thư mục cha trong cây.~親を持たない木構造の最上位からたどる。
カレントディレクトリ~Thư mục làm mốc hiện tại khi xử lý đường dẫn tương đối.~相対パスの基準になる現在のディレクトリ。~Cùng một đường dẫn tương đối cho kết quả khác khi đổi nơi đang làm việc.~作業場所を変えると同じ相対パスの参照先が変わる。その基準。
絶対パス~Chỉ vị trí từ gốc; không phụ thuộc thư mục hiện tại.~ルートを基準に位置を指定し、現在位置に依存しない。~Dùng /home/user/a.txt theo mô hình dấu / trong sách.~教材の表記で/home/user/a.txtを指定する。
相対パス~Chỉ vị trí từ thư mục hiện tại.~現在のディレクトリを基準に位置を指定する。~Đang ở /home/u, dùng docs/a.txt để tới file con.~/home/uからdocs/a.txtと指定する。
.（ドット）~Trong đường dẫn, dấu chấm biểu diễn thư mục hiện tại.~パスの中で現在のディレクトリを表す。~Dùng ./a.txt để chỉ file a.txt ngay nơi đang đứng.~現在位置のa.txtを./a.txtと指定する。
..（ドット2個）~Trong đường dẫn, hai chấm biểu diễn thư mục cha.~パスの中で1階層上を表す。~Từ /a/b muốn quay về /a trước khi vào c.~/a/bから1階層上の/aへ戻る記号。
階層構造~Thư mục có quan hệ cha–con, tạo thành cấu trúc phân cấp.~親子関係を持つディレクトリで階層的に整理する。~Một cây có gốc, bên dưới là phòng ban, bên dưới nữa là dự án.~ルートの下に部門、その下に案件を置く。
ファイルシステム~Cơ chế OS quản lý file, thư mục và việc lưu trữ.~OSがファイルやディレクトリの保存を管理する仕組み。~Ứng dụng gọi OS lưu và tìm file thay vì tự quản lý từng vị trí trên đĩa.~アプリがOSの仕組みを通じてファイルを保存・検索する。
フルバックアップ~Sao lưu toàn bộ dữ liệu trong phạm vi đã chọn.~対象のデータ全体をバックアップする。~Mỗi tối chép toàn bộ tập dữ liệu, kể cả phần không đổi.~変更の有無によらず毎晩すべてを保存する。
差分バックアップ~Sao lưu phần thay đổi kể từ lần full gần nhất.~直近のフルバックアップ以降の変更を保存する。~Full Chủ nhật; bản thứ Ba chứa thay đổi cả thứ Hai và thứ Ba.~日曜に全体保存し、火曜には月火の変更をまとめて保存する。
増分バックアップ~Sao lưu phần thay đổi kể từ lần sao lưu trước.~直前のバックアップ以降の変更を保存する。~Full Chủ nhật; thứ Ba chỉ lưu thay đổi sau bản thứ Hai.~日曜に全体保存し、火曜には月曜の保存後の変更だけを保存する。
差分からの復旧~Trong chuỗi chuẩn: dùng full gần nhất và bản differential mới nhất.~通常の差分系列では、直近の全体保存と最新の差分を使う。~Có full F và các bản D1,D2,D3; cần F và D3 để khôi phục mốc D3.~全体Fと差分D1,D2,D3がある。D3時点へはFとD3を使う。
増分からの復旧~Dùng full và tất cả bản incremental tiếp sau tới mốc muốn phục hồi.~全体保存と、その後の必要な増分を順に適用する。~Có full F và tăng dần I1,I2,I3; cần đủ chuỗi tới I3.~全体Fと増分I1,I2,I3から、順に全部適用してI3時点へ戻す。
バックアップ~Bản sao để khôi phục khi dữ liệu gốc bị mất hoặc hỏng.~元データの消失や破損に備えて保存する複製。~Dữ liệu gốc bị hỏng; dùng bản sao đã lưu để phục hồi.~元データが壊れ、事前に作った複製から復旧する。
パス~Chuỗi chỉ vị trí file hoặc thư mục trong hệ thống file.~ファイルやディレクトリの位置を示す文字列。~Cần diễn đạt vị trí bằng chuỗi tên thư mục và file.~ディレクトリとファイルの名前の列で位置を指定する。
ホームディレクトリ~Thư mục gắn với người dùng, thường là vị trí ban đầu khi đăng nhập.~ユーザーに割り当てられ、通常ログイン直後の基準になる場所。~Sau khi đăng nhập, người dùng bắt đầu trong thư mục riêng của mình.~ログイン後、ユーザー固有の場所から作業を始める。
区切り文字 /~Theo quy ước ví dụ trong sách, dấu / ngăn các thành phần đường dẫn.~教材のパス例では/でディレクトリやファイル名を区切る。~Tách a, b, c.txt trong /a/b/c.txt theo ký hiệu nào?~/a/b/c.txtで各名前を区切る記号。
相対パスの解決~Ghép đường dẫn tương đối với mốc thư mục hiện tại rồi xử lý . và ..~相対パスを現在位置に合わせ、.と..をたどって参照先を得る。~Đang ở /a/b, đường ../c/x.txt dẫn tới /a/c/x.txt.~現在/a/bで../c/x.txtをたどり、/a/c/x.txtを得る処理。
'''

DATA[25] = '''
GUI~Giao diện thao tác bằng thành phần đồ họa như nút và biểu tượng.~ボタンやアイコンなどの図形を使うインタフェース。~Nhấn biểu tượng thư mục để mở thay vì gõ lệnh.~コマンドではなくフォルダのアイコンをクリックして開く。
CUI~Giao diện dùng lệnh ký tự nhập bằng bàn phím.~文字によるコマンドを入力して操作するインタフェース。~Người vận hành gõ một dòng lệnh để thực hiện thao tác.~操作するために文字のコマンド行を入力する。
ラジオボタン~Chọn một mục trong nhóm các lựa chọn loại trừ nhau.~同じグループから1つを選ぶ部品。~Chọn duy nhất một phương thức thanh toán trong nhóm.~支払方法を同じグループ内で1つだけ選ぶ。
チェックボックス~Cho phép chọn độc lập nhiều mục.~複数項目を独立して選択できる部品。~Chọn cùng lúc nhận email và nhận thông báo ứng dụng.~メール通知とアプリ通知を同時に選ぶ。
プルダウンメニュー~Mở danh sách để chọn một mục đã có.~開いた一覧から用意された項目を選択する部品。~Mở danh sách tỉnh và chọn một tỉnh, không nhập mục mới.~県名の一覧を開き、既存の1項目を選ぶ。
コンボボックス~Kết hợp chọn từ danh sách với nhập văn bản.~一覧からの選択と文字入力を組み合わせた部品。~Có thể chọn tên đã có hoặc gõ tên khác vào cùng ô.~一覧の名前を選ぶことも別の名前を入力することもできる。
ユーザビリティ~Mức dễ sử dụng trong bối cảnh, mục tiêu và nhóm người dùng cụ thể.~特定の利用者・状況・目標における使いやすさ。~Đánh giá người mới có hoàn thành tác vụ đúng, nhanh và hài lòng không.~初心者が正しく効率よく満足して作業できるかを評価する。
効果~Tính chính xác và đầy đủ khi đạt mục tiêu.~目標達成の正確性と完全性。~Đo tỷ lệ người hoàn tất đơn hàng đúng, không thiếu bước.~注文を正しく最後まで完了できた割合を測る。
効率~Nguồn lực tiêu tốn so với kết quả đạt được.~達成した結果に対して費やす資源。~Cùng đạt mục tiêu nhưng đo thời gian hoặc số thao tác cần dùng.~同じ目的を達成する時間や操作数を調べる。
満足~Cảm nhận khi nhu cầu và kỳ vọng được đáp ứng.~利用によりニーズや期待が満たされたときの受け止め方。~Hỏi người dùng có thấy thoải mái với trải nghiệm hay không.~使った後の快適さや期待の充足を利用者に尋ねる。
ユーザビリティテスト~Quan sát người dùng thực hiện tác vụ với sản phẩm.~利用者に実際に操作してもらい、その様子を観察する。~Mời người dùng tìm một mặt hàng và ghi lại nơi họ gặp khó.~利用者に商品を探してもらい、つまずきを観察する。
ヒューリスティック評価~Chuyên gia đánh giá dựa trên kinh nghiệm và nguyên tắc.~専門家が知識・経験に基づいて使いやすさを評価する。~Một chuyên gia kiểm tra giao diện theo nguyên tắc, không tổ chức phiên dùng thử.~専門家が経験則で画面を点検する。
ログデータ分析~Dùng nhật ký thao tác để tìm xu hướng sử dụng.~操作やアクセスの記録を分析して利用傾向をつかむ。~Phân tích chuỗi nhấp chuột đã ghi để tìm bước nhiều người bỏ dở.~記録済みクリック履歴から離脱の多い箇所を探す。
論理チェック~Kiểm tra tính hợp lý của giá trị hoặc quan hệ dữ liệu.~値や項目間の論理的な妥当性を調べる。~Ngày kết thúc không được trước ngày bắt đầu.~終了日が開始日より前になっていないか調べる。
フォーマットチェック~Kiểm tra dữ liệu có theo khuôn dạng quy định.~入力値が定めた形式に合うかを調べる。~Một trường yêu cầu đúng tám chữ số, nhưng người dùng nhập chữ cái.~8桁の数字欄に文字が入っていないか調べる。
重複チェック~Kiểm tra trùng lặp tại trường phải duy nhất.~一意であるべき値が重複していないか調べる。~Phát hiện hai chứng từ có cùng một mã phải duy nhất.~一意の伝票番号が2件に重複していないか調べる。
シーケンスチェック~Kiểm tra dữ liệu theo đúng thứ tự quy định.~値が定めた順序に並んでいるか調べる。~Danh sách số chứng từ phải tăng dần nhưng xuất hiện số nhỏ hơn số trước.~昇順の伝票番号に逆順が混じっていないか調べる。
Undo~Hủy thao tác trước để quay về trạng thái cũ.~直前の操作を取り消して元へ戻す。~Người dùng vừa xóa nhầm một đoạn và muốn khôi phục thao tác trước.~直前に誤って消した文章を操作前へ戻す。
ユニバーサルデザイン~Thiết kế để nhiều người có thể sử dụng bất kể khác biệt về tuổi, khả năng hoặc ngôn ngữ.~年齢・能力・言語などの違いによらず多くの人の利用を目指す設計。~Ngay từ đầu sản phẩm được thiết kế cho nhóm người đa dạng thay vì chỉ sửa một rào cản riêng.~初めから幅広い利用者を想定して設計する。
Webアクセシビリティ~Mức mọi người có thể tiếp cận và sử dụng nội dung Web.~身体的条件や年齢によらずWebへアクセスし内容を利用できる度合い。~Kiểm tra nội dung trang có sử dụng được bằng công nghệ hỗ trợ.~支援技術を利用する人もWebの内容を使えるか確認する。
'''

DATA[26] = '''
ビットマップフォント~Lưu hình chữ bằng tập điểm ảnh.~文字の形をドットの集まりで保存するフォント。~Phóng to mẫu chữ dựa trên lưới điểm và thấy bậc thang rõ.~ドットで保存した文字を拡大すると輪郭の段差が目立つ。
アウトラインフォント~Lưu đường viền chữ bằng dữ liệu đường cong và tọa độ.~文字の輪郭を曲線や座標データで保持する。~Cần phóng chữ ở nhiều tỷ lệ mà đường cong vẫn mượt.~文字を任意倍率で拡大して滑らかに表示したい。
ラスタライズ~Chuyển biểu diễn đường nét thành điểm ảnh để hiển thị.~輪郭などの情報を表示用のドットへ変換する。~Trước khi hiện font đường viền, máy chuyển nó thành lưới pixel.~アウトライン文字を表示直前にドットへ変換する。
標本化~Lấy giá trị tín hiệu ở các khoảng thời gian đều nhau.~一定の時間間隔で信号を取り出す。~Đo biên độ âm thanh 8000 lần mỗi giây.~音の振幅を毎秒8000回測る。
量子化~Gán giá trị mẫu vào các mức biên độ rời rạc.~標本の振幅を離散的な数値の段階に対応付ける。~Giá trị đo được được làm tương ứng với một trong 256 mức.~測定した振幅を256段階のいずれかに対応させる。
符号化~Biểu diễn giá trị đã lượng tử hóa thành chuỗi bit.~量子化された値をビット列にする。~Mức biên độ được viết thành một chuỗi 0 và 1.~振幅の段階値を0と1の列で表す。
PCM~Số hóa âm thanh theo thứ tự lấy mẫu, lượng tử hóa, mã hóa.~標本化・量子化・符号化で音をデジタル化する方式。~Một quy trình lần lượt lấy mẫu rồi gán mức và tạo bit.~サンプリングし、段階値を付け、ビット列へ変える一連の方式。
標本化周波数~Số mẫu lấy trong một giây, tính bằng Hz.~1秒当たりに取り出す標本の数。単位はHz。~Thông số 44,1 kHz cho biết 44100 mẫu mỗi giây.~44.1 kHzという設定で毎秒44100個の標本を得る。
量子化ビット数~Số bit cho mỗi mẫu, b bit biểu diễn tối đa 2 mũ b mức.~1標本のビット数。bビットなら2のb乗段階を表せる。~Dùng 8 bit để biểu diễn mỗi mẫu nên có 256 mức.~各標本を8ビットで表し、256段階を区別する。
チャネル数~Số kênh âm thanh riêng, mono là một và stereo là hai trong bài tính.~独立した音声の数。モノラルは1、ステレオは2。~Giữ mọi thông số khác, thu hai kênh thay cho một làm dữ liệu gấp đôi.~条件を固定してモノラルからステレオへ変えると容量が2倍になる要因。
非圧縮音声容量~Số byte bằng tần số mẫu nhân bit/mẫu nhân số kênh nhân giây rồi chia 8.~バイト数＝標本化周波数×ビット数×チャネル数×秒数÷8。~8 kHz, 8 bit, mono, 10 giây: 80000 byte, bỏ qua header.~8 kHz・8ビット・モノラル10秒で、ヘッダなし80000バイトを求める式。
非圧縮画像容量~Số byte bằng ngang nhân dọc nhân bit/pixel rồi chia 8, cho một ảnh không nén.~非圧縮1画像のバイト数＝横×縦×ビット/画素÷8。~100 × 100 pixel, 24 bit/pixel cần 30000 byte, bỏ qua header.~100×100画素・24ビットで、ヘッダなし30000バイトを求める式。
可逆圧縮~Giải nén phục hồi chính xác dữ liệu ban đầu.~伸長で元データを完全に復元できる圧縮。~Một file cần sau khi giải nén phải giống từng bit như lúc đầu.~展開後に元のビット列を完全に再現する必要がある。
不可逆圧縮~Không bảo đảm phục hồi chính xác toàn bộ dữ liệu ban đầu.~元データの完全復元を保証しない圧縮。~Bỏ thông tin hình ảnh để giảm dung lượng và không lấy lại đủ dữ liệu gốc.~画像情報の一部を捨て、完全には元へ戻せない。
JPEG~Định dạng ảnh tĩnh thường dùng nén mất mát trong phạm vi tài liệu.~教材では静止画の非可逆圧縮形式として扱う。~Chọn ảnh chụp được nén bằng định dạng ảnh mất mát tiêu biểu trong nguồn.~教材の代表的な非可逆圧縮の写真形式を選ぶ。
PNG~Định dạng ảnh tĩnh nén không mất mát trong tài liệu.~教材の静止画形式で可逆圧縮を使う。~Chọn trong JPEG, PNG và MPEG một định dạng ảnh giữ nguyên dữ liệu khi giải nén.~JPEG・PNG・MPEGから静止画の可逆形式を選ぶ。
クリッピング~Giữ phần ảnh nằm trong vùng hiển thị đã chọn và loại phần ngoài vùng.~指定した表示領域の外側を切り取る処理。~Chỉ hiển thị phần hình nằm trong khung cửa sổ.~ウィンドウ枠内の図形部分だけを表示する。
アンチエイリアシング~Giảm cảm giác răng cưa ở biên bằng điều chỉnh màu các điểm biên.~境界の画素の色を調整し、輪郭のギザギザを目立ちにくくする。~Đường chéo trên lưới điểm nhìn bậc thang; làm mượt biên.~画素上の斜線の段差を目立ちにくくする。
テクスチャマッピング~Áp hình ảnh bề mặt lên vật thể đồ họa ba chiều.~3次元物体の表面に画像を貼り付ける。~Gắn ảnh vân gỗ lên mô hình bàn 3D.~3Dの机の表面に木目画像を貼る。
フレームレート~Số khung hình trong một giây của video.~動画で1秒当たりに表示するフレーム数。~Video hiển thị 30 ảnh liên tiếp mỗi giây được mô tả bằng 30 fps.~動画が毎秒30枚の画像を表示するという指標。
'''

DATA[29] = '''
データベース~Dữ liệu được tổ chức để dùng chung và quản lý nhất quán.~共同利用し、一貫して管理できるよう整理されたデータの集まり。~Các phòng ban dùng chung một tập thông tin khách hàng được quản lý tập trung.~各部門が集中管理された顧客情報を共用する。
DBMS~Phần mềm quản lý và cung cấp chức năng thao tác cơ sở dữ liệu.~データベースを管理し、操作機能を提供するソフトウェア。~Ứng dụng nhờ một phần mềm lưu, truy vấn và kiểm soát truy cập dữ liệu.~保存・検索・アクセス制御をアプリに提供するソフトを使う。
関係データベース~Tổ chức dữ liệu theo các quan hệ biểu diễn dạng bảng.~データを表形式の関係として管理するモデル。~Dữ liệu đơn hàng và khách hàng được biểu diễn bằng các bảng liên hệ.~注文と顧客を相互に関連する表で管理する。
レコード~Một hàng gồm các giá trị thuộc tính của một đối tượng hay sự kiện.~1件分の属性値をまとめた表の行。~Trong bảng học sinh, một hàng chứa mã, tên và lớp của một em.~生徒表の1人分の番号・名前・組の並び。
属性~Một cột biểu diễn loại thông tin của các hàng.~表の列で、各行が持つ情報の種類を表す。~Cột ngày sinh chứa cùng loại thông tin cho tất cả học sinh.~全生徒について生年月日を保持する列。
ドメイン~Tập giá trị mà một thuộc tính có thể nhận.~ある属性が取り得る値の集合。~Một thuộc tính được phép nhận số nguyên từ 1 đến 12.~ある列に1から12までの整数だけを許す、その値の集合。
主キー~Khóa được chọn để xác định duy nhất hàng, không trùng và không NULL.~行を一意に識別するため選んだキー。重複とNULLを許さない。~Chọn mã học sinh duy nhất và luôn có giá trị để xác định từng hàng.~重複せず必ず値がある生徒番号で各行を識別する。
複合キー~Khóa tạo từ sự kết hợp nhiều thuộc tính.~複数の属性を組み合わせたキー。~Chỉ cặp mã trường và mã học sinh mới xác định duy nhất một em.~学校番号と生徒番号の組合せで初めて1人を特定できる。
候補キー~Tập thuộc tính tối thiểu có thể xác định duy nhất hàng.~行を一意に識別でき、不要な属性を含まない属性集合。~Có hai mã riêng đều duy nhất; mỗi mã đều đủ điều kiện được chọn làm khóa chính.~2種類の番号がそれぞれ単独で行を一意に識別できる。
外部キー~Thuộc tính dùng để tham chiếu khóa của bảng liên quan.~関連する表のキーを参照するための属性。~Bảng đơn hàng lưu mã khách để liên hệ tới bảng khách hàng.~注文表の顧客番号から顧客表を参照する。
参照整合性~Ràng buộc không tạo tham chiếu tới hàng đích không tồn tại; xét quy tắc NULL riêng.~存在しない参照先を指さないようにする制約。NULLの可否は別に定める。~Không cho tạo đơn hàng có mã khách không tồn tại trong bảng khách.~顧客表にない顧客番号の注文を登録させない。
NULL~Biểu diễn thiếu hoặc chưa xác định giá trị, không đồng nghĩa số 0 hay chuỗi rỗng.~値が不明・未設定であることを表し、0や空文字とは異なる。~Chưa biết số điện thoại của khách và không nhập số 0 thay cho thông tin chưa biết.~顧客の電話番号が不明で、0とは別に扱う。
E-R図~Sơ đồ mô tả thực thể và các quan hệ trong mô hình dữ liệu.~実体と実体間の関連を示す図。~Trước khi tạo bảng, vẽ khách hàng liên hệ với đơn hàng như thế nào.~表を作る前に顧客と注文の関連を図で表す。
エンティティ~Đối tượng hoặc loại sự vật được quản lý trong mô hình E-R.~E-Rモデルで管理対象となる実体。~Trong mô hình bán hàng, khách hàng và đơn hàng là các loại đối tượng quản lý.~販売モデルで顧客や注文を管理対象として扱う。
リレーションシップ~Sự liên hệ giữa các thực thể trong E-R.~E-Rモデルにおける実体間の関連。~Một khách hàng đặt đơn hàng; quan hệ đặt nối hai loại thực thể.~顧客が注文を行うという実体間のつながり。
1対多~Một phía có thể liên hệ nhiều hàng phía kia; mỗi hàng phía kia thuộc một phía đầu.~一方の1件に他方の複数件が対応し、逆側は1件へ対応する。~Giả thiết mỗi đơn chỉ có một khách, một khách có thể đặt nhiều đơn.~各注文は1人の顧客に属し、1人は複数注文できるとする。
多対多~Cả hai phía đều có thể liên hệ nhiều đối tượng phía còn lại.~双方の複数件が相手側の複数件と対応する。~Sinh viên học nhiều môn; mỗi môn có nhiều sinh viên.~学生は複数科目を履修し、科目には複数学生がいる。
中間テーブル~Bảng lưu các liên kết để biểu diễn quan hệ nhiều–nhiều trong mô hình quan hệ.~多対多の関連を関係表で表すため、対応の組を保存する表。~Tạo bảng đăng ký chứa cặp mã sinh viên và mã môn.~学生番号と科目番号の組を履修表に保存する。
射影~Chọn các cột của quan hệ theo ý nghĩa đại số quan hệ.~関係代数で必要な列を取り出す操作。~Từ bảng học sinh chỉ lấy cột mã và tên, không lấy địa chỉ.~生徒表から番号と名前の列だけを取り出す操作。
選択~Lấy các hàng thỏa điều kiện theo ý nghĩa đại số quan hệ.~関係代数で条件に合う行を取り出す操作。~Từ bảng học sinh chỉ lấy những hàng thuộc lớp A.~生徒表からA組の行だけを取り出す操作。
'''

DATA[30] = '''
正規化~Tổ chức và phân tách bảng để giảm dư thừa và bất thường khi cập nhật.~重複や更新時の矛盾を減らすために表を整理・分解する。~Tên khách lặp trên nhiều dòng; cần thiết kế để sửa tên chỉ một nơi.~顧客名の重複を減らし、1箇所で修正できるよう表を設計する。
関数従属~X → Y nghĩa là một giá trị X xác định duy nhất Y theo quy tắc nghiệp vụ.~X→YはXが決まるとYも一意に決まるという業務上の関係。~Quy định mỗi mã nhân viên có đúng một tên hiện hành.~社員番号が決まれば現在の社員名が一意に決まるという規則。
完全関数従属~Phụ thuộc vào toàn bộ khóa kết hợp, không chỉ vào một phần thực sự của khóa.~複合キー全体に依存し、その一部分だけには依存しない関係。~Giả thiết điểm thi chỉ xác định bởi cả mã sinh viên và mã môn.~成績は学生番号と科目番号の両方をそろえて初めて決まる。
部分関数従属~Thuộc tính phụ thuộc vào một phần của khóa kết hợp.~属性が複合キーの一部分だけに依存する関係。~Khóa là mã đơn và mã hàng, nhưng tên hàng chỉ cần mã hàng.~キーは注文番号と商品番号だが、商品名は商品番号だけで決まる。
推移的関数従属~Khóa xác định thuộc tính trung gian rồi thuộc tính trung gian xác định thuộc tính khác.~キーから中間属性を経由して別の属性が決まる関係。~Mã nhân viên → mã phòng → tên phòng, theo các quy tắc đã cho.~社員番号→部門番号→部門名という規則がある。
第1正規形~Các ô chứa một giá trị trong phạm vi mô hình, không có nhóm lặp ở cấu trúc bảng.~各項目を単一の値とし、繰返し項目を整理した形。~Một ô chứa danh sách mã hàng; tách thành các hàng riêng để bỏ nhóm lặp.~1項目の商品番号リストを行へ分けて繰返しをなくす。
第2正規形~Đạt 1NF và loại phụ thuộc bộ phận của thuộc tính không khóa vào khóa kết hợp.~第1正規形から、非キー属性の部分関数従属を取り除く。~Từ chi tiết đơn hàng 1NF, tách tên hàng chỉ phụ thuộc mã hàng khỏi khóa kép.~第1正規形の明細から、商品番号だけに依存する商品名を分離する段階。
第3正規形~Trong bài cơ bản: đạt 2NF và loại phụ thuộc bắc cầu của thuộc tính không khóa vào khóa.~基本問題では第2正規形から非キー属性の推移的従属を取り除く。~Bảng nhân viên đã 2NF; tách tên phòng phụ thuộc vào mã phòng không khóa.~第2正規形の社員表から、非キーの部門番号に依存する部門名を分離する段階。
更新時異常~Cùng một sự thật lặp nhiều nơi nên sửa không đồng bộ tạo mâu thuẫn.~同じ事実を複数箇所に持ち、一部だけ更新すると矛盾する問題。~Đổi tên phòng ở một hàng nhưng các hàng còn lại vẫn mang tên cũ.~部署名を1行だけ直したため、残りの行と食い違う。
挿入時異常~Không thể thêm một sự thật vì bị buộc có dữ liệu khác không liên quan.~他の事実がないため、本来保存したい事実を登録できない問題。~Bảng gộp đơn và hàng khiến không thể đăng ký hàng mới trước khi có đơn.~注文と商品を混在させた表で、注文なしの商品を登録できない。
削除時異常~Xóa một sự kiện làm mất cả một thông tin độc lập cần giữ.~ある事実の削除で、保持すべき別の事実まで失う問題。~Xóa đơn cuối cùng của một hàng khiến mất luôn thông tin tên hàng.~商品の最後の注文行を消すと、商品名まで失われる。
注文テーブル~Với các phụ thuộc đã cho, thông tin chỉ phụ thuộc mã đơn nên nằm ở bảng đơn.~注文番号だけで決まる注文日などを注文表へまとめる。~Mã đơn → ngày đặt và mã khách; lưu một hàng cho mỗi đơn.~注文番号→注文日・顧客番号なので、注文ごとに1行で保存する。
商品テーブル~Thông tin chỉ phụ thuộc mã hàng được lưu riêng theo mã hàng.~商品番号だけで決まる商品名などを別表で保存する。~Mã hàng → tên hàng; nhiều đơn cùng tham chiếu một hàng duy nhất.~商品番号→商品名を独立させ、複数注文から参照する。
注文明細テーブル~Theo giả thiết, khóa mã đơn và mã hàng xác định số lượng của dòng chi tiết.~仮定したキーである注文番号・商品番号の組が明細数量を決める。~Một đơn chứa mỗi mã hàng tối đa một dòng; cặp mã đơn và mã hàng quyết định số lượng.~1注文に同じ商品は1行だけとし、その組で数量を決める。
顧客テーブル~Thông tin phụ thuộc mã khách được lưu riêng để tránh lặp theo từng đơn.~顧客番号で決まる顧客名などを独立して保存する。~Mã đơn → mã khách → tên khách; tách phần mã khách và tên khách.~注文番号→顧客番号→顧客名から、後半の対応を独立させる。
部門テーブル~Mã phòng và tên phòng được lưu riêng khi mã phòng xác định tên.~部門番号→部門名を独立した表へまとめる。~Nhiều nhân viên cùng phòng; chỉ một nơi lưu tên của phòng đó.~同じ部署の社員が複数いても、部署名は部署ごとに1箇所へ置く。
結合による復元~Giữ thuộc tính liên kết để có thể nối các bảng đã tách lại đúng thông tin.~分解した表をキーなどで結び、元の対応を取り戻す。~Sau khi tách đơn và khách, dùng mã khách để lấy lại tên khách của từng đơn.~注文と顧客を分けた後、顧客番号で元の対応を得る。
主キーの確認~Xác định khóa dựa trên quy tắc định danh trước khi xét phụ thuộc bộ phận.~部分従属を判定する前に、業務規則からキーを確かめる。~Trước khi nói tên hàng phụ thuộc một phần, phải biết khóa chi tiết gồm cột nào.~部分従属を論じる前に、明細のキーが何かを確かめる。
業務規則の確認~Phụ thuộc hàm không được suy ra chỉ từ vài hàng dữ liệu tình cờ.~少数の偶然のデータ一致だけで関数従属を決めない。~Hai khách tình cờ cùng tên không chứng minh tên xác định được mã khách.~サンプルで名前が一致しても、名前→顧客番号という規則とは限らない。
段階的な分解~Làm theo thứ tự 1NF, 2NF, 3NF và kiểm tra các phụ thuộc ở mỗi bước.~第1・第2・第3正規形の順に依存関係を確かめて分解する。~Không chỉ chia bảng tùy ý; trước bỏ nhóm lặp, sau phụ thuộc bộ phận rồi bắc cầu.~任意に表を割らず、繰返し、部分従属、推移的従属の順で整理する。
'''

DATA[31] = '''
SELECT~Chỉ các biểu thức hoặc cột cần đưa ra kết quả.~結果に取り出す列や式を指定する。~Cần lấy cột name từ bảng Employee trong truy vấn SELECT name FROM Employee.~SELECT name FROM Employeeで出力列を指定する句。
FROM~Chỉ nguồn dữ liệu truy vấn như bảng.~検索元となる表などを指定する。~Trong SELECT name FROM Employee, xác định bảng được đọc.~SELECT name FROM Employeeで読取対象の表を指定する句。
WHERE~Lọc từng hàng trước khi nhóm và tổng hợp.~グループ化や集計の前に行を条件で絞る。~Chỉ giữ nhân viên có salary trên 100 trước khi tính tổng theo phòng.~部門集計の前にsalaryが100を超える行だけ残す。
DISTINCT~Loại hàng trùng trong kết quả theo các cột được chọn.~選択した列の組で結果の重複を取り除く。~Kết quả dept là A,A,B; cần xuất A,B mỗi giá trị một lần.~deptがA,A,Bのとき、結果をA,Bへまとめる指定。
ORDER BY~Sắp xếp các hàng kết quả theo cột hay biểu thức.~結果行を列や式の値で並べ替える。~Muốn liệt kê nhân viên theo salary tăng dần bằng salary ASC.~salary ASCにより結果の順序を指定する句。
GROUP BY~Gom các hàng có cùng giá trị khóa nhóm để tổng hợp.~同じグループ値の行をまとめて集計する。~Tính tổng salary riêng cho từng dept.~deptごとにsalaryを合計するために行をまとめる句。
HAVING~Lọc các nhóm sau bước tổng hợp.~集計後のグループを条件で絞る。~Sau khi tính tổng theo dept, chỉ giữ nhóm có SUM(salary) trên 300.~部門集計後、SUM(salary)が300を超えるグループだけ残す。
COUNT(*)~Đếm mọi hàng trong tập đang xét, kể cả hàng có cột NULL.~列のNULLに関係なく対象の行数を数える。~Bảng có ba hàng, một giá trị salary NULL; vẫn cần đếm đủ ba hàng.~3行のうちsalaryが1件NULLでも3を得たい。
NOT~Phủ định một điều kiện logic.~条件の真偽を反転する論理演算子。~Chọn các hàng không thỏa salary = 100 bằng NOT(salary = 100).~NOT(salary = 100)で等しくない行を選ぶ。
SUM(salary)~Tính tổng các salary không NULL.~NULLを除いたsalaryの合計を求める。~Salary là 100,200,300 và cần tổng 600.~salaryが100,200,300のとき、600を得る集計。
AVG(salary)~Tính trung bình trên các salary không NULL.~NULLを除いたsalaryの平均を求める。~Salary là 100,NULL,300; cần trung bình 200 thay vì chia cho ba.~salaryが100,NULL,300で、NULLを除いて平均200を求める。
MAX(salary)~Lấy giá trị salary lớn nhất không NULL.~NULL以外のsalaryの最大値を求める。~Salary là 100,200,300; cần tìm mức 300.~salaryが100,200,300の中から300を求める集計。
MIN(salary)~Lấy giá trị salary nhỏ nhất không NULL.~NULL以外のsalaryの最小値を求める。~Salary là 100,200,300; cần tìm mức 100.~salaryが100,200,300の中から100を求める集計。
表の結合~Ghép các bảng qua điều kiện tương ứng, ví dụ FROM E,D WHERE E.dept=D.dept.~FROM E,D WHERE E.dept=D.deptなど、条件に合う表の行を組み合わせる。~Từ hai bảng lấy cặp nhân viên và phòng có mã phòng khớp.~2表から部門番号が一致する社員と部門の組を取り出す。
BETWEEN~Kiểm tra giá trị nằm trong khoảng đóng gồm hai đầu mút.~両端を含む範囲内の値かを調べる。~Cần salary từ 100 tới 200 kể cả 100 và 200.~salaryが100以上200以下の行を選ぶ条件。
IN~Kiểm tra giá trị thuộc một danh sách đã nêu.~指定した一覧のいずれかの値に一致するか調べる。~Chọn dept có giá trị A hoặc B bằng dept IN (A,B).~deptがAまたはBという値の一覧に含まれるか調べる。
UPDATE~Cập nhật các giá trị ở hàng được chỉ định, SET nêu giá trị mới.~SETで指定した値へ対象行を更新する。~Đổi salary của nhân viên id = 1 thành 150.~id=1の社員のsalaryを150へ変更する命令。
DELETE~Xóa các hàng thỏa điều kiện, không phải thay giá trị cột.~条件に合う行を削除する。列の値の変更とは別。~Bỏ hàng nhân viên có id = 1 ra khỏi bảng.~id=1の社員行を表から削除する命令。
AND~Kết hợp điều kiện, đòi cả hai cùng đúng để hàng được chọn.~複数条件の両方が真である行を選ぶ。~Cần dept là A đồng thời salary lớn hơn 100.~deptがAかつsalaryが100を超える行を選ぶ論理演算子。
OR~Kết hợp điều kiện, nhận hàng khi ít nhất một điều kiện đúng.~少なくとも一方の条件が真である行を選ぶ。~Cần các hàng dept là A hoặc dept là B.~deptがAまたはBなら行を選ぶ論理演算子。
'''

DATA[32] = '''
トランザクション~Đơn vị gồm một chuỗi thao tác được quản lý như một xử lý hoàn chỉnh.~複数の操作を1つのまとまった処理として扱う単位。~Chuyển tiền gồm trừ tài khoản A và cộng tài khoản B, được quản lý chung.~送金の出金と入金を1つの処理単位として管理する。
原子性 Atomicity~Tất cả thao tác trong giao dịch hoàn tất hoặc tất cả bị hủy.~処理がすべて完了するか、すべて取り消される性質。~Chuyển tiền lỗi bước cộng nên phải hủy cả bước trừ đã làm.~送金の入金が失敗したため、出金も取り消して部分完了を残さない。
一貫性 Consistency~Giao dịch bảo toàn những quy tắc và ràng buộc hợp lệ của dữ liệu.~トランザクションの前後でデータの制約や整合性を保つ性質。~Sau giao dịch, các ràng buộc được định nghĩa của dữ liệu vẫn đúng.~処理後もデータベースに定義された整合性条件を満たす。
独立性 Isolation~Các giao dịch đồng thời được cách ly để không làm sai kết quả của nhau theo mô hình đang xét.~同時トランザクションが互いに不適切な影響を与えない性質。~Hai giao dịch đồng thời không được làm kết quả sai do đọc dữ liệu đang sửa dở.~並行する2処理が未完了の変更の影響で結果を壊さないようにする。
耐久性 Durability~Kết quả đã commit phải được giữ ngay cả sau sự cố thuộc mô hình bảo đảm.~確定した更新結果を、想定した障害後も保持する性質。~Đã báo commit thành công; sau khi khởi động lại do sự cố, dữ liệu đã xác nhận vẫn còn.~コミット済みの変更が障害後の再起動でも失われない。
COMMIT~Xác nhận các thay đổi của giao dịch.~トランザクションの変更を確定する。~Mọi bước đã thành công và ứng dụng yêu cầu xác nhận giao dịch.~全操作が成功し、変更を正式に確定する命令。
ROLLBACK~Hủy thay đổi của giao dịch chưa được xác nhận theo phạm vi rollback.~未確定のトランザクションの変更を取り消す。~Ứng dụng phát hiện lỗi trước commit và cần bỏ các cập nhật vừa làm.~コミット前のエラーで、その処理の更新を取り消す命令。
排他制御~Điều phối truy cập đồng thời để tránh các cập nhật xung đột.~同時アクセスを調整し、不正な更新競合を防ぐ。~Hai người sửa cùng số dư; cần cơ chế ngăn kết quả của người này ghi đè sai người kia.~同じ残高への競合更新で変更を失わないようアクセスを調整する。
共有ロック~Trong mô hình khóa cơ bản, nhiều giao dịch có thể cùng khóa đọc nhưng chặn khóa ghi xung đột.~基本ロックモデルでは複数の読取りで共用でき、競合する更新を防ぐ。~T1 đang đọc tài nguyên bằng khóa S; T2 cũng được lấy S trên cùng tài nguyên.~同じ資源にT1とT2が同時にSロックを取得する。
専有ロック~Khóa X không tương thích với khóa S hoặc X khác trên cùng tài nguyên trong mô hình cơ bản.~基本モデルで同じ資源の他のS・Xロックと両立しないロック。~T1 giữ X trên một hàng; T2 phải đợi khi muốn khóa S hay X hàng đó.~T1が行にXを保持し、T2のSもXも待たされる。
デッドロック~Các giao dịch chờ tài nguyên nhau thành vòng, không tự tiến tiếp.~互いの資源の解放を循環して待ち、先へ進めない状態。~T1 giữ A chờ B, T2 giữ B chờ A.~T1はAを保持してB待ち、T2はBを保持してA待ちになる。
ロック粒度~Kích thước đơn vị tài nguyên bị khóa, như một hàng hay cả bảng.~行や表など、ロック対象となるデータ単位の大きさ。~So sánh việc khóa một hàng với khóa cả bảng: đang thay đổi đặc tính nào?~1行をロックするか表全体をロックするかを比較する尺度。
行ロック~Khóa một hàng thường cho phép giao dịch khác dùng các hàng khác, nhưng tăng quản lý khóa.~行単位のロックは並行性を高めやすい一方、管理するロックが増える。~Chỉ cần sửa một hàng và muốn các giao dịch khác tiếp tục dùng hàng khác.~1行だけ更新し、他の行は別トランザクションが使えるようにする。
表ロック~Khóa toàn bảng có phạm vi lớn, quản lý ít đơn vị hơn nhưng dễ cản truy cập khác.~表全体を対象にし、管理は単純になるが競合範囲が大きい。~Thay vì hàng riêng lẻ, ngăn truy cập xung đột trên toàn bộ bảng.~個別の行ではなく表全体をまとめてロックする。
更新前ログ~Thông tin trạng thái trước cập nhật dùng để khôi phục giá trị cũ.~更新前の状態を記録し、変更取消しに用いる情報。~Cần lấy lại giá trị cũ khi hủy cập nhật thất bại.~失敗した変更を戻すため、変更前の値を使う。
更新後ログ~Thông tin sau cập nhật dùng khi làm lại các thay đổi cần phục hồi.~更新後の状態を記録し、変更の再実行に用いる情報。~Có backup và cần áp lại phần cập nhật đã xác nhận sau backup.~バックアップ後の確定済み更新を再適用するために使う情報。
ロールバック回復~Phục hồi bằng việc dùng trạng thái trước để bỏ cập nhật chưa hoàn tất.~更新前情報で未完了の更新を取り消して回復する。~Hệ thống bị lỗi giữa giao dịch; dùng log trước để hủy phần chưa xác nhận.~途中で異常終了した処理を更新前ログで取り消す回復方法。
ロールフォワード~Phục hồi từ backup rồi áp lại cập nhật sau đó bằng thông tin log cần thiết.~バックアップへ更新後情報を適用して先の状態へ回復する。~Thay ổ hỏng, nạp backup và phát lại các thay đổi đã xác nhận sau mốc đó.~故障媒体を交換し、バックアップから確定済み変更を再適用する。
ジャーナルファイル~Tên gọi khác trong tài liệu cho file log giao dịch.~教材でトランザクションのログファイルを指す呼び方。~Đề dùng tên journal để chỉ nơi giữ thông tin trước/sau cập nhật.~更新前後を保存するログをジャーナルと呼ぶ。
更新の消失~Hai giao dịch đọc cùng giá trị và ghi đè nhau khiến một thay đổi bị mất.~同じ値を読んだ並行更新が上書きし、一方の変更が失われる問題。~Cùng đọc 100, một bên cộng 20 và một bên cộng 30; kết quả 130 thay vì 150.~両者が100を読み、20と30を加えたのに上書きで130となる。
'''

DATA[33] = '''
AI~Khái niệm rộng về công nghệ tái tạo các hoạt động thông minh bằng máy tính.~知的な働きをコンピュータで実現する技術の広い概念。~Cần tên khái niệm bao trùm cả học máy và các cách xử lý thông minh khác.~機械学習などを含む知的処理全体の概念。
機械学習~Cho máy học từ dữ liệu để hình thành quy tắc dự đoán hoặc quyết định.~データから学習し、予測や判断に利用する技術。~Không viết hết mọi quy tắc mà dùng dữ liệu để học cách dự đoán.~全規則を手書きせず、データから予測方法を学ばせる。
教師あり学習~Học từ các cặp dữ liệu đầu vào và đáp án.~入力データと正解の組で学習する。~Email huấn luyện được kèm nhãn spam hoặc không spam.~訓練メールに迷惑メールか否かの正解を付ける。
教師なし学習~Tìm cấu trúc trong dữ liệu không có nhãn đáp án được cung cấp.~正解ラベルを与えず、データの構造や特徴を学ぶ。~Nhóm khách hàng theo nét giống nhau mà không đưa nhóm đúng từ trước.~正解のグループを与えず、似た顧客をまとめる。
強化学習~Học qua thử hành động và phần thưởng nhằm tăng phần thưởng.~行動と報酬の試行錯誤から、報酬を増やす行動を学ぶ。~Tác nhân chơi trò chơi nhận điểm sau hành động và cải thiện cách chơi.~ゲームで行動後の得点を使い、試行錯誤で戦略を改善する。
ニューラルネットワーク~Mô hình lấy cảm hứng từ liên kết tế bào thần kinh, dùng các đơn vị tính toán kết nối.~神経細胞のつながりを参考に、計算要素を接続したモデル。~Một mô hình gồm các nút kết nối, truyền và xử lý tín hiệu.~接続された計算ノードで信号を処理するモデル。
ディープラーニング~Học máy sử dụng mạng nơ-ron nhiều lớp.~多数の層を持つニューラルネットワークを用いる機械学習。~Dùng mạng nơ-ron xếp chồng nhiều lớp để học đặc trưng.~ニューラルネットワークを何層にも重ねて特徴を学ばせる。
分類~Với học có giám sát, dự đoán một nhãn rời rạc trong các lớp đã định.~教師ありの例では、定められた離散的なラベルを予測する。~Dùng mẫu có nhãn để quyết định email mới là spam hay thường.~ラベル付きデータから新規メールの迷惑・通常を予測する課題。
回帰~Với học có giám sát, dự đoán giá trị số.~教師ありの例で、数値の値を予測する。~Dùng ví dụ diện tích và giá nhà để dự đoán giá nhà mới.~面積と価格の正解データから新しい住宅価格を予測する課題。
クラスタリング~Gom các đối tượng giống nhau mà không cần nhóm đáp án cho sẵn.~正解の分類を与えず、似た対象をまとめる。~Không có nhãn nhóm; thuật toán chia hồ sơ khách theo mức giống nhau.~正解ラベルなしで顧客を特徴の類似度によりまとめる手法。
主キー~Trong phần ôn DB, khóa xác định duy nhất hàng và không NULL.~DB復習で、重複とNULLを許さず行を特定するキー。~Chọn một mã luôn có và không trùng để định danh bản ghi.~必ず値があり重複しない番号を行の識別子に選ぶ。
外部キー~Trong phần ôn DB, thuộc tính tham chiếu bảng liên quan.~DB復習で、関連表のキーを参照する属性。~Dữ liệu đơn chứa mã khách để liên hệ khách hàng.~注文に顧客番号を持たせ、顧客表へ関連付ける。
第1正規形~Bỏ nhóm lặp và biểu diễn giá trị đơn trong từng mục của mô hình bảng.~繰返しを整理し、各項目を単一の値にした形。~Trước khi xét các phụ thuộc, xử lý ô đang chứa danh sách nhiều mã.~従属を調べる前に、複数番号のリストを持つ項目を整理する段階。
第2正規形~Loại phụ thuộc bộ phận của thuộc tính không khóa khỏi khóa kết hợp sau 1NF.~第1正規形から非キー属性の部分従属を取り除く。~Khóa mã đơn và hàng; tên hàng chỉ phụ thuộc mã hàng, nên tách riêng.~注文・商品をキーとし、商品番号だけで決まる商品名を分ける段階。
第3正規形~Loại phụ thuộc bắc cầu của thuộc tính không khóa sau 2NF trong bài cơ bản.~基本問題で、第2正規形から非キー属性の推移的従属を取り除く。~Mã nhân viên quyết định mã phòng rồi tên phòng; tách tên phòng ra sau khi đã 2NF.~第2正規形の社員表から部門番号→部門名を分ける段階。
WHERE~Lọc hàng trước khi nhóm trong SQL.~SQLで集計前の行を絞る句。~Chỉ cộng các đơn có amount lớn hơn 0 bằng cách lọc từng đơn trước.~各注文のamountが0を超える行だけを集計前に残す。
HAVING~Lọc nhóm sau khi nhóm và tổng hợp.~SQLで集計後のグループを絞る句。~Chỉ giữ khách có tổng amount lớn hơn 100 sau GROUP BY.~GROUP BY後に合計額が100を超える顧客グループだけ残す。
原子性~Bảo đảm giao dịch hoặc hoàn tất tất cả hoặc hủy tất cả.~トランザクションを全部完了か全部取消しにする性質。~Nhập một lô dữ liệu theo giao dịch; khi một bước lỗi, hủy cả giao dịch.~データ登録を1取引とし、途中失敗なら全体を取り消す。
デッドロック~Chờ khóa theo vòng giữa các giao dịch.~トランザクション間でロック待ちが循環する状態。~T1 giữ A đợi B, T2 giữ B đợi A trong hệ DB.~DB処理でT1がAを持ちB待ち、T2がBを持ちA待ち。
ロールフォワード~Áp log sau cập nhật vào backup để phục hồi tiến tới trạng thái cần thiết.~バックアップに更新後ログを適用して回復する。~Sau sự cố đĩa, nạp backup rồi làm lại những cập nhật đã xác nhận.~媒体障害後、バックアップへ確定済み更新を再適用する。
'''

DATA[34] = '''
プロトコル~Quy tắc chung để các bên trao đổi dữ liệu.~通信する双方が従う共通の規則。~Hai máy khác nhà sản xuất cần thống nhất cách biểu diễn và trao đổi thông điệp.~メーカーが違う機器間でデータ交換の規則をそろえる。
LAN~Mạng kết nối trong phạm vi cục bộ như một cơ sở.~建物や拠点など比較的限られた範囲のネットワーク。~Kết nối máy tính và máy in trong cùng văn phòng.~同じ事業所内のPCやプリンタを接続するネットワーク。
WAN~Kết nối các mạng hoặc cơ sở qua phạm vi rộng.~離れた拠点など広い範囲を結ぶネットワーク。~Liên kết mạng của trụ sở với chi nhánh ở xa.~遠隔地の本社と支店のネットワークをつなぐ。
パケット交換~Chia dữ liệu thành gói để dùng chung mạng truyền.~データをパケットに分け、通信回線を共用する方式。~Nhiều luồng dữ liệu được chia gói và cùng đi qua mạng.~複数の通信がデータを小分けにして回線を利用する。
回線交換~Thiết lập một đường liên lạc cho phiên trước khi truyền.~通信前に回線を確保して接続する方式。~Mô hình liên lạc giữ một đường truyền đã thiết lập cho cuộc gọi.~通話の間、事前に確保した回線を使う方式。
OSI 7層~Mô hình tham chiếu chia chức năng truyền thông thành bảy lớp.~通信機能を7階層に分けた参照モデル。~Tách trách nhiệm từ tín hiệu vật lý lên chức năng ứng dụng theo bảy mức.~物理信号からアプリ機能まで7段階に分けて整理するモデル。
物理層~Lớp 1, xử lý truyền các bit dưới dạng tín hiệu vật lý.~第1層。ビットを物理的な信号として伝える。~Quan tâm đặc tính tín hiệu và truyền trên đường vật lý, chưa xét địa chỉ.~アドレスではなく信号と物理媒体の伝送を扱う層。
データリンク層~Lớp 2, truyền qua liên kết và xử lý khung trong phạm vi liên kết.~第2層。同一リンク上のフレーム転送を扱う。~Một thiết bị chọn chuyển tiếp khung theo địa chỉ MAC.~MACアドレスを使ってフレームを中継する機能の層。
ネットワーク層~Lớp 3, địa chỉ logic và chuyển tiếp giữa các mạng.~第3層。論理アドレスとネットワーク間の経路を扱う。~Cần chọn đường tới mạng đích theo địa chỉ IP.~IPアドレスで宛先ネットワークへの経路を選ぶ層。
トランスポート層~Lớp 4, cung cấp vận chuyển giữa các đầu cuối; TCP/UDP ở lớp này.~第4層。端末間の通信を扱い、TCPやUDPが属する。~Xét điều khiển vận chuyển của TCP giữa các tiến trình đầu cuối.~TCPによる端点間の転送機能を分類する層。
セッション層~Lớp 5, tổ chức và quản lý phiên trao đổi trong mô hình OSI.~第5層。通信のセッションの管理を扱う。~Phân loại chức năng quản lý phiên trao đổi theo mô hình bảy lớp.~7層モデルで通信セッションを管理する機能の層。
プレゼンテーション層~Lớp 6, biểu diễn dữ liệu như chuyển mã và cách trình bày.~第6層。データの表現形式や符号の変換を扱う。~Hai bên cần chuyển đổi dạng biểu diễn dữ liệu để hiểu cùng nội dung.~双方が理解できるようデータの表現形式を変換する層。
アプリケーション層~Lớp 7, chức năng giao tiếp phục vụ ứng dụng.~第7層。アプリケーションに通信サービスを提供する。~Xếp chức năng giao thức HTTP trong sơ đồ OSI.~OSIでHTTPの機能を位置付ける層。
TCP/IP 4層~Mô hình bốn lớp: ứng dụng, vận chuyển, Internet, giao tiếp mạng theo sách.~教材の4層はアプリケーション・トランスポート・インターネット・ネットワークインタフェース。~Gộp ba lớp trên OSI thành một lớp ứng dụng theo mô hình Internet của sách.~OSI上位3層をアプリ層にまとめる教材の通信モデル。
リピータ~Chuyển tiếp và định dạng lại tín hiệu ở lớp vật lý.~物理層で信号を再生・整形して中継する装置。~Thiết bị kéo dài đường truyền bằng xử lý tín hiệu, không tra MAC/IP.~MACやIPではなく、弱った信号を整えて中継する装置。
ブリッジ~Thiết bị lớp 2 quyết định chuyển tiếp theo địa chỉ MAC.~データリンク層でMACアドレスに基づき中継する装置。~Cầu nối hai đoạn mạng nhìn MAC để quyết định chuyển khung.~2つの区間をつなぎ、MACを見てフレーム中継を判断する装置。
L2スイッチ~Thiết bị nhiều cổng chuyển tiếp khung ở lớp 2.~複数ポートを持ち第2層でフレームを中継する装置。~Cần nhiều cổng chuyển tiếp trong LAN dựa theo MAC.~LANで複数ポートをMACに基づいて切り替える装置。
ルーター~Thiết bị lớp 3 chọn đường chuyển tiếp dựa trên địa chỉ IP.~ネットワーク層でIPアドレスに基づき経路を選ぶ装置。~Nối hai mạng IP khác nhau và chọn đường tới mạng đích.~異なるIPネットワークをつなぎ経路を選ぶ装置。
MACアドレス~Địa chỉ dùng trong chuyển tiếp liên kết dữ liệu; ví dụ Ethernet là 48 bit.~データリンク層で利用する識別子。教材のEthernet例は48ビット。~Thiết bị lớp 2 đọc trường địa chỉ đích trong khung Ethernet.~L2装置がEthernetフレームの宛先識別子を参照する。
ルーティング~Lựa chọn đường đi cho dữ liệu tới đích qua mạng.~宛先へ到達する経路を選択する処理。~Router so sánh thông tin mạng đích với bảng để chọn hướng chuyển tiếp.~ルータが宛先ネットワークから次の転送先を選択する処理。
'''

DATA[35] = '''
IPv4~Địa chỉ IP 32 bit, thường viết bằng bốn nhóm thập phân.~32ビットのIPアドレスで、通常4つの10進数で表す。~Địa chỉ 192.168.1.10 có bốn octet, mỗi octet 8 bit.~192.168.1.10のように8ビットずつ4区分で表す形式。
IPv6~Phiên bản IP với địa chỉ 128 bit.~128ビットのアドレスを持つIPの版。~So với 32 bit của IPv4, dùng không gian địa chỉ 128 bit.~IPv4の32ビットより大きい128ビットのアドレス形式。
ネットワーク部~Phần địa chỉ xác định mạng, được phân định bằng prefix/mask.~プレフィックスやマスクで定まる、所属ネットワークを表す部分。~Trong 192.168.1.10/24, 24 bit đầu chỉ mạng.~192.168.1.10/24で、先頭24ビットが表す部分。
ホスト部~Phần địa chỉ xác định host trong mạng theo prefix đã cho.~指定プレフィックス内でホストを区別する残りの部分。~Với /24 của IPv4, tám bit cuối phân biệt host.~IPv4の/24で、末尾8ビットに当たる部分。
サブネットマスク~Mẫu bit 1 cho phần mạng và 0 cho phần host trong mask liên tiếp chuẩn.~通常の連続マスクで、ネットワーク部を1、ホスト部を0とする値。~Dùng 255.255.255.0 để phân biệt phần mạng và host.~255.255.255.0によりネットワーク部とホスト部を分ける。
プレフィックス長 /n~Số bit mạng đầu địa chỉ trong ký hiệu CIDR.~先頭から何ビットをネットワーク部とするかを示す。~Ký hiệu /26 nghĩa là dùng 26 bit đầu cho phần mạng.~/26という表記で、先頭26ビットをネットワーク部にする。
ネットワークアドレス~Với subnet IPv4 thông thường, địa chỉ có toàn bộ bit host bằng 0.~通常のIPv4サブネットでホスト部がすべて0のアドレス。~192.168.1.10/24 thuộc mạng 192.168.1.0.~192.168.1.10/24に対して192.168.1.0を求める種類のアドレス。
ブロードキャストアドレス~Với subnet IPv4 thông thường, địa chỉ có toàn bộ bit host bằng 1.~通常のIPv4サブネットでホスト部がすべて1のアドレス。~Mạng 192.168.1.0/24 có địa chỉ đích toàn mạng là 192.168.1.255.~192.168.1.0/24で192.168.1.255となる種類のアドレス。
通常のホスト数~Với subnet IPv4 /30 trở xuống trong bài cơ bản: 2 mũ số bit host trừ 2.~基本問題の通常のIPv4サブネットでは、ホスト数は2のホストビット数乗から2を引く。~Subnet /26 có sáu bit host nên gán thông thường 62 host, không áp công thức cho /31 hay /32.~/26の6ホストビットから62を得る。/31・/32は対象外。
/24 のマスク~Prefix /24 tương ứng mask 255.255.255.0.~24個の連続した1で255.255.255.0となる。~Chuyển 11111111.11111111.11111111.00000000 sang dạng thập phân.~先頭24ビットが1のマスクを10進数へ直す。
/26 のマスク~Prefix /26 tương ứng mask 255.255.255.192.~26個の連続した1で255.255.255.192となる。~Octet cuối mask là 11000000, nên bằng 192.~マスク末尾が11000000で192となるプレフィックス。
/27 のブロック~Mạng /27 có khối 32 địa chỉ và 30 địa chỉ host thông thường.~/27は32アドレスの範囲で、通常のホストは30個。~Chia /24 thành tám subnet bằng nhau, mỗi subnet có 32 địa chỉ.~/24を8等分し、各区間を32アドレスにする場合の単位。
同一サブネット~Hai địa chỉ cùng subnet khi dùng cùng mask và có cùng địa chỉ mạng.~同じマスクで計算したネットワークアドレスが一致すること。~192.168.1.10/24 và 192.168.1.20/24 có cùng mạng.~192.168.1.10/24と192.168.1.20/24の関係。
論理積 AND~Phép toán từng bit của IP với mask để tìm địa chỉ mạng.~IPとマスクをビットごとにANDしてネットワークアドレスを得る。~Tính 192.168.1.130 AND 255.255.255.192 để có 192.168.1.128.~192.168.1.130とマスクのビット演算で192.168.1.128を得る方法。
TCP~Giao thức vận chuyển có kết nối, có cơ chế xác nhận và truyền lại để tăng độ tin cậy.~接続を確立し、確認応答や再送で信頼性を確保するトランスポートプロトコル。~Cần vận chuyển có xác nhận và khôi phục khi mất dữ liệu thay vì tự xử lý ở ứng dụng.~確認応答と再送を備える接続型の転送を使いたい。
UDP~Giao thức vận chuyển không kết nối; bản thân không bảo đảm truyền lại hay thứ tự nhận.~コネクションレスで、プロトコル自体は再送や到着順を保証しない。~Ứng dụng chọn chuyển datagram không có cơ chế truyền lại tự động của TCP.~TCPのような自動再送なしでデータグラムを送る。
ポート番号~Phân biệt ứng dụng hay dịch vụ ở đầu cuối vận chuyển.~トランスポート通信で端末内のアプリやサービスを識別する番号。~Một IP có nhiều dịch vụ, cần số để chỉ dịch vụ đích.~1つのIP上にある複数サービスの宛先を番号で区別する。
プライベートIP~Địa chỉ dùng trong phạm vi nội bộ; ví dụ các dải 10/8,172.16/12,192.168/16.~内部利用のためのアドレス。例は10/8、172.16/12、192.168/16。~192.168.10.5 là địa chỉ cấp trong mạng nội bộ, không phải địa chỉ công cộng toàn cầu.~192.168.10.5を組織内で使う場合のアドレス分類。
グローバルIP~Địa chỉ sử dụng để nhận diện trên Internet công cộng theo cơ chế cấp phát.~インターネット上での識別に用いる、公的に割り当てるアドレス。~Phân biệt địa chỉ công cộng được cấp với địa chỉ 192.168.x.x dùng nội bộ.~公的に割り当てるアドレスを192.168.x.xの内部用と区別する分類。
IPの役割~Địa chỉ logic và chuyển tiếp dữ liệu giữa mạng; tự IP không bảo đảm tin cậy như TCP.~論理アドレスとネットワーク間転送を担当し、TCPの信頼性機能とは別。~Cần phân biệt vai trò chuyển gói theo địa chỉ mạng với việc truyền lại của lớp vận chuyển.~ネットワーク宛先への転送と、トランスポート層の再送を区別する。
'''
