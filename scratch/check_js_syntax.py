# scratch/check_js_syntax.py
import re
import subprocess

with open(r'd:\KhoaLuan - Copy (new) - Copy\templates\user_detail.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract script content
matches = list(re.finditer(r'<script>(.*?)</script>', html, re.DOTALL))
if not matches:
    print("No script tags found!")
    exit(1)

# Get the last script tag (which contains our modal/buttons logic)
js_code = matches[-1].group(1)

print("Testing JS syntax with Node.js...")
try:
    # Run node to syntax check the JS code using VM module
    # vm.Script compiles the code and throws SyntaxError if invalid
    proc = subprocess.run(
        ['node', '-e', 'const vm = require("vm"); try { new vm.Script(process.argv[1]); console.log("✓ JS syntax is perfectly valid!"); } catch(e) { console.error(e); process.exit(1); }', js_code],
        capture_output=True,
        text=True
    )
    if proc.returncode == 0:
        print(proc.stdout.strip())
    else:
        print("✗ JS syntax error found:")
        print(proc.stderr.strip())
except Exception as e:
    print(f"Failed to run node: {e}")
