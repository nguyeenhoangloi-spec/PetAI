# ...existing code...
# upload.py
# Blueprint xử lý upload ảnh và dự đoán

from flask import Blueprint, request, redirect, url_for, flash, render_template, current_app, session, send_file, jsonify
from predict import ImagePredictor
from werkzeug.utils import secure_filename
import cv2
import numpy as np
import os
from io import BytesIO
import uuid
from urllib.parse import quote_plus

# --- YOLOv8 integration ---
from ultralytics import YOLO

# --- Database integration ---
from connect import get_connection
from models import PredictionHistory, UserQuota, PaymentOrder
from vietqr import build_vietqr_payload

try:
	import qrcode
except Exception:
	qrcode = None

predict_bp = Blueprint("predict", __name__)
predictor = ImagePredictor()


def _env_float(name: str, default: float) -> float:
	raw = os.getenv(name)
	if raw is None:
		return default
	try:
		return float(raw)
	except (TypeError, ValueError):
		return default


def _get_session_user_id() -> int | None:
	user_id_raw = session.get("user_id")
	if user_id_raw is None:
		return None
	try:
		return int(user_id_raw)
	except (TypeError, ValueError):
		return None

# Base detection model (COCO dog/cat)
det_model = YOLO('yolov8s.pt')        # Detection/classification

# Dùng hoàn toàn predictor mới (classifier + prototypes), không ghi đè bằng YOLO breed cũ.
breed_model = None

# Trang upload ảnh: chỉ hiển thị form nếu đã đăng nhập
@predict_bp.route("/upload-page", methods=["GET"])
def upload_page():
	user_id = _get_session_user_id()
	if user_id is None:
		flash("Vui lòng đăng nhập để sử dụng chức năng này.", "warning")
		return redirect(url_for("login.login"))

	open_watch_ad = str(request.args.get("watch_ad", "")).lower() in {"1", "true", "yes"}

	quota_info = None
	try:
		role = session.get("role", "user")
		if role == "user":
			conn = get_connection()
			try:
				quota = UserQuota.get_or_create(conn, user_id)
				total_predictions = PredictionHistory.count_by_user(conn, user_id)
				plan = quota.get("plan", "free")
				quota_info = {
					"plan": plan,
					"plan_expire": quota.get("plan_expire"),
					"free_limit": UserQuota.FREE_PREDICTIONS,
					"total_predictions": int(total_predictions or 0),
					"remaining_free": max(0, UserQuota.FREE_PREDICTIONS - int(total_predictions or 0)),
					"ad_views_used": int(quota.get("ad_views_used", 0)),
					"ad_views_limit": UserQuota.MAX_AD_VIEWS,
					"ad_views_remaining": max(0, UserQuota.MAX_AD_VIEWS - int(quota.get("ad_views_used", 0))),
					"ad_unlocks_remaining": int(quota.get("ad_unlocks_remaining", 0)),
				}
				# Nếu đã có gói pro/basic/enterprise thì không kiểm tra quota miễn phí/quảng cáo nữa
				if plan in ("pro", "enterprise", "basic"):
					quota_info["remaining_free"] = None
					quota_info["ad_views_remaining"] = None
					quota_info["ad_unlocks_remaining"] = None
			finally:
				conn.close()
	except Exception:
		quota_info = None

	return render_template(
		"upload_page.html",
		quota_info=quota_info,
		open_watch_ad=open_watch_ad,
	)


@predict_bp.route("/watch-ad", methods=["GET"])
def watch_ad():
	user_id = _get_session_user_id()
	if user_id is None:
		flash("Vui lòng đăng nhập để sử dụng chức năng này.", "warning")
		return redirect(url_for("login.login"))

	# Admin / non-user role bỏ qua
	if session.get("role") != "user":
		return redirect(url_for("predict.upload_page"))

	return redirect(url_for("predict.upload_page", watch_ad=1))


@predict_bp.route("/watch-ad/complete", methods=["POST"])
def watch_ad_complete():
	user_id = _get_session_user_id()
	if user_id is None:
		flash("Vui lòng đăng nhập để sử dụng chức năng này.", "warning")
		return redirect(url_for("login.login"))
	if session.get("role") != "user":
		return redirect(url_for("predict.upload_page"))

	conn = None
	try:
		conn = get_connection()
		quota = UserQuota.get_or_create(conn, user_id)
		# Nếu đã nâng gói (không còn free), không cần xem quảng cáo
		if quota.get("plan") != "free":
			return redirect(url_for("predict.upload_page"))

		updated = UserQuota.mark_ad_watched(conn, user_id)
		if updated is None:
			flash("Bạn đã xem đủ 3 lần quảng cáo. Vui lòng mua gói để tiếp tục.", "warning")
			return redirect(url_for("predict.upgrade"))
		flash("Đã mở khóa thêm 3 lượt nhận diện. Bạn có thể tiếp tục!", "success")
		return redirect(url_for("predict.upload_page"))
	except Exception as e:
		print("[ADS] complete error:", e)
		flash("Không thể ghi nhận quảng cáo. Vui lòng thử lại.", "error")
		return redirect(url_for("predict.watch_ad"))
	finally:
		if conn:
			conn.close()


