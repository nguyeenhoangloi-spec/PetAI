# users.py
# Blueprint quản trị người dùng (admin-only)

from flask import Blueprint, render_template, session, redirect, url_for, flash, abort, request, jsonify, current_app
from datetime import datetime
from connect import get_connection
from models import init_database
from models import PaymentOrder
from models import UserQuota
from pymysql.cursors import DictCursor
import logging

users_bp = Blueprint("users", __name__)
logger = logging.getLogger(__name__)

PLAN_PRICE_VND = {
    "basic": 1000,
    "pro": 5000,
    "enterprise": 15000,
}


def get_plan_price_vnd(conn) -> dict:
    from models import SystemConfig
    try:
        return {
            "basic": int(SystemConfig.get(conn, "plan_basic_price", "1000")),
            "pro": int(SystemConfig.get(conn, "plan_pro_price", "5000")),
            "enterprise": int(SystemConfig.get(conn, "plan_enterprise_price", "15000")),
        }
    except Exception:
        return PLAN_PRICE_VND


def _order_amount_vnd(order: dict, pricing: dict = None) -> int:
    # Doanh thu & hiển thị số tiền phải bám theo giá gói.
    # Tránh trường hợp DB có amount_vnd sai (ví dụ 49k/99k) làm doanh thu bị đội.
    plan = (order.get("plan") or "").strip().lower()
    p_dict = pricing if pricing is not None else PLAN_PRICE_VND
    expected = p_dict.get(plan)
    if expected is not None:
        return int(expected)

    # Fallback: nếu đơn cũ không có plan hợp lệ thì mới dùng amount_vnd.
    try:
        amount = int(order.get("amount_vnd") or 0)
    except Exception:
        amount = 0
    return amount if amount > 0 else 0


def require_admin():
    if not session.get("user_id"):
        flash("Vui lòng đăng nhập để truy cập chức năng này.", "warning")
        return False
    if session.get("role") != "admin":
        abort(403)
    return True


@users_bp.route("/")
def list_users():
    """Danh sách người dùng (chỉ admin)"""
    if not require_admin():
        return redirect(url_for("login.login"))

    conn = None
    users = []
    page_raw = (request.args.get("page") or "1").strip()
    try:
        page = max(int(page_raw), 1)
    except Exception:
        page = 1
    per_page = 10
    total_users = 0
    total_admins = 0
    total_active = 0
    total_locked = 0
    total_pages = 0
    try:
        conn = get_connection()
        with conn.cursor(DictCursor) as cur:
            cur.execute(
                """
                SELECT 
                    COUNT(*) AS total,
                    SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) AS total_admins,
                    SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS total_active,
                    SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) AS total_locked
                FROM users
                """
            )
            stats_row = cur.fetchone() or {}
            total_users = int(stats_row.get("total") or 0)
            total_admins = int(stats_row.get("total_admins") or 0)
            total_active = int(stats_row.get("total_active") or 0)
            total_locked = int(stats_row.get("total_locked") or 0)

            total_pages = (total_users + per_page - 1) // per_page
            if total_pages > 0 and page > total_pages:
                page = total_pages
            offset = (page - 1) * per_page

            cur.execute(
                """
                SELECT u.id, u.username, u.fullname, u.email, u.role, u.is_active, u.created_at,
                       COALESCE(q.plan, 'free') AS plan
                FROM users u
                LEFT JOIN user_quota q ON q.user_id = u.id
                ORDER BY created_at DESC
                LIMIT %s OFFSET %s
                """
                ,
                (per_page, offset),
            )
            users = cur.fetchall() or []
    except Exception:
        logger.exception("[USERS] Query error")
        flash("Không thể tải danh sách người dùng.", "error")
    finally:
        if conn:
            conn.close()

    start_index = ((page - 1) * per_page + 1) if total_users > 0 else 0
    end_index = min(page * per_page, total_users) if total_users > 0 else 0

    return render_template(
        "users.html",
        users=users,
        page=page,
        per_page=per_page,
        total_users=total_users,
        total_admins=total_admins,
        total_active=total_active,
        total_locked=total_locked,
        total_pages=total_pages,
        start_index=start_index,
        end_index=end_index,
    )


