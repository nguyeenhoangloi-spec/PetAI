import unittest
from unittest.mock import patch, MagicMock
import os
import sys
import time
from datetime import datetime, timedelta
import html

# Ensure project root is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Pre-mock connect.get_connection before importing app to ensure all blueprints inherit the mock
import connect
mock_conn = MagicMock()
connect.get_connection = MagicMock(return_value=mock_conn)

# Pre-mock email utilities to prevent actual mail sending during imports/testing
import utils
utils.send_otp_email = MagicMock()

try:
    import notifications
    notifications.send_welcome_email = MagicMock()
except Exception:
    pass

# Now import Flask app
from app import app
from werkzeug.security import generate_password_hash

class SmartMockCursor:
    def __init__(self, pwd_hash, cursor_class=None, test_case=None, *args, **kwargs):
        self.pwd_hash = pwd_hash
        self.cursor_class = cursor_class
        self.test_case = test_case
        # Check if this cursor is a DictCursor
        self.is_dict_cursor = False
        if cursor_class is not None:
            if getattr(cursor_class, '__name__', '') == 'DictCursor' or 'DictCursor' in str(cursor_class):
                self.is_dict_cursor = True
        
        self.last_query = ""
        self.rowcount = 1
        self.lastrowid = 1
        self.results = []

    def execute(self, query, params=None):
        self.last_query = str(query).lower()
        self.rowcount = 1
        
        # 1. Specific complex stats query in users.py list_users
        if "select count(*) as total, sum(case" in self.last_query:
            self.results = [{
                "total": 5,
                "total_admins": 1,
                "total_active": 4,
                "total_locked": 1
            }]
        # 2. Daily counts queries with DATE(created_at) group by
        elif "select date(created_at)" in self.last_query:
            self.results = [{"day": datetime.now().date(), "cnt": 5}]
        # 3. Monthly counts queries with DATE_FORMAT(created_at) group by
        elif "date_format(created_at" in self.last_query:
            self.results = [{"month": "2026-06", "cnt": 5}]
        # 4. Daily revenue trend group by day
        elif "select date(confirmed_at)" in self.last_query:
            self.results = [{"day": "2026-06-19", "total": 5000}]
        # 5. Monthly revenue trend group by month
        elif "date_format(confirmed_at" in self.last_query:
            self.results = [{"month": "2026-06", "total": 5000}]
        # 6. Yearly revenue trend group by year
        elif "year(confirmed_at)" in self.last_query:
            self.results = [{"year": "2026", "total": 5000}]
        # 7. Subscription plan distribution group by plan
        elif "select plan, count(*) as cnt" in self.last_query:
            self.results = [
                {"plan": "free", "cnt": 3},
                {"plan": "pro", "cnt": 2}
            ]
        # 8. Top breeds distribution
        elif "group by breed" in self.last_query:
            self.results = [
                {"breed": "Beagle", "cnt": 5},
                {"breed": "Poodle", "cnt": 3}
            ]
        # 9. Confidence distribution 5-group query
        elif "confidence < 0.2" in self.last_query:
            self.results = [{
                "g1": 1,
                "g2": 2,
                "g3": 3,
                "g4": 4,
                "g5": 5
            }]
        # 10. General aggregation queries (always return 1 row, 1 column)
        elif any(agg in self.last_query for agg in ["count(", "sum(", "avg("]):
            if "role = 'admin'" in self.last_query and self.test_case and hasattr(self.test_case, "mock_other_admins_count"):
                self.results = [{"cnt": self.test_case.mock_other_admins_count}]
            else:
                self.results = [{"val": 5}]
        # 11. User block inactive status check in middleware.py
        elif "select is_active, force_change_password" in self.last_query:
            self.results = [{"is_active": 1, "force_change_password": 0}]
        # 12. User settings load
        elif "select theme, language, notifications" in self.last_query:
            self.results = [{"theme": "light", "language": "vi", "notifications": 1, "email_notifications": 0}]
        # 13. Password hash check
        elif "select password_hash, force_change_password" in self.last_query:
            self.results = [{"password_hash": self.pwd_hash, "force_change_password": 0}]
        # 14. User detail check for forgot password OTP verify
        elif "select id, email, email_verified" in self.last_query:
            self.results = [{"id": 1, "email": "test@example.com", "email_verified": 1}]
        # 15. Select users detail list
        elif "select u.id, u.username" in self.last_query:
            self.results = [
                {
                    "id": 1,
                    "username": "admin",
                    "fullname": "Administrator",
                    "email": "admin@example.com",
                    "role": "admin",
                    "is_active": 1,
                    "created_at": datetime.now(),
                    "plan": "free"
                },
                {
                    "id": 2,
                    "username": "testuser",
                    "fullname": "Test User",
                    "email": "testuser@example.com",
                    "role": "user",
                    "is_active": 1,
                    "created_at": datetime.now(),
                    "plan": "free"
                }
            ]
        # 16. User lookup by email/username
        elif "select * from users where" in self.last_query:
            self.results = [{
                "id": 1,
                "username": "testuser",
                "password_hash": self.pwd_hash,
                "email": "test@example.com",
                "fullname": "Test User",
                "role": "admin",
                "email_verified": 1,
                "is_active": 1,
                "google_id": None
            }]
        # 17. Simple select user quota
        elif "select plan, ad_views_used" in self.last_query:
            self.results = [{"plan": "free", "ad_views_used": 0, "ad_unlocks_remaining": 0, "plan_expire": None, "paid_uses_remaining": None}]
        # 18. Simple select id, username
        elif "select id, username" in self.last_query:
            self.results = [{"id": 2, "username": "testuser"}]
        # 19. Simple select email, fullname
        elif "select email, fullname, username, account_status" in self.last_query:
            role = "user"
            if self.test_case and hasattr(self.test_case, "mock_user_role"):
                role = self.test_case.mock_user_role
            self.results = [{
                "email": "test@example.com",
                "fullname": "Test User",
                "username": "testuser",
                "account_status": "active",
                "role": role
            }]
        elif "select email, fullname" in self.last_query:
            self.results = [{"email": "test@example.com", "fullname": "Test User"}]
        elif "select account_status, delete_requested_at" in self.last_query:
            self.results = [{
                "account_status": "active",
                "delete_requested_at": None,
                "delete_scheduled_at": None,
                "delete_reason": None,
                "delete_cancelled_at": None,
                "deleted_at": None
            }]
        elif "select delete_otp_attempts, delete_otp_locked_until" in self.last_query:
            self.results = [{"delete_otp_attempts": 0, "delete_otp_locked_until": None}]
        elif "select delete_otp_hash, delete_otp_expires_at" in self.last_query:
            from werkzeug.security import generate_password_hash
            otp_hash = generate_password_hash("123456")
            self.results = [{
                "delete_otp_hash": otp_hash,
                "delete_otp_expires_at": datetime.now() + timedelta(seconds=300),
                "delete_otp_type": "delete",
                "delete_otp_attempts": 0
            }]
        # 20. Payment orders queries
        elif "select order_id, plan, payment_method, amount_vnd, status" in self.last_query:
            self.results = [{"order_id": "ord123", "plan": "pro", "payment_method": "qr", "amount_vnd": 5000, "status": "pending", "created_at": None, "confirmed_at": None}]
        elif "select * from payment_orders" in self.last_query:
            self.results = [{
                "id": 1,
                "order_id": "ord123",
                "user_id": 1,
                "plan": "pro",
                "payment_method": "qr",
                "amount_vnd": 5000,
                "status": "pending",
                "created_at": None,
                "confirmed_at": None
            }]
        # 21. Avatar url query
        elif "select avatar_url" in self.last_query:
            self.results = [{"avatar_url": None}]
        # 22. Legal content versions detail query
        elif "legal_content_versions" in self.last_query and "content_vi" in self.last_query:
            self.results = [{
                "id": 1,
                "page": "privacy-policy",
                "content_vi": "<p>Nội dung tiếng Việt</p>",
                "content_en": "<p>English content</p>",
                "saved_at": datetime.now()
            }]
        # 23. Legal content versions list query
        elif "legal_content_versions" in self.last_query:
            self.results = [{"id": 1, "page": "privacy-policy", "saved_at": datetime.now()}]
        # 24. Check deletion safety (prediction_history, payment_orders)
        elif "prediction_history" in self.last_query or "payment_orders" in self.last_query:
            self.results = []
        # 25. Default empty results
        else:
            self.results = []

    def fetchone(self):
        if not self.results:
            return None
        row = self.results[0]
        if isinstance(self.results, list) and self.results:
            row = self.results.pop(0)
            
        if self.is_dict_cursor:
            return row
        else:
            return tuple(row.values())

    def fetchall(self):
        res = list(self.results)
        self.results = []
        
        if self.is_dict_cursor:
            return res
        else:
            return [tuple(r.values()) for r in res]

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        pass

class FlaskSystemTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        app.config['SEPAY_API_KEY'] = 'test_sepay_key'
        app.config['ALLOW_MANUAL_TRANSFER_CONFIRM'] = True
        app.config['AUTO_CONFIRM_ON_USER_CONFIRM'] = True
        self.client = app.test_client()

        # Generate mock password hash
        self.pwd_hash = generate_password_hash("password123")
        
        # Configure the mock connection to return our smart cursor
        mock_conn.reset_mock()
        def get_mock_cursor(*args, **kwargs):
            cursor_class = args[0] if args else kwargs.get("cursor_class", None)
            self.last_cursor = SmartMockCursor(self.pwd_hash, cursor_class=cursor_class, test_case=self)
            return self.last_cursor
        mock_conn.cursor.side_effect = get_mock_cursor

        utils.send_otp_email.reset_mock()

    def _post_with_csrf(self, url, data=None, follow_redirects=True, headers=None):
        """Helper to post form data with a valid CSRF token."""
        with self.client.session_transaction() as sess:
            sess['_csrf_token'] = 'test_csrf_token'
        
        data = data or {}
        data['csrf_token'] = 'test_csrf_token'
        return self.client.post(url, data=data, follow_redirects=follow_redirects, headers=headers)

    # ==================== 1. Basic Page Tests ====================

    def test_health_endpoint(self):
        response = self.client.get('/health')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"status": "ok"})

    def test_home_page(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)

    def test_legal_endpoints(self):
        endpoints = ['/privacy-policy', '/terms-of-service', '/data-deletion', '/support', '/contact', '/user-guide']
        for url in endpoints:
            with self.subTest(url=url):
                response = self.client.get(url)
                self.assertEqual(response.status_code, 200)

    # ==================== 2. Auth & Registration Tests ====================

    def test_login_success(self):
        response = self._post_with_csrf('/login/', data={
            'username': 'testuser',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 200)
        with self.client.session_transaction() as sess:
            self.assertEqual(sess.get('user_id'), 1)

    def test_login_failure_wrong_password(self):
        response = self._post_with_csrf('/login/', data={
            'username': 'testuser',
            'password': 'wrongpassword'
        })
        text = html.unescape(response.get_data(as_text=True))
        self.assertIn("Mật khẩu không đúng", text)

    def test_registration_post_otp(self):
        response = self._post_with_csrf('/register/', data={
            'fullname': 'New User',
            'email': 'newuser@gmail.com',
            'username': 'newuser',
            'password': 'newpassword123',
            'confirmPassword': 'newpassword123',
            'terms': 'on'
        })
        self.assertEqual(response.status_code, 200)
        utils.send_otp_email.assert_called_once()

    def test_verify_otp_success(self):
        otp_code = "123456"
        otp_hash = generate_password_hash(otp_code)
        
        with self.client.session_transaction() as sess:
            sess['reg_fullname'] = 'New User'
            sess['reg_username'] = 'newuser'
            sess['reg_email'] = 'newuser@gmail.com'
            sess['reg_pwd_hash'] = 'hashed_password'
            sess['reg_otp_hash'] = otp_hash
            sess['reg_otp_expiry'] = time.time() + 300
            sess['reg_otp_attempts'] = 0

        response = self._post_with_csrf('/register/verify-otp', data={
            'otp': otp_code
        })
        self.assertEqual(response.status_code, 200)
        with self.client.session_transaction() as sess:
            self.assertNotIn('reg_email', sess)

    # ==================== 3. Settings & Password Reset ====================

    def test_forgot_password_initiate(self):
        response = self._post_with_csrf('/account/forgot', data={
            'email': 'test@example.com'
        })
        self.assertEqual(response.status_code, 200)
        utils.send_otp_email.assert_called_once()

    def test_change_password_success(self):
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1
            sess['username'] = 'testuser'

        response = self._post_with_csrf('/settings/', data={
            'theme': 'light',
            'fullname': 'Test User',
            'current_password': 'password123',
            'new_password': 'newpassword123',
            'confirm_new_password': 'newpassword123'
        })
        self.assertEqual(response.status_code, 200)

    # ==================== 4. Quota & Upgrades ====================

    def test_watch_ad_complete(self):
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1
            sess['role'] = 'user'

        response = self._post_with_csrf('/predict/watch-ad/complete')
        self.assertEqual(response.status_code, 200)

    def test_checkout_post(self):
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1

        response = self._post_with_csrf('/predict/checkout', data={
            'plan': 'pro'
        }, headers={'X-Requested-With': 'XMLHttpRequest'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('order_id', response.json)
        with self.client.session_transaction() as sess:
            self.assertIn('pending_payment', sess)

    # ==================== 5. SePay Webhooks ====================

    def test_sepay_webhook_valid_confirm(self):
        headers = {'Authorization': 'Apikey test_sepay_key'}
        webhook_payload = {
            "id": 1234567,
            "transferType": "in",
            "transferAmount": 5000,
            "referenceCode": "DOGAI PRO ORD123",
            "content": "DOGAI PRO ORD123"
        }
        response = self.client.post('/webhook/sepay', json=webhook_payload, headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"success": True})

    # ==================== 6. Admin Panel Tests ====================

    def test_admin_list_users(self):
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1
            sess['username'] = 'admin'
            sess['role'] = 'admin'

        response = self.client.get('/users/')
        self.assertEqual(response.status_code, 200)

    def test_admin_lock_user(self):
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1
            sess['username'] = 'admin'
            sess['role'] = 'admin'

        response = self._post_with_csrf('/users/lock/2')
        self.assertEqual(response.status_code, 200)

    def test_admin_delete_user(self):
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1
            sess['username'] = 'admin'
            sess['role'] = 'admin'

        response = self._post_with_csrf('/users/delete/2', data={'confirm': 'DELETE'})
        self.assertEqual(response.status_code, 200)

    def test_admin_system_config_get(self):
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1
            sess['username'] = 'admin'
            sess['role'] = 'admin'

        response = self.client.get('/users/system-config')
        self.assertEqual(response.status_code, 200)

    def test_admin_system_config_save(self):
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1
            sess['username'] = 'admin'
            sess['role'] = 'admin'

        response = self._post_with_csrf('/users/system-config/save', data={
            'site_email': 'support@newpet.ai',
            'plan_basic_price': '2000',
            'plan_basic_days': '10',
            'plan_basic_scans': '60',
            'plan_pro_price': '6000',
            'plan_pro_days': '35',
            'plan_pro_scans': '250',
            'plan_enterprise_price': '20000',
            'plan_enterprise_days': '100',
            'plan_enterprise_scans': 'unlimited'
        }, follow_redirects=False)
        self.assertEqual(response.status_code, 302)

    def test_admin_system_config_save_legal(self):
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1
            sess['username'] = 'admin'
            sess['role'] = 'admin'

        response = self._post_with_csrf('/users/system-config/save-legal', data={
            'page': 'privacy-policy',
            'content_vi': '<p>Chính sách bảo mật mới</p>',
            'content_en': '<p>New privacy policy</p>'
        }, follow_redirects=False)
        self.assertEqual(response.status_code, 302)

    def test_admin_reset_legal_config(self):
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1
            sess['username'] = 'admin'
            sess['role'] = 'admin'

        response = self._post_with_csrf('/users/system-config/reset-legal', data={
            'page': 'privacy-policy'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'"success":true', response.data.replace(b' ', b''))

    def test_admin_get_legal_versions(self):
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1
            sess['username'] = 'admin'
            sess['role'] = 'admin'

        response = self.client.get('/users/system-config/legal-versions?page=privacy-policy')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'"success":true', response.data.replace(b' ', b''))
        self.assertIn(b'versions', response.data)

    def test_admin_restore_legal_version(self):
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1
            sess['username'] = 'admin'
            sess['role'] = 'admin'

        response = self._post_with_csrf('/users/system-config/restore-version', data={
            'version_id': '1'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'"success":true', response.data.replace(b' ', b''))

    def test_user_delete_request(self):
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1
            sess['username'] = 'testuser'
            sess['email'] = 'test@example.com'

        response = self._post_with_csrf('/account/delete/request', data={
            'reason': 'No longer needed'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'"success":true', response.data.replace(b' ', b''))

    def test_user_delete_confirm(self):
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1
            sess['username'] = 'testuser'
            sess['email'] = 'test@example.com'
            sess['delete_reason_pending'] = 'No longer needed'

        response = self._post_with_csrf('/account/delete/confirm', data={
            'otp': '123456'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'"success":true', response.data.replace(b' ', b''))

    def test_admin_delete_request_blocked(self):
        self.mock_user_role = "admin"
        self.mock_other_admins_count = 0
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1
            sess['username'] = 'admin'
            sess['email'] = 'admin@example.com'

        response = self._post_with_csrf('/account/delete/request', data={
            'reason': 'Only admin deleting'
        })
        self.assertEqual(response.status_code, 400)
        import json
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data["success"], False)
        self.assertIn("Quản trị viên (Admin) hoạt động duy nhất", data["message"])

    def test_admin_delete_request_blocked_en(self):
        self.mock_user_role = "admin"
        self.mock_other_admins_count = 0
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1
            sess['username'] = 'admin'
            sess['email'] = 'admin@example.com'

        self.client.set_cookie('siteLanguage', 'en')
        response = self._post_with_csrf('/account/delete/request', data={
            'reason': 'Only admin deleting'
        })
        self.assertEqual(response.status_code, 400)
        import json
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data["success"], False)
        self.assertIn("You are the only active Administrator", data["message"])

    def test_admin_delete_request_allowed(self):
        self.mock_user_role = "admin"
        self.mock_other_admins_count = 1
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1
            sess['username'] = 'admin'
            sess['email'] = 'admin@example.com'

        response = self._post_with_csrf('/account/delete/request', data={
            'reason': 'One of many admins'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'"success":true', response.data.replace(b' ', b''))

if __name__ == '__main__':
    unittest.main()
