# KhoaLuan - Hệ thống nhận diện Chó/Mèo, quản lý quota và thanh toán gói bằng Flask

Ứng dụng web xây dựng bằng Flask để:

- nhận diện ảnh chó,
- dự đoán giống chó,
- quản lý lịch sử/thống kê,
- phân quyền User/Admin,
- triển khai cơ chế quota miễn phí + xem quảng cáo,
- nâng cấp gói qua thanh toán QR và webhook SePay.

---

## 1) Tổng quan bài toán

Mục tiêu của hệ thống:

- Cung cấp dịch vụ dự đoán giống thú cưng trên web cho người dùng đăng nhập.
- Kiểm soát lượt dùng theo gói (`free`, `basic`, `pro`, `enterprise`).
- Hỗ trợ mở khóa tạm bằng quảng cáo cho người dùng free.
- Hỗ trợ thanh toán nâng cấp gói với luồng:
  - User tạo đơn,
  - User bấm "đã chuyển tiền" (tuỳ cấu hình),
  - Admin xác nhận hoặc webhook SePay tự động xác nhận.
- Quản trị toàn bộ user, khóa/mở, xem chi tiết, cấp gói.

---

## 2) Công nghệ sử dụng

- **Backend**: Flask, Blueprint, Jinja2
- **Database**: MySQL (`pymysql`)
- **Auth**:
  - Đăng nhập thường (username/email + password hash Werkzeug)
  - Google OAuth (Authlib)
- **AI/CV**:
  - YOLOv8 (`ultralytics`) để detect dog/cat và suy luận breed (nếu có weight breed)
  - Pipeline HOG + SVM (`scikit-learn`, `joblib`) làm fallback/legacy
- **QR thanh toán**:
  - Sinh payload VietQR (`vietqr.py`)
  - Tùy chọn ảnh QR từ API `img.vietqr.io`
- **Deploy runtime**: `waitress` (production fallback), Flask dev server (debug)

---

## 3) Cấu trúc chức năng theo vai trò

### 3.1 User

- Đăng ký, đăng nhập, đăng xuất, quên mật khẩu (placeholder).
- Upload ảnh để nhận diện.
- Xem lịch sử dự đoán cá nhân (phân trang).
- Xem thống kê cá nhân (top breed, trung bình confidence...).
- Xem/cập nhật cài đặt (theme, language, notification).
- Cơ chế quota:
  - Free: 10 lượt miễn phí.
  - Hết free: được xem quảng cáo tối đa 3 lần.
  - Mỗi lần xem ads mở thêm 3 lượt (`ad_unlocks_remaining`).
- Mua gói ở trang upgrade, theo dõi trạng thái đơn hàng ở trang payments.

### 3.2 Admin

- Xem danh sách user, xem chi tiết user.
- Khóa/mở khóa tài khoản.
- Xóa user (có điều kiện xác nhận + ràng buộc dữ liệu liên quan).
- Khởi tạo DB (`/users/init-db`).
- Xem danh sách đơn user đã báo chuyển tiền (`/users/confirmations`).
- Xác nhận thanh toán để cấp gói.
- Cấp gói thủ công cho user (`/users/set-plan`).

### 3.3 Hệ thống

- Middleware tự động đăng xuất user đã bị khóa.
- Context processor inject `ui_theme`, `current_plan` vào mọi template.
- Error handlers cho 403/404/500.
- Health check endpoint `/health`.
- Webhook SePay với cơ chế idempotency theo `sepay_tx_id`.

---

## 4) Luồng AI nhận diện ảnh

Trong `upload.py`, khi user upload ảnh:

1. **Kiểm tra quota** trước khi suy luận.
2. Chạy **YOLO detect base model** (`yolov8n.pt`) để xác định `dog/cat` + confidence.
3. Chỉ khi `Dog` và confidence >= **75%** mới cho suy luận giống.
4. Nếu có breed model (`best.pt` tìm tự động trong `runs/detect/**/weights/`) thì dùng YOLO breed để override kết quả giống.
5. Đồng thời vẫn chạy pipeline `ImagePredictor` (HOG+SVM) làm fallback.
6. Lưu lịch sử vào `prediction_history`.
7. Với gói trả phí có giới hạn lượt (`basic`, `pro`) thì trừ `paid_uses_remaining`.

### Trọng số mô hình

- Base detect: `yolov8n.pt` (có sẵn trong repo)
- Breed detect (tuỳ chọn):
  - `runs/detect/breeds/weights/best.pt`
  - `runs/detect/breeds_from_scratch/weights/best.pt`
  - `weights/yolov8_breed_best.pt`
  - `models/yolov8_breed_best.pt`

