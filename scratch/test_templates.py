import os
from jinja2 import Environment, FileSystemLoader

def main():
    templates_dir = r"d:\KhoaLuan - Copy (new) - Copy\templates"
    env = Environment(loader=FileSystemLoader(templates_dir))
    
    success = True
    for filename in os.listdir(templates_dir):
        if not filename.endswith('.html'):
            continue
        try:
            env.get_template(filename)
            print(f"OK: {filename}")
        except Exception as e:
            print(f"ERROR compiling {filename}: {e}")
            success = False
            
    if success:
        print("All templates compiled successfully!")
    else:
        print("Some templates have syntax errors!")

if __name__ == '__main__':
    main()
