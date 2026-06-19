# utils.py
# Các hàm tiện ích: xử lý ảnh, đặc trưng, v.v.

from typing import Tuple
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

import numpy as np
import cv2
from skimage.feature import hog


def load_image_bgr(path: str) -> np.ndarray | None:
	try:
		img = cv2.imread(path)
		return img
	except Exception:
		return None


def resize_keep_ratio(img: np.ndarray, target_size: Tuple[int, int] = (256, 256)) -> np.ndarray:
	h, w = img.shape[:2]
	th, tw = target_size
	scale = min(tw / w, th / h)
	nh, nw = int(h * scale), int(w * scale)
	resized = cv2.resize(img, (nw, nh), interpolation=cv2.INTER_AREA)
	canvas = np.zeros((th, tw, 3), dtype=resized.dtype)
	y0 = (th - nh) // 2
	x0 = (tw - nw) // 2
	canvas[y0 : y0 + nh, x0 : x0 + nw] = resized
	return canvas


def extract_hog_features(img: np.ndarray) -> np.ndarray:
	"""Trích xuất đặc trưng HOG từ ảnh BGR."""
	img256 = resize_keep_ratio(img, (256, 256))
	gray = cv2.cvtColor(img256, cv2.COLOR_BGR2GRAY)
	features = hog(
		gray,
		orientations=9,
		pixels_per_cell=(16, 16),
		cells_per_block=(2, 2),
		block_norm="L2-Hys",
		transform_sqrt=True,
		feature_vector=True,
	)
	return features.astype(np.float32)


def send_otp_email(to_email: str, subject: str, body_html: str) -> None:
    smtp_server = "smtp.gmail.com"
    port = 587
    sender_email = "nguyenhoangloi070904@gmail.com"
    sender_password = "fonzdazzggxygxob"

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = f"PetAI <{sender_email}>"
    message["To"] = to_email

    part = MIMEText(body_html, "html", "utf-8")
    message.attach(part)

    context = ssl.create_default_context()
    with smtplib.SMTP(smtp_server, port) as server:
        server.starttls(context=context)
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, message.as_string())
