<?php

class ProductService
{
    private ProductRepository $products;
    private CategoryRepository $categories;

    public function __construct()
    {
        $this->products = new ProductRepository();
        $this->categories = new CategoryRepository();
    }

    public function list(array $filters): array
    {
        return $this->products->all($filters);
    }

    public function create(array $input): array
    {
        $categoryId = $this->requireCategory($input);
        $name = require_string($input, 'name', 160);
        $description = require_string($input, 'description', 4000, false);
        $price = require_price($input);

        $id = $this->products->create([
            'category_id' => $categoryId,
            'name' => $name,
            'description' => $description,
            'price' => $price,
            'image_path' => null,
            'is_active' => optional_bool($input, 'is_active', true),
            'is_available' => optional_bool($input, 'is_available', true),
            'is_featured' => optional_bool($input, 'is_featured', false),
            'sort_order' => optional_int($input, 'sort_order') ?? $this->products->nextSortOrder($categoryId),
        ]);

        return $this->products->find($id);
    }

    public function update(int $id, array $input): array
    {
        $existing = $this->products->find($id);
        if (!$existing) {
            throw new ApiException('Product not found.', 404);
        }

        $categoryId = $this->requireCategory($input);
        $name = require_string($input, 'name', 160);
        $description = require_string($input, 'description', 4000, false);
        $price = require_price($input);

        $this->products->update($id, [
            'category_id' => $categoryId,
            'name' => $name,
            'description' => $description,
            'price' => $price,
            'image_path' => $existing['image_path'],
            'is_active' => optional_bool($input, 'is_active', (bool) $existing['is_active']),
            'is_available' => optional_bool($input, 'is_available', (bool) $existing['is_available']),
            'is_featured' => optional_bool($input, 'is_featured', (bool) $existing['is_featured']),
            'sort_order' => optional_int($input, 'sort_order') ?? (int) $existing['sort_order'],
        ]);

        return $this->products->find($id);
    }

    public function delete(int $id): void
    {
        $existing = $this->products->find($id);
        if (!$existing) {
            throw new ApiException('Product not found.', 404);
        }
        delete_uploaded_image($existing['image_path']);
        $this->products->delete($id);
    }

    public function uploadImage(int $id, array $file): array
    {
        $existing = $this->products->find($id);
        if (!$existing) {
            throw new ApiException('Product not found.', 404);
        }

        $publicPath = store_uploaded_image($file, 'products');
        delete_uploaded_image($existing['image_path']);
        $this->products->updateImagePath($id, $publicPath);

        return $this->products->find($id);
    }

    private function requireCategory(array $input): int
    {
        $categoryId = optional_int($input, 'category_id');
        if ($categoryId === null) {
            throw new ApiException("Field 'category_id' is required.", 422, ['category_id' => 'required']);
        }
        if (!$this->categories->find($categoryId)) {
            throw new ApiException('Selected category does not exist.', 422, ['category_id' => 'not_found']);
        }
        return $categoryId;
    }
}
