# scratch/test_escape.py
import sys
import os

from flask import Flask, render_template_string

app = Flask(__name__)

def test():
    daily_counts = [
        {'date': '17/06', 'count': 4},
        {'date': '18/06', 'count': 6}
    ]
    dates = [d['date'] for d in daily_counts]
    
    template = """
    Option 1 (tojson):
    data-labels="{{ dates | tojson }}"
    
    Option 2 (tojson | safe):
    data-labels="{{ dates | tojson | safe }}"
    
    Option 3 (tojson | forceescape):
    data-labels="{{ dates | tojson | forceescape }}"

    Option 4 (tojson | forceescape | safe):
    data-labels="{{ dates | tojson | forceescape | safe }}"

    Option 5 (single quotes around attribute):
    data-labels='{{ dates | tojson }}'
    """
    
    return render_template_string(template, dates=dates)

if __name__ == '__main__':
    with app.test_request_context():
        print(test())
