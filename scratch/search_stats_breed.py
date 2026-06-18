# scratch/search_stats_breed.py
import sys

with open("templates/statistics.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "breed" in line.lower() or "i18n-breed" in line.lower():
        sys.stdout.buffer.write(f"Line {i+1}: {line.strip()}\n".encode('utf-8'))
