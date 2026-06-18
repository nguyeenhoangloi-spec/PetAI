# scratch/reset_admin_password.py
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from connect import get_connection
from werkzeug.security import generate_password_hash

def reset():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            pwd_hash = generate_password_hash("password123")
            # Set testuser123 (id 31) password to password123 and ensure they are active and admin
            cur.execute(
                "UPDATE users SET password_hash = %s, role = 'admin', is_active = 1 WHERE id = 31",
                (pwd_hash,)
            )
            conn.commit()
            print("✓ Reset testuser123's password to password123 successfully!")
    finally:
        conn.close()

if __name__ == '__main__':
    reset()