@users_bp.route("/detail/<int:user_id>")
def user_detail(user_id: int):
    """Trả JSON thông tin user để hiển thị modal 'Xem chi tiết' (admin-only)."""
    if not require_admin():
        return jsonify({"success": False, "error": "Vui lòng đăng nhập."}), 401

    conn = None
    try:
        conn = get_connection()
        with conn.cursor(DictCursor) as cur:
            cur.execute(
                """
                SELECT u.id, u.username, u.fullname, u.email, u.role, u.is_active, u.created_at,
                       COALESCE(q.plan, 'free') AS plan,
                       q.plan_expire,
                       q.ad_views_used,
                       q.ad_unlocks_remaining
                FROM users u
                LEFT JOIN user_quota q ON q.user_id = u.id
                WHERE u.id = %s
                """,
                (user_id,),
            )
            u = cur.fetchone()

        if not u:
            return jsonify({"success": False, "error": "Không tìm thấy người dùng."}), 404

        # Normalize datetimes to string for JSON
        created_at = u.get("created_at")
        plan_expire = u.get("plan_expire")
        u["created_at"] = created_at.isoformat(sep=" ", timespec="seconds") if created_at else None
        u["plan_expire"] = plan_expire.isoformat(sep=" ", timespec="seconds") if plan_expire else None

        return jsonify({"success": True, "user": u}), 200
    except Exception:
        logger.exception("[USERS] detail error")
        return jsonify({"success": False, "error": "Lỗi tải thông tin người dùng."}), 500
    finally:
        if conn:
            conn.close()


@users_bp.route("/<int:user_id>")
def user_detail_page(user_id: int):
    """Trang chi tiết người dùng (admin-only)."""
    if not require_admin():
        return redirect(url_for("login.login"))

    conn = None
    user = None
    try:
        conn = get_connection()
        with conn.cursor(DictCursor) as cur:
            cur.execute(
                """
                SELECT u.id, u.username, u.fullname, u.email, u.role, u.is_active, u.created_at,
                       COALESCE(q.plan, 'free') AS plan,
                       q.plan_expire,
                       q.ad_views_used,
                       q.ad_unlocks_remaining
                FROM users u
                LEFT JOIN user_quota q ON q.user_id = u.id
                WHERE u.id = %s
                """,
                (user_id,),
            )
            user = cur.fetchone()
    except Exception:
        logger.exception("[USERS] detail page error")
        flash("Không thể tải chi tiết người dùng.", "error")
    finally:
        if conn:
            conn.close()

    if not user:
        abort(404)

    return render_template("user_detail.html", user=user)


@users_bp.route("/lock/<int:user_id>", methods=["POST"])
def lock_user(user_id: int):
    logger.info("[LOCK] Called. user_id=%s session_role=%s", user_id, session.get("role"))
    if not require_admin():
        logger.warning("[LOCK] require_admin() failed for user_id=%s", user_id)
        return jsonify({"success": False, "error": "Vui lòng đăng nhập."}), 401

    # Tránh tự khóa chính mình (dễ làm admin bị kẹt)
    try:
        session_user_id = session.get("user_id")
        if session_user_id is not None and int(session_user_id) == int(user_id):
            return jsonify({"success": False, "error": "Không thể tự khóa tài khoản đang đăng nhập."}), 400
    except Exception:
        pass

    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("UPDATE users SET is_active = FALSE WHERE id = %s", (user_id,))
            if cur.rowcount == 0:
                return jsonify({"success": False, "error": "Không tìm thấy người dùng."}), 404
        conn.commit()
        logger.info("[LOCK] Success. user_id=%s locked.", user_id)
        return jsonify({"success": True}), 200
    except Exception:
        if conn:
            conn.rollback()
        logger.exception("[USERS] lock error")
        return jsonify({"success": False, "error": "Không thể khóa người dùng."}), 500
    finally:
        if conn:
            conn.close()


