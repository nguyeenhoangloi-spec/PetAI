# ERRORS.md - Nhật ký lỗi dự án PetAI

---

## [2026-06-20 02:05] - Lỗi logic kích hoạt đổi mật khẩu do trình duyệt tự động điền (Auto-fill)

- **Type**: Logic
- **Severity**: High
- **File**: `settings.py:66`
- **Agent**: @frontend-specialist
- **Root Cause**: Điều kiện rà soát đổi mật khẩu có chứa `current_password`. Khi trình duyệt tự động điền mật khẩu hiện tại vào form cài đặt, hệ thống hiểu lầm là người dùng muốn đổi mật khẩu. Do các ô mật khẩu mới bỏ trống, validation kiểm tra thiếu thông tin bị kích hoạt, ngăn người dùng lưu các cài đặt khác (như giao diện tối, họ tên).
- **Error Message**: 
  ```
  Vui lòng điền đầy đủ thông tin để thay đổi mật khẩu.
  ```
- **Fix Applied**: Sửa điều kiện kích hoạt đổi mật khẩu trong `settings.py` thành `if is_force_change or new_password or confirm_new_password:`. Bỏ kiểm tra `current_password` trong điều kiện lọc ban đầu để tránh dính auto-fill.
- **Prevention**: Tránh dùng trường mật khẩu hiện tại để kích hoạt luồng đổi mật khẩu chính; chỉ kích hoạt khi phát hiện có ký tự trong trường mật khẩu mới.
- **Status**: Fixed

---

## [2026-06-20 17:00] - Lỗi cú pháp Javascript phá vỡ tính năng chuyển tab trong Cấu hình hệ thống

- **Type**: Agent
- **Severity**: Medium
- **File**: `templates/system_config.html:826`
- **Agent**: @frontend-specialist
- **Root Cause**: Trong lần thay đổi code trước đó, khi cập nhật xử lý `pageSelect`, thẻ `if (pageSelect)` mở đầu đã bị xóa nhầm nhưng các dấu ngoặc nhọn đóng `}` vẫn được giữ lại. Điều này tạo ra lỗi cú pháp Javascript `SyntaxError: Unexpected token '}'`, khiến trình duyệt từ chối biên dịch toàn bộ thẻ `<script>`, dẫn đến việc các hàm chuyển tab (`switchTab`) không được khai báo.
- **Error Message**: 
  ```text
  Uncaught SyntaxError: Unexpected token '}' (at system_config:826)
  ```
- **Fix Applied**: Khôi phục lại khối lệnh điều kiện kiểm tra `if (pageSelect && rawLegalData[pageSelect]) { ... }` đầy đủ.
- **Prevention**: Luôn kiểm tra tính đúng đắn về cú pháp của Javascript và HTML sau mỗi lần chỉnh sửa (ví dụ: dùng các công cụ lint, hoặc chạy preview nhanh).
- **Status**: Fixed

---

## [2026-06-20 17:35] - Lỗi Quill Editor không hiển thị (Race Condition) khi tải trang Cấu hình hệ thống

- **Type**: Runtime
- **Severity**: High
- **File**: `templates/system_config.html:614`
- **Agent**: @frontend-specialist
- **Root Cause**: Thư viện Quill JS (`quill.js`) trước đây được tải ở cuối thẻ `<body>`. Khi người dùng click nhanh vào tab "Các trang chính sách & điều khoản", hàm `initQuillEditors()` cố gắng khởi tạo `new Quill(...)` trước khi script Quill JS được tải và thực thi xong, dẫn đến lỗi `ReferenceError: Quill is not defined`.
- **Error Message**: 
  ```text
  Uncaught ReferenceError: Quill is not defined
  ```
- **Fix Applied**: 
  1. Đưa script `<script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js"></script>` vào thẻ `<head>` để tải từ đầu.
  2. Bổ sung cơ chế tự động thử lại (Retry Loop) sau mỗi 50ms trong hàm `initQuillEditors()` nếu đối tượng `Quill` chưa sẵn sàng.
  3. Cải tiến hàm `switchTab` và `loadLegalContent` sử dụng cờ `isInitial` để loại bỏ các URL trùng lặp sinh ra trong lịch sử duyệt web (`pushState`).
- **Prevention**: Luôn tải các thư viện UI JS quan trọng từ sớm hoặc kiểm tra tính sẵn sàng (`typeof Library !== "undefined"`) trước khi khởi tạo.
- **Status**: Fixed

---

## [2026-06-20 20:50] - Lỗi lặp khai báo loadLegalContent gây vỡ cú pháp JavaScript trong Cấu hình hệ thống

- **Type**: Agent
- **Severity**: High
- **File**: `templates/system_config.html:739`
- **Agent**: Antigravity Orchestrator
- **Root Cause**: Khai báo dư thừa hàm `loadLegalContent` không có đóng ngoặc nhọn ở đầu định nghĩa biến `fallbackDefaultHtml` tại dòng 739. Việc này khiến toàn bộ các hàm phía sau bị lồng vào trong và gây lỗi cú pháp JavaScript khiến toàn bộ Script trên trang Cấu hình hệ thống không thể hoạt động (bao gồm hàm `switchTab` để chuyển đổi tab).
- **Error Message**: 
  ```text
  Uncaught SyntaxError: Unexpected token 'var' (or similar script compilation failure)
  ```
- **Fix Applied**: Loại bỏ khai báo dư thừa của hàm `loadLegalContent` bắt đầu tại dòng 739 để trả biến `fallbackDefaultHtml` về phạm vi toàn cục (global) và đóng đúng cấu trúc cú pháp của thẻ script.
- **Prevention**: Rà soát cấu trúc cú pháp JS cẩn thận sau khi thực hiện gộp hoặc chỉnh sửa các đoạn code lớn.
- **Status**: Fixed


---