@predict_bp.route("/upgrade", methods=["GET"])
def upgrade():
	if _get_session_user_id() is None:
		flash("Vui lòng đăng nhập để sử dụng chức năng này.", "warning")
		return redirect(url_for("login.login"))
	return render_template("upgrade.html")


def _plan_price_vnd(plan: str) -> int:
	plan = (plan or "").lower()
	if plan == "basic":
		return 1000
	if plan == "pro":
		return 5000
	if plan == "enterprise":
		return 15000
	return 0


def _plan_expire_for(plan: str):
	from datetime import datetime, timedelta

	plan = (plan or "free").lower()
	now = datetime.now()
	if plan == "pro":
		return now + timedelta(days=30)
	if plan == "enterprise":
		return now + timedelta(days=90)
	if plan == "basic":
		return now + timedelta(days=7)
	return None


def _auto_apply_plan_for_order(conn, user_id: int, plan: str) -> None:
	# Ensure quota row exists
	UserQuota.get_or_create(conn, user_id)
	UserQuota.set_plan_upgrade_only(conn, user_id, (plan or "free").lower(), _plan_expire_for(plan))


@predict_bp.route("/checkout", methods=["GET"])
def checkout_get():
	return redirect(url_for("predict.upgrade"))


@predict_bp.route("/checkout", methods=["POST"])
def checkout():
	"""Trang thanh toán."""
	user_id = _get_session_user_id()
	if user_id is None:
		flash("Vui lòng đăng nhập để sử dụng chức năng này.", "warning")
		return redirect(url_for("login.login"))

	plan = (request.form.get("plan") or "pro").strip().lower()
	payment_method = "qr"
	allowed_plans = {"basic", "pro", "enterprise"}
	if plan not in allowed_plans:
		plan = "pro"

	# --- Purchase rules ---
	# - Allow upgrade anytime (basic -> pro -> enterprise)
	# - Do NOT allow buying lower plan while current plan is active
	# - Renewing the same plan is allowed only after expiry
	from datetime import datetime
	plan_rank = {"free": 0, "basic": 1, "pro": 2, "enterprise": 3}
	conn = None
	try:
		conn = get_connection()
		quota = UserQuota.get_or_create(conn, user_id)
		current_plan = str(quota.get("plan") or "free").lower()
		current_expire = quota.get("plan_expire")
		current_paid_uses = quota.get("paid_uses_remaining")
		now = datetime.now()
		active = bool(current_plan != "free" and (current_expire is None or current_expire > now))

		if active:
			cur_rank = int(plan_rank.get(current_plan, 0))
			new_rank = int(plan_rank.get(plan, 0))

			if new_rank < cur_rank:
				flash("Bạn đang có gói cao hơn còn hiệu lực. Không thể mua gói thấp hơn.", "warning")
				return redirect(url_for("predict.upgrade"))

			if new_rank == cur_rank:
				# Renew same plan only when expired OR out of paid uses
				out_of_uses = (current_paid_uses is not None and int(current_paid_uses) <= 0)
				if not out_of_uses:
					flash("Gói hiện tại của bạn vẫn còn lượt sử dụng. Chỉ có thể gia hạn khi hết hạn hoặc đã hết lượt.", "info")
					return redirect(url_for("predict.upgrade"))
	finally:
		if conn:
			conn.close()

	order_id = uuid.uuid4().hex[:12]
	amount_vnd = _plan_price_vnd(plan)

	# Lưu order vào DB để admin theo dõi + session để xác nhận sau
	conn = None
	try:
		conn = get_connection()
		PaymentOrder.create_order(
			conn,
			order_id=order_id,
			user_id=user_id,
			plan=plan,
			payment_method=payment_method,
			amount_vnd=amount_vnd,
		)
	finally:
		if conn:
			conn.close()

	session["pending_payment"] = {"order_id": order_id}

	return render_template(
		"checkout.html",
		order_id=order_id,
		plan=plan,
		payment_method=payment_method,
		amount_vnd=amount_vnd,
		qr_available=bool(qrcode),
	)


