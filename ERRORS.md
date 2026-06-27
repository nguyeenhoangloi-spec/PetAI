# ERRORS.md - Nhật ký lỗi dự án PetAI

---

## [2026-06-26 11:39] - Lỗi vòng lặp điều hướng vô hạn (Infinite Loop) trong Flutter WebView

- **Type**: Logic
- **Severity**: Critical
- **File**: `app_web_view/lib/main.dart:243-267`
- **Agent**: @mobile-developer
- **Root Cause**: Flutter WebView chặn tất cả điều hướng nội bộ và ép chạy PJAX. Khi người dùng chưa đăng nhập, PJAX fetch link yêu cầu đăng nhập và nhận redirect 302 -> `/login/`. JS PJAX không tìm thấy `#contentArea` trong trang `/login/` nên gọi `window.location.href` để fallback. WebView lại chặn tiếp yêu cầu này và ép chạy PJAX, tạo thành vòng lặp vô hạn (Infinite Loop).
- **Error Message**:
  ```text
  GET /predict/upload-page 302
  GET /login/ 200
  (Vòng lặp vô hạn xảy ra liên tục ở log server)
  ```
- **Fix Applied**: Loại bỏ cơ chế chặn PJAX cưỡng bức trong `_handleNavigation` của Flutter WebView để cho phép điều hướng native bình thường đối với các trang nội bộ. Các lượt chuyển trang thông thường sẽ được PJAX của chính Web (`script.js`) tự xử lý mà không cần can thiệp từ Native App.
- **Prevention**: Tránh ép PJAX từ phía WebView bằng cách chặn điều hướng native nếu trang web đã tích hợp sẵn cơ chế PJAX tự động. Hãy để WebView thực hiện điều hướng native tự nhiên trong trường hợp JS tự động reload toàn trang (fallback).
- **Status**: Fixed

---

## [2026-06-26 11:26] - Lỗi cú pháp Unterminated string literal lồng dấu nháy trong predict.html

- **Type**: Syntax
- **Severity**: Medium
- **File**: `templates/predict.html:794`
- **Agent**: @frontend-specialist
- **Root Cause**: Thuộc tính `onclick` sử dụng dấu nháy kép bọc ngoài và có chứa biểu thức Jinja2 sử dụng nháy kép bên trong, gây kết thúc sớm thuộc tính và tạo ra lỗi cú pháp Javascript tĩnh "Unterminated string literal", đồng thời lan truyền lỗi cú pháp tới các dòng bên dưới (dòng 965).
- **Error Message**:
  ```text
  Unterminated string literal. (dòng 794)
  ',' expected. (dòng 965)
  ')' expected. (dòng 965)
  ```
- **Fix Applied**: Tách biểu thức Jinja2 sang thuộc tính `data-filename` riêng biệt (dùng dấu nháy đơn trong Jinja2) và cập nhật `onclick` sử dụng `this.getAttribute('data-filename')` để tránh hoàn toàn xung đột dấu nháy.
- **Prevention**: Tránh viết các biểu thức Jinja2 phức tạp chứa dấu nháy kép lồng trực tiếp bên trong các thuộc tính HTML có giá trị Javascript (như `onclick`, `onload`). Nên lưu vào thuộc tính `data-*` rồi truy cập qua JS API.
- **Status**: Fixed

---

## [2026-06-25 22:10] - Lỗi vỡ cú pháp HTML trang upload-page do công cụ multi_replace thay thế nhầm đoạn cuối file

- **Type**: Agent
- **Severity**: High
- **File**: `templates/upload_page.html:659-670`
- **Agent**: @frontend-specialist
- **Root Cause**: Trong quá trình chuyển card Góc kiến thức ra ngoài MAIN GRID, công cụ `multi_replace_file_content` đã nhận diện sai TargetContent của khối 4, dẫn đến cắt bỏ nhầm một phần của thẻ img `invalid_watermark.png` và sinh ra cấu trúc thẻ đóng HTML bị vỡ vụn.
- **Error Message**:
  ```text
  [Trang tải ảnh bị vỡ giao diện, lỗi cú pháp thẻ đóng div và img]
  ```
- **Fix Applied**: Sử dụng công cụ `replace_file_content` khôi phục lại chuẩn xác cấu trúc thẻ đóng HTML cho phần hình ảnh watermark và các thẻ container.
- **Prevention**: Luôn đảm bảo TargetContent của từng ReplacementChunk là duy nhất và chứa đầy đủ ngữ cảnh bao quanh để bộ so khớp thay thế của AI hoạt động chính xác 100%.
- **Status**: Fixed

---

## [2026-06-25 16:48] - Lỗi cú pháp JavaScript trong hàm loadRecentHistory trên trang upload-page do công cụ replace ghi đè nhầm

- **Type**: Agent
- **Severity**: High
- **File**: `templates/upload_page.html:900-988`
- **Agent**: @frontend-specialist
- **Root Cause**: Trong quá trình thiết kế lại card lịch sử nhận diện gần đây, công cụ replace tự động đã bị so khớp nhầm với một đoạn mã submit form tương tự ở phía trên. Điều này làm ghi đè mất một phần sự kiện submit form và làm mất logic nạp lịch sử, gây ra lỗi vỡ cú pháp JavaScript nghiêm trọng trên trang predict.
- **Error Message**:
  ```text
  [Trang tải ảnh bị tê liệt tính năng tải lịch sử và không thể gửi ảnh phân tích]
  ```
- **Fix Applied**: Khôi phục lại trạng thái tệp tin bằng `git checkout` và áp dụng thay thế với phạm vi dòng cực kỳ hẹp và TargetContent độc nhất của riêng khối logic `try-catch` trong hàm `loadRecentHistory()`.
- **Prevention**: Tránh sử dụng ReplacementContent có chứa những cụm từ khóa quá phổ biến và lặp lại nhiều lần trong file (như `const t = typeof window.PetAI_i18n` hay `try {`). Chọn TargetContent thật độc nhất và xác định chính xác dòng bắt đầu/kết thúc hẹp nhất có thể.
- **Status**: Fixed

---

## [2026-06-25 16:38] - Lỗi trùng lặp thẻ Jinja2 else trên trang statistics.html gây lỗi render thống kê

- **Type**: Agent
- **Severity**: Medium
- **File**: `templates/statistics.html:1501-1502`
- **Agent**: @frontend-specialist
- **Root Cause**: Trong quá trình thiết kế lại giao diện Kết quả gần đây, khi thực hiện công cụ replace đã bị trùng lặp 2 thẻ `{% else %}` liên tiếp, dẫn đến lỗi cú pháp template `TemplateSyntaxError` của Flask Jinja2.
- **Error Message**:
  ```text
  [Không thể tải thống kê. Vui lòng thử lại.]
  ```
- **Fix Applied**: Loại bỏ một thẻ `{% else %}` trùng lặp tại dòng 1501 để chuẩn hóa lại cú pháp Jinja2.
- **Prevention**: Kiểm tra kỹ phạm vi của ReplacementContent và code Jinja2 xung quanh các khối block trước khi tiến hành replace.
- **Status**: Fixed

---

## [2026-06-24 15:50] - Lỗi nhãn giờ hỗ trợ chưa dịch và lỗi font icon hiển thị chữ "chedule" trên trang Support/Contact

- **Type**: Agent
- **Severity**: Low
- **File**: `templates/support.html:48-50, 385, 387, 598, 600`, `templates/contact.html:56-62, 379, 483, 485`, `static/locales/vi.json:705`, `static/locales/en.json:705`
- **Agent**: @frontend-specialist
- **Root Cause**:
  1. Thiếu các key dịch `supportHoursLabel` và `supportTimeLabel` trong các file ngôn ngữ khiến chữ luôn hiển thị fallback tiếng Việt.
  2. Ký tự thực thể HTML `&amp;` ở query parameter của link tải Google Fonts có thể bị tải lỗi/chặn ở một số trình duyệt, làm font không tải được và hiển thị chữ thay thế `"schedule"` (sau đó bị che khuất chữ s do giới hạn width, hiển thị thành `"chedule"`).
