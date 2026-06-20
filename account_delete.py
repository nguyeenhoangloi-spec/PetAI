# account_delete.py
# Blueprint xử lý chức năng "Yêu cầu xóa tài khoản"
#
# Routes:
#   POST /account/delete/request           -- Gửi OTP xóa tài khoản
#   POST /account/delete/confirm           -- Xác nhận OTP, chuyển sang pending_delete
#   GET  /account/delete/pending           -- Trang thông báo khi đang pending_delete
#   POST /account/delete/restore/request   -- Gửi OTP khôi phục tài khoản
#   POST /account/delete/restore/confirm   -- Xác nhận OTP khôi phục

import logging
import random
import string

from flask import (
    Blueprint,
    jsonify,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
from werkzeug.security import generate_password_hash

from connect import get_connection
from models import DeleteAccountManager
from notifications import (
    send_delete_admin_email,
    send_delete_otp_email,
    send_delete_requested_email,
    send_restore_otp_email,
    send_restore_success_email,
)

account_delete_bp = Blueprint("account_delete", __name__)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_user_info(conn, user_id: int) -> dict | None:
    """Lấy thông tin cơ bản của user (email, fullname)."""
    with conn.cursor() as cur:
        cur.execute(
            "SELECT email, fullname, username, account_status FROM users WHERE id = %s",
            (user_id,),
        )
        row = cur.fetchone()
    if not row:
        return None
    return {
        "email": row[0],
        "fullname": row[1] or row[2] or "",
        "account_status": row[3] or "active",
    }


def _generate_otp() -> str:
    return "".join(random.choices(string.digits, k=6))


def _require_login():
    """Trả về user_id nếu đã đăng nhập, None nếu chưa."""
    raw = session.get("user_id")
    if raw is None:
        return None
    try:
        return int(raw)
    except Exception:
        return None


def _json_or_flash_error(message: str, status: int = 400):
    """Trả về JSON nếu là AJAX request, redirect nếu không."""
    if request.is_json or request.headers.get("X-Requested-With") == "XMLHttpRequest":
        return jsonify({"success": False, "message": message}), status
    from flask import flash
    flash(message, "error")
    return redirect(url_for("settings.settings"))


# ---------------------------------------------------------------------------
# 1. Gửi OTP xóa tài khoản
# ---------------------------------------------------------------------------

@account_delete_bp.route("/delete/request", methods=["POST"])
def delete_request():
    """Người dùng xác nhận muốn xóa → gửi OTP về email."""
    user_id = _require_login()
    if not user_id:
        return jsonify({"success": False, "message": "Chưa đăng nhập."}), 401

    reason = (request.json or request.form).get("reason", "").strip() if request.is_json else request.form.get("reason", "").strip()

    conn = None
    try:
        conn = get_connection()
        user = _get_user_info(conn, user_id)
        if not user:
            return jsonify({"success": False, "message": "Không tìm thấy tài khoản."}), 404

        if user["account_status"] == "pending_delete":
            return jsonify({"success": False, "message": "Tài khoản đã trong trạng thái chờ xóa."}), 400

        if user["account_status"] == "deleted":
            return jsonify({"success": False, "message": "Tài khoản đã bị xóa."}), 400

        # Tạo OTP và ghi vào DB
        otp = _generate_otp()
        otp_hash = generate_password_hash(otp)
        DeleteAccountManager.set_delete_otp(conn, user_id, otp_hash, otp_type="delete", expires_seconds=300)

        # Lưu lý do tạm vào session để dùng sau khi confirm
        session["delete_reason_pending"] = reason

        # Gửi email OTP trong thread riêng (không block request)
        send_delete_otp_email(user["email"], user["fullname"], otp)

        return jsonify({"success": True, "message": "Mã OTP đã được gửi về email của bạn."})

    except Exception:
        logger.exception("[DELETE REQUEST] Error")
        return jsonify({"success": False, "message": "Lỗi hệ thống. Vui lòng thử lại."}), 500
    finally:
        if conn:
            conn.close()


# ---------------------------------------------------------------------------
# 2. Xác nhận OTP xóa tài khoản
# ---------------------------------------------------------------------------

@account_delete_bp.route("/delete/confirm", methods=["POST"])
def delete_confirm():
    """Xác thực OTP → chuyển tài khoản sang pending_delete."""
    user_id = _require_login()
    if not user_id:
        return jsonify({"success": False, "message": "Chưa đăng nhập."}), 401

    data = request.get_json(silent=True) or {}
    otp_input = str(data.get("otp", "") or request.form.get("otp", "")).strip()

    if not otp_input or len(otp_input) != 6:
        return jsonify({"success": False, "message": "Mã OTP không hợp lệ."}), 400

    conn = None
    try:
        conn = get_connection()
        user = _get_user_info(conn, user_id)
        if not user:
            return jsonify({"success": False, "message": "Không tìm thấy tài khoản."}), 404

        if user["account_status"] != "active":
            return jsonify({"success": False, "message": "Tài khoản không ở trạng thái hợp lệ để xóa."}), 400

        result = DeleteAccountManager.verify_delete_otp(conn, user_id, otp_input, expected_type="delete")

        if not result["success"]:
            err = result.get("error")
            if err == "expired":
                return jsonify({"success": False, "message": "Mã OTP đã hết hạn. Vui lòng yêu cầu lại."}), 400
            if err == "locked":
                return jsonify({"success": False, "message": "Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 10 phút."}), 429
            if err == "invalid":
                left = result.get("attempts_left", 0)
                return jsonify({"success": False, "message": f"Mã OTP không chính xác. Bạn còn {left} lần thử."}), 400
            return jsonify({"success": False, "message": "Mã OTP không hợp lệ hoặc đã hết hạn."}), 400

        # OTP hợp lệ → kích hoạt pending_delete
        reason = session.pop("delete_reason_pending", None)
        DeleteAccountManager.activate_pending_delete(conn, user_id, reason=reason)

        # Lấy lại thông tin để gửi email
        status_info = DeleteAccountManager.get_delete_status(conn, user_id)

        # Gửi email thông báo user
        send_delete_requested_email(
            user["email"],
            user["fullname"],
            status_info.get("delete_scheduled_at"),
            status_info.get("delete_requested_at"),
        )

        # Gửi email thông báo admin (không block)
        try:
            admin_email = _get_admin_email(conn)
            if admin_email:
                send_delete_admin_email(
                    admin_email,
                    user_id,
                    user["fullname"],
                    user["email"],
                    status_info.get("delete_requested_at"),
                    status_info.get("delete_scheduled_at"),
                    reason,
                )
        except Exception:
            pass

        # Giữ session nhưng redirect sang pending page
        return jsonify({
            "success": True,
            "message": "Yêu cầu xóa tài khoản đã được ghi nhận.",
            "redirect": url_for("account_delete.delete_pending"),
        })

    except Exception:
        logger.exception("[DELETE CONFIRM] Error")
        return jsonify({"success": False, "message": "Lỗi hệ thống. Vui lòng thử lại."}), 500
    finally:
        if conn:
            conn.close()


# ---------------------------------------------------------------------------
# 3. Trang pending_delete
# ---------------------------------------------------------------------------

@account_delete_bp.route("/delete/pending", methods=["GET"])
def delete_pending():
    """Trang hiển thị khi tài khoản đang ở trạng thái pending_delete."""
    user_id = _require_login()
    if not user_id:
        return redirect(url_for("login.login"))

    conn = None
    try:
        conn = get_connection()
        status_info = DeleteAccountManager.get_delete_status(conn, user_id)
        user = _get_user_info(conn, user_id)

        if not user:
            session.clear()
            return redirect(url_for("login.login"))

        # Nếu tài khoản đã được khôi phục / không phải pending_delete
        account_status = status_info.get("account_status", "active")
        if account_status == "active":
            return redirect(url_for("dashboard.dashboard"))
        if account_status == "deleted":
            session.clear()
            from flask import flash
            flash("Tài khoản của bạn đã bị xóa vĩnh viễn.", "error")
            return redirect(url_for("login.login"))

        return render_template(
            "account_delete_pending.html",
            delete_scheduled_at=status_info.get("delete_scheduled_at"),
            delete_requested_at=status_info.get("delete_requested_at"),
            user_email=user["email"],
            user_fullname=user["fullname"],
        )
    except Exception:
        logger.exception("[DELETE PENDING PAGE] Error")
        return redirect(url_for("dashboard.dashboard"))
    finally:
        if conn:
            conn.close()


# ---------------------------------------------------------------------------
# 4. Gửi OTP khôi phục tài khoản
# ---------------------------------------------------------------------------

@account_delete_bp.route("/delete/restore/request", methods=["POST"])
def restore_request():
    """Gửi OTP khôi phục tài khoản về email."""
    user_id = _require_login()
    if not user_id:
        return jsonify({"success": False, "message": "Chưa đăng nhập."}), 401

    conn = None
    try:
        conn = get_connection()
        user = _get_user_info(conn, user_id)
        if not user:
            return jsonify({"success": False, "message": "Không tìm thấy tài khoản."}), 404

        if user["account_status"] != "pending_delete":
            return jsonify({"success": False, "message": "Tài khoản không ở trạng thái chờ xóa."}), 400

        # Kiểm tra rate limit (dùng chung cơ chế)
        rate = DeleteAccountManager.check_otp_rate_limit(conn, user_id)
        if rate["is_locked"]:
            return jsonify({"success": False, "message": "Bạn đã thử quá nhiều lần. Vui lòng đợi 10 phút."}), 429

        # Tạo OTP khôi phục
        otp = _generate_otp()
        otp_hash = generate_password_hash(otp)
        DeleteAccountManager.set_delete_otp(conn, user_id, otp_hash, otp_type="restore", expires_seconds=300)

        send_restore_otp_email(user["email"], user["fullname"], otp)

        return jsonify({"success": True, "message": "Mã OTP khôi phục đã được gửi về email của bạn."})

    except Exception:
        logger.exception("[RESTORE REQUEST] Error")
        return jsonify({"success": False, "message": "Lỗi hệ thống. Vui lòng thử lại."}), 500
    finally:
        if conn:
            conn.close()


# ---------------------------------------------------------------------------
# 5. Xác nhận OTP khôi phục tài khoản
# ---------------------------------------------------------------------------

@account_delete_bp.route("/delete/restore/confirm", methods=["POST"])
def restore_confirm():
    """Xác thực OTP khôi phục → chuyển tài khoản về active."""
    user_id = _require_login()
    if not user_id:
        return jsonify({"success": False, "message": "Chưa đăng nhập."}), 401

    data = request.get_json(silent=True) or {}
    otp_input = str(data.get("otp", "") or request.form.get("otp", "")).strip()

    if not otp_input or len(otp_input) != 6:
        return jsonify({"success": False, "message": "Mã OTP không hợp lệ."}), 400

    conn = None
    try:
        conn = get_connection()
        user = _get_user_info(conn, user_id)
        if not user:
            return jsonify({"success": False, "message": "Không tìm thấy tài khoản."}), 404

        if user["account_status"] != "pending_delete":
            return jsonify({"success": False, "message": "Tài khoản không ở trạng thái chờ xóa."}), 400

        result = DeleteAccountManager.verify_delete_otp(conn, user_id, otp_input, expected_type="restore")

        if not result["success"]:
            err = result.get("error")
            if err == "expired":
                return jsonify({"success": False, "message": "Mã OTP đã hết hạn. Vui lòng gửi lại."}), 400
            if err == "locked":
                return jsonify({"success": False, "message": "Bạn đã nhập sai quá nhiều lần. Vui lòng đợi 10 phút."}), 429
            if err == "invalid":
                left = result.get("attempts_left", 0)
                return jsonify({"success": False, "message": f"Mã OTP không chính xác. Bạn còn {left} lần thử."}), 400
            return jsonify({"success": False, "message": "Mã OTP không hợp lệ."}), 400

        # OTP hợp lệ → khôi phục tài khoản
        DeleteAccountManager.restore_account(conn, user_id)

        # Gửi email thông báo thành công
        send_restore_success_email(user["email"], user["fullname"])

        return jsonify({
            "success": True,
            "message": "Tài khoản của bạn đã được khôi phục thành công!",
            "redirect": url_for("dashboard.dashboard"),
        })

    except Exception:
        logger.exception("[RESTORE CONFIRM] Error")
        return jsonify({"success": False, "message": "Lỗi hệ thống. Vui lòng thử lại."}), 500
    finally:
        if conn:
            conn.close()


# ---------------------------------------------------------------------------
# Helper: lấy email admin từ SystemConfig
# ---------------------------------------------------------------------------

def _get_admin_email(conn) -> str | None:
    try:
        from models import SystemConfig
        val = SystemConfig.get(conn, "site_email")
        return (val or "").strip() or None
    except Exception:
        return None
