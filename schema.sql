-- MySQL schema for the application database.
-- This script creates only application tables (not database creation).
-- Run after selecting your target database, e.g.:
-- USE khoaluantn;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(128) NOT NULL UNIQUE,
    password_hash VARCHAR(256) NOT NULL,
    email VARCHAR(128) NOT NULL UNIQUE,
    fullname VARCHAR(128) NOT NULL,
    google_id VARCHAR(128) NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    avatar_url VARCHAR(500) NULL,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    force_change_password BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE KEY uq_users_google_id (google_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_settings (
    user_id INTEGER PRIMARY KEY,
    theme VARCHAR(20) DEFAULT 'light',
    language VARCHAR(10) DEFAULT 'vi',
    notifications BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS prediction_history (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER NOT NULL,
    image_path VARCHAR(500) NOT NULL,
    breed VARCHAR(200),
    confidence FLOAT,
    species VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_prediction_history_user_created (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_quota (
    user_id INTEGER PRIMARY KEY,
    plan VARCHAR(20) NOT NULL DEFAULT 'free',
    plan_expire TIMESTAMP NULL,
    paid_uses_remaining INTEGER NULL,
    ad_views_used INTEGER NOT NULL DEFAULT 0,
    ad_unlocks_remaining INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_payment_orders_user_created (user_id, created_at),
    INDEX idx_payment_orders_status_created (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sepay_webhook_events (
    sepay_tx_id BIGINT PRIMARY KEY,
    reference_code VARCHAR(64) NULL,
    order_id VARCHAR(32) NULL,
    transfer_type VARCHAR(8) NULL,
    transfer_amount BIGINT NULL,
    received_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    raw_json TEXT NULL,
    INDEX idx_sepay_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optional migrations for old schemas (run when needed):
-- ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user';
-- ALTER TABLE users ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;
-- ALTER TABLE users ADD COLUMN google_id VARCHAR(128) NULL;
-- ALTER TABLE user_quota ADD COLUMN plan_expire TIMESTAMP NULL;
-- ALTER TABLE user_quota ADD COLUMN paid_uses_remaining INTEGER NULL;

-- Promote a user to admin:
-- UPDATE users SET role = 'admin' WHERE username = '<username_admin>';

-- Lock a user:
-- UPDATE users SET is_active = FALSE WHERE username = '<username>';

-- Verify:
-- SELECT id, username, created_at FROM users ORDER BY id;
