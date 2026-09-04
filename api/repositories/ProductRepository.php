<?php

class ProductRepository
{
    /**
     * @param array{category_id?:int|null, search?:string|null} $filters
     */
    public function all(array $filters = []): array
    {
        $sql = 'SELECT p.*, c.name AS category_name
                FROM products p
                JOIN categories c ON c.id = p.category_id
                WHERE 1=1';
        $params = [];

        if (!empty($filters['category_id'])) {
            $sql .= ' AND p.category_id = :category_id';
            $params[':category_id'] = $filters['category_id'];
        }
        if (!empty($filters['search'])) {
            $sql .= ' AND p.name LIKE :search';
            $params[':search'] = '%' . $filters['search'] . '%';
        }

        $sql .= ' ORDER BY c.sort_order ASC, p.sort_order ASC, p.id ASC';

        $stmt = db()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function activeForPublicMenu(): array
    {
        $stmt = db()->query(
            "SELECT id, category_id, name, description, price, image_path, is_available, is_featured
             FROM products
             WHERE is_active = 1
             ORDER BY sort_order ASC, id ASC"
        );
        return $stmt->fetchAll();
    }

    public function find(int $id): ?array
    {
        $stmt = db()->prepare('SELECT * FROM products WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function nextSortOrder(int $categoryId): int
    {
        $stmt = db()->prepare('SELECT MAX(sort_order) FROM products WHERE category_id = :id');
        $stmt->execute([':id' => $categoryId]);
        $max = $stmt->fetchColumn();
        return $max === null ? 1 : ((int) $max + 1);
    }

    public function create(array $data): int
    {
        $stmt = db()->prepare(
            'INSERT INTO products
                (category_id, name, description, price, image_path, is_active, is_available, is_featured, sort_order)
             VALUES
                (:category_id, :name, :description, :price, :image_path, :is_active, :is_available, :is_featured, :sort_order)'
        );
        $stmt->execute([
            ':category_id' => $data['category_id'],
            ':name' => $data['name'],
            ':description' => $data['description'],
            ':price' => $data['price'],
            ':image_path' => $data['image_path'],
            ':is_active' => $data['is_active'] ? 1 : 0,
            ':is_available' => $data['is_available'] ? 1 : 0,
            ':is_featured' => $data['is_featured'] ? 1 : 0,
            ':sort_order' => $data['sort_order'],
        ]);
        return (int) db()->lastInsertId();
    }

    public function update(int $id, array $data): void
    {
        $stmt = db()->prepare(
            'UPDATE products SET
                category_id = :category_id, name = :name, description = :description,
                price = :price, image_path = :image_path, is_active = :is_active,
                is_available = :is_available, is_featured = :is_featured, sort_order = :sort_order
             WHERE id = :id'
        );
        $stmt->execute([
            ':id' => $id,
            ':category_id' => $data['category_id'],
            ':name' => $data['name'],
            ':description' => $data['description'],
            ':price' => $data['price'],
            ':image_path' => $data['image_path'],
            ':is_active' => $data['is_active'] ? 1 : 0,
            ':is_available' => $data['is_available'] ? 1 : 0,
            ':is_featured' => $data['is_featured'] ? 1 : 0,
            ':sort_order' => $data['sort_order'],
        ]);
    }

    public function updateImagePath(int $id, ?string $imagePath): void
    {
        $stmt = db()->prepare('UPDATE products SET image_path = :image_path WHERE id = :id');
        $stmt->execute([':id' => $id, ':image_path' => $imagePath]);
    }

    public function delete(int $id): void
    {
        $stmt = db()->prepare('DELETE FROM products WHERE id = :id');
        $stmt->execute([':id' => $id]);
    }

    public function counts(): array
    {
        $row = db()->query(
            'SELECT
                COUNT(*) AS total,
                SUM(is_active = 0) AS hidden,
                SUM(is_active = 1 AND is_available = 0) AS unavailable
             FROM products'
        )->fetch();

        return [
            'total' => (int) ($row['total'] ?? 0),
            'hidden' => (int) ($row['hidden'] ?? 0),
            'unavailable' => (int) ($row['unavailable'] ?? 0),
        ];
    }
}
