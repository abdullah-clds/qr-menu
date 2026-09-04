<?php

function json_response(mixed $data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => true, 'data' => $data], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function json_error(string $message, int $status = 400, ?array $fieldErrors = null): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    $payload = ['success' => false, 'error' => $message];
    if ($fieldErrors) {
        $payload['fields'] = $fieldErrors;
    }
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function request_json(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) {
        return [];
    }
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        throw new ApiException('Invalid JSON body.', 400);
    }
    return $decoded;
}
