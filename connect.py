# connect.py
# Kết nối tới MySQL (PyMySQL) theo cấu hình biến môi trường.
# Build: 2026-06-30 - Azure VNet + AZURE_MYSQL_* env vars support

import os
import pymysql

# Load local environment variables from .env if present (only on local)
def _load_local_env():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    env_path = os.path.join(base_dir, ".env")
    if os.path.exists(env_path):
        try:
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip('"').strip("'")
                        if k and k not in os.environ:
                            os.environ[k] = v
        except Exception:
            pass

_load_local_env()


def get_connection():
    host = os.environ.get("AZURE_MYSQL_HOST") or os.environ.get("MYSQL_HOST") or os.environ.get("DB_HOST") or "localhost"
    database = os.environ.get("AZURE_MYSQL_NAME") or os.environ.get("MYSQL_DATABASE") or os.environ.get("DB_NAME") or "khoaluantn"
    user = os.environ.get("AZURE_MYSQL_USER") or os.environ.get("MYSQL_USER") or os.environ.get("DB_USER") or "root"
    password = os.environ.get("AZURE_MYSQL_PASSWORD")
    if password is None:
        password = os.environ.get("MYSQL_PASSWORD")
    if password is None:
        password = os.environ.get("DB_PASSWORD")
    if password is None:
        password = ""
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