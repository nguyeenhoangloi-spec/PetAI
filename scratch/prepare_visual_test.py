# scratch/prepare_visual_test.py
import sys
import os
import datetime
from werkzeug.security import generate_password_hash

# Adjust path to import files correctly
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from connect import get_connection

def setup_visual_test_data():
    print("Connecting to DB to setup visual test user...")
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            # Delete visual test user if exists to start fresh
            cur.execute("DELETE FROM users WHERE username = 'verifier'")
            conn.commit()
            
            # Insert the visual test user
            pwd_hash = generate_password_hash('verifierpass')
            cur.execute(
                "INSERT INTO users (username, password_hash, email, fullname, role) "
                "VALUES ('verifier', %s, 'verifier@example.com', 'Visual Verifier', 'user')",
                (pwd_hash,)
            )
            conn.commit()
            
            # Fetch user ID
            cur.execute("SELECT id FROM users WHERE username = 'verifier'")
            user_id = cur.fetchone()[0]
            print(f"Created visual test user 'verifier' with ID: {user_id}")
            
            # Delete existing orders just in case
            cur.execute("DELETE FROM payment_orders WHERE user_id = %s", (user_id,))
            conn.commit()
            
            # Insert mock orders
            now = datetime.datetime.now()
            
            # Pending Order
            cur.execute(
                "INSERT INTO payment_orders (order_id, user_id, plan, payment_method, amount_vnd, status, created_at) "
                "VALUES ('ord001pending', %s, 'pro', 'qr', 5000, 'pending', %s)",
                (user_id, now - datetime.timedelta(minutes=10))
            )
            
            # Paid Order
            cur.execute(
                "INSERT INTO payment_orders (order_id, user_id, plan, payment_method, amount_vnd, status, created_at, confirmed_at) "
                "VALUES ('ord002paid', %s, 'pro', 'qr', 5000, 'paid', %s, %s)",
                (user_id, now - datetime.timedelta(minutes=8), now - datetime.timedelta(minutes=7))
            )
            
            # Cancelled Order
            cur.execute(
                "INSERT INTO payment_orders (order_id, user_id, plan, payment_method, amount_vnd, status, created_at) "
                "VALUES ('ord003cancel', %s, 'pro', 'qr', 5000, 'cancelled', %s)",
                (user_id, now - datetime.timedelta(minutes=6))
            )
            
            # Expired Order
            cur.execute(
                "INSERT INTO payment_orders (order_id, user_id, plan, payment_method, amount_vnd, status, created_at) "
                "VALUES ('ord004expire', %s, 'pro', 'qr', 5000, 'expired', %s)",
                (user_id, now - datetime.timedelta(minutes=5))
            )
            
            conn.commit()
            print("Successfully inserted 4 visual test orders:")
            print("  - ord001pending: pending")
            print("  - ord002paid: paid")
            print("  - ord003cancel: cancelled")
            print("  - ord004expire: expired")
            
    except Exception as e:
        print("Error setting up data:", e)
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    setup_visual_test_data()
