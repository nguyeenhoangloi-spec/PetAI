# connect.py
# Kết nối tới MySQL (PyMySQL) theo cấu hình biến môi trường.

import os
import pymysql


def get_connection():
    host = os.environ.get("MYSQL_HOST", os.environ.get("DB_HOST", "localhost"))
    database = os.environ.get("MYSQL_DATABASE", os.environ.get("DB_NAME", "khoaluantn"))
    user = os.environ.get("MYSQL_USER", os.environ.get("DB_USER", "root"))
    password = os.environ.get("MYSQL_PASSWORD", os.environ.get("DB_PASSWORD", ""))
    port = int(os.environ.get("MYSQL_PORT", os.environ.get("DB_PORT", "3306")))

    return pymysql.connect(
        host=host,
        database=database,
        user=user,
        password=password,
        port=port,
        charset="utf8mb4",
        autocommit=False,
    )


if __name__ == "__main__":
    try:
        conn = get_connection()
        print("Kết nối thành công!")
        conn.close()
    except Exception as e:
        print("Kết nối thất bại:", e)
