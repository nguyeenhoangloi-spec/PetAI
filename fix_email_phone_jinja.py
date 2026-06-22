import os
import re

filepath = 'd:/KhoaLuan - Copy (new) - Copy/templates/system_config.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# I will use regex because exact quoting may vary
# Match: {{ configs.get('site_email', '{{ get_config('site_email', 'support@pet.ai') }}') }}
content = re.sub(
    r"\{\{\s*configs\.get\('site_email',\s*['\"]\{\{\s*get_config\('site_email',\s*'support@pet\.ai'\)\s*\}\}['\"]\)\s*\}\}",
    "{{ configs.get('site_email', 'support@pet.ai') }}",
    content
)

# And for contact_phone:
content = re.sub(
    r"\{\{\s*configs\.get\('contact_phone',\s*['\"]\{\{\s*get_config\('contact_phone',\s*'0916 416 409'\)\s*\}\}['\"]\)\s*\}\}",
    "{{ configs.get('contact_phone', '0916 416 409') }}",
    content
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed system_config.html')
