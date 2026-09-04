<?php

function require_string(array $input, string $key, int $maxLength = 255, bool $required = true): ?string
{
    $value = $input[$key] ?? null;
    if ($value === null || $value === '') {
        if ($required) {
            throw new ApiException("Field '{$key}' is required.", 422, [$key => 'required']);
        }
        return null;
    }
    if (!is_string($value)) {
        throw new ApiException("Field '{$key}' must be a string.", 422, [$key => 'invalid_type']);
    }
    $value = trim($value);
    if (mb_strlen($value) > $maxLength) {
        throw new ApiException("Field '{$key}' must be at most {$maxLength} characters.", 422, [$key => 'too_long']);
    }
    return $value;
}

function require_price(array $input, string $key = 'price'): string
{
    $value = $input[$key] ?? null;
    if ($value === null || $value === '') {
        throw new ApiException("Field '{$key}' is required.", 422, [$key => 'required']);
    }
    if (!is_numeric($value) || (float) $value < 0) {
        throw new ApiException("Field '{$key}' must be a non-negative number.", 422, [$key => 'invalid']);
    }
    return number_format((float) $value, 2, '.', '');
}

function optional_bool(array $input, string $key, bool $default = true): bool
{
    if (!array_key_exists($key, $input)) {
        return $default;
    }
    return filter_var($input[$key], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? $default;
}

function optional_int(array $input, string $key, ?int $default = null): ?int
{
    if (!array_key_exists($key, $input) || $input[$key] === null || $input[$key] === '') {
        return $default;
    }
    if (!is_numeric($input[$key])) {
        throw new ApiException("Field '{$key}' must be a number.", 422, [$key => 'invalid']);
    }
    return (int) $input[$key];
}