@predict_bp.route("/payment/qr.png", methods=["GET"])
def payment_qr_png():
	"""Trả về ảnh QR PNG cho đơn hàng pending trong session (demo)."""
	user_id = _get_session_user_id()
	if user_id is None:
		return ("Unauthorized", 401)

	pending = session.get("pending_payment") or {}
	order_id = pending.get("order_id")
	if not order_id:
		return ("No pending order", 404)

	conn = None
	try:
		conn = get_connection()
		order = PaymentOrder.get_by_order_id(conn, order_id)
	finally:
		if conn:
			conn.close()

	order_user_id = None
	if order is not None:
		raw_user_id = order.get("user_id")
		if raw_user_id is not None:
			try:
				order_user_id = int(raw_user_id)
			except (TypeError, ValueError):
				order_user_id = None
	if not order or order_user_id != user_id:
		return ("Order not found", 404)

	plan = order.get("plan")
	method = order.get("payment_method")
	amount = order.get("amount_vnd")

	# VietQR payload chuẩn (EMVCo). Nếu chưa cấu hình ngân hàng thì fallback demo.
	bank_bin = (current_app.config.get("VIETQR_BANK_BIN") or "").strip()
	bank_account = (current_app.config.get("VIETQR_ACCOUNT_NUMBER") or "").strip()
	bank_name = (current_app.config.get("VIETQR_BANK_NAME") or "").strip()
	account_name = (current_app.config.get("VIETQR_ACCOUNT_NAME") or "").strip()
	merchant_city = (current_app.config.get("VIETQR_MERCHANT_CITY") or "HANOI").strip()
	merchant_name = (current_app.config.get("VIETQR_MERCHANT_NAME") or account_name or "DOG AI APP").strip()
	qr_api_base = (current_app.config.get("SEPAY_QR_API") or "").strip()

	try:
		if bank_bin and bank_account and qr_api_base:
			# Prefer remote VietQR image (often more compatible with banking apps)
			# Format: {base}/{BIN}-{ACCOUNT}-compact2.png?amount=...&addInfo=...&accountName=...
			add_info = f"DOGAI {(str(plan or 'pro')).upper()} {order_id}".strip()
			qr_url = (
				f"{qr_api_base.rstrip('/')}/{bank_bin}-{bank_account}-compact2.png"
				f"?amount={int(amount or 0)}"
				f"&addInfo={quote_plus(add_info)}"
			)
			if account_name:
				qr_url += f"&accountName={quote_plus(account_name)}"
			return redirect(qr_url, code=302)

		if bank_bin and bank_account:
			payload = build_vietqr_payload(
				bank_bin=bank_bin,
				account_number=bank_account,
				amount_vnd=int(amount or 0),
				order_id=str(order_id),
				purpose=f"DOGAI {(str(plan or 'pro')).upper()} {order_id}",
				account_name=account_name,
				merchant_name=merchant_name,
				merchant_city=merchant_city,
			)
		else:
			payload = f"DOGAI_PAY|ORDER={order_id}|PLAN={plan}|METHOD={method}|AMOUNT_VND={amount}|USER={session.get('username','user')}"
	except Exception:
		payload = f"DOGAI_PAY|ORDER={order_id}|PLAN={plan}|METHOD={method}|AMOUNT_VND={amount}|USER={session.get('username','user')}"

	if qrcode is None:
		return ("QR generator missing. Install 'qrcode' package.", 500)
	# Generate a larger, more scannable QR
	try:
		try:
			from qrcode.constants import ERROR_CORRECT_M as _ERROR_CORRECT_M
			error_correction = _ERROR_CORRECT_M
		except Exception:
			error_correction = 0
		qr = qrcode.QRCode(
			error_correction=error_correction,
			box_size=10,
			border=4,
		)
		qr.add_data(payload)
		qr.make(fit=True)
		img = qr.make_image(fill_color="black", back_color="white")
	except Exception:
		img = qrcode.make(payload)
	buf = BytesIO()
	img.save(buf, "PNG")
	buf.seek(0)
	return send_file(buf, mimetype="image/png")


@predict_bp.route("/payments/status", methods=["GET"])
def payment_status():
	user_id = _get_session_user_id()
	if user_id is None:
		return jsonify({"success": False, "error": "unauthorized"}), 401

	order_id = (request.args.get("order_id") or "").strip()
	if not order_id:
		pending = session.get("pending_payment") or {}
		order_id = (pending.get("order_id") or "").strip()

	if not order_id:
		return jsonify({"success": False, "error": "missing_order_id"}), 400

	conn = None
	try:
		conn = get_connection()
		order = PaymentOrder.get_by_order_id(conn, order_id)
		if not order or int(order.get("user_id") or 0) != int(user_id):
			return jsonify({"success": False, "error": "not_found"}), 404

		status = (order.get("status") or PaymentOrder.STATUS_PENDING).lower()
		confirmed_at = order.get("confirmed_at")
		confirmed_at_str = None
		if confirmed_at:
			try:
				confirmed_at_str = confirmed_at.strftime("%Y-%m-%d %H:%M:%S")
			except Exception:
				confirmed_at_str = str(confirmed_at)

		created_at = order.get("created_at")
		created_at_str = None
		if created_at:
			try:
				created_at_str = created_at.strftime("%Y-%m-%d %H:%M:%S")
			except Exception:
				created_at_str = str(created_at)

		order_plan = (order.get("plan") or "free").lower()
		quota = UserQuota.get_or_create(conn, user_id)
		current_plan = (quota.get("plan") or "free").lower()

		if status == PaymentOrder.STATUS_PAID:
			# Sync plan if webhook updated order but quota is stale
			if order_plan and current_plan != order_plan:
				UserQuota.set_plan(conn, user_id, order_plan, _plan_expire_for(order_plan))
				quota = UserQuota.get_or_create(conn, user_id)
				current_plan = (quota.get("plan") or "free").lower()

			pending = session.get("pending_payment") or {}
			if (pending.get("order_id") or "") == order_id:
				try:
					session.pop("pending_payment", None)
				except Exception:
					pass

		user_info = {}
		with conn.cursor() as cur:
			cur.execute("SELECT username, fullname, email FROM users WHERE id = %s", (user_id,))
			user_row = cur.fetchone()
			if user_row:
				user_info = {
					"username": user_row[0],
					"fullname": user_row[1],
					"email": user_row[2]
				}

		return jsonify(
			{
				"success": True,
				"order_id": order_id,
				"status": status,
				"order_plan": order_plan,
				"current_plan": current_plan,
				"confirmed_at": confirmed_at_str,
				"created_at": created_at_str,
				"amount_vnd": order.get("amount_vnd"),
				"payment_method": order.get("payment_method"),
				"user": user_info,
			}
		)
	finally:
		if conn:
			conn.close()


