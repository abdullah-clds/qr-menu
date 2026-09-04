<?php

require_once __DIR__ . '/env.php';

define('APP_ROOT', dirname(__DIR__, 2));

env_load(APP_ROOT . '/.env');

return [
    'app' => [
        'env' => env('APP_ENV', 'production'),
        'debug' => env('APP_DEBUG', false) === true,
    ],
    'cors' => [
        'allowed_origin' => env('CORS_ALLOWED_ORIGIN', ''),
    ],
    'db' => [
        'host' => env('DB_HOST', '127.0.0.1'),
        'port' => env('DB_PORT', '3306'),
        'name' => env('DB_NAME', ''),
        'user' => env('DB_USER', ''),
        'pass' => env('DB_PASS', ''),
        'charset' => env('DB_CHARSET', 'utf8mb4'),
    ],
    'session' => [
        'name' => env('SESSION_NAME', 'qr_menu_admin'),
        'lifetime' => (int) env('SESSION_LIFETIME', 7200),
    ],
    'login' => [
        'max_attempts' => (int) env('LOGIN_MAX_ATTEMPTS', 5),
        'window_minutes' => (int) env('LOGIN_WINDOW_MINUTES', 15),
    ],
    'uploads' => [
        'url' => rtrim(env('UPLOADS_URL', '/uploads'), '/'),
        'path' => APP_ROOT . '/' . trim(env('UPLOADS_PATH', 'uploads'), '/'),
        'max_bytes' => (int) env('UPLOAD_MAX_BYTES', 5 * 1024 * 1024),
    ],
];
