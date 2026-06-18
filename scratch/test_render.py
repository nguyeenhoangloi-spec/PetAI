# scratch/test_render.py
import sys
import os

# Add parent dir to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import render_template
from app import app

def test():
    users = [
        {'id': 1, 'username': 'admin', 'fullname': 'Admin', 'email': 'admin@example.com', 'role': 'admin', 'is_active': True, 'created_at': None, 'plan': 'pro'}
    ]
    return render_template(
        'users.html',
        users=users,
        page=1,
        per_page=10,
        total_users=1,
        total_admins=1,
        total_active=1,
        total_locked=0,
        total_pages=1,
        start_index=1,
        end_index=1,
        ui_theme='light',
        ui_language='vi'
    )


if __name__ == '__main__':
    with app.test_request_context():
        html = test()
        print("--- Rendered Output ---")
        lines = html.split('\n')
        for i, line in enumerate(lines):
            if 'statTotal' in line or 'statAdmins' in line:
                start = max(0, i-2)
                end = min(len(lines), i+3)
                print(f"--- Around Line {i+1} ---")
                for j in range(start, end):
                    print(f"{j+1}: {lines[j].strip()}")




