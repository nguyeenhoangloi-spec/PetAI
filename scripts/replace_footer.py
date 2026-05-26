import re
from pathlib import Path

root = Path(r"c:\Users\User\Desktop\KhoaLuan - Copy (new) - Copy")
home = root / "templates" / "home.html"
text = home.read_text(encoding="utf-8")
match = re.search(r"<footer\b.*?</footer>", text, flags=re.S)
if not match:
    raise SystemExit("footer not found in home.html")
footer = match.group(0)

targets = [
    "confirmations.html",
    "dashboard.html",
    "forgot_password.html",
    "history.html",
    "login.html",
    "predict.html",
    "register.html",
    "statistics.html",
    "upgrade.html",
    "upload_page.html",
    "user_detail.html",
    "users.html",
]

for name in targets:
    path = root / "templates" / name
    if not path.exists():
        print(f"missing {name}")
        continue
    data = path.read_text(encoding="utf-8")
    newline = "\r\n" if "\r\n" in data else "\n"
    footer_nl = footer.replace("\n", newline)
    updated, count = re.subn(r"<footer\b.*?</footer>", footer_nl, data, count=1, flags=re.S)
    if count:
        path.write_text(updated, encoding="utf-8", newline=newline)
        print(f"updated {name}")
    else:
        print(f"no footer in {name}")
