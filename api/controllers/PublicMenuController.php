<?php

class PublicMenuController
{
    public function show(): void
    {
        $settings = (new SettingsRepository())->get();
        $categories = (new CategoryRepository())->all(onlyActive: true);
        $products = (new ProductRepository())->activeForPublicMenu();

        json_response([
            'settings' => [
                'restaurantName' => $settings['restaurant_name'],
                'menuTitle' => $settings['menu_title'],
                'logo' => $settings['logo_path'],
                'currency' => $settings['currency'],
                'phone' => $settings['phone'],
                'address' => $settings['address'],
                'instagram' => $settings['instagram'],
                'openingHours' => $settings['opening_hours'],
            ],
            'categories' => array_map(static fn (array $c): array => [
                'id' => (int) $c['id'],
                'name' => $c['name'],
                'slug' => $c['slug'],
                'description' => $c['description'],
            ], $categories),
            'products' => array_map(static fn (array $p): array => [
                'id' => (int) $p['id'],
                'categoryId' => (int) $p['category_id'],
                'name' => $p['name'],
                'description' => $p['description'],
                'price' => $p['price'],
                'image' => $p['image_path'],
                'available' => (bool) $p['is_available'],
                'featured' => (bool) $p['is_featured'],
            ], $products),
        ]);
    }
}
