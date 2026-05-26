from pathlib import Path

root = Path(r"c:\Users\User\Desktop\KhoaLuan - Copy (new) - Copy\templates")
old = "pt-8 pb-5"
new = "pt-6 pb-4"

updated = []
for path in root.glob("*.html"):
    data = path.read_text(encoding="utf-8")
    if old in data:
        path.write_text(data.replace(old, new), encoding="utf-8")
        updated.append(path.name)

print("updated:", ", ".join(sorted(updated)) if updated else "(none)")
