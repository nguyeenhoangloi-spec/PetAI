# home.py
# Blueprint trang chủ

from flask import Blueprint, render_template

home_bp = Blueprint("home", __name__)


@home_bp.route("/")
def index():
    from flask import session, redirect, url_for, request
    if session.get("user_id"):
        is_admin = session.get("role") == "admin"
        is_edit = request.args.get("edit") == "true"
        is_preview = request.args.get("preview") == "true"
        if not (is_admin or is_edit or is_preview):
            return redirect(url_for("dashboard.dashboard"))
    # Trang chủ là landing page công khai: luôn hiển thị nền sáng (không theo theme khu vực bên trong)
    return render_template("home.html", force_light_theme=True)
