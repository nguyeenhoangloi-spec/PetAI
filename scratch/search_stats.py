# scratch/search_stats.py
import re

with open("templates/statistics.html", "r", encoding="utf-8") as f:
    content = f.read()

# Search for loop for predictions or recent results
matches = re.findall(r'\{%.*?for.*?%\}', content)
print("Loops in statistics.html:")
for m in matches:
    print(f"  {m}")

# Search for any breed variable display
variables = re.findall(r'\{\{\s*.*?(breed|pred|item).*?\}\}', content)
print("Variables matching breed/pred/item in statistics.html:")
print(variables)
