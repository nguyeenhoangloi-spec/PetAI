import os
import re

def main():
    templates_dir = r"d:\KhoaLuan - Copy (new) - Copy\templates"
    pattern = re.compile(r'(\{\{.*?\}\})')

    def repl(match):
        return match.group(1).replace(r"\'", "'")

    fixed_count = 0
    for filename in os.listdir(templates_dir):
        if not filename.endswith('.html'):
            continue
        
        filepath = os.path.join(templates_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if r"\'" in content:
            new_content = pattern.sub(repl, content)
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Fixed quotes in: {filename}")
                fixed_count += 1
            else:
                print(f"No match inside Jinja blocks for: {filename}")
        else:
            pass

    print(f"Successfully fixed {fixed_count} template files.")

if __name__ == '__main__':
    main()
