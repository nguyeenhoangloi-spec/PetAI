.\ngrok http 5000

# 🎨 Dog Breed Recognition - Modern UI Design System

## Design Philosophy

Giao diện hiện đại, sạch sẽ và đồng nhất với focus vào trải nghiệm người dùng.

## Color Palette

### Primary Colors

- **Primary**: `#6366f1` (Indigo)
- **Primary Dark**: `#4f46e5`
- **Primary Light**: `#818cf8`
- **Secondary**: `#8b5cf6` (Purple)
- **Accent**: `#ec4899` (Pink)

### Gradients

```css
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-warm: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
--gradient-cool: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
```

### Semantic Colors

- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Amber)
- **Error**: `#ef4444` (Red)
- **Info**: `#3b82f6` (Blue)

## Spacing System (8px base)

```css
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-12: 3rem; /* 48px */
```

## Typography

- **Font Family**: System fonts (San Francisco, Segoe UI, Roboto)
- **Base Size**: 16px
- **Line Height**: 1.6
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

## Border Radius

- **Small**: `0.25rem` (4px)
- **Medium**: `0.5rem` (8px)
- **Large**: `0.75rem` (12px)
- **XL**: `1rem` (16px)
- **2XL**: `1.5rem` (24px)
- **Full**: `9999px` (Pills/Circles)

## Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

## Component Classes

### Buttons

- `.btn-primary` - Gradient primary button
- `.btn-outline` - Outline button
- `.btn-large` - Large size
- `.btn-gradient-large` - Large gradient button

### Cards

- `.card` - Basic card container
- `.card-hover` - Card with hover effect
- `.stat-card` - Dashboard stat card
- `.feature-card` - Feature showcase card

### Layout

- `.dashboard-layout` - Main dashboard container
- `.sidebar` - Sidebar navigation
- `.main-content` - Content area
- `.container` - Content wrapper with max-width

### Forms

- `.form-group` - Form field wrapper
- `.form-input` - Text input
- `.select-pro` - Select dropdown
- `.toggle-switch` - Toggle control

## Usage Examples

### Creating a Card

```html
<div class="card card-hover">
  <div class="card-icon">🐕</div>
  <h3>Card Title</h3>
  <p>Card description text</p>
</div>
```

### Using Gradients

```html
<div
  style="background: var(--gradient-primary); color: white; padding: var(--space-8); border-radius: var(--radius-xl);"
>
  <h2>Gradient Background</h2>
</div>
```

### Stat Card

```html
<div class="stat-card stat-card-blue">
  <div class="stat-icon">📊</div>
  <div class="stat-content">
    <div class="stat-number">120+</div>
    <div class="stat-label">Breeds Supported</div>
  </div>
</div>
```

## Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Animation Guidelines

- **Transitions**: `250ms cubic-bezier(0.4, 0, 0.2, 1)`
- **Hover effects**: Subtle transform and shadow changes
- **Page transitions**: Fade in/slide down for modals and alerts

## Accessibility

- Minimum contrast ratio: 4.5:1
- Focus states: Visible outline or ring
- Interactive elements: Min 44x44px touch target
- Semantic HTML: Proper heading hierarchy

## Best Practices

1. Use CSS variables for colors and spacing
2. Maintain consistent spacing with the 8px grid
3. Apply shadows consistently for depth hierarchy
4. Use gradients sparingly for primary CTAs
5. Ensure responsive design for all components
6. Test on multiple devices and browsers

## Ngôn ngữ giao diện (chuẩn dùng chung)

Mục tiêu: tránh trộn Anh–Việt trên cùng màn hình, giữ cảm giác chuyên nghiệp và nhất quán.

### Quy tắc chung

1. Ưu tiên tiếng Việt cho toàn bộ text hiển thị UI.
2. Chỉ giữ tiếng Anh cho tên kỹ thuật bắt buộc (ví dụ: `YOLO`, `API`, `QR`, `Top 3`).
3. Một khái niệm chỉ dùng **một** cách gọi xuyên suốt toàn app.
4. Nhãn nút nên ngắn, dạng hành động: “Tải ảnh”, “Xác nhận”, “Đăng xuất”.

### Bảng quy đổi thuật ngữ chuẩn

- `Home` → `Trang chủ`
- `Upload` → `Tải ảnh`
- `Predict` / `Predict Report` → `Phân tích` / `Báo cáo dự đoán`
- `Dashboard` → `Bảng điều khiển`
- `History` → `Lịch sử`
- `Stats` / `Statistics` → `Thống kê`
- `Pricing` → `Bảng giá`
- `Checkout` / `Secure Checkout` → `Thanh toán` / `Thanh toán bảo mật`
- `Settings` → `Cài đặt`
- `Login` / `Register` / `Logout` → `Đăng nhập` / `Đăng ký` / `Đăng xuất`
- `User` / `Users` → `Người dùng`
- `Admin Panel` → `Quản trị`
- `Plan` → `Gói`
- `Quota` → `Hạn mức`
- `Status` → `Trạng thái`
- `Actions` → `Thao tác`
- `Confirmed At` / `Created At` → `Xác nhận lúc` / `Tạo lúc`

### Quy ước văn phong

- Dùng đại từ trung tính, thân thiện: “Bạn”.
- Câu thông báo ngắn, rõ nguyên nhân + hướng xử lý.
- Tránh viết hoa toàn bộ trừ trường hợp mã/nhãn kỹ thuật.

## File Structure

