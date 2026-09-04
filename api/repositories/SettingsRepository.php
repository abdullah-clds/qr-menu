<?php

class SettingsRepository
{
    public function get(): array
    {
        $row = db()->query('SELECT * FROM settings WHERE id = 1 LIMIT 1')->fetch();
        if ($row) {
            return $row;
        }

        db()->exec("INSERT INTO settings (id, restaurant_name, menu_title, currency) VALUES (1, '', '', 'TRY')");
        return db()->query('SELECT * FROM settings WHERE id = 1 LIMIT 1')->fetch();
    }

    public function update(array $data): void
    {
        $this->get(); // ensure row exists

        $stmt = db()->prepare(
            'UPDATE settings SET
                restaurant_name = :restaurant_name, menu_title = :menu_title, currency = :currency,
                phone = :phone, address = :address, instagram = :instagram, opening_hours = :opening_hours
             WHERE id = 1'
        );
        $stmt->execute([
            ':restaurant_name' => $data['restaurant_name'],
            ':menu_title' => $data['menu_title'],
            ':currency' => $data['currency'],
            ':phone' => $data['phone'],
            ':address' => $data['address'],
            ':instagram' => $data['instagram'],
            ':opening_hours' => $data['opening_hours'],
        ]);
    }

    public function updateLogoPath(?string $logoPath): void
    {
        $this->get();
        $stmt = db()->prepare('UPDATE settings SET logo_path = :logo_path WHERE id = 1');
        $stmt->execute([':logo_path' => $logoPath]);
    }
}
