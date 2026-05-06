# COLAB HYBRID 4 STEP (BẢN DỄ CHẠY TỪ ĐẦU)

Khuyên dùng: EfficientNet-B0

Mục tiêu: copy đúng từng cell theo thứ tự A -> H là chạy được.

## Quy trình thuật toán sử dụng (Hybrid 4-step)

Pipeline này dùng **một backbone CNN** (ResNet50 hoặc EfficientNet-B0) để:

1. học phân loại giống (breed) bằng supervised learning,
2. trích **embedding** (vector đặc trưng) từ backbone,
3. tạo **prototype embedding** cho từng giống,
4. suy luận “lai hình thái” bằng **độ tương đồng cosine** + bộ ngưỡng.

### Bước 1 — Train classifier (lệnh `train`)

- **Input**: dataset dạng thư mục lớp `data-dir/class_name/image.*`
- **Tiền xử lý**:
  - Train: resize → random resized crop → flip → color jitter → normalize ImageNet
  - Val: resize cố định → normalize ImageNet
- **Chia tập**: stratified split theo lớp (mặc định `val_ratio=0.2`).
- **Mô hình**: backbone pretrained ImageNet, thay head để ra `num_classes`.
- **Tối ưu**: AdamW + CosineAnnealingLR, CrossEntropy có `label_smoothing`.
- **Output**:
  - `last_classifier.pth` (luôn cập nhật mỗi epoch)
  - `best_classifier.pth` (khi `val_acc` tốt hơn)
  - `class_to_idx.json`

### Bước 2 — Grad-CAM + pseudo parts (lệnh `gradcam`)

- **Mục đích**: tạo heatmap trung bình theo giống và cắt “bộ phận giả lập” (pseudo part) dựa trên vùng kích hoạt mạnh.
- **Cách làm**:
  - Với mỗi ảnh, tính Grad-CAM tại lớp đúng (ground-truth class).
  - Cộng dồn để lấy **mean Grad-CAM** cho từng lớp.
  - Nếu bật `--save-individual-parts`: tạo mask nhị phân `cam >= max(cam) * threshold`, lấy bounding box của mask và crop ảnh gốc tương ứng.
- **Output**:
  - `heatmap-out/` chứa mean heatmap theo lớp
  - `parts-out/` chứa các crop pseudo parts theo lớp

### Bước 3 — Build class prototypes (lệnh `prototypes`)

- **Mục đích**: tạo một vector đại diện (prototype) cho từng giống.
- **Cách làm**:
  - Với mỗi ảnh, trích embedding từ backbone (sau avgpool), rồi chuẩn hoá $L_2$.
  - Với mỗi lớp $c$, lấy trung bình embedding: $p_c = \frac{1}{N_c}\sum_i e_i$ rồi chuẩn hoá $L_2$ lần nữa.
- **Output**:
  - `class_prototypes.npy` (ma trận prototype theo thứ tự lớp)
  - `classes.json` (danh sách tên lớp theo đúng thứ tự trong checkpoint)

### Bước 4 — Inference hybrid (lệnh `infer`)

- **Input**: 1 ảnh, checkpoint classifier, và `class_prototypes.npy`.
- **Tính toán chính**:
  - Trích embedding $e$ cho ảnh, chuẩn hoá $L_2$.
  - Tính similarity với mọi prototype: $s_c = p_c^\top e$ (tương đương cosine vì đã chuẩn hoá).
  - Lấy top-$k$ theo $s_c$.
