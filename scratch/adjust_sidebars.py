import os
import re

templates_dir = "templates"
templates_to_modify = {
    "dashboard.html": "upload",
    "upload_page.html": "upload",
    "predict.html": "upload",
    "history.html": "history",
    "payments_user.html": "payments",
    "statistics.html": "statistics",
    "upgrade.html": "upgrade",
    "users.html": "users",
    "user_detail.html": "users",
    "confirmations.html": "confirmations",
    "checkout.html": "upgrade",
    "settings.html": "settings"
}

def generate_sidebar_html(active_item):
    if active_item == "payments":
        payments_cond = "{% if session.get('role') == 'user' or session.get('role') == 'admin' %}"
    else:
        payments_cond = "{% if session.get('role') == 'user' %}"
        
    return f"""<aside class="sidebar col-span-1" id="sidebar">
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-2">
          <img alt="PetAI Logo" class="w-8 h-8 object-contain" src="{{{{ url_for('static', filename='logo.png') }}}}" />
          <span class="text-xl font-semibold text-primary font-['Inter']">PetAI</span>
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="flex-grow overflow-y-auto px-4 py-6 flex flex-col gap-1.5">
        <a class="sidebar-nav-item flex items-center gap-3 py-3 px-4 rounded-xl text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary transition-all font-semibold font-['Inter'] {'active bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' if active_item == 'upload' else ''}"
          href="{{{{ url_for('predict.upload_page') }}}}">
          <span class="material-symbols-outlined text-[22px] {'text-blue-600 dark:text-blue-400' if active_item == 'upload' else 'text-slate-400 dark:text-slate-500'}" style="font-variation-settings: 'FILL' {'1' if active_item == 'upload' else '0'}">upload_file</span>
          <span class="text-sm">Tải ảnh &amp; Phân tích</span>
        </a>
        <a class="sidebar-nav-item flex items-center gap-3 py-3 px-4 rounded-xl text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary transition-all font-semibold font-['Inter'] {'active bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' if active_item == 'history' else ''}"
          href="{{{{ url_for('history.history') }}}}">
          <span class="material-symbols-outlined text-[22px] {'text-blue-600 dark:text-blue-400' if active_item == 'history' else 'text-slate-400 dark:text-slate-500'}" style="font-variation-settings: 'FILL' {'1' if active_item == 'history' else '0'}">history</span>
          <span class="text-sm">Lịch sử dự đoán</span>
        </a>
        {payments_cond}
        <a class="sidebar-nav-item flex items-center gap-3 py-3 px-4 rounded-xl text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary transition-all font-semibold font-['Inter'] {'active bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' if active_item == 'payments' else ''}"
          href="{{{{ url_for('predict.my_payments') }}}}">
          <span class="material-symbols-outlined text-[22px] {'text-blue-600 dark:text-blue-400' if active_item == 'payments' else 'text-slate-400 dark:text-slate-500'}" style="font-variation-settings: 'FILL' {'1' if active_item == 'payments' else '0'}">payments</span>
          <span class="text-sm">Lịch sử thanh toán</span>
        </a>
        {{% endif %}}
        <a class="sidebar-nav-item flex items-center gap-3 py-3 px-4 rounded-xl text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary transition-all font-semibold font-['Inter'] {'active bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' if active_item == 'statistics' else ''}"
          href="{{{{ url_for('statistics.statistics') }}}}">
          <span class="material-symbols-outlined text-[22px] {'text-blue-600 dark:text-blue-400' if active_item == 'statistics' else 'text-slate-400 dark:text-slate-500'}" style="font-variation-settings: 'FILL' {'1' if active_item == 'statistics' else '0'}">bar_chart</span>
          <span class="text-sm">Thống kê cá nhân</span>
        </a>
        <a class="sidebar-nav-item flex items-center gap-3 py-3 px-4 rounded-xl text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary transition-all font-semibold font-['Inter'] {'active bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' if active_item == 'upgrade' else ''}"
          href="{{{{ url_for('predict.upgrade') }}}}">
          <span class="material-symbols-outlined text-[22px] {'text-blue-600 dark:text-blue-400' if active_item == 'upgrade' else 'text-slate-400 dark:text-slate-500'}" style="font-variation-settings: 'FILL' {'1' if active_item == 'upgrade' else '0'}">upgrade</span>
          <span class="text-sm">Nâng cấp gói</span>
        </a>

        {{% if session.get('role') == 'admin' %}}
        <div class="text-[11px] font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-widest mt-6 mb-2 px-4">Quản trị viên</div>
        
        <a class="sidebar-nav-item flex items-center gap-3 py-3 px-4 rounded-xl text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary transition-all font-semibold font-['Inter'] {'active bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' if active_item == 'users' else ''}"
          href="{{{{ url_for('users.list_users') }}}}">
          <span class="material-symbols-outlined text-[22px] {'text-blue-600 dark:text-blue-400' if active_item == 'users' else 'text-slate-400 dark:text-slate-500'}" style="font-variation-settings: 'FILL' {'1' if active_item == 'users' else '0'}">groups</span>
          <span class="text-sm">Quản lý người dùng</span>
        </a>
        <a class="sidebar-nav-item flex items-center gap-3 py-3 px-4 rounded-xl text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary transition-all font-semibold font-['Inter'] {'active bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' if active_item == 'confirmations' else ''}"
          href="{{{{ url_for('users.confirmations_list') }}}}">
          <span class="material-symbols-outlined text-[22px] {'text-blue-600 dark:text-blue-400' if active_item == 'confirmations' else 'text-slate-400 dark:text-slate-500'}" style="font-variation-settings: 'FILL' {'1' if active_item == 'confirmations' else '0'}">receipt_long</span>
          <span class="text-sm">Duyệt đơn</span>
        </a>
        {{% endif %}}

        <div class="h-px bg-slate-100 dark:bg-slate-800 my-4"></div>

        <a class="sidebar-nav-item flex items-center gap-3 py-3 px-4 rounded-xl text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary transition-all font-semibold font-['Inter'] {'active bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' if active_item == 'settings' else ''}"
          href="{{{{ url_for('settings.settings') }}}}">
          <span class="material-symbols-outlined text-[22px] {'text-blue-600 dark:text-blue-400' if active_item == 'settings' else 'text-slate-400 dark:text-slate-500'}" style="font-variation-settings: 'FILL' {'1' if active_item == 'settings' else '0'}">settings</span>
          <span class="text-sm">Cài đặt tài khoản</span>
        </a>
      </div>

      <!-- User Profile Footer -->
      <div class="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30">
        <div class="flex items-center gap-3 min-w-0 flex-1">
          <img alt="Ảnh đại diện" class="w-10 h-10 rounded-full object-cover border-2 border-primary/20 p-0.5 flex-shrink-0"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuABdf7zKSVKEqdGUUjqEkF9ftdFTrLW87Tb24r2IiZiv_JP0LrItrCxl23SH-gYj2Mqtkma0ak9DZbUtKM5nW747pmivDYGVbYhNr1PZbxbFuOrZdGJvnbhdSurFLfL3BcmhN2p1h9wv_6geT-x8eoTG1TDoLL40P8wDiaymvRT--SA4jYjU9A77WIji5FmOi99mPDXw7xS6dUyUNJYU2gHLk4-smzFrCuBbQbgtpATDvNo6hq3YR-cfSaNblImtCnDXIb8np7J4HA" />
          <div class="flex flex-col min-w-0 flex-1">
            <span class="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{{{{ session.get('fullname') or session.get('username') or 'User' }}}}</span>
            <span class="text-[11px] font-medium text-slate-400 uppercase tracking-wider truncate">
              {{{{ (session.get('role') or 'USER')|upper }}}} / {{{{ (current_plan or 'FREE')|upper }}}}
            </span>
          </div>
        </div>
        <a href="{{{{ url_for('logout.logout') }}}}" class="text-red-500 hover:text-red-650 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex-shrink-0" title="Đăng xuất">
          <span class="material-symbols-outlined text-[22px]">logout</span>
        </a>
      </div>
    </aside>"""

aside_pattern = re.compile(r'<aside\s+[^>]*?id="sidebar"[^>]*?>.*?</aside>', re.DOTALL | re.IGNORECASE)

for filename, active_item in templates_to_modify.items():
    filepath = os.path.join(templates_dir, filename)
    if not os.path.exists(filepath):
        print(f"Skipping non-existent file: {filepath}")
        continue
    
    print(f"Modifying sidebar in {filename}...")
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace aside block
    new_sidebar = generate_sidebar_html(active_item)
    modified, count = aside_pattern.subn(new_sidebar, content)
    
    # Replace layout columns (support both 280px and 230px, replacing with 250px)
    modified = modified.replace("grid-cols-[280px_minmax(0,1fr)]", "grid-cols-[250px_minmax(0,1fr)]")
    modified = modified.replace("grid-cols-[230px_minmax(0,1fr)]", "grid-cols-[250px_minmax(0,1fr)]")
    modified = modified.replace("grid-cols-[280px_1fr]", "grid-cols-[250px_1fr]")
    modified = modified.replace("grid-cols-[230px_1fr]", "grid-cols-[250px_1fr]")
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(modified)
    
    print(f"Updated {filename}: Replaced sidebar (matched={count > 0})")
