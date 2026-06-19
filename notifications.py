# notifications.py
# Các hàm gửi email thông báo quan trọng cho user.
# Mỗi hàm đều chạy trong thread riêng để không block request.

import os
import threading
from datetime import datetime

_APP_URL = os.getenv("APP_BASE_URL", "http://127.0.0.1:5000")


def _send_async(to_email: str, subject: str, body_html: str) -> None:
    """Gửi email trong thread riêng."""
    def _do_send():
        try:
            from utils import send_otp_email
            send_otp_email(to_email, subject, body_html)
            print(f"[NOTIFY] Email gửi tới {to_email}: {subject}")
        except Exception as e:
            print(f"[NOTIFY] Lỗi gửi email tới {to_email}: {e}")
    t = threading.Thread(target=_do_send, daemon=True)
    t.start()


def _base_layout(content_html: str) -> str:
    return f"""
<html>
<body style="margin:0;padding:0;background:#f0f4ff;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:12px;
              box-shadow:0 4px 24px rgba(0,74,198,0.10);overflow:hidden;">
    <!-- Header -->
    <div style="background:#004ac6;padding:24px 32px;text-align:center;">
      <span style="color:#fff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">🐾 PetAI</span>
    </div>
    <!-- Body -->
    <div style="padding:28px 32px;color:#1a202c;line-height:1.7;">
      {content_html}
    </div>
    <!-- Footer -->
    <div style="background:#f7f8fb;padding:16px 32px;text-align:center;
                font-size:12px;color:#718096;border-top:1px solid #e2e8f0;">
      © 2025 PetAI · Bạn có thể tắt thông báo trong
      <a href="http://127.0.0.1:5000/settings" style="color:#004ac6;">Cài đặt</a>
    </div>
  </div>
</body>
</html>"""


# ---------------------------------------------------------------------------
# 1. Chào mừng sau khi đăng ký thành công
# ---------------------------------------------------------------------------
def send_welcome_email(to_email: str, fullname: str) -> None:
    subject = "[PetAI] Chào mừng bạn đến với PetAI! 🎉"
    content = f"""
      <h2 style="margin:0 0 16px;color:#004ac6;">Chào mừng, {fullname}!</h2>
      <p>Tài khoản PetAI của bạn đã được <b>kích hoạt thành công</b>.</p>
      <p>Bây giờ bạn có thể:</p>
      <ul style="padding-left:20px;color:#2d3748;">
        <li>Nhận diện giống chó từ ảnh với AI</li>
        <li>Xem lịch sử phân tích của bạn</li>
        <li>Nâng cấp gói để dùng không giới hạn</li>
      </ul>
      <div style="text-align:center;margin:24px 0;">
        <a href="{_APP_URL}"
           style="background:#004ac6;color:#fff;padding:12px 32px;border-radius:8px;
                  text-decoration:none;font-weight:600;font-size:15px;display:inline-block;">
          Bắt đầu ngay →
        </a>
      </div>
    """
    _send_async(to_email, subject, _base_layout(content))