@users_bp.route("/unlock/<int:user_id>", methods=["POST"])
def unlock_user(user_id: int):
    if not require_admin():
        return jsonify({"success": False, "error": "Vui lòng đăng nhập."}), 401

    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("UPDATE users SET is_active = TRUE WHERE id = %s", (user_id,))
            if cur.rowcount == 0:
                return jsonify({"success": False, "error": "Không tìm thấy người dùng."}), 404
        conn.commit()
        return jsonify({"success": True}), 200
    except Exception:
        if conn:
            conn.rollback()
        logger.exception("[USERS] unlock error")
        return jsonify({"success": False, "error": "Không thể mở khóa người dùng."}), 500
    finally:
        if conn:
            conn.close()


@users_bp.route("/delete/<int:user_id>", methods=["POST"])
def delete_user(user_id: int):
    if not require_admin():
        return jsonify({"success": False, "error": "Vui lòng đăng nhập."}), 401

    # Tránh tự xóa chính mình
    try:
        session_user_id = session.get("user_id")
        if session_user_id is not None and int(session_user_id) == int(user_id):
            return jsonify({"success": False, "error": "Không thể tự xóa tài khoản đang đăng nhập."}), 400
    except Exception:
        pass

    conn = None
    try:
        conn = get_connection()
        # Confirm token: require typing DELETE or username
        payload = request.get_json(silent=True) or {}
        confirm_token = (payload.get("confirm") or request.form.get("confirm") or "").strip()
        if not confirm_token:
            return jsonify({"success": False, "error": "Thiếu xác nhận xóa (confirm)."}), 400

        with conn.cursor(DictCursor) as cur:
            cur.execute("SELECT id, username FROM users WHERE id = %s", (user_id,))
            target = cur.fetchone()
            if not target:
                return jsonify({"success": False, "error": "Không tìm thấy người dùng."}), 404

            username = (target.get("username") or "").strip()
            ok_confirm = confirm_token.upper() == "DELETE" or (
                username and confirm_token.lower() == username.lower()
            )
            if not ok_confirm:
                return jsonify({"success": False, "error": "Xác nhận xóa không đúng."}), 400

            # Optional safety: only allow deletion if user has no related data
            cur.execute("SELECT 1 FROM prediction_history WHERE user_id = %s LIMIT 1", (user_id,))
            has_history = cur.fetchone() is not None
            cur.execute("SELECT 1 FROM payment_orders WHERE user_id = %s LIMIT 1", (user_id,))
            has_payments = cur.fetchone() is not None
            if has_history or has_payments:
                return (
                    jsonify(
                        {
                            "success": False,
                            "error": "Chỉ cho phép xóa user chưa có dữ liệu liên quan (lịch sử nhận diện/đơn thanh toán).",
                        }
                    ),
                    400,
                )

            cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
        conn.commit()
        return jsonify({"success": True}), 200
    except Exception:
        if conn:
            conn.rollback()
        logger.exception("[USERS] delete error")
        return jsonify({"success": False, "error": "Không thể xóa người dùng."}), 500
    finally:
        if conn:
            conn.close()


@users_bp.route("/init-db", methods=["POST"])
def init_db():
    """Khởi tạo các bảng ứng dụng (chỉ admin)."""
    if not require_admin():
        return redirect(url_for("login.login"))

    conn = None
    try:
        conn = get_connection()
        init_database(conn)
        flash("Đã khởi tạo bảng ứng dụng thành công.", "success")
    except Exception:
        logger.exception("[USERS] Init DB error")
        flash("Không thể khởi tạo DB. Vui lòng thử lại.", "error")
    finally:
        if conn:
            conn.close()

    return redirect(url_for("users.list_users"))


# Đã bỏ trang lịch sử thanh toán cho admin (không cần thiết)


