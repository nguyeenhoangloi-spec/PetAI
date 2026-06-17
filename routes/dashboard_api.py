# routes/dashboard_api.py
# API Blueprint phục vụ cho các biểu đồ trong Dashboard

import json
from datetime import datetime, time, timedelta
from flask import Blueprint, jsonify, request, session
from connect import get_connection
from breed_names import to_common_vietnamese_breed_name

dashboard_api_bp = Blueprint("dashboard_api", __name__)


@dashboard_api_bp.route("/revenue-stats")
def api_revenue_stats():
    if not session.get("user_id") or session.get("role") != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    period = request.args.get("period", "7days")
    start_date_str = request.args.get("startDate")
    end_date_str = request.args.get("endDate")

    today = datetime.now().date()
    
    if period == "7days":
        start_date = today - timedelta(days=6)
        end_date = today
        group_by = "day"
    elif period == "30days":
        start_date = today - timedelta(days=29)
        end_date = today
        group_by = "day"
    elif period == "90days":
        start_date = today - timedelta(days=89)
        end_date = today
        group_by = "day"
    elif period == "12months":
        m = today.month - 11
        y = today.year
        while m <= 0:
            m += 12
            y -= 1
        start_date = datetime(y, m, 1).date()
        end_date = today
        group_by = "month"
    elif period == "custom" and start_date_str and end_date_str:
        try:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid date format"}), 400
        
        delta_days = (end_date - start_date).days
        if delta_days < 0:
            return jsonify({"error": "Start date must be before end date"}), 400
        elif delta_days <= 90:
            group_by = "day"
        else:
            group_by = "month"
    else:
        start_date = today - timedelta(days=6)
        end_date = today
        group_by = "day"

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            if group_by == "day":
                cur.execute("""
                    SELECT DATE(confirmed_at) AS day, SUM(amount_vnd) AS total
                    FROM payment_orders
                    WHERE status = 'paid'
                      AND confirmed_at >= %s AND confirmed_at < %s
                    GROUP BY day
                    ORDER BY day ASC
                """, (start_date, end_date + timedelta(days=1)))
                
                rev_map = {str(row[0]): int(row[1] or 0) for row in cur.fetchall()}
                
                labels = []
                data = []
                curr = start_date
                while curr <= end_date:
                    labels.append(curr.strftime('%d/%m'))
                    data.append(rev_map.get(str(curr), 0))
                    curr += timedelta(days=1)
            else: # group_by == "month"
                cur.execute("""
                    SELECT DATE_FORMAT(confirmed_at, '%%Y-%%m') AS month, SUM(amount_vnd) AS total
                    FROM payment_orders
                    WHERE status = 'paid'
                      AND confirmed_at >= %s AND confirmed_at < %s
                    GROUP BY month
                    ORDER BY month ASC
                """, (start_date.strftime('%Y-%m-01'), (end_date + timedelta(days=32)).strftime('%Y-%m-01')))
                
                rev_map = {row[0]: int(row[1] or 0) for row in cur.fetchall()}
                
                labels = []
                data = []
                curr = start_date
                while (curr.year, curr.month) <= (end_date.year, end_date.month):
                    key = f"{curr.year}-{curr.month:02d}"
                    labels.append(f"{curr.month:02d}/{curr.year}")
                    data.append(rev_map.get(key, 0))
                    m = curr.month + 1
                    y = curr.year
                    if m > 12:
                        m = 1
                        y += 1
                    curr = datetime(y, m, 1).date()
        
        return jsonify({
            "labels": labels,
            "data": data,
            "period": period,
            "group_by": group_by
        })
    except Exception as e:
        print(f"Error fetching revenue stats API: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@dashboard_api_bp.route("/activity-stats")
def api_activity_stats():
    user_id_raw = session.get("user_id")
    if not user_id_raw:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        user_id = int(user_id_raw)
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid session"}), 401

    is_admin = (session.get("role") == "admin")
    query_user_id = None if is_admin else user_id

    period = request.args.get("period", "7days")
    start_date_str = request.args.get("startDate")
    end_date_str = request.args.get("endDate")

    today = datetime.now().date()
    group_by = "day"

    if period == "7days":
        start_date = today - timedelta(days=6)
        end_date = today
    elif period == "30days":
        start_date = today - timedelta(days=29)
        end_date = today
    elif period == "90days":
        start_date = today - timedelta(days=89)
        end_date = today
    elif period == "12months":
        m = today.month - 11
        y = today.year
        while m <= 0:
            m += 12
            y -= 1
        start_date = datetime(y, m, 1).date()
        end_date = today
        group_by = "month"
    elif period == "custom" and start_date_str and end_date_str:
        try:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid date format"}), 400
        
        delta_days = (end_date - start_date).days
        if delta_days < 0:
            return jsonify({"error": "Start date must be before end date"}), 400
        elif delta_days <= 90:
            group_by = "day"
        else:
            group_by = "month"
    else:
        start_date = today - timedelta(days=6)
        end_date = today

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            # 1. Counts query
            if group_by == "day":
                if query_user_id is not None:
                    cur.execute("""
                        SELECT DATE(created_at) AS day, COUNT(*) AS cnt
                        FROM prediction_history
                        WHERE user_id = %s
                          AND created_at >= %s AND created_at < %s
                        GROUP BY day
                    """, (query_user_id, start_date, end_date + timedelta(days=1)))
                else:
                    cur.execute("""
                        SELECT DATE(created_at) AS day, COUNT(*) AS cnt
                        FROM prediction_history
                        WHERE created_at >= %s AND created_at < %s
                        GROUP BY day
                    """, (start_date, end_date + timedelta(days=1)))
                
                counts_map = {str(row[0]): int(row[1] or 0) for row in cur.fetchall()}
                
                daily_labels = []
                daily_data = []
                curr = start_date
                while curr <= end_date:
                    daily_labels.append(curr.strftime('%d/%m'))
                    daily_data.append(counts_map.get(str(curr), 0))
                    curr += timedelta(days=1)
            else: # group_by == "month"
                if query_user_id is not None:
                    cur.execute("""
                        SELECT DATE_FORMAT(created_at, '%%Y-%%m') AS month, COUNT(*) AS cnt
                        FROM prediction_history
                        WHERE user_id = %s
                          AND created_at >= %s AND created_at < %s
                        GROUP BY month
                    """, (query_user_id, start_date.strftime('%Y-%m-01'), (end_date + timedelta(days=32)).strftime('%Y-%m-01')))
                else:
                    cur.execute("""
                        SELECT DATE_FORMAT(created_at, '%%Y-%%m') AS month, COUNT(*) AS cnt
                        FROM prediction_history
                        WHERE created_at >= %s AND created_at < %s
                        GROUP BY month
                    """, (start_date.strftime('%Y-%m-01'), (end_date + timedelta(days=32)).strftime('%Y-%m-01')))
                
                counts_map = {row[0]: int(row[1] or 0) for row in cur.fetchall()}
                
                daily_labels = []
                daily_data = []
                curr = start_date
                while (curr.year, curr.month) <= (end_date.year, end_date.month):
                    key = f"{curr.year}-{curr.month:02d}"
                    daily_labels.append(f"{curr.month:02d}/{curr.year}")
                    daily_data.append(counts_map.get(key, 0))
                    
                    m = curr.month + 1
                    y = curr.year
                    if m > 12:
                        m = 1
                        y += 1
                    curr = datetime(y, m, 1).date()

            # 2. Top breeds query
            conds = []
            params = []
            if query_user_id is not None:
                conds.append("user_id = %s")
                params.append(query_user_id)
            conds.append("created_at >= %s")
            params.append(start_date)
            conds.append("created_at < %s")
            params.append(end_date + timedelta(days=1))
            conds.append("breed IS NOT NULL")
            
            where_clause = " WHERE " + " AND ".join(conds)
            
            cur.execute(f"""
                SELECT breed, COUNT(*) as count
                FROM prediction_history
                {where_clause}
                GROUP BY breed
                ORDER BY count DESC
                LIMIT 200
            """, tuple(params))
            
            breed_counter = {}
            for row in cur.fetchall():
                breed = to_common_vietnamese_breed_name(row[0])
                if breed == "Không xác định":
                    continue
                breed_counter[breed] = int(breed_counter.get(breed, 0)) + int(row[1] or 0)
            
            top_breeds_list = sorted(breed_counter.items(), key=lambda x: x[1], reverse=True)[:5]
            top_breeds = [b[0] for b in top_breeds_list]
            top_breeds_counts = [b[1] for b in top_breeds_list]

            # 3. Confidence distribution query
            conds_conf = [c for c in conds if "breed" not in c]
            conds_conf.append("confidence IS NOT NULL")
            where_conf = " WHERE " + " AND ".join(conds_conf)
            params_conf = [p for i, p in enumerate(params) if "breed" not in conds[i]]
            
            cur.execute(f"""
                SELECT
                    SUM(CASE WHEN confidence < 0.2 THEN 1 ELSE 0 END),
                    SUM(CASE WHEN confidence >= 0.2 AND confidence < 0.4 THEN 1 ELSE 0 END),
                    SUM(CASE WHEN confidence >= 0.4 AND confidence < 0.6 THEN 1 ELSE 0 END),
                    SUM(CASE WHEN confidence >= 0.6 AND confidence < 0.8 THEN 1 ELSE 0 END),
                    SUM(CASE WHEN confidence >= 0.8 THEN 1 ELSE 0 END)
                FROM prediction_history
                {where_conf}
            """, tuple(params_conf))
            row = cur.fetchone()
            confidence_dist = [int(v or 0) for v in row] if row else [0, 0, 0, 0, 0]

        return jsonify({
            "dailyLabels": daily_labels,
            "dailyData": daily_data,
            "topBreeds": top_breeds,
            "topBreedsCounts": top_breeds_counts,
            "confidenceDist": confidence_dist,
            "period": period,
            "group_by": group_by
        })
    except Exception as e:
        print(f"Error fetching activity stats API: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()
