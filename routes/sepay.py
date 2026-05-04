from __future__ import annotations

import json
import re
from datetime import datetime, timedelta

from flask import Blueprint, current_app, jsonify, request

from connect import get_connection
from models import PaymentOrder, SepayWebhookEvent, UserQuota


sepay_bp = Blueprint("sepay", __name__)


_ORDER_ID_FROM_CONTENT_RE = re.compile(r"(?:\bORDER\s*=\s*|\bDH\s*[:\- ]\s*)([a-zA-Z0-9]{8,32})")
_ORDER_ID_HEX12_RE = re.compile(r"\b[a-f0-9]{12}\b", re.IGNORECASE)


def _as_event_dict(payload: dict) -> dict:
    """Normalize webhook payload.

    Some providers wrap the actual event in a `data` field.
    """
    if not isinstance(payload, dict):
        return {}
    data = payload.get("data")
    if isinstance(data, dict) and data:
        merged = {**payload, **data}
        merged.pop("data", None)
        return merged
    return payload


def _first_present(payload: dict, keys: list[str]):
    for k in keys:
        if k in payload and payload.get(k) is not None:
            return payload.get(k)
    return None


def _extract_order_id(payload: dict) -> str | None:
    payload = _as_event_dict(payload)

    code = payload.get("code")
    if isinstance(code, str) and code.strip():
        return code.strip()

    # Some payloads use referenceCode/reference_code for the payment code
    # Only accept it if we can safely extract our order_id pattern from it.
    ref = _first_present(payload, ["referenceCode", "reference_code"])
    if isinstance(ref, str) and ref.strip():
        mref = _ORDER_ID_FROM_CONTENT_RE.search(ref)
        if mref:
            return mref.group(1).strip()
        mref2 = _ORDER_ID_HEX12_RE.search(ref)
        if mref2:
            return mref2.group(0).strip()

    # Search order_id in common "content" fields
    content = _first_present(payload, [
        "content",
        "transactionContent",
        "transaction_content",
        "description",
        "desc",
        "message",
        "memo",
        "note",
    ])
    if isinstance(content, str) and content.strip():
        m = _ORDER_ID_FROM_CONTENT_RE.search(content)
        if m:
            return m.group(1).strip()
        m2 = _ORDER_ID_HEX12_RE.search(content)
        if m2:
            return m2.group(0).strip()

    return None


def _is_authorized(req) -> bool:
    expected = (current_app.config.get("SEPAY_API_KEY") or "").strip()
    if not expected:
        return False

    # Optional fallbacks (useful if the webhook provider can't set Authorization header)
    qp_token = (req.args.get("api_key") or req.args.get("key") or "").strip()
    if qp_token and qp_token == expected:
        return True

    x_api_key = (req.headers.get("X-Api-Key") or req.headers.get("X-API-Key") or "").strip()
    if x_api_key and x_api_key == expected:
        return True

    auth = (req.headers.get("Authorization") or "").strip()
    if not auth:
        return False

    # SePay docs: Authorization: "Apikey API_KEY_CUA_BAN"
    parts = auth.split(None, 1)
    if len(parts) != 2:
        return False

    scheme, token = parts[0].lower(), parts[1].strip()
    if scheme != "apikey":
        return False

    return token == expected


@sepay_bp.route("/", methods=["POST"])
def webhook_sepay_root_alias():
    """Alias: accept webhook POST at '/' to avoid 405 when misconfigured.

    Prefer using the canonical endpoint: POST /webhook/sepay
    """
    return webhook_sepay()


def _apply_best_paid_plan(conn, user_id: int) -> None:
    """Deprecated: webhook now applies the plan of the matched order directly."""
    return


def _plan_expire_for(plan: str):
    plan = (plan or "free").lower()
    now = datetime.now()
    if plan == "pro":
        return now + timedelta(days=30)
    if plan == "enterprise":
        return now + timedelta(days=90)
    if plan == "basic":
        return now + timedelta(days=7)
    return None
    now = datetime.now()
    if plan == "pro":
        plan_expire = now + timedelta(days=30)
    elif plan == "enterprise":
        plan_expire = now + timedelta(days=90)
    elif plan == "basic":
        plan_expire = now + timedelta(days=7)
    else:
        plan_expire = None

    UserQuota.set_plan(conn, user_id, plan, plan_expire)