@predict_bp.route("/upgrade/buy", methods=["POST"])
def upgrade_buy():
	"""Legacy demo endpoint.

	Hiện tại: user chỉ được "báo đã chuyển tiền"; admin mới xác nhận để cấp gói.
	"""
	user_id = _get_session_user_id()
	if user_id is None:
		flash("Vui lòng đăng nhập để sử dụng chức năng này.", "warning")
		return redirect(url_for("login.login"))

	# Nếu đi qua trang checkout, bắt buộc khớp order_id trong session
	posted_order_id = (request.form.get("order_id") or "").strip()
	pending = session.get("pending_payment")
	plan = (request.form.get("plan") or "pro").strip().lower()
	payment_method = (request.form.get("payment_method") or "qr").strip().lower()
	if pending:
		if posted_order_id != (pending.get("order_id") or ""):
			flash("Đơn thanh toán không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.", "error")
			return redirect(url_for("predict.upgrade"))
		order_id = pending.get("order_id")
		try:
			conn_tmp = get_connection()
			try:
				order = PaymentOrder.get_by_order_id(conn_tmp, order_id)
				if order:
					plan = (order.get("plan") or plan).strip().lower()
					payment_method = (order.get("payment_method") or payment_method).strip().lower()
			finally:
				conn_tmp.close()
		except Exception:
			pass
	else:
		order_id = ""

	allowed_plans = {"basic", "pro", "enterprise"}
	allowed_payments = {"qr", "momo", "vnpay", "bank", "card"}
	if plan not in allowed_plans:
		plan = "pro"
	if payment_method not in allowed_payments:
		payment_method = "qr"

	conn = None
	try:
		conn = get_connection()
		allow_manual = bool(current_app.config.get("ALLOW_MANUAL_TRANSFER_CONFIRM", True))
		auto_confirm = bool(current_app.config.get("AUTO_CONFIRM_ON_USER_CONFIRM", False))
		if not allow_manual:
			flash("Hệ thống đang dùng xác nhận tự động. Vui lòng chờ hệ thống ghi nhận giao dịch.", "info")
			return redirect(url_for("predict.my_payments"))
		if not pending:
			flash("Luồng thanh toán đã thay đổi. Hãy tạo đơn ở trang nâng cấp trước.", "warning")
			return redirect(url_for("predict.upgrade"))

		order = PaymentOrder.get_by_order_id(conn, order_id)
		order_user_id = None
		if order is not None:
			raw_user_id = order.get("user_id")
			if raw_user_id is not None:
				try:
					order_user_id = int(raw_user_id)
				except (TypeError, ValueError):
					order_user_id = None
		if not order or order_user_id != user_id:
			flash("Đơn thanh toán không tồn tại hoặc không hợp lệ.", "error")
			return redirect(url_for("predict.upgrade"))

		ok = PaymentOrder.mark_user_confirmed(conn, order_id, user_id=user_id)
		# Demo option: auto-confirm immediately after user clicks
		if ok and auto_confirm:
			paid_ok = PaymentOrder.mark_paid(conn, order_id)
			if paid_ok:
				try:
					_auto_apply_plan_for_order(conn, int(user_id), str(order.get("plan") or "free"))
				except Exception:
					pass
		try:
			session.pop("pending_payment", None)
		except Exception:
			pass
		if ok:
			if auto_confirm:
				flash("Đã xác nhận thanh toán và kích hoạt gói của bạn.", "success")
			else:
				flash("Đã ghi nhận bạn đã chuyển tiền. Đơn hàng đang chờ admin xác nhận.", "info")
		else:
			flash("Không thể ghi nhận (đơn có thể đã được báo/đã xác nhận).", "warning")
		return redirect(url_for("predict.my_payments"))
	except Exception as e:
		print("[UPGRADE] buy error:", e)
		flash("Không thể ghi nhận thanh toán. Vui lòng thử lại.", "error")
		return redirect(url_for("predict.my_payments"))
	finally:
		if conn:
			conn.close()


