import sys
import os

workspace_dir = r"d:\KhoaLuan - Copy (new) - Copy"
sys.path.insert(0, workspace_dir)

from connect import get_connection
from models import PredictionHistory

conn = get_connection()
try:
    user_id = 1
    breed_type = 'all'
    search_query = ''
    
    print("1. Calling count_by_user...")
    total_records = PredictionHistory.count_by_user(conn, user_id, breed_type=breed_type, search_query=search_query)
    print(f"Total: {total_records}")
    
    print("2. Calling get_by_user...")
    predictions = PredictionHistory.get_by_user(conn, user_id, limit=30, offset=0, breed_type=breed_type, search_query=search_query)
    print(f"Fetched: {len(predictions)}")
    
    print("3. Calling count_by_user (all)...")
    total_records_all = PredictionHistory.count_by_user(conn, user_id)
    print(f"Total all: {total_records_all}")
    
    print("4. Calling count_by_user (pure)...")
    pure_count = PredictionHistory.count_by_user(conn, user_id, breed_type='pure')
    print(f"Pure: {pure_count}")
    
    print("5. Calling count_by_user (hybrid)...")
    hybrid_count = PredictionHistory.count_by_user(conn, user_id, breed_type='hybrid')
    print(f"Hybrid: {hybrid_count}")
    
    print("6. Calling get_stats...")
    stats_all = PredictionHistory.get_stats(conn, user_id)
    print(f"Stats: {stats_all}")

except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    conn.close()
