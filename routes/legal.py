from flask import Blueprint, render_template


legal_bp = Blueprint("legal", __name__)


@legal_bp.route("/privacy-policy.html")
@legal_bp.route("/privacy-policy")
def privacy_policy():
	return render_template("privacy-policy.html")


@legal_bp.route("/terms-of-service.html")
@legal_bp.route("/terms-of-service")
def terms_of_service():
	return render_template("terms-of-service.html")


@legal_bp.route("/data-deletion.html")
@legal_bp.route("/data-deletion")
def data_deletion():
	return render_template("data-deletion.html")


@legal_bp.route("/support.html")
@legal_bp.route("/support")
def support():
	return render_template("support.html")


@legal_bp.route("/contact.html")
@legal_bp.route("/contact")
def contact():
	return render_template("contact.html")