# connect.py
# Kết nối tới MySQL (PyMySQL) theo cấu hình biến môi trường.

import os
import pymysql


def get_connection():
    host = os.environ.get("MYSQL_HOST", os.environ.get("DB_HOST", "localhost"))
    database = os.environ.get("MYSQL_DATABASE", os.environ.get("DB_NAME", "khoaluantn"))
    user = os.environ.get("MYSQL_USER", os.environ.get("DB_USER", "root"))
    password = os.environ.get("MYSQL_PASSWORD", os.environ.get("DB_PASSWORD", "$7MvguT0qZtCqvtk"))
    port = int(os.environ.get("MYSQL_PORT", os.environ.get("DB_PORT", "3306")))

    # Tự động bật SSL nếu không phải chạy ở localhost (tức là khi lên Azure)
    ssl_config = None
    if host != "localhost" and "127.0.0.1" not in host:
        ssl_config = {"ssl": {}}  # Cần thiết để pass qua lớp bảo mật của Azure

    return pymysql.connect(
        host=host,
        database=database,
        user=user,
        password=password,
        port=port,
        charset="utf8mb4",
        autocommit=False,
        ssl=ssl_config,  # Thêm dòng này vào đây
    )


if __name__ == "__main__":
    try:
        conn = get_connection()
        print("Kết nối thành công!")
        conn.close()
    except Exception as e:
        print("Kết nối thất bại:", e)