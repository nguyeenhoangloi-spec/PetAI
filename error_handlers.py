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
        return render_template("error.html", code=500, message="Lỗi hệ thống. Vui lòng thử lại sau."), 500