```
static/
├── css/
│   └── style.css          # Main stylesheet
├── images/                # Static images
├── js/                    # JavaScript files
└── uploads/               # User uploads
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 13+, Chrome Android latest

---

**Version**: 2.0
**Last Updated**: January 2026
**Design System**: Modern Gradient UI

---

## Functional UI Spec (để redesign chuyên nghiệp)

Mục này mô tả chi tiết chức năng thật sự của hệ thống để thiết kế lại UI đúng nghiệp vụ.

### 1) Information Architecture (IA)

- Public: `Home`, `Login`, `Register`, `Forgot password`
- User zone: `Dashboard`, `Upload Page`, `Predict Result`, `History`, `Statistics`, `Settings`, `Upgrade`, `Checkout/Payments`, `Watch Ad`
- Admin zone: `Users list`, `User detail`, `Confirmations`, `Set plan`, `Lock/Unlock/Delete`

### 2) Luồng chính người dùng

1. User đăng nhập.
2. Vào `Upload Page` để chọn ảnh.
3. Hệ thống kiểm tra quota/gói.
4. Chạy detect dog/cat (YOLO), rồi suy luận giống chó bằng model hybrid mới.
5. Hiển thị `Predict Result` với:
   - giống top-1,
   - độ tin cậy,
   - top-5 giống gần nhất,
   - giải thích quyết định pure/hybrid.
6. Lưu lịch sử dự đoán và cập nhật lượt dùng.

### 3) Quy tắc AI & business hiện tại (phải phản ánh trên UI)

- Detect loài dùng YOLO (`Dog/Cat`) + confidence.
- Gate xác nhận chó:
  - `DOG_THRESHOLD = 0.55` từ YOLO, hoặc
  - fallback nếu `breed_conf >= 0.70` từ model giống.
- Model giống dùng `classifier + prototypes` và đã bật `TTA + averaging` (gốc + flip + center-crop).
- Với ảnh có bbox chó: hệ thống crop vùng chó trước khi suy luận giống để giảm nhiễu nền.
- Logic hybrid:
  - `min_score = 0.70`
  - `max_gap = 0.08`
  - nếu top1/top2 đều >= min_score và gap <= max_gap => ứng viên lai.

### 4) Contract dữ liệu màn Predict (UI nên bám đúng)

`result` object trả về có các trường quan trọng:

- `result.breed`: tên giống hiển thị (đã Việt hóa)
- `result.breed_conf`: điểm top-1 (0..1)
- `result.note`: thông điệp kết luận ngắn
- `result.parts_info.top5[]`:
  - `breed` (vi)
  - `breed_en` (gốc)
  - `score`
- `result.parts_info.decision`:
  - `is_hybrid_candidate`
  - `reason`
  - `top1_score`, `top2_score`, `score_gap`
  - `min_score`, `max_gap`
- Ngoài ra còn `yolo_species`, `yolo_species_conf`, `yolo_detections`

### 5) Màn hình & trạng thái bắt buộc

#### 5.1 Upload Page

- Hiển thị quota hiện tại (free/paid, remaining, ad unlocks).
- CTA rõ ràng: `Tải ảnh`, `Xem quảng cáo`, `Nâng cấp gói`.
- State:
  - chưa đăng nhập,
  - hết free nhưng còn ads,
  - hết free và hết ads,
  - plan trả phí active,
  - plan expired/hết lượt.

#### 5.2 Predict Result

- Card ảnh phân tích (ưu tiên ảnh annotate có bbox).
- Card kết quả chính:
  - Breed top-1 + confidence bar
  - Loài YOLO + confidence chip
  - Danh sách detection tags
  - Top-5 similarity (rank + score + bar)
  - Decision block (Pure/Hybrid badge + lý do + chỉ số gap/ngưỡng)
- State:
  - không đủ chắc là chó (show warning + CTA upload lại)
  - model chưa sẵn sàng (artifact thiếu)
  - infer lỗi runtime

#### 5.3 History

- Danh sách dự đoán theo thời gian, phân trang.
- Item tối thiểu: ảnh thumbnail, breed, confidence, species, timestamp.
- Empty state: chưa có lịch sử.

#### 5.4 Statistics

- KPI cards: tổng lượt, trung bình confidence, top breeds.
- Biểu đồ xu hướng theo thời gian nếu có dữ liệu.
- Empty state thân thiện + CTA đi upload.

#### 5.5 Upgrade / Payments

- So sánh gói `free/basic/pro/enterprise` rõ quyền lợi.
- Trạng thái đơn: `pending`, `user_confirmed`, `paid`, `failed`.
- Luồng QR + xác nhận chuyển khoản phải có progress rõ ràng.

### 6) Nguyên tắc UX cho bản “chuyên nghiệp”

- Ưu tiên clarity hơn decoration: người dùng phải hiểu “vì sao ra kết luận này”.
- Không hiển thị một điểm số đơn lẻ; luôn có context (Top-5 + gap + threshold).
- Với confidence thấp (`~0.6x`), dùng label `Trung bình/Thấp` thay vì tạo cảm giác chắc chắn.
- Với ảnh không đạt điều kiện chó, hiển thị hướng dẫn cải thiện ảnh (toàn thân/mặt rõ, ánh sáng tốt).

### 7) Tone nội dung gợi ý (viết UI copy)

- Thay vì: “Sai rồi”
- Dùng: “Kết quả chưa đủ chắc chắn. Hệ thống gợi ý thử ảnh rõ hơn để tăng độ chính xác.”

### 8) Checklist bàn giao cho UI redesign

- [ ] Có đủ state loading/empty/error/success cho mọi màn chính.
- [ ] Predict card hiển thị đầy đủ Top-5 + decision reason.
- [ ] Quota/plan/payment state được biểu diễn nhất quán.
- [ ] CTA theo ngữ cảnh (upload lại, xem ad, nâng cấp).
- [ ] Responsive tốt cho mobile và desktop.

**Functional Spec Version**: 3.0
**Last Updated**: February 2026
