"""Batch infer a folder of images and export results to CSV.

This repo's inference is PyTorch-based (see `predict.ImagePredictor`). The Colab snippet
in the chat expects a TensorFlow `infer` signature and `/content/...` paths, so this
script provides the same "loop folder -> predict -> save CSV" workflow for this codebase.

CSV is written with UTF-8-SIG encoding for good Excel compatibility.

Example:
  python scripts/infer_folder_to_csv.py --folder "D:\\Dog_Test" --out "predictions.csv" --recursive
"""

from __future__ import annotations

import argparse
import csv
from datetime import datetime
import os
import sys
import tempfile
from pathlib import Path
from typing import List

from PIL import Image


IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".bmp"}


def _env_float(name: str, default: float) -> float:
    raw = os.getenv(name)
    if raw is None:
        return default
    try:
        return float(raw)
    except (TypeError, ValueError):
        return default


def _init_yolo() -> object | None:
    """Initialize YOLO model if available.

    Matches app behavior (upload.py): uses `yolov8s.pt` local weight.
    """
    try:
        from ultralytics import YOLO  # type: ignore
    except Exception:
        return None

    weights_path = Path.cwd() / "yolov8s.pt"
    if not weights_path.exists():
        return None
    try:
        return YOLO(str(weights_path))
    except Exception:
        return None


def _best_dog_bbox(yolo_model: object | None, image_path: Path) -> tuple[list[int] | None, float | None]:
    """Return best dog bbox (xyxy ints) and its confidence if YOLO is available."""
    if yolo_model is None:
        return None, None

    det_conf = _env_float("YOLO_GATE_MIN_CONF", 0.12)
    try:
        det_results = yolo_model(str(image_path), conf=det_conf, verbose=False)  # type: ignore[misc]
        r = det_results[0]
    except Exception:
        return None, None

    if not hasattr(r, "boxes") or r.boxes is None:
        return None, None
    if getattr(r.boxes, "cls", None) is None:
        return None, None

    try:
        names = getattr(r, "names", {}) or {}
        cls_list = r.boxes.cls.tolist()
        if not isinstance(cls_list, list):
            cls_list = [cls_list]
        labels: List[str] = []
        for ci in cls_list:
            try:
                labels.append(str(names[int(ci)]).strip().lower())
            except Exception:
                continue

        confs = r.boxes.conf.tolist() if getattr(r.boxes, "conf", None) is not None else [None] * len(labels)
        xyxy = r.boxes.xyxy.tolist() if getattr(r.boxes, "xyxy", None) is not None else [None] * len(labels)

        # Explicit annotations keep Pylance happy (YOLO result types are dynamic).
        best: list[float] | None = None
        best_conf: float | None = None
        for lab, cf, bb in zip(labels, confs, xyxy):
            if lab != "dog" or bb is None:
                continue
            try:
                cff = float(cf) if cf is not None else None
            except Exception:
                cff = None
            if cff is None:
                continue
            if best_conf is None or cff > best_conf:
                best_conf = cff
                # `bb` is expected to be an xyxy list; keep it list[float] for typing.
                best = list(bb)

        if best is None:
            return None, None

        x1, y1, x2, y2 = [int(v) for v in best]
        return [x1, y1, x2, y2], float(best_conf) if best_conf is not None else None
    except Exception:
        return None, None


def _crop_with_padding(image_path: Path, bbox_xyxy: list[int]) -> Image.Image | None:
    try:
        img = Image.open(image_path).convert("RGB")
    except Exception:
        return None

    w, h = img.size
    x1, y1, x2, y2 = [int(v) for v in bbox_xyxy]
    x1 = max(0, min(w, x1))
    y1 = max(0, min(h, y1))
    x2 = max(0, min(w, x2))
    y2 = max(0, min(h, y2))
    if x2 <= x1 or y2 <= y1:
        return None

    pad_x = int((x2 - x1) * 0.08)
    pad_y = int((y2 - y1) * 0.08)
    x1 = max(0, x1 - pad_x)
    y1 = max(0, y1 - pad_y)
    x2 = min(w, x2 + pad_x)
    y2 = min(h, y2 + pad_y)

    if x2 <= x1 or y2 <= y1:
        return None
    return img.crop((x1, y1, x2, y2))


