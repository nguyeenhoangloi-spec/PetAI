# COLAB HYBRID 4 STEP (BẢN DỄ CHẠY TỪ ĐẦU)

Khuyên dùng: EfficientNet-B0

Mục tiêu: copy đúng từng cell theo thứ tự A -> H là chạy được.

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
