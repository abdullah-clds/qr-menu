<?php

function require_admin(): array
{
    if (empty($_SESSION['admin_id'])) {
        throw new ApiException('Authentication required.', 401);
    }
    return [
        'id' => $_SESSION['admin_id'],
        'username' => $_SESSION['admin_username'] ?? null,
        'name' => $_SESSION['admin_name'] ?? null,
    ];
}