# ---------------------------------------------------------------------------
# 2. Gói cước được kích hoạt / nâng cấp thành công
# ---------------------------------------------------------------------------
def send_plan_activated_email(to_email: str, fullname: str, plan: str,
                               plan_expire=None) -> None:
    plan_label = plan.upper()
    expire_str = ""
    if plan_expire:
        try:
            if isinstance(plan_expire, str):
                plan_expire = datetime.fromisoformat(plan_expire)
            expire_str = plan_expire.strftime("%d/%m/%Y lúc %H:%M")
        except Exception:
            expire_str = str(plan_expire)

    expire_row = ""
    if expire_str:
        expire_row = f"<p><b>Hết hạn:</b> {expire_str}</p>"

    plan_colors = {
        "BASIC": "#0ea5e9",
        "PRO": "#7c3aed",
        "ENTERPRISE": "#d97706",
    }
    badge_color = plan_colors.get(plan_label, "#004ac6")

    subject = f"[PetAI] Gói {plan_label} đã được kích hoạt thành công 🎊"
    content = f"""
      <h2 style="margin:0 0 16px;color:#004ac6;">Kích hoạt gói thành công!</h2>
      <p>Xin chào <b>{fullname}</b>,</p>
      <p>Gói dịch vụ của bạn đã được xác nhận và kích hoạt:</p>
      <div style="background:#f0f4ff;border-radius:10px;padding:20px 24px;margin:16px 0;">
        <p style="margin:0 0 8px;">
          <span style="background:{badge_color};color:#fff;padding:4px 14px;border-radius:20px;
                       font-weight:700;font-size:15px;">{plan_label}</span>
        </p>
        {expire_row}
        <p style="margin:8px 0 0;font-size:13px;color:#718096;">
          Mọi tính năng của gói đã sẵn sàng để sử dụng.
        </p>
      </div>
      <div style="text-align:center;margin:24px 0;">
        <a href="{_APP_URL}"
           style="background:#004ac6;color:#fff;padding:12px 32px;border-radius:8px;
                  text-decoration:none;font-weight:600;font-size:15px;display:inline-block;">
          Sử dụng ngay →
        </a>
      </div>
    """
    _send_async(to_email, subject, _base_layout(content))


# ---------------------------------------------------------------------------
# 3. Gói cước sắp hết hạn (gọi từ context khi user đăng nhập)
# ---------------------------------------------------------------------------
def send_plan_expiring_email(to_email: str, fullname: str, plan: str,
                              plan_expire, days_left: int) -> None:
    plan_label = plan.upper()
    try:
        if isinstance(plan_expire, str):
            plan_expire = datetime.fromisoformat(plan_expire)
        expire_str = plan_expire.strftime("%d/%m/%Y lúc %H:%M")
    except Exception:
        expire_str = str(plan_expire)

    subject = f"[PetAI] Gói {plan_label} của bạn sắp hết hạn ({days_left} ngày) ⏰"
    content = f"""
      <h2 style="margin:0 0 16px;color:#d97706;">Nhắc nhở: Gói sắp hết hạn!</h2>
      <p>Xin chào <b>{fullname}</b>,</p>
      <p>Gói <b>{plan_label}</b> của bạn sẽ hết hạn vào <b>{expire_str}</b>
         (còn <b>{days_left} ngày</b>).</p>
      <p>Gia hạn ngay để không bị gián đoạn dịch vụ:</p>
      <div style="text-align:center;margin:24px 0;">
        <a href="{_APP_URL}/predict/upgrade"
           style="background:#d97706;color:#fff;padding:12px 32px;border-radius:8px;
                  text-decoration:none;font-weight:600;font-size:15px;display:inline-block;">
          Gia hạn gói →
        </a>
      </div>
    """
    _send_async(to_email, subject, _base_layout(content))


# ---------------------------------------------------------------------------
# 4. Đổi mật khẩu thành công
# ---------------------------------------------------------------------------
def send_password_changed_email(to_email: str, fullname: str) -> None:
    now_str = datetime.now().strftime("%d/%m/%Y lúc %H:%M")
    subject = "[PetAI] Mật khẩu của bạn đã được thay đổi 🔒"
    content = f"""
      <h2 style="margin:0 0 16px;color:#004ac6;">Mật khẩu đã được đổi</h2>
      <p>Xin chào <b>{fullname}</b>,</p>
      <p>Mật khẩu tài khoản PetAI của bạn đã được thay đổi thành công vào
         <b>{now_str}</b>.</p>
      <p style="color:#e53e3e;"><b>⚠️ Nếu bạn không thực hiện thao tác này</b>,
         hãy đổi lại mật khẩu ngay và liên hệ hỗ trợ.</p>
      <div style="text-align:center;margin:24px 0;">
        <a href="{_APP_URL}/settings"
           style="background:#004ac6;color:#fff;padding:12px 32px;border-radius:8px;
                  text-decoration:none;font-weight:600;font-size:15px;display:inline-block;">
          Vào cài đặt →
        </a>
      </div>
    """
    _send_async(to_email, subject, _base_layout(content))
