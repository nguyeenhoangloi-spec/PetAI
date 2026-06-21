# settings.py
# Blueprint cho cài đặt người dùng

from flask import Blueprint, render_template, session, redirect, url_for, flash, request
from connect import get_connection
from models import UserSettings
import os
import logging

settings_bp = Blueprint("settings", __name__)
logger = logging.getLogger(__name__)


@settings_bp.route("/", methods=["GET", "POST"])
def settings():
    """Trang cài đặt"""
    if not session.get("user_id"):
        flash("Vui lòng đăng nhập để truy cập cài đặt.", "warning")
        return redirect(url_for("login.login"))
    try:
        user_id = int(session["user_id"])
    except Exception:
        flash("Phiên đăng nhập không hợp lệ.", "error")
        return redirect(url_for("login.login"))
    
    if request.method == "POST":
        try:
            conn = get_connection()
            theme = request.form.get('theme', 'light').strip()
            fullname = request.form.get("fullname", "").strip()
            if not fullname:
                fullname = (session.get("fullname") or session.get("username") or "").strip()
            if len(fullname) < 2 or len(fullname) > 128:
                conn.close()
                flash("Họ và tên phải có từ 2 đến 128 ký tự.", "error")
                return redirect(url_for("settings.settings"))
            
            # Validate theme
            if theme not in ('light', 'dark', 'auto'):
                theme = 'light'
            
            settings_data = {
                'theme': theme,
                'notifications': request.form.get('notifications') == 'on',
                'email_notifications': request.form.get('email_notifications') == 'on',
                'language': request.form.get('language', 'vi').strip() or 'vi',
            }

            # Optional Password Change logic
            current_password = request.form.get("current_password", "").strip()
            new_password = request.form.get("new_password", "").strip()
            confirm_new_password = request.form.get("confirm_new_password", "").strip()

            password_changed = False
            
            # Kiểm tra xem user này có đang bị bắt buộc đổi mật khẩu hay không
            is_force_change = False
            pwd_hash = ""
            with conn.cursor() as cur:
                cur.execute("SELECT password_hash, force_change_password FROM users WHERE id = %s", (user_id,))
                row = cur.fetchone()
                if row:
                    pwd_hash = row[0]
                    is_force_change = bool(row[1])

            if is_force_change or new_password or confirm_new_password:
                # Nếu bị ép đổi mật khẩu (quên mật khẩu), không yêu cầu nhập mật khẩu hiện tại
                if is_force_change:
                    if not (new_password and confirm_new_password):
                        conn.close()
                        flash("Vui lòng điền mật khẩu mới và xác nhận mật khẩu.", "error")
                        return redirect(url_for("settings.settings"))
                else:
                    if not (current_password and new_password and confirm_new_password):
                        conn.close()
                        flash("Vui lòng điền đầy đủ thông tin để thay đổi mật khẩu.", "error")
                        return redirect(url_for("settings.settings"))

                if len(new_password) < 6:
                    conn.close()
                    flash("Mật khẩu mới phải có ít nhất 6 ký tự.", "error")
                    return redirect(url_for("settings.settings"))
                if new_password != confirm_new_password:
                    conn.close()
                    flash("Mật khẩu mới và xác nhận mật khẩu không khớp.", "error")
                    return redirect(url_for("settings.settings"))
                
                if not pwd_hash:
                    conn.close()
                    flash("Không tìm thấy người dùng.", "error")
                    return redirect(url_for("settings.settings"))
                
                from werkzeug.security import check_password_hash, generate_password_hash
                
                # Chỉ kiểm tra mật khẩu hiện tại nếu không ở trạng thái ép đổi mật khẩu
                if not is_force_change:
                    if not check_password_hash(pwd_hash, current_password):
                        conn.close()
                        flash("Mật khẩu hiện tại không chính xác.", "error")
                        return redirect(url_for("settings.settings"))
                
                new_hash = generate_password_hash(new_password)
                with conn.cursor() as cur:
                    cur.execute("UPDATE users SET password_hash = %s, force_change_password = 0 WHERE id = %s", (new_hash, user_id))
                password_changed = True

            current_fullname = (session.get("fullname") or "").strip()
            if fullname and fullname != current_fullname:
                with conn.cursor() as cur:
                    cur.execute(
                        "UPDATE users SET fullname = %s WHERE id = %s",
                        (fullname, user_id),
                    )
                session["fullname"] = fullname
            
            UserSettings.update(conn, user_id, settings_data)
            conn.commit()
            conn.close()
            
            if password_changed:
                flash("Cài đặt và mật khẩu đã được thay đổi thành công!", "success")
                # Gửi email thông báo bảo mật
                try:
                    from notifications import send_password_changed_email
                    user_email = session.get("email", "")
                    user_fullname = session.get("fullname") or session.get("username") or ""
                    if not user_email:
                        _conn = None
                        try:
                            _conn = get_connection()
                            with _conn.cursor() as _cur:
                                _cur.execute("SELECT email, fullname FROM users WHERE id = %s", (user_id,))
                                _row = _cur.fetchone()
                                if _row:
                                    user_email, user_fullname = _row[0], (_row[1] or _row[0])
                        except Exception:
                            pass
                        finally:
                            if _conn:
                                _conn.close()
                    if user_email:
                        send_password_changed_email(user_email, user_fullname)
                except Exception:
                    pass
            else:
                flash("Cài đặt đã được lưu thành công!", "success")
            return redirect(url_for("settings.settings"))
        except Exception:
            logger.exception("Error saving settings")
            flash("Không thể lưu cài đặt. Vui lòng thử lại.", "error")
    
    try:
        conn = get_connection()
        user_settings = UserSettings.get_or_create(conn, user_id)
        
        force_change_password = 0
        with conn.cursor() as cur:
            cur.execute("SELECT force_change_password FROM users WHERE id = %s", (user_id,))
            row = cur.fetchone()
            if row:
                force_change_password = int(row[0])
                
        conn.close()
        return render_template("settings.html", settings=user_settings, force_change_password=force_change_password)
    except Exception:
        logger.exception("Error loading settings")
        flash("Không thể tải cài đặt. Vui lòng thử lại.", "error")
        return redirect(url_for("dashboard.dashboard"))

