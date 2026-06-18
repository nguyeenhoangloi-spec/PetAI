# scratch/test_predict.py
import sys
import os

# Add parent dir to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import render_template
from app import app

def render_predict(ui_lang):
    result = {
        'breed': 'Nghi lai: Shiba x Pug',
        'breed_en': 'Crossbreed: Shiba x Pug',
        'breed_conf': 0.85,
        'parts_info': {
            'decision': {
                'is_hybrid_candidate': True,
                'hybrid_mode': 'strict',
                'reason': 'Ứng viên nghi lai.',
                'top1_score': 0.6,
                'top2_score': 0.55,
                'score_gap': 0.05,
                'top2_top1_ratio': 0.91,
                'effective_max_gap': 0.1,
                'top12_mean_score': 0.575,
            },
            'display': {
                'top3_mode': 'similarity',
                'top3_note': 'Top 3 theo tương đồng hình thái (similarity).'
            },
            'acceptance': {
                'accepted': False,
                'level': 'reference',
                'threshold': 0.70,
                'reference_threshold': 0.55
            },
            'similarity_top3': [
                {'breed': 'Chó Shiba', 'breed_en': 'Shiba', 'score': 0.6},
                {'breed': 'Chó Pug', 'breed_en': 'Pug', 'score': 0.55},
                {'breed': 'Chó Chihuahua', 'breed_en': 'Chihuahua', 'score': 0.3}
            ],
            'gradcam': {
                'items': [
                    {'label': 'Top-1(sim)', 'label_en': 'Top-1(sim)', 'breed': 'Chó Shiba', 'breed_en': 'Shiba', 'filename': 'Shiba.jpg'},
                    {'label': 'Top-2(sim)', 'label_en': 'Top-2(sim)', 'breed': 'Chó Pug', 'breed_en': 'Pug', 'filename': 'Pug.jpg'}
                ]
            },
            'gradcam_dynamic': {
                'items': []
            }
        },
        'note': 'Độ tin cậy CHÓ từ YOLO chỉ 65%. Kết quả giống dưới đây chỉ mang tính tham khảo.',
        'model_ready': True,
        'message': 'Success'
    }
    
    return render_template(
        'predict.html',
        image_path='static/uploads/test.jpg',
        result=result,
        yolo_species='Dog',
        yolo_species_conf=0.65,
        yolo_detections=[{'label': 'dog', 'conf': 0.65}],
        current_plan='free',
        ui_theme='light',
        ui_language=ui_lang
    )

if __name__ == '__main__':
    with app.test_request_context():
        # Test VI
        try:
            html_vi = render_predict('vi')
            print("✓ Predict template rendered successfully in Vietnamese!")
            print(f"  Vietnamese output length: {len(html_vi)} characters")
        except Exception as e:
            print("✗ Error rendering predict template (vi):", e)
            import traceback
            traceback.print_exc()
            sys.exit(1)
            
        # Test EN
        try:
            html_en = render_predict('en')
            print("✓ Predict template rendered successfully in English!")
            print(f"  English output length: {len(html_en)} characters")
        except Exception as e:
            print("✗ Error rendering predict template (en):", e)
            import traceback
            traceback.print_exc()
            sys.exit(1)
            
        print("All template compilation checks passed!")
