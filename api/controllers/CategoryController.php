<?php

class CategoryController
{
    private CategoryService $service;

    public function __construct()
    {
        $this->service = new CategoryService();
    }

    public function index(): void
    {
        json_response(['categories' => $this->service->list()]);
    }

    public function store(): void
    {
        $category = $this->service->create(request_json());
        json_response(['category' => $category], 201);
    }

    public function update(string $id): void
    {
        $category = $this->service->update((int) $id, request_json());
        json_response(['category' => $category]);
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
        $category = $this->service->uploadImage((int) $id, $_FILES['image']);
        json_response(['category' => $category]);
    }

    public function removeImage(string $id): void
    {
        $category = $this->service->removeImage((int) $id);
        json_response(['category' => $category]);
    }
}
