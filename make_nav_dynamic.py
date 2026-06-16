import os
import re

templates_dir = r"d:\KhoaLuan - Copy (new) - Copy\templates"
target_files = [
    "home.html",
    "privacy-policy.html",
    "terms-of-service.html",
    "data-deletion.html",
    "support.html",
    "contact.html"
]

# Regex pattern matching the target guest menu block (right side login/register buttons)
guest_menu_pattern = re.compile(
    r'<div class="flex items-center gap-6">\s*'
    r'<a\s+class="label-sm text-on-surface-variant hover:text-primary font-semibold transition-colors duration-300"\s+'
    r'href="\{\{\s*url_for\(\'login\.login\'\)\s*\}\}"\s*>'
    r'Đăng nhập</a\s*>\s*'
    r'<a\s+class="bg-primary text-on-primary px-6 py-2\.5 rounded-full label-sm font-semibold hover:shadow-lg active:scale-95 transition-all"\s+'
    r'href="\{\{\s*url_for\(\'register\.register\'\)\s*\}\}"\s*>'
    r'Đăng ký</a\s*>\s*'
    r'</div>',
    re.DOTALL | re.IGNORECASE
)

guest_menu_replacement = """{% if session.get('user_id') %}
        <div class="flex items-center gap-6">
          <a
            class="body-md text-on-surface-variant hover:text-primary transition-colors duration-300 font-semibold"
            href="{{ url_for('dashboard.dashboard') }}"
            >Bảng điều khiển</a
          >
          <div class="flex items-center gap-base">
            <a
              aria-label="Cài đặt"
              class="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              href="{{ url_for('settings.settings') }}"
            >
              <span class="material-symbols-outlined" data-icon="settings"
                >settings</span
              >
            </a>
            <div class="relative group cursor-pointer">
              <img
                alt="Ảnh đại diện"
                class="w-9 h-9 rounded-full border-2 border-primary/20 p-0.5"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuABdf7zKSVKEqdGUUjqEkF9ftdFTrLW87Tb24r2IiZiv_JP0LrItrCxl23SH-gYj2Mqtkma0ak9DZbUtKM5nW747pmivDYGVbYhNr1PZbxbFuOrZdGJvnbhdSurFLfL3BcmhN2p1h9wv_6geT-x8eoTG1TDoLL40P8wDiaymvRT--SA4jYjU9A77WIji5FmOi99mPDXw7xS6dUyUNJYU2gHLk4-smzFrCuBbQbgtpATDvNo6hq3YR-cfSaNblImtCnDXIb8np7J4HA"
              />
              <div
                class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"
              ></div>
              <div
                class="absolute right-0 top-full w-52 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 py-2 hidden group-hover:block z-50 text-left text-on-surface"
              >
                <div class="px-4 pb-2">
                  <div class="label-sm text-slate-500 dark:text-slate-400">
                    Vai trò:
                    <span
                      class="font-semibold text-slate-800 dark:text-slate-200"
                      >{{ (session.get('role') or 'USER')|upper }}</span
                    >
                  </div>
                  <div class="label-sm text-slate-500 dark:text-slate-400">
                    Gói:
                    <span
                      class="font-semibold text-slate-800 dark:text-slate-200"
                      >{{ (current_plan or 'FREE')|upper }}</span
                    >
                  </div>
                </div>
                <div class="h-px bg-slate-200 dark:bg-slate-800 my-1"></div>
                <a
                  class="flex items-center gap-2 px-4 py-2 body-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-semibold"
                  href="{{ url_for('logout.logout') }}"
                >
                  <span class="material-symbols-outlined text-[18px]"
                    >logout</span
                  >
                  Đăng xuất
                </a>
              </div>
            </div>
          </div>
        </div>
        {% else %}
        <div class="flex items-center gap-6">
          <a
            class="label-sm text-on-surface-variant hover:text-primary font-semibold transition-colors duration-300"
            href="{{ url_for('login.login') }}"
            >Đăng nhập</a
          >
          <a
            class="bg-primary text-on-primary px-6 py-2.5 rounded-full label-sm font-semibold hover:shadow-lg active:scale-95 transition-all"
            href="{{ url_for('register.register') }}"
            >Đăng ký</a
          >
        </div>
        {% endif %}"""

# Regex pattern matching the landing page links block (middle menu links)
landing_menu_pattern = re.compile(
    r'<div class="hidden md:flex items-center gap-10">\s*'
    r'<a\s+class="body-md text-primary font-semibold"\s+href="/?#product"\s*>\s*Sản phẩm</a\s*>\s*'
    r'<a\s+class="body-md text-on-surface-variant hover:text-primary transition-colors duration-300"\s+'
    r'href="/?#features"\s*>\s*Tính năng</a\s*>\s*'
    r'<a\s+class="body-md text-on-surface-variant hover:text-primary transition-colors duration-300"\s+'
    r'href="/?#pricing"\s*>\s*Bảng giá</a\s*>\s*'
    r'<a\s+class="body-md text-on-surface-variant hover:text-primary transition-colors duration-300"\s+'
    r'href="/?#social-proof"\s*>\s*Giới thiệu</a\s*>\s*'
    r'</div>',
    re.DOTALL | re.IGNORECASE
)

for filename in target_files:
    filepath = os.path.join(templates_dir, filename)
    if not os.path.exists(filepath):
        print(f"Skipping {filename}: File not found")
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    
    # 1. Update guest menu if not already done
    if guest_menu_pattern.search(content):
        content = guest_menu_pattern.sub(guest_menu_replacement, content)
        modified = True
        
    # 2. Wrap landing menu (middle links) if found and not already wrapped
    if landing_menu_pattern.search(content):
        # Double check to prevent wrapping multiple times
        start_idx = content.find('{% if not session.get(\'user_id\') %}')
        menu_idx = content.find('class="hidden md:flex items-center gap-10"')
        
        # If the check is already surrounding the menu, skip it
        if start_idx == -1 or not (start_idx < menu_idx < start_idx + 150):
            content = landing_menu_pattern.sub(
                lambda m: f"{{% if not session.get('user_id') %}}\n        {m.group(0)}\n        {{% endif %}}",
                content
            )
            modified = True
            
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Successfully updated {filename}")
    else:
        print(f"No changes needed or pattern not matched in {filename}")

