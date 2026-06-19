# account.py
# Blueprint cho các chức năng tài khoản: quên mật khẩu nâng cấp với xác thực OTP

from flask import Blueprint, render_template, request, flash, redirect, url_for, session
from connect import get_connection
from pymysql.cursors import DictCursor
import random
import string
import time
from werkzeug.security import generate_password_hash, check_password_hash
from utils import send_otp_email

account_bp = Blueprint("account", __name__)


@account_bp.route("/forgot", methods=["GET", "POST"])
def forgot():
    """Trang quên mật khẩu"""
    if session.get("user_id"):
        return redirect(url_for("dashboard.dashboard"))

    if request.method == "POST":
        email_or_username = request.form.get("email", "").strip()
        if not email_or_username:
            flash("Vui lòng nhập tên đăng nhập hoặc email", "error")
            return render_template("forgot_password.html")

        # Kiểm tra tài khoản có tồn tại và đã xác thực Gmail không
        conn = get_connection()
        user = None
        try:
            with conn.cursor(DictCursor) as cur:
                cur.execute(
                    "SELECT id, email, email_verified FROM users WHERE email = %s OR username = %s",
                    (email_or_username, email_or_username),
                )
                user = cur.fetchone()
        except Exception as e:
            print(f"[FORGOT PASSWORD ERROR] {e}")
            flash("Lỗi kết nối cơ sở dữ liệu. Vui lòng thử lại sau.", "error")
            return render_template("forgot_password.html")
        finally:
            conn.close()

        # Kiểm tra xem email/username có tồn tại trong hệ thống không
        if not user:
            flash("Email hoặc tên đăng nhập này không tồn tại trong hệ thống. Vui lòng kiểm tra lại.", "error")
            return render_template("forgot_password.html", prefill=email_or_username)

        if not user.get("email_verified"):
            flash("Tài khoản này chưa được xác thực email. Vui lòng liên hệ hỗ trợ.", "error")
            return render_template("forgot_password.html", prefill=email_or_username)

        # Tạo mã OTP 6 chữ số
        otp = "".join(random.choices(string.digits, k=6))
        otp_hash = generate_password_hash(otp)
        
        # Gửi OTP qua email
        email = user["email"]
        subject = "[PetAI] Mã OTP xác thực khôi phục mật khẩu"
        body_html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <h2 style="color: #bc4800; text-align: center;">Yêu cầu khôi phục mật khẩu</h2>
                    <p>Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản PetAI của bạn. Vui lòng sử dụng mã OTP dưới đây để tiếp tục:</p>
                    <div style="font-size: 32px; font-weight: bold; text-align: center; color: #bc4800; padding: 15px; margin: 20px 0; background-color: #ffede6; border-radius: 6px; letter-spacing: 4px;">
                        {otp}
                    </div>
                    <p>Mã OTP này có thời hạn sử dụng là <b>10 phút</b>.</p>
                    <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này hoặc liên hệ hỗ trợ để bảo mật tài khoản.</p>
                    <p style="color: #e53e3e; font-size: 14px;"><i>Lưu ý: Tuyệt đối không cung cấp mã OTP này cho người khác.</i></p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                    <p style="font-size: 12px; color: #718096; text-align: center;">Đây là email tự động từ hệ thống PetAI. Vui lòng không phản hồi email này.</p>
                </div>
            </body>
        </html>
        """
        try:
            send_otp_email(email, subject, body_html)
            
            # Lưu thông tin quên mật khẩu vào session
            session["forgot_user_id"] = user["id"]
            session["forgot_email"] = email
            session["forgot_otp_hash"] = otp_hash
            session["forgot_otp_expiry"] = time.time() + 600  # 10 phút
            session["forgot_otp_attempts"] = 0
            session["forgot_resend_timestamps"] = [time.time()]
        except Exception as e:
            print(f"[FORGOT SEND MAIL ERROR] {e}")
            flash("Hệ thống gửi thư gặp sự cố. Vui lòng thử lại sau.", "error")
            return render_template("forgot_password.html", prefill=email_or_username)

        flash("Mã OTP đã được gửi về Gmail của bạn. Vui lòng xác thực.", "success")
        return redirect(url_for("account.verify_otp_forgot"))

    return render_template("forgot_password.html")


@account_bp.route("/forgot/verify-otp", methods=["GET", "POST"])
def verify_otp_forgot():
    """Trang xác thực OTP quên mật khẩu"""
    if session.get("user_id"):
        return redirect(url_for("dashboard.dashboard"))

    if request.method == "POST":
        user_otp = request.form.get("otp", "").strip()
        if not user_otp:
            flash("Vui lòng nhập mã OTP", "error")
            return render_template("forgot_otp.html")

        # Nếu không có thông tin khôi phục hợp lệ trong session
        if not session.get("forgot_user_id") or not session.get("forgot_otp_hash"):
            flash("Mã OTP không chính xác hoặc đã hết hạn.", "error")
            return render_template("forgot_otp.html")

        # Tăng số lần thử
        attempts = session.get("forgot_otp_attempts", 0) + 1
        session["forgot_otp_attempts"] = attempts

        if attempts > 5:
            # Xóa session khôi phục
            session.pop("forgot_user_id", None)
            session.pop("forgot_email", None)
            session.pop("forgot_otp_hash", None)
            session.pop("forgot_otp_expiry", None)
            session.pop("forgot_otp_attempts", None)
            session.pop("forgot_resend_timestamps", None)
            flash("Bạn đã nhập sai OTP quá 5 lần. Vui lòng yêu cầu khôi phục lại mật khẩu.", "error")
            return redirect(url_for("account.forgot"))

        # Kiểm tra hết hạn
        expiry = session.get("forgot_otp_expiry", 0)
        if time.time() > expiry:
            flash("Mã OTP đã hết hạn. Vui lòng bấm gửi lại mã.", "error")
            return render_template("forgot_otp.html")

        # So sánh OTP
        otp_hash = session.get("forgot_otp_hash", "")
        if check_password_hash(otp_hash, user_otp):
            user_id = session.get("forgot_user_id")

            conn = get_connection()
            try:
                with conn.cursor(DictCursor) as cur:
                    # Lấy thông tin user đầy đủ để thiết lập đăng nhập
                    cur.execute(
                        "SELECT id, username, fullname, email, role, is_active FROM users WHERE id = %s",
                        (user_id,),
                    )
                    user = cur.fetchone()

                    if not user or not user.get("is_active", True):
                        flash("Tài khoản không tồn tại hoặc đã bị khóa.", "error")
                        return render_template("forgot_otp.html")

                    # Đặt force_change_password = 1 để ép buộc đổi mật khẩu khi đăng nhập bằng luồng này
                    cur.execute(
                        "UPDATE users SET force_change_password = 1 WHERE id = %s",
                        (user_id,),
                    )
                    conn.commit()

                # Tự động thiết lập session đăng nhập cho user
                session["user_id"] = user["id"]
                session["username"] = user["username"]
                session["fullname"] = user.get("fullname", user["username"])
                session["email"] = user.get("email")
                session["role"] = user.get("role", "user")
                session["is_admin"] = (session.get("role") == "admin")

                # Xóa dữ liệu tạm quên mật khẩu trong session
                session.pop("forgot_user_id", None)
                session.pop("forgot_email", None)
                session.pop("forgot_otp_hash", None)
                session.pop("forgot_otp_expiry", None)
                session.pop("forgot_otp_attempts", None)
                session.pop("forgot_resend_timestamps", None)

                flash("Xác thực OTP thành công. Vui lòng thiết lập mật khẩu mới cho tài khoản của bạn.", "success")
                return redirect(url_for("settings.settings"))
            except Exception as e:
                conn.rollback()
                print(f"[FORGOT AUTO LOGIN ERROR] {e}")
                flash("Không thể thiết lập đăng nhập do lỗi hệ thống. Vui lòng thử lại sau.", "error")
            finally:
                conn.close()
        else:
            flash(f"Mã OTP không chính xác. Bạn còn {5 - attempts} lần nhập.", "error")

    return render_template("forgot_otp.html")


@account_bp.route("/forgot/resend-otp", methods=["POST"])
def resend_otp_forgot():
    """Gửi lại OTP khôi phục mật khẩu"""
    if session.get("user_id"):
        return redirect(url_for("dashboard.dashboard"))

    # Nếu không có thông tin khôi phục hợp lệ trong session, hiển thị giả lập để tránh làm lộ tài khoản
    if not session.get("forgot_user_id") or not session.get("forgot_email"):
        flash("Mã OTP mới đã được gửi thành công về Gmail của bạn.", "success")
        return redirect(url_for("account.verify_otp_forgot"))

    now = time.time()
    resend_timestamps = session.get("forgot_resend_timestamps", [])
    
    # Lọc các lần resend trong 10 phút qua (600 giây)
    resend_timestamps = [t for t in resend_timestamps if now - t < 600]
    
    if len(resend_timestamps) >= 3:
        flash("Bạn đã yêu cầu gửi lại mã OTP quá 3 lần trong vòng 10 phút. Vui lòng thử lại sau.", "error")
        return redirect(url_for("account.verify_otp_forgot"))

    # Sinh OTP mới
    otp = "".join(random.choices(string.digits, k=6))
    otp_hash = generate_password_hash(otp)
    email = session.get("forgot_email")

    subject = "[PetAI] Mã OTP xác thực khôi phục mật khẩu (Gửi lại)"
    body_html = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #bc4800; text-align: center;">Yêu cầu khôi phục mật khẩu</h2>
                <p>Bạn đã yêu cầu gửi lại mã OTP khôi phục mật khẩu. Vui lòng sử dụng mã dưới đây:</p>
                <div style="font-size: 32px; font-weight: bold; text-align: center; color: #bc4800; padding: 15px; margin: 20px 0; background-color: #ffede6; border-radius: 6px; letter-spacing: 4px;">
                    {otp}
                </div>
                <p>Mã OTP này có thời hạn sử dụng là <b>10 phút</b>.</p>
                <p style="color: #e53e3e; font-size: 14px;"><i>Lưu ý: Không chia sẻ mã OTP này với bất kỳ ai.</i></p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                <p style="font-size: 12px; color: #718096; text-align: center;">Đây là email tự động từ hệ thống PetAI. Vui lòng không phản hồi email này.</p>
            </div>
        </body>
    </html>
    """

    try:
        send_otp_email(email, subject, body_html)
    except Exception as e:
        print(f"[FORGOT RESEND MAIL ERROR] {e}")
        flash("Không thể gửi email OTP. Vui lòng thử lại sau.", "error")
        return redirect(url_for("account.verify_otp_forgot"))

    # Cập nhật session
    session["forgot_otp_hash"] = otp_hash
    session["forgot_otp_expiry"] = now + 600  # 10 phút từ bây giờ
    session["forgot_otp_attempts"] = 0  # reset số lần thử cho mã mới
    resend_timestamps.append(now)
    session["forgot_resend_timestamps"] = resend_timestamps

    flash("Mã OTP mới đã được gửi thành công về Gmail của bạn.", "success")
    return redirect(url_for("account.verify_otp_forgot"))
