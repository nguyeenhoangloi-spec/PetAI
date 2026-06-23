# history.py
# Blueprint cho lịch sử nhận diện

import os
import math
from datetime import datetime, timedelta
from flask import Blueprint, render_template, session, redirect, url_for, flash, jsonify, request
from connect import get_connection
from models import PredictionHistory
from breed_names import to_common_vietnamese_breed_name

history_bp = Blueprint("history", __name__)


@history_bp.route("/")
def history():
    user_id_raw = session.get("user_id")
    if not user_id_raw:
        flash("Vui lòng đăng nhập để xem lịch sử.", "warning")
        return redirect(url_for("login.login"))
    conn = None
    try:
        conn = get_connection()
        user_id = int(user_id_raw)
        
        # 1. Extraction of search & filters
        breed_type = request.args.get('type', 'all')
        if breed_type not in ('all', 'pure', 'hybrid', 'high_conf', 'low_conf'):
            breed_type = 'all'
            
        search_query = request.args.get('q', '').strip()
        date_filter = request.args.get('date', 'all')
        if date_filter not in ('today', '7days', '30days', 'all'):
            date_filter = 'all'
            
        sort_by = request.args.get('sort', 'newest')
        if sort_by not in ('newest', 'oldest', 'conf_highest', 'conf_lowest'):
            sort_by = 'newest'
            
        # 2. Build SQL conditions for list querying
        query_conds = ["user_id = %s"]
        query_params = [user_id]
        
        if breed_type == "hybrid":
            query_conds.append("breed LIKE 'Nghi lai:%%'")
        elif breed_type == "pure":
            query_conds.append("breed NOT LIKE 'Nghi lai:%%'")
        elif breed_type == "high_conf":
            query_conds.append("confidence >= 0.8")
        elif breed_type == "low_conf":
            query_conds.append("confidence < 0.8")
            
        if search_query:
            query_conds.append("breed LIKE %s")
            query_params.append(f"%{search_query}%")
            
        if date_filter == "today":
            query_conds.append("created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)")
        elif date_filter == "7days":
            query_conds.append("created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)")
        elif date_filter == "30days":
            query_conds.append("created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)")
            
        where_clause = " AND ".join(query_conds)
        
        # Count total matching records for pagination
        with conn.cursor() as cur:
            cur.execute(f"SELECT COUNT(*) FROM prediction_history WHERE {where_clause}", tuple(query_params))
            total_records = cur.fetchone()[0] or 0
            
        # Phân trang
        page = request.args.get('page', 1, type=int)
        per_page = 10  # Show 10 per page in mockup
        offset = (page - 1) * per_page
        
        # Sắp xếp
        order_clause = "ORDER BY created_at DESC"
        if sort_by == "oldest":
            order_clause = "ORDER BY created_at ASC"
        elif sort_by == "conf_highest":
            order_clause = "ORDER BY confidence DESC"
        elif sort_by == "conf_lowest":
            order_clause = "ORDER BY confidence ASC"
            
        # Fetch actual matching predictions
        fetch_params = list(query_params)
        fetch_params.extend([per_page, offset])
        
        query = f"""
            SELECT id, image_path, breed, confidence, species, created_at
            FROM prediction_history
            WHERE {where_clause}
            {order_clause}
            LIMIT %s OFFSET %s
        """
        
        from i18n_server import translate_breed_vi_to_en
        with conn.cursor() as cur:
            cur.execute(query, tuple(fetch_params))
            rows = cur.fetchall() or []
            predictions = [{
                'id': row[0],
                'image_path': row[1],
                'breed': to_common_vietnamese_breed_name(row[2]),
                'breed_en': translate_breed_vi_to_en(to_common_vietnamese_breed_name(row[2])),
                'confidence': row[3],
                'species': row[4],
                'created_at': row[5]
            } for row in rows]
            
        # 3. Calculate overview metrics (card data)
        total_records_all = PredictionHistory.count_by_user(conn, user_id)
        pure_count = PredictionHistory.count_by_user(conn, user_id, breed_type='pure')
        hybrid_count = PredictionHistory.count_by_user(conn, user_id, breed_type='hybrid')
        
        stats_all = PredictionHistory.get_stats(conn, user_id)
        avg_conf = stats_all.get('avg_confidence', 0.0) * 100
        
        # Helper to get counts in a specific range for actual database calculations
        def get_count_in_range(start_date, end_date, b_type=None):
            with conn.cursor() as c_cur:
                sql = "SELECT COUNT(*) FROM prediction_history WHERE user_id = %s AND created_at >= %s AND created_at < %s"
                p_params = [user_id, start_date, end_date]
                if b_type == "hybrid":
                    sql += " AND breed LIKE 'Nghi lai:%%'"
                elif b_type == "pure":
                    sql += " AND breed NOT LIKE 'Nghi lai:%%'"
                c_cur.execute(sql, tuple(p_params))
                return c_cur.fetchone()[0] or 0
                
        def get_avg_conf_in_range(start_date, end_date):
            with conn.cursor() as c_cur:
                sql = "SELECT AVG(confidence) FROM prediction_history WHERE user_id = %s AND created_at >= %s AND created_at < %s AND confidence IS NOT NULL"
                c_cur.execute(sql, (user_id, start_date, end_date))
                return c_cur.fetchone()[0] or 0.0
                
        # Time boundaries for trends
        now = datetime.now()
        seven_days_ago = now - timedelta(days=7)
        fourteen_days_ago = now - timedelta(days=14)
        
        # Trend 1: Total scans
        t_cur = get_count_in_range(seven_days_ago, now)
        t_prev = get_count_in_range(fourteen_days_ago, seven_days_ago)
        t_val = round(((t_cur - t_prev) / t_prev * 100), 1) if t_prev > 0 else (100.0 if t_cur > 0 else 0.0)
        t_trend = {"val": t_val, "up": t_val >= 0, "has_data": t_cur > 0 or t_prev > 0}
        
        # Trend 2: Purebred
        p_cur = get_count_in_range(seven_days_ago, now, "pure")
        p_prev = get_count_in_range(fourteen_days_ago, seven_days_ago, "pure")
        p_val = round(((p_cur - p_prev) / p_prev * 100), 1) if p_prev > 0 else (100.0 if p_cur > 0 else 0.0)
        p_trend = {"val": p_val, "up": p_val >= 0, "has_data": p_cur > 0 or p_prev > 0}
        
        # Trend 3: Hybrid
        h_cur = get_count_in_range(seven_days_ago, now, "hybrid")
        h_prev = get_count_in_range(fourteen_days_ago, seven_days_ago, "hybrid")
        h_val = round(((h_cur - h_prev) / h_prev * 100), 1) if h_prev > 0 else (100.0 if h_cur > 0 else 0.0)
        h_trend = {"val": h_val, "up": h_val >= 0, "has_data": h_cur > 0 or h_prev > 0}
        
        # Trend 4: Average Confidence
        c_cur = get_avg_conf_in_range(seven_days_ago, now) * 100
        c_prev = get_avg_conf_in_range(fourteen_days_ago, seven_days_ago) * 100
        c_val = round(c_cur - c_prev, 1)
        c_trend = {"val": c_val, "up": c_val >= 0, "has_data": c_cur > 0 or c_prev > 0}
        
        total_pages = math.ceil(total_records / per_page) if total_records > 0 else 1
        
        return render_template("history.html", 
                             predictions=predictions,
                             page=page,
                             total_pages=total_pages,
                             total_records=total_records,
                             selected_type=breed_type,
                             search_query=search_query,
                             date_filter=date_filter,
                             sort_by=sort_by,
                             total_records_all=total_records_all,
                             pure_count=pure_count,
                             hybrid_count=hybrid_count,
                             avg_conf=avg_conf,
                             t_trend=t_trend,
                             p_trend=p_trend,
                             h_trend=h_trend,
                             c_trend=c_trend)
    except Exception as e:
        print(f"Error loading history: {e}")
        flash("Không thể tải lịch sử. Vui lòng thử lại.", "error")
        return redirect(url_for("dashboard.dashboard"))
    finally:
        if conn:
            conn.close()


