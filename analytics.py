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
    conn = None
    try:
        from datetime import datetime, timedelta

        selected_days = request.args.get("days", "30", type=str)
        if selected_days not in ("7", "30", "90", "0", "custom"):
            selected_days = "30"

        start_date_str = request.args.get("start_date", "")
        end_date_str = request.args.get("end_date", "")
        
        start_at = None
        end_at = None
        start_prev = None
        end_prev = None
        has_comparison = False
        duration_days = 30

        now = datetime.now()

        if selected_days == "7":
            start_at = now - timedelta(days=7)
            end_at = now
            start_prev = now - timedelta(days=14)
            end_prev = now - timedelta(days=7)
            has_comparison = True
            duration_days = 7
        elif selected_days == "30":
            start_at = now - timedelta(days=30)
            end_at = now
            start_prev = now - timedelta(days=60)
            end_prev = now - timedelta(days=30)
            has_comparison = True
            duration_days = 30
        elif selected_days == "90":
            start_at = now - timedelta(days=90)
            end_at = now
            start_prev = now - timedelta(days=180)
            end_prev = now - timedelta(days=90)
            has_comparison = True
            duration_days = 90
        elif selected_days == "custom":
            try:
                start_at = datetime.strptime(start_date_str, "%Y-%m-%d")
                end_at = datetime.strptime(end_date_str, "%Y-%m-%d").replace(hour=23, minute=59, second=59)
                duration_days = (end_at - start_at).days + 1
                if duration_days < 1:
                    duration_days = 1
                start_prev = start_at - timedelta(days=duration_days)
                end_prev = start_at - timedelta(seconds=1)
                has_comparison = True
            except Exception:
                selected_days = "30"
                start_at = now - timedelta(days=30)
                end_at = now
                start_prev = now - timedelta(days=60)
                end_prev = now - timedelta(days=30)
                has_comparison = True
                duration_days = 30
        else:
            start_at = None
            end_at = None
            has_comparison = False

        conn = get_connection()
        user_id = int(user_id_any)

        # Get current stats
        stats = PredictionHistory.get_stats(conn, user_id, start_at=start_at, end_at=end_at)
        
        # Get latest image path for each top breed to display as thumbnail
        if stats.get('top_breeds') and conn:
            with conn.cursor() as cur:
                for item in stats['top_breeds']:
                    cur.execute("""
                        SELECT image_path 
                        FROM prediction_history 
                        WHERE user_id = %s AND breed = %s AND image_path IS NOT NULL AND image_path != ''
                        ORDER BY created_at DESC LIMIT 1
                    """, (user_id, item['breed']))
                    row = cur.fetchone()
                    item['image_path'] = row[0] if row else None
        
        # Get unique breed count
        unique_breed_count = PredictionHistory.get_unique_breed_count(conn, user_id, start_at=start_at, end_at=end_at)
        
        # Get daily counts
        if selected_days == "0":
            daily_counts = PredictionHistory.get_daily_counts(conn, user_id, days=None)
        else:
            daily_counts = PredictionHistory.get_daily_counts(conn, user_id, start_at=start_at, end_at=end_at)
            
        # Get confidence distribution
        confidence_dist = PredictionHistory.get_confidence_distribution(conn, user_id, start_at=start_at, end_at=end_at)

        # Recent predictions (limit 10)
        recent_predictions = PredictionHistory.get_by_user(conn, user_id, limit=10)
        
        # Calculate comparison badges
        scans_diff_pct = None
        conf_diff = None
        new_breeds_count = 0
        
        if has_comparison and start_prev and end_prev:
            prev_stats = PredictionHistory.get_stats(conn, user_id, start_at=start_prev, end_at=end_prev)
            
            # Scans diff %
            curr_scans = stats.get('total_predictions', 0)
            prev_scans = prev_stats.get('total_predictions', 0)
            if prev_scans > 0:
                scans_diff_pct = round(((curr_scans - prev_scans) / prev_scans) * 100, 1)
            elif curr_scans > 0:
                scans_diff_pct = 100.0
            else:
                scans_diff_pct = 0.0
                
            # Avg confidence diff
            curr_conf = stats.get('avg_confidence', 0.0) * 100
            prev_conf = prev_stats.get('avg_confidence', 0.0) * 100
            conf_diff = round(curr_conf - prev_conf, 1)
            
            # New breeds count
            with conn.cursor() as cur:
                if user_id is not None:
                    cur.execute("""
                        SELECT DISTINCT breed 
                        FROM prediction_history 
                        WHERE user_id = %s AND created_at < %s AND breed IS NOT NULL AND breed != ''
                    """, (user_id, start_at))
                    breeds_before = {row[0] for row in cur.fetchall()}
                    
                    cur.execute("""
                        SELECT DISTINCT breed 
                        FROM prediction_history 
                        WHERE user_id = %s AND created_at >= %s AND created_at <= %s AND breed IS NOT NULL AND breed != ''
                    """, (user_id, start_at, end_at))
                    breeds_current = {row[0] for row in cur.fetchall()}
                else:
                    cur.execute("""
                        SELECT DISTINCT breed 
                        FROM prediction_history 
                        WHERE created_at < %s AND breed IS NOT NULL AND breed != ''
                    """, (start_at,))
                    breeds_before = {row[0] for row in cur.fetchall()}
                    
                    cur.execute("""
                        SELECT DISTINCT breed 
                        FROM prediction_history 
                        WHERE created_at >= %s AND created_at <= %s AND breed IS NOT NULL AND breed != ''
                    """, (start_at, end_at))
                    breeds_current = {row[0] for row in cur.fetchall()}
            
            new_breeds = breeds_current - breeds_before
            new_breeds_count = len(new_breeds)

        # Get latest scan relative time
        latest_prediction = PredictionHistory.get_by_user(conn, user_id, limit=1)
        latest_scan_time_vi = "Chưa có hoạt động"
        latest_scan_time_en = "No activity"
        if latest_prediction:
            last_dt = latest_prediction[0]['created_at']
            if last_dt:
                time_str = last_dt.strftime("%H:%M")
                date_str = last_dt.strftime("%d/%m/%Y")
                latest_scan_time_vi = f"Hôm nay {time_str}" if last_dt.date() == now.date() else (f"Hôm qua {time_str}" if last_dt.date() == (now - timedelta(days=1)).date() else f"{date_str} {time_str}")
                latest_scan_time_en = f"Today {time_str}" if last_dt.date() == now.date() else (f"Yesterday {time_str}" if last_dt.date() == (now - timedelta(days=1)).date() else f"{date_str} {time_str}")

        # Compute insights / highlights
        most_common_breed = "Chưa có dữ liệu"
        if stats.get('top_breeds'):
            most_common_breed = stats['top_breeds'][0]['breed']
            
        confidence_brackets = ["0-20%", "20-40%", "40-60%", "60-80%", "80-100%"]
        max_bracket_index = -1
        max_bracket_count = -1
        for i, val in enumerate(confidence_dist):
            if val > max_bracket_count:
                max_bracket_count = val
                max_bracket_index = i
        peak_confidence_bracket = confidence_brackets[max_bracket_index] if max_bracket_count > 0 else "Chưa có dữ liệu"

        peak_active_date = "Chưa có dữ liệu"
        peak_active_weekday_vi = ""
        peak_active_weekday_en = ""
        max_daily_count = -1
        for day in daily_counts:
            if day['count'] > max_daily_count:
                max_daily_count = day['count']
                peak_active_date = day['date']
        if max_daily_count <= 0:
            peak_active_date = "Chưa có dữ liệu"
        else:
            try:
                # Parse weekday from format dd/mm
                if peak_active_date and '/' in peak_active_date:
                    parts = peak_active_date.split('/')
                    if len(parts) == 2:
                        day_val = int(parts[0])
                        month_val = int(parts[1])
                        # Check if month is valid (not monthly format like mm/yy)
                        if month_val <= 12:
                            year_val = datetime.now().year
                            dt_obj = datetime(year_val, month_val, day_val)
                            weekdays_vi = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"]
                            weekdays_en = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                            peak_active_weekday_vi = weekdays_vi[dt_obj.weekday()]
                            peak_active_weekday_en = weekdays_en[dt_obj.weekday()]
            except Exception:
                pass

        return render_template(
            "statistics.html",
            stats=stats,
            recent_predictions=recent_predictions,
            unique_breed_count=unique_breed_count,
            daily_counts=daily_counts,
            confidence_dist=confidence_dist,
            selected_days=selected_days,
            start_date=start_date_str or (start_at.strftime("%Y-%m-%d") if start_at else ""),
            end_date=end_date_str or (end_at.strftime("%Y-%m-%d") if end_at else ""),
            scans_diff_pct=scans_diff_pct,
            conf_diff=conf_diff,
            new_breeds_count=new_breeds_count,
            latest_scan_time_vi=latest_scan_time_vi,
            latest_scan_time_en=latest_scan_time_en,
            most_common_breed=most_common_breed,
            peak_confidence_bracket=peak_confidence_bracket,
            peak_active_date=peak_active_date,
            peak_active_weekday_vi=peak_active_weekday_vi,
            peak_active_weekday_en=peak_active_weekday_en,
            duration_days=duration_days
        )
    except Exception as e:
        print(f"Error loading statistics: {e}")
        flash("Không thể tải thống kê. Vui lòng thử lại.", "error")
        return redirect(url_for("dashboard.dashboard"))
    finally:
        if conn:
            conn.close()


@stats_bp.route("/api/stats")
def api_stats():
    """API lấy thống kê"""
    user_id_any = session.get("user_id")
    if user_id_any is None:
        return jsonify({"error": "Not authenticated"}), 401
    conn = None
    try:
        conn = get_connection()
        user_id = int(user_id_any)
        stats = PredictionHistory.get_stats(conn, user_id)
        return jsonify(stats)
    except Exception as e:
        print(f"Error in API: {e}")
        return jsonify({"error": "Internal error"}), 500
    finally:
        if conn:
            conn.close()
