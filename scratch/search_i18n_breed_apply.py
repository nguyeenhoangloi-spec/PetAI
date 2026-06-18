# scratch/search_i18n_breed_apply.py
with open("static/js/i18n.js", "r", encoding="utf-8") as f:
    content = f.read()

import sys
idx = content.find("data-i18n-breed")
if idx != -1:
    snippet = content[idx-200:idx+800]
    sys.stdout.buffer.write(snippet.encode('utf-8'))
else:
    print("data-i18n-breed not found in js code")
