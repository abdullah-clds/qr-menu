<?php

class AuthController
{
    public function login(): void
    {
        $input = request_json();
        $username = require_string($input, 'username', 60);
        $password = (string) ($input['password'] ?? '');
        if ($password === '') {
            throw new ApiException("Field 'password' is required.", 422, ['password' => 'required']);
        }

        $service = new AuthService();
        $admin = $service->login($username, $password);

        json_response(['admin' => $admin, 'csrfToken' => csrf_token()]);
    }

    public function logout(): void
    {
        (new AuthService())->logout();
        json_response(['loggedOut' => true]);
    }

    public function me(): void
    {
        json_response([
            'admin' => [
                'id' => $_SESSION['admin_id'],
                'username' => $_SESSION['admin_username'] ?? null,
                'name' => $_SESSION['admin_name'] ?? null,
            ],
            'csrfToken' => csrf_token(),
        ]);
    }

    public function csrfToken(): void
    {
        json_response(['csrfToken' => csrf_token()]);
    }
}
