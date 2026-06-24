from flask import Flask
from flask import redirect, url_for, session, request, flash, send_from_directory, abort
from authlib.integrations.flask_client import OAuth
import os
import re
import secrets
from urllib.parse import urlparse

from jwt_utils import build_jwt_access_token, build_mobile_deeplink


from connect import get_connection
from pymysql.cursors import DictCursor
from werkzeug.security import generate_password_hash


def _load_dotenv_if_present(path: str = ".env") -> None:
    """Load simple KEY=VALUE pairs into os.environ if not already set.

    Avoids extra dependencies; supports basic .env files.
    """
    base_dir = os.path.dirname(os.path.abspath(__file__))
    env_path = path if os.path.isabs(path) else os.path.join(base_dir, path)

    if not os.path.exists(env_path):
        return

    try:
        with open(env_path, "r", encoding="utf-8") as f:
            for raw_line in f:
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
        # Best-effort; don't block app startup
        return

# Import các Blueprint đã định nghĩa trong các module
from home import home_bp
from login import login_bp
from register import register_bp
from dashboard import dashboard_bp
from routes.dashboard_api import dashboard_api_bp
from upload import predict_bp
from logout import logout_bp
from history import history_bp
from analytics import stats_bp
from settings import settings_bp
from users import users_bp
from account import account_bp
from routes.health import health_bp
from routes.sepay import sepay_bp
from routes.legal import legal_bp
from config import configure_app
from middleware import register_block_inactive_users, register_csrf_protection, register_html_translation, register_maintenance_mode
from context_processors import register_context_processors
from error_handlers import register_error_handlers
from account_delete import account_delete_bp


_load_dotenv_if_present()

_BASE_DIR = os.path.dirname(os.path.abspath(__file__))
_GRADCAM_DIR = os.path.join(_BASE_DIR, "gradcam_mean")

app = Flask(
    __name__,
    template_folder=os.path.join(_BASE_DIR, "templates"),
    static_folder=os.path.join(_BASE_DIR, "static"),
)
app.secret_key = os.getenv("FLASK_SECRET_KEY") or secrets.token_hex(32)

# App configuration (uploads, allowed extensions, VietQR)
configure_app(app)

# Đăng ký các Blueprint với tiền tố URL
app.register_blueprint(home_bp, url_prefix="")
app.register_blueprint(login_bp, url_prefix="/login")
app.register_blueprint(register_bp, url_prefix="/register")
app.register_blueprint(dashboard_bp, url_prefix="/dashboard")
app.register_blueprint(dashboard_api_bp, url_prefix="/dashboard/api")
app.register_blueprint(predict_bp, url_prefix="/predict")
app.register_blueprint(logout_bp, url_prefix="/logout")
app.register_blueprint(history_bp, url_prefix="/history")
app.register_blueprint(stats_bp, url_prefix="/statistics")
app.register_blueprint(settings_bp, url_prefix="/settings")
app.register_blueprint(account_bp, url_prefix="/account")
app.register_blueprint(users_bp, url_prefix="/users")
app.register_blueprint(health_bp, url_prefix="")
app.register_blueprint(sepay_bp, url_prefix="")
app.register_blueprint(legal_bp, url_prefix="")
app.register_blueprint(account_delete_bp, url_prefix="/account")

# Middleware registration
register_maintenance_mode(app)
register_block_inactive_users(app)
register_csrf_protection(app)
register_html_translation(app)

# Context processors
register_context_processors(app)

# Error handlers
register_error_handlers(app)

# ---------------------------------------------------------------------------
# Background auto-cleanup: chuyển pending_delete -> deleted sau 30 ngày
# Dùng threading.Timer để tránh phụ thuộc apscheduler
# ---------------------------------------------------------------------------
import threading as _threading


def _run_delete_cleanup():
    """Chạy trong background thread — dọn dẹp tài khoản hết hạn xóa."""
    try:
        from connect import get_connection
        from models import DeleteAccountManager
        conn = get_connection()
        try:
            affected = DeleteAccountManager.auto_cleanup_expired(conn)
            if affected:
                import logging as _log
                _log.getLogger(__name__).info(
                    "[AUTO-CLEANUP] Đã vô hiệu hóa %d tài khoản hết hạn pending_delete.", affected
                )
        finally:
            conn.close()
    except Exception as _e:
        import logging as _log
        _log.getLogger(__name__).warning("[AUTO-CLEANUP] Lỗi: %s", _e)
    finally:
        # Lặp lại sau 1 giờ
        _t = _threading.Timer(3600, _run_delete_cleanup)
        _t.daemon = True
        _t.start()


