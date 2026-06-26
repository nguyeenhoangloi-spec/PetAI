# -*- coding: utf-8 -*-
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('templates/upgrade.html.bak', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# Tim tat ca cac the style
styles = list(re.finditer(r'<style>', text))
end_styles = list(re.finditer(r'</style>', text))

print(f"Number of <style> tags: {len(styles)}")
print(f"Number of </style> tags: {len(end_styles)}")

for idx, m in enumerate(styles):
    print(f"Style {idx+1} starts at: {m.start()}")
for idx, m in enumerate(end_styles):
    print(f"End Style {idx+1} starts at: {m.start()}")
