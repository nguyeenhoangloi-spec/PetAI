def register_context_processors(app):
    """Register global context processors (e.g., UI theme, plan)."""

    @app.context_processor
    def inject_ui_prefs():
        current_plan = None
        from flask import session, request
        ui_language = request.cookies.get("siteLanguage", "vi")
        if ui_language not in {"vi", "en"}:
            ui_language = "vi"
        ui_theme = "light"
        ui_avatar_url = "https://lh3.googleusercontent.com/aida-public/AB6AXuABdf7zKSVKEqdGUUjqEkF9ftdFTrLW87Tb24r2IiZiv_JP0LrItrCxl23SH-gYj2Mqtkma0ak9DZbUtKM5nW747pmivDYGVbYhNr1PZbxbFuOrZdGJvnbhdSurFLfL3BcmhN2p1h9wv_6geT-x8eoTG1TDoLL40P8wDiaymvRT--SA4jYjU9A77WIji5FmOi99mPDXw7xS6dUyUNJYU2gHLk4-smzFrCuBbQbgtpATDvNo6hq3YR-cfSaNblImtCnDXIb8np7J4HA"

        user_id_raw = session.get("user_id")
        if user_id_raw is not None:
            try:
                from connect import get_connection
                from models import UserQuota
                from models import UserSettings

                user_id = int(user_id_raw)
                conn = get_connection()
                try:
                    quota = UserQuota.get_or_create(conn, user_id)
                    plan = (quota or {}).get("plan") or "free"
                    expire = (quota or {}).get("plan_expire")
                    paid_uses = (quota or {}).get("paid_uses_remaining")
                    
                    from datetime import datetime
                    now = datetime.now()
                    is_active = (plan != "free" and (expire is None or expire > now))
                    is_out_of_uses = (paid_uses is not None and int(paid_uses) <= 0)
                    
                    if plan != "free" and (not is_active or is_out_of_uses):
                        current_plan = "free"
                    else:
                        current_plan = plan

                    user_settings = UserSettings.get_or_create(conn, user_id)
                    theme_raw = (user_settings or {}).get("theme")
                    if isinstance(theme_raw, str) and theme_raw.strip().lower() in {"light", "dark", "auto"}:
                        ui_theme = theme_raw.strip().lower()

                    # Fetch custom user avatar
                    with conn.cursor() as cur:
                        cur.execute("SELECT avatar_url FROM users WHERE id = %s", (user_id,))
                        row = cur.fetchone()
                        if row and row[0]:
                            ui_avatar_url = row[0]
                finally:
                    conn.close()
            except Exception:
                current_plan = None

        return {
            "ui_theme": ui_theme,
            "current_plan": current_plan,
            "ui_language": ui_language,
            "ui_avatar_url": ui_avatar_url,
        }

    @app.context_processor
    def override_url_for():
        import os
        from flask import url_for as flask_url_for

        def dated_url_for(endpoint, **values):
            if endpoint == "static":
                filename = values.get("filename", None)
                if filename:
                    file_path = os.path.join(app.root_path, app.static_folder, filename)
                    if os.path.exists(file_path):
                        values["q"] = int(os.stat(file_path).st_mtime)
            return flask_url_for(endpoint, **values)

        return dict(url_for=dated_url_for)
