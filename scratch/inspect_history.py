# scratch/inspect_history.py
import sys
import os
import json

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from connect import get_connection

def inspect():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, user_id, breed, image_path, confidence, species FROM prediction_history LIMIT 100")
            rows = cur.fetchall()
            out = []
            for r in rows:
                out.append({
                    "id": r[0],
                    "user_id": r[1],
                    "breed": r[2],
                    "image_path": r[3],
                    "confidence": float(r[4]) if r[4] else 0.0,
                    "species": r[5]
                })
            
            with open("scratch/history_inspect.json", "w", encoding="utf-8") as f:
                json.dump(out, f, ensure_ascii=False, indent=2)
            print("Done writing to scratch/history_inspect.json")
    finally:
        conn.close()

if __name__ == '__main__':
    inspect()
