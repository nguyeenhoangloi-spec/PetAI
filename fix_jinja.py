import os
import re

directory = 'd:/KhoaLuan - Copy (new) - Copy/templates'

for filename in os.listdir(directory):
    if filename.endswith('.html'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        
        # We need to fix the invalid syntax:
        # 'Something - {{ get_config(\'site_name\', \'PetAI\') }}' -> 'Something - ' ~ get_config('site_name', 'PetAI')
        
        # Also let's just find anything like:
        # {{ get_config(\'site_name\', \'PetAI\') }} inside a jinja set string block.
        # But actually, the exact string is known:
        
        # ' - {{ get_config(\'site_name\', \'PetAI\') }}'
        # we can replace it with:
        # ' ~ get_config('site_name', 'PetAI')
        
        content = content.replace(" - {{ get_config('site_name', 'PetAI') }}'", " - ' ~ get_config('site_name', 'PetAI')")
        # if there are cases like " - {{ get_config(\'site_name\', \'PetAI\') }}" 
        content = content.replace(" - {{ get_config(\\'site_name\\', \\'PetAI\\') }}'", " - ' ~ get_config('site_name', 'PetAI')")
        
        # also for user_detail.html:
        # ' - {{ get_config(\'site_name\', \'PetAI\') }}' -> ' - ' ~ get_config('site_name', 'PetAI')
        # Wait, the string was:
        # 'Admin User #' ~ user.id ~ ' - {{ get_config(\\'site_name\\', \\'PetAI\\') }}'
        # Let's just do a generic regex replace for strings inside {% set ... %}
        
        def fix_set_block(match):
            block = match.group(0)
            # inside block, if we see ' ... {{ get_config(\'site_name\', \'PetAI\') }}'
            # we should replace with ' ... ' ~ get_config('site_name', 'PetAI')
            # Handle standard single quotes
            block = re.sub(r"{{ get_config\(([^}]+)\) }}'", r"' ~ get_config(\1)", block)
            # Handle escaped single quotes inside the string, but actually it's easier to just fix the ones we saw manually.
            return block

        content = re.sub(r'{%\s*set\s+page_title.*?%}', fix_set_block, content)
        
        # Manual replacements for the known broken lines:
        content = content.replace(" - {{ get_config(\\'site_name\\', \\'PetAI\\') }}'", " - ' ~ get_config('site_name', 'PetAI')")
        content = content.replace(" - {{ get_config('site_name', 'PetAI') }}'", " - ' ~ get_config('site_name', 'PetAI')")
        
        # Wait, what about payment-policy and privacy-policy ?
        # They were skipped in the previous script!
        # {% set page_title = 'Payment Policy | PetAI' ... %}
        content = content.replace(" | PetAI'", " | ' ~ get_config('site_name', 'PetAI')")
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Fixed {filename}')
