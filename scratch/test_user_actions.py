# scratch/test_user_actions.py
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
from flask import session

def test_lock_user():
    with app.test_client() as client:
        # 1. Access user list to initialize session and csrf token
        with client.session_transaction() as sess:
            sess['user_id'] = 1  # Admin user
            sess['username'] = 'admin'
            sess['role'] = 'admin'
            sess['is_admin'] = True

        res = client.get('/users/1')
        print(f"Detail Page Status: {res.status_code}")
        
        # Extract CSRF token from session
        with client.session_transaction() as sess:
            csrf_token = sess.get('_csrf_token')
            print(f"Session CSRF token: {csrf_token}")

        # Try to lock user 13
        print("--- Locking user 13 ---")
        headers = {'X-CSRF-Token': csrf_token}
        res_lock = client.post('/users/lock/13', headers=headers)
        print(f"Lock Response status: {res_lock.status_code}")
        print(f"Lock Response data: {res_lock.get_data(as_text=True)}")

        # Try to unlock user 13
        print("--- Unlocking user 13 ---")
        res_unlock = client.post('/users/unlock/13', headers=headers)
        print(f"Unlock Response status: {res_unlock.status_code}")
        print(f"Unlock Response data: {res_unlock.get_data(as_text=True)}")

        # Try to delete user 13
        print("--- Deleting user 13 with confirm='danhvt388' ---")
        import json
        res_delete = client.post(
            '/users/delete/13',
            headers=headers,
            data=json.dumps({'confirm': 'danhvt388'}),
            content_type='application/json'
        )
        print(f"Delete Response status: {res_delete.status_code}")
        print(f"Delete Response data: {res_delete.get_data(as_text=True)}")

if __name__ == '__main__':
    test_lock_user()
