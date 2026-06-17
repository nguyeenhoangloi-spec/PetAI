# scratch/test_routes.py
import sys
import os

# Adjust path to import files correctly
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app
from connect import get_connection

def test_payment_routes():
    print("Connecting to DB to find a test user...")
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            # Find or insert a default test user
            cur.execute("SELECT id, username FROM users LIMIT 1")
            user_row = cur.fetchone()
            if not user_row:
                print("No user found in database. Inserting a temporary test user...")
                cur.execute(
                    "INSERT INTO users (username, password_hash, email, fullname, role) "
                    "VALUES ('test_verifier', 'pbkdf2:sha256...', 'test_verifier@gmail.com', 'Test Verifier', 'user')"
                )
                conn.commit()
                cur.execute("SELECT id, username FROM users WHERE username = 'test_verifier'")
                user_row = cur.fetchone()
            
            user_id = user_row[0]
            username = user_row[1]
            print(f"Using test user ID: {user_id}, username: {username}")

            # Create a fresh user for checkout test to ensure no active plan rules block checkout
            cur.execute("DELETE FROM users WHERE username = 'verify_checkout_user'")
            conn.commit()
            cur.execute(
                "INSERT INTO users (username, password_hash, email, fullname, role) "
                "VALUES ('verify_checkout_user', 'pbkdf2:sha256...', 'verify_checkout_user@gmail.com', 'Verify Checkout', 'user')"
            )
            conn.commit()
            cur.execute("SELECT id, username FROM users WHERE username = 'verify_checkout_user'")
            checkout_user_row = cur.fetchone()
            checkout_user_id = checkout_user_row[0]
            checkout_username = checkout_user_row[1]
            print(f"Using checkout test user ID: {checkout_user_id}, username: {checkout_username}")

            # Find or insert a payment order for testing
            cur.execute("SELECT order_id FROM payment_orders WHERE user_id = %s LIMIT 1", (user_id,))
            order_row = cur.fetchone()
            if not order_row:
                print("Inserting a temporary payment order...")
                cur.execute(
                    "INSERT INTO payment_orders (order_id, user_id, plan, payment_method, amount_vnd, status) "
                    "VALUES ('verifyorder12', %s, 'pro', 'qr', 5000, 'pending')",
                    (user_id,)
                )
                conn.commit()
                order_id = 'verifyorder12'
            else:
                order_id = order_row[0]
            print(f"Using order ID: {order_id}")
    finally:
        conn.close()

    # Disable CSRF in tests to simplify requests
    app.config["WTF_CSRF_ENABLED"] = False
    app.config["TESTING"] = True

    client = app.test_client()

    print("\n--- Testing GET /predict/payments ---")
    with client.session_transaction() as sess:
        sess['user_id'] = user_id
        sess['username'] = username
        sess['role'] = 'user'

    response = client.get("/predict/payments")
    print(f"Status Code: {response.status_code}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    print("Page rendered successfully!")

    # Verify if 'showPaymentSuccessBill' is present in HTML (meaning modal is integrated)
    html_content = response.data.decode('utf-8')
    assert "showPaymentSuccessBill" in html_content, "Modal code not found in HTML!"
    assert "invoiceModal" in html_content, "invoiceModal not found in HTML!"
    print("✓ Modal markup and script elements found in history page HTML!")

    print("\n--- Testing GET /predict/payments/status ---")
    response_status = client.get(f"/predict/payments/status?order_id={order_id}")
    print(f"Status Code: {response_status.status_code}")
    assert response_status.status_code == 200, f"Expected 200, got {response_status.status_code}"
    
    json_data = response_status.get_json()
    print("JSON Response:", json_data)
    assert json_data.get("success") is True, "Expected success to be True"
    assert "amount_vnd" in json_data, "Expected amount_vnd in enriched response"
    assert "payment_method" in json_data, "Expected payment_method in enriched response"
    assert "user" in json_data, "Expected user info in enriched response"
    assert json_data["user"].get("username") == username, "Expected correct user details in enriched response"
    print("✓ Status API returned enriched JSON correctly!")

    print("\n--- Testing POST /predict/checkout ---")
    with client.session_transaction() as sess:
        sess['user_id'] = checkout_user_id
        sess['username'] = checkout_username
        sess['role'] = 'user'
        sess['_csrf_token'] = 'test_csrf_token'

    response_checkout = client.post("/predict/checkout", data={
        "plan": "pro",
        "csrf_token": "test_csrf_token"
    })
    print(f"Status Code: {response_checkout.status_code}")
    assert response_checkout.status_code == 200, f"Expected 200, got {response_checkout.status_code}"
    print("Checkout page rendered successfully!")
    
    checkout_html = response_checkout.data.decode('utf-8')
    assert "paymentStatusDot" in checkout_html, "paymentStatusDot element not found in checkout HTML!"
    assert "invoiceModal" in checkout_html, "invoiceModal not found in checkout HTML!"
    assert "Tôi đã chuyển tiền" not in checkout_html, "Manual confirm button still present in checkout HTML!"
    print("✓ Modal markup, script, and auto-checking alert container found in checkout HTML!")
    print("✓ 'Tôi đã chuyển tiền' button successfully removed from checkout HTML!")

    print("\nAll integration checks passed successfully! Backend & templates verified.")

if __name__ == "__main__":
    test_payment_routes()
