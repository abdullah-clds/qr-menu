<?php

class AuthService
{
    private AdminRepository $admins;

    public function __construct()
    {
        $this->admins = new AdminRepository();
    }

    public function login(string $username, string $password): array
    {
        login_rate_limit_check($username);

        $admin = $this->admins->findByUsername($username);

        if (!$admin || !password_verify($password, $admin['password_hash'])) {
            login_rate_limit_register_failure($username);
            // Same message regardless of whether the username exists.
            throw new ApiException('Invalid username or password.', 401);
        }

        login_rate_limit_clear();
        $this->admins->touchLastLogin((int) $admin['id']);

        session_regenerate_id(true);
        $_SESSION['admin_id'] = (int) $admin['id'];
        $_SESSION['admin_username'] = $admin['username'];
        $_SESSION['admin_name'] = $admin['name'];
        unset($_SESSION['csrf_token']); // force a fresh token for the new session

        return [
            'id' => (int) $admin['id'],
            'username' => $admin['username'],
            'name' => $admin['name'],
        ];
    }

    public function logout(): void
    {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
        }
        session_destroy();
    }
}
