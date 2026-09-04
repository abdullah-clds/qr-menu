-- Development seed data.
-- Clearly generic placeholders — NOT a real restaurant's branding, menu or prices.
-- Safe to re-run: uses INSERT IGNORE / ON DUPLICATE KEY so it will not
-- overwrite settings or data that has already been customized.

INSERT INTO settings (id, restaurant_name, menu_title, currency)
VALUES (1, 'Restoran Adınız', 'Menü', 'TRY')
ON DUPLICATE KEY UPDATE id = id;

INSERT IGNORE INTO categories (id, name, slug, sort_order, is_active) VALUES
    (1, 'Kahveler', 'kahveler', 1, 1),
    (2, 'Yemekler', 'yemekler', 2, 1),
    (3, 'Tatlılar', 'tatlilar', 3, 1),
    (4, 'İçecekler', 'icecekler', 4, 1);

INSERT IGNORE INTO products
    (id, category_id, name, description, price, is_active, is_available, is_featured, sort_order) VALUES
    (1, 1, 'Türk Kahvesi', 'Örnek ürün açıklaması.', 55.00, 1, 1, 1, 1),
    (2, 1, 'Filtre Kahve', 'Örnek ürün açıklaması.', 65.00, 1, 1, 0, 2),
    (3, 2, 'Örnek Ana Yemek', 'Örnek ürün açıklaması.', 165.00, 1, 1, 0, 1),
    (4, 2, 'Örnek Ara Sıcak', 'Örnek ürün açıklaması.', 110.00, 1, 0, 0, 2),
    (5, 3, 'Örnek Tatlı', 'Örnek ürün açıklaması.', 95.00, 1, 1, 1, 1),
    (6, 4, 'Maden Suyu', 'Örnek ürün açıklaması.', 30.00, 1, 1, 0, 1),
    (7, 4, 'Ayran', 'Örnek ürün açıklaması.', 35.00, 1, 1, 0, 2);
