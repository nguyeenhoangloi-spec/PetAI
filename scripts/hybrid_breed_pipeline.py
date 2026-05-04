from __future__ import annotations

import argparse
from collections import defaultdict
import json
import os
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any, cast

import cv2
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from PIL import Image
from torch.utils.data import DataLoader, Subset
from torchvision import datasets, models, transforms
from tqdm import tqdm


IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]


HYBRID_THRESHOLD_PROFILES: Dict[str, Dict[str, float]] = {
    "strict": {
        "min_score": 0.70,
        "min_score_2": 0.70,
        "max_gap": 0.08,
        "min_ratio": 0.90,
        "min_mean_score": 0.60,
    },
    "balanced": {
        "min_score": 0.55,
        "min_score_2": 0.50,
        "max_gap": 0.12,
        "min_ratio": 0.88,
        "min_mean_score": 0.53,
    },
    "sensitive": {
        "min_score": 0.40,
        "min_score_2": 0.35,
        "max_gap": 0.15,
        "min_ratio": 0.85,
        "min_mean_score": 0.45,
    },
}


class SafeImageFolder(datasets.ImageFolder):
    def find_classes(self, directory: str):
        classes, _ = super().find_classes(directory)
        classes = [c for c in classes if not c.startswith(".")]
        if not classes:
            raise FileNotFoundError(f"No valid class folders found in {directory}")
        class_to_idx = {cls_name: i for i, cls_name in enumerate(classes)}
        return classes, class_to_idx


def get_device(device_arg: str) -> torch.device:
    if device_arg == "cpu":
        return torch.device("cpu")
    if torch.cuda.is_available():
        return torch.device("cuda:0")
    return torch.device("cpu")


def build_model(arch: str, num_classes: int, pretrained: bool = True) -> nn.Module:
    arch = arch.lower()
    if arch == "resnet50":
        weights = models.ResNet50_Weights.IMAGENET1K_V2 if pretrained else None
        model = models.resnet50(weights=weights)
        model.fc = nn.Linear(model.fc.in_features, num_classes)
        return model
    if arch == "efficientnet_b0":
        weights = models.EfficientNet_B0_Weights.IMAGENET1K_V1 if pretrained else None
        model = models.efficientnet_b0(weights=weights)
        classifier = cast(nn.Sequential, model.classifier)
        in_features = cast(nn.Linear, classifier[1]).in_features
        classifier[1] = nn.Linear(in_features, num_classes)
        return model
    raise ValueError("arch must be one of: resnet50, efficientnet_b0")


def get_train_val_transforms(img_size: int) -> Tuple[transforms.Compose, transforms.Compose]:
    train_tf = transforms.Compose([
        transforms.Resize((img_size + 32, img_size + 32)),
        transforms.RandomResizedCrop(img_size),
        transforms.RandomHorizontalFlip(),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.05),
        transforms.ToTensor(),
        transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
    ])
    val_tf = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
    ])
    return train_tf, val_tf


def set_seed(seed: int) -> None:
    torch.manual_seed(seed)
    np.random.seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)


def _argv_has_flag(argv: List[str], flag: str) -> bool:
    return any(a == flag or a.startswith(f"{flag}=") for a in argv)


def apply_infer_threshold_profile(args: argparse.Namespace, argv: List[str]) -> None:
    if args.cmd != "infer" or args.profile == "custom":
        return

    profile_values = HYBRID_THRESHOLD_PROFILES[args.profile]
    # Profile provides defaults; explicit CLI threshold args always win.
    flag_to_attr = {
        "--min-score": "min_score",
        "--min-score-2": "min_score_2",
        "--max-gap": "max_gap",
        "--min-ratio": "min_ratio",
        "--min-mean-score": "min_mean_score",
    }
    for flag, attr in flag_to_attr.items():
        if not _argv_has_flag(argv, flag):
            setattr(args, attr, float(profile_values[attr]))


