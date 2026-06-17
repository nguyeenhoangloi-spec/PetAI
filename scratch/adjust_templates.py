import os
import re

templates_dir = "templates"
templates_to_modify = [
    "dashboard.html",
    "history.html",
    "predict.html",
    "upload_page.html",
    "statistics.html",
    "upgrade.html",
    "settings.html",
    "payments_user.html",
    "users.html",
    "user_detail.html",
    "confirmations.html",
    "checkout.html",
]

def remove_horizontal_menu(content):
    # Match the class string with optional classes (like whitespace-nowrap)
    pattern = re.compile(
        r'hidden\s+md:flex\s+flex-1\s+items-center\s+justify-end\s+gap-margin\s+mr-gutter\s+.*?\[&>a\]:(body-md|label-sm)',
        re.IGNORECASE
    )
    match = pattern.search(content)
    if match:
        idx = match.start()
        # Find the opening <div preceding it
        open_tag_idx = content.rfind('<div', 0, idx)
        if open_tag_idx != -1:
            # Find the closing </div> after it
            close_tag_idx = content.find('</div>', idx)
            if close_tag_idx != -1:
                # Remove from open_tag_idx to close_tag_idx + 6
                print("Found and removed horizontal menu div.")
                return content[:open_tag_idx] + content[close_tag_idx + 6:], True
    return content, False

def remove_nhan_dien_btn(content):
    # Match non-greedily: <a ... >Nhận diện</a>
    pattern = re.compile(
        r'<a\s+[^>]*?>\s*Nhận diện\s*</a>',
        re.IGNORECASE | re.DOTALL
    )
    matches = list(pattern.finditer(content))
    modified = False
    for m in reversed(matches):
        tag_content = m.group(0)
        # Check if this tag has the class or href for predict
        if 'predict.upload_page' in tag_content or 'bg-primary' in tag_content:
            content = content[:m.start()] + content[m.end():]
            modified = True
            print("Found and removed 'Nhan dien' button.")
    return content, modified

def update_head_script(content):
    target = 'const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true";'
    replacement = 'const stored = localStorage.getItem("sidebar-collapsed");\n        const isCollapsed = stored === null ? true : stored === "true";'
    if target in content:
        content = content.replace(target, replacement)
        print("Updated head script collapse logic.")
        return content, True
    return content, False

for filename in templates_to_modify:
    filepath = os.path.join(templates_dir, filename)
    if not os.path.exists(filepath):
        print(f"Skipping non-existent file: {filepath}")
        continue
        
    print(f"\nProcessing {filename}...")
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        
    modified_content, menu_done = remove_horizontal_menu(content)
    modified_content, btn_done = remove_nhan_dien_btn(modified_content)
    modified_content, script_done = update_head_script(modified_content)
    
    if menu_done or btn_done or script_done:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(modified_content)
        print(f"Saved modifications to {filename}")
    else:
        print(f"No changes matched in {filename}")