@predict_bp.route("/payments/confirm-transfer", methods=["POST"])
def confirm_transfer():
	"""User bấm 'Tôi đã chuyển tiền' (pending -> user_confirmed)."""
	user_id = _get_session_user_id()
	if user_id is None:
		flash("Vui lòng đăng nhập để sử dụng chức năng này.", "warning")
		return redirect(url_for("login.login"))

	action = (request.form.get("action") or "").strip().lower()

	order_id = (request.form.get("order_id") or "").strip()
	if not order_id:
		# fallback: lấy từ session nếu user xác nhận ngay tại trang checkout
		pending = session.get("pending_payment") or {}
		order_id = (pending.get("order_id") or "").strip()

	if not order_id:
		flash("Thiếu mã đơn thanh toán.", "error")
		return redirect(url_for("predict.my_payments"))

	conn = None
	try:
		conn = get_connection()
		order = PaymentOrder.get_by_order_id(conn, order_id)
		if not order or int(order.get("user_id") or 0) != int(user_id):
			flash("Đơn thanh toán không tồn tại hoặc không thuộc tài khoản của bạn.", "error")
			return redirect(url_for("predict.my_payments"))

		if action == "check":
			status = (order.get("status") or PaymentOrder.STATUS_PENDING).lower()
			if status == PaymentOrder.STATUS_PAID:
				plan_label = str(order.get("plan") or "free").upper()
				flash(f"Gói {plan_label} vừa mua thành công.", "success")
			else:
				flash("Bạn chưa thanh toán.", "warning")
			return redirect(url_for("predict.upgrade"))

		allow_manual = bool(current_app.config.get("ALLOW_MANUAL_TRANSFER_CONFIRM", True))
		auto_confirm = bool(current_app.config.get("AUTO_CONFIRM_ON_USER_CONFIRM", False))
		if not allow_manual:
			flash("Hệ thống sẽ tự xác nhận khi nhận được giao dịch. Bạn không cần bấm xác nhận thủ công.", "info")
			return redirect(url_for("predict.my_payments"))

		ok = PaymentOrder.mark_user_confirmed(conn, order_id, user_id=user_id)
		# Demo option: auto-confirm immediately after user clicks
		if ok and auto_confirm:
			paid_ok = PaymentOrder.mark_paid(conn, order_id)
			if paid_ok:
				try:
					_auto_apply_plan_for_order(conn, int(user_id), str(order.get("plan") or "free"))
				except Exception:
					pass
		try:
			session.pop("pending_payment", None)
		except Exception:
			pass
		if ok:
			if auto_confirm:
				flash("Đã xác nhận thanh toán và kích hoạt gói của bạn.", "success")
			else:
				flash("Đã ghi nhận bạn đã chuyển tiền. Đơn hàng đang chờ admin xác nhận.", "info")
		else:
			flash("Không thể ghi nhận (đơn có thể đã được báo/đã xác nhận).", "warning")
		return redirect(url_for("predict.my_payments"))
	except Exception as e:
		print("[PAYMENT] confirm-transfer error:", e)
		flash("Không thể ghi nhận chuyển tiền. Vui lòng thử lại.", "error")
		return redirect(url_for("predict.my_payments"))
	finally:
		if conn:
			conn.close()


@predict_bp.route("/payments", methods=["GET"])
def my_payments():
	user_id = _get_session_user_id()
	if user_id is None:
		flash("Vui lòng đăng nhập để xem lịch sử thanh toán.", "warning")
		return redirect(url_for("login.login"))
	if session.get("role") != "user":
		flash("Trang này chỉ dành cho tài khoản người dùng.", "warning")
		return redirect(url_for("users.confirmations_list"))

	conn = None
	quota_info = {}
	orders = []
	try:
		conn = get_connection()
		orders = PaymentOrder.list_by_user(conn, user_id, limit=50) or []
		quota = UserQuota.get_or_create(conn, user_id)
		quota_info = {
			"plan": quota.get("plan", "free"),
			"plan_expire": quota.get("plan_expire"),
		}
	finally:
		if conn:
			conn.close()

	try:
		seen = session.get("seen_paid_orders")
		if not isinstance(seen, list):
			seen = []
		paid_order = next(
			(o for o in orders if (o.get("status") or "").lower() == PaymentOrder.STATUS_PAID and o.get("order_id") not in seen),
			None,
		)
		if paid_order:
			order_id = paid_order.get("order_id")
			flash(f"Thanh toán thành công cho đơn {order_id}.", "success")
			seen.append(order_id)
			session["seen_paid_orders"] = seen[-20:]
	except Exception:
		pass

	# Check for automatic display of latest paid invoice in session
	auto_show_invoice = None
	try:
		shown_invoices = session.get("shown_invoice_ids")
		if not isinstance(shown_invoices, list):
			shown_invoices = []
		
		# Find the latest paid order
		latest_paid_order = next(
			(o for o in orders if (o.get("status") or "").lower() == "paid"),
			None
		)
		
		if latest_paid_order:
			ord_id = latest_paid_order.get("order_id")
			if ord_id not in shown_invoices:
				# Fetch user info for invoice
				conn_usr = get_connection()
				try:
					with conn_usr.cursor() as cur:
						cur.execute("SELECT username, fullname, email FROM users WHERE id = %s", (user_id,))
						user_row = cur.fetchone()
						u_info = {}
						if user_row:
							u_info = {
								"username": user_row[0],
								"fullname": user_row[1],
								"email": user_row[2]
							}
					
					confirmed_at = latest_paid_order.get("confirmed_at")
					confirmed_at_str = None
					if confirmed_at:
						try:
							confirmed_at_str = confirmed_at.strftime("%Y-%m-%d %H:%M:%S")
						except Exception:
							confirmed_at_str = str(confirmed_at)
					
					created_at = latest_paid_order.get("created_at")
					created_at_str = None
					if created_at:
						try:
							created_at_str = created_at.strftime("%Y-%m-%d %H:%M:%S")
						except Exception:
							created_at_str = str(created_at)

					auto_show_invoice = {
						"order_id": ord_id,
						"status": "paid",
						"order_plan": latest_paid_order.get("plan"),
						"current_plan": quota_info.get("plan"),
						"confirmed_at": confirmed_at_str,
						"created_at": created_at_str,
						"amount_vnd": latest_paid_order.get("amount_vnd"),
						"payment_method": latest_paid_order.get("payment_method"),
						"user": u_info,
					}
					shown_invoices.append(ord_id)
					session["shown_invoice_ids"] = shown_invoices[-20:]
				finally:
					conn_usr.close()
	except Exception as e:
		print("Error building auto_show_invoice:", e)

	return render_template("payments_user.html", orders=orders, quota_info=quota_info, auto_show_invoice=auto_show_invoice)


