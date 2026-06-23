import os
from flask import Flask, render_template

template_dir = "d:/KhoaLuan - Copy (new) - Copy/templates"
app = Flask(__name__, template_folder=template_dir)
app.secret_key = 'secret'

def mock_url_for(endpoint, **values):
    return f"/{endpoint}"

@app.context_processor
def inject_globals():
    return dict(
        csrf_token=lambda: "dummy_csrf_token",
        get_config=lambda k, d="": d,
        ui_theme="dark",
        ui_language="vi",
        session={},
        url_for=mock_url_for
    )

@app.route('/')
def test():
    result = {
        "image_path": "uploads/test.jpg",
        "species": "Dog",
        "breed": "Chihuahua",
        "breed_en": "Chihuahua",
        "breed_conf": 0.962,
        "parts_info": {
            "top5": [
                {"breed": "Chihuahua", "breed_en": "Chihuahua", "score": 0.962},
                {"breed": "Papillon", "breed_en": "Papillon", "score": 0.808}
            ],
            "similarity_top3": [
                {"breed": "Chihuahua", "breed_en": "Chihuahua", "score": 0.962},
                {"breed": "Papillon", "breed_en": "Papillon", "score": 0.808}
            ],
            "decision": {
                "is_hybrid_candidate": True
            }
        },
        "model_ready": True,
        "message": "Thành công"
    }
    return render_template(
        "predict.html",
        image_path="uploads/test.jpg",
        result=result,
        yolo_species="Dog",
        yolo_species_conf=0.962,
        yolo_detections=[{"label": "dog", "conf": 0.962, "bbox": [100, 100, 400, 400]}],
        show_notification=False,
        ui_theme="dark",
        ui_language="vi",
        top3_mode="similarity"
    )

if __name__ == '__main__':
    with app.test_request_context('/'):
        try:
            rendered = test()
            print("Render successful! Length:", len(rendered))
            idx = rendered.find('predict-data-bridge')
            if idx != -1:
                print("Data bridge HTML:")
                print(rendered[idx:idx+800])
            else:
                print("predict-data-bridge not found!")
        except Exception as e:
            import traceback
            traceback.print_exc()