def _load_dotenv_if_present(path: str = ".env") -> None:
    """Load simple KEY=VALUE pairs into os.environ if not already set.

    Matches the repo's `app.py` behavior (best-effort, no extra deps).
    """
    try:
        env_path = Path(path)
        if not env_path.is_absolute():
            env_path = Path.cwd() / env_path
        if not env_path.exists() or not env_path.is_file():
            return

        for raw_line in env_path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key and key not in os.environ:
                os.environ[key] = value
    except Exception:
        return


def _iter_images(folder: Path, recursive: bool) -> List[Path]:
    if recursive:
        paths = [p for p in folder.rglob("*") if p.is_file() and p.suffix.lower() in IMAGE_EXTS]
    else:
        paths = [p for p in folder.iterdir() if p.is_file() and p.suffix.lower() in IMAGE_EXTS]
    paths.sort(key=lambda p: str(p).lower())
    return paths


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Infer images in a folder and export CSV")
    p.add_argument(
        "--folder",
        default=r"C:\\Users\\User\\Downloads\\Dog_Test",
        help="Folder containing images (default: C:\\Users\\User\\Downloads\\Dog_Test)",
    )
    p.add_argument("--out", default="outputs/predictions.csv", help="Output CSV path")
    p.add_argument("--recursive", action="store_true", help="Scan subfolders recursively")
    p.add_argument("--limit", type=int, default=0, help="Optional max number of images (0 = no limit)")
    p.add_argument(
        "--artifacts-root",
        default="outputs",
        help="Artifacts root (contains classifier/, prototypes/, gradcam_mean/). Default: outputs",
    )
    p.add_argument("--quiet", action="store_true", help="Do not print per-image results")
    return p.parse_args()


