import re
from pathlib import Path

root = Path(r"c:\Users\User\Desktop\KhoaLuan - Copy (new) - Copy")
base = root / "templates" / "home.html"
text = base.read_text(encoding="utf-8")
match = re.search(r"<footer\b.*?</footer>", text, flags=re.S)
if not match:
    raise SystemExit("footer not found in home.html")
footer = match.group(0)

paths = list((root / "templates").glob("*.html"))
checked = []
missing = []
diff = []
for path in paths:
    data = path.read_text(encoding="utf-8")
    m = re.search(r"<footer\b.*?</footer>", data, flags=re.S)
    if not m:
        missing.append(path.name)
        continue
    checked.append(path.name)
    if m.group(0) != footer:
        diff.append(path.name)

print("checked:", ", ".join(sorted(checked)))
print("missing:", ", ".join(sorted(missing)) if missing else "(none)")
print("different:", ", ".join(sorted(diff)) if diff else "(none)")
