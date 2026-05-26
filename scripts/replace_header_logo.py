import re
from pathlib import Path

root = Path(r"c:\Users\User\Desktop\KhoaLuan - Copy (new) - Copy")
base = root / "templates" / "home.html"
text = base.read_text(encoding="utf-8")
logo_match = re.search(r"<img\s+[^>]*alt=\"PetAI New Logo\"[^>]*>", text)
if not logo_match:
    raise SystemExit("home logo img not found")
logo_img = logo_match.group(0)

pattern = re.compile(
    r"<span\s+class=\"text-lg font-semibold text-primary tracking-tight\"\s*>\s*PetAI\s*</span\s*>",
    flags=re.S,
)

updated = []
for path in (root / "templates").glob("*.html"):
    data = path.read_text(encoding="utf-8")
    if not pattern.search(data):
        continue
    newline = "\r\n" if "\r\n" in data else "\n"
    logo_nl = logo_img.replace("\n", "").strip()
    updated_data = pattern.sub(logo_nl, data)
    path.write_text(updated_data, encoding="utf-8", newline=newline)
    updated.append(path.name)

print("updated:", ", ".join(sorted(updated)) if updated else "(none)")
