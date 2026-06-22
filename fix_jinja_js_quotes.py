import os

directory = 'd:/KhoaLuan - Copy (new) - Copy/templates'
for filename in os.listdir(directory):
    if filename.endswith('.html'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        
        # Replace the literal backslash-escaped quotes with double quotes inside get_config
        content = content.replace("get_config(\\'site_email\\', \\'support@pet.ai\\')", 'get_config("site_email", "support@pet.ai")')
        content = content.replace("get_config(\\'contact_phone\\', \\'0916 416 409\\')", 'get_config("contact_phone", "0916 416 409")')
        content = content.replace("get_config(\\'site_name\\', \\'PetAI\\')", 'get_config("site_name", "PetAI")')
        
        # Also clean up the ones without backslashes but single quotes that might be breaking JS
        # Wait, if they use single quotes, let's replace all of them to double quotes in JS files
        # Actually just fixing the backslash ones is enough to fix Jinja errors
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Fixed backslash escaping in {filename}')
