# Prompt áp dụng lớp học tương tác cho các bài FE còn lại

Sao chép toàn bộ khối dưới vào Codex tại repo này. Mặc định làm các bài có lý thuyết trong `lessons.json`, trừ bài 01 đã có bản mẫu. Muốn làm một nhóm trước, thay dòng phạm vi bằng số bài cụ thể.

```text
Bạn là lập trình viên frontend và người thiết kế trải nghiệm học FE Việt–Nhật. Hãy chuyển các bài lý thuyết còn lại thành lớp học tương tác theo bản mẫu đã được người dùng duyệt trong repo.

PHẠM VI VÀ NGUỒN SỰ THẬT
- Làm các bài có đường dẫn theory trong lessons.json, trừ bài 01. Không tạo nội dung cho bài chưa có lý thuyết. Không suy ra rằng mọi số từ 1 đến 61 đều có bài.
- Đọc AGENTS.md, lessons.json, roadmap.json, bản mẫu ly-thuyet/1-classroom.html, assets/classroom.css, classroom.js, classroom-labs.js, classroom-clarity.js, reader.js và các test liên quan trước khi sửa.
- Bản mẫu bài 01 và những yêu cầu trong prompt này là hướng đã chốt. Không lấy preview.html/preview.css nền sáng làm hướng thiết kế. Khi DESIGN.md cũ khác với hướng này, ưu tiên bảng màu và bố cục đã được người dùng duyệt dưới đây.
- Giữ trang chủ mẫu cũ, trang kiểm tra riêng, số thứ tự bài, nội dung kiến thức, liên kết, ngôn ngữ, dữ liệu câu hỏi, đáp án, giải thích và dữ liệu tiến độ hiện có. Không tự xóa/chuyển thư mục tài liệu hoặc sửa bài ngoài phạm vi.
- Tạo bản tương tác bên cạnh bài gốc theo tên <số>-classroom.html. Không thay thế tuyến bài gốc hay đổi danh mục mặc định cho đến khi người dùng yêu cầu áp dụng chính thức.
- Kiểm tra trạng thái Git và giữ nguyên thay đổi có sẵn. Không commit/push, triển khai, cài dependency hoặc truy cập dịch vụ ngoài nếu người dùng chưa yêu cầu.

THIẾT KẾ ĐÃ DUYỆT
- Nền than #181818, bề mặt #222222, vùng phụ #292929, chữ #F2F2F2, chữ phụ #B2B5B3, viền #3D4140.
- Xanh #43D995 với nền #20382C cho trạng thái đang bật, bước hiện tại và kết quả. Cam #FFB36B với nền #3A2C20 cho thao tác khám phá, trọng số/chữ số vừa đổi và chuyển hàng. Màu có vai trò rõ; luôn kèm nhãn hoặc hình dạng, không chỉ dùng màu để truyền đạt ý nghĩa.
- Khai báo màu/font qua token. Tái sử dụng token và thành phần hiện có; không thêm framework hoặc thư viện 3D cho các hiệu ứng CSS đơn giản.
- Vùng học chính rộng bên trái; thanh các bước học nằm DỌC bên PHẢI và bám khi cuộn trên desktop/tablet. Không đổi về thanh ngang hoặc cột trái. Mobile rất hẹp: giữ thứ tự đọc hợp lý, thanh dọc căn phải phía trên nội dung như mẫu, tránh ép nội dung thành cột quá hẹp.
- Giảm khung lồng nhau và chữ đậm dày đặc. Định nghĩa ngắn, ví dụ lớn, khoảng cách rõ, nội dung dài mở thêm khi cần. Không dựng trang marketing, thống kê giả, ảnh trang trí hay hiệu ứng làm nền gây phân tâm.

CẤU TRÚC HỌC
- Tái sử dụng chuỗi: Thử/khám phá → Hiểu kiến thức → Xem ví dụ → Lật thẻ ôn tập → Tự kiểm tra; có Phần tiếp theo và Xem toàn bộ bài. Không ép trả lời đúng để được tiếp tục.
- GIỮ toàn bộ kiến thức gốc có thể truy cập. Thu gọn phần giải thích dài và bảng tham chiếu vào details; không xóa nội dung để trang trông gọn.
- Mỗi chủ đề khó cần có giải thích dễ hiểu ngay tại vị trí của nó trong bước Hiểu kiến thức. Không chỉ thêm một mô phỏng đầu trang rồi để nguyên mọi khối chữ khó hiểu phía sau.
- Đề bài ví dụ hiển thị sẵn; toàn bộ lời giải, kết quả, bảng/ASCII tiết lộ cách giải nằm trong details đóng mặc định. Nhãn Mở các bước giải / 解説の手順を見る, hoạt động bằng chuột, chạm và bàn phím. Không làm lộ đáp án qua phần song ngữ còn lại.
- Tái sử dụng flashcard/quiz và cách lưu tiến độ đang có; không tạo kho câu hỏi hoặc namespace lưu trữ trùng lặp. Kiểm tra lựa chọn ngôn ngữ không làm mất trạng thái đã lưu.
- Bỏ ghi chú nguồn thừa kiểu “từ Slide 第1回” khỏi tiêu đề hiển thị; giữ nguồn ở phần tham khảo nếu cần. Cập nhật nhất quán vi/ja/dual và mục lục.

TRỰC QUAN HÓA THEO CHỦ ĐỀ
- Mô phỏng phải giải thích cơ chế, không chỉ là chữ đổi màu. Người học thao tác → đối tượng thay đổi → phép tính/trạng thái cập nhật → giải thích nguyên nhân.
- Ví dụ: cơ số dùng bộ đếm có chuyển hàng; trọng số dùng từng ô chữ số × giá trị vị trí và tổng; phân số dùng phần của một đơn vị; stack/queue dùng phần tử đi vào/đi ra; thuật toán dùng từng bước và bảng trace; mạng dùng gói tin qua nút; cơ sở dữ liệu dùng bảng và phụ thuộc; CPU/bộ nhớ dùng ô nhớ, thanh ghi hoặc luồng xử lý khi phù hợp.
- Chọn hình thức từ nội dung thực của từng bài, không sao chép mô phỏng 8 bit hoặc các con số của bài 01 sang chủ đề không liên quan.
- Các bảng ASCII khó đọc nên có hình minh họa hoặc thao tác tương đương; giữ bản chữ trong phần tham khảo khi cần. Không thay bằng ảnh chụp chữ.
- Phân biệt đúng dữ kiện và mô hình đơn giản hóa. SI kB/MB/GB nhân 1000; IEC KiB/MiB/GiB nhân 1024; 1 byte = 8 bit. Unicode là mã điểm, UTF-8 là cách mã hóa byte. “Tuần hoàn” thuộc nhóm “vô hạn”, không phải ba nhóm ngang hàng tách rời.
- Điều khiển phải dùng được thật. Slider có label, thao tác chuột/chạm/phím, cập nhật khi input và có nút chọn mức trực tiếp khi hợp lý; không dựng hình trông như kéo được nhưng không có chức năng.
- Câu hỏi nhỏ phản hồi đúng/sai kèm giải thích. Không dùng lời khen thay cho giải thích hoặc tự tạo dữ kiện không kiểm chứng.

CHUYỂN ĐỘNG VÀ 3D
- Dùng CSS perspective/transform để nút có chiều sâu, nổi khi bật, lún khi nhấn; flashcard mở mềm; chuyển hàng tô cam các chữ số thay đổi.
- Chuyển động ngắn, phục vụ hành động và nguyên nhân; không tự động bay các đoạn văn hoặc làm khối đọc nghiêng theo chuột. Không dùng transition: all hay animate width/height/top/left.
- Chạy thử tự động chỉ bắt đầu khi bấm, có Dừng rõ ràng, dừng khi rời bước, thao tác thủ công, tab bị ẩn hoặc đạt điểm kết thúc. Không để nhiều timer chạy chồng. Tốc độ đủ để quan sát.
- Tôn trọng prefers-reduced-motion, bỏ chuyển động nhưng giữ chức năng và trạng thái. Tránh aria-live đọc dồn dập trong lúc chạy tự động; vẫn có thông báo khi người dùng thao tác thủ công.

KỸ THUẬT VÀ KHẢ NĂNG TIẾP CẬN
- Đọc mọi nơi gọi đoạn mã sẽ sửa. Lưu ý repo có cả reader dùng file chung và các template CSS/JS nhúng trong HTML; không giả định sửa reader.css sẽ tác động mọi bài.
- Dùng phần có sẵn đúng cách. Tách nội dung riêng theo bài khỏi bố cục dùng chung bằng thay đổi nhỏ nhất cần thiết; không copy cả mã JS bài 01 cho hàng chục bài, cũng không xây bộ máy render tổng quát phức tạp trước khi có nhu cầu thực.
- Giữ id, hook test, đường dẫn tương đối, handlers và validation mà mã hiện có cần. Không sửa bài gốc hoặc test cũ để che lỗi của bản mới.
- Việt, Nhật và song ngữ phải hoạt động với cả UI tĩnh lẫn nội dung sinh động. Không để tiếng Việt lọt vào chế độ chỉ tiếng Nhật; giữ nghĩa thuật ngữ chính xác.
- Dùng button/select/input/details có ngữ nghĩa; focus-visible rõ; aria-pressed/expanded/current đúng; focus không mất khi render lại; target đủ lớn; bảng/ô số không gây tràn ngang toàn trang.
- Tránh innerHTML với đầu vào người dùng chưa escape. Giữ kiểm tra đầu vào, giới hạn mô phỏng và xử lý lỗi/lưu trữ hiện có.

QUY TRÌNH VÀ KIỂM CHỨNG
1. Liệt kê bài trong phạm vi, template hiện có, các phần khó cần trực quan hóa, file/caller/test bị ảnh hưởng. Chọn mô phỏng cụ thể cho từng bài trước khi triển khai.
2. Làm từng bài hoàn chỉnh rồi chuyển bài kế tiếp: lý thuyết trực quan, ví dụ ẩn lời giải, flashcard/quiz, ngôn ngữ và điều hướng. Không dừng ở kế hoạch khi đã được yêu cầu thực hiện.
3. Mỗi logic mô phỏng mới có một test/assert thực chất: đáp án chuẩn, trường hợp biên, reset/chuyển bước, chạy/dừng tự động nếu có. Với ví dụ, xác nhận lời giải ẩn ban đầu và mở bằng bàn phím được.
4. Chạy npm test và các kiểm tra trình duyệt liên quan. tests/classroom.cjs hiện kiểm tra prototype bài 01; không mặc định coi nó đã kiểm tra bài mới. Thêm kiểm tra riêng vừa đủ cho bài được làm.
5. Kiểm tra desktop 1440px, tablet 831×668, mobile 390×844: cột phải, không tràn ngang, chạm/chuột/phím hoạt động. Kiểm tra vi/ja/dual, giảm chuyển động, timer và lưu tiến độ. Chụp và xem ảnh render, không chỉ kiểm tra mã.
6. Báo rõ bài đã hoàn tất, bài chưa làm, test đã chạy và giới hạn thực tế. Cung cấp link xem thử hoạt động; kiểm tra server trả HTTP 200 trước khi gửi. Không hứa link localhost tồn tại sau khi server dừng.

ĐẦU RA
- Các bản classroom hoạt động, giữ đường truy cập bản gốc để so sánh.
- Mã dùng chung được tái sử dụng hợp lý, kiểm tra hồi quy cho hành vi mới.
- Phản hồi ngắn bằng tiếng Việt: thay đổi chính, link thử, kết quả kiểm tra, phần chưa kiểm tra và rủi ro còn lại. Không tuyên bố đã làm/kiểm tra những gì chưa thực hiện.

Đây là prompt cho tác nhân có quyền truy cập hệ thống. Trước khi chạy, đối chiếu phạm vi file và quyền với repo thực tế; không xóa tài liệu, đẩy Git hay triển khai ngoài yêu cầu.
```