def stratified_split_indices(targets: List[int], val_ratio: float, seed: int) -> Tuple[List[int], List[int]]:
    if not (0.0 <= val_ratio < 1.0):
        raise ValueError("val_ratio must be in [0.0, 1.0)")

    indices_by_class: Dict[int, List[int]] = defaultdict(list)
    for idx, cls_id in enumerate(targets):
        indices_by_class[int(cls_id)].append(idx)

    rng = np.random.default_rng(seed)
    train_indices: List[int] = []
    val_indices: List[int] = []

    for cls_id, cls_indices in indices_by_class.items():
        cls_arr = np.array(cls_indices, dtype=np.int64)
        rng.shuffle(cls_arr)
        n = len(cls_arr)

        if n <= 1 or val_ratio == 0.0:
            n_val = 0
        else:
            n_val = int(round(n * val_ratio))
            n_val = max(1, n_val)
            n_val = min(n_val, n - 1)

        val_indices.extend(cls_arr[:n_val].tolist())
        train_indices.extend(cls_arr[n_val:].tolist())

    rng.shuffle(train_indices)
    rng.shuffle(val_indices)
    return train_indices, val_indices


@dataclass
class FeatureHooks:
    activations: torch.Tensor | None = None
    gradients: torch.Tensor | None = None


class GradCAM:
    def __init__(self, model: nn.Module, arch: str):
        self.model = model
        self.arch = arch.lower()
        self.hooks = FeatureHooks()
        target_layer = self._target_layer()
        target_layer.register_forward_hook(self._forward_hook)
        target_layer.register_full_backward_hook(self._backward_hook)

    def _target_layer(self) -> nn.Module:
        m = cast(Any, self.model)
        if self.arch == "resnet50":
            return cast(nn.Module, m.layer4[-1])
        if self.arch == "efficientnet_b0":
            return cast(nn.Module, m.features[-1])
        raise ValueError("Unsupported arch for GradCAM")

    def _forward_hook(self, module: nn.Module, input_t, output_t):
        self.hooks.activations = output_t

    def _backward_hook(self, module: nn.Module, grad_in, grad_out):
        self.hooks.gradients = grad_out[0]

    def generate(self, x: torch.Tensor, class_idx: int) -> np.ndarray:
        self.model.zero_grad(set_to_none=True)
        logits = self.model(x)
        score = logits[:, class_idx].sum()
        score.backward(retain_graph=False)

        acts = self.hooks.activations
        grads = self.hooks.gradients
        if acts is None or grads is None:
            raise RuntimeError("GradCAM hooks did not capture activations/gradients")

        weights = grads.mean(dim=(2, 3), keepdim=True)
        cam = (weights * acts).sum(dim=1, keepdim=True)
        cam = F.relu(cam)
        cam = F.interpolate(cam, size=x.shape[-2:], mode="bilinear", align_corners=False)
        cam = cam[0, 0].detach().cpu().numpy()
        cam = cam - cam.min()
        cam = cam / (cam.max() + 1e-8)
        return cam.astype(np.float32)


def unnormalize_to_uint8(t: torch.Tensor) -> np.ndarray:
    x = t.detach().cpu().numpy().transpose(1, 2, 0)
    x = x * np.array(IMAGENET_STD, dtype=np.float32) + np.array(IMAGENET_MEAN, dtype=np.float32)
    x = np.clip(x * 255.0, 0, 255).astype(np.uint8)
    return x


def extract_embedding(model: nn.Module, x: torch.Tensor, arch: str) -> torch.Tensor:
    m = cast(Any, model)
    arch = arch.lower()
    if arch == "resnet50":
        y = m.conv1(x)
        y = m.bn1(y)
        y = m.relu(y)
        y = m.maxpool(y)
        y = m.layer1(y)
        y = m.layer2(y)
        y = m.layer3(y)
        y = m.layer4(y)
        y = m.avgpool(y)
        y = torch.flatten(y, 1)
        return F.normalize(y, dim=1)
    if arch == "efficientnet_b0":
        y = m.features(x)
        y = m.avgpool(y)
        y = torch.flatten(y, 1)
        return F.normalize(y, dim=1)
    raise ValueError("Unsupported arch")


