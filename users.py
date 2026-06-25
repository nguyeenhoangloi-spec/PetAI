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
    total_users = 0
    total_admins = 0
    total_active = 0
    total_locked = 0
    total_paid = 0

    # Trend stats
    total_trend = {"has_data": False, "val": 0, "up": True}
    active_trend = {"has_data": False, "val": 0, "up": True}
    paid_trend = {"has_data": False, "val": 0, "up": True}
    locked_trend = {"has_data": False, "val": 0, "up": True}

    try:
        conn = get_connection()
        with conn.cursor(DictCursor) as cur:
            # Query all users for client-side sorting/filtering/pagination
            cur.execute(
                """
                SELECT u.id, u.username, u.fullname, u.email, u.role, u.is_active, u.created_at,
                       COALESCE(q.plan, 'free') AS plan,
                       q.plan_expire,
                       q.ad_views_used,
                       q.ad_unlocks_remaining,
                       q.updated_at AS quota_updated_at
                FROM users u
                LEFT JOIN user_quota q ON q.user_id = u.id
                ORDER BY u.created_at DESC
                """
            )
            users = cur.fetchall() or []

            total_users = len(users)
            total_admins = sum(1 for u in users if u.get("role") == "admin")
            total_active = sum(1 for u in users if u.get("is_active"))
            total_locked = sum(1 for u in users if not u.get("is_active"))
            total_paid = sum(1 for u in users if (u.get("plan") or "free") != "free")

            # MoM calculations
            from datetime import datetime
            now = datetime.now()
            current_month_start = datetime(now.year, now.month, 1)
            if now.month == 1:
                last_month_start = datetime(now.year - 1, 12, 1)
            else:
                last_month_start = datetime(now.year, now.month - 1, 1)
            last_month_end = current_month_start

            # Monthly totals
            tm_total = sum(1 for u in users if u.get("created_at") and u["created_at"] >= current_month_start)
            lm_total = sum(1 for u in users if u.get("created_at") and last_month_start <= u["created_at"] < last_month_end)

            tm_active = sum(1 for u in users if u.get("is_active") and u.get("created_at") and u["created_at"] >= current_month_start)
            lm_active = sum(1 for u in users if u.get("is_active") and u.get("created_at") and last_month_start <= u["created_at"] < last_month_end)

            tm_locked = sum(1 for u in users if not u.get("is_active") and u.get("created_at") and u["created_at"] >= current_month_start)
            lm_locked = sum(1 for u in users if not u.get("is_active") and u.get("created_at") and last_month_start <= u["created_at"] < last_month_end)

            tm_paid = sum(1 for u in users if (u.get("plan") or "free") != "free" and u.get("quota_updated_at") and u["quota_updated_at"] >= current_month_start)
            lm_paid = sum(1 for u in users if (u.get("plan") or "free") != "free" and u.get("quota_updated_at") and last_month_start <= u["quota_updated_at"] < last_month_end)

            def calculate_growth(curr, prev):
                if not prev or prev == 0:
                    return {"has_data": False, "val": 0, "up": True}
                diff = curr - prev
                pct = round((diff / prev) * 100, 1)
                return {"has_data": True, "val": abs(pct), "up": pct >= 0}

            total_trend = calculate_growth(tm_total, lm_total)
            active_trend = calculate_growth(tm_active, lm_active)
            locked_trend = calculate_growth(tm_locked, lm_locked)
            paid_trend = calculate_growth(tm_paid, lm_paid)

    except Exception:
        logger.exception("[USERS] Query error")
        flash("Không thể tải danh sách người dùng.", "error")
    finally:
        if conn:
            conn.close()

    # Format datetime strings for JS compatibility
    for u in users:
        created = u.get("created_at")
        u["created_str"] = created.strftime('%d/%m/%Y %H:%M') if created else ""
        expire = u.get("plan_expire")
        u["expire_str"] = expire.strftime('%d/%m/%Y %H:%M') if expire else ""

    return render_template(
        "users.html",
        users=users,
        total_users=total_users,
        total_admins=total_admins,
        total_active=total_active,
        total_locked=total_locked,
        total_paid=total_paid,
        total_trend=total_trend,
        active_trend=active_trend,
        paid_trend=paid_trend,
        locked_trend=locked_trend,
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
        with conn.cursor(DictCursor) as cur:
            cur.execute("SELECT email, fullname FROM users WHERE id = %s", (user_id,))
            user = cur.fetchone()
            if not user:
                return jsonify({"success": False, "error": "Không tìm thấy người dùng."}), 404
            
            cur.execute("UPDATE users SET is_active = FALSE WHERE id = %s", (user_id,))
        conn.commit()
        
        try:
            if user.get("email"):
                from notifications import send_account_locked_email
                send_account_locked_email(user["email"], user.get("fullname") or user["email"])
        except Exception:
            logger.exception("[LOCK] Error sending email")
            
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
        with conn.cursor(DictCursor) as cur:
            cur.execute("SELECT email, fullname FROM users WHERE id = %s", (user_id,))
            user = cur.fetchone()
            if not user:
                return jsonify({"success": False, "error": "Không tìm thấy người dùng."}), 404
            
            cur.execute("UPDATE users SET is_active = TRUE WHERE id = %s", (user_id,))
        conn.commit()
        
        try:
            if user.get("email"):
                from notifications import send_account_unlocked_email
                send_account_unlocked_email(user["email"], user.get("fullname") or user["email"])
        except Exception:
            logger.exception("[UNLOCK] Error sending email")
            
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
            cur.execute("SELECT id, username, email, fullname FROM users WHERE id = %s", (user_id,))
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
        
        try:
            if target.get("email"):
                from notifications import send_account_deleted_email
                send_account_deleted_email(target["email"], target.get("fullname") or target.get("username") or target["email"])
        except Exception:
            logger.exception("[DELETE] Error sending email")
            
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
    all_orders = []
    pricing = PLAN_PRICE_VND
    try:
        conn = get_connection()
        # Fetch more orders (up to 500) to support rich client-side search/filters/pagination
        all_orders = PaymentOrder.list_all(conn, limit=500) or []
        pricing = get_plan_price_vnd(conn)
    finally:
        if conn:
            conn.close()

    for o in all_orders:
        o["amount_calc"] = _order_amount_vnd(o, pricing)

    # 1. Trend MoM Calculation
    from datetime import datetime, timedelta
    now = datetime.now()
    current_month_start = datetime(now.year, now.month, 1)
    if now.month == 1:
        last_month_start = datetime(now.year - 1, 12, 1)
        last_month_end = datetime(now.year, 1, 1)
    else:
        last_month_start = datetime(now.year, now.month - 1, 1)
        last_month_end = current_month_start

    # This month values
    tm_revenue = sum(o["amount_calc"] for o in all_orders if (o.get("status") or "").lower() == PaymentOrder.STATUS_PAID and o.get("created_at") >= current_month_start)
    tm_approved = sum(1 for o in all_orders if (o.get("status") or "").lower() == PaymentOrder.STATUS_PAID and o.get("created_at") >= current_month_start)
    tm_pending = sum(1 for o in all_orders if (o.get("status") or "").lower() == PaymentOrder.STATUS_USER_CONFIRMED and o.get("created_at") >= current_month_start)
    tm_rejected = sum(1 for o in all_orders if (o.get("status") or "").lower() == "rejected" and o.get("created_at") >= current_month_start)

    # Last month values
    lm_revenue = sum(o["amount_calc"] for o in all_orders if (o.get("status") or "").lower() == PaymentOrder.STATUS_PAID and last_month_start <= o.get("created_at") < last_month_end)
    lm_approved = sum(1 for o in all_orders if (o.get("status") or "").lower() == PaymentOrder.STATUS_PAID and last_month_start <= o.get("created_at") < last_month_end)
    lm_pending = sum(1 for o in all_orders if (o.get("status") or "").lower() == PaymentOrder.STATUS_USER_CONFIRMED and last_month_start <= o.get("created_at") < last_month_end)
    lm_rejected = sum(1 for o in all_orders if (o.get("status") or "").lower() == "rejected" and last_month_start <= o.get("created_at") < last_month_end)

    def calculate_trend(curr, prev):
        if not prev or prev == 0:
            return {"has_data": False, "val": 0, "up": True}
        diff = curr - prev
        pct = round((diff / prev) * 100, 1)
        return {"has_data": True, "val": abs(pct), "up": pct >= 0}

    rev_trend = calculate_trend(tm_revenue, lm_revenue)
    app_trend = calculate_trend(tm_approved, lm_approved)
    pen_trend = calculate_trend(tm_pending, lm_pending)
    rej_trend = calculate_trend(tm_rejected, lm_rejected)

    # Stats for overview cards
    paid_orders = [o for o in all_orders if (o.get("status") or "").lower() == PaymentOrder.STATUS_PAID]
    total_paid_amount = sum(int(o.get("amount_calc") or 0) for o in paid_orders)
    total_paid_count = len(paid_orders)
    total_pending_count = sum(1 for o in all_orders if (o.get("status") or "").lower() == PaymentOrder.STATUS_USER_CONFIRMED)
    total_rejected_count = sum(1 for o in all_orders if (o.get("status") or "").lower() == "rejected")
    total_cancelled_count = sum(1 for o in all_orders if (o.get("status") or "").lower() == "cancelled")

    recent_paid = sorted(
        paid_orders,
        key=lambda o: o.get("confirmed_at") or o.get("created_at") or datetime.min,
        reverse=True,
    )[:5]
    latest_paid_at = None
    if recent_paid:
        latest_paid_at = recent_paid[0].get("confirmed_at") or recent_paid[0].get("created_at")

    # Serialize datetimes in all_orders so frontend JS can read them easily if needed
    for o in all_orders:
        created = o.get("created_at")
        confirmed = o.get("confirmed_at")
        o["created_str"] = created.strftime('%d/%m/%Y %H:%M') if created else ""
        o["confirmed_str"] = confirmed.strftime('%d/%m/%Y %H:%M') if confirmed else ""

    allow_manual_confirm = bool(current_app.config.get("ALLOW_MANUAL_TRANSFER_CONFIRM", True))
    auto_confirm_on_user = bool(current_app.config.get("AUTO_CONFIRM_ON_USER_CONFIRM", False))

    return render_template(
        "confirmations.html",
        all_orders=all_orders,
        total_paid_amount=total_paid_amount,
        total_paid_count=total_paid_count,
        total_pending_count=total_pending_count,
        total_rejected_count=total_rejected_count,
        total_cancelled_count=total_cancelled_count,
        latest_paid_at=latest_paid_at,
        recent_paid=recent_paid,
        rev_trend=rev_trend,
        app_trend=app_trend,
        pen_trend=pen_trend,
        rej_trend=rej_trend,
        allow_manual_confirm=allow_manual_confirm,
        auto_confirm_on_user=auto_confirm_on_user,
    )


@users_bp.route("/confirmations/export")
def export_confirmations():
    if not require_admin():
        return redirect(url_for("login.login"))

    scope = request.args.get("scope", "all")
    export_format = request.args.get("format", "csv")

    # Filters (only relevant if scope == "filtered")
    status_filter = request.args.get("status", "")
    search_query = request.args.get("q", "").strip()
    plan_filter = request.args.get("plan", "")
    method_filter = request.args.get("method", "")
    time_filter = request.args.get("time", "all")
    sort_by = request.args.get("sort", "newest")

    conn = None
    try:
        conn = get_connection()
        query_conds = []
        query_params = []

        if scope == "filtered":
            if status_filter and status_filter != "all":
                query_conds.append("po.status = %s")
                query_params.append(status_filter)
            
            if search_query:
                query_conds.append("(u.username LIKE %s OR u.fullname LIKE %s OR u.email LIKE %s OR po.order_id LIKE %s)")
                param = f"%{search_query}%"
                query_params.extend([param, param, param, param])

            if plan_filter:
                query_conds.append("po.plan = %s")
                query_params.append(plan_filter)

            if method_filter:
                query_conds.append("po.payment_method = %s")
                query_params.append(method_filter)

            if time_filter == "today":
                query_conds.append("po.created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)")
            elif time_filter == "7days":
                query_conds.append("po.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)")
            elif time_filter == "30days":
                query_conds.append("po.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)")

        where_clause = ""
        if query_conds:
            where_clause = "WHERE " + " AND ".join(query_conds)

        order_clause = "ORDER BY po.created_at DESC"
        if scope == "filtered":
            if sort_by == "oldest":
                order_clause = "ORDER BY po.created_at ASC"
            elif sort_by == "amount_desc":
                order_clause = "ORDER BY po.amount_vnd DESC"
            elif sort_by == "amount_asc":
                order_clause = "ORDER BY po.amount_vnd ASC"

        query = f"""
            SELECT po.order_id, po.plan, po.payment_method, po.amount_vnd, po.status, po.created_at, po.confirmed_at,
                   u.username, u.fullname, u.email
            FROM payment_orders po
            JOIN users u ON u.id = po.user_id
            {where_clause}
            {order_clause}
            LIMIT 500
        """

        with conn.cursor(DictCursor) as cur:
            cur.execute(query, tuple(query_params))
            rows = cur.fetchall() or []

        ui_language = request.cookies.get("siteLanguage", "vi")
        if ui_language not in ("vi", "en"):
            ui_language = "vi"

        pricing = get_plan_price_vnd(conn)

        orders_list = []
        for r in rows:
            po_amount = _order_amount_vnd(r, pricing)
            created = r.get("created_at")
            confirmed = r.get("confirmed_at")
            
            raw_status = (r.get("status") or "pending").lower()
            if ui_language == "en":
                status_mapped = {
                    "pending": "Pending",
                    "user_confirmed": "Pending Approval",
                    "paid": "Approved/Paid",
                    "rejected": "Rejected",
                    "cancelled": "Cancelled"
                }.get(raw_status, raw_status.capitalize())
                method_mapped = {
                    "qr": "VietQR",
                    "bank": "Bank Transfer"
                }.get((r.get("payment_method") or "").lower(), r.get("payment_method"))
            else:
                status_mapped = {
                    "pending": "Đang chờ",
                    "user_confirmed": "Chờ duyệt",
                    "paid": "Đã duyệt/Đã thanh toán",
                    "rejected": "Đã từ chối",
                    "cancelled": "Đã hủy"
                }.get(raw_status, raw_status)
                method_mapped = {
                    "qr": "VietQR QR Code",
                    "bank": "Chuyển khoản"
                }.get((r.get("payment_method") or "").lower(), r.get("payment_method"))

            orders_list.append({
                "order_id": r.get("order_id"),
                "username": r.get("username"),
                "fullname": r.get("fullname") or "",
                "email": r.get("email") or "",
                "plan": (r.get("plan") or "").upper(),
                "payment_method": method_mapped,
                "amount": po_amount,
                "status": status_mapped,
                "created_at": created.strftime("%Y-%m-%d %H:%M:%S") if created else "",
                "confirmed_at": confirmed.strftime("%Y-%m-%d %H:%M:%S") if confirmed else ""
            })

        filename = f"PetAI_Transactions_{datetime.now().strftime('%Y%m%d')}"

        if ui_language == "en":
            headers = ["Order ID", "Username", "Full Name", "Email", "Plan", "Payment Method", "Amount (VND)", "Status", "Created At", "Confirmed At"]
        else:
            headers = ["Mã đơn hàng", "Tên đăng nhập", "Họ và tên", "Email", "Gói dịch vụ", "Phương thức", "Số tiền (VND)", "Trạng thái", "Ngày tạo", "Ngày duyệt"]

        import io
        from flask import Response, send_file

        if export_format == "xlsx":
            try:
                import pandas as pd
                df = pd.DataFrame(orders_list)
                if not df.empty:
                    df = df[["order_id", "username", "fullname", "email", "plan", "payment_method", "amount", "status", "created_at", "confirmed_at"]]
                else:
                    df = pd.DataFrame(columns=["order_id", "username", "fullname", "email", "plan", "payment_method", "amount", "status", "created_at", "confirmed_at"])
                df.columns = headers
                
                output = io.BytesIO()
                with pd.ExcelWriter(output, engine='openpyxl') as writer:
                    df.to_excel(writer, index=False, sheet_name="Transactions")
                output.seek(0)
                
                return send_file(
                    output,
                    mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    as_attachment=True,
                    download_name=f"{filename}.xlsx"
                )
            except Exception as ex_excel:
                logger.exception("[EXPORT] Excel export failed, falling back to CSV")
                export_format = "csv"

        if export_format == "csv":
            import csv
            output = io.StringIO()
            writer = csv.writer(output, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            writer.writerow(headers)
            for o in orders_list:
                writer.writerow([
                    o["order_id"], o["username"], o["fullname"], o["email"], o["plan"],
                    o["payment_method"], o["amount"], o["status"], o["created_at"], o["confirmed_at"]
                ])
            
            csv_data = "\uFEFF" + output.getvalue()
            return Response(
                csv_data,
                mimetype="text/csv",
                headers={"Content-disposition": f"attachment; filename={filename}.csv"}
            )

    except Exception as e:
        logger.exception("[EXPORT] Export confirmations failed")
        flash("Không thể xuất lịch sử giao dịch. Vui lòng thử lại sau.", "error")
        return redirect(url_for("users.confirmations_list"))
    finally:
        if conn:
            conn.close()


@users_bp.route("/payments/reject", methods=["POST"])
def reject_payment():
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
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE payment_orders SET status = 'rejected', confirmed_at = CURRENT_TIMESTAMP WHERE order_id = %s AND status = %s",
                (order_id, PaymentOrder.STATUS_USER_CONFIRMED),
            )
            ok = cur.rowcount > 0
        if ok:
            conn.commit()
            flash(f"Đã từ chối thanh toán cho đơn {order_id}.", "success")
        else:
            flash("Không thể từ chối đơn (có thể đã xử lý hoặc không tồn tại).", "error")
    except Exception:
        if conn:
            conn.rollback()
        logger.exception("[ADMIN] reject_payment error")
        flash("Lỗi từ chối đơn.", "error")
    finally:
        if conn:
            conn.close()
    return redirect(url_for("users.confirmations_list", page=current_page))


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


@users_bp.route("/set-plan", methods=["GET", "POST"])
def set_user_plan():
    if request.method == "GET":
        return redirect(url_for("users.list_users"))
    if not require_admin():
        if request.headers.get("X-Requested-With") == "XMLHttpRequest" or request.is_json:
            return jsonify({"success": False, "error": "Vui lòng đăng nhập."}), 401
        return redirect(url_for("login.login"))

    # Support JSON payload or Form data
    payload = request.get_json(silent=True) or {}
    user_id_raw = (payload.get("user_id") or request.form.get("user_id") or "").strip()
    plan = (payload.get("plan") or request.form.get("plan") or "free").strip().lower()
    page_raw = (payload.get("page") or request.form.get("page") or "").strip()

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
        if request.headers.get("X-Requested-With") == "XMLHttpRequest" or request.is_json:
            return jsonify({"success": False, "error": "User ID không hợp lệ."}), 400
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
        
        msg = f"Đã cấp gói {plan.upper()} cho user #{user_id}."
        if request.headers.get("X-Requested-With") == "XMLHttpRequest" or request.is_json:
            return jsonify({"success": True, "message": msg}), 200
        flash(msg, "success")
    except Exception:
        logger.exception("[USERS] set plan error")
        if request.headers.get("X-Requested-With") == "XMLHttpRequest" or request.is_json:
            return jsonify({"success": False, "error": "Không thể cấp gói cho user."}), 500
        flash("Không thể cấp gói cho user. Vui lòng thử lại.", "error")
    finally:
        if conn:
            conn.close()

    if current_page:
        return redirect(url_for("users.list_users", page=current_page))
    return redirect(url_for("users.list_users"))


@users_bp.route("/set-role/<int:user_id>", methods=["POST"])
def set_user_role(user_id: int):
    if not require_admin():
        return jsonify({"success": False, "error": "Vui lòng đăng nhập."}), 401

    try:
        session_user_id = session.get("user_id")
        if session_user_id is not None and int(session_user_id) == int(user_id):
            return jsonify({"success": False, "error": "Không thể tự thay đổi vai trò của tài khoản đang đăng nhập."}), 400
    except Exception:
        pass

    payload = request.get_json(silent=True) or {}
    role = (payload.get("role") or request.form.get("role") or "").strip().lower()
    if role not in {"admin", "user"}:
        return jsonify({"success": False, "error": "Vai trò không hợp lệ."}), 400

    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("UPDATE users SET role = %s WHERE id = %s", (role, user_id))
            if cur.rowcount == 0:
                return jsonify({"success": False, "error": "Không tìm thấy người dùng."}), 404
        conn.commit()
        return jsonify({"success": True}), 200
    except Exception:
        if conn:
            conn.rollback()
        logger.exception("[USERS] set role error")
        return jsonify({"success": False, "error": "Không thể thay đổi vai trò."}), 500
    finally:
        if conn:
            conn.close()


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
            
    smtp_details = {
        "host": os.getenv("SMTP_SERVER", "smtp.gmail.com"),
        "port": os.getenv("SMTP_PORT", "587"),
        "email": os.getenv("SMTP_EMAIL", "nguyenhoangloi070904@gmail.com")
    }
    return render_template("system_config.html", configs=configs, smtp=smtp_details)


def translate_text_server_side(text, from_lang="vi", to_lang="en"):
    import requests
    import urllib.parse
    try:
        url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl={from_lang}&tl={to_lang}&dt=t&q={urllib.parse.quote(text)}"
        headers = {"User-Agent": "Mozilla/5.0"}
        r = requests.get(url, headers=headers, timeout=5)
        if r.status_code == 200:
            res = r.json()
            translated = "".join(part[0] for part in res[0] if part[0])
            return translated
    except Exception as e:
        logger.warning(f"[i18n] Server-side translation error: {e}")
    return text


@users_bp.route("/system-config/save", methods=["POST"])
def save_system_config():
    if not require_admin():
        return redirect(url_for("login.login"))
        
    from models import SystemConfig
    
    conn = None
    try:
        conn = get_connection()
        
        # General configurations
        if "site_name" in request.form:
            SystemConfig.set(conn, "site_name", request.form.get("site_name", "").strip(), "Tên website")
        if "site_description_vi" in request.form or "site_description_en" in request.form:
            desc_vi = request.form.get("site_description_vi", "").strip()
            desc_en = request.form.get("site_description_en", "").strip()
            
            if desc_vi and not desc_en:
                desc_en = translate_text_server_side(desc_vi, "vi", "en")
            elif desc_en and not desc_vi:
                desc_vi = translate_text_server_side(desc_en, "en", "vi")
                
            SystemConfig.set(conn, "site_description_vi", desc_vi, "Mô tả ngắn website (Tiếng Việt)")
            SystemConfig.set(conn, "site_description_en", desc_en, "Mô tả ngắn website (Tiếng Anh)")
            SystemConfig.set(conn, "site_description", desc_vi, "Mô tả ngắn website")
        elif "site_description" in request.form:
            desc_vi = request.form.get("site_description", "").strip()
            SystemConfig.set(conn, "site_description", desc_vi, "Mô tả ngắn website")
            SystemConfig.set(conn, "site_description_vi", desc_vi, "Mô tả ngắn website (Tiếng Việt)")
            desc_en = translate_text_server_side(desc_vi, "vi", "en")
            SystemConfig.set(conn, "site_description_en", desc_en, "Mô tả ngắn website (Tiếng Anh)")
        if "site_email" in request.form:
            SystemConfig.set(conn, "site_email", request.form.get("site_email", "").strip(), "Email liên hệ chính")
        if "contact_phone" in request.form:
            SystemConfig.set(conn, "contact_phone", request.form.get("contact_phone", "").strip(), "Số điện thoại liên hệ")
            
        if "contact_address" in request.form:
            SystemConfig.set(conn, "contact_address", request.form.get("contact_address", "").strip(), "Địa chỉ liên hệ")
            
        if "contact_address_vi" in request.form or "contact_address_en" in request.form:
            address_vi = request.form.get("contact_address_vi", "").strip()
            address_en = request.form.get("contact_address_en", "").strip()
            
            if address_vi and not address_en:
                address_en = translate_text_server_side(address_vi, "vi", "en")
            elif address_en and not address_vi:
                address_vi = translate_text_server_side(address_en, "en", "vi")
                
            SystemConfig.set(conn, "contact_address_vi", address_vi, "Địa chỉ liên hệ (Tiếng Việt)")
            SystemConfig.set(conn, "contact_address_en", address_en, "Địa chỉ liên hệ (Tiếng Anh)")
            # Backward compatibility fallback
            SystemConfig.set(conn, "contact_address", address_vi, "Địa chỉ liên hệ")
        if "contact_website" in request.form:
            SystemConfig.set(conn, "contact_website", request.form.get("contact_website", "").strip(), "Website liên hệ")
        elif "contact_fb" in request.form:
            SystemConfig.set(conn, "contact_website", request.form.get("contact_fb", "").strip(), "Website liên hệ")
        if "support_hours_vi" in request.form:
            SystemConfig.set(conn, "support_hours_vi", request.form.get("support_hours_vi", "").strip(), "Giờ hỗ trợ (Tiếng Việt)")
        if "support_hours_en" in request.form:
            SystemConfig.set(conn, "support_hours_en", request.form.get("support_hours_en", "").strip(), "Giờ hỗ trợ (Tiếng Anh)")
        if "default_lang" in request.form:

            SystemConfig.set(conn, "default_lang", request.form.get("default_lang", "").strip(), "Ngôn ngữ mặc định")
        if "default_theme" in request.form:
            SystemConfig.set(conn, "default_theme", request.form.get("default_theme", "").strip(), "Theme mặc định")
            
        # Maintenance mode toggle
        if "site_name" in request.form or "maintenance_mode_submitted" in request.form:
            maintenance_mode = "1" if request.form.get("maintenance_mode") in ["on", "1", "true"] else "0"
            SystemConfig.set(conn, "maintenance_mode", maintenance_mode, "Chế độ bảo trì (1=Bật, 0=Tắt)")

        # Plans configurations
        if "plan_basic_price" in request.form:
            SystemConfig.set(conn, "plan_basic_price", request.form.get("plan_basic_price", "").strip(), "Giá gói Basic (VND)")
            SystemConfig.set(conn, "plan_basic_days", request.form.get("plan_basic_days", "").strip(), "Thời gian gói Basic (ngày)")
            SystemConfig.set(conn, "plan_basic_scans", request.form.get("plan_basic_scans", "").strip(), "Lượt quét gói Basic")
            plan_basic_enabled = "1" if request.form.get("plan_basic_enabled") in ["on", "1", "true"] else "0"
            SystemConfig.set(conn, "plan_basic_enabled", plan_basic_enabled, "Trạng thái gói Basic (1=Bật, 0=Tắt)")
            
            SystemConfig.set(conn, "plan_pro_price", request.form.get("plan_pro_price", "").strip(), "Giá gói Pro (VND)")
            SystemConfig.set(conn, "plan_pro_days", request.form.get("plan_pro_days", "").strip(), "Thời gian gói Pro (ngày)")
            SystemConfig.set(conn, "plan_pro_scans", request.form.get("plan_pro_scans", "").strip(), "Lượt quét gói Pro")
            plan_pro_enabled = "1" if request.form.get("plan_pro_enabled") in ["on", "1", "true"] else "0"
            SystemConfig.set(conn, "plan_pro_enabled", plan_pro_enabled, "Trạng thái gói Pro (1=Bật, 0=Tắt)")
            
            SystemConfig.set(conn, "plan_enterprise_price", request.form.get("plan_enterprise_price", "").strip(), "Giá gói Enterprise (VND)")
            SystemConfig.set(conn, "plan_enterprise_days", request.form.get("plan_enterprise_days", "").strip(), "Thời gian gói Enterprise (ngày)")
            SystemConfig.set(conn, "plan_enterprise_scans", request.form.get("plan_enterprise_scans", "").strip(), "Lượt quét gói Enterprise")
            plan_enterprise_enabled = "1" if request.form.get("plan_enterprise_enabled") in ["on", "1", "true"] else "0"
            SystemConfig.set(conn, "plan_enterprise_enabled", plan_enterprise_enabled, "Trạng thái gói Enterprise (1=Bật, 0=Tắt)")

        # Payments configurations (VietQR)
        if "vietqr_account" in request.form or "vietqr_owner" in request.form or "vietqr_submitted" in request.form:
            SystemConfig.set(conn, "vietqr_owner", request.form.get("vietqr_owner", "").strip(), "Tên chủ tài khoản VietQR")
            SystemConfig.set(conn, "vietqr_account", request.form.get("vietqr_account", "").strip(), "Số tài khoản VietQR")
            SystemConfig.set(conn, "vietqr_bank", request.form.get("vietqr_bank", "").strip(), "Ngân hàng VietQR")
            SystemConfig.set(conn, "vietqr_template", request.form.get("vietqr_template", "").strip(), "Nội dung chuyển khoản mẫu")
            SystemConfig.set(conn, "vietqr_email", request.form.get("vietqr_email", "").strip(), "Email nhận thông báo thanh toán")
            if "vietqr_instructions_vi" in request.form or "vietqr_instructions_en" in request.form:
                instructions_vi = request.form.get("vietqr_instructions_vi", "").strip()
                instructions_en = request.form.get("vietqr_instructions_en", "").strip()
                
                if instructions_vi and not instructions_en:
                    instructions_en = translate_text_server_side(instructions_vi, "vi", "en")
                elif instructions_en and not instructions_vi:
                    instructions_vi = translate_text_server_side(instructions_en, "en", "vi")
                
                SystemConfig.set(conn, "vietqr_instructions_vi", instructions_vi, "Hướng dẫn thanh toán (Tiếng Việt)")
                SystemConfig.set(conn, "vietqr_instructions_en", instructions_en, "Hướng dẫn thanh toán (Tiếng Anh)")
                SystemConfig.set(conn, "vietqr_instructions", instructions_vi, "Hướng dẫn thanh toán")
            elif "vietqr_instructions" in request.form:
                instructions_vi = request.form.get("vietqr_instructions", "").strip()
                SystemConfig.set(conn, "vietqr_instructions", instructions_vi, "Hướng dẫn thanh toán")
                SystemConfig.set(conn, "vietqr_instructions_vi", instructions_vi, "Hướng dẫn thanh toán (Tiếng Việt)")
                instructions_en = translate_text_server_side(instructions_vi, "vi", "en")
                SystemConfig.set(conn, "vietqr_instructions_en", instructions_en, "Hướng dẫn thanh toán (Tiếng Anh)")
            
            vietqr_enabled = "1" if request.form.get("vietqr_enabled") in ["on", "1", "true"] else "0"
            SystemConfig.set(conn, "vietqr_enabled", vietqr_enabled, "Bật thanh toán VietQR (1=Bật, 0=Tắt)")

        # Email & Notifications templates
        if "email_otp_subject" in request.form:
            SystemConfig.set(conn, "email_otp_subject", request.form.get("email_otp_subject", "").strip(), "Tiêu đề email xác thực OTP")
            SystemConfig.set(conn, "email_otp_body", request.form.get("email_otp_body", "").strip(), "Nội dung email xác thực OTP")
        if "email_forgot_subject" in request.form:
            SystemConfig.set(conn, "email_forgot_subject", request.form.get("email_forgot_subject", "").strip(), "Tiêu đề email quên mật khẩu")
            SystemConfig.set(conn, "email_forgot_body", request.form.get("email_forgot_body", "").strip(), "Nội dung email quên mật khẩu")
        if "email_pay_confirm_subject" in request.form:
            SystemConfig.set(conn, "email_pay_confirm_subject", request.form.get("email_pay_confirm_subject", "").strip(), "Tiêu đề email xác nhận thanh toán")
            SystemConfig.set(conn, "email_pay_confirm_body", request.form.get("email_pay_confirm_body", "").strip(), "Nội dung email xác nhận thanh toán")
        if "email_pay_reject_subject" in request.form:
            SystemConfig.set(conn, "email_pay_reject_subject", request.form.get("email_pay_reject_subject", "").strip(), "Tiêu đề email từ chối thanh toán")
            SystemConfig.set(conn, "email_pay_reject_body", request.form.get("email_pay_reject_body", "").strip(), "Nội dung email từ chối thanh toán")
        if "email_delete_request_subject" in request.form:
            SystemConfig.set(conn, "email_delete_request_subject", request.form.get("email_delete_request_subject", "").strip(), "Tiêu đề email yêu cầu xóa tài khoản")
            SystemConfig.set(conn, "email_delete_request_body", request.form.get("email_delete_request_body", "").strip(), "Nội dung email yêu cầu xóa tài khoản")
        if "email_delete_confirm_subject" in request.form:
            SystemConfig.set(conn, "email_delete_confirm_subject", request.form.get("email_delete_confirm_subject", "").strip(), "Tiêu đề email xác nhận xóa tài khoản")
            SystemConfig.set(conn, "email_delete_confirm_body", request.form.get("email_delete_confirm_body", "").strip(), "Nội dung email xác nhận xóa tài khoản")
            
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
    
    allowed_pages = {"privacy-policy", "terms-of-service", "payment-policy", "data-deletion", "support", "contact", "user-guide", "home"}
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
    allowed_pages = {"privacy-policy", "terms-of-service", "payment-policy", "data-deletion", "support", "contact", "user-guide", "home"}
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
    allowed_pages = {"privacy-policy", "terms-of-service", "payment-policy", "data-deletion", "support", "contact", "user-guide", "home"}
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
    
    logo_file = request.files.get("logo")
    favicon_file = request.files.get("favicon")
    
    if (not logo_file or logo_file.filename == "") and (not favicon_file or favicon_file.filename == ""):
        flash("Chưa chọn file upload.", "warning")
        return redirect(url_for("users.system_config"))
        
    static_dir = os.path.join(current_app.root_path, "static", "images")
    os.makedirs(static_dir, exist_ok=True)
    
    # Process logo upload
    if logo_file and logo_file.filename != "":
        filename = logo_file.filename.lower()
        allowed_logo_exts = {".png", ".jpg", ".jpeg", ".svg", ".webp"}
        _, ext = os.path.splitext(filename)
        if ext not in allowed_logo_exts:
            flash("Định dạng file logo không hỗ trợ. Chỉ cho phép PNG, JPG, JPEG, SVG, WEBP.", "error")
            return redirect(url_for("users.system_config"))
            
        try:
            logo_path = os.path.join(static_dir, "logo.png")
            backup_path = os.path.join(static_dir, "logo_backup.png")
            
            # Backup original logo if backup doesn't exist
            if os.path.exists(logo_path) and not os.path.exists(backup_path):
                import shutil
                shutil.copy2(logo_path, backup_path)
                
            logo_file.save(logo_path)
            flash("Thay đổi logo trang web thành công.", "success")
        except Exception as e:
            logger.exception("[ADMIN] Upload logo error")
            flash(f"Lỗi tải lên logo: {str(e)}", "error")

    # Process favicon upload
    if favicon_file and favicon_file.filename != "":
        filename = favicon_file.filename.lower()
        allowed_fav_exts = {".ico", ".png", ".jpg", ".jpeg", ".svg", ".webp"}
        _, ext = os.path.splitext(filename)
        if ext not in allowed_fav_exts:
            flash("Định dạng file favicon không hỗ trợ. Chỉ cho phép ICO, PNG, JPG, JPEG, SVG, WEBP.", "error")
            return redirect(url_for("users.system_config"))
            
        try:
            fav_path = os.path.join(static_dir, "favicon.ico")
            backup_path = os.path.join(static_dir, "favicon_backup.ico")
            
            # Backup original favicon if backup doesn't exist
            if os.path.exists(fav_path) and not os.path.exists(backup_path):
                import shutil
                shutil.copy2(fav_path, backup_path)
                
            favicon_file.save(fav_path)
            flash("Thay đổi favicon trang web thành công.", "success")
        except Exception as e:
            logger.exception("[ADMIN] Upload favicon error")
            flash(f"Lỗi tải lên favicon: {str(e)}", "error")
            
    return redirect(url_for("users.system_config"))


@users_bp.route("/system-config/delete-asset", methods=["POST"])
def delete_system_asset():
    if not require_admin():
        return jsonify({"error": "Unauthorized"}), 403
        
    asset_type = request.form.get("asset_type")
    import os
    static_dir = os.path.join(current_app.root_path, "static", "images")
    
    try:
        if asset_type == "logo":
            logo_path = os.path.join(static_dir, "logo.png")
            backup_path = os.path.join(static_dir, "logo_backup.png")
            if os.path.exists(backup_path):
                import shutil
                shutil.copy2(backup_path, logo_path)
                return jsonify({"success": True, "message": "Đã khôi phục logo mặc định."})
            elif os.path.exists(logo_path):
                os.remove(logo_path)
                return jsonify({"success": True, "message": "Đã xóa logo thành công."})
                
        elif asset_type == "favicon":
            fav_path = os.path.join(static_dir, "favicon.ico")
            backup_path = os.path.join(static_dir, "favicon_backup.ico")
            if os.path.exists(backup_path):
                import shutil
                shutil.copy2(backup_path, fav_path)
                return jsonify({"success": True, "message": "Đã khôi phục favicon mặc định."})
            elif os.path.exists(fav_path):
                os.remove(fav_path)
                return jsonify({"success": True, "message": "Đã xóa favicon thành công."})
                
        return jsonify({"error": "Không tìm thấy tài nguyên."}), 404
    except Exception as e:
        logger.exception("[ADMIN] Delete asset error")
        return jsonify({"error": f"Lỗi: {str(e)}"}), 500


@users_bp.route("/delete-requests")
def delete_requests_list():
    if not require_admin():
        return redirect(url_for("login.login"))

    conn = None
    delete_users = []
    total_pending = 0
    total_deleted = 0
    try:
        conn = get_connection()
        from models import DeleteAccountManager
        DeleteAccountManager.ensure_columns(conn)
        
        with conn.cursor(DictCursor) as cur:
            cur.execute(
                """
                SELECT id, username, fullname, email, account_status, 
                       delete_requested_at, delete_scheduled_at, delete_reason, 
                       delete_cancelled_at, deleted_at, is_active
                FROM users
                WHERE account_status IN ('pending_delete', 'deleted')
                ORDER BY delete_requested_at DESC, deleted_at DESC
                """
            )
            delete_users = cur.fetchall() or []
            
            total_pending = sum(1 for u in delete_users if u.get("account_status") == "pending_delete")
            total_deleted = sum(1 for u in delete_users if u.get("account_status") == "deleted")
    except Exception:
        logger.exception("[ADMIN] Query delete requests error")
        flash("Không thể tải danh sách yêu cầu xóa.", "error")
    finally:
        if conn:
            conn.close()

    # Format dates
    for u in delete_users:
        requested = u.get("delete_requested_at")
        scheduled = u.get("delete_scheduled_at")
        deleted = u.get("deleted_at")
        u["requested_str"] = requested.strftime('%d/%m/%Y %H:%M') if requested else ""
        u["scheduled_str"] = scheduled.strftime('%d/%m/%Y %H:%M') if scheduled else ""
        u["deleted_str"] = deleted.strftime('%d/%m/%Y %H:%M') if deleted else ""

    return render_template(
        "delete_requests.html",
        delete_users=delete_users,
        total_pending=total_pending,
        total_deleted=total_deleted,
        active_page="delete_requests",
    )


@users_bp.route("/delete-requests/restore/<int:user_id>", methods=["POST"])
def delete_request_restore(user_id):
    if not require_admin():
        return jsonify({"success": False, "message": "Unauthorized"}), 403

    conn = None
    try:
        conn = get_connection()
        from models import DeleteAccountManager
        
        # Check user info first
        with conn.cursor() as cur:
            cur.execute("SELECT email, fullname, username, account_status FROM users WHERE id = %s", (user_id,))
            row = cur.fetchone()
        if not row:
            return jsonify({"success": False, "message": "Không tìm thấy người dùng."}), 404
            
        email, fullname, username, account_status = row[0], row[1], row[2], row[3]
        if account_status != "pending_delete":
            return jsonify({"success": False, "message": "Tài khoản không ở trạng thái chờ xóa."}), 400
            
        DeleteAccountManager.restore_account(conn, user_id)
        
        # Send email
        from notifications import send_restore_success_email
        send_restore_success_email(email, fullname or username or "")
        
        return jsonify({"success": True, "message": "Khôi phục tài khoản thành công!"})
    except Exception as e:
        logger.exception("[ADMIN] Restore delete request error")
        return jsonify({"success": False, "message": f"Lỗi hệ thống: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()


@users_bp.route("/delete-requests/force-delete/<int:user_id>", methods=["POST"])
def delete_request_force(user_id):
    if not require_admin():
        return jsonify({"success": False, "message": "Unauthorized"}), 403

    conn = None
    try:
        conn = get_connection()
        
        # Check user info first
        with conn.cursor() as cur:
            cur.execute("SELECT email, fullname, username, account_status FROM users WHERE id = %s", (user_id,))
            row = cur.fetchone()
        if not row:
            return jsonify({"success": False, "message": "Không tìm thấy người dùng."}), 404
            
        email, fullname, username, account_status = row[0], row[1], row[2], row[3]
        if account_status != "pending_delete":
            return jsonify({"success": False, "message": "Tài khoản không ở trạng thái chờ xóa."}), 400
            
        # Execute immediate delete
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE users
                SET account_status = 'deleted',
                    deleted_at = NOW(),
                    is_active = 0
                WHERE id = %s
                """,
                (user_id,),
            )
        conn.commit()
        
        # Send email
        from notifications import send_account_deleted_email
        send_account_deleted_email(email, fullname or username or "")
        
        return jsonify({"success": True, "message": "Đã xóa vĩnh viễn tài khoản!"})
    except Exception as e:
        logger.exception("[ADMIN] Force delete request error")
        return jsonify({"success": False, "message": f"Lỗi hệ thống: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()


@users_bp.route("/delete-requests/cleanup", methods=["POST"])
def delete_request_cleanup():
    if not require_admin():
        return jsonify({"success": False, "message": "Unauthorized"}), 403

    conn = None
    try:
        conn = get_connection()
        from models import DeleteAccountManager
        
        affected = DeleteAccountManager.auto_cleanup_expired(conn)
        return jsonify({"success": True, "message": f"Đã dọn dẹp {affected} tài khoản hết hạn!", "affected_count": affected})
    except Exception as e:
        logger.exception("[ADMIN] Cleanup expired delete requests error")
        return jsonify({"success": False, "message": f"Lỗi hệ thống: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()


@users_bp.route("/add", methods=["POST"])
def add_user():
    if not require_admin():
        return jsonify({"success": False, "error": "Bạn không có quyền thực hiện thao tác này."}), 403

    fullname = request.form.get("fullname", "").strip()
    username = request.form.get("username", "").strip().lower()
    email = request.form.get("email", "").strip().lower()
    password = request.form.get("password", "")
    role = request.form.get("role", "user").strip()
    plan = request.form.get("plan", "free").strip().lower()
    plan_expire = request.form.get("plan_expire", "").strip()
    paid_uses_remaining = request.form.get("paid_uses_remaining", "").strip()

    # Validation backend
    if not username or not email or not password:
        return jsonify({"success": False, "error": "Vui lòng nhập đầy đủ thông tin bắt buộc."}), 400

    import re
    if not re.match(r'^[a-zA-Z0-9_]{3,20}$', username):
        return jsonify({"success": False, "error": "Tên đăng nhập phải từ 3-20 ký tự, chỉ chứa chữ cái, số và dấu gạch dưới."}), 400

    email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    if not email.endswith("@gmail.com") or not re.match(email_regex, email):
        return jsonify({"success": False, "error": "Chỉ chấp nhận email đăng ký có đuôi @gmail.com."}), 400

    if len(password) < 6:
        return jsonify({"success": False, "error": "Mật khẩu phải có ít nhất 6 ký tự."}), 400

    if role not in ("admin", "user"):
        role = "user"

    if plan not in ("free", "basic", "pro", "enterprise"):
        plan = "free"

    conn = None
    try:
        conn = get_connection()
        from werkzeug.security import generate_password_hash
        pwd_hash = generate_password_hash(password)

        with conn.cursor() as cur:
            # Kiểm tra trùng username
            cur.execute("SELECT 1 FROM users WHERE username = %s", (username,))
            if cur.fetchone():
                return jsonify({"success": False, "error": "Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác."}), 400

            # Kiểm tra trùng email
            cur.execute("SELECT 1 FROM users WHERE email = %s", (email,))
            if cur.fetchone():
                return jsonify({"success": False, "error": "Email đã được sử dụng. Vui lòng sử dụng email khác."}), 400

            # Chèn user mới
            cur.execute(
                """
                INSERT INTO users (username, password_hash, email, fullname, role, created_at, email_verified, force_change_password, is_active) 
                VALUES (%s, %s, %s, %s, %s, NOW(), 1, 0, 1)
                """,
                (username, pwd_hash, email, fullname, role),
            )
            user_id = cur.lastrowid

            # Thiết lập quota
            if plan == "free":
                cur.execute(
                    """
                    INSERT INTO user_quota (user_id, plan, plan_expire, paid_uses_remaining)
                    VALUES (%s, 'free', NULL, NULL)
                    """,
                    (user_id,),
                )
            else:
                # Parse paid_uses_remaining
                uses = None
                if paid_uses_remaining:
                    try:
                        uses = int(paid_uses_remaining)
                    except ValueError:
                        pass
                
                # Nếu không có paid_uses_remaining tuỳ chỉnh, dùng mặc định theo plan
                if uses is None:
                    limit = UserQuota._paid_plan_limit(conn, plan)
                    uses = int(limit) if limit is not None else None

                # Parse plan_expire
                expire_date = plan_expire if plan_expire else None

                cur.execute(
                    """
                    INSERT INTO user_quota (user_id, plan, plan_expire, paid_uses_remaining)
                    VALUES (%s, %s, %s, %s)
                    """,
                    (user_id, plan, expire_date, uses),
                )

            conn.commit()
            logger.info(f"[ADMIN] Created user '{username}' manually with role '{role}' and plan '{plan}'")
            return jsonify({"success": True, "message": "Tạo người dùng mới thành công!"})

    except Exception as e:
        if conn:
            conn.rollback()
        logger.exception("[ADMIN] Manual create user error")
        return jsonify({"success": False, "error": f"Lỗi hệ thống: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

