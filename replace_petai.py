import os
import re

directory = 'd:/KhoaLuan - Copy (new) - Copy/templates'
for filename in os.listdir(directory):
    if filename.endswith('.html'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        
        # We find all occurrences of PetAI
        # but avoid replacing them if they are part of:
        # window.PetAI
        # PetAI_
        # 'PetAI' or "PetAI" (which is mostly used inside get_config or JSON)
        
        # Regex explanation:
        # (?<!window\.)     : not preceded by window.
        # (?<![\'\"])       : not preceded by ' or "
        # \bPetAI\b         : the word PetAI
        # (?![_\'\"])       : not followed by _, ', or "
        
        new_content = re.sub(r"(?<!window\.)(?<!['\"])\bPetAI\b(?![_'\"])", r"{{ get_config('site_name', 'PetAI') }}", content)
        
        if new_content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Updated {filename}')