def train_classifier(args: argparse.Namespace) -> None:
    set_seed(args.seed)
    device = get_device(args.device)

    train_tf, val_tf = get_train_val_transforms(args.img_size)
    full_ds = SafeImageFolder(args.data_dir, transform=None)
    num_classes = len(full_ds.classes)

    train_indices, val_indices = stratified_split_indices(full_ds.targets, args.val_ratio, args.seed)
    if len(train_indices) == 0:
        raise ValueError("No training samples after split. Reduce val-ratio or check dataset.")
    if len(val_indices) == 0:
        raise ValueError("No validation samples after split. Increase val-ratio or dataset size.")

    train_base = SafeImageFolder(args.data_dir, transform=train_tf)
    val_base = SafeImageFolder(args.data_dir, transform=val_tf)
    train_ds = Subset(train_base, train_indices)
    val_ds = Subset(val_base, val_indices)

    train_loader = DataLoader(train_ds, batch_size=args.batch_size, shuffle=True, num_workers=args.workers, pin_memory=True)
    val_loader = DataLoader(val_ds, batch_size=args.batch_size, shuffle=False, num_workers=args.workers, pin_memory=True)

    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    model = build_model(args.arch, num_classes=num_classes, pretrained=True).to(device)
    optimizer = torch.optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-4)
    criterion = nn.CrossEntropyLoss(label_smoothing=args.label_smoothing)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=max(args.epochs, 1), eta_min=args.min_lr)
    use_amp = args.amp and (device.type == "cuda")
    scaler = torch.cuda.amp.GradScaler(enabled=use_amp)

    best_acc = 0.0
    start_epoch = 0
    no_improve_epochs = 0

    resume_path: Optional[Path] = None
    if args.resume_ckpt:
        resume_path = Path(args.resume_ckpt)
    elif args.resume:
        resume_path = out_dir / "last_classifier.pth"

    if resume_path is not None:
        if not resume_path.exists():
            raise FileNotFoundError(f"Resume checkpoint not found: {resume_path}")
        resume_ckpt = torch.load(str(resume_path), map_location=device)
        model.load_state_dict(resume_ckpt["state_dict"])
        if "optimizer_state_dict" in resume_ckpt:
            optimizer.load_state_dict(resume_ckpt["optimizer_state_dict"])
        if "scheduler_state_dict" in resume_ckpt:
            scheduler.load_state_dict(resume_ckpt["scheduler_state_dict"])
        start_epoch = int(resume_ckpt.get("epoch", 0))
        best_acc = float(resume_ckpt.get("best_acc", 0.0))
        print(f"Resumed from {resume_path} at epoch {start_epoch}, best_acc={best_acc:.4f}")

    if start_epoch >= args.epochs:
        print(f"Checkpoint epoch ({start_epoch}) >= target epochs ({args.epochs}). Nothing to train.")
        return

    for epoch in range(start_epoch, args.epochs):
        model.train()
        running_loss = 0.0
        for images, labels in tqdm(train_loader, desc=f"train epoch {epoch + 1}/{args.epochs}"):
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad(set_to_none=True)
            with torch.cuda.amp.autocast(enabled=use_amp):
                logits = model(images)
                loss = criterion(logits, labels)
            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()
            running_loss += loss.item() * labels.size(0)

        model.eval()
        correct = 0
        total = 0
        with torch.no_grad():
            for images, labels in tqdm(val_loader, desc=f"val epoch {epoch + 1}/{args.epochs}"):
                images, labels = images.to(device), labels.to(device)
                logits = model(images)
                pred = logits.argmax(dim=1)
                correct += (pred == labels).sum().item()
                total += labels.size(0)

        train_loss = running_loss / max(len(train_ds), 1)
        val_acc = correct / max(total, 1)
        scheduler.step()
        current_lr = optimizer.param_groups[0]["lr"]
        print(f"epoch={epoch + 1} train_loss={train_loss:.4f} val_acc={val_acc:.4f} lr={current_lr:.6f}")

        is_best = val_acc > (best_acc + args.early_stop_min_delta)
        if is_best:
            best_acc = val_acc
            no_improve_epochs = 0
        else:
            no_improve_epochs += 1

        ckpt = {
            "arch": args.arch,
            "num_classes": num_classes,
            "state_dict": model.state_dict(),
            "optimizer_state_dict": optimizer.state_dict(),
            "scheduler_state_dict": scheduler.state_dict(),
            "classes": train_base.classes,
            "class_to_idx": train_base.class_to_idx,
            "img_size": args.img_size,
            "epoch": epoch + 1,
            "best_acc": best_acc,
        }
        torch.save(ckpt, out_dir / "last_classifier.pth")

        if is_best:
            torch.save(ckpt, out_dir / "best_classifier.pth")

        if args.early_stop_patience > 0 and no_improve_epochs >= args.early_stop_patience:
            print(f"Early stopping at epoch {epoch + 1}: no val_acc improvement for {no_improve_epochs} epoch(s).")
            break

    with open(out_dir / "class_to_idx.json", "w", encoding="utf-8") as f:
        json.dump(train_base.class_to_idx, f, ensure_ascii=False, indent=2)
    print(f"Done. best_val_acc={best_acc:.4f}")


