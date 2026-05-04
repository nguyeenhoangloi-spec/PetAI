import os


def _env_bool(name: str, default: bool = False) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return bool(default)
    return str(raw).strip().lower() in {"1", "true", "yes", "y", "on"}


def configure_app(app):
    """Configure app settings (uploads, allowed extensions, VietQR).

    Keep sensitive values overridable via environment variables.
    """
    # Uploads
    upload_folder = os.path.join("static", "uploads")
    os.makedirs(upload_folder, exist_ok=True)
    app.config["UPLOAD_FOLDER"] = upload_folder
    app.config["ALLOWED_EXTENSIONS"] = {"png", "jpg", "jpeg"}

    # VietQR (EMVCo) config
    app.config["VIETQR_BANK_NAME"] = os.getenv("VIETQR_BANK_NAME", "MB Bank")
    app.config["VIETQR_BANK_BIN"] = os.getenv("VIETQR_BANK_BIN", "970422")
    app.config["VIETQR_ACCOUNT_NUMBER"] = os.getenv("VIETQR_ACCOUNT_NUMBER", "9244424440709")
    app.config["VIETQR_ACCOUNT_NAME"] = os.getenv("VIETQR_ACCOUNT_NAME", "NGUYEN HOANG LOI")
    app.config["VIETQR_MERCHANT_NAME"] = os.getenv("VIETQR_MERCHANT_NAME", "DOG AI APP")
    app.config["VIETQR_MERCHANT_CITY"] = os.getenv("VIETQR_MERCHANT_CITY", "HANOI")
    # Google OAuth config (DO NOT hardcode secrets in source)
    app.config["GOOGLE_CLIENT_ID"] = os.getenv("GOOGLE_CLIENT_ID", "")
    app.config["GOOGLE_CLIENT_SECRET"] = os.getenv("GOOGLE_CLIENT_SECRET", "")
    app.config["GOOGLE_DISCOVERY_URL"] = "https://accounts.google.com/.well-known/openid-configuration"

    # SePay webhook verification
    # SePay sends: Authorization: "Apikey <API_KEY>"
    app.config["SEPAY_API_KEY"] = os.getenv("SEPAY_API_KEY", "")

    # VietQR image API (optional). If set, app can use remote-rendered QR image.
    # Example: https://img.vietqr.io/image
    app.config["SEPAY_QR_API"] = os.getenv("SEPAY_QR_API", "https://img.vietqr.io/image")

    # Payment flow toggles (demo)
    # - If False: user cannot mark "I have transferred"; rely on webhook auto-confirm.
    app.config["ALLOW_MANUAL_TRANSFER_CONFIRM"] = _env_bool("ALLOW_MANUAL_TRANSFER_CONFIRM", True)
    # - If True: when user clicks confirm, order becomes PAID immediately (NOT secure in production).
    app.config["AUTO_CONFIRM_ON_USER_CONFIRM"] = _env_bool("AUTO_CONFIRM_ON_USER_CONFIRM", False)