@users_bp.route("/confirmations")
def confirmations_list():
    """Trang xác nhận thanh toán: chỉ hiển thị các đơn user đã báo chuyển tiền."""
    if not require_admin():
        return redirect(url_for("login.login"))

    conn = None
    orders = []
    page_raw = (request.args.get("page") or "1").strip()
    try:
        page = max(int(page_raw), 1)
    except Exception:
        page = 1
    per_page = 10
    pricing = PLAN_PRICE_VND
    try:
        conn = get_connection()
        orders = PaymentOrder.list_all(conn, limit=200) or []
        pricing = get_plan_price_vnd(conn)
    finally:
        if conn:
            conn.close()

    for o in orders:
        o["amount_calc"] = _order_amount_vnd(o, pricing)

    paid_orders = [o for o in orders if (o.get("status") or "").lower() == PaymentOrder.STATUS_PAID]
    total_paid_amount = sum(int(o.get("amount_calc") or 0) for o in paid_orders)
    total_paid_count = len(paid_orders)
    recent_paid = sorted(
        paid_orders,
        key=lambda o: o.get("confirmed_at") or o.get("created_at") or datetime.min,
        reverse=True,
    )[:5]
    latest_paid_at = None
    if recent_paid:
        latest_paid_at = recent_paid[0].get("confirmed_at") or recent_paid[0].get("created_at")

    # Chỉ hiển thị đơn user đã bấm "Tôi đã chuyển tiền" (user_confirmed)
    orders = [o for o in orders if (o.get("status") or "").lower() == PaymentOrder.STATUS_USER_CONFIRMED]
    total_orders = len(orders)
    total_pages = (total_orders + per_page - 1) // per_page
    if total_pages > 0 and page > total_pages:
        page = total_pages
    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    orders = orders[start_idx:end_idx]

    allow_manual_confirm = bool(current_app.config.get("ALLOW_MANUAL_TRANSFER_CONFIRM", True))
    auto_confirm_on_user = bool(current_app.config.get("AUTO_CONFIRM_ON_USER_CONFIRM", False))

    return render_template(
        "confirmations.html",
        orders=orders,
        page=page,
        per_page=per_page,
        total_orders=total_orders,
        total_pages=total_pages,
        total_paid_amount=total_paid_amount,
        total_paid_count=total_paid_count,
        latest_paid_at=latest_paid_at,
        recent_paid=recent_paid,
        allow_manual_confirm=allow_manual_confirm,
        auto_confirm_on_user=auto_confirm_on_user,
    )


@users_bp.route("/payments/confirm", methods=["POST"])
def confirm_payment():
    if not require_admin():
        return redirect(url_for("login.login"))
    order_id = (request.form.get("order_id") or "").strip()
    page_raw = (request.form.get("page") or "1").strip()
    try:
        current_page = max(int(page_raw), 1)
    except Exception:
        current_page = 1
    if not order_id:
        flash("Thiếu mã đơn.", "error")
        return redirect(url_for("users.confirmations_list", page=current_page))
    conn = None
    try:
        conn = get_connection()
        ok = PaymentOrder.mark_paid(conn, order_id)
        # --- Cấp gói theo đúng đơn vừa xác nhận ---
        if ok:
            from datetime import datetime, timedelta
            order = PaymentOrder.get_by_order_id(conn, order_id)
            user_id = order["user_id"] if order else None
            plan = (order.get("plan") if order else None) or "free"
            if user_id:
                now = datetime.now()
                from models import SystemConfig
                fallback_days = 0
                if plan == "pro":
                    fallback_days = 30
                elif plan == "enterprise":
                    fallback_days = 90
                elif plan == "basic":
                    fallback_days = 7

                if fallback_days > 0:
                    try:
                        days = int(SystemConfig.get(conn, f"plan_{plan}_days", str(fallback_days)))
                    except Exception:
                        days = fallback_days
                    plan_expire = now + timedelta(days=days)
                else:
                    plan_expire = None

                UserQuota.set_plan_upgrade_only(conn, user_id, plan, plan_expire)
                # Gửi email thông báo kích hoạt gói cho user
                try:
                    from notifications import send_plan_activated_email
                    with conn.cursor() as _cur:
                        _cur.execute("SELECT email, fullname FROM users WHERE id = %s", (user_id,))
                        _row = _cur.fetchone()
                    if _row and _row[0]:
                        send_plan_activated_email(_row[0], _row[1] or _row[0], plan, plan_expire)
                except Exception:
                    pass
            flash(f"Đã xác nhận thanh toán cho đơn {order_id}.", "success")
        else:
            flash("Không thể xác nhận đơn (có thể đã xác nhận hoặc không tồn tại).", "error")
    except Exception:
        logger.exception("[ADMIN] confirm_payment error")
        flash("Lỗi xác nhận đơn.", "error")
    finally:
        if conn:
            conn.close()
    return redirect(url_for("users.confirmations_list", page=current_page))


