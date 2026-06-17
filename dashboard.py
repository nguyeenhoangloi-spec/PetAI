# dashboard.py
# Blueprint trang quản trị

import json
from datetime import datetime, time, timedelta

from flask import Blueprint, render_template, session, redirect, url_for, flash, request, jsonify

from connect import get_connection
from models import PredictionHistory
from breed_names import to_common_vietnamese_breed_name

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
        is_admin = (session.get("role") == "admin")
        query_user_id = None if is_admin else user_id

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

        # ---------- Chart data (7 days, 30 days, all time) ----------
        # --- 7 Days ---
        daily_counts_7 = PredictionHistory.get_daily_counts(conn, query_user_id, days=7)
        date_map_7 = {d['date']: d['count'] for d in daily_counts_7}
        chart_labels_7 = []
        chart_data_7 = []
        for i in range(6, -1, -1):
            d = (today - timedelta(days=i)).strftime('%d/%m')
            chart_labels_7.append(d)
            chart_data_7.append(date_map_7.get(d, 0))
        
        stats_7 = PredictionHistory.get_stats(conn, query_user_id, days=7)
        top_breeds_7 = stats_7.get('top_breeds', [])
        confidence_dist_7 = PredictionHistory.get_confidence_distribution(conn, query_user_id, days=7)

        # --- 30 Days ---
        daily_counts_30 = PredictionHistory.get_daily_counts(conn, query_user_id, days=30)
        date_map_30 = {d['date']: d['count'] for d in daily_counts_30}
        chart_labels_30 = []
        chart_data_30 = []
        for i in range(29, -1, -1):
            d = (today - timedelta(days=i)).strftime('%d/%m')
            chart_labels_30.append(d)
            chart_data_30.append(date_map_30.get(d, 0))
        
        stats_30 = PredictionHistory.get_stats(conn, query_user_id, days=30)
        top_breeds_30 = stats_30.get('top_breeds', [])
        confidence_dist_30 = PredictionHistory.get_confidence_distribution(conn, query_user_id, days=30)

        # --- All Time ---
        daily_counts_all = PredictionHistory.get_daily_counts(conn, query_user_id, days=None)
        chart_labels_all = [d['date'] for d in daily_counts_all]
        chart_data_all = [d['count'] for d in daily_counts_all]
        
        stats_all = PredictionHistory.get_stats(conn, query_user_id, days=None)
        top_breeds_all = stats_all.get('top_breeds', [])
        confidence_dist_all = PredictionHistory.get_confidence_distribution(conn, query_user_id, days=None)

        # --- Unique Breed Count & Total predictions ---
        unique_breeds = PredictionHistory.get_unique_breed_count(conn, query_user_id)
        total_all_time = PredictionHistory.count_by_user(conn, query_user_id)

        # Extra statistics for admin
        total_users = 0
        total_revenue = 0
        pending_orders_count = 0
        revenue_daily_labels = []
        revenue_daily_data = []
        revenue_monthly_labels = []
        revenue_monthly_data = []
        revenue_yearly_labels = []
        revenue_yearly_data = []
        subscription_labels = []
        subscription_data = []
        if is_admin:
            with conn.cursor() as cur:
                # Total registered users
                cur.execute("SELECT COUNT(*) FROM users")
                total_users = int(cur.fetchone()[0] or 0)

                # Total revenue (sum of paid orders)
                cur.execute("SELECT SUM(amount_vnd) FROM payment_orders WHERE status = 'paid'")
                total_revenue = int(cur.fetchone()[0] or 0)

                # Pending/user confirmed orders
                cur.execute("SELECT COUNT(*) FROM payment_orders WHERE status = 'user_confirmed'")
                pending_orders_count = int(cur.fetchone()[0] or 0)

                # --- Revenue Trend: last 7 days ---
                cur.execute("""
                    SELECT DATE(confirmed_at) AS day, SUM(amount_vnd) AS total
                    FROM payment_orders
                    WHERE status = 'paid'
                      AND confirmed_at >= CURDATE() - INTERVAL 6 DAY
                    GROUP BY day
                    ORDER BY day ASC
                """)
                daily_rev_map = {str(row[0]): int(row[1] or 0) for row in cur.fetchall()}
                for i in range(6, -1, -1):
                    d = today - timedelta(days=i)
                    revenue_daily_labels.append(d.strftime('%d/%m'))
                    revenue_daily_data.append(daily_rev_map.get(str(d), 0))

                # --- Revenue Trend: last 12 months ---
                cur.execute("""
                    SELECT DATE_FORMAT(confirmed_at, '%Y-%m') AS month, SUM(amount_vnd) AS total
                    FROM payment_orders
                    WHERE status = 'paid'
                      AND confirmed_at >= DATE_FORMAT(CURDATE() - INTERVAL 11 MONTH, '%Y-%m-01')
                    GROUP BY month
                    ORDER BY month ASC
                """)
                monthly_rev_map = {row[0]: int(row[1] or 0) for row in cur.fetchall()}
                from datetime import date as _date
                for i in range(11, -1, -1):
                    # Step back month by month
                    mn = today.month - i
                    yr = today.year
                    while mn <= 0:
                        mn += 12
                        yr -= 1
                    key = f'{yr}-{mn:02d}'
                    revenue_monthly_labels.append(f'{mn:02d}/{yr}')
                    revenue_monthly_data.append(monthly_rev_map.get(key, 0))

                # --- Revenue Trend: last 5 years ---
                cur.execute("""
                    SELECT YEAR(confirmed_at) AS yr, SUM(amount_vnd) AS total
                    FROM payment_orders
                    WHERE status = 'paid'
                      AND confirmed_at >= DATE_FORMAT(CURDATE() - INTERVAL 4 YEAR, '%Y-01-01')
                    GROUP BY yr
                    ORDER BY yr ASC
                """)
                yearly_rev_map = {str(row[0]): int(row[1] or 0) for row in cur.fetchall()}
                for i in range(4, -1, -1):
                    yr = today.year - i
                    revenue_yearly_labels.append(str(yr))
                    revenue_yearly_data.append(yearly_rev_map.get(str(yr), 0))

                # --- Subscription plan distribution ---
                cur.execute("""
                    SELECT plan, COUNT(*) AS cnt
                    FROM user_quota
                    GROUP BY plan
                    ORDER BY cnt DESC
                """)
                for row in cur.fetchall():
                    subscription_labels.append(str(row[0]).capitalize())
                    subscription_data.append(int(row[1] or 0))
                # If no quota rows yet, fall back to users table (all 'free')
                if not subscription_data:
                    subscription_labels = ['Free']
                    subscription_data = [total_users]

        return render_template(
            "dashboard.html",
            recent_predictions=recent_predictions,
            recent_predictions_count=recent_predictions_count,
            avg_confidence=avg_confidence,
            active_range=range_key,
            page=page,
            total_pages=total_pages,
            # Chart data (7 Days)
            chart_labels_7_json=json.dumps(chart_labels_7),
            chart_data_7_json=json.dumps(chart_data_7),
            top_breeds_7_json=json.dumps([b['breed'] for b in top_breeds_7]),
            top_breeds_counts_7_json=json.dumps([b['count'] for b in top_breeds_7]),
            confidence_dist_7_json=json.dumps(confidence_dist_7),
            # Chart data (30 Days)
            chart_labels_30_json=json.dumps(chart_labels_30),
            chart_data_30_json=json.dumps(chart_data_30),
            top_breeds_30_json=json.dumps([b['breed'] for b in top_breeds_30]),
            top_breeds_counts_30_json=json.dumps([b['count'] for b in top_breeds_30]),
            confidence_dist_30_json=json.dumps(confidence_dist_30),
            # Chart data (All time)
            chart_labels_all_json=json.dumps(chart_labels_all),
            chart_data_all_json=json.dumps(chart_data_all),
            top_breeds_all_json=json.dumps([b['breed'] for b in top_breeds_all]),
            top_breeds_counts_all_json=json.dumps([b['count'] for b in top_breeds_all]),
            confidence_dist_all_json=json.dumps(confidence_dist_all),
            unique_breeds=unique_breeds,
            total_all_time=total_all_time,
            # Admin only metrics
            total_users=total_users,
            total_revenue=total_revenue,
            pending_orders_count=pending_orders_count,
            is_admin=is_admin,
            # Admin financial analytics
            revenue_daily_labels_json=json.dumps(revenue_daily_labels),
            revenue_daily_data_json=json.dumps(revenue_daily_data),
            revenue_monthly_labels_json=json.dumps(revenue_monthly_labels),
            revenue_monthly_data_json=json.dumps(revenue_monthly_data),
            revenue_yearly_labels_json=json.dumps(revenue_yearly_labels),
            revenue_yearly_data_json=json.dumps(revenue_yearly_data),
            subscription_labels_json=json.dumps(subscription_labels),
            subscription_data_json=json.dumps(subscription_data),
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
            chart_labels_7_json='[]',
            chart_data_7_json='[]',
            top_breeds_7_json='[]',
            top_breeds_counts_7_json='[]',
            confidence_dist_7_json='[0,0,0,0,0]',
            chart_labels_30_json='[]',
            chart_data_30_json='[]',
            top_breeds_30_json='[]',
            top_breeds_counts_30_json='[]',
            confidence_dist_30_json='[0,0,0,0,0]',
            chart_labels_all_json='[]',
            chart_data_all_json='[]',
            top_breeds_all_json='[]',
            top_breeds_counts_all_json='[]',
            confidence_dist_all_json='[0,0,0,0,0]',
            unique_breeds=0,
            total_all_time=0,
            total_users=0,
            total_revenue=0,
            pending_orders_count=0,
            is_admin=False,
            revenue_daily_labels_json='[]',
            revenue_daily_data_json='[]',
            revenue_monthly_labels_json='[]',
            revenue_monthly_data_json='[]',
            revenue_yearly_labels_json='[]',
            revenue_yearly_data_json='[]',
            subscription_labels_json='[]',
            subscription_data_json='[]',
        )
    finally:
        try:
            if conn is not None:
                conn.close()
        except Exception:
            pass




