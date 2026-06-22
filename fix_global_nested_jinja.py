import os
import re

directory = 'd:/KhoaLuan - Copy (new) - Copy/templates'
for filename in os.listdir(directory):
    if filename.endswith('.html'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        
        # Match site_email nested
        content = re.sub(
            r"\{\{\s*get_config\('site_email',\s*['\"]\{\{\s*get_config\('site_email',\s*'support@pet\.ai'\)\s*\}\}['\"]\)\s*\}\}",
            "{{ get_config('site_email', 'support@pet.ai') }}",
            content
        )
        
        # Match contact_phone nested
        content = re.sub(
            r"\{\{\s*get_config\('contact_phone',\s*['\"]\{\{\s*get_config\('contact_phone',\s*'0916 416 409'\)\s*\}\}['\"]\)\s*\}\}",
            "{{ get_config('contact_phone', '0916 416 409') }}",
            content
        )
        
        # If it was configs.get instead of get_config
        content = re.sub(
            r"\{\{\s*configs\.get\('site_email',\s*['\"]\{\{\s*get_config\('site_email',\s*'support@pet\.ai'\)\s*\}\}['\"]\)\s*\}\}",
            "{{ configs.get('site_email', 'support@pet.ai') }}",
            content
        )
        content = re.sub(
            r"\{\{\s*configs\.get\('contact_phone',\s*['\"]\{\{\s*get_config\('contact_phone',\s*'0916 416 409'\)\s*\}\}['\"]\)\s*\}\}",
            "{{ configs.get('contact_phone', '0916 416 409') }}",
            content
        )

        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Fixed nested emails/phones in {filename}')
