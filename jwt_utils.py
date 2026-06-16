import os
import time
from urllib.parse import urlencode

from flask import current_app
import jwt


def _get_jwt_secret() -> str:
    secret = os.getenv("JWT_SECRET_KEY") or os.getenv("SECRET_KEY")
    if not secret:
        secret = current_app.secret_key
    if not secret:
        raise RuntimeError("JWT secret is not configured")
    return str(secret)


def build_jwt_access_token(user: dict, avatar_url: str | None) -> str:
    now = int(time.time())
    payload = {
        "user_id": user["id"],
        "email": user.get("email"),
        "name": user.get("fullname") or user.get("username"),
        "avatar": avatar_url,
        "iat": now,
        "exp": now + 7 * 24 * 60 * 60,
    }
    token = jwt.encode(payload, _get_jwt_secret(), algorithm="HS256")
    if isinstance(token, bytes):
        return token.decode("utf-8")
    return token


def build_mobile_deeplink(token: str, user: dict) -> str:
    query = urlencode(
        {
            "token": token,
            "user_id": user["id"],
            "email": user.get("email") or "",
        }
    )
    return f"petai://auth?{query}"
