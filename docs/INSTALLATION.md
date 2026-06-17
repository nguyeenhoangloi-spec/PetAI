# Hướng dẫn cài đặt và khởi chạy dự án PetAI

Tài liệu này hướng dẫn chi tiết quy trình thiết lập môi trường, cài đặt cơ sở dữ liệu, tải mô hình AI và khởi chạy ứng dụng PetAI từ đầu trên một máy tính mới hoàn toàn.

---

## Mục lục
1. [Giới thiệu](#giới-thiệu)
2. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
3. [Clone dự án](#clone-dự-án)
4. [Cài đặt môi trường ảo và thư viện](#cài-đặt-môi-trường-ảo-và-thư-viện)
5. [Cấu hình môi trường (.env)](#cấu-hình-môi-trường-env)
6. [Cài đặt cơ sở dữ liệu (Database)](#cài-đặt-cơ-sở-dữ-liệu-database)
7. [Chạy Backend và Giao diện (Frontend)](#chạy-backend-và-giao-diện-frontend)
8. [Tải và cài đặt mô hình AI (Model)](#tải-và-cài-đặt-mô-hình-ai-model)
9. [Cấp quyền tài khoản Quản trị viên (Admin)](#cấp-quyền-tài-khoản-quản-trị-viên-admin)
10. [Kiểm tra hoạt động của hệ thống](#kiểm-tra-hoạt-động-của-hệ-thống)
11. [Các lỗi thường gặp và cách khắc phục](#các-lỗi-thường-gặp-và-cách-khắc-phục)
12. [Cấu trúc thư mục chính của dự án](#cấu-trúc-thư-mục-chính-của-dự-án)

---

## Giới thiệu
**PetAI** là một ứng dụng web monolithic được viết bằng ngôn ngữ **Python** trên nền tảng **Flask**, tích hợp các mô hình Trí tuệ nhân tạo (AI) chạy trên **PyTorch** và **YOLOv8** để nhận diện giống chó qua hình ảnh, khoanh vùng đối tượng, ước tính tỷ lệ giống nghi lai và hiển thị nhiệt đồ giải thích trực quan Grad-CAM. Dự án sử dụng **MySQL** làm cơ sở dữ liệu chính và tích hợp dịch vụ bên thứ ba **SePay/VietQR** để đối soát thanh toán tự động.

---

## Yêu cầu hệ thống
Để chạy dự án ổn định, máy tính của bạn cần đáp ứng các điều kiện sau:
*   **Hệ điều hành**: Windows 10/11, Ubuntu/Linux hoặc macOS.
*   **Python**: Phiên bản khuyến nghị là **Python 3.8, 3.9 hoặc 3.10** (để đảm bảo khả năng tương thích tốt nhất với PyTorch, Ultralytics và OpenCV).
*   **MySQL Server**: Phiên bản **5.7** hoặc **8.0+**.
*   **Git**: Để quản lý và clone mã nguồn.
*   **CUDA Toolkit (Tùy chọn)**: Nếu máy tính của bạn có card đồ họa NVIDIA và muốn tăng tốc độ suy luận của mô hình AI, hãy cài đặt CUDA tương thích với phiên bản PyTorch.

---

## Clone dự án
Mở terminal hoặc cửa sổ dòng lệnh và chạy lệnh sau để tải mã nguồn dự án:
```bash
git clone https://github.com/nguyeenhoangloi-spec/PetAI.git
cd PetAI
```

---

## Cài đặt môi trường ảo và thư viện
Để tránh xung đột thư viện giữa các dự án khác nhau trên máy tính của bạn, hãy thiết lập một môi trường ảo (Virtual Environment):

### 1. Khởi tạo môi trường ảo Python
*   **Trên Windows (PowerShell/CMD)**:
    ```bash
    python -m venv venv
    venv\Scripts\activate
    ```
*   **Trên Linux/macOS**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

### 2. Cài đặt các gói thư viện phụ thuộc
Hệ thống sử dụng package manager mặc định là `pip`. Chạy lệnh sau để cài đặt toàn bộ các thư viện được liệt kê trong `requirements.txt`:
```bash
pip install -r requirements.txt
```

---

## Cấu hình môi trường (.env)
Dự án tải cấu hình hệ thống từ tệp `.env` tại thư mục gốc. Nếu dự án chưa có tệp `.env`, bạn hãy tạo một tệp mới tên là `.env` và khai báo các biến môi trường sau:

```env
# 1. Cấu hình kết nối MySQL Database
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password_here
MYSQL_DATABASE=khoaluantn

# 2. Cấu hình khóa Flask Session
FLASK_SECRET_KEY=random_secret_hex_key_here

# 3. Cấu hình Google OAuth Login (Dành cho đăng nhập nhanh qua Google)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# 4. Cấu hình thanh toán tự động qua SePay & VietQR
SEPAY_API_KEY=your_sepay_api_key_here
SEPAY_QR_API=https://img.vietqr.io/image
VIETQR_BANK_BIN=970422
VIETQR_ACCOUNT_NUMBER=9244424440709
VIETQR_ACCOUNT_NAME=NGUYEN HOANG LOI
VIETQR_MERCHANT_NAME=DOG AI APP
VIETQR_MERCHANT_CITY=HANOI

# 5. Các cấu hình tham số AI ngưỡng chấp nhận giống (Softmax)
BREED_ACCEPT_THRESHOLD=0.70
BREED_REFERENCE_THRESHOLD=0.55

# 6. Các cấu hình tham số AI nhận diện chó lai (Prototype Similarity)
HYBRID_MIN_SCORE=0.35
HYBRID_MIN_SCORE_2=0.33
HYBRID_MAX_GAP=0.15
HYBRID_MIN_RATIO=0.77
HYBRID_MIN_MEAN_SCORE=0.36
```

### Giải thích các biến môi trường chính:
*   `MYSQL_*` hoặc `DB_*`: Các thông số kết nối tới cơ sở dữ liệu MySQL của bạn.
*   `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Thông tin Client ID và Client Secret lấy từ Google Cloud Console (APIs & Services > Credentials > OAuth 2.0 Client IDs).
*   `SEPAY_API_KEY`: Khóa bảo mật đối soát tự động của SePay để xác thực cuộc gọi webhook.
*   `VIETQR_BANK_BIN`: Mã BIN ngân hàng thụ hưởng (ví dụ: `970422` cho MB Bank).
*   `VIETQR_ACCOUNT_NUMBER`: Số tài khoản nhận tiền chuyển khoản.
*   `BREED_ACCEPT_THRESHOLD`: Ngưỡng độ tin cậy để xác nhận là giống thuần chủng (mặc định `0.70` - 70%).

---

## Cài đặt cơ sở dữ liệu (Database)

### Bước 1: Tạo Cơ sở dữ liệu trống trên MySQL
Mở MySQL Client hoặc phần mềm quản lý (như phpMyAdmin, DBeaver, Navicat) và tạo một database mới:
```sql
CREATE DATABASE khoaluantn CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Bước 2: Nhập lược đồ bảng ban đầu (schema.sql)
Thực thi mã lệnh SQL trong tệp `schema.sql` vào cơ sở dữ liệu vừa tạo để tạo bảng `users` và thiết lập các khóa ngoại, chỉ mục ban đầu. 
*   Bạn có thể nhập trực tiếp bằng MySQL CLI:
    ```bash
    mysql -u root -p khoaluantn < schema.sql
    ```

### Bước 3: Khởi tạo các bảng ứng dụng phụ trợ
Chạy tệp script khởi tạo cơ sở dữ liệu đi kèm dự án để tự động tạo thêm các bảng còn lại như `prediction_history`, `user_settings`, `user_quota`, `payment_orders`:
```bash
python init_db.py
```
*Kết quả in ra màn hình:*
```text
Đang kết nối đến database...
Đang khởi tạo các bảng...
✅ Database tables initialized successfully!
✓ Khởi tạo database thành công!
✓ Đã đóng kết nối database
```

---

## Chạy Backend và Giao diện (Frontend)
Dự án được thiết kế theo mô hình Monolithic, trong đó Flask vừa chịu trách nhiệm xử lý logic nghiệp vụ, API, vừa trả về giao diện HTML/CSS trực tiếp thông qua Jinja2 template engine và TailwindCSS (sử dụng Tailwind CDN tải trực tiếp trên trình duyệt). 

Vì vậy, **không có lệnh chạy Frontend riêng biệt**. Bạn chỉ cần chạy lệnh khởi động máy chủ Flask:

```bash
python app.py
```

Khi máy chủ hoạt động, giao diện người dùng sẽ sẵn sàng để truy cập tại địa chỉ:
👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)** hoặc **[http://localhost:5000](http://localhost:5000)**.

---

## Tải và cài đặt mô hình AI (Model)
Hệ thống sử dụng các tệp tin trọng số mô hình AI cục bộ để thực thi phân tích. Hãy tải và đặt các tệp tin mô hình vào đúng thư mục để AI hoạt động:

1.  **Mô hình phát hiện đối tượng YOLOv8s**:
    *   Tải tệp tin trọng số **`yolov8s.pt`** từ trang chủ Ultralytics.
    *   Đặt trực tiếp tệp **`yolov8s.pt`** vào **thư mục gốc** của dự án (cùng cấp với tệp `app.py`).
2.  **Mô hình phân loại giống chó (Classifier)**:
    *   Tạo thư mục `outputs/classifier/` (nếu chưa có) và đặt tệp tin trọng số đã huấn luyện của bộ phân loại giống chó:
        *   Tệp trọng số: **`outputs/classifier/best_classifier.pth`**
3.  **Dữ liệu nguyên mẫu so khớp giống (Prototypes)**:
    *   Tạo thư mục `outputs/prototypes/` (nếu chưa có) và đặt các tệp metadata liên quan đến giống chó mẫu:
        *   Tệp vector: **`outputs/prototypes/class_prototypes.npy`**
        *   Tệp danh sách lớp: **`outputs/prototypes/classes.json`**
        *   Tệp ánh xạ tên tiếng Việt: **`outputs/prototypes/breed_names_vi.json`**
4.  **Ảnh nhiệt đồ Grad-CAM trung bình (Tĩnh)**:
    *   Đặt thư mục chứa ảnh nhiệt đồ trung bình đã sinh trước của các giống chó vào đường dẫn:
        *   **`gradcam_mean/`** (hoặc thư mục **`outputs/gradcam_mean/`** tại thư mục gốc).

---

## Cấp quyền tài khoản Quản trị viên (Admin)
Hệ thống **không tích hợp sẵn tài khoản admin mẫu mặc định** nào trong cơ sở dữ liệu để bảo mật. Để có một tài khoản admin:

1.  Truy cập trang web tại địa chỉ `http://127.0.0.1:5000/register`.
2.  Tiến hành đăng ký một tài khoản thông thường (ví dụ tên đăng nhập là `my_admin`).
3.  Mở MySQL CLI hoặc phần mềm quản lý Database, thực hiện câu lệnh SQL sau để thăng cấp vai trò tài khoản lên quản trị viên (`admin`):
    ```sql
    UPDATE users SET role = 'admin' WHERE username = 'my_admin';
    ```
4.  Đăng xuất và đăng nhập lại bằng tài khoản vừa thăng cấp để truy cập vào Bảng điều khiển quản trị viên (`/users/` và `/users/confirmations`).

---

## Kiểm tra hoạt động của hệ thống
Sau khi thiết lập, bạn có thể thực hiện kiểm tra hoạt động thông qua các bước sau:
1.  **Đăng ký & Đăng nhập**: Đăng ký một tài khoản mới và đăng nhập thành công. Kiểm tra xem giao diện hiển thị đúng tên hiển thị và hạn mức ban đầu là 10 lượt quét hay chưa.
2.  **Tải ảnh nhận diện**: Vào mục Nhận diện AI, tải lên một bức ảnh có hình chó (.jpg/.png) để kiểm tra xem YOLOv8s có vẽ được bounding box và bộ Classifier có trả về giống chó cùng bản đồ nhiệt Grad-CAM chính xác hay không.
3.  **Quảng cáo giả lập**: Sử dụng hết 10 lượt quét để chuyển sang giao diện yêu cầu xem quảng cáo. Nhấp xem quảng cáo giả lập và kiểm tra xem lượt quét có được tăng thêm 3 lượt sau khi hoàn thành hay không.
4.  **Thanh toán VietQR**: Nhấp vào Nâng cấp, chọn một gói dịch vụ và bấm mua gói. Kiểm tra xem trang checkout có hiển thị thông tin hóa đơn và ảnh mã QR VietQR chính xác kèm theo nội dung chuyển khoản tự động hay không.
5.  **Duyệt thanh toán Admin**: Đăng nhập bằng tài khoản admin đã thiết lập ở mục trước, vào trang `/users/confirmations` và bấm nút duyệt thủ công đơn hàng (nếu đang ở cấu hình xác nhận thủ công) để nâng cấp tài khoản người dùng lên gói trả phí.

---

## Các lỗi thường gặp và cách khắc phục

### 1. Lỗi thiếu thư viện PyTorch hoặc torchvision
*   **Nguyên nhân**: Phiên bản PyTorch cài đặt không khớp với kiến trúc CPU/GPU hoặc phiên bản Python hiện tại trên máy bạn.
*   **Cách khắc phục**: Truy cập trang chủ [pytorch.org](https://pytorch.org), chọn hệ điều hành và cấu hình phần cứng phù hợp để lấy lệnh cài đặt PyTorch tương thích thay vì dùng lệnh pip install chung.

### 2. Lỗi kết nối cơ sở dữ liệu (Failed to connect to MySQL)
*   **Nguyên nhân**: Thông tin trong tệp `.env` không trùng khớp với cấu hình MySQL trên máy bạn (sai cổng 3306, sai mật khẩu, hoặc MySQL chưa được khởi động).
*   **Cách khắc phục**: Kiểm tra trạng thái dịch vụ MySQL trên máy tính (lệnh `services.msc` trên Windows hoặc `systemctl status mysql` trên Linux). Chạy thử tệp `python connect.py` để test nhanh kết nối trước khi chạy app chính.

### 3. Lỗi thiếu tệp trọng số AI (FileNotFoundError/Missing best_classifier.pth)
*   **Nguyên nhân**: Chưa tải hoặc đặt sai vị trí các tệp tin mô hình của YOLOv8s hoặc bộ Classifier giống chó.
*   **Cách khắc phục**: Kiểm tra xem các tệp tin `yolov8s.pt` đã nằm ở thư mục gốc, và các tệp trong thư mục `outputs/classifier/` và `outputs/prototypes/` đã nằm đúng cấu trúc thư mục như hướng dẫn ở trên hay chưa.

### 4. Lỗi cổng mạng 5000 bị chiếm dụng (Address already in use)
*   **Nguyên nhân**: Đang có một ứng dụng khác trên máy bạn sử dụng cổng 5000 (như dịch vụ AirPlay trên macOS hoặc phiên chạy app.py cũ chưa được tắt).
*   **Cách khắc phục**: Tắt ứng dụng đang chiếm dụng, hoặc bạn có thể đổi cổng chạy của Flask bằng cách chỉnh sửa tệp `app.py` tại dòng chạy serve:
    ```python
    serve(app, host="0.0.0.0", port=5001)  # đổi từ 5000 sang 5001
    ```

---

## Cấu trúc thư mục chính của dự án
```text
├── outputs/                 # Thư mục lưu trữ các mô hình AI và dữ liệu mẫu (Prototypes)
│   ├── classifier/          # Chứa checkpoint best_classifier.pth
│   └── prototypes/          # Chứa class_prototypes.npy, classes.json, breed_names_vi.json
├── gradcam_mean/            # Thư mục chứa các ảnh bản đồ nhiệt trung bình mẫu (Grad-CAM)
├── static/                  # Thư mục chứa các tài nguyên tĩnh của website
│   ├── css/                 # Chứa các tệp CSS định hình phong cách (theme-dark.css,...)
│   ├── js/                  # Chứa tệp i18n.js (đa ngôn ngữ) và scripts.js
│   └── uploads/             # Thư mục lưu trữ ảnh người dùng tải lên
├── templates/               # Thư mục chứa các tệp giao diện HTML (Jinja2 Templates)
├── routes/                  # Các module xử lý logic API & thanh toán
│   ├── dashboard_api.py     # API xử lý biểu đồ dashboard
│   ├── sepay.py             # Route nhận webhook đối soát số dư của SePay
│   └── legal.py             # Các trang pháp lý (terms, privacy, user guide)
├── app.py                   # Điểm khởi chạy (Entry point) của ứng dụng Flask
├── connect.py               # Module quản lý kết nối MySQL
├── models.py                # Định nghĩa các lớp tương tác cơ sở dữ liệu (ORM/Models)
├── predict.py               # Logic suy luận phân loại giống chó & Grad-CAM
├── upload.py                # Xử lý upload ảnh, chạy YOLOv8s phát hiện cún, và phân quyền quota
├── schema.sql               # File SQL cấu trúc bảng cơ sở dữ liệu ban đầu
└── requirements.txt         # Liệt kê các thư viện dependencies cần thiết của dự án
```
