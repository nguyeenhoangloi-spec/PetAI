import os
import sys

sys.path.append(r"d:\KhoaLuan - Copy (new) - Copy")

from app import app
import connect

def test_settings():
    # Find test_user_ai id from DB
    conn = connect.get_connection()
    user_id = None
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM users WHERE username = 'test_user_ai'")
            row = cur.fetchone()
            if row:
                user_id = row[0]
    finally:
        conn.close()
        
    if not user_id:
        print("ERROR: User test_user_ai not found in DB")
        return

    client = app.test_client()
    
    # 1. Simulating Vietnamese session
    with client.session_transaction() as sess:
        sess["user_id"] = user_id
        sess["username"] = "test_user_ai"
        sess["fullname"] = "Test User AI"
        sess["email"] = "test_user_ai@example.com"
        sess["role"] = "user"
        
    print("--- Testing Vietnamese Language Render ---")
    client.set_cookie("siteLanguage", "vi")
    res = client.get("/settings/")
    html_vi = res.data.decode("utf-8")
    
    # Check key elements in Vietnamese
    checks_vi = {
        "Cài đặt thông báo": "notificationsSection",
        "Thông báo hệ thống": "systemNotificationsLabel",
        "Nhận thông báo trực tiếp trên giao diện": "systemNotificationsDesc",
        "Thông báo qua Email": "emailNotificationsLabel",
        "Nhận các báo cáo thống kê": "emailNotificationsDesc",
        "Thay đổi mật khẩu": "changePasswordTitle",
        "Mật khẩu hiện tại": "currentPasswordLabel",
        "Nhập mật khẩu hiện tại": "currentPasswordPlaceholder",
        "Mật khẩu mới": "newPasswordLabel",
        "Xác nhận mật khẩu mới": "confirmNewPasswordLabel",
        "Nâng cấp gói": "subscriptionUpgradeBtn"
    }
    
    vi_ok = True
    for text, key_name in checks_vi.items():
        if text not in html_vi:
            print(f"FAILED: '{text}' ({key_name}) is missing in Vietnamese render")
            vi_ok = False
        else:
            print(f"OK: Found '{text}'")
            
    # 2. Simulating English session
    print("--- Testing English Language Render ---")
    client.set_cookie("siteLanguage", "en")
    res = client.get("/settings/")
    html_en = res.data.decode("utf-8")
    
    checks_en = {
        "Notification Settings": "notificationsSection",
        "System Notifications": "systemNotificationsLabel",
        "Receive instant notifications on the UI": "systemNotificationsDesc",
        "Email Notifications": "emailNotificationsLabel",
        "Receive periodic reports": "emailNotificationsDesc",
        "Change Password": "changePasswordTitle",
        "Current Password": "currentPasswordLabel",
        "Enter current password": "currentPasswordPlaceholder",
        "New Password": "newPasswordLabel",
        "Confirm New Password": "confirmNewPasswordLabel",
        "Upgrade Plan": "subscriptionUpgradeBtn"
    }
    
    en_ok = True
    for text, key_name in checks_en.items():
        if text not in html_en:
            print(f"FAILED: '{text}' ({key_name}) is missing in English render")
            en_ok = False
        else:
            print(f"OK: Found '{text}'")
            
    if vi_ok and en_ok:
        print("\nSUCCESS: All settings translations render successfully in both languages!")
    else:
        print("\nFAILURE: Some translations failed to render correctly.")

if __name__ == "__main__":
    test_settings()
