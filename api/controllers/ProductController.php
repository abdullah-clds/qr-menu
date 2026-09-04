<?php

class ProductController
{
    private ProductService $service;

    public function __construct()
    {
        $this->service = new ProductService();
    }

    public function index(): void
    {
        $filters = [
            'category_id' => isset($_GET['category_id']) ? (int) $_GET['category_id'] : null,
            'search' => isset($_GET['search']) ? trim((string) $_GET['search']) : null,
        ];
        json_response(['products' => $this->service->list($filters)]);
    }

    public function store(): void
    {
        $product = $this->service->create(request_json());
        json_response(['product' => $product], 201);
    }

    public function update(string $id): void
    {
        $product = $this->service->update((int) $id, request_json());
        json_response(['product' => $product]);
    }

    public function destroy(string $id): void
    {
        $this->service->delete((int) $id);
        json_response(['deleted' => true]);
    }

    public function uploadImage(string $id): void
    {
        if (empty($_FILES['image'])) {
            throw new ApiException("No file uploaded under field 'image'.", 422);
        }
        $product = $this->service->uploadImage((int) $id, $_FILES['image']);
        json_response(['product' => $product]);
    }
}