@settings_bp.route("/update-theme", methods=["POST"])
def update_theme():
    """Cập nhật theme nhanh qua AJAX"""
    if not session.get("user_id"):
        return {"success": False, "message": "Chưa đăng nhập"}, 401
    
    try:
        user_id = int(session["user_id"])
        data = request.get_json() or {}
        theme = data.get("theme", "light").strip().lower()
        if theme not in ("light", "dark", "auto"):
            theme = "light"
            
        conn = get_connection()
        try:
            user_settings = UserSettings.get_or_create(conn, user_id)
            user_settings["theme"] = theme
            UserSettings.update(conn, user_id, user_settings)
            conn.commit()
        finally:
            conn.close()
            
        return {"success": True, "theme": theme}
    except Exception as e:
        logger.exception("Error updating theme via AJAX")
        return {"success": False, "message": str(e)}, 500


@settings_bp.route("/clear-history", methods=["POST"])
def clear_history():
    """Xóa toàn bộ lịch sử nhận diện của user hiện tại."""
    if not session.get("user_id"):
        flash("Vui lòng đăng nhập để thực hiện thao tác này.", "warning")
        return redirect(url_for("login.login"))

    user_id_any = session.get("user_id")
    if user_id_any is None:
        flash("Vui lòng đăng nhập để thực hiện thao tác này.", "warning")
        return redirect(url_for("login.login"))
    try:
        user_id = int(user_id_any)
    except Exception:
        flash("Phiên đăng nhập không hợp lệ.", "error")
        return redirect(url_for("login.login"))

    conn = None
    try:
        conn = get_connection()
        # Lấy danh sách file để xóa (nếu có)
        image_paths: list[str] = []
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT image_path FROM prediction_history WHERE user_id = %s",
                    (user_id,),
                )
                rows = cur.fetchall() or []
                image_paths = [r[0] for r in rows if r and r[0]]
        except Exception:
            image_paths = []

        with conn.cursor() as cur:
            cur.execute("DELETE FROM prediction_history WHERE user_id = %s", (user_id,))
        conn.commit()

        # Xóa file ảnh trong static/uploads nếu trỏ đúng thư mục (an toàn)
        upload_root = os.path.abspath(os.path.join(os.getcwd(), "static", "uploads"))
        deleted_files = 0
        for p in image_paths:
            try:
                # normalize path; allow both relative and absolute
                abs_path = os.path.abspath(os.path.join(os.getcwd(), p)) if not os.path.isabs(p) else os.path.abspath(p)
                if abs_path.startswith(upload_root) and os.path.exists(abs_path):
                    os.remove(abs_path)
                    deleted_files += 1
            except Exception:
                pass

        flash(f"Đã xóa lịch sử nhận diện. (Đã xóa {deleted_files} ảnh lưu trữ)", "success")
        return redirect(url_for("settings.settings"))
    except Exception:
        logger.exception("[SETTINGS] clear history error")
        flash("Không thể xóa lịch sử. Vui lòng thử lại.", "error")
        return redirect(url_for("settings.settings"))
    finally:
        if conn:
            conn.close()


