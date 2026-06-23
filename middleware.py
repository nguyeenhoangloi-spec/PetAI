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
                    cur.execute(
                        "SELECT is_active, force_change_password, account_status FROM users WHERE id = %s",
                        (user_id,),
                    )
                    row = cur.fetchone()
                    if row:
                        is_active = bool(row[0])
                        force_change_password = bool(row[1])
                        account_status = row[2] or "active"
                    else:
                        is_active = False
                        force_change_password = False
                        account_status = "active"
            finally:
                conn.close()

            # Tài khoản bị xóa hoàn toàn
            if account_status == "deleted" or not is_active:
                session.clear()
                flash("Tài khoản đã bị khóa hoặc đã xóa. Vui lòng liên hệ hỗ trợ.", "error")
                return redirect(url_for("login.login"))

            # Tài khoản đang chờ xóa — chỉ cho phép vào trang pending và logout
            if account_status == "pending_delete":
                allowed_pending = (
                    endpoint.startswith("account_delete.") or
                    endpoint.startswith("logout.") or
                    endpoint.startswith("static")
                )
                if not allowed_pending:
                    return redirect(url_for("account_delete.delete_pending"))

            # Ép buộc đổi mật khẩu nếu đang dùng mật khẩu tạm thời
            if force_change_password and account_status == "active":
                if not endpoint.startswith("settings."):
                    flash("Bạn đang sử dụng mật khẩu tạm thời. Vui lòng đổi mật khẩu mới để tiếp tục sử dụng hệ thống.", "warning")
                    return redirect(url_for("settings.settings"))
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


def register_html_translation(app):
    """Register response processor that translates HTML when language is 'en'."""

    @app.after_request
    def translate_response(response):
        # Only translate HTML documents
        if response.mimetype == "text/html":
            # Prevent browser caching of HTML pages to ensure language switching is instant and correct
            response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, max-age=0"
            response.headers["Pragma"] = "no-cache"
            response.headers["Expires"] = "0"
            response.headers["Vary"] = "Cookie"

            if "Content-Encoding" in response.headers:
                return response
            
            from flask import request, session
            import json
            from connect import get_connection
            from models import SystemConfig
            
            lang = request.cookies.get("siteLanguage")
            home_vi = {}
            home_en = {}
            site_desc_vi = "Ứng dụng nhận diện giống chó bằng AI dành cho người yêu thú cưng. Kết quả chính xác, nhanh chóng."
            site_desc_en = "AI-powered dog breed identification app for pet lovers. Fast and accurate results."
            conn = None
            try:
                conn = get_connection()
                user_id_raw = session.get("user_id")
                if not lang and user_id_raw is not None:
                    from models import UserSettings
                    user_settings = UserSettings.get_or_create(conn, int(user_id_raw))
                    lang = (user_settings or {}).get("language")
                if not lang:
                    lang = SystemConfig.get(conn, "default_lang", "vi")
                
                # Fetch custom translations from DB
                raw_vi = SystemConfig.get(conn, "home_content_vi", "{}")
                raw_en = SystemConfig.get(conn, "home_content_en", "{}")
                if isinstance(raw_vi, str):
                    try:
                        home_vi = json.loads(raw_vi)
                    except Exception:
                        pass
                elif isinstance(raw_vi, dict):
                    home_vi = raw_vi
                    
                if isinstance(raw_en, str):
                    try:
                        home_en = json.loads(raw_en)
                    except Exception:
                        pass
                elif isinstance(raw_en, dict):
                    home_en = raw_en

                # Also fetch site descriptions
                site_desc_vi = SystemConfig.get(conn, "site_description_vi", SystemConfig.get(conn, "site_description", site_desc_vi))
                site_desc_en = SystemConfig.get(conn, "site_description_en", site_desc_en)
            except Exception:
                pass
            finally:
                if conn:
                    conn.close()
                    
            if lang not in {"vi", "en"}:
                lang = "vi"

            if lang in {"en", "vi"}:
                try:
                    from i18n_server import translate_html
                    html_content = response.get_data(as_text=True)
                    dynamic_translations = dict(home_vi if lang == "vi" else home_en)
                    dynamic_translations["footerDesc"] = site_desc_vi if lang == "vi" else site_desc_en
                    dynamic_translations["footerDescText"] = site_desc_vi if lang == "vi" else site_desc_en
                    translated_html = translate_html(html_content, lang, dynamic_translations)
                    response.set_data(translated_html)
                except Exception as e:
                    app.logger.error(f"[i18n middleware] Error in translation: {e}")
        return response


def register_maintenance_mode(app):
    """Register a before_request handler to block users when maintenance mode is active.

    Allows admin, static files, login/logout, health checks, and payment webhooks to bypass.
    """

    @app.before_request
    def _check_maintenance_mode():
        # Check if maintenance mode is enabled in DB
        from connect import get_connection
        from models import SystemConfig
        
        maintenance_active = False
        conn = None
        try:
            conn = get_connection()
            val = SystemConfig.get(conn, "maintenance_mode", "0")
            maintenance_active = (val == "1")
        except Exception:
            pass
        finally:
            if conn:
                conn.close()
                
        if not maintenance_active:
            return None
            
        # Admin is allowed to bypass maintenance mode
        if session.get("role") == "admin":
            return None
            
        # Exempt endpoints
        endpoint = (request.endpoint or "")
        exempt_endpoints = {
            "login.login",
            "login.login_google",
            "login.google_authorized",
            "logout.logout",
            "health.health_check",
            "sepay.webhook_sepay",
            "sepay.webhook_sepay_root_alias",
        }
        
        if endpoint.startswith("static") or endpoint in exempt_endpoints:
            return None
            
        # Render maintenance page (using error.html with 503)
        from flask import render_template
        
        # Get language for error message
        lang = request.cookies.get("siteLanguage")
        if not lang:
            try:
                conn = get_connection()
                lang = SystemConfig.get(conn, "default_lang", "vi")
                conn.close()
            except Exception:
                lang = "vi"
        if lang not in {"vi", "en"}:
            lang = "vi"
            
        if lang == "en":
            message = "We are currently performing scheduled maintenance. Please check back later. Thank you for your patience."
        else:
            message = "Hệ thống đang được bảo trì định kỳ. Vui lòng quay lại sau. Xin cảm ơn sự kiên nhẫn của bạn."
            
        return render_template("error.html", code=503, message=message), 503


