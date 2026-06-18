# scratch/inspect_db.py
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from connect import get_connection

def inspect():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            # List users
            cur.execute("SELECT id, username, email, role, is_active FROM users")
            users = cur.fetchall()
            print("--- USERS ---")
            for u in users:
                user_id = u[0]
                username = u[1]
                email = u[2]
                role = u[3]
                is_active = u[4]
                
                # Check history
                cur.execute("SELECT COUNT(*) FROM prediction_history WHERE user_id = %s", (user_id,))
                hist_count = cur.fetchone()[0]
                
                # Check payments
                cur.execute("SELECT COUNT(*) FROM payment_orders WHERE user_id = %s", (user_id,))
                pay_count = cur.fetchone()[0]
                
                print(f"ID: {user_id} | Username: {username} | Email: {email} | Role: {role} | Active: {is_active} | History: {hist_count} | Payments: {pay_count}")
    finally:
        conn.close()

if __name__ == '__main__':
    inspect()
