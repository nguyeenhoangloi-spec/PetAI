import json
import os
import io
import base64
import logging
from typing import Any, Dict, List, Optional, cast

import numpy as np
from PIL import Image

from breed_names import normalize_breed_label, to_common_vietnamese_breed_name

try:
	import torch
	import torch.nn as nn
	import torch.nn.functional as F
	from torchvision import models, transforms
except Exception:  # pragma: no cover - handled by model_ready flag
	torch = None
	nn = None
	F = None
	models = None
	transforms = None


IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]


logger = logging.getLogger(__name__)


def _softmax(logits: np.ndarray) -> np.ndarray:
	if logits.size == 0:
		return logits
	shifted = logits - np.max(logits)
	exp = np.exp(shifted)
	denom = np.sum(exp) + 1e-12
	return exp / denom


def _build_model(arch: str, num_classes: int):
	if models is None or nn is None:
		raise RuntimeError("PyTorch/torchvision chưa sẵn sàng")
	arch = arch.lower()
	if arch == "resnet50":
		model = models.resnet50(weights=None)
		model.fc = nn.Linear(model.fc.in_features, num_classes)
		return model
	if arch == "efficientnet_b0":
		model = models.efficientnet_b0(weights=None)
		classifier = model.classifier
		# torchvision typing can be loose here; we only need the Linear.in_features.
		linear = cast(Any, classifier[1])
		in_features = int(linear.in_features)
		classifier[1] = nn.Linear(in_features, num_classes)
		return model
	raise ValueError("Unsupported arch")


def _extract_embedding(model, x, arch: str):
	if F is None or torch is None:
		raise RuntimeError("PyTorch functional chưa sẵn sàng")
	arch = arch.lower()
	if arch == "resnet50":
		y = model.conv1(x)
		y = model.bn1(y)
		y = model.relu(y)
		y = model.maxpool(y)
		y = model.layer1(y)
		y = model.layer2(y)
		y = model.layer3(y)
		y = model.layer4(y)
		y = model.avgpool(y)
		y = torch.flatten(y, 1)
		return F.normalize(y, dim=1)
	if arch == "efficientnet_b0":
		y = model.features(x)
		y = model.avgpool(y)
		y = torch.flatten(y, 1)
		return F.normalize(y, dim=1)
	raise ValueError("Unsupported arch")


