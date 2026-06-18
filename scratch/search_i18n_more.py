# scratch/search_i18n_more.py
import re

with open("static/js/i18n.js", "r", encoding="utf-8") as f:
    content = f.read()

# Search for any string containing "data-i18n-"
matches = re.findall(r'data-i18n-\w+', content)
print(f"Unique data-i18n- attributes in i18n.js: {set(matches)}")

# Search for functions defined in PetAI_i18n or window
functions = re.findall(r'(\w+)\s*=\s*function|function\s+(\w+)', content)
print(f"Functions in i18n.js: {functions[:20]}")

# Let's search for "breed" in a case-insensitive way
breed_matches = re.findall(r'.{0,50}breed.{0,50}', content, re.IGNORECASE)
print(f"Found {len(breed_matches)} occurrences of 'breed':")
for b in breed_matches[:10]:
    print(f"  {b.strip()}")
