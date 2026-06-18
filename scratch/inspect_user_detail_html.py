# scratch/inspect_user_detail_html.py
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app

def inspect():
    with app.test_client() as client:
        with client.session_transaction() as sess:
            sess['user_id'] = 31
            sess['username'] = 'testuser123'
            sess['role'] = 'admin'
            sess['is_admin'] = True

        res = client.get('/users/2')
        html = res.get_data(as_text=True)
        
        # Print the buttons
        print("--- Buttons HTML ---")
        for line in html.splitlines():
            if 'toggleUserBtn' in line or 'deleteUserBtn' in line:
                print(line)
                
        # Print lines 700 to 850 of the rendered HTML
        print("\n--- Rendered Lines 700-850 ---")
        lines = html.splitlines()
        for idx, line in enumerate(lines[680:837]):
            print(f"{idx+681}: {line}")

if __name__ == '__main__':
    inspect()
