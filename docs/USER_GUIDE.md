# Hướng dẫn sử dụng hệ thống PetAI

Chào mừng bạn đến với **PetAI** - Hệ thống nhận diện giống chó thông minh sử dụng Trí tuệ nhân tạo (AI). Tài liệu này sẽ hướng dẫn chi tiết cho bạn toàn bộ quy trình từ đăng ký, đăng nhập, tải ảnh nhận diện, hiểu kết quả phân tích đến nâng cấp gói cước và quản trị tài khoản trên hệ thống của chúng tôi.

---

## Mục lục
1. [Giới thiệu hệ thống PetAI](#1-giới-thiệu-hệ-thống-petai)
2. [Hướng dẫn đăng ký tài khoản](#2-hướng-dẫn-đăng-ký-tài-khoản)
3. [Hướng dẫn đăng nhập](#3-hướng-dẫn-đăng-nhập)
4. [Hướng dẫn sử dụng gói miễn phí (Free Plan)](#4-hướng-dẫn-sử-dụng-gói-miễn-phí-free-plan)
5. [Hướng dẫn tải ảnh để nhận diện giống chó](#5-hướng-dẫn-tải-ảnh-để-nhận-diện-giống-chó)
6. [Quy trình xử lý của AI](#6-quy-trình-xử-lý-của-ai)
7. [Ý nghĩa kết quả nhận diện giống](#7-ý-nghĩa-kết-quả-nhận-diện-giống)
8. [Hướng dẫn nâng cấp gói dịch vụ](#8-hướng-dẫn-nâng-cấp-gói-dịch-vụ)
9. [Quy trình thanh toán](#9-quy-trình-thanh-toán)
10. [Cách xem và quản lý lịch sử nhận diện](#10-cách-xem-và-quản-lý-lịch-sử-nhận-diện)
11. [Cách xem thống kê cá nhân](#11-cách-xem-thống-kê-cá-nhân)
12. [Quản lý tài khoản và thiết lập cá nhân](#12-quản-lý-tài-khoản-và-thiết-lập-cá-nhân)
13. [Các chức năng dành cho quản trị viên (Admin)](#13-các-chức-năng-dành-cho-quản-trị-viên-admin)
14. [Chức năng đang phát triển](#14-chức-năng-đang-phát-triển)
15. [Câu hỏi thường gặp (FAQ)](#15-câu-hỏi-thường-gặp-faq)
16. [Lưu ý quan trọng khi sử dụng](#16-lưu-ý-quan-trọng-khi-sử-dụng)

---

## 1. Giới thiệu hệ thống PetAI
**PetAI** là một nền tảng tiên tiến hỗ trợ nhận diện và phân tích giống chó qua hình ảnh dựa trên các mô hình học máy hiện đại:
*   **Phát hiện và định vị đối tượng**: Sử dụng mô hình **YOLOv8** (`yolov8s.pt`) để quét hình ảnh đầu vào, tự động xác định vùng chứa chú chó trong khung ảnh và vẽ hộp giới hạn (Bounding Box) trực quan.
*   **Phân loại giống chó**: Sử dụng mô hình **Classifier** dựa trên mạng học sâu (EfficientNet-B0 hoặc ResNet50) kết hợp cơ chế tính toán độ tương đồng Morphological với các mẫu chuẩn (**Prototype Similarity**) để xếp hạng Top-3/Top-5 giống chó gần nhất.
*   **Giải thích kết quả trực quan (Grad-CAM)**: Tích hợp kỹ thuật nhiệt đồ Grad-CAM động và tĩnh để chỉ ra những vùng đặc trưng mà mạng nơ-ron tập trung phân tích nhiều nhất trên cơ thể và khuôn mặt chú chó.

Hệ thống hoạt động trên trang web chính thức [pet.ai](http://pet.ai).

---

## 2. Hướng dẫn đăng ký tài khoản
Để bắt đầu sử dụng đầy đủ các tính năng của PetAI, bạn cần đăng ký một tài khoản thành viên:
1.  Truy cập trang đăng ký tại đường dẫn `/register`.
2.  Điền đầy đủ thông tin vào biểu mẫu:
    *   **Họ và tên**: Tối thiểu 2 ký tự và không vượt quá 128 ký tự.
    *   **Địa chỉ Email**: Nhập đúng định dạng email cá nhân của bạn (hệ thống sẽ kiểm tra trùng lặp).
    *   **Tên đăng nhập (Username)**: Độ dài từ 3 đến 20 ký tự, chỉ chứa chữ cái không dấu, chữ số và dấu gạch dưới (`^[a-zA-Z0-9_]{3,20}$`).
    *   **Mật khẩu**: Tối thiểu 6 ký tự để bảo mật tài khoản.
3.  Nhấp vào nút **Đăng ký**. Nếu thông tin hợp lệ, hệ thống sẽ thông báo thành công và tự động chuyển hướng bạn tới trang đăng nhập.

---

## 3. Hướng dẫn đăng nhập
Hệ thống PetAI hỗ trợ hai phương thức đăng nhập tiện lợi:

### Đăng nhập thông thường
1.  Truy cập đường dẫn `/login`.
2.  Nhập **Tên đăng nhập** (hoặc địa chỉ Email) và **Mật khẩu** đã đăng ký.
3.  Nhấn nút **Đăng nhập**.

### Đăng nhập nhanh bằng tài khoản Google
1.  Tại trang `/login`, nhấp vào nút **Đăng nhập bằng Google**.
2.  Hệ thống sẽ chuyển hướng bạn tới trang xác thực Google OAuth (`/login/google`).
3.  Chọn tài khoản Google của bạn để xác thực. 
    *   *Đối với người dùng mới*: Hệ thống sẽ tự động đăng ký tài khoản dựa trên Email Google của bạn và tự tạo một tên đăng nhập ngẫu nhiên an toàn.
    *   *Đồng bộ ứng dụng di động (Flutter)*: Hỗ trợ luồng xác thực và trả lời kết quả token về ứng dụng Flutter qua deep link dạng `petai://auth`.

---

## 4. Hướng dẫn sử dụng gói miễn phí (Free Plan)
Ngay sau khi đăng ký tài khoản thành công, bạn sẽ được tự động kích hoạt **Gói miễn phí (Free Plan)**:
*   **Lượt nhận diện mặc định**: Bạn có sẵn **10 lượt quét nhận diện giống chó** miễn phí ban đầu.
*   **Lượt mở khóa từ quảng cáo**: Khi bạn sử dụng hết 10 lượt mặc định, hệ thống cho phép bạn xem **Quảng cáo giả lập** để nhận thêm lượt quét:
    *   Nhấp vào liên kết `/predict/watch-ad` hoặc bấm nút xem quảng cáo hiển thị khi hết lượt.
    *   Sau mỗi lượt xem quảng cáo giả lập thành công, bạn sẽ được **cộng thêm 3 lượt nhận diện** vào hạn mức tài khoản.
    *   **Giới hạn**: Số lượt xem quảng cáo tối đa là **3 lần** (tổng cộng nhận thêm tối đa 9 lượt quét miễn phí).
*   **Khi hết lượt miễn phí và lượt quảng cáo**: Hệ thống sẽ yêu cầu bạn nâng cấp lên gói dịch vụ trả phí để có thể tiếp tục phân tích ảnh.

---

## 5. Hướng dẫn tải ảnh để nhận diện giống chó
Quy trình gửi yêu cầu nhận diện diễn ra rất đơn giản tại trang nhận diện:
1.  Truy cập trang nhận diện qua đường dẫn `/predict/upload-page` hoặc nhấp vào mục **Nhận diện AI** trên thanh điều hướng.
2.  Tại khu vực tải ảnh, nhấp chuột hoặc kéo thả ảnh của bạn vào khung để chọn tệp.
    *   *Định dạng tệp hỗ trợ*: `.jpg`, `.jpeg`, `.png`.
3.  Nhấn nút **Phân tích giống chó**. Hệ thống sẽ bắt đầu truyền ảnh và tiến hành tính toán.

---

## 6. Quy trình xử lý của AI
Khi bạn bấm nút phân tích, ảnh của bạn sẽ đi qua quy trình xử lý 5 bước khép kín trên máy chủ:
1.  **Phát hiện vùng đối tượng (YOLOv8)**: Hệ thống sử dụng mô hình phát hiện đối tượng YOLOv8s để tìm kiếm chú chó trong hình ảnh với ngưỡng tin cậy phát hiện tối thiểu là 12% (`YOLO_GATE_MIN_CONF = 0.12`).
2.  **Cắt vùng ảnh (Dog Crop)**: Sau khi phát hiện thành công vật thể là chó (`dog`), hệ thống tự động cắt riêng vùng ảnh đó ra, thêm khoảng 8% padding lề để đảm bảo không làm mất các chi tiết đặc trưng ở rìa tai, đuôi hoặc chân chú chó.
3.  **Tính toán phân loại giống (Classifier)**: Vùng ảnh cắt được đưa qua mạng nơ-ron phân loại (EfficientNet-B0 hoặc ResNet50) để dự đoán xác suất softmax cho các lớp giống chó khác nhau.
4.  **So khớp đặc trưng (Prototype Similarity)**: Hệ thống so sánh vector đặc trưng được trích xuất từ ảnh tải lên với các vector đặc trưng trung bình mẫu (Prototypes) của hơn 120 giống chó thuần chủng để cho ra điểm số tương đồng chính xác nhất.
5.  **Tạo ảnh kết quả**: Hệ thống vẽ một hộp khung màu cam (Bounding Box) khoanh vùng chú chó kèm nhãn hiển thị mức độ tin cậy của YOLO (ví dụ: `DOG 92%`) và tạo nhiệt đồ Grad-CAM trước khi hiển thị kết quả.

---

## 7. Ý nghĩa kết quả nhận diện giống
Kết quả phân tích trả về từ AI được phân chia thành các chế độ rõ ràng để người dùng dễ hiểu:

### 1. Trường hợp giống chó Thuần chủng (hoặc chiếm ưu thế tuyệt đối)
*   **Điều kiện**: Độ tin cậy dự đoán cao nhất (softmax confidence) lớn hơn hoặc bằng ngưỡng chấp nhận của hệ thống (mặc định là `70%` hoặc `80%` tuỳ cấu hình hệ thống).
*   **Hiển thị**: Hệ thống kết luận một giống chó cụ thể đứng đầu bảng (ví dụ: *Chó Alaska*, *Chó Golden Retriever*...). Đồng thời hiển thị thông tin chi tiết về đặc điểm ngoại hình, tính cách và cẩm nang hướng dẫn chăm sóc giống chó này.
*   **Giải thích trực quan**: Hiển thị nhiệt đồ Grad-CAM chỉ ra vùng đặc trưng giúp AI đưa ra kết luận (vùng mắt, tai hoặc lông).

### 2. Trường hợp giống chó Nghi lai (Estimated Hybrid Ratio)
*   **Điều kiện**: Điểm số tương đồng Morphological giữa giống đứng đầu (Top-1) và giống đứng thứ hai (Top-2) có khoảng cách vô cùng nhỏ, nằm trong ngưỡng sai số cho phép (`score_gap <= max_gap` hoặc `tie_max_gap`).
*   **Hiển thị**: Hệ thống hiển thị kết quả dạng **Nghi lai: [Tên giống 1] x [Tên giống 2]** cùng với tỷ lệ phần trăm phân bố đặc trưng ước tính của cả 2 giống.
*   **Giải thích trực quan**: Hệ thống kích hoạt hiển thị đồng thời hai bản nhiệt đồ Grad-CAM động cho cả hai giống này để bạn so sánh các đặc điểm lai tạo rõ rệt.

### 3. Cảnh báo hình ảnh không chắc chắn
*   Nếu ảnh của bạn quá mờ, chụp ở góc khuất hoặc không phát hiện thấy đối tượng là chó rõ ràng (ngưỡng YOLO < 40% và bộ phân loại giống < 55%), hệ thống vẫn trả về giống chó dự đoán gần nhất nhưng sẽ hiển thị cảnh báo màu vàng: *"Ảnh này chưa được nhận diện chắc chắn là CHÓ. Kết quả giống dưới đây chỉ mang tính tham khảo."*

---

## 8. Hướng dẫn nâng cấp gói dịch vụ
Để nâng cấp hoặc gia hạn gói cước sử dụng không giới hạn hoặc tăng số lượt quét, bạn truy cập trang nâng cấp gói tại đường dẫn `/predict/upgrade`.

Hệ thống hỗ trợ 3 gói cước trả phí chuyên nghiệp:
1.  **Gói Basic (Cơ bản)**: 
    *   *Hạn mức*: **50 lượt quét nhận diện**.
    *   *Thời gian sử dụng*: **7 ngày**.
    *   *Chi phí*: **1.000 VNĐ**.
2.  **Gói Pro (Chuyên nghiệp)**:
    *   *Hạn mức*: **200 lượt quét nhận diện**.
    *   *Thời gian sử dụng*: **30 ngày**.
    *   *Chi phí*: **5.000 VNĐ**.
3.  **Gói Enterprise (Doanh nghiệp)**:
    *   *Hạn mức*: **Không giới hạn số lượt quét**.
    *   *Thời gian sử dụng*: **90 ngày**.
    *   *Chi phí*: **15.000 VNĐ**.

**Quy tắc mua gói**:
*   Bạn có thể nâng cấp lên gói cước cao hơn bất cứ lúc nào (ví dụ từ Basic lên Pro hoặc Pro lên Enterprise).
*   Không được phép mua gói thấp hơn khi gói cao hơn hiện tại của bạn vẫn còn hiệu lực.
*   Bạn chỉ có thể thực hiện gia hạn lại gói cước cùng cấp khi gói hiện tại đã hết hạn sử dụng hoặc tài khoản của bạn đã dùng hết số lượt quét của gói.

---

## 9. Quy trình thanh toán
Hệ thống sử dụng cổng đối soát giao dịch và tạo mã thanh toán QR tự động:

1.  **Tạo đơn hàng**: Tại trang nâng cấp `/predict/upgrade`, chọn gói cước mong muốn và nhấn nút **Mua gói**. Hệ thống sẽ tự động tạo một đơn hàng mới ở trạng thái `pending` và chuyển bạn tới trang hóa đơn tại `/predict/checkout`.
2.  **Quét mã VietQR**:
    *   Trang hóa đơn sẽ hiển thị thông tin tài khoản ngân hàng thụ hưởng kèm theo một **Mã QR (VietQR) compact2** được tạo tự động.
    *   Ảnh mã QR này chứa sẵn thông tin tài khoản, số tiền tương ứng của gói cước và nội dung chuyển khoản bắt buộc dạng: `DOGAI [PLAN] [ORDER_ID]` (Ví dụ: `DOGAI PRO 3f7a1b9e2c4d`).
3.  **Thanh toán tự động**:
    *   Mở ứng dụng ngân hàng trên điện thoại di động và thực hiện quét mã QR hiển thị trên màn hình.
    *   *Lưu ý*: Giữ nguyên số tiền và nội dung chuyển khoản tự động. Không tự ý chỉnh sửa nội dung chuyển khoản vì cổng thanh toán SePay Webhook (`/webhook/sepay`) sẽ dựa vào mã này để đối soát tự động.
    *   Sau khi chuyển khoản thành công, hệ thống sẽ tự động ghi nhận biến động số dư và nâng cấp tài khoản của bạn trong vòng từ 1 đến 5 phút.
4.  **Xác nhận thủ công (Báo đã chuyển tiền)**:
    *   Nếu ứng dụng của bạn không tự động chuyển trạng thái, bạn có thể nhấn nút **"Tôi đã chuyển tiền"** trên màn hình hóa đơn.
    *   Đơn hàng sẽ chuyển trạng thái sang `user_confirmed` và xuất hiện trong danh sách duyệt thủ công của Quản trị viên (Admin). Bạn có thể theo dõi trạng thái đơn hàng của mình tại mục lịch sử giao dịch `/predict/payments`.

---

## 10. Cách xem và quản lý lịch sử nhận diện
Mỗi lượt nhận diện thành công của bạn đều được lưu trữ bảo mật trên hệ thống để bạn dễ dàng tra cứu lại:
1.  Truy cập trang **Lịch sử** tại đường dẫn `/history/`.
2.  **Các công cụ hỗ trợ lọc**:
    *   **Lọc theo phân loại giống**: Chọn tab *Tất cả* (All), *Thuần chủng* (Purebred) hoặc *Chó lai* (Hybrid).
    *   **Tìm kiếm**: Nhập từ khóa tên giống chó vào ô tìm kiếm và nhấn Enter để lọc nhanh danh sách.
    *   **Phân trang**: Danh sách lịch sử hiển thị tối đa 30 bản ghi mỗi trang, bấm số trang ở cuối danh sách để chuyển trang.
3.  **Xem chi tiết**: Bấm vào ảnh hoặc kết quả nhận diện để hiển thị modal xem lại chi tiết phân tích, Bounding box và nhiệt đồ Grad-CAM của ảnh đó.
4.  **Xóa lịch sử**: Nếu muốn xóa một lượt quét cụ thể khỏi danh sách, bạn nhấp vào biểu tượng/nút **Xóa** tương ứng với bản ghi đó.

---

## 11. Cách xem thống kê cá nhân
PetAI cung cấp các công cụ trực quan giúp bạn xem báo cáo phân tích về các hoạt động nhận diện của mình:
1.  Truy cập trang **Thống kê** tại đường dẫn `/statistics/`.
2.  **Thông tin tổng quan**: Xem tổng số lần quét, số giống chó khác nhau đã được nhận diện và độ tin cậy trung bình (%) của các lượt quét.
3.  **Bộ lọc thời gian**: Chọn xem báo cáo trong phạm vi *7 ngày gần nhất*, *30 ngày gần nhất* hoặc *Tất cả thời gian*.
4.  **Các biểu đồ trực quan**:
    *   *Biểu đồ xu hướng nhận diện*: Biểu đồ đường biểu diễn số lượt tải ảnh phân tích qua từng ngày.
    *   *Top các giống chó quét nhiều nhất*: Biểu đồ cột thể hiện các giống chó bạn sở hữu hoặc quét nhiều nhất.
    *   *Phân bố độ tin cậy*: Biểu đồ tròn biểu thị tỷ lệ phần trăm các mức độ chính xác của ảnh tải lên (0-20%, 20-40%, 40-60%, 60-80%, 80-100%).

---

## 12. Quản lý tài khoản và thiết lập cá nhân
Tại trang **Cài đặt** (`/settings/`), bạn có thể tùy chỉnh các thiết lập cá nhân:
*   **Cập nhật Họ và tên**: Thay đổi tên hiển thị của bạn trên hệ thống (độ dài từ 2 đến 128 ký tự).
*   **Cấu hình giao diện (Theme)**: Tùy chỉnh chế độ màu sắc hiển thị của website phù hợp với sở thích:
    *   *Sáng (Light Mode)*.
    *   *Tối (Dark Mode)*.
    *   *Tự động (Auto)*: Tự động đổi chế độ theo cài đặt hệ điều hành của thiết bị bạn dùng.
*   **Cài đặt thông báo**: Bật hoặc tắt chức năng nhận thông báo trực tiếp trên website và thông báo qua Email.
*   **Xóa toàn bộ lịch sử quét (Clear History)**: 
    *   Nếu muốn làm sạch dữ liệu, bạn nhấn vào nút **Xóa lịch sử nhận diện**.
    *   *Cơ chế bảo mật*: Hệ thống sẽ xóa toàn bộ bản ghi lịch sử trong cơ sở dữ liệu và **đồng thời xóa hoàn toàn các tệp ảnh vật lý** bạn đã tải lên trước đó khỏi ổ cứng máy chủ để đảm bảo tính riêng tư của bạn.

---

## 13. Các chức năng dành cho quản trị viên (Admin)
Các tài khoản có quyền Quản trị viên (`role = 'admin'`) sẽ được hiển thị thêm bảng điều khiển quản trị chuyên nghiệp:

### 1. Quản lý người dùng (`/users/`)
*   Xem danh sách toàn bộ các thành viên trên hệ thống kèm theo thông tin gói cước và hạn mức tương ứng.
*   Tìm kiếm người dùng theo tên hoặc email.
*   **Khóa/Mở khóa tài khoản**: Tạm thời khóa quyền truy cập (`is_active = FALSE`) đối với người dùng vi phạm quy định và mở khóa lại khi cần thiết.
*   **Xóa tài khoản**: Cho phép xóa tài khoản người dùng ra khỏi cơ sở dữ liệu. *Lưu ý*: Chỉ xóa được tài khoản người dùng chưa phát sinh dữ liệu nhận diện hoặc đơn hàng thanh toán trên hệ thống để đảm bảo tính toàn vẹn dữ liệu.
*   **Cấp gói trực tiếp**: Admin có quyền cấp trực tiếp bất kỳ gói cước nào (Basic, Pro, Enterprise, Free) cho người dùng mà không cần thông qua luồng thanh toán hóa đơn.

### 2. Quản lý và duyệt đơn thanh toán (`/users/confirmations`)
*   Hiển thị danh sách các đơn hàng người dùng đã chuyển tiền thủ công và bấm báo xác nhận (`user_confirmed`).
*   **Duyệt đơn thủ công**: Nhấn nút **Xác nhận thanh toán** để phê duyệt đơn hàng và tự động nâng cấp gói dịch vụ tương ứng cho tài khoản người dùng.
*   **Thống kê doanh thu**: Xem tổng số đơn hàng đã hoàn thành, tổng doanh thu thực tế (VNĐ) nhận được và danh sách các đơn hàng được duyệt gần nhất.

### 3. Khởi tạo dữ liệu hệ thống (`/users/init-db`)
*   Công cụ dành riêng cho kỹ thuật viên để khởi tạo cấu trúc bảng cơ sở dữ liệu ban đầu hoặc nâng cấp schema dữ liệu khi hệ thống cập nhật.

---

## 14. Chức năng đang phát triển
*   **Quên mật khẩu / Khôi phục mật khẩu**: Chức năng yêu cầu cấp lại mật khẩu qua email reset password tại đường dẫn `/account/forgot` hiện đang ở dạng giao diện mô phỏng và hiển thị thông báo giả lập. Logic gửi email reset thực tế là **chức năng đang phát triển** và sẽ sớm được ra mắt trong các phiên bản cập nhật tiếp theo.

---

## 15. Câu hỏi thường gặp (FAQ)

### Q1: Tại sao hệ thống cảnh báo ảnh của tôi chưa được nhận diện chắc chắn là chó?
AI sử dụng mô hình YOLOv8 để định vị vùng cơ thể chú chó. Nếu hình ảnh quá mờ, chú chó bị che khuất quá nhiều bởi ngoại cảnh, hoặc có nhiều vật thể gây nhiễu, AI có thể không khoanh vùng chính xác được. Hãy thử lại bằng một bức ảnh chụp rõ ràng và trực diện hơn.

### Q2: Tôi đã chuyển khoản mua gói cước nhưng tài khoản vẫn ở gói miễn phí?
Khi bạn chuyển khoản qua mã VietQR, nếu bạn tự ý sửa số tiền hoặc nội dung chuyển khoản, hệ thống SePay tự động sẽ không đối soát được đơn hàng. 
*   *Cách khắc phục*: Truy cập mục **Lịch sử giao dịch** tại `/predict/payments`, tìm đơn hàng tương ứng và nhấn nút **"Tôi đã chuyển tiền"** để báo cho Admin duyệt thủ công đơn hàng cho bạn.

### Q3: Sau khi hết thời hạn của gói cước trả phí thì điều gì xảy ra?
Khi gói cước trả phí hết hạn sử dụng (ví dụ sau 30 ngày đối với gói Pro), tài khoản của bạn sẽ tự động chuyển về trạng thái **Gói miễn phí (Free Plan)** với các quy định hạn mức và xem quảng cáo mặc định ban đầu.

---

## 16. Lưu ý quan trọng khi sử dụng
*   Hệ thống PetAI chỉ sử dụng hình ảnh để phân tích đặc điểm morphological bên ngoài để đưa ra dự đoán về giống chó lai hay thuần chủng, kết quả này mang tính chất tham khảo khoa học và hỗ trợ thông tin, **không có giá trị thay thế cho các xét nghiệm bản đồ gene/di truyền học thuần chủng chính thức**.
*   Để đảm bảo an toàn thông tin cá nhân, bạn có thể chủ động sử dụng tính năng **Xóa toàn bộ lịch sử** trong trang Cài đặt để xóa triệt để mọi hình ảnh cá nhân đã tải lên khỏi bộ lưu trữ của máy chủ PetAI.
