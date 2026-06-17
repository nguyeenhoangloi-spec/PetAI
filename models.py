# models.py
# Database models for prediction history and user management

from datetime import datetime
from typing import Optional, List, Dict, Any
import json

from breed_names import to_common_vietnamese_breed_name


def _column_exists(conn, table_name: str, column_name: str) -> bool:
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = DATABASE()
              AND table_name = %s
              AND column_name = %s
            LIMIT 1
            """,
            (table_name, column_name),
        )
        return cur.fetchone() is not None


def _ensure_column(conn, table_name: str, column_name: str, column_definition: str) -> None:
    if _column_exists(conn, table_name, column_name):
        return
    with conn.cursor() as cur:
        cur.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_definition}")
    conn.commit()


class PredictionHistory:
    """Model để lưu lịch sử nhận diện giống chó"""
    
    def __init__(self, id: Optional[int] = None, user_id: Optional[int] = None, 
                 image_path: str = "", breed: str = "", confidence: float = 0.0,
                 species: str = "", created_at: Optional[datetime] = None):
        self.id = id
        self.user_id = user_id
        self.image_path = image_path
        self.breed = breed
        self.confidence = confidence
        self.species = species
        self.created_at = created_at or datetime.now()
    
    @staticmethod
    def create_table(conn):
        """Tạo bảng prediction_history"""
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS prediction_history (
                    id INTEGER PRIMARY KEY AUTO_INCREMENT,
                    user_id INTEGER NOT NULL,
                    image_path VARCHAR(500) NOT NULL,
                    breed VARCHAR(200),
                    confidence FLOAT,
                    species VARCHAR(50),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            """)
            conn.commit()
    
    @staticmethod
    def save(conn, user_id: int, image_path: str, breed: str, 
             confidence: float, species: str = "Dog"):
        """Lưu một lần nhận diện vào database"""
        normalized_breed = to_common_vietnamese_breed_name(breed)
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO prediction_history 
                (user_id, image_path, breed, confidence, species)
                VALUES (%s, %s, %s, %s, %s)
            """, (user_id, image_path, normalized_breed, confidence, species))
            conn.commit()
            return int(cur.lastrowid)
    
    @staticmethod
    def get_by_user(conn, user_id: int, limit: int = 50, offset: int = 0, breed_type: str = "all", search_query: str = "") -> List[Dict]:
        """Lấy lịch sử nhận diện của user với phân trang, bộ lọc loại giống và tìm kiếm"""
        with conn.cursor() as cur:
            query = """
                SELECT id, image_path, breed, confidence, species, created_at
                FROM prediction_history
                WHERE user_id = %s
            """
            params = [user_id]
            if breed_type == "hybrid":
                query += " AND breed LIKE 'Nghi lai:%%'"
            elif breed_type == "pure":
                query += " AND breed NOT LIKE 'Nghi lai:%%'"
            
            if search_query:
                query += " AND breed LIKE %s"
                params.append(f"%{search_query}%")
            
            query += " ORDER BY created_at DESC LIMIT %s OFFSET %s"
            params.extend([limit, offset])
            
            cur.execute(query, tuple(params))
            rows = cur.fetchall()
            return [{
                'id': row[0],
                'image_path': row[1],
                'breed': to_common_vietnamese_breed_name(row[2]),
                'confidence': row[3],
                'species': row[4],
                'created_at': row[5]
            } for row in rows]

    @staticmethod
    def get_by_user_in_range(
        conn,
        user_id: Optional[int],
        start_at: datetime,
        end_at: datetime,
        limit: Optional[int] = 50,
        offset: int = 0,
    ) -> List[Dict]:
        """Lấy lịch sử nhận diện theo khoảng thời gian (cá nhân hoặc toàn hệ thống nếu user_id là None)"""
        with conn.cursor() as cur:
            if user_id is not None:
                if limit is None:
                    cur.execute("""
                        SELECT id, image_path, breed, confidence, species, created_at
                        FROM prediction_history
                        WHERE user_id = %s
                          AND created_at >= %s
                          AND created_at < %s
                        ORDER BY created_at DESC
                    """, (user_id, start_at, end_at))
                else:
                    cur.execute("""
                        SELECT id, image_path, breed, confidence, species, created_at
                        FROM prediction_history
                        WHERE user_id = %s
                          AND created_at >= %s
                          AND created_at < %s
                        ORDER BY created_at DESC
                        LIMIT %s OFFSET %s
                    """, (user_id, start_at, end_at, limit, offset))
                rows = cur.fetchall()
                return [{
                    'id': row[0],
                    'image_path': row[1],
                    'breed': to_common_vietnamese_breed_name(row[2]),
                    'confidence': row[3],
                    'species': row[4],
                    'created_at': row[5],
                    'username': None
                } for row in rows]
            else:
                # Toàn hệ thống (Admin)
                if limit is None:
                    cur.execute("""
                        SELECT ph.id, ph.image_path, ph.breed, ph.confidence, ph.species, ph.created_at, u.username
                        FROM prediction_history ph
                        LEFT JOIN users u ON ph.user_id = u.id
                        WHERE ph.created_at >= %s
                          AND ph.created_at < %s
                        ORDER BY ph.created_at DESC
                    """, (start_at, end_at))
                else:
                    cur.execute("""
                        SELECT ph.id, ph.image_path, ph.breed, ph.confidence, ph.species, ph.created_at, u.username
                        FROM prediction_history ph
                        LEFT JOIN users u ON ph.user_id = u.id
                        WHERE ph.created_at >= %s
                          AND ph.created_at < %s
                        ORDER BY ph.created_at DESC
                        LIMIT %s OFFSET %s
                    """, (start_at, end_at, limit, offset))
                rows = cur.fetchall()
                return [{
                    'id': row[0],
                    'image_path': row[1],
                    'breed': to_common_vietnamese_breed_name(row[2]),
                    'confidence': row[3],
                    'species': row[4],
                    'created_at': row[5],
                    'username': row[6]
                } for row in rows]

    @staticmethod
    def count_by_user_in_range(
        conn,
        user_id: Optional[int],
        start_at: datetime,
        end_at: datetime,
    ) -> int:
        """Đếm số bản ghi trong khoảng thời gian (cá nhân hoặc toàn hệ thống nếu user_id là None)"""
        with conn.cursor() as cur:
            if user_id is not None:
                cur.execute("""
                    SELECT COUNT(*)
                    FROM prediction_history
                    WHERE user_id = %s
                      AND created_at >= %s
                      AND created_at < %s
                """, (user_id, start_at, end_at))
            else:
                cur.execute("""
                    SELECT COUNT(*)
                    FROM prediction_history
                    WHERE created_at >= %s
                      AND created_at < %s
                """, (start_at, end_at))
            return cur.fetchone()[0]

    @staticmethod
    def avg_confidence_by_user_in_range(
        conn,
        user_id: Optional[int],
        start_at: datetime,
        end_at: datetime,
    ) -> float:
        """Tính độ tin cậy trung bình trong khoảng thời gian (cá nhân hoặc toàn hệ thống nếu user_id là None)"""
        with conn.cursor() as cur:
            if user_id is not None:
                cur.execute("""
                    SELECT AVG(confidence)
                    FROM prediction_history
                    WHERE user_id = %s
                      AND created_at >= %s
                      AND created_at < %s
                      AND confidence IS NOT NULL
                """, (user_id, start_at, end_at))
            else:
                cur.execute("""
                    SELECT AVG(confidence)
                    FROM prediction_history
                    WHERE created_at >= %s
                      AND created_at < %s
                      AND confidence IS NOT NULL
                """, (start_at, end_at))
            value = cur.fetchone()[0]
            return float(value or 0.0)
    
    @staticmethod
    def count_by_user(conn, user_id: Optional[int], breed_type: str = "all", search_query: str = "") -> int:
        """Đếm tổng số bản ghi lịch sử của user (hoặc toàn hệ thống nếu user_id là None) với bộ lọc và tìm kiếm"""
        with conn.cursor() as cur:
            if user_id is not None:
                query = "SELECT COUNT(*) FROM prediction_history WHERE user_id = %s"
                params = [user_id]
            else:
                query = "SELECT COUNT(*) FROM prediction_history WHERE 1=1"
                params = []
            
            if breed_type == "hybrid":
                query += " AND breed LIKE 'Nghi lai:%%'"
            elif breed_type == "pure":
                query += " AND breed NOT LIKE 'Nghi lai:%%'"
                
            if search_query:
                query += " AND breed LIKE %s"
                params.append(f"%{search_query}%")
                
            cur.execute(query, tuple(params))
            return cur.fetchone()[0]
    
    @staticmethod
    def get_stats(conn, user_id: Optional[int], days: Optional[int] = None) -> Dict[str, Any]:
        """Lấy thống kê cho user (hoặc toàn hệ thống nếu user_id là None) với tùy chọn số ngày gần đây"""
        with conn.cursor() as cur:
            conds = []
            params = []
            if user_id is not None:
                conds.append("user_id = %s")
                params.append(user_id)
            if days is not None:
                conds.append("created_at >= DATE_SUB(CURDATE(), INTERVAL %s DAY)")
                params.append(days)
            
            where_clause = " WHERE " + " AND ".join(conds) if conds else ""
            
            # Tổng số lần nhận diện
            cur.execute("SELECT COUNT(*) FROM prediction_history" + where_clause, tuple(params))
            total_predictions = cur.fetchone()[0] or 0
            
            # Top 5 giống phổ biến
            top_breeds_conds = list(conds)
            top_breeds_conds.append("breed IS NOT NULL")
            top_breeds_where = " WHERE " + " AND ".join(top_breeds_conds)
            top_breeds_params = list(params)
            
            cur.execute(f"""
                SELECT breed, COUNT(*) as count
                FROM prediction_history
                {top_breeds_where}
                GROUP BY breed
                ORDER BY count DESC
                LIMIT 200
            """, tuple(top_breeds_params))
            
            breed_counter: Dict[str, int] = {}
            for row in cur.fetchall():
                breed = to_common_vietnamese_breed_name(row[0])
                if breed == "Không xác định":
                    continue
                breed_counter[breed] = int(breed_counter.get(breed, 0)) + int(row[1] or 0)
            top_breeds = [
                {'breed': breed, 'count': count}
                for breed, count in sorted(breed_counter.items(), key=lambda x: x[1], reverse=True)[:5]
            ]
            
            # Độ tin cậy trung bình
            conf_conds = list(conds)
            conf_conds.append("confidence IS NOT NULL")
            conf_where = " WHERE " + " AND ".join(conf_conds)
            conf_params = list(params)
            
            cur.execute("SELECT AVG(confidence) FROM prediction_history" + conf_where, tuple(conf_params))
            avg_confidence = cur.fetchone()[0] or 0.0
            
            return {
                'total_predictions': total_predictions,
                'top_breeds': top_breeds,
                'avg_confidence': float(avg_confidence)
            }

    @staticmethod
    def get_daily_counts(conn, user_id: Optional[int], days: Optional[int] = 7) -> List[Dict[str, Any]]:
        """Đếm số dự đoán theo từng ngày trong N ngày gần đây hoặc theo tháng nếu days là None"""
        with conn.cursor() as cur:
            if days is not None:
                if user_id is not None:
                    cur.execute("""
                        SELECT DATE(created_at) AS day, COUNT(*) AS cnt
                        FROM prediction_history
                        WHERE user_id = %s
                          AND created_at >= DATE_SUB(CURDATE(), INTERVAL %s DAY)
                        GROUP BY DATE(created_at)
                        ORDER BY day ASC
                    """, (user_id, days))
                else:
                    cur.execute("""
                        SELECT DATE(created_at) AS day, COUNT(*) AS cnt
                        FROM prediction_history
                        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL %s DAY)
                        GROUP BY DATE(created_at)
                        ORDER BY day ASC
                    """, (days,))
                rows = cur.fetchall()
                return [{'date': row[0].strftime('%d/%m') if row[0] else '', 'count': int(row[1] or 0)} for row in rows]
            else:
                # All time: group by month
                if user_id is not None:
                    cur.execute("""
                        SELECT DATE_FORMAT(created_at, '%%Y-%%m') AS month, COUNT(*) AS cnt
                        FROM prediction_history
                        WHERE user_id = %s
                        GROUP BY month
                        ORDER BY month ASC
                    """, (user_id,))
                else:
                    cur.execute("""
                        SELECT DATE_FORMAT(created_at, '%%Y-%%m') AS month, COUNT(*) AS cnt
                        FROM prediction_history
                        GROUP BY month
                        ORDER BY month ASC
                    """, ())
                rows = cur.fetchall()
                formatted_rows = []
                for row in rows:
                    if not row[0]:
                        continue
                    parts = row[0].split('-')
                    formatted_rows.append({'date': f"{parts[1]}/{parts[0][2:]}", 'count': int(row[1] or 0)})
                return formatted_rows

    @staticmethod
    def get_confidence_distribution(conn, user_id: Optional[int], days: Optional[int] = None) -> List[int]:
        """Phân bố độ tin cậy thành 5 nhóm: 0-20, 20-40, 40-60, 60-80, 80-100 (%) với bộ lọc ngày"""
        with conn.cursor() as cur:
            conds = ["confidence IS NOT NULL"]
            params = []
            if user_id is not None:
                conds.append("user_id = %s")
                params.append(user_id)
            if days is not None:
                conds.append("created_at >= DATE_SUB(CURDATE(), INTERVAL %s DAY)")
                params.append(days)
            
            where_clause = " WHERE " + " AND ".join(conds)
            
            cur.execute(f"""
                SELECT
                    SUM(CASE WHEN confidence < 0.2 THEN 1 ELSE 0 END),
                    SUM(CASE WHEN confidence >= 0.2 AND confidence < 0.4 THEN 1 ELSE 0 END),
                    SUM(CASE WHEN confidence >= 0.4 AND confidence < 0.6 THEN 1 ELSE 0 END),
                    SUM(CASE WHEN confidence >= 0.6 AND confidence < 0.8 THEN 1 ELSE 0 END),
                    SUM(CASE WHEN confidence >= 0.8 THEN 1 ELSE 0 END)
                FROM prediction_history
                {where_clause}
            """, tuple(params))
            row = cur.fetchone()
            if not row:
                return [0, 0, 0, 0, 0]
            return [int(v or 0) for v in row]

    @staticmethod
    def get_unique_breed_count(conn, user_id: Optional[int]) -> int:
        """Đếm số giống chó duy nhất đã nhận diện (hoặc toàn hệ thống nếu user_id là None)"""
        with conn.cursor() as cur:
            if user_id is not None:
                cur.execute("""
                    SELECT COUNT(DISTINCT breed)
                    FROM prediction_history
                    WHERE user_id = %s AND breed IS NOT NULL AND breed != ''
                """, (user_id,))
            else:
                cur.execute("""
                    SELECT COUNT(DISTINCT breed)
                    FROM prediction_history
                    WHERE breed IS NOT NULL AND breed != ''
                """)
            return int(cur.fetchone()[0] or 0)


class UserSettings:
    """Model cho user settings"""
    
    @staticmethod
    def create_table(conn):
        """Tạo bảng user_settings"""
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS user_settings (
                    user_id INTEGER PRIMARY KEY,
                    theme VARCHAR(20) DEFAULT 'light',
                    language VARCHAR(10) DEFAULT 'vi',
                    notifications BOOLEAN DEFAULT TRUE,
                    email_notifications BOOLEAN DEFAULT FALSE,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            """)
            conn.commit()
    
    @staticmethod
    def get_or_create(conn, user_id: int) -> Dict[str, Any]:
        """Lấy hoặc tạo settings cho user"""
        with conn.cursor() as cur:
            cur.execute("""
                SELECT theme, language, notifications, email_notifications
                FROM user_settings WHERE user_id = %s
            """, (user_id,))
            row = cur.fetchone()
            
            if not row:
                # Tạo settings mặc định
                cur.execute("""
                    INSERT INTO user_settings (user_id)
                    VALUES (%s)
                """, (user_id,))
                conn.commit()
                cur.execute(
                    """
                    SELECT theme, language, notifications, email_notifications
                    FROM user_settings
                    WHERE user_id = %s
                    """,
                    (user_id,),
                )
                row = cur.fetchone()
            
            return {
                'theme': row[0],
                'language': row[1],
                'notifications': row[2],
                'email_notifications': row[3]
            }
    
    @staticmethod
    def update(conn, user_id: int, settings: Dict[str, Any]):
        """Cập nhật settings"""
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE user_settings
                SET theme = %s, language = %s, 
                    notifications = %s, email_notifications = %s
                WHERE user_id = %s
            """, (settings.get('theme'), settings.get('language'),
                  settings.get('notifications'), settings.get('email_notifications'),
                  user_id))
            conn.commit()


class UserQuota:
    """Theo dõi quota sử dụng tính năng nhận diện cho user.

    - Free: 10 lần nhận diện miễn phí.
    - Sau đó phải xem quảng cáo để mở khóa thêm, tối đa 3 lần xem.
    - Premium: không giới hạn (demo).
    """

    FREE_PREDICTIONS = 10
    MAX_AD_VIEWS = 3
    AD_UNLOCK_PER_VIEW = 3

    # Paid plan usage limits (edit if needed)
    # None => unlimited
    PAID_PLAN_USES = {
        "basic": 50,
        "pro": 200,
        "enterprise": None,
    }

    @staticmethod
    def create_table(conn):
        with conn.cursor() as cur:
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS user_quota (
                    user_id INTEGER PRIMARY KEY,
                    plan VARCHAR(20) NOT NULL DEFAULT 'free',
                    plan_expire TIMESTAMP NULL,
                    paid_uses_remaining INTEGER NULL,
                    ad_views_used INTEGER NOT NULL DEFAULT 0,
                    ad_unlocks_remaining INTEGER NOT NULL DEFAULT 0,
                    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
                """
            )
            conn.commit()

        # Schema migration for existing databases
        _ensure_column(conn, "user_quota", "plan_expire", "TIMESTAMP NULL")
        _ensure_column(conn, "user_quota", "paid_uses_remaining", "INTEGER NULL")

    @staticmethod
    def _paid_plan_limit(plan: str) -> Optional[int]:
        plan = (plan or "free").strip().lower()
        return UserQuota.PAID_PLAN_USES.get(plan, None)

    @staticmethod
    def _plan_rank(plan: str) -> int:
        p = (plan or "free").strip().lower()
        priority = {"free": 0, "basic": 1, "pro": 2, "enterprise": 3}
        return int(priority.get(p, 0))

    @staticmethod
    def set_plan_upgrade_only(conn, user_id: int, plan: str, plan_expire=None) -> bool:
        """Chỉ nâng cấp (không hạ cấp).

        - Nếu plan mới thấp hơn plan hiện tại: không đổi.
        - Nếu plan mới bằng plan hiện tại: chỉ cập nhật plan_expire nếu plan_expire mới muộn hơn.
        - Nếu plan mới cao hơn: cập nhật plan + plan_expire.
        """
        current = UserQuota.get_or_create(conn, int(user_id))
        current_plan = (current.get("plan") or "free")
        current_rank = UserQuota._plan_rank(current_plan)
        new_rank = UserQuota._plan_rank(plan)

        # Don't downgrade
        if new_rank < current_rank:
            return False

        # Same plan: extend expiry only if later
        if new_rank == current_rank:
            if not plan_expire:
                return False
            try:
                cur_exp = current.get("plan_expire")
                if cur_exp is not None and plan_expire <= cur_exp:
                    return False
            except Exception:
                # If comparison fails, be conservative and still attempt update
                pass
            UserQuota.set_plan(conn, int(user_id), str(plan).lower(), plan_expire)
            return True

        # Upgrade
        UserQuota.set_plan(conn, int(user_id), str(plan).lower(), plan_expire)
        return True

    @staticmethod
    def get_or_create(conn, user_id: int) -> Dict[str, Any]:
        """Lấy quota hoặc tạo mặc định nếu chưa có."""
        UserQuota.create_table(conn)

        with conn.cursor() as cur:
            cur.execute(
                "SELECT plan, ad_views_used, ad_unlocks_remaining, plan_expire, paid_uses_remaining FROM user_quota WHERE user_id = %s",
                (user_id,),
            )
            row = cur.fetchone()
            if not row:
                cur.execute(
                    "INSERT INTO user_quota (user_id) VALUES (%s)",
                    (user_id,),
                )
                conn.commit()
                cur.execute(
                    "SELECT plan, ad_views_used, ad_unlocks_remaining, plan_expire, paid_uses_remaining FROM user_quota WHERE user_id = %s",
                    (user_id,),
                )
                row = cur.fetchone()

        return {
            "plan": row[0],
            "ad_views_used": int(row[1] or 0),
            "ad_unlocks_remaining": int(row[2] or 0),
            "plan_expire": row[3],
            "paid_uses_remaining": (int(row[4]) if row[4] is not None else None),
        }

    @staticmethod
    def set_plan(conn, user_id: int, plan: str, plan_expire=None) -> None:
        print(f"[DEBUG] set_plan: user_id={user_id}, plan={plan}, plan_expire={plan_expire}")
        UserQuota.create_table(conn)
        plan = (plan or "free").strip().lower()
        limit = UserQuota._paid_plan_limit(plan)
        with conn.cursor() as cur:
            if plan_expire:
                cur.execute(
                    """
                    INSERT INTO user_quota (user_id, plan, plan_expire, paid_uses_remaining)
                    VALUES (%s, %s, %s, %s)
                    ON DUPLICATE KEY UPDATE
                        plan = %s,
                        plan_expire = %s,
                        paid_uses_remaining = %s,
                        updated_at = CURRENT_TIMESTAMP
                    """,
                    (
                        user_id,
                        plan,
                        plan_expire,
                        (int(limit) if limit is not None else None),
                        plan,
                        plan_expire,
                        (int(limit) if limit is not None else None),
                    ),
                )
            else:
                cur.execute(
                    """
                    INSERT INTO user_quota (user_id, plan, paid_uses_remaining)
                    VALUES (%s, %s, %s)
                    ON DUPLICATE KEY UPDATE
                        plan = %s,
                        paid_uses_remaining = %s,
                        updated_at = CURRENT_TIMESTAMP
                    """,
                    (
                        user_id,
                        plan,
                        (int(limit) if limit is not None else None),
                        plan,
                        (int(limit) if limit is not None else None),
                    ),
                )
            conn.commit()

    @staticmethod
    def consume_paid_use(conn, user_id: int) -> bool:
        """Trừ 1 lượt dùng cho gói trả phí nếu có giới hạn.

        - Nếu paid_uses_remaining = NULL => unlimited => True.
        - Nếu > 0 => trừ 1 và True.
        - Nếu <= 0 => False.
        """
        UserQuota.create_table(conn)
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE user_quota
                SET paid_uses_remaining = CASE
                    WHEN paid_uses_remaining IS NULL THEN NULL
                    ELSE paid_uses_remaining - 1
                END,
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = %s
                  AND (paid_uses_remaining IS NULL OR paid_uses_remaining > 0)
                """,
                (user_id,),
            )
            ok = cur.rowcount > 0
            conn.commit()
            return bool(ok)

    @staticmethod
    def mark_ad_watched(conn, user_id: int) -> Optional[Dict[str, Any]]:
        """Ghi nhận đã xem 1 quảng cáo và cộng thêm unlock.

        Trả về trạng thái mới nếu còn lượt xem ads; None nếu đã hết.
        """
        UserQuota.create_table(conn)
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE user_quota
                SET ad_views_used = ad_views_used + 1,
                    ad_unlocks_remaining = ad_unlocks_remaining + %s,
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = %s AND ad_views_used < %s
                """,
                (UserQuota.AD_UNLOCK_PER_VIEW, user_id, UserQuota.MAX_AD_VIEWS),
            )
            if cur.rowcount == 0:
                conn.commit()
                return None

            cur.execute(
                "SELECT plan, ad_views_used, ad_unlocks_remaining FROM user_quota WHERE user_id = %s",
                (user_id,),
            )
            row = cur.fetchone()
            conn.commit()
            return {
                "plan": row[0],
                "ad_views_used": int(row[1] or 0),
                "ad_unlocks_remaining": int(row[2] or 0),
            }

    @staticmethod
    def consume_ad_unlock(conn, user_id: int) -> bool:
        """Trừ 1 unlock nếu còn. Trả về True nếu trừ thành công."""
        UserQuota.create_table(conn)
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE user_quota
                SET ad_unlocks_remaining = ad_unlocks_remaining - 1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = %s AND ad_unlocks_remaining > 0
                """,
                (user_id,),
            )
            ok = cur.rowcount > 0
            conn.commit()
            return bool(ok)

    @staticmethod
    def refund_ad_unlock(conn, user_id: int) -> None:
        """Hoàn lại 1 unlock (dùng khi prediction fail sau khi đã consume)."""
        UserQuota.create_table(conn)
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE user_quota
                SET ad_unlocks_remaining = ad_unlocks_remaining + 1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = %s
                """,
                (user_id,),
            )
            conn.commit()


