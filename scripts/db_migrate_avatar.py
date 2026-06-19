# scripts/db_migrate_avatar.py
# Safely add the avatar_url column to the users table if it does not already exist.

import os
import sys

# Ensure root directory is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from connect import get_connection

def run_migration():
    print("Connecting to database...")
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            # Check if avatar_url column already exists
            cur.execute("SHOW COLUMNS FROM users LIKE 'avatar_url'")
            result = cur.fetchone()
            
            if result:
                print("Column 'avatar_url' already exists in the 'users' table. Skipping migration.")
            else:
                print("Adding column 'avatar_url' to the 'users' table...")
                cur.execute("ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500) DEFAULT NULL")
                conn.commit()
                print("Successfully added column 'avatar_url' to the 'users' table!")
    except Exception as e:
        print(f"Error during migration: {e}")
        conn.rollback()
        raise e
    finally:
        conn.close()
        print("Database connection closed.")

if __name__ == "__main__":
    run_migration()
