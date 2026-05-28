# logout.py
# Blueprint đăng xuất

from flask import Blueprint, redirect, url_for, flash, session

logout_bp = Blueprint("logout", __name__)


@logout_bp.route("/")
def logout():
    session.clear()
    flash("Bạn đã đăng xuất.", "info")
    return redirect(url_for("home.index"))
