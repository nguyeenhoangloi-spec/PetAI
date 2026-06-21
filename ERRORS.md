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

## [2026-06-20 21:05] - Lỗi không hiển thị các trường nhập nội dung pháp lý khi chuyển trang qua PJAX

- **Type**: Logic
- **Severity**: High
- **File**: `templates/system_config.html:608`
- **Agent**: Antigravity Orchestrator
- **Root Cause**: Container ẩn `<div style="display: none;">` chứa các `textarea` lưu dữ liệu chính sách ban đầu được đặt ở ngoài thẻ div `#content-area`. Khi người dùng điều hướng qua lại bằng liên kết động (PJAX), PJAX chỉ tải và thay thế nội dung bên trong `#content-area`, dẫn đến việc các `textarea` này không tồn tại trong DOM thực tế, khiến đoạn mã JavaScript khởi tạo ném ra lỗi `TypeError` khi đọc thuộc tính `.value` của phần tử `null`.
- **Error Message**: 
  ```text
  TypeError: Cannot read properties of null (reading 'value')
  ```
- **Fix Applied**: Di chuyển toàn bộ thẻ div container ẩn chứa các `textarea` vào bên trong phạm vi của phần tử `#content-area` để nó luôn được PJAX tải và nạp vào DOM cùng với giao diện trang.
- **Prevention**: Đảm bảo tất cả các thẻ HTML chứa dữ liệu hoặc biểu mẫu động mà mã script cần truy cập trong quá trình PJAX tải trang đều phải nằm trong phân vùng nội dung chính (`#content-area`).
- **Status**: Fixed

---

## [2026-06-20 21:40] - Lỗi cú pháp Jinja2 và code rác gây sập trang Chính sách quyền riêng tư

- **Type**: Syntax
- **Severity**: High
- **File**: `templates/privacy-policy.html:461`
- **Agent**: Antigravity Orchestrator
- **Root Cause**: Có một đoạn mã HTML rác và vòng lặp Jinja2 trùng lặp không đầy đủ bị chèn nhầm vào sau thẻ `{% endif %}` ở dòng 461, dẫn đến việc trình biên dịch Jinja2 ném lỗi hoặc hiển thị giao diện nát bét. Ngoài ra, các thẻ tiêu đề và nội dung tĩnh trong trang không hỗ trợ thẻ `data-i18n` khiến trang không dịch được khi chuyển ngôn ngữ.
- **Error Message**: 
  ```text
  TemplateSyntaxError: Encountered unknown tag (or similar render failure due to stray Jinja tags outside loop)
  ```
- **Fix Applied**: Loại bỏ toàn bộ đoạn code rác từ dòng 461 đến 476, đóng thẻ `</main>` và phân vùng nội dung một cách chính xác. Đồng thời, cấu trúc lại phần fallback tĩnh để hỗ trợ thuộc tính `data-i18n` đầy đủ giúp dịch song ngữ chuẩn xác giống các trang khác.
- **Prevention**: Luôn kiểm tra cấu trúc thẻ đóng/mở và thẻ Jinja2 trước khi lưu file, tránh để code rác còn sót lại khi merge.
- **Status**: Fixed

---

## [2026-06-20 21:49] - Lỗi UnicodeEncodeError cp1252 khi chạy script cập nhật footer trên Windows

- **Type**: Process
- **Severity**: Low
- **File**: `scratch/update_column_footers.py:40`
- **Agent**: Antigravity Orchestrator
- **Root Cause**: Chạy script python có `print()` tiếng Việt có dấu ("Hướng dẫn sử dụng") trên terminal Windows (mặc định mã hóa cp1252) dẫn đến lỗi không thể ánh xạ ký tự Unicode.
- **Error Message**: 
  ```text
  UnicodeEncodeError: 'charmap' codec can't encode characters in position 7-8: character maps to <undefined>
  ```
- **Fix Applied**: Sửa nội dung in trong script `update_column_footers.py` thành ký tự ASCII không dấu.
- **Prevention**: Sử dụng tiếng Anh hoặc tiếng Việt không dấu cho thông tin in ra stdout trong các script chạy tự động trên terminal Windows.
- **Status**: Fixed

---

## [2026-06-21 13:08] - Lỗi cú pháp Javascript vỡ hàm chuyển tab và chỉnh sửa trên trang Cấu hình hệ thống

- **Type**: Agent
- **Severity**: High
- **File**: `templates/system_config.html:1586`
- **Agent**: Antigravity Orchestrator
- **Root Cause**: Trong lần cập nhật trước cho tính năng Inline Visual Editor, khi thay đổi hành vi nút "Chỉnh sửa trực quan" thành chuyển hướng trang, một phần thân hàm gốc của `openVisualEditor()` đã bị bỏ lại ngoài phạm vi hàm nhưng vẫn kết thúc bằng dấu đóng ngoặc `}`. Điều này tạo ra lỗi cú pháp Javascript `Uncaught SyntaxError: Unexpected token '}'`, khiến toàn bộ thẻ script không thể biên dịch và các nút (chuyển tab, chọn trang, lưu) bị vô hiệu hóa.
- **Error Message**: 
  ```text
  Uncaught SyntaxError: Unexpected token '}' (at system_config:1586)
  ```
- **Fix Applied**: Tích hợp lại đoạn mã lơ lửng vào trong hàm `openVisualEditor()` bằng cách loại bỏ dấu đóng ngoặc sớm và thêm `return` sau khi chuyển hướng trang.
- **Prevention**: Luôn kiểm tra tính toàn vẹn của ngoặc nhọn đóng/mở của các hàm khi thực hiện chỉnh sửa từng phần.
- **Status**: Fixed