def init_database(conn):
    """Khởi tạo tất cả các bảng cần thiết"""
    PredictionHistory.create_table(conn)
    UserSettings.create_table(conn)
    UserQuota.create_table(conn)
    PaymentOrder.create_table(conn)
    print("✅ Database tables initialized successfully!")


class PaymentOrder:
    """Đơn thanh toán (demo) để admin theo dõi ai mua gói gì."""

    STATUS_PENDING = "pending"  # user tạo đơn, chưa báo đã chuyển tiền
    STATUS_USER_CONFIRMED = "user_confirmed"  # user bấm "Tôi đã chuyển tiền"
    STATUS_PAID = "paid"  # admin đã xác nhận nhận tiền

    @staticmethod
    def create_table(conn):
        with conn.cursor() as cur:
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS payment_orders (
                    id INTEGER PRIMARY KEY AUTO_INCREMENT,
                    order_id VARCHAR(32) NOT NULL UNIQUE,
                    user_id INTEGER NOT NULL,
                    plan VARCHAR(20) NOT NULL,
                    payment_method VARCHAR(20) NOT NULL,
                    amount_vnd INTEGER NOT NULL DEFAULT 0,
                    status VARCHAR(20) NOT NULL DEFAULT 'pending',
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    confirmed_at TIMESTAMP NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
                """
            )
            conn.commit()

    @staticmethod
    def create_order(conn, order_id: str, user_id: int, plan: str, payment_method: str, amount_vnd: int) -> int:
        PaymentOrder.create_table(conn)
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO payment_orders (order_id, user_id, plan, payment_method, amount_vnd)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (order_id, user_id, plan, payment_method, int(amount_vnd or 0)),
            )
            conn.commit()
            return int(cur.lastrowid)

    @staticmethod
    def get_by_order_id(conn, order_id: str) -> Optional[Dict[str, Any]]:
        PaymentOrder.create_table(conn)
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT order_id, user_id, plan, payment_method, amount_vnd, status, created_at, confirmed_at
                FROM payment_orders
                WHERE order_id = %s
                """,
                (order_id,),
            )
            row = cur.fetchone()
            if not row:
                return None
            return {
                "order_id": row[0],
                "user_id": row[1],
                "plan": row[2],
                "payment_method": row[3],
                "amount_vnd": int(row[4] or 0),
                "status": row[5],
                "created_at": row[6],
                "confirmed_at": row[7],
            }

    @staticmethod
    def list_by_user(conn, user_id: int, limit: int = 50) -> List[Dict[str, Any]]:
        PaymentOrder.create_table(conn)
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT order_id, plan, payment_method, amount_vnd, status, created_at, confirmed_at
                FROM payment_orders
                WHERE user_id = %s
                ORDER BY created_at DESC
                LIMIT %s
                """,
                (user_id, limit),
            )
            rows = cur.fetchall() or []
            return [
                {
                    "order_id": r[0],
                    "plan": r[1],
                    "payment_method": r[2],
                    "amount_vnd": int(r[3] or 0),
                    "status": r[4],
                    "created_at": r[5],
                    "confirmed_at": r[6],
                }
                for r in rows
            ]

    @staticmethod
    def list_all(conn, limit: int = 200) -> List[Dict[str, Any]]:
        PaymentOrder.create_table(conn)
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT po.order_id, po.plan, po.payment_method, po.amount_vnd, po.status, po.created_at, po.confirmed_at,
                       u.id, u.username, u.fullname, u.email
                FROM payment_orders po
                JOIN users u ON u.id = po.user_id
                ORDER BY po.created_at DESC
                LIMIT %s
                """,
                (limit,),
            )
            rows = cur.fetchall() or []
            return [
                {
                    "order_id": r[0],
                    "plan": r[1],
                    "payment_method": r[2],
                    "amount_vnd": int(r[3] or 0),
                    "status": r[4],
                    "created_at": r[5],
                    "confirmed_at": r[6],
                    "user_id": r[7],
                    "username": r[8],
                    "fullname": r[9],
                    "email": r[10],
                }
                for r in rows
            ]

    @staticmethod
    def mark_paid(conn, order_id: str) -> bool:
        PaymentOrder.create_table(conn)
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE payment_orders
                SET status = 'paid', confirmed_at = CURRENT_TIMESTAMP
                WHERE order_id = %s AND status = %s
                """,
                (order_id, PaymentOrder.STATUS_USER_CONFIRMED),
            )
            ok = cur.rowcount > 0
            conn.commit()
            return bool(ok)

    @staticmethod
    def mark_paid_from_webhook(conn, order_id: str) -> bool:
        """Đánh dấu đã thanh toán từ webhook (cho phép từ pending/user_confirmed -> paid).

        Dùng cho các cổng tự động (SePay, v.v.) khi đã đối soát giao dịch.
        """
        PaymentOrder.create_table(conn)
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE payment_orders
                SET status = 'paid', confirmed_at = CURRENT_TIMESTAMP
                WHERE order_id = %s AND status IN (%s, %s)
                """,
                (order_id, PaymentOrder.STATUS_PENDING, PaymentOrder.STATUS_USER_CONFIRMED),
            )
            ok = cur.rowcount > 0
            conn.commit()
            return bool(ok)

    @staticmethod
    def mark_user_confirmed(conn, order_id: str, user_id: int | None = None) -> bool:
        """User báo đã chuyển tiền (pending -> user_confirmed)."""
        PaymentOrder.create_table(conn)
        with conn.cursor() as cur:
            if user_id is None:
                cur.execute(
                    """
                    UPDATE payment_orders
                    SET status = %s
                    WHERE order_id = %s AND status = %s
                    """,
                    (PaymentOrder.STATUS_USER_CONFIRMED, order_id, PaymentOrder.STATUS_PENDING),
                )
            else:
                cur.execute(
                    """
                    UPDATE payment_orders
                    SET status = %s
                    WHERE order_id = %s AND user_id = %s AND status = %s
                    """,
                    (PaymentOrder.STATUS_USER_CONFIRMED, order_id, int(user_id), PaymentOrder.STATUS_PENDING),
                )

            ok = cur.rowcount > 0
            conn.commit()
            return bool(ok)