@settings_bp.route("/upload-avatar", methods=["POST"])
def upload_avatar():
    """Upload custom avatar for the logged in user"""
    if not session.get("user_id"):
        return {"success": False, "message": "Vui lòng đăng nhập để thực hiện."}, 401

    user_id_raw = session.get("user_id")
    try:
        user_id = int(user_id_raw)
    except Exception:
        return {"success": False, "message": "Phiên đăng nhập không hợp lệ."}, 401

    # Accept the file from request.files.get("avatar")
    file = request.files.get("avatar")
    if not file:
        return {"success": False, "message": "Không tìm thấy file ảnh tải lên."}, 400

    filename = file.filename or ""
    if filename == "":
        return {"success": False, "message": "Tên file rỗng."}, 400

    # Validate file extension
    allowed_extensions = {"png", "jpg", "jpeg", "webp", "gif"}
    ext = filename.rsplit(".", 1)[1].lower() if "." in filename else ""
    if ext not in allowed_extensions:
        return {"success": False, "message": f"Định dạng file không được hỗ trợ. Chỉ chấp nhận: {', '.join(allowed_extensions)}"}, 400

    # Save details
    from werkzeug.utils import secure_filename
    import secrets
    
    # Generate unique filename to prevent browser caching issues and collisions
    unique_id = secrets.token_hex(8)
    new_filename = f"avatar_{user_id}_{unique_id}.{ext}"
    
    avatar_dir = os.path.join("static", "uploads", "avatars")
    os.makedirs(avatar_dir, exist_ok=True)
    save_path = os.path.join(avatar_dir, new_filename)
    
    try:
        # Save new file
        file.save(save_path)
        
        # Open DB connection
        conn = get_connection()
        avatar_url_relative = f"/static/uploads/avatars/{new_filename}"
        
        # Fetch previous avatar to delete it (prevent disk space leaks)
        old_avatar_path = None
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT avatar_url FROM users WHERE id = %s", (user_id,))
                row = cur.fetchone()
                if row and row[0]:
                    old_avatar_path = row[0]
        except Exception as e:
            logger.warning(f"Error fetching old avatar path: {e}")

        # Update users table
        with conn.cursor() as cur:
            cur.execute("UPDATE users SET avatar_url = %s WHERE id = %s", (avatar_url_relative, user_id))
        conn.commit()
        conn.close()
        
        # Clean up old local file if it is a custom uploaded avatar (starts with /static/uploads/avatars/)
        if old_avatar_path and old_avatar_path.startswith("/static/uploads/avatars/"):
            try:
                rel_path = old_avatar_path.lstrip("/")
                full_old_path = os.path.abspath(os.path.join(os.getcwd(), rel_path))
                if os.path.exists(full_old_path) and os.path.isfile(full_old_path):
                    os.remove(full_old_path)
            except Exception as e:
                logger.warning(f"Error deleting old avatar file {old_avatar_path}: {e}")
                
        return {"success": True, "avatar_url": avatar_url_relative}
    except Exception as e:
        logger.exception("Error during avatar upload")
        return {"success": False, "message": "Lỗi lưu file ảnh đại diện. Vui lòng thử lại."}, 500