Hệ thống tự quét và chọn file `best.pt` mới nhất.

---

## 5) Luồng quota & gói dịch vụ

### Plan hiện hỗ trợ

- `free`:
  - 10 lượt miễn phí
  - ads: tối đa 3 lần, mỗi lần +3 lượt mở khóa
- `basic`: 1.000 VND, 7 ngày, giới hạn 50 lượt
- `pro`: 5.000 VND, 30 ngày, giới hạn 200 lượt
- `enterprise`: 15.000 VND, 90 ngày, không giới hạn lượt (`None`)

### Quy tắc mua gói

- Cho phép nâng cấp lên gói cao hơn khi đang active.
- Không cho mua gói thấp hơn gói đang active.
- Cùng gói chỉ cho gia hạn khi hết hạn hoặc đã hết lượt.
- Hàm áp dụng gói có logic **upgrade-only** (không hạ cấp ngẫu nhiên).

---

## 6) Luồng thanh toán QR + SePay

### 6.1 User tạo đơn

- `POST /predict/checkout` tạo `order_id`, amount theo plan.
- Lưu đơn vào `payment_orders` status `pending`.
- Sinh QR tại `GET /predict/payment/qr.png`:
  - Ưu tiên redirect QR image API (nếu cấu hình `SEPAY_QR_API` + bank info)
  - fallback sinh QR local từ payload VietQR.

### 6.2 User xác nhận đã chuyển tiền (tuỳ cấu hình)

- `POST /predict/payments/confirm-transfer`
- Chuyển trạng thái `pending -> user_confirmed`

### 6.3 Admin xác nhận

- `POST /users/payments/confirm`
- Chuyển `user_confirmed -> paid`, sau đó cấp plan theo đơn.

### 6.4 Webhook SePay tự động

- Endpoint chính: `POST /webhook/sepay`
- Alias hỗ trợ cấu hình sai route: `POST /`
- Xác thực API key qua:
  - `Authorization: Apikey <SEPAY_API_KEY>`
  - hoặc `X-Api-Key`
  - hoặc query `?api_key=`
- Parse `order_id` từ `code` hoặc nội dung giao dịch.
- Chống xử lý trùng bằng bảng `sepay_webhook_events`.
- Nếu amount hợp lệ, tự động `mark_paid_from_webhook` + cấp plan.

---

## 7) Danh sách endpoint chính

### Auth & account

- `GET|POST /login/`
- `GET|POST /register/`
- `GET /logout/`
- `GET|POST /account/forgot`
- `GET /login/google`
- `GET /authorize/google`

### Trang người dùng

- `GET /` (home)
- `GET /dashboard/`
- `GET /predict/upload-page`
- `POST /predict/upload`
- `GET /history/`
- `GET /history/api/recent`
- `GET /statistics/`
- `GET /statistics/api/stats`
- `GET|POST /settings/`
- `POST /settings/clear-history`

### Quota/upgrade/payment

- `GET /predict/watch-ad`
- `POST /predict/watch-ad/complete`
- `GET /predict/upgrade`
- `POST /predict/checkout`
- `GET /predict/payment/qr.png`
- `POST /predict/upgrade/buy` (legacy)
- `POST /predict/payments/confirm-transfer`
- `GET /predict/payments`

### Admin

- `GET /users/`
- `GET /users/detail/<user_id>` (JSON)
- `GET /users/<user_id>`
- `POST /users/lock/<user_id>`
- `POST /users/unlock/<user_id>`
- `POST /users/delete/<user_id>`
- `GET|POST /users/init-db`
- `GET /users/confirmations`
- `POST /users/payments/confirm`
- `POST /users/set-plan`

### System/API

- `GET /health`
- `POST /webhook/sepay`
- `POST /` (alias webhook)

---

## 8) Cơ sở dữ liệu

Các bảng chính:

- `users`
- `user_settings`
- `prediction_history`
- `user_quota`
- `payment_orders`
- `sepay_webhook_events`

Schema nền có trong `schema.sql`.

### Khởi tạo DB

Có 2 cách:

1. Chạy SQL trực tiếp:

```bash
mysql -h <host> -u <user> -p <db> < schema.sql
```

2. Dùng script Python:

```bash
python init_db.py
```

---

## 9) Cấu hình môi trường

App tự nạp `.env` (nếu có) trong `app.py`.

### 9.1 MySQL

