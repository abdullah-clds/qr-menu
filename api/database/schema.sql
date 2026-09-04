-- QR Restaurant Menu System — base schema
-- MySQL 8+ / MariaDB compatible. Safe to re-run (CREATE TABLE IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS admins (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    username VARCHAR(60) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    last_login_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_admins_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(140) NOT NULL,
    description TEXT NULL,
    image_path VARCHAR(255) NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_categories_slug (slug),
    KEY idx_categories_active_sort (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id INT UNSIGNED NOT NULL,
    name VARCHAR(160) NOT NULL,
    description TEXT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_path VARCHAR(255) NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    is_available TINYINT(1) NOT NULL DEFAULT 1,
    is_featured TINYINT(1) NOT NULL DEFAULT 0,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_products_category_active (category_id, is_active, sort_order),
    CONSTRAINT fk_products_category FOREIGN KEY (category_id)
        REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS settings (
    id TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
    restaurant_name VARCHAR(160) NOT NULL DEFAULT '',
    menu_title VARCHAR(160) NOT NULL DEFAULT '',
    menu_description VARCHAR(255) NULL,
    logo_path VARCHAR(255) NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'TRY',
    phone VARCHAR(40) NULL,
    address VARCHAR(255) NULL,
    email VARCHAR(160) NULL,
    instagram VARCHAR(120) NULL,
    facebook VARCHAR(120) NULL,
    tiktok VARCHAR(120) NULL,
    whatsapp VARCHAR(40) NULL,
    opening_hours VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Additive, idempotent upgrades for databases created before the columns
-- above existed. MySQL 8.0.29+/MariaDB 10.0+ support IF NOT EXISTS here;
-- CREATE TABLE IF NOT EXISTS above never touches an already-existing table.
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_path VARCHAR(255) NULL AFTER description;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS menu_description VARCHAR(255) NULL AFTER menu_title;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS email VARCHAR(160) NULL AFTER address;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS facebook VARCHAR(120) NULL AFTER instagram;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS tiktok VARCHAR(120) NULL AFTER facebook;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(40) NULL AFTER tiktok;

CREATE TABLE IF NOT EXISTS login_attempts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    username VARCHAR(60) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_login_attempts_ip_time (ip_address, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
