# scratch/test_user_actions_v2.py
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
from flask import session

def test_lock_user():
    with app.test_client() as client:
        # 1. Access user list to initialize session and csrf token
        with client.session_transaction() as sess:
            sess['user_id'] = 31  # Admin user (testuser123)
            sess['username'] = 'testuser123'
            sess['role'] = 'admin'
            sess['is_admin'] = True

        res = client.get('/users/2')
        print(f"Detail Page Status: {res.status_code}")
        
        # Extract CSRF token from session
        with client.session_transaction() as sess:
            csrf_token = sess.get('_csrf_token')
            print(f"Session CSRF token: {csrf_token}")

        # Try to lock user 2
        print("--- Locking user 2 ---")
        headers = {'X-CSRF-Token': csrf_token}
        res_lock = client.post('/users/lock/2', headers=headers)
        print(f"Lock Response status: {res_lock.status_code}")
        print(f"Lock Response data: {res_lock.get_data(as_text=True)}")

        # Try to unlock user 2
        print("--- Unlocking user 2 ---")
        res_unlock = client.post('/users/unlock/2', headers=headers)
        print(f"Unlock Response status: {res_unlock.status_code}")
        print(f"Unlock Response data: {res_unlock.get_data(as_text=True)}")

if __name__ == '__main__':
    test_lock_user()
