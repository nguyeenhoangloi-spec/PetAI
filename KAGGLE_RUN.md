# KAGGLE HYBRID 4 STEP (BAN DE CHAY TU DAU)

Khuyen dung: EfficientNet-B0

Muc tieu: copy dung tung cell theo thu tu A -> H la chay duoc tren Kaggle.

## A) Chuan bi tren Google Drive

Can co dung 2 file (de Public: Anyone with the link):

- dog-breeds-dataset.zip
- hybrid_breed_pipeline.py

> hybrid_breed_pipeline.py la file Python, KHONG dung unzip cho file nay.

## B) Setup Kaggle (chay 1 lan dau phien)

```python
!pip -q install --upgrade pip
!pip -q install gdown torch torchvision opencv-python tqdm pillow

import os, shutil
import gdown

# =========================
# SUA 2 LINK BEN DUOI
# =========================
DATASET_ZIP_LINK = "https://drive.google.com/file/d/REPLACE_DATASET_ID/view?usp=sharing"
PIPELINE_PY_LINK = "https://drive.google.com/file/d/REPLACE_SCRIPT_ID/view?usp=sharing"

WORK_DIR = "/kaggle/working/project"
DATASET_DIR = f"{WORK_DIR}/dog-breeds-dataset"

if os.path.exists(WORK_DIR):
    shutil.rmtree(WORK_DIR)
os.makedirs(WORK_DIR, exist_ok=True)

dataset_zip = "/kaggle/working/dog-breeds-dataset.zip"
pipeline_py = f"{WORK_DIR}/hybrid_breed_pipeline.py"

gdown.download(DATASET_ZIP_LINK, dataset_zip, quiet=False, fuzzy=True)
gdown.download(PIPELINE_PY_LINK, pipeline_py, quiet=False, fuzzy=True)

!unzip -oq "$dataset_zip" -d "$WORK_DIR"
!rm -rf "$DATASET_DIR/.git"

%cd $WORK_DIR
!python hybrid_breed_pipeline.py --help
```

Neu thay lenh train, gradcam, prototypes, infer la OK.

## C) Train moi tren Kaggle

```python
!python hybrid_breed_pipeline.py train \
    --data-dir "/kaggle/working/project/dog-breeds-dataset" \
    --output-dir "/kaggle/working/outputs/classifier" \
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

## D) Resume khi bi ngat phien Kaggle

Luu y: /kaggle/working se reset moi phien. Muon resume, ban can phuc hoi lai last_classifier.pth vao dung duong dan output truoc.

```python
!python hybrid_breed_pipeline.py train \
    --data-dir "/kaggle/working/project/dog-breeds-dataset" \
    --output-dir "/kaggle/working/outputs/classifier" \
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

## E) Kiem tra checkpoint tren Kaggle

```python
!ls -lah "/kaggle/working/outputs/classifier"
```

Ban can thay toi thieu:

- last_classifier.pth
- best_classifier.pth (sau khi co epoch tot hon)
- class_to_idx.json (sau khi train ket thuc)

## F) Chay Grad-CAM + pseudo parts

```python
!python hybrid_breed_pipeline.py gradcam \
    --data-dir "/kaggle/working/project/dog-breeds-dataset" \
    --ckpt "/kaggle/working/outputs/classifier/best_classifier.pth" \
    --heatmap-out "/kaggle/working/outputs/gradcam_mean" \
    --parts-out "/kaggle/working/outputs/pseudo_parts" \
    --max-per-class 150 \
    --threshold 0.65 \
    --save-individual-parts \
    --workers 1 \
    --device 0
```

## G) Build prototypes

```python
!python hybrid_breed_pipeline.py prototypes \
    --data-dir "/kaggle/working/project/dog-breeds-dataset" \
    --ckpt "/kaggle/working/outputs/classifier/best_classifier.pth" \
    --output-dir "/kaggle/working/outputs/prototypes" \
    --batch-size 128 \
    --workers 1 \
    --device 0
```

## H) Inference anh test

```python
# Lay ngau nhien 1 anh trong dataset
import glob, random
imgs = glob.glob("/kaggle/working/project/dog-breeds-dataset/*/*.*")
test_img = random.choice(imgs)
print("Test image:", test_img)
```

```python
# Infer anh vua chon
!python hybrid_breed_pipeline.py infer \
    --image "$test_img" \
    --ckpt "/kaggle/working/outputs/classifier/best_classifier.pth" \
    --prototypes "/kaggle/working/outputs/prototypes/class_prototypes.npy" \
    --topk 5 \
    --min-score 0.70 \
    --max-gap 0.08 \
    --device 0
```

```python
# Chay them cell nay de hien anh vua test
import matplotlib.pyplot as plt
from PIL import Image

img = Image.open(test_img).convert("RGB")
plt.figure(figsize=(6,6))
plt.imshow(img)
plt.axis("off")
plt.title(test_img.split("/")[-2])
plt.show()
```

```python
# Cell 1: Zip 1 folder bất kỳ + tạo link tải
import os
import glob
import shutil
from IPython.display import FileLink, display

FOLDER_TO_EXPORT = "/kaggle/working/outputs"   # đổi thành /kaggle/working/project nếu cần
EXPORT_NAME = "outputs_backup"                 # tên file zip

zip_base = f"/kaggle/working/{EXPORT_NAME}"
zip_path = f"{zip_base}.zip"

# dọn file cũ cùng tên
for p in glob.glob(f"{zip_base}*"):
    if os.path.isfile(p):
        os.remove(p)

# nén
shutil.make_archive(zip_base, "zip", FOLDER_TO_EXPORT)

size_mb = os.path.getsize(zip_path) / (1024 * 1024)
print(f"Created: {zip_path} ({size_mb:.2f} MB)")

# link tải trực tiếp trong notebook
display(FileLink(zip_path))
```

## Loi thuong gap (fix nhanh)

1. End-of-central-directory signature not found

- Link dataset sai hoac file zip chua de quyen public.
- Sua: mo quyen Anyone with the link va dan dung link file zip.

2. python script khong chay duoc sau khi download

- Link script sai hoac file tren Drive khong phai .py that.
- Sua: tai lai PIPELINE_PY_LINK va chay !python hybrid_breed_pipeline.py --help.

3. Found no valid file for the classes .git

- Dataset co thu muc .git.
- Sua: !rm -rf /kaggle/working/project/dog-breeds-dataset/.git

4. Het RAM/GPU

- Giam --batch-size xuong 8 hoac 16
- Giam --workers con 1
- Giu --img-size 192

## Goi y chay on dinh nhat tren Kaggle

- Bat Accelerator = GPU (T4) truoc khi chay train
- Luon de --output-dir trong /kaggle/working/outputs
- Sau khi train xong, Save Version de giu artifact
- Muon resume phien sau: can phuc hoi lai checkpoint roi moi chay cell D

```

```
