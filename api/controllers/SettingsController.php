<?php

class SettingsController
{
    private SettingsService $service;

    public function __construct()
    {
        $this->service = new SettingsService();
    }

    public function show(): void
    {
        json_response(['settings' => $this->service->get()]);
    }

    public function update(): void
    {
        json_response(['settings' => $this->service->update(request_json())]);
    }

    public function uploadLogo(): void
    {
        if (empty($_FILES['logo'])) {
            throw new ApiException("No file uploaded under field 'logo'.", 422);
        }
        json_response(['settings' => $this->service->uploadLogo($_FILES['logo'])]);
    }
}