@history_bp.route("/delete/<int:pred_id>", methods=["POST"])
def delete_prediction(pred_id):
    """Xóa một bản ghi lịch sử nhận diện cụ thể"""
    user_id_raw = session.get("user_id")
    if not user_id_raw:
        return jsonify({"success": False, "message": "Unauthorized"}), 401
        
    conn = None
    try:
        conn = get_connection()
        user_id = int(user_id_raw)
        
        # Lấy image path để xóa file ảnh trên server
        image_path = None
        with conn.cursor() as cur:
            cur.execute("SELECT image_path FROM prediction_history WHERE id = %s AND user_id = %s", (pred_id, user_id))
            row = cur.fetchone()
            if row:
                image_path = row[0]
                
        if not image_path:
            return jsonify({"success": False, "message": "Bản ghi không tồn tại hoặc không thuộc quyền sở hữu của bạn."}), 404
            
        # Xóa khỏi database
        with conn.cursor() as cur:
            cur.execute("DELETE FROM prediction_history WHERE id = %s AND user_id = %s", (pred_id, user_id))
        conn.commit()
        
        # Xóa file ảnh trên server
        if image_path:
            try:
                upload_root = os.path.abspath(os.path.join(os.getcwd(), "static", "uploads"))
                abs_path = os.path.abspath(os.path.join(os.getcwd(), image_path)) if not os.path.isabs(image_path) else os.path.abspath(image_path)
                if abs_path.startswith(upload_root) and os.path.exists(abs_path):
                    os.remove(abs_path)
            except Exception as fe:
                print(f"Error deleting image file {image_path}: {fe}")
                
        return jsonify({"success": True, "message": "Xóa thành công."})
    except Exception as e:
        print(f"Error in delete_prediction: {e}")
        return jsonify({"success": False, "message": "Lỗi hệ thống. Vui lòng thử lại."}), 500
    finally:
        if conn:
            conn.close()


@history_bp.route("/api/recent")
def api_recent():
    """API lấy lịch sử gần đây"""
    user_id_raw = session.get("user_id")
    if not user_id_raw:
        return jsonify({"error": "Not authenticated"}), 401
    conn = None
    try:
        conn = get_connection()
        user_id = int(user_id_raw)
        limit = min(int(request.args.get('limit', 10)), 100)  # cap at 100
        predictions = PredictionHistory.get_by_user(conn, user_id, limit=limit)
        
        for p in predictions:
            if p.get('created_at'):
                p['created_at'] = p['created_at'].isoformat()
        
        return jsonify({"predictions": predictions})
    except Exception as e:
        print(f"Error in API: {e}")
        return jsonify({"error": "Internal error"}), 500
    finally:
        if conn:
            conn.close()
