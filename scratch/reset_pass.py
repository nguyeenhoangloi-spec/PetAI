import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from werkzeug.security import generate_password_hash
import connect

conn = connect.get_connection()
try:
    with conn.cursor() as cur:
        pwd_hash = generate_password_hash("password123")
        cur.execute("UPDATE users SET password_hash=%s WHERE username='visualtest_admin'", (pwd_hash,))
        conn.commit()
        print("Successfully updated password of visualtest_admin to 'password123'")
except Exception as e:
    conn.rollback()
    print("Failed to update password:", e)
finally:
    conn.close()
