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
