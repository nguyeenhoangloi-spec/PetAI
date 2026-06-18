# scratch/test_history_render.py
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app

def test_history():
    with app.test_client() as client:
        with client.session_transaction() as sess:
            sess['user_id'] = 5  # User 5 who has history entries
            sess['username'] = 'loicon0709'
            sess['role'] = 'user'
            sess['is_admin'] = False

        res = client.get('/history/')
        print(f"History Page Status: {res.status_code}")
        if res.status_code == 200:
            html = res.get_data(as_text=True)
            print(f"Fetched HTML length: {len(html)}")
            
            # Look for onclick calls
            import re
            onclicks = re.findall(r'onclick="openDetailModal\([^)]*\)"', html)
            print(f"Found {len(onclicks)} openDetailModal onclick calls:")
            for o in onclicks[:5]:
                print(f"  {o}")
        else:
            print(f"Failed to fetch: {res.status_code}")

if __name__ == '__main__':
    test_history()
