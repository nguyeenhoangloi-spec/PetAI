def register_context_processors(app):
    """Register global context processors (e.g., UI theme, plan)."""

    @app.context_processor
    def inject_ui_prefs():
        current_plan = None
        ui_language = "vi"
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
                    current_plan = (quota or {}).get("plan") or "free"
                    user_settings = UserSettings.get_or_create(conn, user_id)
                    lang_raw = (user_settings or {}).get("language")
                    if isinstance(lang_raw, str) and lang_raw.strip().lower() in {"vi", "en"}:
                        ui_language = lang_raw.strip().lower()
                        session["language"] = ui_language
                finally:
                    conn.close()
            except Exception:
                current_plan = None

        session_lang = session.get("language")
        if isinstance(session_lang, str) and session_lang.strip().lower() in {"vi", "en"}:
            ui_language = session_lang.strip().lower()

        def tx(vi_text: str, en_text: str | None = None) -> str:
            if ui_language == "en":
                if en_text is not None:
                    return en_text
            return vi_text

        return {
            "ui_theme": session.get("theme", "light"),
            "current_plan": current_plan,
            "ui_language": ui_language,
            "tx": tx,
        }
