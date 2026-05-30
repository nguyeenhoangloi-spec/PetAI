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


def _order_amount_vnd(order: dict) -> int:
    # Doanh thu & hiển thị số tiền phải bám theo giá gói.
    # Tránh trường hợp DB có amount_vnd sai (ví dụ 49k/99k) làm doanh thu bị đội.
    plan = (order.get("plan") or "").strip().lower()
    expected = PLAN_PRICE_VND.get(plan)
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
    total_pages = 0
    try:
        conn = get_connection()
        with conn.cursor(DictCursor) as cur:
            cur.execute("SELECT COUNT(*) AS total FROM users")
            row = cur.fetchone() or {}
            total_users = int(row.get("total") or 0)
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
    if not require_admin():
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
    try:
        conn = get_connection()
        orders = PaymentOrder.list_all(conn, limit=200) or []
    finally:
        if conn:
            conn.close()

    for o in orders:
        o["amount_calc"] = _order_amount_vnd(o)

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
                if plan == "pro":
                    plan_expire = now + timedelta(days=30)
                elif plan == "enterprise":
                    plan_expire = now + timedelta(days=90)
                elif plan == "basic":
                    plan_expire = now + timedelta(days=7)
                else:
                    plan_expire = None
                UserQuota.set_plan_upgrade_only(conn, user_id, plan, plan_expire)
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
