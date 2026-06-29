from flask import render_template


def register_error_handlers(app):
    """Register common HTTP error handlers."""

    @app.errorhandler(403)
    def handle_forbidden(e):
        return render_template("error.html", code=403, message="Bạn không có quyền truy cập chức năng này."), 403

    @app.errorhandler(404)
    def handle_not_found(e):
        return render_template("error.html", code=404, message="Không tìm thấy trang hoặc tài nguyên yêu cầu."), 404

    @app.errorhandler(500)
    def handle_server_error(e):
        import traceback
        tb = traceback.format_exc()
        err_msg = f"Lỗi hệ thống: {e}<pre style='text-align:left; font-size:12px; margin-top:20px; white-space:pre-wrap; background:#fee2e2; padding:15px; border-radius:8px; border:1px solid #fca5a5; overflow-x:auto;'>{tb}</pre>"
        return render_template("error.html", code=500, message=err_msg), 500