- **Nhận biết chó lai vs chó thuần (điều kiện “nghi lai”)**:
  - Thuật toán _không_ dùng xét nghiệm DNA; đây là suy luận **lai hình thái** dựa trên mức giống nhau về đặc trưng thị giác.
  - **Ký hiệu**:
    - $x$: ảnh đầu vào; $f(\cdot)$: backbone CNN sau khi train.
    - $e=f(x)\in\mathbb{R}^d$: embedding của ảnh (vector đặc trưng).
    - $p_c\in\mathbb{R}^d$: prototype của lớp/giống $c$.
    - Chuẩn hoá $L_2$: $\hat{v}=\frac{v}{\lVert v\rVert_2+\varepsilon}$.
  - **Cosine similarity**:
    - Sau khi chuẩn hoá $L_2$, độ tương đồng cosine giữa ảnh và prototype lớp $c$ là:
      $$s_c = \cos(\hat{e},\hat{p}_c)=\hat{p}_c^\top\hat{e}$$
    - Vì $\hat{e},\hat{p}_c$ đã chuẩn hoá nên tích vô hướng $\hat{p}_c^\top\hat{e}$ chính là cosine similarity.
  - Giả sử có ít nhất 2 lớp trong top-$k$:
    - $s_1$ = similarity của giống top-1, $s_2$ = similarity của giống top-2.
    - `gap = s1 - s2` (độ cách biệt giữa 2 giống đầu).
    - `ratio = s2 / s1` (mức “bám sát” của top-2 so với top-1).
    - `mean = (s1 + s2) / 2` (độ tin cậy trung bình của cặp top-2).
  - Tạo ngưỡng khoảng cách hiệu dụng (để ép top-1 và top-2 phải _gần nhau_):
    - `effective_max_gap = min(max_gap, (1 - min_ratio) * s1)`
    - Ý nghĩa: nếu muốn `ratio >= min_ratio` thì tương đương cần `s2 >= min_ratio * s1` ⇒ `gap = s1 - s2 <= (1 - min_ratio) * s1`.
  - Kết luận **“nghi lai”** nếu **đồng thời**:
    - (C1) $s_1 \ge$ `min_score` (top-1 đủ cao)
    - (C2) $s_2 \ge$ `min_score_2` (top-2 cũng đủ cao)
    - (C3) `gap <= effective_max_gap` (top-1 và top-2 đủ sát nhau, tức `ratio` đủ lớn)
    - (C4) $\frac{s_1+s_2}{2} \ge$ `min_mean_score` (cả cặp đủ mạnh, tránh trường hợp 2 điểm đều thấp nhưng vẫn “gần nhau”)
  - Nếu **không** thoả cả 4 điều kiện ⇒ kết luận **thuần/giống trội** = giống top-1.

**Diễn giải chi tiết ý nghĩa các điều kiện**

- (C1) `min_score` đảm bảo ảnh có **ít nhất một** giống khớp rõ ràng (tránh trường hợp ảnh ngoài dữ liệu huấn luyện).
- (C2) `min_score_2` đảm bảo giống thứ 2 cũng “đủ thật”, không phải nhiễu.
- (C3) `gap <= effective_max_gap` là điều kiện “lai hình thái”: top-2 phải **gần** top-1.
  - Nếu chỉ dùng `max_gap` cố định thì khi $s_1$ cao/ thấp, tiêu chuẩn “gần nhau” có thể bị lệch.
  - Thành phần $(1-\text{min\_ratio})\cdot s_1$ làm điều kiện tỷ lệ (scale theo $s_1$), tương đương buộc $\frac{s_2}{s_1}\ge \text{min\_ratio}$.
  - Lấy `min(...)` để giới hạn trên bằng `max_gap` (không cho phép quá “thoáng”).
- (C4) `min_mean_score` tránh trường hợp **cả hai điểm đều thấp** nhưng vẫn “gần nhau” (ví dụ ảnh mờ khiến mọi $s_c$ đều nhỏ).

**Bảng ngưỡng theo profile (giống hệt trong code)**

| `--profile` | `min_score` | `min_score_2` | `max_gap` | `min_ratio` | `min_mean_score` |
| ----------- | ----------: | ------------: | --------: | ----------: | ---------------: |
| `strict`    |        0.70 |          0.70 |      0.08 |        0.90 |             0.60 |
| `balanced`  |        0.55 |          0.50 |      0.12 |        0.88 |             0.53 |
| `sensitive` |        0.40 |          0.35 |      0.15 |        0.85 |             0.45 |

Ghi chú: nếu bạn truyền trực tiếp các flag như `--min-score`, `--max-gap`... thì các giá trị đó sẽ **ưu tiên hơn** `--profile`.

**Gợi ý hiệu chỉnh ngưỡng (khi viết/đánh giá mô hình)**

- Nếu muốn **ít gắn nhãn “nghi lai” sai (precision cao)**:
  - tăng `min_score`, tăng `min_score_2`, tăng `min_mean_score`
  - giảm `max_gap`, tăng `min_ratio`
  - dùng `--profile strict` làm mốc ban đầu
- Nếu muốn **nhạy hơn với trường hợp lai (recall cao)**:
  - giảm `min_score`, giảm `min_score_2`, giảm `min_mean_score`
  - tăng `max_gap`, giảm `min_ratio`
  - dùng `--profile sensitive` làm mốc ban đầu
