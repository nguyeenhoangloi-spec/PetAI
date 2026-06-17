# analytics.py
# Blueprint cho thống kê nhận diện
from flask import Blueprint, render_template, session, redirect, url_for, flash, jsonify, request
from connect import get_connection
from models import PredictionHistory

stats_bp = Blueprint("statistics", __name__)


@stats_bp.route("/")
def statistics():
    """Trang thống kê"""
    user_id_any = session.get("user_id")
    if user_id_any is None:
        flash("Vui lòng đăng nhập để xem thống kê.", "warning")
        return redirect(url_for("login.login"))

    try:
        # Lấy bộ lọc thời gian từ query param (?days=7 / 30 / 0=all)
        selected_days = request.args.get("days", "30", type=str)
        if selected_days not in ("7", "30", "0"):
            selected_days = "30"

        conn = get_connection()
        user_id = int(user_id_any)

        stats = PredictionHistory.get_stats(conn, user_id)
        recent_predictions = PredictionHistory.get_by_user(conn, user_id, limit=10)

        # Số giống chó duy nhất
        unique_breed_count = PredictionHistory.get_unique_breed_count(conn, user_id)

        # Daily counts cho Line chart (7 hoặc 30 ngày; 0 = lấy 90 ngày làm "all")
        chart_days = int(selected_days) if selected_days != "0" else 90
        daily_counts = PredictionHistory.get_daily_counts(conn, user_id, days=chart_days)

        # Phân bố độ tin cậy cho Bar chart
        confidence_dist = PredictionHistory.get_confidence_distribution(conn, user_id)

        conn.close()

        return render_template(
            "statistics.html",
            stats=stats,
            recent_predictions=recent_predictions,
            unique_breed_count=unique_breed_count,
            daily_counts=daily_counts,
            confidence_dist=confidence_dist,
            selected_days=selected_days,
        )
    except Exception as e:
        print(f"Error loading statistics: {e}")
        flash("Không thể tải thống kê. Vui lòng thử lại.", "error")
        return redirect(url_for("dashboard.dashboard"))


@stats_bp.route("/api/stats")
def api_stats():
    """API lấy thống kê"""
    user_id_any = session.get("user_id")
    if user_id_any is None:
        return jsonify({"error": "Not authenticated"}), 401

    try:
        conn = get_connection()
        user_id = int(user_id_any)
        stats = PredictionHistory.get_stats(conn, user_id)
        conn.close()

        return jsonify(stats)
    except Exception as e:
        print(f"Error in API: {e}")
        return jsonify({"error": str(e)}), 500
