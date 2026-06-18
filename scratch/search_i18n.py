# scratch/search_i18n.py
import re

with open("static/js/i18n.js", "r", encoding="utf-8") as f:
    content = f.read()

print(f"File size: {len(content)} chars")

# Find occurrences of 'data-i18n'
matches = re.findall(r'.{0,50}data-i18n.{0,50}', content)
print(f"Found {len(matches)} occurrences of 'data-i18n':")
for m in matches[:10]:
    print(f"  {m.strip()}")
