import re
from pathlib import Path

root = Path(r"c:\Users\User\Desktop\KhoaLuan - Copy (new) - Copy")
base = root / "templates" / "home.html"
text = base.read_text(encoding="utf-8")
match = re.search(r"<footer\b.*?</footer>", text, flags=re.S)
if not match:
    raise SystemExit("footer not found in home.html")
footer = match.group(0)

# Only full-page templates (skip partials like _toasts.html, watch_ad.html)
targets = [
    "checkout.html",
    "error.html",
    "payments_user.html",
    "settings.html",
]

for name in targets:
    path = root / "templates" / name
    if not path.exists():
        print(f"missing {name}")
        continue
    data = path.read_text(encoding="utf-8")
    if re.search(r"<footer\b.*?</footer>", data, flags=re.S):
        print(f"already has footer {name}")
        continue

    newline = "\r\n" if "\r\n" in data else "\n"
    footer_nl = footer.replace("\n", newline)

    if "</body>" in data:
        updated = re.sub(r"\s*</body>", f"{newline}{footer_nl}{newline}</body>", data, count=1)
    elif "</html>" in data:
        updated = re.sub(r"\s*</html>", f"{newline}{footer_nl}{newline}</html>", data, count=1)
    else:
        print(f"no body/html tag in {name}")
        continue

    path.write_text(updated, encoding="utf-8", newline=newline)
    print(f"added footer to {name}")
