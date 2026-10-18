# Bật đăng nhập và đồng bộ cho FE Master

Dự án: `felesson`. Website dùng Firebase Authentication (Google) và Cloud Firestore. Không cần tạo mật khẩu riêng; lần đăng nhập Google đầu tiên tạo người dùng trong Firebase.

## 1. Bật Google

Mở https://console.firebase.google.com/project/felesson/authentication

- Chọn Get started nếu chưa khởi tạo Authentication.
- Sign-in method → Add new provider → Google → Enable.
- Chọn email hỗ trợ, rồi Save.
- Settings → Authorized domains: thêm `localhost`, `127.0.0.1` và `linhxteen3.github.io`. Nếu dùng tên miền khác, thêm tên miền đó (không có `https://` hay đường dẫn).

## 2. Tạo cơ sở dữ liệu

Mở https://console.firebase.google.com/project/felesson/firestore

- Create database → Standard edition → database ID `(default)`.
- Chọn vị trí gần người học, chẳng hạn Tokyo nếu có; kiểm tra lựa chọn trước khi xác nhận vì vị trí không đổi trực tiếp sau khi tạo.
- Chọn Production mode.
- Mở tab Rules, thay nội dung bằng toàn bộ file `firestore.rules` trong dự án, bấm Publish.

Không dùng quy tắc cho phép mọi người đọc/ghi. Quy tắc của dự án chỉ cho tài khoản đã đăng nhập truy cập `users/{uid}/progress` của chính tài khoản đó.

## 3. Kiểm tra bằng tài khoản thật

1. Tải lại website. Trong khung Tài khoản, bấm Đăng nhập bằng Google.
2. Chọn tài khoản. Đợi thông báo Đã đồng bộ với tài khoản.
3. Nếu có tiến độ học thử, bấm Nhập tiến độ học thử trên máy này khi muốn giữ nó trong tài khoản. Chỉ các mục tài khoản chưa có mới được nhập; dữ liệu học thử gốc vẫn giữ trên máy.
4. Làm vài câu, rồi mở website trên một trình duyệt hoặc thiết bị khác và đăng nhập cùng Google. Kiểm tra câu đang làm và các lựa chọn.
5. Nộp đủ câu: bài chuyển sang hoàn thành; điểm nằm riêng trong bản ghi `test-result:<số bài>`.
6. Đăng xuất, đổi tài khoản: người mới không thấy tiến độ của người trước.

## Cách giải thích dự án

- HTML/CSS tạo giao diện; JavaScript xử lý bài học và kiểm tra.
- Firebase Authentication xác nhận người đăng nhập Google, cung cấp mã người dùng (UID).
- Firestore lưu các bản ghi tiến độ bên dưới UID; quy tắc bảo mật kiểm tra UID trước khi cho đọc hoặc ghi.
- localStorage giữ bản làm trên máy và giữ lại thay đổi khi đồng bộ thất bại. Khi kết nối lại, người học bấm Thử kết nối lại.
- `assets/firebase-config.js` là cấu hình web công khai, không phải mật khẩu quản trị. Không đưa service account vào website.

## Giới hạn hiện tại

- Cùng một bài trên hai thiết bị: bản chỉnh sửa có thời gian mới hơn được giữ; không ghép từng đáp án từ hai bài đang làm song song. Đồng hồ thiết bị cần đúng.
- Điểm lưu là kết quả nộp gần nhất của mỗi bài, chưa có lịch sử mọi lần thi.
- Tiến độ tài khoản vẫn có bản lưu cục bộ để khôi phục. Trên máy dùng chung, đăng xuất và xóa dữ liệu website nếu không muốn giữ bản lưu đó.
- Kiểm tra trong `tests/account.cjs` dùng Firebase giả lập để kiểm tra luồng tài khoản. Việc đăng nhập Google, quy tắc đã Publish và đồng bộ thật cần kiểm tra sau khi bật dịch vụ trong Console.

Nguồn: [Google Sign-In](https://firebase.google.com/docs/auth/web/google-signin), [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/rules-conditions).