class ImagePredictor:
	"""Predictor dùng bộ model mới: classifier + prototype similarity."""

	def __init__(self, artifacts_root: str = "outputs"):
		self.artifacts_root = artifacts_root
		self.classifier_dir = os.path.join(self.artifacts_root, "classifier")
		self.prototypes_dir = os.path.join(self.artifacts_root, "prototypes")
		self.gradcam_dir = os.path.join(self.artifacts_root, "gradcam_mean")

		self.model = None
		self.device = None
		self.arch = "efficientnet_b0"
		self.img_size = 192
		self.classes: List[str] = []
		self.breed_name_vi_map: Dict[str, str] = {}
		self.prototypes: Optional[np.ndarray] = None
		self.transform = None
		self.use_tta = True
		self.model_ready = False
		self._load_error = ""

		self._resolve_artifact_dirs()
		self._load_breed_name_map()
		self._load_models()

	def _resolve_artifact_dirs(self) -> None:
		classifier_candidates = [
			os.path.join(self.artifacts_root, "classifier"),
			"classifier",
		]
		prototypes_candidates = [
			os.path.join(self.artifacts_root, "prototypes"),
			"prototypes",
		]
		gradcam_candidates = [
			os.path.join(self.artifacts_root, "gradcam_mean"),
			"gradcam_mean",
		]

		for p in classifier_candidates:
			if os.path.exists(os.path.join(p, "best_classifier.pth")):
				self.classifier_dir = p
				break

		for p in prototypes_candidates:
			if os.path.exists(os.path.join(p, "class_prototypes.npy")):
				self.prototypes_dir = p
				break

		for p in gradcam_candidates:
			if os.path.isdir(p):
				self.gradcam_dir = p
				break

	def _gradcam_filename(self, class_en: str) -> str:
		# Must match scripts/hybrid_breed_pipeline.py naming convention.
		return (class_en or "").replace("/", "-") + ".jpg"

	def _dynamic_gradcam_enabled(self) -> bool:
		value = str(os.getenv("ENABLE_DYNAMIC_GRADCAM", "1")).strip().lower()
		return value not in {"0", "false", "no", "off"}

	def _target_layer(self):
		if self.model is None:
			raise RuntimeError("Model chưa sẵn sàng")
		model = cast(Any, self.model)
		arch = self.arch.lower()
		if arch == "resnet50":
			return cast(Any, model.layer4)[-1]
		if arch == "efficientnet_b0":
			return cast(Any, model.features)[-1]
		raise ValueError("Unsupported arch for Grad-CAM")

	def _generate_dynamic_gradcam_overlay(self, img: Image.Image, class_idx: int) -> Optional[str]:
		if (
			not self._dynamic_gradcam_enabled()
			or self.model is None
			or self.transform is None
			or self.device is None
			or torch is None
			or F is None
		):
			return None

		activations = None
		gradients = None

		def _forward_hook(_module, _inputs, output):
			nonlocal activations
			activations = output

		def _backward_hook(_module, _grad_in, grad_out):
			nonlocal gradients
			gradients = grad_out[0]

		h1 = None
		h2 = None
		try:
			target_layer = self._target_layer()
			h1 = target_layer.register_forward_hook(_forward_hook)
			h2 = target_layer.register_full_backward_hook(_backward_hook)

			x = cast(Any, self.transform(img)).unsqueeze(0).to(self.device)
			self.model.zero_grad(set_to_none=True)
			logits = self.model(x)
			score = logits[:, int(class_idx)].sum()
			score.backward(retain_graph=False)

			if activations is None or gradients is None:
				return None

			weights = gradients.mean(dim=(2, 3), keepdim=True)
			cam = (weights * activations).sum(dim=1, keepdim=True)
			cam = F.relu(cam)
			cam = F.interpolate(cam, size=x.shape[-2:], mode="bilinear", align_corners=False)
			cam = cam[0, 0].detach().cpu().numpy()
			cam = cam - cam.min()
			cam = cam / (cam.max() + 1e-8)

			resample_bilinear = getattr(getattr(Image, "Resampling", Image), "BILINEAR", None)
			if resample_bilinear is None:
				resample_bilinear = getattr(Image, "BILINEAR", 2)
			base_img = img.resize((self.img_size, self.img_size), resample_bilinear).convert("RGB")
			base_np = np.array(base_img).astype(np.float32)

			heat = (cam * 255.0).clip(0, 255).astype(np.uint8)
			heat_rgb = np.stack([
				heat,
				np.clip(255 - np.abs(heat.astype(np.int16) - 128) * 2, 0, 255).astype(np.uint8),
				255 - heat,
			], axis=-1).astype(np.float32)

			overlay = (0.58 * base_np + 0.42 * heat_rgb).clip(0, 255).astype(np.uint8)
			buf = io.BytesIO()
			Image.fromarray(overlay).save(buf, format="PNG")
			encoded = base64.b64encode(buf.getvalue()).decode("ascii")
			return f"data:image/png;base64,{encoded}"
		except Exception:
			return None
		finally:
			try:
				if h1 is not None:
					h1.remove()
			except Exception:
				pass
			try:
				if h2 is not None:
					h2.remove()
			except Exception:
				pass

	def _load_breed_name_map(self) -> None:
		map_candidates = [
			os.path.join(self.prototypes_dir, "breed_names_vi.json"),
			os.path.join("models", "breed_names_vi.json"),
		]
		for map_path in map_candidates:
			if not os.path.exists(map_path):
				continue
			try:
				with open(map_path, "r", encoding="utf-8") as f:
					loaded = json.load(f)
				if isinstance(loaded, dict):
					normalized_map: Dict[str, str] = {}
					for k, v in loaded.items():
						key = str(k).strip()
						value = str(v).strip()
						if not key or not value:
							continue
						normalized_map[key] = value
						normalized_map[normalize_breed_label(key)] = value
					self.breed_name_vi_map = normalized_map
					return
			except Exception:
				continue

	def _to_vi_breed_name(self, name: str) -> str:
		canonical_en = normalize_breed_label(name)
		if canonical_en == "Unknown":
			return "Không xác định"
		if name in self.breed_name_vi_map:
			return self.breed_name_vi_map[name]
		if canonical_en in self.breed_name_vi_map:
			return self.breed_name_vi_map[canonical_en]
		return to_common_vietnamese_breed_name(canonical_en)

	def _load_models(self) -> None:
		if torch is None or transforms is None:
			self._load_error = "Thiếu thư viện torch/torchvision. Vui lòng cài dependencies mới."
			return
		assert torch is not None and transforms is not None

		ckpt_path = os.path.join(self.classifier_dir, "best_classifier.pth")
		prototypes_path = os.path.join(self.prototypes_dir, "class_prototypes.npy")
		classes_path = os.path.join(self.prototypes_dir, "classes.json")

		missing = [p for p in [ckpt_path, prototypes_path, classes_path] if not os.path.exists(p)]
		if missing:
			self._load_error = "Thiếu artifact model mới: " + ", ".join(missing)
			return

		try:
			self.device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
			ckpt = torch.load(ckpt_path, map_location=self.device)
			self.arch = str(ckpt.get("arch", "efficientnet_b0"))
			self.img_size = int(ckpt.get("img_size", 192))
			self.classes = list(ckpt.get("classes", []))
			if not self.classes:
				with open(classes_path, "r", encoding="utf-8") as f:
					self.classes = json.load(f)

			self.model = _build_model(self.arch, num_classes=len(self.classes)).to(self.device)
			self.model.load_state_dict(ckpt["state_dict"])
			self.model.eval()

			loaded_prototypes = np.load(prototypes_path)
			if loaded_prototypes.ndim != 2:
				raise RuntimeError(f"Prototype phải là ma trận 2D, nhận được shape={getattr(loaded_prototypes, 'shape', None)}")
			if loaded_prototypes.shape[0] != len(self.classes):
				raise RuntimeError(
					f"Lệch số lớp giữa prototypes ({loaded_prototypes.shape[0]}) và classes ({len(self.classes)}). "
					"Hãy đảm bảo prototypes/classes.json được tạo từ đúng checkpoint classifier."
				)
			self.prototypes = loaded_prototypes
			self.transform = transforms.Compose([
				transforms.Resize((self.img_size, self.img_size)),
				transforms.ToTensor(),
				transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
			])

			# Validate embedding dimension matches prototype dimension to avoid silent wrong results.
			with torch.no_grad():
				dummy = torch.zeros(1, 3, self.img_size, self.img_size, device=self.device)
				emb = _extract_embedding(self.model, dummy, self.arch)
				emb_dim = int(emb.shape[1])
			proto_dim = int(loaded_prototypes.shape[1])
			if emb_dim != proto_dim:
				raise RuntimeError(
					f"Lệch chiều embedding ({emb_dim}) và prototype ({proto_dim}). "
					"Hãy đảm bảo prototypes được build từ cùng kiến trúc/ckpt với classifier."
				)

			self.model_ready = True
		except Exception as e:
			self._load_error = f"Không thể load model mới: {e}"
			self.model_ready = False

	def _build_tta_views(self, img: Image.Image) -> List[Image.Image]:
		views = [img]
		try:
			# Pillow >= 10 uses Image.Transpose enum; keep backward compatibility.
			flip_const = getattr(getattr(Image, "Transpose", Image), "FLIP_LEFT_RIGHT", None)
			if flip_const is None:
				flip_const = getattr(Image, "FLIP_LEFT_RIGHT", None)
			if flip_const is not None:
				views.append(img.transpose(flip_const))
		except Exception:
			pass

		try:
			w, h = img.size
			crop_ratio = 0.90
			cw = max(1, int(w * crop_ratio))
			ch = max(1, int(h * crop_ratio))
			x1 = max(0, (w - cw) // 2)
			y1 = max(0, (h - ch) // 2)
			x2 = min(w, x1 + cw)
			y2 = min(h, y1 + ch)
			center_crop = img.crop((x1, y1, x2, y2))
			views.append(center_crop)
		except Exception:
			pass

		return views

	def _predict_similarity(self, img: Image.Image) -> np.ndarray:
		if self.model is None or self.prototypes is None or self.transform is None:
			raise RuntimeError("Model chưa sẵn sàng")
		if torch is None:
			raise RuntimeError("PyTorch chưa sẵn sàng")

		transform_fn = cast(Any, self.transform)
		device = self.device
		if device is None:
			raise RuntimeError("Thiết bị suy luận chưa sẵn sàng")
		prototypes = self.prototypes

		views = self._build_tta_views(img) if self.use_tta else [img]
		sim_vectors: List[np.ndarray] = []

		with torch.no_grad():
			for view in views:
				x = cast(Any, transform_fn(view)).unsqueeze(0).to(device)
				emb = _extract_embedding(self.model, x, self.arch)[0].cpu().numpy()
				emb = emb / (np.linalg.norm(emb) + 1e-8)
				sim_vectors.append(prototypes @ emb)

		if not sim_vectors:
			raise RuntimeError("Không tạo được vector similarity")
		return np.mean(np.stack(sim_vectors, axis=0), axis=0)

	def _predict_logits(self, img: Image.Image) -> np.ndarray:
		if self.model is None or self.transform is None:
			raise RuntimeError("Model chưa sẵn sàng")
		if torch is None:
			raise RuntimeError("PyTorch chưa sẵn sàng")

		transform_fn = cast(Any, self.transform)
		device = self.device
		if device is None:
			raise RuntimeError("Thiết bị suy luận chưa sẵn sàng")

		views = self._build_tta_views(img) if self.use_tta else [img]
		logits_vectors: List[np.ndarray] = []

		with torch.no_grad():
			for view in views:
				x = cast(Any, transform_fn(view)).unsqueeze(0).to(device)
				logits = self.model(x)
				logits_vectors.append(logits[0].detach().cpu().numpy())

		if not logits_vectors:
			raise RuntimeError("Không tạo được logits dự đoán")
		return np.mean(np.stack(logits_vectors, axis=0), axis=0)

	def predict(self, image_path: str) -> Dict[str, Any]:
		if not os.path.exists(image_path):
			return {
				"image_path": image_path,
				"species": "Unknown",
				"breed": "Không xác định",
				"breed_conf": 0.0,
				"parts_info": {},
				"model_ready": False,
				"message": "Không tìm thấy ảnh để suy luận.",
			}

		if not self.model_ready or self.model is None or self.prototypes is None or self.transform is None:
			return {
				"image_path": image_path,
				"species": "Dog",
				"breed": "Không xác định",
				"breed_conf": 0.0,
				"parts_info": {},
				"model_ready": False,
				"message": self._load_error or "Model chưa sẵn sàng.",
			}

		try:
			img = Image.open(image_path).convert("RGB")
			sims = self._predict_similarity(img)
			logits = self._predict_logits(img)
			probs = _softmax(logits)
			top_idx = np.argsort(-probs)[:5]
			sim_top_idx = np.argsort(-sims)[:5]

			top_breed_raw = self.classes[int(top_idx[0])] if len(top_idx) > 0 else "Unknown"
			top_breed_en = normalize_breed_label(top_breed_raw)
			top_breed = self._to_vi_breed_name(top_breed_raw)
			top_score_raw = float(sims[int(top_idx[0])]) if len(top_idx) > 0 else 0.0
			top_score = float(probs[int(top_idx[0])]) if len(top_idx) > 0 else 0.0
			softmax_entropy = 0.0
			if probs.size > 0:
				prob_vec = np.clip(probs.astype(np.float64), 1e-12, 1.0)
				prob_vec = prob_vec / (np.sum(prob_vec) + 1e-12)
				entropy_raw = float(-np.sum(prob_vec * np.log(prob_vec)))
				entropy_max = float(np.log(max(len(prob_vec), 2)))
				if entropy_max > 0.0:
					softmax_entropy = entropy_raw / entropy_max
				softmax_entropy = max(0.0, min(1.0, softmax_entropy))
			breed_accept_threshold = float(os.getenv("BREED_ACCEPT_THRESHOLD", "0.70"))
			breed_reference_threshold = float(os.getenv("BREED_REFERENCE_THRESHOLD", "0.55"))
			if breed_reference_threshold > breed_accept_threshold:
				breed_reference_threshold = breed_accept_threshold

			confidence_level = "reject"
			if top_score >= breed_accept_threshold:
				confidence_level = "conclude"
			elif top_score >= breed_reference_threshold:
				confidence_level = "reference"

			is_breed_confident = confidence_level == "conclude"
			is_breed_reference = confidence_level == "reference"

			# Hybrid suggestion is morphology-based (not genetic confirmation).
			min_score = float(os.getenv("HYBRID_MIN_SCORE", "0.55"))
			min_score_2 = float(os.getenv("HYBRID_MIN_SCORE_2", "0.50"))
			max_gap = float(os.getenv("HYBRID_MAX_GAP", "0.12"))
			min_ratio = float(os.getenv("HYBRID_MIN_RATIO", "0.88"))
			min_mean_score = float(os.getenv("HYBRID_MIN_MEAN_SCORE", "0.53"))
			tie_enabled = str(os.getenv("HYBRID_TIE_ENABLED", "1")).strip().lower() not in {"0", "false", "no", "off"}
			tie_max_gap = float(os.getenv("HYBRID_TIE_MAX_GAP", "0.01"))
			distant_enabled = str(os.getenv("HYBRID_DISTANT_ENABLED", "0")).strip().lower() not in {"0", "false", "no", "off"}
			distant_min_score = float(os.getenv("HYBRID_DISTANT_MIN_SCORE", "0.35"))
			distant_min_score_2 = float(os.getenv("HYBRID_DISTANT_MIN_SCORE_2", "0.33"))
			distant_max_gap = float(os.getenv("HYBRID_DISTANT_MAX_GAP", "0.05"))
			distant_min_ratio = float(os.getenv("HYBRID_DISTANT_MIN_RATIO", "0.93"))
			distant_min_mean_score = float(os.getenv("HYBRID_DISTANT_MIN_MEAN_SCORE", "0.36"))
			distant_min_entropy = float(os.getenv("HYBRID_DISTANT_MIN_ENTROPY", "0.72"))
			max_gap = max(0.0, max_gap)
			min_ratio = max(0.0, min(1.0, min_ratio))
			tie_max_gap = max(0.0, tie_max_gap)
			distant_max_gap = max(0.0, distant_max_gap)
			distant_min_ratio = max(0.0, min(1.0, distant_min_ratio))
			distant_min_entropy = max(0.0, min(1.0, distant_min_entropy))
			note = ""
			decision = {
				"is_hybrid_candidate": False,
				"hybrid_mode": "none",
				"reason": "Ứng viên thuần chủng/chiếm ưu thế.",
				"top1_score": None,
				"top2_score": None,
				"score_gap": None,
				"top2_top1_ratio": None,
				"effective_max_gap": None,
				"top12_mean_score": None,
				"softmax_entropy": softmax_entropy,
				"min_score": min_score,
				"min_score_2": min_score_2,
				"max_gap": max_gap,
				"min_ratio": min_ratio,
				"min_mean_score": min_mean_score,
				"tie_enabled": tie_enabled,
				"tie_max_gap": tie_max_gap,
				"distant_enabled": distant_enabled,
				"distant_min_score": distant_min_score,
				"distant_min_score_2": distant_min_score_2,
				"distant_max_gap": distant_max_gap,
				"distant_min_ratio": distant_min_ratio,
				"distant_min_mean_score": distant_min_mean_score,
				"distant_min_entropy": distant_min_entropy,
			}
			# Hybrid candidate logic should be based on similarity ranking (prototype-nearest),
			# not softmax ranking (classifier probabilities).
			if len(sim_top_idx) >= 2:
				s1 = float(sims[int(sim_top_idx[0])])
				s2 = float(sims[int(sim_top_idx[1])])
				gap = max(0.0, s1 - s2)
				ratio = (s2 / max(s1, 1e-8)) if s1 > 0.0 else 0.0
				effective_max_gap = min(max_gap, max(0.0, (1.0 - min_ratio) * s1))
				is_tie_close_pair = gap <= tie_max_gap
				is_strict_close_pair = gap <= effective_max_gap
				is_distant_close_pair = gap <= distant_max_gap
				mean_top2 = (s1 + s2) / 2.0
				strict_hybrid_candidate = (
					(s1 >= min_score)
					and (s2 >= min_score_2)
					and is_strict_close_pair
					and (mean_top2 >= min_mean_score)
				)
				tie_hybrid_candidate = (
					tie_enabled
					and (not strict_hybrid_candidate)
					and is_tie_close_pair
				)
				distant_hybrid_candidate = (
					distant_enabled
					and (not strict_hybrid_candidate)
					and (not tie_hybrid_candidate)
					and (s1 >= distant_min_score)
					and (s2 >= distant_min_score_2)
					and (ratio >= distant_min_ratio)
					and is_distant_close_pair
					and (mean_top2 >= distant_min_mean_score)
					and (softmax_entropy >= distant_min_entropy)
				)
				decision.update({
					"top1_score": s1,
					"top2_score": s2,
					"score_gap": gap,
					"top2_top1_ratio": ratio,
					"effective_max_gap": effective_max_gap,
					"top12_mean_score": mean_top2,
					"tie_hybrid_candidate": tie_hybrid_candidate,
					"strict_hybrid_candidate": strict_hybrid_candidate,
					"distant_hybrid_candidate": distant_hybrid_candidate,
				})
				if strict_hybrid_candidate:
					decision["is_hybrid_candidate"] = True
					decision["hybrid_mode"] = "strict"
					decision["reason"] = "Ứng viên nghi lai."
					top1_vi = self._to_vi_breed_name(self.classes[int(sim_top_idx[0])])
					top2_vi = self._to_vi_breed_name(self.classes[int(sim_top_idx[1])])
					note = ""
				elif tie_hybrid_candidate:
					decision["is_hybrid_candidate"] = True
					decision["hybrid_mode"] = "tie"
					decision["reason"] = "Ứng viên nghi lai (Top-1 và Top-2 rất sát nhau)."
					top1_vi = self._to_vi_breed_name(self.classes[int(sim_top_idx[0])])
					top2_vi = self._to_vi_breed_name(self.classes[int(sim_top_idx[1])])
					note = ""
				elif distant_hybrid_candidate:
					decision["is_hybrid_candidate"] = True
					decision["hybrid_mode"] = "distant"
					decision["reason"] = "Ứng viên nghi lai."
					top1_vi = self._to_vi_breed_name(self.classes[int(sim_top_idx[0])])
					top2_vi = self._to_vi_breed_name(self.classes[int(sim_top_idx[1])])
					note = ""
				else:
					decision["reason"] = (
						"Ứng viên thuần chủng/chiếm ưu thế theo tương đồng hình thái."
					)
					top1_vi = self._to_vi_breed_name(self.classes[int(sim_top_idx[0])])
					note = f"Ứng viên thuần chủng/chiếm ưu thế: {top1_vi}."
			else:
				note = f"Ứng viên thuần chủng/chiếm ưu thế: {top_breed}."

			top3_mode = "similarity" if bool(decision.get("is_hybrid_candidate")) else "softmax"
			top3_note = (
				"Top 3 theo tương đồng hình thái (similarity)."
				if top3_mode == "similarity"
				else "Top 3 theo xác suất softmax."
			)

			parts_info = {
				"top5": [
					{
						"breed": self._to_vi_breed_name(self.classes[int(i)]),
						"breed_en": normalize_breed_label(self.classes[int(i)]),
						"breed_raw": self.classes[int(i)],
						"score": float(probs[int(i)]),
						"raw_score": float(sims[int(i)]),
					}
					for i in top_idx
				],
				"similarity_top3": [
					{
						"breed": self._to_vi_breed_name(self.classes[int(i)]),
						"breed_en": normalize_breed_label(self.classes[int(i)]),
						"breed_raw": self.classes[int(i)],
						"score": float(sims[int(i)]),
					}
					for i in sim_top_idx[:3]
				],
				"gradcam": {"items": []},
				"gradcam_dynamic": {"items": []},
				"thresholds": {
					"min_score": min_score,
					"min_score_2": min_score_2,
					"max_gap": max_gap,
					"min_ratio": min_ratio,
					"min_mean_score": min_mean_score,
					"tie_enabled": tie_enabled,
					"tie_max_gap": tie_max_gap,
					"distant_enabled": distant_enabled,
					"distant_min_score": distant_min_score,
					"distant_min_score_2": distant_min_score_2,
					"distant_max_gap": distant_max_gap,
					"distant_min_ratio": distant_min_ratio,
					"distant_min_mean_score": distant_min_mean_score,
					"distant_min_entropy": distant_min_entropy,
				},
				"decision": decision,
				"display": {
					"top3_mode": top3_mode,
					"top3_note": top3_note,
				},
				"acceptance": {
					"accepted": is_breed_confident,
					"level": confidence_level,
					"threshold": breed_accept_threshold,
					"reference_threshold": breed_reference_threshold,
				},
				"calibration": {
					"method": "classifier_softmax",
					"prob_temperature": None,
					"top1_raw_similarity": top_score_raw,
					"top1_softmax_confidence": top_score,
					"softmax_entropy": softmax_entropy,
				},
			}

			# Attach Grad-CAM heatmaps if precomputed assets exist.
			grad_items: List[Dict[str, str]] = []
			if self.gradcam_dir and os.path.isdir(self.gradcam_dir) and len(self.classes) > 0:
				def _add_grad(label: str, class_en: str) -> None:
					fname = self._gradcam_filename(class_en)
					if not fname:
						return
					if os.path.exists(os.path.join(self.gradcam_dir, fname)):
						grad_items.append({
							"label": label,
							"breed": self._to_vi_breed_name(class_en),
							"filename": fname,
						})

				# Show one explanation mode at a time to avoid user confusion.
				if decision.get("is_hybrid_candidate") and len(sim_top_idx) >= 2:
					_add_grad("Top-1(sim)", self.classes[int(sim_top_idx[0])])
					_add_grad("Top-2(sim)", self.classes[int(sim_top_idx[1])])
				else:
					if len(top_idx) > 0:
						main_label = "Top-1 (kết luận)" if is_breed_confident else "Top-1 (tham khảo)"
						_add_grad(main_label, self.classes[int(top_idx[0])])

			parts_info["gradcam"]["items"] = grad_items

			# Dynamic Grad-CAM overlays for the current uploaded image.
			dynamic_items: List[Dict[str, str]] = []
			dynamic_candidates: List[tuple[str, int]] = []
			if decision.get("is_hybrid_candidate") and len(sim_top_idx) >= 2:
				dynamic_candidates.append(("Top-1(sim)", int(sim_top_idx[0])))
				dynamic_candidates.append(("Top-2(sim)", int(sim_top_idx[1])))
			else:
				if len(top_idx) > 0:
					main_label = "Top-1 (kết luận)" if is_breed_confident else "Top-1 (tham khảo)"
					dynamic_candidates.append((main_label, int(top_idx[0])))

			seen_dynamic: set[int] = set()
			for label, class_idx in dynamic_candidates:
				if class_idx in seen_dynamic:
					continue
				seen_dynamic.add(class_idx)
				overlay_data = self._generate_dynamic_gradcam_overlay(img, class_idx)
				if overlay_data:
					dynamic_items.append({
						"label": label,
						"breed": self._to_vi_breed_name(self.classes[class_idx]),
						"image_data": overlay_data,
					})

			parts_info["gradcam_dynamic"]["items"] = dynamic_items

			hybrid_conf = top_score
			if decision.get("is_hybrid_candidate"):
				mean_top2_score = float(decision.get("top12_mean_score") or 0.0)
				hybrid_conf = max(top_score, max(0.0, min(1.0, mean_top2_score)))

			hybrid_label = None
			if decision.get("is_hybrid_candidate") and len(sim_top_idx) >= 2:
				sim_top1_vi = self._to_vi_breed_name(self.classes[int(sim_top_idx[0])])
				sim_top2_vi = self._to_vi_breed_name(self.classes[int(sim_top_idx[1])])
				hybrid_label = f"Nghi lai: {sim_top1_vi} x {sim_top2_vi}"

			# Keep the final displayed label consistent with the hybrid decision.
			final_breed = hybrid_label or top_breed
			if is_breed_reference:
				note = ""
				logger.info(
					"Reference confidence | image=%s | score=%.4f (%.1f%%) | conclude_threshold=%.4f (%.0f%%) | note=%s",
					image_path,
					top_score,
					top_score * 100.0,
					breed_accept_threshold,
					breed_accept_threshold * 100.0,
					note,
				)
			elif not is_breed_confident and not hybrid_label:
				# If the image already passed dog-gate, prefer showing Top-1 breed
				# instead of returning an empty/unknown breed to end users.
				final_breed = top_breed
				decision["is_hybrid_candidate"] = False
				decision["reason"] = "Giống hiển thị theo Top-1 dự đoán."
				note = ""

			return {
				"image_path": image_path,
				"species": "Dog",
				"breed": final_breed,
				"breed_en": top_breed_en,
				"breed_conf": max(0.0, min(1.0, hybrid_conf if decision.get("is_hybrid_candidate") else top_score)),
				"parts_info": parts_info,
				"model_ready": True,
				"note": note,
				"message": "Dự đoán thành công bằng classifier softmax (Top-3) + similarity (giải thích).",
			}
		except Exception:
			logger.exception("Loi suy luan predictor cho anh: %s", image_path)
			return {
				"image_path": image_path,
				"species": "Dog",
				"breed": "Không xác định",
				"breed_conf": 0.0,
				"parts_info": {},
				"model_ready": False,
				"message": "Hệ thống tạm thời gặp lỗi khi xử lý ảnh. Vui lòng thử lại.",
			}
