# scratch/gen_mapping.py
import sys
import os
import json

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import breed_names

mapping = {}
for en, vi in breed_names._COMMON_VI_NAMES.items():
    mapping[vi] = en
    # Also add standard variations to catch both styles
    if not vi.startswith(('Chó', 'Ngao', 'Béc', 'Phốc')):
        mapping[f'Chó {vi}'] = en
        
# Include standard default translation
mapping["Không xác định"] = "Not determined"
mapping["Chưa xác định"] = "Not determined"

# Write JS file chunk
js_content = "  var VI_TO_EN_BREEDS = " + json.dumps(mapping, ensure_ascii=False, indent=4) + ";\n"

# Output file path
output_path = os.path.join(os.path.dirname(__file__), "breed_mapping.js")
with open(output_path, "w", encoding="utf-8") as f:
    f.write(js_content)
print(f"✓ Generated breed mapping and wrote to {output_path}")
