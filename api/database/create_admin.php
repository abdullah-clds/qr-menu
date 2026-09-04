<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit('CLI only.');
}

require __DIR__ . '/connection.php';

$username = $argv[1] ?? null;
$password = $argv[2] ?? null;
$name = $argv[3] ?? 'Admin';

if (!$username || !$password) {
    fwrite(STDERR, "Usage: php create_admin.php <username> <password> [\"Full Name\"]\n");
    exit(1);
}

if (mb_strlen($password) < 8) {
    fwrite(STDERR, "Password must be at least 8 characters.\n");
    exit(1);
}

$pdo = db();
$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare(
    'INSERT INTO admins (name, username, password_hash)
     VALUES (:name, :username, :hash)
     ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash)'
);
$stmt->execute([':name' => $name, ':username' => $username, ':hash' => $hash]);

echo "Admin '{$username}' created/updated successfully.\n";
