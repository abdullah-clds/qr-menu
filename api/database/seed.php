<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit('CLI only.');
}

require __DIR__ . '/connection.php';
require __DIR__ . '/sql_runner.php';

try {
    run_sql_file(db(), __DIR__ . '/seed.sql');
    echo "Development seed data applied.\n";
} catch (Throwable $e) {
    fwrite(STDERR, 'Seeding failed: ' . $e->getMessage() . "\n");
    exit(1);
}
