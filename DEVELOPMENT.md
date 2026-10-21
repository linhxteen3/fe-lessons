# Chạy và hiểu FE Lessons

## Chạy website

Tại thư mục repo, chạy `python -m http.server 8000`, rồi mở
http://localhost:8000. Website dùng HTML/CSS/JavaScript thuần, không có bước build.
Không cần cài Node hay chạy script Python tạo bài để dùng website.

Trang chủ cần HTTP để tải `lessons.json` và `roadmap.json`. Các trang bài vẫn có
thể mở trực tiếp, nhưng đăng nhập và đồng bộ cần chạy qua website.

## Chạy kiểm tra

- `npm test`: kiểm tra danh mục, đường dẫn, dữ liệu câu hỏi và việc dùng mã quiz
  chung. Chỉ cần Node.js 22 trở lên; chưa cần cài thư viện.
- `npm install`: cài Playwright, chỉ phục vụ kiểm tra lúc phát triển.
- `npx playwright install msedge`: cài Microsoft Edge nếu máy chưa có.
- `npm run test:browser`: chạy lần lượt các kiểm tra trình duyệt có sẵn, gồm quiz,
  lưu bài đang làm, ngôn ngữ, giao diện điện thoại và tài khoản Firebase giả lập.
  Một số test lưu ảnh chụp vào thư mục tạm của hệ điều hành.

Test tài khoản không thay thế việc thử đăng nhập Google và quy tắc Firestore thật.
Xem `FIREBASE_SETUP.md` cho bước thiết lập và kiểm tra dịch vụ thật.

## File nào làm việc gì?

- `index.html`: khung trang chủ.
- `lessons.json`: số bài, tên bài và đường dẫn; `roadmap.json`: nhóm mục tiêu học.
- `assets/home.js`: tạo danh mục, tìm kiếm, hiển thị tiến độ và mở bài.
- `assets/site.js`: đọc/ghi tiến độ, dịch giao diện và điều hướng dùng chung.
- `assets/quiz.js`: hiển thị câu hỏi, lưu lựa chọn, chấm điểm và hoàn thành bài.
- `assets/reader.js`: thẻ ghi nhớ và ôn lý thuyết; một số bài nhúng bản mã đọc riêng.
- `assets/auth.js`: đăng nhập Google và đồng bộ; `firestore.rules`: quyền đọc/ghi.
- `assets/*.css`: giao diện; các trang quiz tham chiếu về đây thay vì chép CSS.
- `ly-thuyet/` và `kiem-tra/`: nội dung từng bài. Dữ liệu nằm trong các thẻ JSON
  `lesson-data` và `quiz-data`; không xóa trang chỉ vì giao diện trông giống nhau.
- `scripts/`: công cụ biên soạn nội dung khi phát triển, không chạy trên máy người học.
- `tests/`: kiểm tra dữ liệu và hành vi trình duyệt.

## Hai loại tiến độ

**Đã đọc** lưu riêng trên trình duyệt, không tách theo tài khoản và không đồng bộ.
Nút này không tăng số bài hoàn thành ở trang chủ. Câu ôn trong phần lý thuyết
cũng chỉ lưu trên thiết bị.

**Hoàn thành bài** được ghi khi trả lời đủ và nộp quiz. Quiz, điểm nộp gần nhất
và tiến độ này được tách theo UID và đồng bộ sau khi đăng nhập Google.
Khách chưa đăng nhập chỉ lưu trên trình duyệt.

Giữ nguyên số bài, thứ tự câu hỏi và các khóa localStorage khi sửa giao diện,
để người đã học không bị mất hoặc lệch câu trả lời.

## Khi cần tạo hoặc dịch thêm nội dung

Chỉ khi dùng công cụ biên soạn Python mới cần `python -m pip install -r requirements.txt`.
`build_lessons_23_35.py` dùng bài 22 làm mẫu; `build_remaining_lessons.py` dùng lại
trình tạo đó. Mẫu quiz đã tham chiếu mã trong `assets/`, nên sửa renderer không
cần chạy lại trình tạo bài.

Các script tạo bài có thể ghi đè HTML và danh mục. Đọc phạm vi của script và
kiểm tra thay đổi bằng Git trước khi dùng; không cần chạy chúng để mở website.
Một số công cụ tham chiếu bộ ghi chú `FE_JP/`, `FE_VN/`, `ichibanyashashi/` riêng
trên máy tác giả; các thư mục đó hiện không được theo dõi trong Git.
Script dịch gửi văn bản câu hỏi công khai đến dịch vụ dịch và lưu bản nháp vào
`scripts/quiz-ja-cache.json`; bản dịch vẫn cần người đọc kiểm tra.