- **Error Message**:
  ```text
  [Giờ hỗ trợ: 8:00 AM – 10:00 PM (không đổi sang Support Hours) / Chữ chedule hiển thị thay thế cho biểu tượng đồng hồ]
  ```
- **Fix Applied**:
  1. Thêm key dịch `supportHoursLabel` và `supportTimeLabel` vào `vi.json` và `en.json`.
  2. Chuẩn hóa link tải Google Fonts sang `&display=swap` và thêm class `notranslate` vào thẻ icon `schedule` trong HTML.
- **Prevention**: Luôn khai báo đầy đủ key dịch cho tất cả nhãn đa ngôn ngữ; không dùng `&amp;` trong thẻ `<link>` của font nếu không cần thiết và thêm `notranslate` cho các thẻ icon font.
- **Status**: Fixed

---

## [2026-06-24 15:42] - Lỗi dư chữ trên trang Đăng nhập/Đăng ký và chớp sáng trắng khi F5 trang Quên mật khẩu

- **Type**: Agent
- **Severity**: Medium
- **File**: `templates/login.html:23-27`, `templates/register.html:23-27`, `templates/forgot_password.html:23-27`, `static/locales/vi.json:192-215`, `static/locales/en.json:192-215`
- **Agent**: @frontend-specialist
- **Root Cause**:
  1. Thẻ tiêu đề chứa cả phần dịch toàn bộ câu và phần accent hiển thị từ gốc, dẫn đến lặp lại từ ở cuối câu.
  2. Tailwind script chạy đồng bộ chặn DOM rendering và nằm trước phần CSS dark theme, khiến trình duyệt hiển thị nền trắng mặc định trong khoảnh khắc tải/xử lý script.
- **Error Message**: 
  ```text
  [Nhận diện giống chó nhanh và chính xácchính xác / Join the dog-loving community with AIPetAI / Chớp sáng trắng khi refresh trang]
  ```
