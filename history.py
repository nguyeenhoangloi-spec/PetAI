# history.py
# Blueprint cho lịch sử nhận diện

from flask import Blueprint, render_template, session, redirect, url_for, flash, jsonify, request
from connect import get_connection
from models import PredictionHistory

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
        
        # Bộ lọc loại giống: all, pure, hybrid
        breed_type = request.args.get('type', 'all')
        if breed_type not in ('all', 'pure', 'hybrid'):
            breed_type = 'all'
            
        # Tìm kiếm theo tên giống chó
        search_query = request.args.get('q', '').strip()
            
        # Phân trang
        page = request.args.get('page', 1, type=int)
        per_page = 30
        offset = (page - 1) * per_page
        
        total_records = PredictionHistory.count_by_user(conn, user_id, breed_type=breed_type, search_query=search_query)
        predictions = PredictionHistory.get_by_user(conn, user_id, limit=per_page, offset=offset, breed_type=breed_type, search_query=search_query)
        
        total_records_all = PredictionHistory.count_by_user(conn, user_id)
        pure_count = PredictionHistory.count_by_user(conn, user_id, breed_type='pure')
        hybrid_count = PredictionHistory.count_by_user(conn, user_id, breed_type='hybrid')
        stats_all = PredictionHistory.get_stats(conn, user_id)
        avg_conf = stats_all.get('avg_confidence', 0.0) * 100
        
        import math
        total_pages = math.ceil(total_records / per_page) if total_records > 0 else 1
        
        return render_template("history.html", 
                             predictions=predictions,
                             page=page,
                             total_pages=total_pages,
                             total_records=total_records,
                             selected_type=breed_type,
                             search_query=search_query,
                             total_records_all=total_records_all,
                             pure_count=pure_count,
                             hybrid_count=hybrid_count,
                             avg_conf=avg_conf)
    except Exception as e:
        print(f"Error loading history: {e}")
        flash("Không thể tải lịch sử. Vui lòng thử lại.", "error")
        return redirect(url_for("dashboard.dashboard"))
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