@users_bp.route("/set-plan", methods=["POST"])
def set_user_plan():
    if not require_admin():
        return redirect(url_for("login.login"))

    user_id_raw = (request.form.get("user_id") or "").strip()
    plan = (request.form.get("plan") or "free").strip().lower()
    page_raw = (request.form.get("page") or "").strip()
    try:
        current_page = max(int(page_raw), 1) if page_raw else None
    except Exception:
        current_page = None
    allowed_plans = {"free", "basic", "pro", "enterprise"}
    if plan not in allowed_plans:
        plan = "free"

    try:
        user_id = int(user_id_raw)
    except Exception:
        flash("User ID không hợp lệ.", "error")
        if current_page:
            return redirect(url_for("users.list_users", page=current_page))
        return redirect(url_for("users.list_users"))

    conn = None
    try:
        conn = get_connection()
        UserQuota.get_or_create(conn, user_id)
        UserQuota.set_plan(conn, user_id, plan)
        # Gửi email thông báo kích hoạt gói
        try:
            from notifications import send_plan_activated_email
            with conn.cursor() as _cur:
                _cur.execute("SELECT email, fullname FROM users WHERE id = %s", (user_id,))
                _row = _cur.fetchone()
            if _row and _row[0]:
                send_plan_activated_email(_row[0], _row[1] or _row[0], plan)
        except Exception:
            pass
        flash(f"Đã cấp gói {plan.upper()} cho user #{user_id}.", "success")
    except Exception:
        logger.exception("[USERS] set plan error")
        flash("Không thể cấp gói cho user. Vui lòng thử lại.", "error")
    finally:
        if conn:
            conn.close()

    if current_page:
        return redirect(url_for("users.list_users", page=current_page))
    return redirect(url_for("users.list_users"))


@users_bp.route("/system-config", methods=["GET"])
def system_config():
    if not require_admin():
        return redirect(url_for("login.login"))
    
    import os
    from models import SystemConfig
    configs = {}
    conn = None
    try:
        conn = get_connection()
        configs = SystemConfig.get_all(conn)
    except Exception:
        logger.exception("[ADMIN] Fetch system configs error")
        flash("Không thể tải cấu hình hệ thống.", "error")
    finally:
        if conn:
            conn.close()
            
    return render_template("system_config.html", configs=configs)


