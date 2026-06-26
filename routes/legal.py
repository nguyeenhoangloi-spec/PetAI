import re
import os
import threading
import time
from collections import defaultdict
from flask import Blueprint, render_template, request, jsonify, session
from utils import send_otp_email

legal_bp = Blueprint("legal", __name__)

ADMIN_EMAIL = os.getenv("SMTP_EMAIL", "nguyenhoangloi070904@gmail.com")

# Global dictionary to track IP rate limit in memory (key: client_ip, value: list of timestamps)
contact_rate_limit = defaultdict(list)


def _validate_email(email: str) -> bool:
    return bool(re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email))


def _send_contact_emails(fullname: str, email: str, theme: str, memo: str):
    """Send notification to admin and confirmation to sender (runs in background thread)."""
    # 1. Email thông báo cho admin
    admin_html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#f9fafb;border-radius:12px;padding:28px">
      <div style="background:#2563eb;border-radius:8px;padding:16px 24px;margin-bottom:20px">
        <h2 style="color:#fff;margin:0;font-size:18px">📩 Tin nhắn mới từ trang liên hệ PetAI</h2>
      </div>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#64748b;width:130px">Họ tên:</td><td style="padding:8px 0;font-weight:600;color:#0f172a">{fullname}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b">Email:</td><td style="padding:8px 0;color:#2563eb"><a href="mailto:{email}">{email}</a></td></tr>
        <tr><td style="padding:8px 0;color:#64748b;vertical-align:top">Chủ đề:</td><td style="padding:8px 0;color:#0f172a">{theme}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;vertical-align:top">Nội dung:</td><td style="padding:8px 0;color:#334155;white-space:pre-wrap">{memo}</td></tr>
      </table>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0">
      <p style="color:#94a3b8;font-size:12px;margin:0">Email tự động từ hệ thống PetAI — Không cần trả lời email này.</p>
    </div>
    """
    try:
        send_otp_email(
            to_email=ADMIN_EMAIL,
            subject=f"[PetAI] Tin nhắn mới: {theme} — {fullname}",
            body_html=admin_html,
        )
    except Exception:
        pass  # Do not crash on email failure

    # 2. Email xác nhận cho người gửi
    confirm_html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#f9fafb;border-radius:12px;padding:28px">
      <div style="background:#2563eb;border-radius:8px;padding:16px 24px;margin-bottom:20px">
        <h2 style="color:#fff;margin:0;font-size:18px">🐾 Cảm ơn bạn đã liên hệ PetAI!</h2>
      </div>
      <p style="color:#334155">Xin chào <strong>{fullname}</strong>,</p>
      <p style="color:#334155">Chúng tôi đã nhận được tin nhắn của bạn về chủ đề: <strong>"{theme}"</strong>.</p>
      <p style="color:#334155">Đội ngũ PetAI sẽ phản hồi trong vòng <strong>24 giờ làm việc</strong>.</p>
      <div style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:4px;padding:12px 16px;margin:16px 0">
        <p style="margin:0;color:#1e40af;font-size:13px"><strong>Nội dung bạn gửi:</strong></p>
        <p style="margin:6px 0 0;color:#334155;font-size:13px;white-space:pre-wrap">{memo}</p>
      </div>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0">
      <p style="color:#94a3b8;font-size:12px;margin:0">PetAI — AI nhận diện thú cưng thông minh 🐶🐱</p>
    </div>
    """
    try:
        send_otp_email(
            to_email=email,
            subject="[PetAI] Chúng tôi đã nhận được tin nhắn của bạn!",
            body_html=confirm_html,
        )
    except Exception:
        pass


@legal_bp.route("/contact/send", methods=["POST"])
def contact_send():
    """Handle contact form submission: validate + send emails only (no DB)."""
    # 1. Check IP Rate Limiting (max 3 per 1 hour)
    client_ip = request.headers.get('X-Forwarded-For', request.remote_addr or '')
    if ',' in client_ip:
        client_ip = client_ip.split(',')[0].strip()
    
    now = time.time()
    # Clean up and keep timestamps within 3600 seconds (1 hour)
    contact_rate_limit[client_ip] = [t for t in contact_rate_limit[client_ip] if now - t < 3600]
    
    if len(contact_rate_limit[client_ip]) >= 3:
        return jsonify({"success": False, "error": "rate_limited"}), 429

    data = request.get_json(silent=True) or {}
    
    # 2. Get credentials (pre-fill from session if logged in to prevent email spoofing)
    if session.get("user_id"):
        fullname = (session.get("fullname") or session.get("username") or "").strip()
        email    = (session.get("email") or "").strip().lower()
    else:
        fullname = (data.get("fullname") or "").strip()
        email    = (data.get("email")    or "").strip().lower()

    theme = (data.get("theme") or "").strip()
    memo  = (data.get("memo")  or "").strip()

    # Validate
    if not all([fullname, email, theme, memo]):
        return jsonify({"success": False, "error": "missing_fields"}), 400
    if not _validate_email(email):
        return jsonify({"success": False, "error": "invalid_email"}), 400
    if len(fullname) > 128 or len(theme) > 255 or len(memo) > 5000:
        return jsonify({"success": False, "error": "too_long"}), 400

    # Record rate limit timestamp
    contact_rate_limit[client_ip].append(now)

    # Send emails in background (non-blocking)
    t = threading.Thread(target=_send_contact_emails, args=(fullname, email, theme, memo), daemon=True)
    t.start()

    return jsonify({"success": True}), 200


@legal_bp.route("/privacy-policy.html")
@legal_bp.route("/privacy-policy")
def privacy_policy():
	return render_template("privacy-policy.html")


@legal_bp.route("/payment-policy.html")
@legal_bp.route("/payment-policy")
def payment_policy():
	return render_template("payment-policy.html")


@legal_bp.route("/terms-of-service.html")
@legal_bp.route("/terms-of-service")
def terms_of_service():
	return render_template("terms-of-service.html")


@legal_bp.route("/data-deletion.html")
@legal_bp.route("/data-deletion")
def data_deletion():
	return render_template("data-deletion.html")


@legal_bp.route("/support.html")
@legal_bp.route("/support")
def support():
	return render_template("support.html")


@legal_bp.route("/contact.html")
@legal_bp.route("/contact")
def contact():
	return render_template("contact.html")


@legal_bp.route("/user-guide.html")
@legal_bp.route("/user-guide")
def user_guide():
	return render_template("user-guide.html")