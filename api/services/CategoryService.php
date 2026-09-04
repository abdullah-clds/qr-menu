<?php

class CategoryService
{
    private CategoryRepository $categories;

    public function __construct()
    {
        $this->categories = new CategoryRepository();
    }

    public function list(): array
    {
        return $this->categories->all();
    }

    public function create(array $input): array
    {
        $name = require_string($input, 'name', 120);
        $description = require_string($input, 'description', 2000, false);
        $isActive = optional_bool($input, 'is_active', true);
        $sortOrder = optional_int($input, 'sort_order') ?? $this->categories->nextSortOrder();

        $slug = $this->uniqueSlug($name);

        $id = $this->categories->create([
            'name' => $name,
            'slug' => $slug,
            'description' => $description,
            'sort_order' => $sortOrder,
            'is_active' => $isActive,
        ]);

        return $this->categories->find($id);
    }

    public function update(int $id, array $input): array
    {
        $existing = $this->categories->find($id);
        if (!$existing) {
            throw new ApiException('Category not found.', 404);
        }

        $name = require_string($input, 'name', 120);
        $description = require_string($input, 'description', 2000, false);
        $isActive = optional_bool($input, 'is_active', (bool) $existing['is_active']);
        $sortOrder = optional_int($input, 'sort_order') ?? (int) $existing['sort_order'];

        $slug = $name === $existing['name']
            ? $existing['slug']
            : $this->uniqueSlug($name, $id);

        $this->categories->update($id, [
            'name' => $name,
            'slug' => $slug,
            'description' => $description,
            'sort_order' => $sortOrder,
            'is_active' => $isActive,
        ]);

        return $this->categories->find($id);
    }

    public function delete(int $id): void
    {
        $existing = $this->categories->find($id);
        if (!$existing) {
            throw new ApiException('Category not found.', 404);
        }

        $productCount = $this->categories->countProducts($id);
        if ($productCount > 0) {
            throw new ApiException(
                "This category has {$productCount} product(s). Move or delete them first, " .
                'or deactivate the category instead of deleting it.',
                409
            );
        }

        delete_uploaded_image($existing['image_path']);
        $this->categories->delete($id);
    }

    public function uploadImage(int $id, array $file): array
    {
        $existing = $this->categories->find($id);
        if (!$existing) {
            throw new ApiException('Category not found.', 404);
        }

        $publicPath = store_uploaded_image($file, 'categories');
        delete_uploaded_image($existing['image_path']);
        $this->categories->updateImagePath($id, $publicPath);

        return $this->categories->find($id);
    }

    public function removeImage(int $id): array
    {
        $existing = $this->categories->find($id);
        if (!$existing) {
            throw new ApiException('Category not found.', 404);
        }

        delete_uploaded_image($existing['image_path']);
        $this->categories->updateImagePath($id, null);

        return $this->categories->find($id);
    }

    private function uniqueSlug(string $name, ?int $excludeId = null): string
    {
        $base = slugify($name);
        $slug = $base;
        $suffix = 2;
        while ($this->categories->slugExists($slug, $excludeId)) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }
        return $slug;
    }
}
