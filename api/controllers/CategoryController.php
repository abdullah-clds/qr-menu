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
}
