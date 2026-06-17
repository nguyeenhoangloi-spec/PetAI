import os
import re

# File paths
WORKSPACE_DIR = r"d:\KhoaLuan - Copy (new) - Copy"
I18N_JS_PATH = os.path.join(WORKSPACE_DIR, "static", "js", "i18n.js")
TEMPLATES_DIR = os.path.join(WORKSPACE_DIR, "templates")

# Real company info variables
COMPANY_NAME_VI = "CÔNG TY TNHH MỘT THÀNH VIÊN CÔNG NGHỆ KỸ THUẬT TIÊN PHONG"
COMPANY_NAME_EN = "TIEN PHONG TECHNOLOGY ENGINEERING ONE MEMBER COMPANY LIMITED"
ADDRESS_VI = "P16, Đường số 8, KDC lô 49, Khu đô thị Nam Cần Thơ, P. Cái Răng, TP. Cần Thơ"
ADDRESS_EN = "P16, Street 8, Lot 49 residential area, Nam Can Tho Urban Area, Cai Rang District, Can Tho City, Vietnam"
EMAIL = "support@pet.ai"
WEBSITE = "pet.ai"
APP_NAME = "PetAI"

def update_i18n():
    print("--- Updating static/js/i18n.js ---")
    with open(I18N_JS_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    replacements = [
        # VI placeholders
        (r'appNamePlaceholder:\s*"\[Tên app hoặc\\n\s+website\]"', f'appNamePlaceholder: "{APP_NAME}"'),
        (r'devNamePlaceholder:\s*"\[Tên cá nhân\\n\s+hoặc công ty\]"', f'devNamePlaceholder: "{COMPANY_NAME_VI}"'),
        (r'addressPlaceholder:\s*"\[Nếu có thì ghi, nếu không thì ghi\\n\s+“Không áp dụng”\]"', f'addressPlaceholder: "{ADDRESS_VI}"'),
        (r'companyNamePlaceholder:\s*"\[Tên của bạn hoặc công ty\]"', f'companyNamePlaceholder: "{COMPANY_NAME_VI}"'),
        (r'addressLabelPlaceholder:\s*"Địa chỉ: \[Nếu có thì ghi, nếu không thì ghi “Không áp dụng”\]"', f'addressLabelPlaceholder: "Địa chỉ: {ADDRESS_VI}"'),
        (r'Bạn có thể sử dụng biểu mẫu phía dưới mục <strong>Liên Hệ</strong> hoặc gửi thư về support@example\.com\.', f'Bạn có thể sử dụng biểu mẫu phía dưới mục <strong>Liên Hệ</strong> hoặc gửi thư về {EMAIL}.'),
        (r'orSendSupportEmail:\s*"hoặc gửi thư về support@example\.com\."', f'orSendSupportEmail: "hoặc gửi thư về {EMAIL}."'),

        # EN placeholders
        (r'appNamePlaceholder:\s*"\[App or website name\]"', f'appNamePlaceholder: "{APP_NAME}"'),
        (r'devNamePlaceholder:\s*"\[Developer or company name\]"', f'devNamePlaceholder: "{COMPANY_NAME_EN}"'),
        (r'addressPlaceholder:\s*"\[If applicable, otherwise write \'Not applicable\'\]"', f'addressPlaceholder: "{ADDRESS_EN}"'),
        (r'companyNamePlaceholder:\s*"\[Your name or company name\]"', f'companyNamePlaceholder: "{COMPANY_NAME_EN}"'),
        (r'addressLabelPlaceholder:\s*"Address: \[If applicable, otherwise write \'Not applicable\'\]"', f'addressLabelPlaceholder: "Address: {ADDRESS_EN}"'),
        (r'You can use the form under the <strong>Contact</strong> section or email support@example\.com\.', f'You can use the form under the <strong>Contact</strong> section or email {EMAIL}.'),
        (r'orSendSupportEmail:\s*"or send an email to support@example\.com\."', f'orSendSupportEmail: "or send an email to {EMAIL}."'),
    ]

    updated = content
    for idx, (pattern, repl) in enumerate(replacements):
        # Match using regex
        match_count = len(re.findall(pattern, updated))
        if match_count == 0:
            print(f"Warning: No match found for pattern index {idx}")
        else:
            updated = re.sub(pattern, repl, updated)
            print(f"Replaced {match_count} occurrences of pattern index {idx}")

    if updated != content:
        with open(I18N_JS_PATH, "w", encoding="utf-8") as f:
            f.write(updated)
        print("Successfully updated static/js/i18n.js")
    else:
        print("No changes made to static/js/i18n.js")

def update_templates():
    print("\n--- Updating HTML Templates ---")
    target_templates = [
        "privacy-policy.html",
        "terms-of-service.html",
        "data-deletion.html",
        "support.html",
        "contact.html"
    ]

    for template_name in target_templates:
        filepath = os.path.join(TEMPLATES_DIR, template_name)
        if not os.path.exists(filepath):
            print(f"Error: {template_name} does not exist!")
            continue

        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        updated = content

        # 1. Replace emails
        updated = re.sub(r"support@example\.com", EMAIL, updated)

        # 2. Replace websites
        updated = re.sub(r"yourdomain\.com", WEBSITE, updated)

        # 3. Replace bracket placeholders specific to template content
        # [Tên của bạn hoặc công ty]
        updated = re.sub(r"\[Tên của bạn hoặc công ty\]", COMPANY_NAME_VI, updated)

        # Địa chỉ: [Nếu có thì ghi, nếu không thì ghi “Không áp\n                dụng”]
        # Match with flexible spaces/newlines between 'áp' and 'dụng'
        addr_pattern = r"Địa chỉ:\s*\[Nếu\s+có\s+thì\s+ghi,\s+nếu\s+không\s+thì\s+ghi\s+“Không\s+áp\s*\n*\s*dụng”\]"
        updated = re.sub(addr_pattern, f"Địa chỉ: {ADDRESS_VI}", updated)

        # [Tên app hoặc website]
        updated = re.sub(r"\[Tên app hoặc website\]", APP_NAME, updated)

        # [Tên cá nhân hoặc công ty]
        updated = re.sub(r"\[Tên cá nhân hoặc công ty\]", COMPANY_NAME_VI, updated)

        # [Nếu có thì ghi, nếu không thì ghi “Không áp dụng”]
        updated = re.sub(r"\[Nếu có thì ghi, nếu không thì ghi\s+“Không áp dụng”\]", ADDRESS_VI, updated)

        # If any changes made, write back
        if updated != content:
            # Count changes briefly
            diff_lines = sum(1 for a, b in zip(content.splitlines(), updated.splitlines()) if a != b)
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(updated)
            print(f"Updated {template_name} (approx {diff_lines} lines changed)")
        else:
            print(f"No changes in {template_name}")

if __name__ == "__main__":
    update_i18n()
    update_templates()
    print("\nUpdate completed successfully!")