def main() -> int:
    args = parse_args()

    folder = Path(args.folder).expanduser().resolve()
    out_path = Path(args.out).expanduser().resolve()

    if not folder.exists() or not folder.is_dir():
        print(f"ERROR: folder not found: {folder}")
        return 2

    # Allow running the script from any cwd.
    repo_root = Path(__file__).resolve().parents[1]
    if str(repo_root) not in sys.path:
        sys.path.insert(0, str(repo_root))
    os.chdir(repo_root)
    _load_dotenv_if_present(".env")

    from predict import ImagePredictor  # local import after sys.path tweak

    images = _iter_images(folder, bool(args.recursive))
    if args.limit and args.limit > 0:
        images = images[: int(args.limit)]

    if not images:
        print("No images found.")
        return 0

    predictor = ImagePredictor(artifacts_root=str(args.artifacts_root))

    # Match app behavior: try YOLO dog detection + crop before breed inference.
    yolo_model = _init_yolo()
    temp_dir_obj = tempfile.TemporaryDirectory(prefix="dogai_batch_")
    temp_dir = Path(temp_dir_obj.name)

    fieldnames = [
        "image",
        "image_path",
        "breed",
        "breed_en",
        "confidence",
        "model_ready",
        "message",
        "note",
    ]

    out_path.parent.mkdir(parents=True, exist_ok=True)

    def _open_csv(path: Path):
        return open(path, "w", encoding="utf-8-sig", newline="")

    try:
        f = _open_csv(out_path)
    except PermissionError:
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        alt_path = out_path.with_name(f"{out_path.stem}_{ts}{out_path.suffix or '.csv'}")
        print(f"WARN: Cannot write to {out_path} (Permission denied).")
        print(f"      If the file is open in Excel, close it and retry.")
        print(f"      Falling back to: {alt_path}")
        f = _open_csv(alt_path)
        out_path = alt_path

    try:
        with f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()

            for idx, img_path in enumerate(images, start=1):
                infer_path = img_path

                bbox, best_dog_conf = _best_dog_bbox(yolo_model, img_path)
                if bbox is not None:
                    cropped = _crop_with_padding(img_path, bbox)
                    if cropped is not None:
                        # Save crop to temp file (ImagePredictor expects a file path).
                        crop_path = temp_dir / f"{img_path.stem}_dogcrop.jpg"
                        try:
                            cropped.save(crop_path, format="JPEG", quality=95)
                            infer_path = crop_path
                        except Exception:
                            infer_path = img_path

                result = predictor.predict(str(infer_path))

                # Apply the same dog-gate warning note as app (upload.py).
                try:
                    DOG_THRESHOLD = _env_float("DOG_GATE_YOLO_DOG_THRESHOLD", 0.40)
                    BREED_FALLBACK_THRESHOLD = _env_float("DOG_GATE_BREED_FALLBACK_THRESHOLD", 0.55)
                    breed_conf_fallback = float(result.get("breed_conf", 0.0) or 0.0) if isinstance(result, dict) else 0.0
                    breed_model_ready = bool(result.get("model_ready", False)) if isinstance(result, dict) else False
                    breed_value = str(result.get("breed") or "").strip().lower() if isinstance(result, dict) else ""
                    breed_is_unknown = breed_value in {"", "unknown", "không xác định", "khong xac dinh"}

                    yolo_dog_enough = (best_dog_conf is not None) and (float(best_dog_conf) >= DOG_THRESHOLD)
                    breed_fallback_enough = (
                        breed_model_ready
                        and (not breed_is_unknown)
                        and (breed_conf_fallback >= BREED_FALLBACK_THRESHOLD)
                    )

                    is_dog_enough = yolo_dog_enough or breed_fallback_enough
                    if not is_dog_enough and isinstance(result, dict):
                        note_append = None
                        if best_dog_conf is not None:
                            dog_pct = int(round(float(best_dog_conf or 0.0) * 100))
                            note_append = (
                                f"Độ tin cậy CHÓ từ YOLO chỉ {dog_pct}% (< {int(DOG_THRESHOLD*100)}%). "
                                "Kết quả giống dưới đây chỉ mang tính tham khảo."
                            )
                        elif breed_model_ready and not breed_is_unknown:
                            breed_pct = int(round(float(breed_conf_fallback or 0.0) * 100))
                            note_append = (
                                f"AI giống đang nghiêng về chó ({breed_pct}%) nhưng chưa đủ ngưỡng xác nhận. "
                                "Kết quả dưới đây chỉ mang tính tham khảo."
                            )
                        else:
                            note_append = (
                                "Ảnh này chưa được nhận diện chắc chắn là CHÓ. "
                                "Kết quả giống dưới đây chỉ mang tính tham khảo."
                            )

                        existing_note = str(result.get("note") or "").strip()
                        result["note"] = f"{existing_note} {note_append}".strip() if existing_note else note_append
                except Exception:
                    pass

                breed = str(result.get("breed", ""))
                breed_en = str(result.get("breed_en", ""))
                conf = float(result.get("breed_conf", 0.0) or 0.0)
                model_ready = bool(result.get("model_ready", False))
                message = str(result.get("message", ""))
                note = str(result.get("note", ""))

                rel = None
                try:
                    rel = str(img_path.relative_to(folder))
                except Exception:
                    rel = img_path.name

                if not args.quiet:
                    status = "OK" if model_ready else "NOT_READY"
                    print(f"[{idx}/{len(images)}] {rel} -> {breed} ({conf:.4f}) [{status}]")

                writer.writerow({
                    "image": rel,
                    "image_path": str(img_path),
                    "breed": breed,
                    "breed_en": breed_en,
                    "confidence": f"{conf:.6f}",
                    "model_ready": str(model_ready),
                    "message": message,
                    "note": note,
                })
    finally:
        try:
            temp_dir_obj.cleanup()
        except Exception:
            pass

    print("-" * 80)
    print(f"DONE. Processed {len(images)} images")
    print(f"CSV saved at: {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
