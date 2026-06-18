# scratch/test_req.py
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
from flask import session

def test_statistics_route(days):
    with app.test_client() as client:
        with client.session_transaction() as sess:
            sess['user_id'] = 4
            sess['username'] = 'user1'
            sess['fullname'] = 'NguyenHangLoi'
            sess['role'] = 'user'
            sess['is_admin'] = False
            
        print(f"--- Querying statistics page with days={days} ---")
        response = client.get(f'/statistics/?days={days}')
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("✓ HTML fetched successfully!")
            html = response.data.decode('utf-8')
            print(f"HTML length: {len(html)}")
            
            # Check if recent results are in HTML
            if "Kết quả gần đây" in html:
                print("✓ Found 'Kết quả gần đây' header")
            else:
                print("✗ 'Kết quả gần đây' header NOT found")
                
            # Check for the images rendering in recent predictions
            if "activity-thumb" in html:
                print("✓ Found activity-thumb images")
            else:
                print("✗ No activity-thumb images found")
                
            # Check for trend chart data-labels
            if "trendChart" in html:
                print("✓ Found trendChart canvas")
            else:
                print("✗ trendChart canvas NOT found")
        else:
            print(f"✗ Failed: {response.status_code}")

if __name__ == '__main__':
    test_statistics_route('30')
    test_statistics_route('7')
    test_statistics_route('0')
