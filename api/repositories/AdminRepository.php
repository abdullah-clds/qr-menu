<?php

class AdminRepository
{
    public function findByUsername(string $username): ?array
    {
        $stmt = db()->prepare('SELECT * FROM admins WHERE username = :username LIMIT 1');
        $stmt->execute([':username' => $username]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function touchLastLogin(int $id): void
    {
        $stmt = db()->prepare('UPDATE admins SET last_login_at = NOW() WHERE id = :id');
        $stmt->execute([':id' => $id]);
    }
}