@users_bp.route("/system-config/save", methods=["POST"])
def save_system_config():
    if not require_admin():
        return redirect(url_for("login.login"))
        
    from models import SystemConfig
    
    conn = None
    try:
        conn = get_connection()
        
        if "site_email" in request.form:
            site_email = (request.form.get("site_email") or "").strip()
            if site_email:
                SystemConfig.set(conn, "site_email", site_email, "Email liên hệ chính")
                
        if "plan_basic_price" in request.form:
            plan_basic_price = (request.form.get("plan_basic_price") or "").strip()
            plan_basic_days = (request.form.get("plan_basic_days") or "").strip()
            plan_basic_scans = (request.form.get("plan_basic_scans") or "").strip()
            
            plan_pro_price = (request.form.get("plan_pro_price") or "").strip()
            plan_pro_days = (request.form.get("plan_pro_days") or "").strip()
            plan_pro_scans = (request.form.get("plan_pro_scans") or "").strip()
            
            plan_enterprise_price = (request.form.get("plan_enterprise_price") or "").strip()
            plan_enterprise_days = (request.form.get("plan_enterprise_days") or "").strip()
            plan_enterprise_scans = (request.form.get("plan_enterprise_scans") or "").strip()
            
            SystemConfig.set(conn, "plan_basic_price", plan_basic_price, "Giá gói Basic (VND)")
            SystemConfig.set(conn, "plan_basic_days", plan_basic_days, "Thời gian gói Basic (ngày)")
            SystemConfig.set(conn, "plan_basic_scans", plan_basic_scans, "Lượt quét gói Basic")
            
            SystemConfig.set(conn, "plan_pro_price", plan_pro_price, "Giá gói Pro (VND)")
            SystemConfig.set(conn, "plan_pro_days", plan_pro_days, "Thời gian gói Pro (ngày)")
            SystemConfig.set(conn, "plan_pro_scans", plan_pro_scans, "Lượt quét gói Pro")
            
            SystemConfig.set(conn, "plan_enterprise_price", plan_enterprise_price, "Giá gói Enterprise (VND)")
            SystemConfig.set(conn, "plan_enterprise_days", plan_enterprise_days, "Thời gian gói Enterprise (ngày)")
            SystemConfig.set(conn, "plan_enterprise_scans", plan_enterprise_scans, "Lượt quét gói Enterprise")
            
        flash("Cập nhật cấu hình hệ thống thành công.", "success")
    except Exception:
        logger.exception("[ADMIN] Save system configs error")
        flash("Lỗi lưu cấu hình hệ thống.", "error")
    finally:
        if conn:
            conn.close()
            
    return redirect(url_for("users.system_config"))


@users_bp.route("/system-config/save-legal", methods=["POST"])
def save_legal_config():
    if not require_admin():
        return redirect(url_for("login.login"))
        
    from models import SystemConfig, LegalContentVersion
    
    page = (request.form.get("page") or "").strip()
    content_vi = (request.form.get("content_vi") or "").strip()
    content_en = (request.form.get("content_en") or "").strip()
    
    allowed_pages = {"privacy-policy", "terms-of-service", "payment-policy", "data-deletion", "support", "contact", "user-guide"}
    if page not in allowed_pages:
        flash("Trang pháp lý không hợp lệ.", "error")
        return redirect(url_for("users.system_config"))
        
    db_key_vi = f"{page.replace('-', '_')}_content_vi"
    db_key_en = f"{page.replace('-', '_')}_content_en"
    
    conn = None
    try:
        conn = get_connection()
        SystemConfig.set(conn, db_key_vi, content_vi, f"Nội dung tiếng Việt trang {page}")
        SystemConfig.set(conn, db_key_en, content_en, f"Nội dung tiếng Anh trang {page}")
        # Lưu phiên bản lịch sử
        try:
            LegalContentVersion.save_version(conn, page, content_vi, content_en)
        except Exception:
            logger.warning("[ADMIN] Could not save version snapshot for page: %s", page)
        flash(f"Đã cập nhật nội dung trang {page.upper()}.", "success")
    except Exception:
        logger.exception("[ADMIN] Save legal content error")
        flash("Lỗi cập nhật nội dung trang pháp lý.", "error")
    finally:
        if conn:
            conn.close()
            
    return redirect(url_for("users.system_config") + f"?tab=legal&page_select={page}")


@users_bp.route("/system-config/reset-legal", methods=["POST"])
def reset_legal_config():
    """Xoá nội dung DB của trang pháp lý để hiển thị lại template gốc"""
    if not require_admin():
        return jsonify({"error": "Unauthorized"}), 403

    from models import SystemConfig
    page = (request.form.get("page") or "").strip()
    allowed_pages = {"privacy-policy", "terms-of-service", "payment-policy", "data-deletion", "support", "contact", "user-guide"}
    if page not in allowed_pages:
        return jsonify({"error": "Invalid page"}), 400

    db_key_vi = f"{page.replace('-', '_')}_content_vi"
    db_key_en = f"{page.replace('-', '_')}_content_en"
    conn = None
    try:
        conn = get_connection()
        SystemConfig.set(conn, db_key_vi, "", f"Nội dung tiếng Việt trang {page}")
        SystemConfig.set(conn, db_key_en, "", f"Nội dung tiếng Anh trang {page}")
        return jsonify({"success": True})
    except Exception:
        logger.exception("[ADMIN] Reset legal content error")
        return jsonify({"error": "Server error"}), 500
    finally:
        if conn:
            conn.close()