# Khởi động lần đầu sau 60 giây (để app có thời gian fully boot)
_initial_timer = _threading.Timer(60, _run_delete_cleanup)
_initial_timer.daemon = True
_initial_timer.start()

# OAuth setup
oauth = OAuth(app)
google = None
if app.config.get("GOOGLE_CLIENT_ID") and app.config.get("GOOGLE_CLIENT_SECRET"):
    google = oauth.register(
        name="google",
        client_id=app.config["GOOGLE_CLIENT_ID"],
        client_secret=app.config["GOOGLE_CLIENT_SECRET"],
        server_metadata_url=app.config["GOOGLE_DISCOVERY_URL"],
        client_kwargs={"scope": "openid email profile"},
    )


def _normalize_username_from_email(email: str) -> str:
    base = (email.split("@", 1)[0] or "user").lower()
    base = re.sub(r"[^a-z0-9_]", "_", base)
    base = re.sub(r"_+", "_", base).strip("_")
    if len(base) < 3:
        base = "user"
    return base[:20]


def _ensure_unique_username(cur, base: str) -> str:
    username = base
    suffix = 1
    while True:
        cur.execute("SELECT 1 FROM users WHERE username = %s", (username,))
        if not cur.fetchone():
            return username

        suffix += 1
        suffix_str = str(suffix)
        trimmed = base[: max(3, 20 - (len(suffix_str) + 1))]
        username = f"{trimmed}_{suffix_str}"


def _get_or_create_user_from_google(userinfo: dict) -> tuple[dict, str | None]:
    email = (userinfo.get("email") or "").strip().lower()
    fullname = (userinfo.get("name") or "").strip() or email
    google_id = userinfo.get("sub") or userinfo.get("id")
    avatar = userinfo.get("picture") or userinfo.get("avatar")
    if not email:
        raise ValueError("missing_email")

    conn = get_connection()
    try:
        with conn.cursor(DictCursor) as cur:
            cur.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cur.fetchone()

            if not user:
                username_base = _normalize_username_from_email(email)
                username = _ensure_unique_username(cur, username_base)
                random_password = secrets.token_urlsafe(24)
                pwd_hash = generate_password_hash(random_password)

                cur.execute(
                    """
                    INSERT INTO users (username, password_hash, email, fullname, google_id, created_at, email_verified, force_change_password)
                    VALUES (%s, %s, %s, %s, %s, NOW(), 1, 0)
                    """,
                    (username, pwd_hash, email, fullname, google_id),
                )
                new_user_id = cur.lastrowid
                conn.commit()
                cur.execute(
                    """
                    SELECT id, username, fullname, email, role, is_active, google_id
                    FROM users
                    WHERE id = %s
                    """,
                    (new_user_id,),
                )
                user = cur.fetchone()
            else:
                if google_id and (not user.get("google_id")):
                    cur.execute(
                        "UPDATE users SET google_id = %s WHERE id = %s",
                        (google_id, user["id"]),
                    )
                    conn.commit()

        if not user:
            raise ValueError("create_user_failed")

        if not user.get("is_active", True):
            raise PermissionError("user_inactive")

        return user, avatar
    finally:
        try:
            conn.close()
        except Exception:
            pass


def _set_login_session(user: dict) -> None:
    session["user_id"] = user["id"]
    session["username"] = user.get("username")
    session["fullname"] = user.get("fullname") or user.get("username")
    session["email"] = user.get("email")
    session["role"] = user.get("role", "user")
    session["is_admin"] = (session.get("role") == "admin")


def _is_safe_next_url(target: str | None) -> bool:
    if not target:
        return False
    try:
        parsed = urlparse(target)
    except Exception:
        return False
    if parsed.scheme or parsed.netloc:
        return False
    return target.startswith("/") and not target.startswith("//")

# Google login route
@app.route("/login/google")
def login_google():
    if google is None:
        flash(
            "Google OAuth chưa được cấu hình. Hãy set GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET.",
            "error",
        )
        return redirect(url_for("login.login"))

    next_url = request.args.get("next")
    if _is_safe_next_url(next_url):
        session["oauth_next"] = next_url
     # Build both HTTPS and HTTP redirect URIs
    redirect_uri_https = url_for("authorize_google", _external=True, _scheme="https")
    redirect_uri_http = url_for("authorize_google", _external=True, _scheme="http")

    # If running locally, prefer HTTP; otherwise prefer HTTPS (or forwarded proto)
    host = (request.host or "").split(":")[0]
    forwarded = request.headers.get("X-Forwarded-Proto", "").split(",")[0].strip().lower()

    if host in ("localhost", "127.0.0.1"):
        redirect_uri = redirect_uri_http
    elif forwarded == "http":
        redirect_uri = redirect_uri_http
    else:
        redirect_uri = redirect_uri_https
    return google.authorize_redirect(redirect_uri)

