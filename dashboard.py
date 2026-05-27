# dashboard.py
# Blueprint trang quản trị

from datetime import datetime, time, timedelta

from flask import Blueprint, render_template, session, redirect, url_for, flash, request

from connect import get_connection
from models import PredictionHistory

PREDICTIONS_PER_PAGE = 10


dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/")
def dashboard():
    if not session.get("user_id"):
        flash("Vui lòng đăng nhập để truy cập dashboard.", "warning")
        return redirect(url_for("login.login"))

    range_key = request.args.get("range", "today")
    if range_key not in {"today", "yesterday", "7days"}:
        range_key = "today"

    today = datetime.now().date()
    if range_key == "today":
        start_at = datetime.combine(today, time.min)
        end_at = start_at + timedelta(days=1)
    elif range_key == "yesterday":
        start_at = datetime.combine(today - timedelta(days=1), time.min)
        end_at = datetime.combine(today, time.min)
    else:
        start_at = datetime.combine(today - timedelta(days=6), time.min)
        end_at = datetime.combine(today + timedelta(days=1), time.min)

    page_raw = request.args.get("page", "1")
    try:
        page = max(int(page_raw), 1)
    except (TypeError, ValueError):
        page = 1

    user_id_raw = session.get("user_id")
    try:
        user_id = int(user_id_raw)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        session.clear()
        flash("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.", "warning")
        return redirect(url_for("login.login"))
    conn = None
    try:
        conn = get_connection()
        recent_predictions_count = PredictionHistory.count_by_user_in_range(
            conn,
            user_id,
            start_at,
            end_at,
        )
        avg_confidence = PredictionHistory.avg_confidence_by_user_in_range(
            conn,
            user_id,
            start_at,
            end_at,
        )
        total_pages = max((recent_predictions_count + PREDICTIONS_PER_PAGE - 1) // PREDICTIONS_PER_PAGE, 1)
        if page > total_pages:
            page = total_pages

        offset = (page - 1) * PREDICTIONS_PER_PAGE
        recent_predictions = PredictionHistory.get_by_user_in_range(
            conn,
            user_id,
            start_at,
            end_at,
            limit=PREDICTIONS_PER_PAGE,
            offset=offset,
        )
        return render_template(
            "dashboard.html",
            recent_predictions=recent_predictions,
            recent_predictions_count=recent_predictions_count,
            avg_confidence=avg_confidence,
            active_range=range_key,
            page=page,
            total_pages=total_pages,
        )
    except Exception as e:
        print(f"Error loading dashboard: {e}")
        flash("Không thể tải dashboard. Vui lòng thử lại.", "error")
        return render_template(
            "dashboard.html",
            recent_predictions=[],
            recent_predictions_count=0,
            avg_confidence=0.0,
            active_range=range_key,
            page=1,
            total_pages=1,
        )
    finally:
        try:
            if conn is not None:
                conn.close()
        except Exception:
            pass
