# scratch/view_translate_breed.py
with open("static/js/i18n.js", "r", encoding="utf-8") as f:
    content = f.read()

import re
# Find the start of function translateBreedViToEn
idx = content.find("function translateBreedViToEn")
if idx != -1:
    print(content[idx:idx+2500])
else:
    print("Function translateBreedViToEn not found")
