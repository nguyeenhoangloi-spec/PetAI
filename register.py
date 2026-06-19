# register.py
# Blueprint đăng ký nâng cấp với xác thực OTP

from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from werkzeug.security import generate_password_hash, check_password_hash
from connect import get_connection
from pymysql.cursors import DictCursor
import re
import random
import string
import time
from utils import send_otp_email

register_bp = Blueprint("register", __name__)


def validate_email(email):
    """Kiểm tra định dạng email"""
    email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return re.match(email_regex, email) is not None


def validate_username(username):
    """Kiểm tra username: 3-20 ký tự, chỉ chứa chữ, số, gạch dưới"""
    username_regex = r'^[a-zA-Z0-9_]{3,20}$'
    return re.match(username_regex, username) is not None


def validate_password_strength(password):
    """
    Kiểm tra độ mạnh mật khẩu
    Returns: (is_valid, message)
    """
    if len(password) < 6:
        return False, "Mật khẩu phải có ít nhất 6 ký tự"
    return True, ""


@register_bp.route("/", methods=["GET", "POST"])
def register():
    # Nếu đã đăng nhập, chuyển hướng về dashboard
    if session.get("user_id"):
        return redirect(url_for("dashboard.dashboard"))

    if request.method == "POST":
        # Lấy dữ liệu từ form
        fullname = request.form.get("fullname", "").strip()
        email = request.form.get("email", "").strip().lower()
        username = request.form.get("username", "").strip().lower()
        password = request.form.get("password", "")
        confirm_password = request.form.get("confirmPassword", "")
        terms = request.form.get("terms") == "on"
        
        # Validation cơ bản
        if not all([fullname, email, username, password, confirm_password]):
            flash("Vui lòng nhập đầy đủ thông tin", "error")
            return render_template("register.html", fullname=fullname, email=email, username=username, terms=terms)
            
        if not terms:
            flash("Bạn phải đồng ý với điều khoản dịch vụ và chính sách bảo mật", "error")
            return render_template("register.html", fullname=fullname, email=email, username=username, terms=terms)
        
        # Kiểm tra họ tên
        if len(fullname) < 2:
            flash("Họ và tên phải có ít nhất 2 ký tự", "error")
            return render_template("register.html", fullname=fullname, email=email, username=username, terms=terms)
        
        # Kiểm tra email Gmail
        if not email.endswith("@gmail.com") or not validate_email(email):
            flash("Chỉ chấp nhận email đăng ký có đuôi @gmail.com", "error")
            return render_template("register.html", fullname=fullname, email=email, username=username, terms=terms)
        
        # Kiểm tra username
        if not validate_username(username):
            flash("Tên đăng nhập phải có 3-20 ký tự, chỉ chứa chữ cái, số và dấu gạch dưới", "error")
            return render_template("register.html", fullname=fullname, email=email, username=username, terms=terms)
        
        # Kiểm tra mật khẩu
        is_valid, error_msg = validate_password_strength(password)
        if not is_valid:
            flash(error_msg, "error")
            return render_template("register.html", fullname=fullname, email=email, username=username, terms=terms)
        
        # Kiểm tra xác nhận mật khẩu
        if password != confirm_password:
            flash("Mật khẩu xác nhận không khớp", "error")
            return render_template("register.html", fullname=fullname, email=email, username=username, terms=terms)

        conn = get_connection()
        try:
            with conn.cursor(DictCursor) as cur:
                # Kiểm tra trùng username
                cur.execute("SELECT 1 FROM users WHERE username = %s", (username,))
                if cur.fetchone():
                    flash("Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.", "error")
                    return render_template("register.html", fullname=fullname, email=email, username=username, terms=terms)
                
                # Kiểm tra trùng email
                cur.execute("SELECT 1 FROM users WHERE email = %s", (email,))
                if cur.fetchone():
                    flash("Email đã được sử dụng. Vui lòng sử dụng email khác.", "error")
                    return render_template("register.html", fullname=fullname, email=email, username=username, terms=terms)
        except Exception as e:
            print(f"[REGISTER VALIDATION ERROR] {e}")
            flash("Lỗi kết nối cơ sở dữ liệu. Vui lòng thử lại.", "error")
            return render_template("register.html", fullname=fullname, email=email, username=username, terms=terms)
        finally:
            conn.close()

        # Tạo mã OTP 6 chữ số
        otp = "".join(random.choices(string.digits, k=6))
        otp_hash = generate_password_hash(otp)
        pwd_hash = generate_password_hash(password)
        
        # Gửi OTP qua Gmail
        subject = "[PetAI] Mã OTP xác thực tài khoản đăng ký mới"
        body_html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <h2 style="color: #004ac6; text-align: center;">Chào mừng bạn đến với PetAI!</h2>
                    <p>Cảm ơn bạn đã đăng ký tài khoản. Để hoàn tất quá trình tạo tài khoản, vui lòng sử dụng mã OTP dưới đây để xác thực email của bạn:</p>
                    <div style="font-size: 32px; font-weight: bold; text-align: center; color: #004ac6; padding: 15px; margin: 20px 0; background-color: #f8f9ff; border-radius: 6px; letter-spacing: 4px;">
                        {otp}
                    </div>
                    <p>Mã OTP này có thời hạn sử dụng là <b>5 phút</b> và chỉ có hiệu lực cho lượt đăng ký này.</p>
                    <p style="color: #e53e3e; font-size: 14px;"><i>Lưu ý: Không chia sẻ mã OTP này với bất kỳ ai để bảo vệ thông tin tài khoản của bạn.</i></p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                    <p style="font-size: 12px; color: #718096; text-align: center;">Đây là email tự động từ hệ thống PetAI. Vui lòng không phản hồi email này.</p>
                </div>
            </body>
        </html>
        """
        
        try:
            send_otp_email(email, subject, body_html)
        except Exception as e:
            print(f"[REGISTER SEND MAIL ERROR] {e}")
            flash("Không thể gửi email OTP. Vui lòng kiểm tra lại cấu hình email hoặc thử lại sau.", "error")
            return render_template("register.html")

        # Lưu dữ liệu đăng ký tạm thời vào session
        session["reg_fullname"] = fullname
        session["reg_username"] = username
        session["reg_email"] = email
        session["reg_pwd_hash"] = pwd_hash
        session["reg_otp_hash"] = otp_hash
        session["reg_otp_expiry"] = time.time() + 300  # 5 phút
        session["reg_otp_attempts"] = 0
        session["reg_resend_timestamps"] = [time.time()]

        flash("Mã OTP đã được gửi về Gmail của bạn. Vui lòng xác thực.", "success")
        return redirect(url_for("register.verify_otp"))
            
    return render_template("register.html")


@register_bp.route("/verify-otp", methods=["GET", "POST"])
def verify_otp():
    if session.get("user_id"):
        return redirect(url_for("dashboard.dashboard"))

    # Kiểm tra xem có thông tin đăng ký tạm trong session không
    if not session.get("reg_email"):
        flash("Không tìm thấy thông tin đăng ký. Vui lòng thực hiện đăng ký lại.", "error")
        return redirect(url_for("register.register"))

    if request.method == "POST":
        user_otp = request.form.get("otp", "").strip()
        if not user_otp:
            flash("Vui lòng nhập mã OTP", "error")
            return render_template("register_otp.html", email=session.get("reg_email"))

        # Kiểm tra số lần nhập sai
        attempts = session.get("reg_otp_attempts", 0) + 1
        session["reg_otp_attempts"] = attempts

        if attempts > 5:
            # Xóa session đăng ký tạm
            session.pop("reg_fullname", None)
            session.pop("reg_username", None)
            session.pop("reg_email", None)
            session.pop("reg_pwd_hash", None)
            session.pop("reg_otp_hash", None)
            session.pop("reg_otp_expiry", None)
            session.pop("reg_otp_attempts", None)
            session.pop("reg_resend_timestamps", None)
            flash("Bạn đã nhập sai OTP quá 5 lần. Vui lòng đăng ký lại từ đầu.", "error")
            return redirect(url_for("register.register"))

        # Kiểm tra OTP hết hạn
        expiry = session.get("reg_otp_expiry", 0)
        if time.time() > expiry:
            flash("Mã OTP đã hết hạn. Vui lòng bấm gửi lại mã.", "error")
            return render_template("register_otp.html", email=session.get("reg_email"))

        # Kiểm tra khớp OTP
        otp_hash = session.get("reg_otp_hash", "")
        if check_password_hash(otp_hash, user_otp):
            # Tạo tài khoản chính thức trong DB
            fullname = session.get("reg_fullname")
            username = session.get("reg_username")
            email = session.get("reg_email")
            pwd_hash = session.get("reg_pwd_hash")

            conn = get_connection()
            try:
                with conn.cursor(DictCursor) as cur:
                    cur.execute(
                        """
                        INSERT INTO users (username, password_hash, email, fullname, created_at, email_verified, force_change_password) 
                        VALUES (%s, %s, %s, %s, NOW(), 1, 0)
                        """,
                        (username, pwd_hash, email, fullname),
                    )
                    conn.commit()
                
                # Xóa dữ liệu tạm trong session
                session.pop("reg_fullname", None)
                session.pop("reg_username", None)
                session.pop("reg_email", None)
                session.pop("reg_pwd_hash", None)
                session.pop("reg_otp_hash", None)
                session.pop("reg_otp_expiry", None)
                session.pop("reg_otp_attempts", None)
                session.pop("reg_resend_timestamps", None)

                flash(f"Xác thực thành công! Chúc mừng {fullname}, tài khoản của bạn đã được kích hoạt. Vui lòng đăng nhập.", "success")
                # Gửi email chào mừng
                try:
                    from notifications import send_welcome_email
                    send_welcome_email(email, fullname)
                except Exception:
                    pass
                return redirect(url_for("login.login"))
            except Exception as e:
                conn.rollback()
                print(f"[REGISTER SAVE ERROR] {e}")
                flash("Không thể tạo tài khoản do lỗi hệ thống. Vui lòng thử lại.", "error")
            finally:
                conn.close()
        else:
            flash(f"Mã OTP không chính xác. Bạn còn {5 - attempts} lần nhập.", "error")

    return render_template("register_otp.html", email=session.get("reg_email"))


@register_bp.route("/resend-otp", methods=["POST"])
def resend_otp():
    if session.get("user_id"):
        return redirect(url_for("dashboard.dashboard"))

    if not session.get("reg_email"):
        flash("Không tìm thấy thông tin đăng ký. Vui lòng thực hiện đăng ký lại.", "error")
        return redirect(url_for("register.register"))

    # Kiểm tra rate limit: tối đa 3 lần trong 10 phút
    now = time.time()
    resend_timestamps = session.get("reg_resend_timestamps", [])
    
    # Lọc các lần resend trong 10 phút qua (600 giây)
    resend_timestamps = [t for t in resend_timestamps if now - t < 600]
    
    if len(resend_timestamps) >= 3:
        flash("Bạn đã yêu cầu gửi lại mã OTP quá 3 lần trong vòng 10 phút. Vui lòng đợi thêm trước khi thử lại.", "error")
        return redirect(url_for("register.verify_otp"))

    # Sinh OTP mới
    otp = "".join(random.choices(string.digits, k=6))
    otp_hash = generate_password_hash(otp)
    email = session.get("reg_email")

    subject = "[PetAI] Mã OTP xác thực tài khoản đăng ký mới (Gửi lại)"
    body_html = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #004ac6; text-align: center;">Xác thực tài khoản PetAI</h2>
                <p>Bạn đã yêu cầu gửi lại mã OTP. Vui lòng sử dụng mã OTP dưới đây để hoàn tất việc xác thực tài khoản đăng ký:</p>
                <div style="font-size: 32px; font-weight: bold; text-align: center; color: #004ac6; padding: 15px; margin: 20px 0; background-color: #f8f9ff; border-radius: 6px; letter-spacing: 4px;">
                    {otp}
                </div>
                <p>Mã OTP này có thời hạn sử dụng là <b>5 phút</b>.</p>
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
        print(f"[REGISTER RESEND MAIL ERROR] {e}")
        flash("Không thể gửi email OTP. Vui lòng thử lại sau.", "error")
        return redirect(url_for("register.verify_otp"))

    # Cập nhật session
    session["reg_otp_hash"] = otp_hash
    session["reg_otp_expiry"] = now + 300  # 5 phút từ bây giờ
    session["reg_otp_attempts"] = 0  # reset số lần thử cho mã mới
    resend_timestamps.append(now)
    session["reg_resend_timestamps"] = resend_timestamps

    flash("Mã OTP mới đã được gửi thành công về Gmail của bạn.", "success")
    return redirect(url_for("register.verify_otp"))
