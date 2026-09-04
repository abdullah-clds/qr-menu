<?php

class CategoryRepository
{
    public function all(bool $onlyActive = false): array
    {
        $sql = 'SELECT * FROM categories';
        if ($onlyActive) {
            $sql .= ' WHERE is_active = 1';
        }
        $sql .= ' ORDER BY sort_order ASC, id ASC';
        return db()->query($sql)->fetchAll();
    }

    public function find(int $id): ?array
    {
        $stmt = db()->prepare('SELECT * FROM categories WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function slugExists(string $slug, ?int $excludeId = null): bool
    {
        $sql = 'SELECT COUNT(*) FROM categories WHERE slug = :slug';
        $params = [':slug' => $slug];
        if ($excludeId !== null) {
            $sql .= ' AND id != :excludeId';
            $params[':excludeId'] = $excludeId;
        }
        $stmt = db()->prepare($sql);
        $stmt->execute($params);
        return (int) $stmt->fetchColumn() > 0;
    }

    public function nextSortOrder(): int
    {
        $max = db()->query('SELECT MAX(sort_order) FROM categories')->fetchColumn();
        return $max === null ? 1 : ((int) $max + 1);
    }

    public function create(array $data): int
    {
        $stmt = db()->prepare(
            'INSERT INTO categories (name, slug, description, sort_order, is_active)
             VALUES (:name, :slug, :description, :sort_order, :is_active)'
        );
        $stmt->execute([
            ':name' => $data['name'],
            ':slug' => $data['slug'],
            ':description' => $data['description'],
            ':sort_order' => $data['sort_order'],
            ':is_active' => $data['is_active'] ? 1 : 0,
        ]);
        return (int) db()->lastInsertId();
    }

    public function update(int $id, array $data): void
    {
        $stmt = db()->prepare(
            'UPDATE categories SET name = :name, slug = :slug, description = :description,
             sort_order = :sort_order, is_active = :is_active WHERE id = :id'
        );
        $stmt->execute([
            ':id' => $id,
            ':name' => $data['name'],
            ':slug' => $data['slug'],
            ':description' => $data['description'],
            ':sort_order' => $data['sort_order'],
            ':is_active' => $data['is_active'] ? 1 : 0,
        ]);
    }

    public function updateImagePath(int $id, ?string $imagePath): void
    {
        $stmt = db()->prepare('UPDATE categories SET image_path = :image_path WHERE id = :id');
        $stmt->execute([':id' => $id, ':image_path' => $imagePath]);
    }

    public function delete(int $id): void
    {
        $stmt = db()->prepare('DELETE FROM categories WHERE id = :id');
        $stmt->execute([':id' => $id]);
    }

    public function countProducts(int $categoryId): int
    {
        $stmt = db()->prepare('SELECT COUNT(*) FROM products WHERE category_id = :id');
        $stmt->execute([':id' => $categoryId]);
        return (int) $stmt->fetchColumn();
    }

    /**
     * Active product count per category, in one query — avoids N+1 on the
     * public menu grid regardless of category count.
     *
     * @return array<int,int> category_id => count
     */
    public function activeProductCounts(): array
    {
        $rows = db()->query(
            'SELECT category_id, COUNT(*) AS cnt FROM products WHERE is_active = 1 GROUP BY category_id'
        )->fetchAll();

        $counts = [];
        foreach ($rows as $row) {
            $counts[(int) $row['category_id']] = (int) $row['cnt'];
        }
        return $counts;
    }
}
