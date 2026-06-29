# connect.py
# Kết nối tới MySQL (PyMySQL) theo cấu hình biến môi trường.
# Build: 2026-06-30 - Azure VNet + AZURE_MYSQL_* env vars support

import os
import pymysql


def get_connection():
    host = os.environ.get("AZURE_MYSQL_HOST") or os.environ.get("MYSQL_HOST") or os.environ.get("DB_HOST") or "localhost"
    database = os.environ.get("AZURE_MYSQL_NAME") or os.environ.get("MYSQL_DATABASE") or os.environ.get("DB_NAME") or "khoaluantn"
    user = os.environ.get("AZURE_MYSQL_USER") or os.environ.get("MYSQL_USER") or os.environ.get("DB_USER") or "root"
    password = os.environ.get("AZURE_MYSQL_PASSWORD") or os.environ.get("MYSQL_PASSWORD") or os.environ.get("DB_PASSWORD") or "$7MvguT0qZtCqvtk"
    port = int(os.environ.get("DB_PORT") or os.environ.get("MYSQL_PORT") or 3306)

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
        ssl=ssl_config,
        connect_timeout=3,
    )


if __name__ == "__main__":
    try:
        conn = get_connection()
        print("Kết nối thành công!")
        conn.close()
    except Exception as e:
        print("Kết nối thất bại:", e)