def load_checkpoint(ckpt_path: str, device: torch.device) -> Tuple[nn.Module, Dict[str, int], List[str], str, int]:
    ckpt = torch.load(ckpt_path, map_location=device)
    arch = ckpt["arch"]
    classes = ckpt["classes"]
    class_to_idx = ckpt["class_to_idx"]
    model = build_model(arch, num_classes=len(classes), pretrained=False).to(device)
    model.load_state_dict(ckpt["state_dict"])
    model.eval()
    img_size = int(ckpt.get("img_size", 224))
    return model, class_to_idx, classes, arch, img_size


def gradcam_mean_and_parts(args: argparse.Namespace) -> None:
    device = get_device(args.device)
    model, class_to_idx, classes, arch, img_size = load_checkpoint(args.ckpt, device)

    tf = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
    ])
    ds = SafeImageFolder(args.data_dir, transform=tf)
    loader = DataLoader(ds, batch_size=1, shuffle=False, num_workers=args.workers)

    cam_engine = GradCAM(model, arch)

    heat_dir = Path(args.heatmap_out)
    part_dir = Path(args.parts_out)
    heat_dir.mkdir(parents=True, exist_ok=True)
    part_dir.mkdir(parents=True, exist_ok=True)

    per_class_sum: Dict[int, Optional[np.ndarray]] = {i: None for i in range(len(classes))}
    per_class_count = {i: 0 for i in range(len(classes))}

    for i, (x, y) in enumerate(tqdm(loader, desc="gradcam")):
        cid = int(y.item())
        if per_class_count[cid] >= args.max_per_class:
            continue

        x = x.to(device)
        cam = cam_engine.generate(x, class_idx=cid)
        if per_class_sum[cid] is None:
            per_class_sum[cid] = cam.copy()
        else:
            per_class_sum[cid] += cam
        per_class_count[cid] += 1

        if args.save_individual_parts:
            img_u8 = unnormalize_to_uint8(x[0])
            mask = (cam >= (cam.max() * args.threshold)).astype(np.uint8)
            ys, xs = np.where(mask > 0)
            if len(xs) > 0 and len(ys) > 0:
                x0, x1 = xs.min(), xs.max()
                y0, y1 = ys.min(), ys.max()
                crop = img_u8[y0:y1 + 1, x0:x1 + 1]
                if crop.size > 0:
                    cname = classes[cid].replace("/", "-")
                    out_sub = part_dir / cname
                    out_sub.mkdir(parents=True, exist_ok=True)
                    Image.fromarray(crop).save(out_sub / f"part_{i:06d}.jpg")

    for cid, cname in enumerate(classes):
        if per_class_count[cid] == 0:
            continue
        cam_sum = per_class_sum[cid]
        if cam_sum is None:
            continue
        mean_cam = cam_sum / per_class_count[cid]
        mean_cam = (mean_cam * 255.0).clip(0, 255).astype(np.uint8)
        heat = cv2.applyColorMap(mean_cam, cv2.COLORMAP_JET)
        heat = cv2.cvtColor(heat, cv2.COLOR_BGR2RGB)
        out_name = cname.replace("/", "-") + ".jpg"
        Image.fromarray(heat).save(heat_dir / out_name)

    print("Done Grad-CAM mean + pseudo parts")


