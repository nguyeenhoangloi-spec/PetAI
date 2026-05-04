import hmac
import secrets

from flask import session, request, redirect, url_for, flash, jsonify


def register_block_inactive_users(app):
    """Register a before_request handler that signs out locked users.

    Logic mirrors previous implementation in app.py without changing behavior.
    """

    @app.before_request
    def _block_inactive_users():
        user_id_raw = session.get("user_id")
        if user_id_raw is None:
            return None

        endpoint = (request.endpoint or "")
        # Allow static, login, logout to avoid redirect loops
        if endpoint.startswith("static") or endpoint.startswith("login.") or endpoint.startswith("logout."):
            return None

        try:
            from connect import get_connection

            user_id = int(user_id_raw)
            conn = get_connection()
            try:
                with conn.cursor() as cur:
                    cur.execute("SELECT is_active FROM users WHERE id = %s", (user_id,))
                    row = cur.fetchone()
                    is_active = bool(row[0]) if row else False
            finally:
                conn.close()

            if not is_active:
                session.clear()
                flash("Tài khoản đã bị khóa. Vui lòng đăng nhập lại.", "error")
                return redirect(url_for("login.login"))
        except Exception:
            # If DB fails, do not block request to avoid app-wide outage
            return None

        return None


def register_csrf_protection(app):
    """Register lightweight CSRF protection for state-changing requests."""

    exempt_endpoints = {
        "sepay.webhook_sepay",
        "sepay.webhook_sepay_root_alias",
    }

    def _get_or_create_csrf_token() -> str:
        token = session.get("_csrf_token")
        if not token:
            token = secrets.token_urlsafe(32)
            session["_csrf_token"] = token
        return token

    @app.context_processor
    def _inject_csrf_token():
        return {"csrf_token": _get_or_create_csrf_token}

    @app.before_request
    def _verify_csrf_token():
        if request.method not in {"POST", "PUT", "PATCH", "DELETE"}:
            return None

        endpoint = (request.endpoint or "")
        if endpoint.startswith("static") or endpoint in exempt_endpoints:
            return None

        expected = session.get("_csrf_token")
        if not expected:
            _get_or_create_csrf_token()
            expected = session.get("_csrf_token")

        provided = (
            request.headers.get("X-CSRF-Token")
            or request.form.get("csrf_token")
        )

        if not provided and request.is_json:
            payload = request.get_json(silent=True) or {}
            provided = payload.get("csrf_token")

        ok = bool(expected and provided and hmac.compare_digest(str(expected), str(provided)))
        if ok:
            return None

        if request.is_json or request.headers.get("X-CSRF-Token"):
            return jsonify({"success": False, "error": "CSRF token invalid or missing."}), 400

        flash("Phiên thao tác không hợp lệ (CSRF). Vui lòng thử lại.", "error")
        return redirect(request.referrer or url_for("home.index"))
