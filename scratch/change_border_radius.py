# change_border_radius.py
import glob
import re
import os

def main():
    templates = glob.glob("templates/*.html")
    print(f"Found {len(templates)} templates.")
    
    # Regex to match the CSS rule: .rounded-custom { border-radius: ...; }
    # Handles multiline and singleline with optional whitespace/newlines
    css_pattern = re.compile(
        r'\.rounded-custom\s*\{\s*border-radius:[^;]+;\s*\}',
        re.IGNORECASE | re.MULTILINE
    )
    
    changed_count = 0
    for path in templates:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Remove the CSS rule for .rounded-custom
        new_content, css_removed = css_pattern.subn('', content)
        
        # Replace the class name rounded-custom with rounded-xl
        if "rounded-custom" in new_content:
            new_content = new_content.replace("rounded-custom", "rounded-xl")
            replaced_classes = True
        else:
            replaced_classes = False
            
        if css_removed > 0 or replaced_classes:
            with open(path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated {path}: removed {css_removed} CSS rule(s), replaced class names.")
            changed_count += 1
            
    print(f"Successfully synchronized {changed_count} files.")

if __name__ == "__main__":
    main()
