# scratch/search_i18n_exports.py
with open("static/js/i18n.js", "r", encoding="utf-8") as f:
    content = f.read()

import sys
idx = content.find("window.PetAI_i18n =")
if idx != -1:
    snippet = content[idx:idx+1500]
    sys.stdout.buffer.write(snippet.encode('utf-8'))
else:
    print("window.PetAI_i18n = not found in js code")
