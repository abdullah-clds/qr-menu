<?php

function client_ip(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

function login_rate_limit_check(string $username): void
{
    $config = require __DIR__ . '/../config/config.php';
    $login = $config['login'];

    $stmt = db()->prepare(
        'SELECT COUNT(*) FROM login_attempts
         WHERE ip_address = :ip AND created_at > (NOW() - INTERVAL :minutes MINUTE)'
    );
    $stmt->bindValue(':ip', client_ip());
    $stmt->bindValue(':minutes', $login['window_minutes'], PDO::PARAM_INT);
    $stmt->execute();

    if ((int) $stmt->fetchColumn() >= $login['max_attempts']) {
        throw new ApiException('Too many login attempts. Please try again later.', 429);
    }
}

function login_rate_limit_register_failure(string $username): void
{
    $stmt = db()->prepare(
        'INSERT INTO login_attempts (ip_address, username, created_at) VALUES (:ip, :username, NOW())'
    );
    $stmt->execute([':ip' => client_ip(), ':username' => $username]);
}

function login_rate_limit_clear(): void
{
    $stmt = db()->prepare('DELETE FROM login_attempts WHERE ip_address = :ip');
    $stmt->execute([':ip' => client_ip()]);
}
