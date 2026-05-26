import re
from pathlib import Path

root = Path(r"c:\Users\User\Desktop\KhoaLuan - Copy (new) - Copy\templates")
nav_re = re.compile(r"<nav\b[\s\S]*?</nav>", re.I)

with_logo = []
with_text = []
no_nav = []

for path in root.glob("*.html"):
    text = path.read_text(encoding="utf-8")
    m = nav_re.search(text)
    if not m:
        no_nav.append(path.name)
        continue
    nav = m.group(0)
    if "PetAI New Logo" in nav:
        with_logo.append(path.name)
    if ">PetAI</span" in nav or "PetAI</span" in nav:
        with_text.append(path.name)

print("nav_with_logo:", ", ".join(sorted(with_logo)) if with_logo else "(none)")
print("nav_with_text:", ", ".join(sorted(with_text)) if with_text else "(none)")
print("no_nav:", ", ".join(sorted(no_nav)) if no_nav else "(none)")
