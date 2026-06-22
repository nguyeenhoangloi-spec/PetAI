import os

directory = 'd:/KhoaLuan - Copy (new) - Copy/templates'
for filename in os.listdir(directory):
    if filename.endswith('.html'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        
        # Replace the literal backslash-escaped quotes with normal quotes
        content = content.replace("{{ get_config(\\'site_name\\', \\'PetAI\\') }}", "{{ get_config('site_name', 'PetAI') }}")
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Fixed backslashes in {filename}')