# Google authorize callback
@app.route("/authorize/google")
def authorize_google():
    if google is None:
        flash("Google OAuth chưa được cấu hình.", "error")
        return redirect(url_for("login.login"))

    try:
        token = google.authorize_access_token()
    except Exception:
        flash("Phiên đăng nhập Google không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.", "warning")
        return redirect(url_for("login.login"))

    userinfo = token.get("userinfo")
    if not userinfo:
        # Fetch userinfo if not present
        resp = google.get("userinfo")
        userinfo = resp.json()

    try:
        user, _ = _get_or_create_user_from_google(userinfo)
    except PermissionError:
        flash("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.", "error")
        return redirect(url_for("login.login"))
    except ValueError:
        flash("Không lấy được email từ Google. Vui lòng thử lại.", "error")
        return redirect(url_for("login.login"))
    except Exception as e:
        print(f"[GOOGLE LOGIN ERROR] {e}")
        flash("Đăng nhập Google thất bại. Vui lòng thử lại.", "error")
        return redirect(url_for("login.login"))

    # Kiểm tra xem chế độ bảo trì có bật không và user không phải admin
    maintenance_active = False
    try:
        from models import SystemConfig
        conn = get_connection()
        try:
            val = SystemConfig.get(conn, "maintenance_mode", "0")
            maintenance_active = (val == "1")
        finally:
            conn.close()
    except Exception:
        pass

    if maintenance_active and user.get("role", "user") != "admin":
        lang = request.cookies.get("siteLanguage", "vi")
        if lang not in {"vi", "en"}:
            lang = "vi"
        if lang == "en":
            flash("The system is undergoing maintenance. Only administrator accounts can log in.", "error")
        else:
            flash("Hệ thống đang bảo trì. Chỉ tài khoản quản trị viên mới có thể đăng nhập.", "error")
        return redirect(url_for("login.login"))

    _set_login_session(user)
    flash(f"Xin chào, {session.get('fullname') or 'bạn'}!", "success")

    next_url = session.pop("oauth_next", None)
    if _is_safe_next_url(next_url):
        return redirect(next_url)
    return redirect(url_for("dashboard.dashboard"))


@app.route("/auth/google/login/flutter")
def login_google_flutter():
    if google is None:
        return redirect("petai://auth?error=google_not_configured")

    redirect_uri = "https://nonsuspensively-monacidic-raylan.ngrok-free.dev/auth/google/callback/flutter"
    return google.authorize_redirect(redirect_uri)


@app.route("/auth/google/callback/flutter")
def authorize_google_flutter():
    if google is None:
        return redirect("petai://auth?error=google_not_configured")

    try:
        redirect_uri = "https://nonsuspensively-monacidic-raylan.ngrok-free.dev/auth/google/callback/flutter"
        token = google.authorize_access_token(redirect_uri=redirect_uri)
    except Exception:
        return redirect("petai://auth?error=invalid_google_session")

    userinfo = token.get("userinfo")
    if not userinfo:
        resp = google.get("userinfo")
        userinfo = resp.json()

    try:
        user, avatar = _get_or_create_user_from_google(userinfo)
        jwt_token = build_jwt_access_token(user, avatar)
        deeplink = build_mobile_deeplink(jwt_token, user)
        return redirect(deeplink)
    except PermissionError:
        return redirect("petai://auth?error=user_inactive")
    except ValueError:
        return redirect("petai://auth?error=missing_email")
    except Exception as e:
        print(f"[GOOGLE LOGIN FLUTTER ERROR] {e}")
        return redirect("petai://auth?error=login_failed")
# Health route now provided via blueprint


@app.route("/artifacts/gradcam/<path:filename>")
def artifacts_gradcam(filename: str):
    # Serve precomputed Grad-CAM mean heatmaps.
    # Only allow image files to avoid exposing arbitrary files.
    if not filename:
        abort(404)
    name = filename.lower()
    if not name.endswith((".jpg", ".jpeg", ".png", ".webp")):
        abort(404)
    if not os.path.isdir(_GRADCAM_DIR):
        abort(404)
    return send_from_directory(_GRADCAM_DIR, filename)


if __name__ == "__main__":
    url = "http://127.0.0.1:5000"
    print(f"\nTruy cập ứng dụng tại: {url}\n")
    try:
        from waitress import serve
        serve(app, host="0.0.0.0", port=5000)
    except Exception:
        app.run(debug=True)