- Trực giác từng tham số:
  - `min_score`: “độ chắc” tối thiểu cho top-1
  - `min_score_2`: loại trường hợp top-2 chỉ là nhiễu
  - `max_gap`: độ chênh lệch tuyệt đối cho phép giữa top-1 và top-2
  - `min_ratio`: ràng buộc tương đối (top-2 phải đạt ít nhất bao nhiêu % top-1)
  - `min_mean_score`: bộ lọc để tránh _cặp gần nhau nhưng đều thấp_
- Cách hiệu chỉnh thực tế (ngắn gọn): cố định 1 profile (ví dụ `balanced`), sau đó sweep từng ngưỡng trên tập ảnh kiểm thử; chọn bộ ngưỡng theo mục tiêu (ví dụ ưu tiên precision cho “nghi lai”).

**Giả mã (pseudo-code)**

```text
e = normalize(embedding(image))
for each class c:
  s[c] = dot(prototype[c], e)   # cosine similarity
top1, top2 = argsort_desc(s)[0], argsort_desc(s)[1]
s1, s2 = s[top1], s[top2]

gap   = s1 - s2
mean  = (s1 + s2)/2
effective_max_gap = min(max_gap, (1 - min_ratio) * s1)

if (s1 >= min_score) and (s2 >= min_score_2) and (gap <= effective_max_gap) and (mean >= min_mean_score):
  predict = "nghi lai: class[top1] x class[top2]"
else:
  predict = "thuần/giống trội: class[top1]"
```

**Ví dụ nhanh**

- Ví dụ 1 (nghi lai): $s_1=0.78, s_2=0.74$ ⇒ `gap=0.04`, `mean=0.76`. Với `min_ratio=0.88` ⇒ $(1-\text{min\_ratio})\cdot s_1 = 0.0936$; nên nếu `max_gap=0.08` thì `effective_max_gap=min(0.08,0.0936)=0.08`. Vì `gap=0.04<=0.08` và cả $s_1,s_2,mean$ đều cao ⇒ nghi lai.
- Ví dụ 2 (không nghi lai do top-2 thấp): $s_1=0.82, s_2=0.35$ ⇒ top-2 không đủ mạnh (`s2 < min_score_2`) ⇒ giống trội top-1.
- Ví dụ 3 (không nghi lai do cách biệt lớn): $s_1=0.80, s_2=0.60$ ⇒ `gap=0.20` > `effective_max_gap` ⇒ giống trội top-1.

**Trường hợp biên & lưu ý khi báo cáo kết quả**

- Nếu ảnh đầu vào **không phải chó** hoặc chó ở góc chụp quá khác (ngoài phân phối dữ liệu), các $s_c$ có thể thấp → thường rơi vào “giống trội” nhưng độ tin cậy thấp. Khi viết luận văn, nên nhấn mạnh đây là phân loại trong _không gian đặc trưng học được_ từ tập huấn luyện.
- Cosine similarity có thể âm nếu embedding và prototype lệch hướng mạnh; lúc đó (C1)(C2)(C4) gần như không đạt, nên hệ thống không gắn nhãn “nghi lai”.
- Đây là “lai hình thái” (visual-morphology) dựa trên ảnh đơn; không thể kết luận “thuần chủng” theo nghĩa phả hệ/di truyền.

Gợi ý: nếu bạn không muốn tự chỉnh tay nhiều ngưỡng, có thể dùng `--profile strict|balanced|sensitive` (các flag ngưỡng truyền trực tiếp vẫn luôn được ưu tiên).

## A) Chuẩn bị trên Google Drive

Trong `MyDrive/DogHybrid` cần có đúng 2 file:

- `dog-breeds-dataset.zip`
- `hybrid_breed_pipeline.py`

> `hybrid_breed_pipeline.py` là file Python, KHÔNG dùng `unzip` cho file này.

## B) Setup Colab (chạy 1 lần đầu phiên)

```python
!pip -q install torch torchvision opencv-python tqdm pillow

from google.colab import drive
drive.mount('/content/drive')

!mkdir -p /content/project

# unzip dataset (ghi đè không hỏi)
!unzip -oq "/content/drive/MyDrive/DogHybrid/dog-breeds-dataset.zip" -d /content/project

# xoá thư mục ẩn .git nếu có (tránh lỗi ImageFolder)
!rm -rf /content/project/dog-breeds-dataset/.git

# copy script vào máy ảo
!cp -f "/content/drive/MyDrive/DogHybrid/hybrid_breed_pipeline.py" /content/project/

%cd /content/project
!python hybrid_breed_pipeline.py --help
```

Nếu thấy lệnh `train, gradcam, prototypes, infer` là OK.

## C) Train mới (khuyến nghị lưu thẳng lên Drive)

