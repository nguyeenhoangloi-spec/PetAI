# scratch/check_html.py
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app
from connect import get_connection

def check_html():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, username FROM users WHERE username = 'verifier'")
            row = cur.fetchone()
            if not row:
                print("User verifier not found")
                return
            user_id, username = row[0], row[1]
    finally:
        conn.close()

    app.config["WTF_CSRF_ENABLED"] = False
    app.config["TESTING"] = True
    client = app.test_client()

    with client.session_transaction() as sess:
        sess['user_id'] = user_id
        sess['username'] = username
        sess['role'] = 'user'

    res = client.get("/predict/payments")
    html = res.data.decode('utf-8')
    
    # Let's extract and print the table rows
    print("--- RENDERED BUTTONS IN TABLE ---")
    import re
    rows = re.findall(r'<tr[^>]*data-order-id="([^"]+)"[^>]*>.*?</tr>', html, re.DOTALL)
    for r in rows:
        order_id = r
        # find status, data-action-cell content
        order_html = re.search(rf'data-order-id="{order_id}".*?</tr>', html, re.DOTALL).group(0)
        action_cell = re.search(r'<td[^>]*data-action-cell[^>]*>(.*?)</td>', order_html, re.DOTALL)
        status = re.search(r'data-status="([^"]+)"', order_html)
        
        status_val = status.group(1) if status else "unknown"
        action_val = action_cell.group(1).strip() if action_cell else "none"
        
        print(f"Order: {order_id} | Status: {status_val}")
        print(f"Action HTML:\n{action_val}\n")

if __name__ == "__main__":
    check_html()