@sepay_bp.route("/webhook/sepay", methods=["POST"])
def webhook_sepay():
    """Nhận webhook biến động số dư từ SePay và tự động xác nhận đơn thanh toán.

    - Xác thực bằng API key qua header Authorization: "Apikey <token>".
    - Chống trùng lặp bằng sepay_tx_id.
    - Match đơn theo `code` hoặc tìm `order_id` trong `content`.
    """

    if not _is_authorized(request):
        # Trả 401 để SePay ghi nhận thất bại (tuỳ cấu hình retry).
        return jsonify({"success": False, "error": "unauthorized"}), 401

    payload = request.get_json(silent=True) or {}
    if not isinstance(payload, dict) or not payload:
        return jsonify({"success": False, "error": "invalid payload"}), 400

    payload = _as_event_dict(payload)

    transfer_type_raw = _first_present(payload, ["transferType", "transfer_type", "type", "direction", "transfer_direction"])
    transfer_type = (str(transfer_type_raw) if transfer_type_raw is not None else "").strip().lower()
    if transfer_type and transfer_type != "in":
        # Không xử lý tiền ra
        try:
            tx_hint = _first_present(payload, ["id", "transactionId", "transaction_id", "tid", "txId", "tx_id"])
            print(f"[SEPAY] skip non-in transfer_type={transfer_type} tx={tx_hint}")
        except Exception:
            pass
        return jsonify({"success": True}), 200

    tx_raw = _first_present(payload, ["id", "transactionId", "transaction_id", "tid", "txId", "tx_id"])
    try:
        sepay_tx_id = int(str(tx_raw))
    except Exception:
        return jsonify({"success": False, "error": "missing id"}), 400

    reference_code = _first_present(payload, ["referenceCode", "reference_code", "ref", "reference", "bankReference", "bank_reference"])
    amount_raw = _first_present(payload, ["transferAmount", "transfer_amount", "amount", "money", "creditAmount", "credit_amount"])
    try:
        transfer_amount = int(str(amount_raw))
    except Exception:
        transfer_amount = None

    order_id = _extract_order_id(payload)
    try:
        print(f"[SEPAY] recv tx={sepay_tx_id} transfer_type={transfer_type or 'in'} amount={transfer_amount} order_id={order_id}")
    except Exception:
        pass
    raw_json = None
    try:
        raw_json = json.dumps(payload, ensure_ascii=False)
    except Exception:
        raw_json = None

    conn = None
    try:
        conn = get_connection()

        # Idempotency: nếu transaction id đã xử lý thì return success luôn
        inserted = SepayWebhookEvent.try_insert(
            conn,
            sepay_tx_id=sepay_tx_id,
            reference_code=str(reference_code) if reference_code is not None else None,
            order_id=str(order_id) if order_id is not None else None,
            transfer_type=transfer_type or None,
            transfer_amount=transfer_amount,
            raw_json=raw_json,
        )
        if not inserted:
            # Duplicate tx_id (retry). Continue processing anyway because previous attempts
            # may have failed to match order_id or update status.
            try:
                print(f"[SEPAY] duplicate tx={sepay_tx_id} -> continue")
            except Exception:
                pass

        if not order_id:
            try:
                print(f"[SEPAY] no order_id found tx={sepay_tx_id} -> ignore")
            except Exception:
                pass
            return jsonify({"success": True}), 200

        order = PaymentOrder.get_by_order_id(conn, str(order_id))
        if not order:
            try:
                print(f"[SEPAY] order not found order_id={order_id} tx={sepay_tx_id} -> ignore")
            except Exception:
                pass
            return jsonify({"success": True}), 200

        expected_amount = int(order.get("amount_vnd") or 0)
        if transfer_amount is not None and expected_amount > 0 and transfer_amount < expected_amount:
            # Tiền vào < số tiền cần thanh toán => không xác nhận
            try:
                print(
                    f"[SEPAY] amount too low order_id={order_id} tx={sepay_tx_id} amount={transfer_amount} expected={expected_amount} -> ignore"
                )
            except Exception:
                pass
            return jsonify({"success": True}), 200

        # Mark paid (pending/user_confirmed -> paid). Nếu đã paid trước đó thì thôi.
        updated = PaymentOrder.mark_paid_from_webhook(conn, str(order_id))
        if updated or (order.get("status") or "").lower() == PaymentOrder.STATUS_PAID:
            user_id = order.get("user_id")
            if user_id is not None:
                try:
                    # Apply EXACT plan of this order (avoid "random" highest-plan selection)
                    paid_plan = str(order.get("plan") or "free").lower()
                    UserQuota.get_or_create(conn, int(user_id))
                    UserQuota.set_plan_upgrade_only(conn, int(user_id), paid_plan, _plan_expire_for(paid_plan))
                except Exception:
                    # Không làm webhook fail vì lỗi set plan
                    pass

        try:
            print(
                f"[SEPAY] ok tx={sepay_tx_id} order={order_id} amount={transfer_amount} expected={expected_amount} updated={updated}"
            )
        except Exception:
            pass
        return jsonify({"success": True}), 200
    except Exception as e:
        try:
            if conn:
                conn.rollback()
        except Exception:
            pass
        print(f"[SEPAY] webhook error: {e}")
        return jsonify({"success": False}), 500
    finally:
        try:
            if conn:
                conn.close()
        except Exception:
            pass