def build_prototypes(args: argparse.Namespace) -> None:
    device = get_device(args.device)
    model, class_to_idx, classes, arch, img_size = load_checkpoint(args.ckpt, device)

    tf = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
    ])
    ds = SafeImageFolder(args.data_dir, transform=tf)
    loader = DataLoader(ds, batch_size=args.batch_size, shuffle=False, num_workers=args.workers)

    sums: Dict[int, Optional[np.ndarray]] = {i: None for i in range(len(classes))}
    counts = {i: 0 for i in range(len(classes))}

    with torch.no_grad():
        for x, y in tqdm(loader, desc="prototypes"):
            x = x.to(device)
            emb = extract_embedding(model, x, arch)
            for i in range(x.size(0)):
                cid = int(y[i].item())
                e = emb[i].detach().cpu().numpy()
                if sums[cid] is None:
                    sums[cid] = e.copy()
                else:
                    sums[cid] += e
                counts[cid] += 1

    proto = []
    for cid in range(len(classes)):
        class_sum = sums[cid]
        if class_sum is None:
            continue
        p = class_sum / max(counts[cid], 1)
        p = p / (np.linalg.norm(p) + 1e-8)
        proto.append(p)

    proto = np.stack(proto, axis=0)
    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    np.save(out_dir / "class_prototypes.npy", proto)
    with open(out_dir / "classes.json", "w", encoding="utf-8") as f:
        json.dump(classes, f, ensure_ascii=False, indent=2)
    print("Done prototypes")