```python
!python hybrid_breed_pipeline.py train \
  --data-dir "/content/project/dog-breeds-dataset" \
  --output-dir "/content/drive/MyDrive/DogHybrid/outputs/classifier" \
  --arch efficientnet_b0 \
  --epochs 60 \
  --batch-size 32 \
  --img-size 260 \
  --label-smoothing 0.05 \
  --min-lr 1e-6 \
  --early-stop-patience 15 \
  --amp \
  --workers 1 \
  --device 0
```

## D) Resume khi bị ngắt phiên / đổi tài khoản Colab

```python
!python hybrid_breed_pipeline.py train \
  --data-dir "/content/project/dog-breeds-dataset" \
  --output-dir "/content/drive/MyDrive/DogHybrid/outputs/classifier" \
  --arch efficientnet_b0 \
  --epochs 60 \
  --batch-size 32 \
  --img-size 260 \
  --label-smoothing 0.05 \
  --min-lr 1e-6 \
  --early-stop-patience 15 \
  --amp \
  --workers 1 \
  --device 0 \
  --resume
```

## E) Kiểm tra checkpoint đã lưu lên Drive chưa

```python
!ls -lah "/content/drive/MyDrive/DogHybrid/outputs/classifier"
```

Bạn cần thấy tối thiểu:

- `last_classifier.pth`
- `best_classifier.pth` (sau khi có epoch tốt hơn)
- `class_to_idx.json` (sau khi train kết thúc)

## F) Chạy Grad-CAM + pseudo parts

```python
!python hybrid_breed_pipeline.py gradcam \
  --data-dir "/content/project/dog-breeds-dataset" \
  --ckpt "/content/drive/MyDrive/DogHybrid/outputs/classifier/best_classifier.pth" \
  --heatmap-out "/content/drive/MyDrive/DogHybrid/outputs/gradcam_mean" \
  --parts-out "/content/drive/MyDrive/DogHybrid/outputs/pseudo_parts" \
  --max-per-class 150 \
  --threshold 0.65 \
  --save-individual-parts \
  --workers 1 \
  --device 0
```

## G) Build prototypes

```python
!python hybrid_breed_pipeline.py prototypes \
  --data-dir "/content/project/dog-breeds-dataset" \
  --ckpt "/content/drive/MyDrive/DogHybrid/outputs/classifier/best_classifier.pth" \
  --output-dir "/content/drive/MyDrive/DogHybrid/outputs/prototypes" \
  --batch-size 128 \
  --workers 1 \
  --device 0
```

## H) Inference ảnh test

```python
# Lấy ngẫu nhiên 1 ảnh trong dataset
import glob, random
imgs = glob.glob("/content/project/dog-breeds-dataset/*/*.*")
test_img = random.choice(imgs)
print("Test image:", test_img)
```

```python
# Infer ảnh vừa chọn
!python hybrid_breed_pipeline.py infer \
  --image "$test_img" \
  --ckpt "/content/drive/MyDrive/DogHybrid/outputs/classifier/best_classifier.pth" \
  --prototypes "/content/drive/MyDrive/DogHybrid/outputs/prototypes/class_prototypes.npy" \
  --topk 5 \
  --min-score 0.70 \
  --max-gap 0.08 \
  --device 0
```

```python
# Chạy thêm cell này để hiện ảnh vừa test:
import matplotlib.pyplot as plt
from PIL import Image

img = Image.open(test_img).convert("RGB")
plt.figure(figsize=(6,6))
plt.imshow(img)
plt.axis("off")
plt.title(test_img.split("/")[-2])
plt.show()
```

## Lỗi thường gặp (fix nhanh)

1. `End-of-central-directory signature not found`

- Bạn đang `unzip` nhầm file `.py`.
- Sửa: `cp` thay vì `unzip`.

2. `replace ... ? [y]es, [n]o ...`

- Bạn unzip lặp lại cùng thư mục.
- Sửa: dùng `unzip -oq`.

3. `Found no valid file for the classes .git`

- Dataset có thư mục `.git`.
- Sửa: `!rm -rf /content/project/dog-breeds-dataset/.git`

4. Hết RAM/GPU

- Giảm `--batch-size` xuống `8` hoặc `16`
- Giảm `--workers` còn `1`
- Giữ `--img-size 192`

## Gợi ý chạy ổn định nhất

- Luôn để `--output-dir` nằm trong `/content/drive/MyDrive/...`
- Mỗi phiên mới: chạy lại cell B trước
- Khi bị ngắt: chạy cell D (`--resume`)
