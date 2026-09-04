<?php

declare(strict_types=1);

$config = require __DIR__ . '/config/config.php';

// Local dev only: `php -S` invokes this script for every request, including
// requests for uploaded images. Let the built-in server serve those directly
// instead of 404ing them through the API router. Deliberately scoped to
// uploads/ only — never the whole project root (that would leak .env and
// source files). Apache never reaches this script for such paths in
// production; it serves uploads/ directly.
if (PHP_SAPI === 'cli-server') {
    $requestedPath = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '';
    $uploadsRoot = realpath(APP_ROOT . '/uploads');
    $requestedFile = realpath(APP_ROOT . $requestedPath);
    if (
        $uploadsRoot !== false
        && $requestedFile !== false
        && str_starts_with($requestedFile, $uploadsRoot . DIRECTORY_SEPARATOR)
        && is_file($requestedFile)
    ) {
        return false;
    }
}

spl_autoload_register(function (string $class) {
    foreach (['controllers', 'services', 'repositories', 'helpers', 'database'] as $dir) {
        $path = __DIR__ . "/{$dir}/{$class}.php";
        if (is_file($path)) {
            require_once $path;
            return;
        }
    }
});

require_once __DIR__ . '/database/connection.php';
require_once __DIR__ . '/helpers/response.php';
require_once __DIR__ . '/helpers/security.php';
require_once __DIR__ . '/helpers/validation.php';
require_once __DIR__ . '/helpers/upload.php';
require_once __DIR__ . '/middleware/auth_middleware.php';
require_once __DIR__ . '/middleware/csrf_middleware.php';
require_once __DIR__ . '/middleware/rate_limit.php';

error_reporting(E_ALL);
ini_set('display_errors', '0');

$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');

session_name($config['session']['name']);
session_set_cookie_params([
    'lifetime' => $config['session']['lifetime'],
    'path' => '/',
    'httponly' => true,
    'secure' => $isHttps,
    'samesite' => 'Lax',
]);
session_start();

$allowedOrigin = $config['cors']['allowed_origin'];
if ($allowedOrigin !== '' && ($_SERVER['HTTP_ORIGIN'] ?? '') === $allowedOrigin) {
    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    $httpMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    $requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
    $scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
    if ($scriptDir !== '/' && str_starts_with($requestPath, $scriptDir)) {
        $requestPath = substr($requestPath, strlen($scriptDir));
    }
    $requestPath = trim($requestPath, '/');
    if ($requestPath === '' || $requestPath === 'index.php') {
        $requestPath = trim((string) ($_GET['route'] ?? ''), '/');
    }
    $requestSegments = $requestPath === '' ? [] : explode('/', $requestPath);

    /** @var array $routes */
    $routes = require __DIR__ . '/routes.php';

    $matched = null;
    $params = [];
    foreach ($routes as [$routeMethod, $pattern, $handler, $requiresAuth, $requiresCsrf]) {
        if ($routeMethod !== $httpMethod) {
            continue;
        }
        $patternSegments = explode('/', $pattern);
        if (count($patternSegments) !== count($requestSegments)) {
            continue;
        }
        $candidateParams = [];
        $isMatch = true;
        foreach ($patternSegments as $i => $segment) {
            if (str_starts_with($segment, '{') && str_ends_with($segment, '}')) {
                $candidateParams[] = $requestSegments[$i];
                continue;
            }
            if ($segment !== $requestSegments[$i]) {
                $isMatch = false;
                break;
            }
        }
        if ($isMatch) {
            $matched = [$handler, $requiresAuth, $requiresCsrf];
            $params = $candidateParams;
            break;
        }
    }

    if ($matched === null) {
        throw new ApiException('Not found.', 404);
    }

    [[$controllerClass, $method], $requiresAuth, $requiresCsrf] = $matched;

    if ($requiresAuth) {
        require_admin();
    }
    if ($requiresCsrf) {
        require_csrf();
    }

    $controller = new $controllerClass();
    $controller->$method(...$params);
} catch (ApiException $e) {
    json_error($e->getMessage(), $e->getStatus(), $e->getFieldErrors());
} catch (Throwable $e) {
    if ($config['app']['debug']) {
        json_error($e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine(), 500);
    }
    error_log('[qr-menu-api] ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    json_error('Internal server error.', 500);
}