- `MYSQL_HOST` (default: `localhost`)
- `MYSQL_DATABASE` (default: `khoaluantn`)
- `MYSQL_USER` (default: `root`)
- `MYSQL_PASSWORD` (default: `123456`)
- `MYSQL_PORT` (default: `3306`)

Tương thích thêm alias cũ:

- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_PORT`

### 9.2 Google OAuth

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### 9.3 VietQR / SePay

- `VIETQR_BANK_NAME`
- `VIETQR_BANK_BIN`
- `VIETQR_ACCOUNT_NUMBER`
- `VIETQR_ACCOUNT_NAME`
- `VIETQR_MERCHANT_NAME`
- `VIETQR_MERCHANT_CITY`
- `SEPAY_API_KEY`
- `SEPAY_QR_API` (mặc định: `https://img.vietqr.io/image`)

### 9.4 Cờ luồng thanh toán demo

- `ALLOW_MANUAL_TRANSFER_CONFIRM` (default: `True`)
- `AUTO_CONFIRM_ON_USER_CONFIRM` (default: `False`)

---

## 10) Cài đặt và chạy ứng dụng

### Bước 1: Cài dependencies

```bash
pip install -r requirements.txt
```

### Bước 2: Cấu hình DB + biến môi trường

- Tạo DB MySQL
- Cập nhật `.env` hoặc env hệ thống
- Chạy `schema.sql` hoặc `python init_db.py`

### Bước 3: Chạy app

```bash
python app.py
```

Truy cập: `http://127.0.0.1:5000`

---

## 11) Tài khoản admin

Ứng dụng phân quyền dựa trên cột `users.role`.

Nâng 1 user thành admin:

```sql
UPDATE users SET role = 'admin' WHERE username = '<username_admin>';
```

Khóa user:

```sql
UPDATE users SET is_active = FALSE WHERE username = '<username>';
```

---

## 12) Huấn luyện mô hình (tuỳ chọn)

### 12.1 HOG + SVM

Cấu trúc dữ liệu:

```text
dataset_root/
  Dog/
    husky/*.jpg
    corgi/*.jpg
  Cat/
    bengal/*.jpg
    siamese/*.jpg
```

Train:

```bash
python train.py path/to/dataset_root --models-dir models
```

Sinh ra:

- `models/species_svm.joblib`
- `models/breed_svm.joblib`
- `models/breed_labels.joblib`

### 12.2 YOLOv8 breed (Stanford Dogs)

Chuyển đổi dataset:

```bash
python scripts/stanford_dogs_to_yolo.py --images-root <images_root> --output-root <output_root> --val-ratio 0.2
```

Train YOLO:

```bash
python scripts/train_yolov8_breed.py --data <output_root>/data.yaml --model yolov8n.pt --epochs 100 --imgsz 640 --name breeds
```

Weight đầu ra:

- `runs/detect/breeds/weights/best.pt`

---

## 13) Cấu trúc thư mục quan trọng

- `app.py`: khởi tạo app, đăng ký blueprint, OAuth, middleware
- `upload.py`: nghiệp vụ upload/predict/quota/payment
- `models.py`: data models cho history/settings/quota/payment/webhook events
- `routes/sepay.py`: webhook SePay
- `users.py`: toàn bộ chức năng quản trị
- `schema.sql`: schema MySQL
- `templates/`: giao diện
- `static/`: css/js/uploads
- `runs/detect/`: kết quả train YOLO
- `models/`: nơi để model SVM/YOLO tùy chọn

---

## 14) Lưu ý vận hành

- `app.secret_key` hiện đang hardcode trong `app.py`; nên chuyển sang env ở production.
- Endpoint webhook alias `/` có thể đụng route khác nếu mở rộng app; nên ưu tiên cấu hình đúng `/webhook/sepay`.
- `ALLOW_MANUAL_TRANSFER_CONFIRM=True` chỉ phù hợp demo; production nên ưu tiên webhook xác thực giao dịch tự động.
- File upload đang lưu trong `static/uploads`; cần chính sách dọn dẹp định kỳ nếu triển khai lâu dài.

---

## 15) Kiểm tra nhanh

- Health check:

```bash
curl http://127.0.0.1:5000/health
```

Kỳ vọng:

```json
{ "status": "ok" }
```

- Smoke test YOLO (nếu cần):

```bash
python smoke_test.py
```

---

## 16) Tài liệu tham khảo dữ liệu

- Oxford-IIIT Pet Dataset: https://www.robots.ox.ac.uk/~vgg/data/pets/
- Stanford Dogs Dataset: http://vision.stanford.edu/aditya86/ImageNetDogs/