class SepayWebhookEvent:
    """Lưu sự kiện webhook từ SePay để chống trùng lặp (idempotency)."""

    @staticmethod
    def create_table(conn):
        with conn.cursor() as cur:
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS sepay_webhook_events (
                    sepay_tx_id BIGINT PRIMARY KEY,
                    reference_code VARCHAR(64) NULL,
                    order_id VARCHAR(32) NULL,
                    transfer_type VARCHAR(8) NULL,
                    transfer_amount BIGINT NULL,
                    received_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    raw_json TEXT NULL
                )
                """
            )
            conn.commit()

    @staticmethod
    def try_insert(conn, *, sepay_tx_id: int, reference_code: str | None, order_id: str | None,
                   transfer_type: str | None, transfer_amount: int | None, raw_json: str | None) -> bool:
        """Trả True nếu insert mới, False nếu đã tồn tại."""
        SepayWebhookEvent.create_table(conn)
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT IGNORE INTO sepay_webhook_events (
                    sepay_tx_id, reference_code, order_id, transfer_type, transfer_amount, raw_json
                )
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (
                    int(sepay_tx_id),
                    (reference_code or None),
                    (order_id or None),
                    (transfer_type or None),
                    (int(transfer_amount) if transfer_amount is not None else None),
                    (raw_json or None),
                ),
            )
            inserted = cur.rowcount > 0
            conn.commit()
            return bool(inserted)
