# scratch/test_stats_dash.py
import sys
import os
import datetime

# Add parent dir to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import render_template
from app import app

def render_statistics(ui_lang):
    stats = {
        'total_predictions': 42,
        'avg_confidence': 0.825,
        'top_breeds': [
            {'breed': 'Chó Chow Chow', 'count': 12},
            {'breed': 'Chó Bouvier des Flandres', 'count': 8},
            {'breed': 'Chó Phốc Hươu', 'count': 5},
            {'breed': 'Chó Clumber Spaniel', 'count': 3},
            {'breed': 'Nghi lai: Chó Yorkshire Terrier x Chó Norfolk Terrier', 'count': 2}
        ]
    }
    
    recent_predictions = [
        {
            'breed': 'Chó Chow Chow',
            'confidence': 0.91,
            'image_path': 'static/uploads/test1.jpg',
            'created_at': datetime.datetime.now()
        },
        {
            'breed': 'Chó Phốc Hươu',
            'confidence': 0.85,
            'image_path': 'static/uploads/test2.jpg',
            'created_at': datetime.datetime.now()
        }
    ]
    
    daily_counts = [
        {'date': '2026-06-12', 'count': 2},
        {'date': '2026-06-13', 'count': 5},
        {'date': '2026-06-14', 'count': 8},
        {'date': '2026-06-15', 'count': 10},
        {'date': '2026-06-16', 'count': 4},
        {'date': '2026-06-17', 'count': 7},
        {'date': '2026-06-18', 'count': 6}
    ]
    
    confidence_dist = [2, 5, 8, 12, 15]
    
    return render_template(
        'statistics.html',
        stats=stats,
        unique_breed_count=5,
        recent_predictions=recent_predictions,
        selected_days='7',
        daily_counts=daily_counts,
        confidence_dist=confidence_dist,
        ui_theme='dark',
        ui_language=ui_lang
    )

if __name__ == '__main__':
    with app.test_request_context():
        # Test Statistics VI
        try:
            html_vi = render_statistics('vi')
            print("✓ Statistics template rendered successfully in Vietnamese!")
            print(f"  Vietnamese output length: {len(html_vi)} characters")
        except Exception as e:
            print("✗ Error rendering statistics template (vi):", e)
            import traceback
            traceback.print_exc()
            sys.exit(1)
            
        # Test Statistics EN
        try:
            html_en = render_statistics('en')
            print("✓ Statistics template rendered successfully in English!")
            print(f"  English output length: {len(html_en)} characters")
        except Exception as e:
            print("✗ Error rendering statistics template (en):", e)
            import traceback
            traceback.print_exc()
            sys.exit(1)
            
        print("All template compilation checks passed!")