- **Fix Applied**: 
  1. Tách các key dịch tiêu đề (loginLeftTitle, loginLeftTitleAccent, regLeftTitle, regLeftTitleAccent) để dịch riêng phần chữ thường và phần accent nổi bật.
  2. Thêm style nội tuyến body { background-color: #060f1e !important; } lên đầu thẻ <head> để ép hiển thị màu nền tối ngay lập tức khi tải trang.
- **Prevention**: Luôn tách riêng các cụm text dịch khi kết hợp với thẻ accent HTML và đặt inline style định nghĩa background tối màu ở dòng đầu tiên của <head> đối với các trang dark mode.
- **Status**: Fixed

---

## [2026-06-24 15:23] - Lỗi hiển thị Input Đăng nhập bị đè màu nền và lệch Icon khi trình duyệt Autofill

- **Type**: Process
- **Severity**: Medium
- **File**: `templates/login.html:483-539`
- **Agent**: @frontend-specialist
- **Root Cause**: Khi trình duyệt tự động điền (Autofill) tài khoản và mật khẩu đã lưu, nó áp dụng các style mặc định của user-agent (màu nền trắng/xanh nhạt và màu chữ đen) ghi đè lên các style của giao diện tối. Đồng thời, do độ ưu tiên CSS chưa đủ cao, padding-left bị bỏ qua khiến chữ nhập vào đè lên các absolute icons.
- **Error Message**: 
  ```text
  [Lỗi hiển thị giao diện: ô input đổi thành màu nền sáng, chữ bị đè lên icon người dùng và ổ khóa]
  ```
- **Fix Applied**: Thêm các thuộc tính `!important` vào padding, background, border của `.login-input`. Áp dụng bộ lọc `:-webkit-autofill` để ghi đè shadow màu nền tối và giữ màu chữ sáng khi autofill. Đặt `z-index` phân lớp rõ ràng cho input (1) và icon/toggle button (2).
- **Prevention**: Luôn sử dụng kỹ thuật cản autofill background của Chrome/Edge và sử dụng `!important` cho padding của các input có chứa icon tuyệt đối (absolute icon).
- **Status**: Fixed

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

---

## [2026-06-21 14:10] - Lỗi cú pháp JavaScript (dư thừa dấu ngoặc đóng) trong _client_editor.html

- **Type**: Agent
- **Severity**: High
- **File**: `templates/_client_editor.html:542`
- **Agent**: Antigravity Orchestrator
- **Root Cause**: Trong lần cập nhật visual editor, một dấu đóng ngoặc nhọn `}` dư thừa đã bị chèn nhầm vào sau khi kết thúc hàm `loadInitialContent()`. Điều này gây ra lỗi cú pháp JavaScript và làm hỏng trình biên dịch trong trình duyệt, khiến Visual Editor không thể khởi chạy.
- **Error Message**:
  ```text
  Uncaught SyntaxError: Unexpected token '}' (compilation error in _client_editor.html)
  ```
- **Fix Applied**: Loại bỏ dấu đóng ngoặc dư thừa tại dòng 542 để khôi phục cấu trúc chuẩn cho hàm `loadInitialContent()`.
- **Prevention**: Kiểm tra cẩn thận cấu trúc ngoặc đóng mở sau khi thay thế các đoạn mã phức tạp hoặc chạy test render thử.
- **Status**: Fixed

---

## [2026-06-21 18:45] - Lỗi không mở được Modal xóa tài khoản khi điều hướng qua PJAX

- **Type**: Logic
- **Severity**: High
- **File**: `templates/settings.html:706`
- **Agent**: Antigravity Orchestrator
- **Root Cause**: Các modal (`delete-modal-1`, `delete-modal-2`, `delete-modal-3`) và block script xử lý sự kiện tương ứng của chức năng xóa tài khoản được đặt ở ngoài container `#content-area`. Khi người dùng truy cập trang Cài đặt từ trang khác thông qua liên kết động (PJAX), PJAX chỉ tải phần nội dung trong `#content-area`, dẫn đến việc các phần tử Modal và script xử lý bị mất khỏi DOM. Khi click nút "Yêu cầu xóa tài khoản", trình duyệt báo lỗi `TypeError` do gọi thuộc tính của `null`.
- **Error Message**:
  ```text
  Uncaught TypeError: Cannot read properties of null (reading 'classList') at openDeleteModal (settings:829)
  ```
- **Fix Applied**: 
  1. Di chuyển toàn bộ 3 modal và script block xử lý của Modal xóa tài khoản vào bên trong thẻ div `#content-area` để đảm bảo chúng luôn được PJAX tải cùng trang.
  2. Sửa selector dọn dẹp giá trị OTP trong `closeDeleteModals()` từ `.del-otp-input` sang `#delete-otp-boxes .otp-input` để reset chính xác dữ liệu nhập dở.
- **Prevention**: Đảm bảo tất cả các component động (Modal, Popup, Script liên quan) của trang con phải nằm hoàn toàn trong container chính được quản lý bởi bộ định tuyến PJAX.
- **Status**: Fixed

---

## [2026-06-21 18:50] - Lỗi thiếu CSRF Token khi lưu chỉnh sửa 7 trang chính sách pháp lý

- **Type**: Logic
- **Severity**: High
- **File**: `templates/_client_editor.html:2`
- **Agent**: Antigravity Orchestrator
- **Root Cause**: Giao diện soạn thảo trực quan (`_client_editor.html`) được nhúng trực tiếp vào 7 trang chính sách (như `/privacy-policy`, `/terms-of-service`, v.v.). Khi admin nhấn nút "Lưu thay đổi", script gọi hàm `savePageChanges()` gửi yêu cầu `POST` đến `/users/system-config/save-legal` kèm theo trường `csrf_token` được lấy từ thẻ `<meta name="csrf-token">`. Tuy nhiên, 7 trang chính sách này không hề khai báo thẻ `<meta name="csrf-token">` trong `<head>` của mình, dẫn đến giá trị CSRF truyền lên bị rỗng `""` và bị bộ lọc bảo mật chặn lại.
- **Error Message**:
  ```text
  Lỗi Phiên thao tác không hợp lệ (CSRF). Vui lòng thử lại
  ```
- **Fix Applied**: Thêm thẻ `<meta name="csrf-token" content="{{ csrf_token() }}">` vào ngay đầu file `templates/_client_editor.html`. Vì file này chỉ được nhúng vào các trang chính sách khi admin mở chế độ chỉnh sửa (`?edit=true`), thẻ meta này sẽ tự động được inject vào DOM động và cung cấp token hợp lệ cho tất cả các thao tác lưu (`savePageChanges`), reset gốc (`resetToDefault`), và phục hồi phiên bản (`restoreVersion`).
- **Prevention**: Khi tạo biểu mẫu hoặc yêu cầu thay đổi trạng thái (POST/PUT) qua fetch/ajax trong các phần tử nhúng hoặc dùng chung, cần đảm bảo thẻ meta CSRF luôn đồng hành hoặc khai báo dự phòng tại chính phần tử nhúng đó.
- **Status**: Fixed

---

## [2026-06-21 19:01] - Lỗi không chạy Script trong trang Cài đặt (settings) do PJAX xoá Node trước khi truy vấn

- **Type**: Logic
- **Severity**: High
- **File**: `static/js/script.js:452`
- **Agent**: @frontend-specialist
- **Root Cause**: Trong PJAX Router, sự kiện `updateDOM()` hoán đổi phân vùng `#content-area` mới vào live DOM trước khi `postUpdate()` truy vấn `doc.body.querySelectorAll("script:not([src])")` để lấy danh sách inline scripts cần thực thi. Do các inline scripts của trang settings được đặt trong `#content-area` để đồng hành cùng PJAX, khi `updateDOM()` chạy, nó di chuyển `#content-area` ra khỏi `doc.body` của document ảo. Điều này khiến `querySelectorAll` trong `postUpdate()` trả về kết quả trống rỗng, làm các inline scripts trong trang settings không bao giờ được biên dịch hay thực thi, khiến nút xóa tài khoản (gọi hàm `openDeleteModal`) bị tê liệt và báo lỗi `openDeleteModal is not defined`.
- **Error Message**:
  ```text
  Uncaught ReferenceError: openDeleteModal is not defined
  ```
- **Fix Applied**: Truy vấn và lưu danh sách inline scripts từ `doc.body` vào biến `inlineScripts` ở đầu hàm `handleHtml()` trước khi chạy `updateDOM()`. Trong `postUpdate()`, sử dụng trực tiếp biến lưu trữ này thay vì truy vấn lại từ `doc.body`.
- **Prevention**: Luôn lưu giữ hoặc xử lý các tài nguyên động của trang ảo (inline scripts, stylesheets) trước khi thay đổi hoặc huỷ cấu trúc của trang đó.
- **Status**: Fixed

---

## [2026-06-21 22:30] - Lỗi nút chuyển đổi Anh-Việt không làm mới trang để tải bản dịch từ Server

- **Type**: Logic
- **Severity**: High
- **File**: `static/js/i18n.js:4055`
- **Agent**: @frontend-specialist
- **Root Cause**: Khi người dùng nhấn nút chuyển đổi ngôn ngữ, file JS thiết lập cookie ngôn ngữ mới (`siteLanguage`) và tiến hành dịch cục bộ các thẻ có thuộc tính `data-i18n`. Tuy nhiên, các nội dung động do server render (như dữ liệu từ cơ sở dữ liệu, các cảnh báo lỗi, thông tin cấu hình và gói dịch vụ) không có thuộc tính `data-i18n` vẫn hiển thị ở ngôn ngữ cũ. Việc này làm giao diện bị lai tạp nửa Anh nửa Việt, khiến người dùng cảm thấy tính năng không hoạt động.
- **Error Message**: Không có lỗi console trực tiếp, nhưng giao diện hiển thị không đồng bộ và không dịch hết nội dung server-side.
- **Fix Applied**: Bổ sung lệnh `window.location.reload()` vào hàm `setLanguage` trong `i18n.js` khi phát hiện ngôn ngữ thực sự thay đổi (`oldLang !== lang`). Việc này giúp tải lại toàn bộ trang từ Flask với cookie ngôn ngữ mới để server tự động biên dịch và trả về HTML sạch 100% tiếng Anh hoặc tiếng Việt.
- **Prevention**: Với ứng dụng dùng cơ chế render song song (phía Server dịch HTML thô qua middleware và phía Client dịch thẻ tĩnh), việc chuyển đổi ngôn ngữ cần đi kèm lệnh reload trang hoặc PJAX reload để đồng bộ hoá trạng thái.
- **Status**: Fixed

---

## [2026-06-21 22:52] - Lỗi cú pháp JavaScript trong i18n.js vô hiệu hóa nút chuyển đổi ngôn ngữ

- **Type**: Syntax
- **Severity**: High
- **File**: `static/js/i18n.js:1698`
- **Agent**: @frontend-specialist
- **Root Cause**: Khai báo khóa `deletePendingHeaderTitle` trong danh sách dịch tiếng Việt bị thừa dấu đóng ngoặc kép (`deletePendingHeaderTitle"`), dẫn đến lỗi cú pháp `SyntaxError: Unexpected string` khiến trình duyệt không biên dịch và thực thi được file `i18n.js`.
- **Error Message**:
  ```text
  SyntaxError: Unexpected string at static/js/i18n.js:1698
  ```
- **Fix Applied**: Loại bỏ dấu ngoặc kép dư thừa ở khóa `deletePendingHeaderTitle` tại dòng 1698.
- **Prevention**: Sử dụng các công cụ lint hoặc lệnh kiểm tra cú pháp (như `node --check`) để phát hiện và ngăn chặn các lỗi đánh máy (typo) trước khi lưu/commit code.
- **Status**: Fixed

---

## [2026-06-22 00:58] - Lỗi cú pháp Jinja2 và code rác làm hỏng trang Cài đặt (settings)

- **Type**: Syntax
- **Severity**: High
- **File**: `templates/settings.html:382`
- **Agent**: @frontend-specialist
- **Root Cause**: Thiếu đóng ngoặc Jinja2 `{% include '_header.html ... %}` ở dòng 382 gây lỗi cú pháp Jinja2 (`TemplateSyntaxError: expected token 'end of statement block', got '_sidebar'`). Ngoài ra có đoạn code rác trùng lặp chèn vào cuối file sau thẻ đóng `</html>`.
- **Error Message**:
  ```text
  jinja2.exceptions.TemplateSyntaxError: expected token 'end of statement block', got '_sidebar'
  ```
- **Fix Applied**: Đóng chuẩn cú pháp dòng 382 và xóa sạch đoạn code rác dư thừa ở cuối file.
- **Prevention**: Luôn chạy bộ test unit tests hoặc biên dịch template sau khi chỉnh sửa HTML để phát hiện các thẻ Jinja2 bị mở mà chưa đóng.
- **Status**: Fixed

---

## [2026-06-22 01:00] - Lỗi tiêu chuẩn HTML-Validate trong Trang Cài đặt (settings)

- **Type**: Process
- **Severity**: Low
- **File**: `templates/settings.html:586`
- **Agent**: @frontend-specialist
- **Root Cause**: Trình kiểm tra cú pháp HTML báo lỗi: phần tử `<div>` không được phép nằm bên dưới phần tử `<label>` (cho các toggle switch thông báo và email). Ngoài ra có khoảng trắng dư thừa (trailing whitespace) ở dòng 387.
- **Error Message**:
  ```text
  element-permitted-content: <div> element is not permitted as content under <label>
  no-trailing-whitespace: Trailing whitespace
  ```
- **Fix Applied**: Đổi thẻ `<div>` thành `<span>` và thêm thuộc tính hiển thị `block` cho toggle switch. Dùng script Python để dọn dẹp toàn bộ khoảng trắng dư thừa trong file.
- **Prevention**: Tránh lồng các thẻ block-level (như div) bên dưới thẻ label. Luôn sử dụng span và định dạng hiển thị flex/inline-block/block để tuân thủ chuẩn HTML.
- **Status**: Fixed

---

## [2026-06-22 01:20] - Lỗi truyền sai tham số set_cookie và assertion decode unicode trong unit test

- **Type**: Process
- **Severity**: Medium
- **File**: `tests/test_app.py:568`
- **Agent**: Antigravity Orchestrator
- **Root Cause**: 
  1. Sử dụng sai chữ ký hàm của `self.client.set_cookie` (truyền 4 đối số thay vì tối đa 3 đối số do Werkzeug/Flask test client không yêu cầu domain `localhost` theo kiểu truyền vị trí).
  2. Lỗi assertion so sánh trực tiếp chuỗi Unicode Tiếng Việt có dấu với chuỗi thô JSON đã được escape dạng ascii (`\u1ea1n...`) trong `response.data.decode('utf-8')`.
- **Error Message**:
  ```text
  TypeError: Client.set_cookie() takes from 2 to 3 positional arguments but 4 were given
  AssertionError: 'Quản trị viên (Admin) hoạt động duy nhất' not found in '{"message":"B\\u1ea1n l\\u00e0 Qu\\u1ea3n..."}'
  ```
- **Fix Applied**: 
  1. Sửa hàm gọi cookie thành `self.client.set_cookie('siteLanguage', 'en')`.
  2. Sử dụng thư viện `json.loads` để giải mã dữ liệu JSON phản hồi trước khi thực hiện so sánh chuỗi có dấu.
- **Prevention**: Luôn giải mã JSON trước khi kiểm tra các trường dữ liệu text chứa ký tự unicode/UTF-8. Đảm bảo truyền đúng chữ ký của Client.set_cookie trong các phiên bản Flask/Werkzeug khác nhau.
- **Status**: Fixed

---

## [2026-06-22 02:45] - Lỗi thiếu đóng ngoặc nhọn trong Javascript trên trang Dashboard

- **Type**: Agent
- **Severity**: High
- **File**: `templates/dashboard.html:2043`
- **Agent**: @frontend-specialist
- **Root Cause**: Trong khối xử lý sự kiện `i18nChanged` tại `templates/dashboard.html`, điều kiện rà soát `if (topBreedsChartInstance) {` không được đóng ngoặc nhọn `}` ở cuối block trước khi gọi hàm đóng sự kiện `});`. Điều này tạo ra lỗi cú pháp JavaScript, khiến trình duyệt từ chối biên dịch và chạy toàn bộ mã Script trên trang Dashboard, làm cho các chart bị trắng và hoạt cảnh đếm số bị dừng ở 0.
- **Error Message**:
  ```text
  Uncaught SyntaxError: Unexpected token '}' (phá vỡ cấu trúc biên dịch script)
  ```
- **Fix Applied**: Bổ sung dấu đóng ngoặc nhọn `}` tại dòng 2043 để đóng khối lệnh điều kiện `if (topBreedsChartInstance)` một cách chính xác trước khi đóng sự kiện `i18nChanged`.
- **Prevention**: Luôn kiểm tra kỹ các cặp đóng mở ngoặc `{}` của Javascript khi chỉnh sửa hoặc copy-paste trong các file HTML template.
- **Status**: Fixed

---

## [2026-06-22 12:05] - Lỗi cú pháp Javascript dư thừa ngoặc đóng trên trang Xác nhận thanh toán (Confirmations)

- **Type**: Agent
- **Severity**: High
- **File**: `templates/confirmations.html:1697-1699`
- **Agent**: @frontend-specialist
- **Root Cause**: Khai báo thừa dấu đóng ngoặc nhọn/ngoặc tròn `}); }` ở dòng 1697-1699 của file `confirmations.html` (có khả năng do sự kiện click của nút `clearFilters` bị xóa nhầm một phần trong các đợt refactor trước). Điều này gây ra lỗi cú pháp Javascript, khiến trình duyệt từ chối biên dịch toàn bộ script trong thẻ `<script>`, dẫn đến việc các bảng xác nhận thanh toán không thể khởi tạo hay nạp dữ liệu (trang bị trống trơn).
- **Error Message**:
  ```text
  Uncaught SyntaxError: Unexpected token '}' (compilation error in confirmations.html)
  ```
- **Fix Applied**: Thay thế phần code lỗi dư thừa bằng việc định nghĩa lại đầy đủ sự kiện click cho nút xóa lọc `clearBtn` (`id="clearFilters"`), đặt lại các giá trị lọc về mặc định và gọi hàm `refreshUI()` để tải lại dữ liệu.
- **Prevention**: Sử dụng script kiểm tra cú pháp JS (`node --check`) tự động sau khi chỉnh sửa các template chứa khối script lớn để phát hiện lỗi cú pháp sớm.
- **Status**: Fixed

---

## [2026-06-22 13:00] - Lỗi nút xác nhận (Confirm) của Modal động bị ẩn do dùng sai màu nền Tailwind

- **Type**: Logic
- **Severity**: High
- **File**: `static/js/i18n.js:4855`
- **Agent**: @frontend-specialist
- **Root Cause**: Trong hàm tạo modal động `createDynamicModal()`, màu nền của nút xác nhận cho các trạng thái modal (`danger`, `success`, `info`) được cấu hình bằng các class Tailwind không tồn tại trong hệ thống như `bg-red-650`, `bg-emerald-650`, `bg-blue-650`. Do các class này không hợp lệ, nút bị mất màu nền (trở thành trong suốt) và khi kết hợp với màu chữ trắng (`text-white`) làm nút xác nhận bị ẩn hoàn toàn (trắng tinh) trên nền trắng của modal.
- **Error Message**: Nút xác nhận trong hộp thoại "Hủy đơn hàng" bị hiển thị trống trơn không có chữ hay màu nền.
- **Fix Applied**: Thay thế các màu nền bị lỗi bằng các class màu nền chuẩn trong thang điểm của Tailwind CSS như `bg-red-600`, `bg-emerald-600`, `bg-blue-600` và cập nhật các class hover và dark-mode tương ứng.
- **Prevention**: Chỉ sử dụng các mã màu chuẩn của Tailwind CSS (các số từ 100-900 chia hết cho 100) trừ khi dự án cấu hình thêm các màu tùy chỉnh đặc biệt trong `tailwind.config`.
- **Status**: Fixed

---

## [2026-06-23 13:14] - Lỗi BuildError không tạo được URL cho endpoint history_page trong predict.html

- **Type**: Agent
- **Severity**: High
- **File**: `templates/predict.html:1224, 1273`
- **Agent**: @frontend-specialist
- **Root Cause**: Trong lần cải tiến giao diện trang Kết quả nhận diện, tác nhân đã gọi nhầm endpoint `history.history_page` (không tồn tại) thay vì `history.history` (được định nghĩa trong blueprint history.py), dẫn đến sập trang `/predict` do lỗi BuildError của Flask/Werkzeug.
- **Error Message**:
  ```text
  werkzeug.routing.exceptions.BuildError: Could not build url for endpoint 'history.history_page'. Did you mean 'history.history' instead?
  ```
- **Fix Applied**: Thay đổi tất cả các vị trí gọi `history.history_page` thành `history.history` trong file `predict.html` (dòng 1224 và 1273).
- **Prevention**: Luôn đối chiếu kỹ tên các endpoint trong tệp route Python (Blueprint) khi tạo các liên kết động bằng `url_for` trong các template Jinja2, chạy kiểm thử tự động để phát hiện các lỗi xây dựng URL trước khi báo cáo hoàn thành.
- **Status**: Fixed

---

## [2026-06-24 00:23] - Lỗi NameError: name 'request' is not defined trong context_processors.py

- **Type**: Agent
- **Severity**: Critical
- **File**: `context_processors.py:165`
- **Agent**: Antigravity Orchestrator
- **Root Cause**: Hàm xử lý ngữ cảnh `inject_system_config` trong `context_processors.py` sử dụng biến `request` của Flask để đọc cookie ngôn ngữ `siteLanguage`. Tuy nhiên, thư viện `request` chưa được import trong phạm vi của hàm này, dẫn đến lỗi `NameError`.
- **Error Message**:
  ```text
- **Type**: Logic
- **Severity**: High
- **File**: `templates/_client_editor.html:2`
- **Agent**: Antigravity Orchestrator
- **Root Cause**: Giao diện soạn thảo trực quan (`_client_editor.html`) được nhúng trực tiếp vào 7 trang chính sách (như `/privacy-policy`, `/terms-of-service`, v.v.). Khi admin nhấn nút "Lưu thay đổi", script gọi hàm `savePageChanges()` gửi yêu cầu `POST` đến `/users/system-config/save-legal` kèm theo trường `csrf_token` được lấy từ thẻ `<meta name="csrf-token">`. Tuy nhiên, 7 trang chính sách này không hề khai báo thẻ `<meta name="csrf-token">` trong `<head>` của mình, dẫn đến giá trị CSRF truyền lên bị rỗng `""` và bị bộ lọc bảo mật chặn lại.
- **Error Message**:
  ```text
  Lỗi Phiên thao tác không hợp lệ (CSRF). Vui lòng thử lại
  ```
- **Fix Applied**: Thêm thẻ `<meta name="csrf-token" content="{{ csrf_token() }}">` vào ngay đầu file `templates/_client_editor.html`. Vì file này chỉ được nhúng vào các trang chính sách khi admin mở chế độ chỉnh sửa (`?edit=true`), thẻ meta này sẽ tự động được inject vào DOM động và cung cấp token hợp lệ cho tất cả các thao tác lưu (`savePageChanges`), reset gốc (`resetToDefault`), và phục hồi phiên bản (`restoreVersion`).
- **Prevention**: Khi tạo biểu mẫu hoặc yêu cầu thay đổi trạng thái (POST/PUT) qua fetch/ajax trong các phần tử nhúng hoặc dùng chung, cần đảm bảo thẻ meta CSRF luôn đồng hành hoặc khai báo dự phòng tại chính phần tử nhúng đó.
- **Status**: Fixed

---

## [2026-06-21 19:01] - Lỗi không chạy Script trong trang Cài đặt (settings) do PJAX xoá Node trước khi truy vấn

- **Type**: Logic
- **Severity**: High
- **File**: `static/js/script.js:452`
- **Agent**: @frontend-specialist
- **Root Cause**: Trong PJAX Router, sự kiện `updateDOM()` hoán đổi phân vùng `#content-area` mới vào live DOM trước khi `postUpdate()` truy vấn `doc.body.querySelectorAll("script:not([src])")` để lấy danh sách inline scripts cần thực thi. Do các inline scripts của trang settings được đặt trong `#content-area` để đồng hành cùng PJAX, khi `updateDOM()` chạy, nó di chuyển `#content-area` ra khỏi `doc.body` của document ảo. Điều này khiến `querySelectorAll` trong `postUpdate()` trả về kết quả trống rỗng, làm các inline scripts trong trang settings không bao giờ được biên dịch hay thực thi, khiến nút xóa tài khoản (gọi hàm `openDeleteModal`) bị tê liệt và báo lỗi `openDeleteModal is not defined`.
- **Error Message**:
  ```text
  Uncaught ReferenceError: openDeleteModal is not defined
  ```
- **Fix Applied**: Truy vấn và lưu danh sách inline scripts từ `doc.body` vào biến `inlineScripts` ở đầu hàm `handleHtml()` trước khi chạy `updateDOM()`. Trong `postUpdate()`, sử dụng trực tiếp biến lưu trữ này thay vì truy vấn lại từ `doc.body`.
- **Prevention**: Luôn lưu giữ hoặc xử lý các tài nguyên động của trang ảo (inline scripts, stylesheets) trước khi thay đổi hoặc huỷ cấu trúc của trang đó.
- **Status**: Fixed

---

## [2026-06-21 22:30] - Lỗi nút chuyển đổi Anh-Việt không làm mới trang để tải bản dịch từ Server

- **Type**: Logic
- **Severity**: High
- **File**: `static/js/i18n.js:4055`
- **Agent**: @frontend-specialist
- **Root Cause**: Khi người dùng nhấn nút chuyển đổi ngôn ngữ, file JS thiết lập cookie ngôn ngữ mới (`siteLanguage`) và tiến hành dịch cục bộ các thẻ có thuộc tính `data-i18n`. Tuy nhiên, các nội dung động do server render (như dữ liệu từ cơ sở dữ liệu, các cảnh báo lỗi, thông tin cấu hình và gói dịch vụ) không có thuộc tính `data-i18n` vẫn hiển thị ở ngôn ngữ cũ. Việc này làm giao diện bị lai tạp nửa Anh nửa Việt, khiến người dùng cảm thấy tính năng không hoạt động.
- **Error Message**: Không có lỗi console trực tiếp, nhưng giao diện hiển thị không đồng bộ và không dịch hết nội dung server-side.
- **Fix Applied**: Bổ sung lệnh `window.location.reload()` vào hàm `setLanguage` trong `i18n.js` khi phát hiện ngôn ngữ thực sự thay đổi (`oldLang !== lang`). Việc này giúp tải lại toàn bộ trang từ Flask với cookie ngôn ngữ mới để server tự động biên dịch và trả về HTML sạch 100% tiếng Anh hoặc tiếng Việt.
- **Prevention**: Với ứng dụng dùng cơ chế render song song (phía Server dịch HTML thô qua middleware và phía Client dịch thẻ tĩnh), việc chuyển đổi ngôn ngữ cần đi kèm lệnh reload trang hoặc PJAX reload để đồng bộ hoá trạng thái.
- **Status**: Fixed

---

## [2026-06-21 22:52] - Lỗi cú pháp JavaScript trong i18n.js vô hiệu hóa nút chuyển đổi ngôn ngữ

- **Type**: Syntax
- **Severity**: High
- **File**: `static/js/i18n.js:1698`
- **Agent**: @frontend-specialist
- **Root Cause**: Khai báo khóa `deletePendingHeaderTitle` trong danh sách dịch tiếng Việt bị thừa dấu đóng ngoặc kép (`deletePendingHeaderTitle"`), dẫn đến lỗi cú pháp `SyntaxError: Unexpected string` khiến trình duyệt không biên dịch và thực thi được file `i18n.js`.
- **Error Message**:
  ```text
  SyntaxError: Unexpected string at static/js/i18n.js:1698
  ```
- **Fix Applied**: Loại bỏ dấu ngoặc kép dư thừa ở khóa `deletePendingHeaderTitle` tại dòng 1698.
- **Prevention**: Sử dụng các công cụ lint hoặc lệnh kiểm tra cú pháp (như `node --check`) để phát hiện và ngăn chặn các lỗi đánh máy (typo) trước khi lưu/commit code.
- **Status**: Fixed

---

## [2026-06-22 00:58] - Lỗi cú pháp Jinja2 và code rác làm hỏng trang Cài đặt (settings)

- **Type**: Syntax
- **Severity**: High
- **File**: `templates/settings.html:382`
- **Agent**: @frontend-specialist
- **Root Cause**: Thiếu đóng ngoặc Jinja2 `{% include '_header.html ... %}` ở dòng 382 gây lỗi cú pháp Jinja2 (`TemplateSyntaxError: expected token 'end of statement block', got '_sidebar'`). Ngoài ra có đoạn code rác trùng lặp chèn vào cuối file sau thẻ đóng `</html>`.
- **Error Message**:
  ```text
  jinja2.exceptions.TemplateSyntaxError: expected token 'end of statement block', got '_sidebar'
  ```
- **Fix Applied**: Đóng chuẩn cú pháp dòng 382 và xóa sạch đoạn code rác dư thừa ở cuối file.
- **Prevention**: Luôn chạy bộ test unit tests hoặc biên dịch template sau khi chỉnh sửa HTML để phát hiện các thẻ Jinja2 bị mở mà chưa đóng.
- **Status**: Fixed

---

## [2026-06-22 01:00] - Lỗi tiêu chuẩn HTML-Validate trong Trang Cài đặt (settings)

- **Type**: Process
- **Severity**: Low
- **File**: `templates/settings.html:586`
- **Agent**: @frontend-specialist
- **Root Cause**: Trình kiểm tra cú pháp HTML báo lỗi: phần tử `<div>` không được phép nằm bên dưới phần tử `<label>` (cho các toggle switch thông báo và email). Ngoài ra có khoảng trắng dư thừa (trailing whitespace) ở dòng 387.
- **Error Message**:
  ```text
  element-permitted-content: <div> element is not permitted as content under <label>
  no-trailing-whitespace: Trailing whitespace
  ```
- **Fix Applied**: Đổi thẻ `<div>` thành `<span>` và thêm thuộc tính hiển thị `block` cho toggle switch. Dùng script Python để dọn dẹp toàn bộ khoảng trắng dư thừa trong file.
- **Prevention**: Tránh lồng các thẻ block-level (như div) bên dưới thẻ label. Luôn sử dụng span và định dạng hiển thị flex/inline-block/block để tuân thủ chuẩn HTML.
- **Status**: Fixed

---

## [2026-06-22 01:20] - Lỗi truyền sai tham số set_cookie và assertion decode unicode trong unit test

- **Type**: Process
- **Severity**: Medium
- **File**: `tests/test_app.py:568`
- **Agent**: Antigravity Orchestrator
- **Root Cause**: 
  1. Sử dụng sai chữ ký hàm của `self.client.set_cookie` (truyền 4 đối số thay vì tối đa 3 đối số do Werkzeug/Flask test client không yêu cầu domain `localhost` theo kiểu truyền vị trí).
  2. Lỗi assertion so sánh trực tiếp chuỗi Unicode Tiếng Việt có dấu với chuỗi thô JSON đã được escape dạng ascii (`\u1ea1n...`) trong `response.data.decode('utf-8')`.
- **Error Message**:
  ```text
  TypeError: Client.set_cookie() takes from 2 to 3 positional arguments but 4 were given
  AssertionError: 'Quản trị viên (Admin) hoạt động duy nhất' not found in '{"message":"B\\u1ea1n l\\u00e0 Qu\\u1ea3n..."}'
  ```
- **Fix Applied**: 
  1. Sửa hàm gọi cookie thành `self.client.set_cookie('siteLanguage', 'en')`.
  2. Sử dụng thư viện `json.loads` để giải mã dữ liệu JSON phản hồi trước khi thực hiện so sánh chuỗi có dấu.
- **Prevention**: Luôn giải mã JSON trước khi kiểm tra các trường dữ liệu text chứa ký tự unicode/UTF-8. Đảm bảo truyền đúng chữ ký của Client.set_cookie trong các phiên bản Flask/Werkzeug khác nhau.
- **Status**: Fixed

---

## [2026-06-22 02:45] - Lỗi thiếu đóng ngoặc nhọn trong Javascript trên trang Dashboard

- **Type**: Agent
- **Severity**: High
- **File**: `templates/dashboard.html:2043`
- **Agent**: @frontend-specialist
- **Root Cause**: Trong khối xử lý sự kiện `i18nChanged` tại `templates/dashboard.html`, điều kiện rà soát `if (topBreedsChartInstance) {` không được đóng ngoặc nhọn `}` ở cuối block trước khi gọi hàm đóng sự kiện `});`. Điều này tạo ra lỗi cú pháp JavaScript, khiến trình duyệt từ chối biên dịch và chạy toàn bộ mã Script trên trang Dashboard, làm cho các chart bị trắng và hoạt cảnh đếm số bị dừng ở 0.
- **Error Message**:
  ```text
  Uncaught SyntaxError: Unexpected token '}' (phá vỡ cấu trúc biên dịch script)
  ```
- **Fix Applied**: Bổ sung dấu đóng ngoặc nhọn `}` tại dòng 2043 để đóng khối lệnh điều kiện `if (topBreedsChartInstance)` một cách chính xác trước khi đóng sự kiện `i18nChanged`.
- **Prevention**: Luôn kiểm tra kỹ các cặp đóng mở ngoặc `{}` của Javascript khi chỉnh sửa hoặc copy-paste trong các file HTML template.
- **Status**: Fixed

---

## [2026-06-22 12:05] - Lỗi cú pháp Javascript dư thừa ngoặc đóng trên trang Xác nhận thanh toán (Confirmations)

- **Type**: Agent
- **Severity**: High
- **File**: `templates/confirmations.html:1697-1699`
- **Agent**: @frontend-specialist
- **Root Cause**: Khai báo thừa dấu đóng ngoặc nhọn/ngoặc tròn `}); }` ở dòng 1697-1699 của file `confirmations.html` (có khả năng do sự kiện click của nút `clearFilters` bị xóa nhầm một phần trong các đợt refactor trước). Điều này gây ra lỗi cú pháp Javascript, khiến trình duyệt từ chối biên dịch toàn bộ script trong thẻ `<script>`, dẫn đến việc các bảng xác nhận thanh toán không thể khởi tạo hay nạp dữ liệu (trang bị trống trơn).
- **Error Message**:
  ```text
  Uncaught SyntaxError: Unexpected token '}' (compilation error in confirmations.html)
  ```
- **Fix Applied**: Thay thế phần code lỗi dư thừa bằng việc định nghĩa lại đầy đủ sự kiện click cho nút xóa lọc `clearBtn` (`id="clearFilters"`), đặt lại các giá trị lọc về mặc định và gọi hàm `refreshUI()` để tải lại dữ liệu.
- **Prevention**: Sử dụng script kiểm tra cú pháp JS (`node --check`) tự động sau khi chỉnh sửa các template chứa khối script lớn để phát hiện lỗi cú pháp sớm.
- **Status**: Fixed

---

## [2026-06-22 13:00] - Lỗi nút xác nhận (Confirm) của Modal động bị ẩn do dùng sai màu nền Tailwind

- **Type**: Logic
- **Severity**: High
- **File**: `static/js/i18n.js:4855`
- **Agent**: @frontend-specialist
- **Root Cause**: Trong hàm tạo modal động `createDynamicModal()`, màu nền của nút xác nhận cho các trạng thái modal (`danger`, `success`, `info`) được cấu hình bằng các class Tailwind không tồn tại trong hệ thống như `bg-red-650`, `bg-emerald-650`, `bg-blue-650`. Do các class này không hợp lệ, nút bị mất màu nền (trở thành trong suốt) và khi kết hợp với màu chữ trắng (`text-white`) làm nút xác nhận bị ẩn hoàn toàn (trắng tinh) trên nền trắng của modal.
- **Error Message**: Nút xác nhận trong hộp thoại "Hủy đơn hàng" bị hiển thị trống trơn không có chữ hay màu nền.
- **Fix Applied**: Thay thế các màu nền bị lỗi bằng các class màu nền chuẩn trong thang điểm của Tailwind CSS như `bg-red-600`, `bg-emerald-600`, `bg-blue-600` và cập nhật các class hover và dark-mode tương ứng.
- **Prevention**: Chỉ sử dụng các mã màu chuẩn của Tailwind CSS (các số từ 100-900 chia hết cho 100) trừ khi dự án cấu hình thêm các màu tùy chỉnh đặc biệt trong `tailwind.config`.
- **Status**: Fixed

---

## [2026-06-23 13:14] - Lỗi BuildError không tạo được URL cho endpoint history_page trong predict.html

- **Type**: Agent
- **Severity**: High
- **File**: `templates/predict.html:1224, 1273`
- **Agent**: @frontend-specialist
- **Root Cause**: Trong lần cải tiến giao diện trang Kết quả nhận diện, tác nhân đã gọi nhầm endpoint `history.history_page` (không tồn tại) thay vì `history.history` (được định nghĩa trong blueprint history.py), dẫn đến sập trang `/predict` do lỗi BuildError của Flask/Werkzeug.
- **Error Message**:
  ```text
  werkzeug.routing.exceptions.BuildError: Could not build url for endpoint 'history.history_page'. Did you mean 'history.history' instead?
  ```
- **Fix Applied**: Thay đổi tất cả các vị trí gọi `history.history_page` thành `history.history` trong file `predict.html` (dòng 1224 và 1273).
- **Prevention**: Luôn đối chiếu kỹ tên các endpoint trong tệp route Python (Blueprint) khi tạo các liên kết động bằng `url_for` trong các template Jinja2, chạy kiểm thử tự động để phát hiện các lỗi xây dựng URL trước khi báo cáo hoàn thành.
- **Status**: Fixed

---

## [2026-06-24 00:23] - Lỗi NameError: name 'request' is not defined trong context_processors.py

- **Type**: Agent
- **Severity**: Critical
- **File**: `context_processors.py:165`
- **Agent**: Antigravity Orchestrator
- **Root Cause**: Hàm xử lý ngữ cảnh `inject_system_config` trong `context_processors.py` sử dụng biến `request` của Flask để đọc cookie ngôn ngữ `siteLanguage`. Tuy nhiên, thư viện `request` chưa được import trong phạm vi của hàm này, dẫn đến lỗi `NameError`.
- **Error Message**:
  ```text
  File "d:\KhoaLuan - Copy (new) - Copy\context_processors.py", line 165, in inject_system_config
    _lang_for_ht = request.cookies.get("siteLanguage")
  NameError: name 'request' is not defined
  ```
- **Fix Applied**: Thêm dòng import cục bộ `from flask import request` vào ngay đầu hàm `inject_system_config()`.
- **Prevention**: Luôn đảm bảo import đầy đủ các đối tượng được sử dụng trong hàm con, đặc biệt khi viết các helper context processors chạy cục bộ.
- **Status**: Fixed

---

## [2026-06-24 15:08] - Lỗi khởi tạo môi trường trình duyệt con (CDP Port parsing error)

- **Type**: Process
- **Severity**: Low
- **File**: `N/A (Browser Subagent Environment)`
- **Agent**: Antigravity Orchestrator
- **Root Cause**: Khi khởi tạo `browser_subagent` để kiểm thử giao diện trang `/predict` tự động, công cụ `open_browser_url` bị lỗi do môi trường ảo không phân tích được cổng CDP của trình duyệt.
- **Error Message**:
  ```text
  failed to create browser context: failed to resolve CDP URLs: failed to parse CDP port
  ```
- **Fix Applied**: Báo cáo sự cố hệ thống thử nghiệm cho người dùng và hướng dẫn người dùng tự tải lại trang `/predict` để kiểm tra giao diện thủ công.
- **Prevention**: Đây là lỗi môi trường chạy độc lập của agent nằm ngoài tầm kiểm soát của code dự án. Vẫn giữ các phương pháp chạy và kiểm tra thủ công làm phương án dự phòng khi môi trường browser tự động bị lỗi.
- **Status**: Fixed

---

## [2026-06-25 00:15] - Lỗi xuất file PDF bị trắng trơn và nút Xuất lịch sử không phản hồi sau khi chuyển trang qua PJAX

- **Type**: Logic
- **Severity**: High
- **File**: `templates/history.html:1400-1528`, `static/js/script.js`
- **Agent**: Antigravity Orchestrator
- **Root Cause**: Do thư viện `html2pdf.js` được import qua thẻ `<script src="...">` ở cuối trang `history.html` nhưng PJAX chỉ thực thi các thẻ script nội tuyến (inline scripts) và bỏ qua các script ngoài khi nạp động, dẫn đến biến `html2pdf` bị `undefined`. Đồng thời, các modal ẩn (`deleteConfirmModal` và `exportModal`) đặt bên trong vùng chứa PJAX `#content-area` bị ảnh hưởng bởi CSS layout của trang cha (như transform hoặc transition) làm lệch vị trí hiển thị và không thể tương tác đúng cách khi không tải lại trang.
- **Error Message**:
  ```text
  Uncaught ReferenceError: html2pdf is not defined (khi gọi triggerExportDownload)
  Modal hiển thị lệch vị trí hoặc không hiển thị (do ảnh hưởng của stacking context trong #content-area)
  ```
- **Fix Applied**:
  1. Cập nhật hàm `triggerExportDownload` để kiểm tra và tải động thư viện `html2pdf.js` từ CDN theo nhu cầu (on-demand loading) trước khi xuất PDF.
  2. Thêm cơ chế quản lý lifecycle cho `#deleteConfirmModal` và `#exportModal` trong tệp `static/js/script.js` để tự động di chuyển các modal ra trực tiếp `document.body` khi chuyển trang qua PJAX, và dọn dẹp sạch sẽ khi rời trang.
  3. Thêm script di chuyển modal ra `document.body` khi tải trang lần đầu (F5) trong sự kiện `DOMContentLoaded` của `templates/history.html`.
- **Prevention**: Luôn kiểm tra cơ chế tải tài nguyên của PJAX/AJAX đối với các thư viện bên thứ ba và di chuyển các phần tử modal có vị trí cố định (`fixed inset-0`) ra ngoài vùng chứa bị giới hạn CSS (như `#content-area`) trực tiếp lên `document.body` để tránh lỗi vị trí hiển thị.
- **Status**: Fixed

---

## [2026-06-25 00:20] - Lỗi co giật, nhảy lệch giao diện trang Lịch sử khi tải trang và khi xuất báo cáo PDF

- **Type**: Logic
- **Severity**: Medium
- **File**: `templates/history.html`
- **Agent**: Antigravity Orchestrator
- **Root Cause**:
  1. Iframe dùng để in báo cáo PDF ẩn được đính vào `document.body` ở vị trí cố định `left: 0; top: 0` với kích cỡ A4 (1024x1448px) lớn hơn màn hình thực tế, làm xuất hiện thanh cuộn trình duyệt tạm thời, gây co giật layout chính.
  2. Modals nằm bên trong `#content-area` được di chuyển động bằng JS sau khi load trang, gây ra hiện tượng nhấp nháy/nhảy layout (FOUC).
- **Error Message**: Giao diện bị giật lệch trái/phải hoặc co giãn thanh cuộn khi click Xuất lịch sử hoặc khi chuyển trang.
- **Fix Applied**:
  1. Cấu hình tọa độ iframe kết xuất PDF nằm hoàn toàn ngoài màn hình (`left: -9999px; top: -9999px; position: fixed;`) để triệt tiêu việc kích hoạt thanh cuộn của trình duyệt chính.
  2. Đưa định nghĩa HTML của `#deleteConfirmModal` và `#exportModal` ra ngoài vùng PJAX `#content-area` (nằm ở đáy `<body>`), giúp trình duyệt dựng modal tĩnh chuẩn ngay từ đầu.
- **Prevention**: Luôn dựng các phần tử ẩn hoặc iframe render ngầm ở vị trí hoàn toàn off-screen (ví dụ: `left: -9999px`) để tránh ảnh hưởng đến thanh cuộn viewport của cửa sổ chính.
- **Status**: Fixed

---

## [2026-06-25 17:11] - Lỗi rò rỉ kết nối database và lỗi đường dẫn ảnh làm treo khung lịch sử nhận diện gần đây

- **Type**: Logic
- **Severity**: High
- **File**: `upload.py:1160-1187`, `templates/predict.html:1735-1816`
- **Agent**: PetAI
- **Root Cause**:
  1. Khi lưu lịch sử nhận diện (`PredictionHistory.save`), nếu xảy ra ngoại lệ, kết nối DB không được đóng (`conn.close()` bị bỏ qua), làm rò rỉ kết nối MySQL. Khi hết kết nối, API nạp lịch sử gần đây `/history/api/recent` bị treo.
  2. Đường dẫn lưu trữ chứa ký tự gạch chéo ngược `\` của Windows không được chuẩn hóa ở frontend làm lỗi tải ảnh.
  3. WebView/trình duyệt cũ không hỗ trợ `AbortController` gây crash script.
- **Error Message**:
  ```text
  [Khung lịch sử nhận diện gần đây hiển thị các ô skeleton trống trơn và treo vô hạn]
  ```
- **Fix Applied**:
  1. Cấu trúc lại khối lưu lịch sử trong `upload.py` sử dụng `try...finally` để luôn đóng kết nối DB.
  2. Chuẩn hóa đường dẫn hình ảnh bằng cách thay thế `\` thành `/` trong `predict.html`.
  3. Thêm kiểm tra an toàn `typeof AbortController` trước khi gọi fetch.
- **Prevention**: Luôn dùng khối `finally` để đóng kết nối database sau khi mở; chuẩn hóa đường dẫn trước khi gán thuộc tính `src` và kiểm tra sự tồn tại của các API mới của trình duyệt trước khi sử dụng.
- **Status**: Fixed

---

## [2026-06-25 21:41] - Lỗi vỡ cú pháp HTML/Jinja2 khi di chuyển card Mix Analysis ở kết quả nhận diện

- **Type**: Agent
- **Severity**: High
- **File**: `templates/predict.html:1066-1076`
- **Agent**: PetAI
- **Root Cause**: Quá trình di chuyển card Mix Analysis sang cột bên trái trước đó đã vô tình ghi đè và cắt cụt nút bấm "Chi tiết mô hình" (Model Info button), để lại các thẻ HTML đóng thừa, thẻ Jinja2 đóng thừa (`{% endif %}`) và thẻ mở cột phải bị lỗi cú pháp làm vỡ layout giao diện.
- **Error Message**: Giao diện vỡ layout, mất nút "Chi tiết mô hình" và thẻ đóng grid không khớp.
- **Fix Applied**: Khôi phục cấu trúc chuẩn của Model Info button, đóng cột trái và grid tương ứng, loại bỏ toàn bộ các thẻ đóng dư thừa của card cũ, và mở thẻ cột phải (`lg:col-span-4`) chính xác.
- **Prevention**: Khi di chuyển các khối HTML lớn giữa các cột Grid, cần rà soát kỹ thẻ đóng mở (`div`, `section`, `{% if %}`) và cấu trúc lồng nhau của Grid để tránh đè lộn xộn các phần tử xung quanh.
- **Status**: Fixed

---

## [2026-06-28 00:25] - Lỗi ngưỡng lọc YOLOv8 Dog Gate quá cao làm từ chối các ảnh chó thực tế

- **Type**: Logic
- **Severity**: Medium
- **File**: `upload.py:1079`, `.env:20`
- **Agent**: PetAI
- **Root Cause**: Ngưỡng lọc chó `DOG_GATE_YOLO_DOG_THRESHOLD` mặc định là `0.40` quá cao đối với các ảnh chụp chó trong thực tế (góc chụp nghiêng, mờ, bị che khuất...). Điều này khiến YOLOv8 nhận diện vật thể `"dog"` với confidence dưới `0.40` (ví dụ `0.30` - `0.38`), dẫn đến việc hệ thống từ chối ảnh chó hợp lệ một cách sai lầm.
- **Error Message**:
  ```text
  Ảnh này không phải chó. Vui lòng tải lên ảnh chó để nhận diện.
  ```
- **Fix Applied**: Thay đổi giá trị của `DOG_GATE_YOLO_DOG_THRESHOLD` trong file cấu hình `.env` từ `0.40` thành `0.25` để mở rộng phạm vi chấp nhận mà vẫn đảm bảo khả năng lọc tốt.
- **Prevention**: Luôn cân nhắc điều chỉnh ngưỡng nhận diện YOLO gate ở mức tối ưu (từ 0.20 đến 0.25) khi tích hợp mô hình phát hiện đối tượng trong thực tế để tăng khả năng chấp nhận ảnh tải lên từ người dùng.
- **Status**: Fixed

---

## [2026-06-28 00:30] - Lỗi giật màn hình (Layout Shift) khi tải trang nâng cấp do gọi scrollIntoView vô điều kiện

- **Type**: Logic
- **Severity**: Low
- **File**: `templates/upgrade.html:2296`
- **Agent**: PetAI
- **Root Cause**: Đoạn mã JS tự động định vị gói cước đề xuất khi tải trang gọi hàm `scrollIntoView` vô điều kiện trên mọi kích thước màn hình (chạy cả trên desktop) và không giới hạn hướng cuộn. Điều này làm cho cửa sổ chính của trình duyệt bị giật cuộn dọc xuống dưới ngay khi tải trang xong, phá vỡ trải nghiệm người dùng.
- **Error Message**:
  ```text
  Trang nâng cấp khi load xong bị tự động giật cuộn dọc đột ngột xuống phần bảng giá.
  ```
- **Fix Applied**: 
  1. Thêm điều kiện kiểm tra màn hình di động (`window.innerWidth < 1280`) trước khi thực hiện cuộn. Trên desktop, toàn bộ logic cuộn này sẽ bị bỏ qua để giữ trang web đứng yên mượt mà ở đầu trang.
  2. Để loại bỏ hoàn toàn độ trễ 150ms gây giật hình ảnh (khi người dùng nhìn thấy đầu trang rồi mới bị giật xuống), logic cuộn đã được chuyển thành một hàm `performMobileScroll` thực hiện đồng bộ ngay khi sự kiện `DOMContentLoaded` kích hoạt (trước First Paint), đồng thời sử dụng `requestAnimationFrame` làm phương án dự phòng để hiệu chỉnh chính xác khi frame tiếp theo sẵn sàng.
- **Prevention**: Luôn bao bọc các logic cuộn trang (auto-scroll) trong kiểm tra kích thước màn hình `window.innerWidth` tương ứng. Khi cần cuộn ngay lúc tải trang, hãy chạy logic đồng bộ trước First Paint kết hợp `requestAnimationFrame` thay vì sử dụng trì hoãn `setTimeout` để tránh lỗi Layout Shift/Flicker gây khó chịu.
- **Status**: Fixed
