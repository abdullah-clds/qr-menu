<?php

class DashboardController
{
    public function show(): void
    {
        $productCounts = (new ProductRepository())->counts();
        $categories = (new CategoryRepository())->all();

        json_response([
            'totalProducts' => $productCounts['total'],
            'hiddenProducts' => $productCounts['hidden'],
            'unavailableProducts' => $productCounts['unavailable'],
            'totalCategories' => count($categories),
        ]);
    }
}
