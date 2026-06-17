def register_context_processors(app):
    """Register global context processors (e.g., UI theme, plan)."""

    @app.context_processor
    def inject_ui_prefs():
        current_plan = None
        ui_language = "vi"
        ui_theme = "light"
        from flask import session

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
                finally:
                    conn.close()
            except Exception:
                current_plan = None

        return {
            "ui_theme": ui_theme,
            "current_plan": current_plan,
            "ui_language": ui_language,
        }