def infer_hybrid(args: argparse.Namespace) -> None:
    device = get_device(args.device)
    model, _, classes, arch, img_size = load_checkpoint(args.ckpt, device)
    proto = np.load(args.prototypes)

    tf = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
    ])

    img = Image.open(args.image).convert("RGB")
    x_tensor = cast(torch.Tensor, tf(img))
    x = x_tensor.unsqueeze(0).to(device)

    with torch.no_grad():
        e = extract_embedding(model, x, arch)[0].cpu().numpy()
    e = e / (np.linalg.norm(e) + 1e-8)

    sims = proto @ e
    top_idx = np.argsort(-sims)[: args.topk]

    print("Top similarity:")
    for rank, idx in enumerate(top_idx, start=1):
        print(f"{rank}. {classes[idx]}: {sims[idx]:.4f}")

    if len(top_idx) >= 2:
        s1, s2 = sims[top_idx[0]], sims[top_idx[1]]
        gap = s1 - s2
        ratio = (s2 / max(s1, 1e-8)) if s1 > 0 else 0.0
        mean_top2 = (s1 + s2) / 2.0
        min_score = float(args.min_score)
        min_score_2 = float(args.min_score_2)
        max_gap = max(0.0, float(args.max_gap))
        min_ratio = max(0.0, min(1.0, float(args.min_ratio)))
        min_mean_score = float(args.min_mean_score)
        effective_max_gap = min(max_gap, max(0.0, (1.0 - min_ratio) * s1))
        is_close_pair = gap <= effective_max_gap
        is_hybrid = (
            (s1 >= min_score)
            and (s2 >= min_score_2)
            and is_close_pair
            and (mean_top2 >= min_mean_score)
        )

        print(
            f"\nHybrid metrics: s1={s1:.4f}, s2={s2:.4f}, gap={gap:.4f}, "
            f"ratio={ratio:.4f}, mean={mean_top2:.4f}, effective_max_gap={effective_max_gap:.4f}"
        )
        print(
            "Hybrid thresholds: "
            f"profile={args.profile}, min_score={min_score:.2f}, min_score_2={min_score_2:.2f}, "
            f"max_gap={max_gap:.2f}, min_ratio={min_ratio:.2f}, min_mean_score={min_mean_score:.2f}"
        )
        if is_hybrid:
            print(f"=> Suspected hybrid (morphology-based): {classes[top_idx[0]]} x {classes[top_idx[1]]}")
            print("=> Note: This is a visual similarity suggestion, not a genetic (DNA) confirmation.")
        else:
            print(f"\n=> Likely pure (or dominant): {classes[top_idx[0]]}")


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="4-step hybrid dog breed pipeline")
    sub = p.add_subparsers(dest="cmd", required=True)

    p_train = sub.add_parser("train")
    p_train.add_argument("--data-dir", required=True, help="Class folder dataset root")
    p_train.add_argument("--output-dir", default="outputs/classifier")
    p_train.add_argument("--arch", default="efficientnet_b0", choices=["resnet50", "efficientnet_b0"])
    p_train.add_argument("--epochs", type=int, default=25)
    p_train.add_argument("--batch-size", type=int, default=64)
    p_train.add_argument("--img-size", type=int, default=224)
    p_train.add_argument("--lr", type=float, default=1e-4)
    p_train.add_argument("--min-lr", type=float, default=1e-6)
    p_train.add_argument("--label-smoothing", type=float, default=0.05)
    p_train.add_argument("--amp", action="store_true", help="Enable mixed precision (CUDA only)")
    p_train.add_argument("--val-ratio", type=float, default=0.2)
    p_train.add_argument("--workers", type=int, default=2)
    p_train.add_argument("--seed", type=int, default=42)
    p_train.add_argument("--device", default="0")
    p_train.add_argument("--early-stop-patience", type=int, default=8, help="Stop if val_acc does not improve")
    p_train.add_argument("--early-stop-min-delta", type=float, default=0.0, help="Min val_acc gain to count as improvement")
    p_train.add_argument("--resume", action="store_true", help="Resume from <output-dir>/last_classifier.pth")
    p_train.add_argument("--resume-ckpt", default="", help="Resume from a specific checkpoint path")

    p_cam = sub.add_parser("gradcam")
    p_cam.add_argument("--data-dir", required=True)
    p_cam.add_argument("--ckpt", required=True)
    p_cam.add_argument("--heatmap-out", default="outputs/gradcam_mean")
    p_cam.add_argument("--parts-out", default="outputs/pseudo_parts")
    p_cam.add_argument("--max-per-class", type=int, default=40)
    p_cam.add_argument("--threshold", type=float, default=0.65)
    p_cam.add_argument("--save-individual-parts", action="store_true")
    p_cam.add_argument("--workers", type=int, default=2)
    p_cam.add_argument("--device", default="0")

    p_proto = sub.add_parser("prototypes")
    p_proto.add_argument("--data-dir", required=True)
    p_proto.add_argument("--ckpt", required=True)
    p_proto.add_argument("--output-dir", default="outputs/prototypes")
    p_proto.add_argument("--batch-size", type=int, default=128)
    p_proto.add_argument("--workers", type=int, default=2)
    p_proto.add_argument("--device", default="0")

    p_inf = sub.add_parser("infer")
    p_inf.add_argument("--image", required=True)
    p_inf.add_argument("--ckpt", required=True)
    p_inf.add_argument("--prototypes", required=True)
    p_inf.add_argument("--topk", type=int, default=5)
    p_inf.add_argument(
        "--profile",
        choices=["custom", "strict", "balanced", "sensitive"],
        default="custom",
        help="Preset threshold profile; explicit threshold flags override profile values.",
    )
    p_inf.add_argument("--min-score", type=float, default=0.70)
    p_inf.add_argument("--min-score-2", type=float, default=0.50)
    p_inf.add_argument("--max-gap", type=float, default=0.08)
    p_inf.add_argument("--min-ratio", type=float, default=0.88)
    p_inf.add_argument("--min-mean-score", type=float, default=0.53)
    p_inf.add_argument("--device", default="0")

    args = p.parse_args()
    apply_infer_threshold_profile(args, sys.argv[1:])
    return args


def main() -> None:
    args = parse_args()
    if args.cmd == "train":
        train_classifier(args)
    elif args.cmd == "gradcam":
        gradcam_mean_and_parts(args)
    elif args.cmd == "prototypes":
        build_prototypes(args)
    elif args.cmd == "infer":
        infer_hybrid(args)


if __name__ == "__main__":
    main()
