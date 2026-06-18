# scratch/test_settings.py
import sys
import os

# Add parent dir to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import render_template
from app import app

def test():
    settings = {
        'theme': 'light',
        'language': 'vi',
        'notifications': True,
        'email_notifications': False
    }
    return render_template(
        'settings.html',
        settings=settings,
        current_plan='free',
        ui_theme='light',
        ui_language='vi'
    )

if __name__ == '__main__':
    with app.test_request_context():
        try:
            html = test()
            print("✓ Settings template rendered successfully!")
            print(f"Rendered length: {len(html)} characters")
        except Exception as e:
            print("✗ Error rendering settings template:", e)
            import traceback
            traceback.print_exc()
            sys.exit(1)
