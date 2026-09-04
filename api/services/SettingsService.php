<?php

class SettingsService
{
    private SettingsRepository $settings;

    public function __construct()
    {
        $this->settings = new SettingsRepository();
    }

    public function get(): array
    {
        return $this->settings->get();
    }

    public function update(array $input): array
    {
        $data = [
            'restaurant_name' => require_string($input, 'restaurant_name', 160, false) ?? '',
            'menu_title' => require_string($input, 'menu_title', 160, false) ?? '',
            'currency' => require_string($input, 'currency', 10, false) ?? 'TRY',
            'phone' => require_string($input, 'phone', 40, false),
            'address' => require_string($input, 'address', 255, false),
            'instagram' => require_string($input, 'instagram', 120, false),
            'opening_hours' => require_string($input, 'opening_hours', 255, false),
        ];

        $this->settings->update($data);
        return $this->settings->get();
    }

    public function uploadLogo(array $file): array
    {
        $current = $this->settings->get();
        $publicPath = store_uploaded_image($file, 'logo');
        delete_uploaded_image($current['logo_path']);
        $this->settings->updateLogoPath($publicPath);
        return $this->settings->get();
    }
}
