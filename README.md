# FE Lessons — 基本情報技術者試験 学習進捗トラッカー

Web ứng dụng theo dõi tiến độ và học tập, luyện thi chứng chỉ Kỹ sư Công nghệ Thông tin Cơ bản Nhật Bản (**FE — 基本情報技術者試験**).

**🔗 Demo:** [https://linhxteen3.github.io/fe-lessons/](https://linhxteen3.github.io/fe-lessons/)

---

## 🌟 Tính năng nổi bật

### 1. Dashboard theo dõi tiến độ học tập thông minh
- **Vòng tròn tiến độ thực (Progress Ring)**: Hiển thị trực quan tỉ lệ hoàn thành (%) và số bài đã xong.
- **Lưu trữ dữ liệu tự động (LocalStorage)**:
  - Tự động ghi nhớ trạng thái từng bài (Đã xong / Chưa học).
  - Tự động ghi nhận điểm thi khi làm Quiz (10 câu) hoặc Đề kiểm tra (40 câu).
  - Tự động đánh dấu bài học hoàn thành khi đạt điểm đỗ (≥ 60-70%).
  - Hỗ trợ **Xuất file (Export)** và **Nhập file (Import)** JSON dữ liệu tiến độ để đồng bộ giữa các thiết bị.
- **Thanh thống kê tổng quan (Stats Bar)**: Thống kê tổng số bài, số bài đã xong, tổng số lần làm quiz và điểm trung bình.
- **Tìm kiếm & Bộ lọc nhanh**: Lọc theo từ khoá chủ đề tiếng Nhật/Việt, số thứ tự (STT), trạng thái hoàn thành.

### 2. Trải nghiệm học lý thuyết (Lý thuyết · 理論)
- **Cấu trúc 5 phần chuẩn mực**:
  1. 📘 **Tóm tắt lý thuyết**: Trình bày song ngữ Nhật – Việt – Anh kèm ví dụ thực tế và sơ đồ ASCII/bảng biểu.
  2. 💡 **Ví dụ minh hoạ**: Từng bước tính toán và phân tích chi tiết.
  3. 🎴 **Flashcards tương tác**: Lật thẻ 3D, phân loại theo chủ đề, học từ vựng và thuật ngữ chuyên ngành.
  4. 🎯 **Quiz 10 câu tự chấm**: Kiểm tra kiến thức ngay sau bài học, tự động khóa câu trả lời và hiện giải thích chi tiết.
  5. 🗺️ **Mind map SVG**: Sơ đồ tư duy trực quan tổng kết toàn bộ kiến thức bài học.

### 3. Đề kiểm tra 40 câu chuẩn đề thi IPA (Kiểm tra · 演習)
- 40 câu hỏi trắc nghiệm chia theo 3 mức độ: **Dễ (30%) · Trung bình (40%) · Khó (30%)**.
- Bảng điều hướng nhanh 40 ô (Nav Grid), thanh tiến độ thời gian thực.
- Giải thích chi tiết từng phương án: vì sao đúng, vì sao các đáp án còn lại sai, liên hệ giáo trình Yasashii.
- Báo cáo kết quả phân tích theo độ khó và tính năng **"Xem lại câu sai"**.

### 4. Thanh điều hướng toàn trang (Top Navigation Bar)
- Tích hợp cố định ở đầu trang trên tất cả các trang bài học và kiểm tra.
- Nút quay về danh sách, chuyển nhanh giữa Lý thuyết ↔ Kiểm tra 40 câu.
- Nút chuyển trạng thái hoàn thành bài học trực tiếp trên thanh điều hướng.
- Menu nhảy nhanh đến bất kỳ bài nào trong 61 bài học.
- Nút chuyển bài trước / bài sau.
- Chuyển đổi giao diện Sáng / Tối (Dark / Light Theme).
- Hỗ trợ phím tắt tiện lợi:
  - `H`: Về trang chủ (Home)
  - `T`: Chuyển sang Lý thuyết (Theory)
  - `K`: Chuyển sang Kiểm tra (Quiz)
  - `←` / `→`: Bài trước / Bài tiếp theo
  - `?`: Hiển thị trợ giúp phím tắt

---

## 🛠️ Kiến trúc kỹ thuật

| Thành phần | Công nghệ / Giải pháp |
|---|---|
| **Frontend** | Vanilla HTML5 / Modern CSS3 (Custom Properties) / JavaScript (ES6+) |
| **Styling** | `assets/common.css` — Hệ thống thiết kế chuẩn Dark theme, typography (`Space Mono`, `Syne`, `Noto Sans JP`), responsive mobile-first |
| **Core Utilities** | `assets/common.js` — Quản lý `FEProgress` (LocalStorage), `FENav` (Header điều hướng), `FEQuizTracker` (tự động bắt kết quả thi), `FEToast`, `FETheme` |
| **Dữ liệu cấu trúc** | `lessons.json` — Quản lý danh mục 61 bài học theo đề cương chuẩn kỳ thi FE |
| **Hosting** | GitHub Pages |

---

## 📂 Cấu trúc thư mục

```
fe-lessons/
├── index.html          # Trang chủ Dashboard theo dõi tiến độ
├── lessons.json        # Dữ liệu danh mục 61 bài học
├── README.md           # Tài liệu dự án
├── assets/
│   ├── common.css      # Toàn bộ CSS dùng chung (Dark/Light theme, components, nav)
│   └── common.js       # Core logic dùng chung (LocalStorage, navigation, quiz tracking)
├── ly-thuyet/          # Các bài lý thuyết (1.html -> 21.html, ...)
├── kiem-tra/           # Các bài kiểm tra 40 câu (1.html -> 21.html, ...)
└── scripts/            # Các script tự động hoá và kiểm thử
```

---

## 🚀 Hướng dẫn phát triển tiếp (Thêm bài học mới)

Khi tạo bài mới (ví dụ bài 22):
1. **Lý thuyết**: Tạo file `ly-thuyet/22.html` kế thừa `<link rel="stylesheet" href="../assets/common.css">` và `<script src="../assets/common.js"></script>`.
2. **Kiểm tra**: Tạo file `kiem-tra/22.html` với cấu trúc tương tự.
3. Cập nhật `lessons.json` trỏ đường dẫn `theory` và `test` tới file vừa tạo.
4. Hệ thống sẽ tự động cập nhật thanh điều hướng, tiến độ và bắt kết quả kiểm tra mà không cần cấu hình thêm!

*Dự án cá nhân phục vụ mục tiêu thi đỗ Kỳ thi Kỹ sư Công nghệ Thông tin Cơ bản Nhật Bản (FE).*