def allowed_file(filename: str) -> bool:
	allowed = current_app.config.get("ALLOWED_EXTENSIONS", {"png", "jpg", "jpeg"})
	return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed


@predict_bp.route("/upload", methods=["POST"])
def upload():
	# Bắt buộc đăng nhập mới được sử dụng chức năng này
	user_id = _get_session_user_id()
	if user_id is None:
		flash("Vui lòng đăng nhập để sử dụng chức năng này.", "warning")
		return redirect(url_for("login.login"))

	# Chấp nhận cả key image (mặc định) và file (fallback)
	file = request.files.get("image") or request.files.get("file")
	if file is None:
		flash("Vui lòng chọn ảnh trước khi bấm phân tích.", "warning")
		return redirect(url_for("predict.upload_page"))
	fname = (file.filename if file is not None else None) or ""
	if fname == "":
		flash("Bạn chưa chọn ảnh. Vui lòng tải ảnh lên rồi thử lại.", "warning")
		return redirect(url_for("predict.upload_page"))
	if file and allowed_file(fname):
		filename = secure_filename(fname)
		upload_dir = current_app.config.get("UPLOAD_FOLDER")
		if not upload_dir:
			upload_dir = os.path.join("static", "uploads")
		os.makedirs(upload_dir, exist_ok=True)
		save_path = os.path.join(upload_dir, filename)

		# --- Quota gate (only for role=user) ---
		try:
			role = session.get("role", "user")
			if role == "user":
				conn_q = get_connection()
				try:
					quota = UserQuota.get_or_create(conn_q, user_id)
					# Gói trả phí: bỏ qua giới hạn/ads
					if quota.get("plan") == "free":
						total_predictions = PredictionHistory.count_by_user(conn_q, user_id)
						if int(total_predictions or 0) >= UserQuota.FREE_PREDICTIONS:
							# hết free -> cần unlock từ quảng cáo
							if int(quota.get("ad_unlocks_remaining", 0)) <= 0:
								if int(quota.get("ad_views_used", 0)) >= UserQuota.MAX_AD_VIEWS:
									flash("Bạn đã dùng hết 10 lượt miễn phí và 3 lượt xem quảng cáo. Vui lòng mua gói để tiếp tục.", "warning")
									return redirect(url_for("predict.upgrade"))
								flash("Bạn đã dùng hết 10 lượt miễn phí. Vui lòng xem quảng cáo để mở khóa thêm.", "info")
								return redirect(url_for("predict.watch_ad"))
							# Consume 1 unlock cho lần nhận diện này
							if not UserQuota.consume_ad_unlock(conn_q, user_id):
								flash("Vui lòng xem quảng cáo để mở khóa thêm lượt nhận diện.", "info")
								return redirect(url_for("predict.watch_ad"))
					else:
						# Paid plan enforcement (expiry + remaining uses)
						from datetime import datetime
						exp = quota.get("plan_expire")
						uses = quota.get("paid_uses_remaining")
						now = datetime.now()
						if exp is not None and exp <= now:
							flash("Gói của bạn đã hết hạn. Vui lòng gia hạn để tiếp tục.", "warning")
							return redirect(url_for("predict.upgrade"))
						if uses is not None and int(uses) <= 0:
							flash("Bạn đã hết lượt sử dụng của gói hiện tại. Vui lòng gia hạn để tiếp tục.", "warning")
							return redirect(url_for("predict.upgrade"))
				finally:
					conn_q.close()
		except Exception as e:
			print("[QUOTA] gate error:", e)

		try:
			file.save(save_path)
		except Exception:
			flash("Không thể lưu ảnh tải lên. Vui lòng thử lại với ảnh khác.", "error")
			return redirect(url_for("predict.upload_page"))


		# --- YOLOv8 inference ---
		# Lưu ý: mô hình detect (yolov8s.pt) không có probs.top1 như mô hình classify.
		# Thay vào đó dùng boxes.cls để lấy class id, map sang tên và chỉ xác nhận "dog".
		try:
			det_conf = _env_float("YOLO_GATE_MIN_CONF", 0.12)
			det_results = det_model(save_path, conf=det_conf, verbose=False)
			r = det_results[0]
			names = getattr(r, 'names', {}) or {}
			det_label = 'Unknown'
			det_items = []
			if hasattr(r, 'boxes') and r.boxes is not None and getattr(r.boxes, 'cls', None) is not None:
				cls_list = r.boxes.cls.tolist()
				# Trường hợp chỉ 1 phần tử có thể là float -> chuyển về list
				if not isinstance(cls_list, list):
					cls_list = [cls_list]
				labels = []
				for ci in cls_list:
					try:
						labels.append(str(names[int(ci)]).strip().lower())
					except Exception:
						continue
				# Lấy conf và bbox nếu có để hiển thị chi tiết
				confs = r.boxes.conf.tolist() if getattr(r.boxes, 'conf', None) is not None else [None] * len(labels)
				xyxy = r.boxes.xyxy.tolist() if getattr(r.boxes, 'xyxy', None) is not None else [None] * len(labels)
				for lab, cf, bb in zip(labels, confs, xyxy):
					item = {
						'label': lab,
						'conf': float(cf) if cf is not None else None,
						'bbox': bb,
					}
					det_items.append(item)
				# Chỉ xác nhận CHÓ; không xác nhận MÈO.
				best_dog_conf_local = -1.0
				if hasattr(r.boxes, 'conf') and r.boxes.conf is not None:
					confs = r.boxes.conf.tolist()
					for lab, conf in zip(labels, confs):
						if lab == 'dog' and conf is not None and float(conf) > best_dog_conf_local:
							best_dog_conf_local = float(conf)
				if best_dog_conf_local >= 0.0 or 'dog' in labels:
					det_label = 'Dog'

			# Vẽ bbox lên ảnh (chỉ cho dog) nếu có bbox
			annotated_path = save_path
			try:
				if det_items:
					img = cv2.imread(save_path)
					if img is not None:
						for it in det_items:
							bb = it.get('bbox')
							lab = it.get('label')
							if not bb or lab != 'dog':
								continue
							x1, y1, x2, y2 = [int(v) for v in bb]
							color = (255, 128, 0)  # BGR
							cv2.rectangle(img, (x1, y1), (x2, y2), color, 2)
							conf_txt = f"{int(round((it.get('conf') or 0)*100))}%"
							label_txt = f"{lab.upper()} {conf_txt if it.get('conf') is not None else ''}"
							# Draw label background
							(tw, th), _ = cv2.getTextSize(label_txt, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
							cv2.rectangle(img, (x1, max(y1- th - 6, 0)), (x1 + tw + 6, y1), color, -1)
							cv2.putText(img, label_txt, (x1+3, y1-6), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), 2, cv2.LINE_AA)
						# Lưu ảnh annotate cạnh file gốc
						base, ext = os.path.splitext(save_path)
						annotated_path = f"{base}_det{ext}"
						cv2.imwrite(annotated_path, img)
			except Exception as _:
				annotated_path = save_path

		except Exception as e:
			print("YOLO detect error:", e)
			det_label = 'Unknown'
			det_items = []
			annotated_path = save_path

		# Kết quả cũ (HOG+SVM)
		breed_input_path = save_path
		try:
			dog_candidates = [
				it for it in det_items
				if it.get("label") == "dog" and it.get("bbox") is not None
			]
			if dog_candidates:
				best_dog = max(dog_candidates, key=lambda it: float(it.get("conf") or 0.0))
				img_for_crop = cv2.imread(save_path)
				if img_for_crop is not None:
					h, w = img_for_crop.shape[:2]
					x1, y1, x2, y2 = [int(v) for v in best_dog["bbox"]]
					pad_x = int((x2 - x1) * 0.08)
					pad_y = int((y2 - y1) * 0.08)
					x1 = max(0, x1 - pad_x)
					y1 = max(0, y1 - pad_y)
					x2 = min(w, x2 + pad_x)
					y2 = min(h, y2 + pad_y)

					if x2 > x1 and y2 > y1:
						dog_crop = img_for_crop[y1:y2, x1:x2]
						if dog_crop is not None and dog_crop.size > 0:
							base, ext = os.path.splitext(save_path)
							breed_input_path = f"{base}_dogcrop{ext}"
							cv2.imwrite(breed_input_path, dog_crop)
		except Exception as e:
			print("Dog crop fallback error:", e)

		result = predictor.predict(breed_input_path)
		try:
			if isinstance(result, dict):
				parts = result.get("parts_info") or {}
				decision = parts.get("decision") or {}
				top1_sim = decision.get("top1_score")
				top2_sim = decision.get("top2_score")
				gap_sim = decision.get("score_gap")
				if top1_sim is not None or top2_sim is not None or gap_sim is not None:
					print(
						"[SIM] "
						f"Top1={float(top1_sim or 0.0):.3f} "
						f"Top2={float(top2_sim or 0.0):.3f} "
						f"Gap={float(gap_sim or 0.0):.3f}"
					)
		except Exception as e:
			print("[SIM] log error:", e)

		# Tìm confidence dog từ YOLO để hiển thị và quyết định gate.
		dog_confs = [
			float(item.get("conf"))
			for item in det_items
			if item.get("label") == "dog" and item.get("conf") is not None
		]
		best_dog_conf = max(dog_confs) if dog_confs else None

		yolo_conf = best_dog_conf if det_label == "Dog" else None

		# Gate: xác nhận là chó.
		# - Chỉ xác nhận CHÓ hoặc không xác định.
		# - Nếu YOLO bỏ sót chó, cho phép fallback bằng độ tin cậy breed model.
		DOG_THRESHOLD = _env_float("DOG_GATE_YOLO_DOG_THRESHOLD", 0.40)
		BREED_FALLBACK_THRESHOLD = _env_float("DOG_GATE_BREED_FALLBACK_THRESHOLD", 0.55)

		breed_conf_fallback = 0.0
		breed_model_ready = False
		breed_value = ""
		if isinstance(result, dict):
			try:
				breed_conf_fallback = float(result.get("breed_conf", 0.0) or 0.0)
			except Exception:
				breed_conf_fallback = 0.0
			breed_model_ready = bool(result.get("model_ready", False))
			breed_value = str(result.get("breed") or "").strip().lower()

		breed_is_unknown = breed_value in {"", "unknown", "không xác định", "khong xac dinh"}

		yolo_dog_enough = (best_dog_conf is not None) and (float(best_dog_conf) >= DOG_THRESHOLD)
		breed_fallback_enough = (
			breed_model_ready
			and (not breed_is_unknown)
			and (breed_conf_fallback >= BREED_FALLBACK_THRESHOLD)
		)

		is_dog_enough = yolo_dog_enough or breed_fallback_enough
		should_save_prediction = is_dog_enough

		if is_dog_enough and det_label != "Dog":
			det_label = "Dog"
			if yolo_conf is None:
				yolo_conf = best_dog_conf

		if not is_dog_enough:
			# Không chắc chắn là chó nhưng vẫn trả kết quả (kèm cảnh báo).
			note = None
			if best_dog_conf is not None:
				dog_pct = int(round(float(best_dog_conf or 0.0) * 100))
				note = (
					f"Độ tin cậy CHÓ từ YOLO chỉ {dog_pct}% (< {int(DOG_THRESHOLD*100)}%). "
					"Kết quả giống dưới đây chỉ mang tính tham khảo."
				)
			elif breed_model_ready and not breed_is_unknown:
				breed_pct = int(round(float(breed_conf_fallback or 0.0) * 100))
				note = (
					f"AI giống đang nghiêng về chó ({breed_pct}%) nhưng chưa đủ ngưỡng xác nhận. "
					"Kết quả dưới đây chỉ mang tính tham khảo."
				)
			else:
				note = (
					"Ảnh này chưa được nhận diện chắc chắn là CHÓ. "
					"Kết quả giống dưới đây chỉ mang tính tham khảo."
				)
			flash(note, "warning")
			if isinstance(result, dict) and note:
				existing_note = str(result.get("note") or "").strip()
				result["note"] = f"{existing_note} {note}".strip() if existing_note else note

		
		# Lưu vào database (ưu tiên khi đã pass gate chó)
		try:
			if user_id is not None and should_save_prediction:
				conn = get_connection()
				# Consume 1 paid-use after passing the dog gate (paid plans only)
				try:
					quota_now = UserQuota.get_or_create(conn, user_id)
					if str(quota_now.get("plan") or "free").lower() != "free":
						if not UserQuota.consume_paid_use(conn, user_id):
							flash("Bạn đã hết lượt sử dụng. Vui lòng gia hạn để tiếp tục.", "warning")
							conn.close()
							return redirect(url_for("predict.upgrade"))
				except Exception:
					# If quota consume fails, don't block prediction
					pass
				breed_to_save = result.get('breed', 'Unknown') if isinstance(result, dict) else 'Unknown'
				conf_to_save = result.get('breed_conf', 0.0) if isinstance(result, dict) else 0.0
				PredictionHistory.save(
					conn, 
					user_id,
					annotated_path.replace("\\", "/"),
					breed_to_save,
					float(conf_to_save) if conf_to_save else 0.0,
					det_label
				)
				conn.close()
		except Exception as e:
			print(f"Warning: Could not save to history: {e}")
		
		return render_template(
			"predict.html",
			image_path=annotated_path.replace("\\", "/"),
			result=result,
			yolo_species=det_label,
			yolo_species_conf=yolo_conf,
			yolo_detections=det_items,
		)

	flash("Định dạng file không được hỗ trợ. Chỉ chấp nhận JPG, JPEG, PNG.", "error")
	return redirect(url_for("predict.upload_page"))
