import sys
import os

workspace_dir = r"d:\KhoaLuan - Copy (new) - Copy"
sys.path.insert(0, workspace_dir)

from app import app
from connect import get_connection
from models import PredictionHistory

with app.test_request_context():
    from flask import session
    # We will test loading history for user 'visualtest_admin' or first user in database
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, username, role FROM users LIMIT 1")
            user = cur.fetchone()
            if not user:
                print("No users found in database.")
                sys.exit(1)
            
            user_id, username, role = user
            print(f"Testing with user: {username} (ID: {user_id}, Role: {role})")
            session['user_id'] = user_id
            session['role'] = role
            
        # Call history view function
        from history import history
        # We can mock request arguments
        import flask
        with app.test_client() as client:
            # login session
            with client.session_transaction() as sess:
                sess['user_id'] = user_id
                sess['role'] = role
            
            response = client.get('/history/')
            print(f"Status Code: {response.status_code}")
            if response.status_code == 302:
                print(f"Redirected to: {response.headers.get('Location')}")
            elif response.status_code == 200:
                print("Successfully loaded history page!")
            else:
                print(f"Response data: {response.data[:500]}")
    except Exception as e:
        print("EXCEPTION OCCURRED:")
        import traceback
        traceback.print_exc()
    finally:
        conn.close()
