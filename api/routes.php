<?php

/**
 * Route table: [method, path pattern, [ControllerClass, 'method'], requiresAuth, requiresCsrf]
 * Path segments wrapped in {} are captured and passed as handler arguments in order.
 */
return [
    ['GET', 'public/menu', [PublicMenuController::class, 'show'], false, false],

    ['POST', 'auth/login', [AuthController::class, 'login'], false, false],
    ['POST', 'auth/logout', [AuthController::class, 'logout'], true, true],
    ['GET', 'auth/me', [AuthController::class, 'me'], true, false],
    ['GET', 'csrf-token', [AuthController::class, 'csrfToken'], false, false],

    ['GET', 'admin/dashboard', [DashboardController::class, 'show'], true, false],

    ['GET', 'admin/categories', [CategoryController::class, 'index'], true, false],
    ['POST', 'admin/categories', [CategoryController::class, 'store'], true, true],
    ['PUT', 'admin/categories/{id}', [CategoryController::class, 'update'], true, true],
    ['DELETE', 'admin/categories/{id}', [CategoryController::class, 'destroy'], true, true],

    ['GET', 'admin/products', [ProductController::class, 'index'], true, false],
    ['POST', 'admin/products', [ProductController::class, 'store'], true, true],
    ['PUT', 'admin/products/{id}', [ProductController::class, 'update'], true, true],
    ['DELETE', 'admin/products/{id}', [ProductController::class, 'destroy'], true, true],
    ['POST', 'admin/products/{id}/image', [ProductController::class, 'uploadImage'], true, true],

    ['GET', 'admin/settings', [SettingsController::class, 'show'], true, false],
    ['PUT', 'admin/settings', [SettingsController::class, 'update'], true, true],
    ['POST', 'admin/settings/logo', [SettingsController::class, 'uploadLogo'], true, true],
];