@users_bp.route("/system-config/legal-versions", methods=["GET"])
def get_legal_versions():
    """Lấy danh sách lịch sử phiên bản của một trang"""
    if not require_admin():
        return jsonify({"error": "Unauthorized"}), 403

    page = (request.args.get("page") or "").strip()
    allowed_pages = {"privacy-policy", "terms-of-service", "payment-policy", "data-deletion", "support", "contact", "user-guide"}
    if page not in allowed_pages:
        return jsonify({"error": "Invalid page"}), 400

    conn = None
    try:
        conn = get_connection()
        from models import LegalContentVersion
        versions = LegalContentVersion.get_versions(conn, page, limit=10)
        return jsonify({"success": True, "versions": versions})
    except Exception:
        logger.exception("[ADMIN] Get legal versions error")
        return jsonify({"error": "Server error"}), 500
    finally:
        if conn:
            conn.close()


@users_bp.route("/system-config/restore-version", methods=["POST"])
def restore_legal_version():
    """Khôi phục một phiên bản nội dung cũ vào SystemConfig"""
    if not require_admin():
        return jsonify({"error": "Unauthorized"}), 403

    version_id_str = (request.form.get("version_id") or "").strip()
    if not version_id_str:
        return jsonify({"error": "Missing version_id"}), 400

    conn = None
    try:
        conn = get_connection()
        from models import LegalContentVersion, SystemConfig
        version = LegalContentVersion.get_version_by_id(conn, int(version_id_str))
        if not version:
            return jsonify({"error": "Version not found"}), 404

        page = version["page"]
        db_key_vi = f"{page.replace('-', '_')}_content_vi"
        db_key_en = f"{page.replace('-', '_')}_content_en"
        SystemConfig.set(conn, db_key_vi, version["content_vi"], f"Nội dung tiếng Việt trang {page}")
        SystemConfig.set(conn, db_key_en, version["content_en"], f"Nội dung tiếng Anh trang {page}")
        return jsonify({"success": True, "page": page})
    except Exception:
        logger.exception("[ADMIN] Restore legal version error")
        return jsonify({"error": "Server error"}), 500
    finally:
        if conn:
            conn.close()


@users_bp.route("/system-config/logo", methods=["POST"])
def save_logo_config():
    if not require_admin():
        return redirect(url_for("login.login"))
        
    import os
    if "logo" not in request.files:
        flash("Không tìm thấy file logo.", "error")
        return redirect(url_for("users.system_config"))
        
    file = request.files["logo"]
    if file.filename == "":
        flash("Chưa chọn file upload.", "warning")
        return redirect(url_for("users.system_config"))
        
    filename = file.filename.lower()
    allowed_extensions = {".png", ".jpg", ".jpeg", ".svg", ".webp"}
    _, ext = os.path.splitext(filename)
    if ext not in allowed_extensions:
        flash("Định dạng file không hỗ trợ. Chỉ cho phép PNG, JPG, JPEG, SVG, WEBP.", "error")
        return redirect(url_for("users.system_config"))
        
    try:
        static_dir = os.path.join(current_app.root_path, "static", "images")
        logo_path = os.path.join(static_dir, "logo.png")
        backup_path = os.path.join(static_dir, "logo_backup.png")
        
        # Backup original logo if backup doesn't exist
        if os.path.exists(logo_path) and not os.path.exists(backup_path):
            import shutil
            shutil.copy2(logo_path, backup_path)
            
        file.save(logo_path)
        flash("Thay đổi logo trang web thành công.", "success")
    except Exception as e:
        logger.exception("[ADMIN] Upload logo error")
        flash(f"Lỗi tải lên logo: {str(e)}", "error")
        
    return redirect(url_for("users.system_config"))
