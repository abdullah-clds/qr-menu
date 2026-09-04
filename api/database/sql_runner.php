<?php

declare(strict_types=1);

function run_sql_file(PDO $pdo, string $path): void
{
    $sql = file_get_contents($path);
    if ($sql === false) {
        throw new RuntimeException("Cannot read {$path}");
    }

    // Strip full-line comments before splitting so they can't glue onto
    // (and hide) the statement that follows them.
    $lines = array_filter(
        explode("\n", $sql),
        static fn (string $line): bool => !str_starts_with(trim($line), '--')
    );
    $sql = implode("\n", $lines);

    $statements = array_filter(array_map('trim', preg_split('/;\s*(\r?\n|$)/', $sql)));
    foreach ($statements as $statement) {
        if ($statement === '') {
            continue;
        }
        $pdo->exec($statement);
    }
}
