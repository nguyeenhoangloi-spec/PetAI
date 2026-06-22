import os
import re

directory = 'd:/KhoaLuan - Copy (new) - Copy/templates'

for filename in os.listdir(directory):
    if filename.endswith('.html'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        
        # In system_config.html, there are replacements like:
        # {{ configs.get('email_pay_confirm_subject', '[{{ get_config('site_name', 'PetAI') }}] Gói đã được kích hoạt thành công') }}
        # We need to change it to:
        # {{ configs.get('email_pay_confirm_subject', '[' ~ get_config('site_name', 'PetAI') ~ '] Gói đã được kích hoạt thành công') }}
        
        # Or in Javascript:
        # subject: `{{ configs.get('email_otp_subject', '[{{ get_config('site_name', 'PetAI') }}] Xác thực đăng ký tài khoản') }}`
        
        def fix_nested_jinja(match):
            whole = match.group(0)
            # Find the inner `{{ get_config('site_name', 'PetAI') }}`
            # Replace it with `' ~ get_config('site_name', 'PetAI') ~ '`
            # Note: The outer string might be enclosed in single quotes.
            # Example: 'abc {{ get_config('site_name', 'PetAI') }} xyz' -> 'abc ' ~ get_config('site_name', 'PetAI') ~ ' xyz'
            
            # Since we know exactly how it looks:
            fixed = whole.replace("{{ get_config('site_name', 'PetAI') }}", "' ~ get_config('site_name', 'PetAI') ~ '")
            # If the resulting string ends with ` ~ ''`, we can clean it up later or just leave it, it's valid Jinja.
            
            # Note: There was a bug with single quotes!
            # The outer string uses single quotes: '[PetAI]'
            # So `[' ~ get_config('site_name', 'PetAI') ~ ']` is correct because it's inside `configs.get(..., '...')`
            
            # Let's see an actual case:
            # value="{{ configs.get('email_pay_confirm_subject', '[{{ get_config('site_name', 'PetAI') }}] Gói đã được kích hoạt thành công') }}"
            # After fix:
            # value="{{ configs.get('email_pay_confirm_subject', '[' ~ get_config('site_name', 'PetAI') ~ '] Gói đã được kích hoạt thành công') }}"
            return fixed

        # Find all `{{ ... }}` blocks
        content = re.sub(r'\{\{.*?\}\}', lambda m: fix_nested_jinja(m) if "{{ get_config('site_name', 'PetAI') }}" in m.group(0) and m.group(0).startswith("{{ configs.get") else m.group(0), content)
        
        # Actually, let's just do a simpler replace because `{{ ... }}` matching might fail if nested
        # The string " {{ get_config('site_name', 'PetAI') }} " is literally inside another string.
        # Let's just find and replace manually for the known ones:
        
        content = content.replace(
            "configs.get('email_otp_subject', '[{{ get_config('site_name', 'PetAI') }}] Xác thực đăng ký tài khoản')",
            "configs.get('email_otp_subject', '[' ~ get_config('site_name', 'PetAI') ~ '] Xác thực đăng ký tài khoản')"
        )
        content = content.replace(
            "configs.get('email_forgot_subject', '[{{ get_config('site_name', 'PetAI') }}] Yêu cầu đặt lại mật khẩu')",
            "configs.get('email_forgot_subject', '[' ~ get_config('site_name', 'PetAI') ~ '] Yêu cầu đặt lại mật khẩu')"
        )
        content = content.replace(
            "configs.get('email_pay_confirm_subject', '[{{ get_config('site_name', 'PetAI') }}] Gói đã được kích hoạt thành công')",
            "configs.get('email_pay_confirm_subject', '[' ~ get_config('site_name', 'PetAI') ~ '] Gói đã được kích hoạt thành công')"
        )
        content = content.replace(
            "configs.get('email_pay_reject_subject', '[{{ get_config('site_name', 'PetAI') }}] Đơn nâng cấp gói bị từ chối')",
            "configs.get('email_pay_reject_subject', '[' ~ get_config('site_name', 'PetAI') ~ '] Đơn nâng cấp gói bị từ chối')"
        )
        content = content.replace(
            "configs.get('email_delete_request_subject', '[{{ get_config('site_name', 'PetAI') }}] Mã OTP xác nhận xóa tài khoản')",
            "configs.get('email_delete_request_subject', '[' ~ get_config('site_name', 'PetAI') ~ '] Mã OTP xác nhận xóa tài khoản')"
        )
        content = content.replace(
            "configs.get('email_delete_confirm_subject', '[{{ get_config('site_name', 'PetAI') }}] Yêu cầu xóa tài khoản đã được ghi nhận')",
            "configs.get('email_delete_confirm_subject', '[' ~ get_config('site_name', 'PetAI') ~ '] Yêu cầu xóa tài khoản đã được ghi nhận')"
        )
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Fixed nested Jinja in {filename}')
