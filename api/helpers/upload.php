<?php

/**
 * Validates and stores an uploaded image. Returns the public URL path
 * (e.g. "/uploads/products/ab12cd34....webp") to store in the database.
 *
 * @param array $file  a single entry from $_FILES
 * @param string $subdir  "products" or "logo"
 */
function store_uploaded_image(array $file, string $subdir): string
{
    $config = require __DIR__ . '/../config/config.php';
    $uploads = $config['uploads'];

    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        throw new ApiException('Upload failed.', 400);
    }

    if (!is_uploaded_file($file['tmp_name'])) {
        throw new ApiException('Invalid upload.', 400);
    }

    if ($file['size'] > $uploads['max_bytes']) {
        $maxMb = round($uploads['max_bytes'] / 1024 / 1024, 1);
        throw new ApiException("Image is too large. Maximum size is {$maxMb}MB.", 422);
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($file['tmp_name']);

    $allowed = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
    ];

    if (!isset($allowed[$mimeType])) {
        throw new ApiException('Only JPEG, PNG and WEBP images are allowed.', 422);
    }

    if (@getimagesize($file['tmp_name']) === false) {
        throw new ApiException('File is not a valid image.', 422);
    }

    $subdir = $subdir === 'logo' ? 'logo' : 'products';
    $targetDir = $uploads['path'] . '/' . $subdir;
    if (!is_dir($targetDir) && !mkdir($targetDir, 0755, true) && !is_dir($targetDir)) {
        throw new ApiException('Could not prepare upload directory.', 500);
    }

    $filename = safe_filename($allowed[$mimeType]);
    $destination = $targetDir . '/' . $filename;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        throw new ApiException('Could not save uploaded file.', 500);
    }

    return $uploads['url'] . '/' . $subdir . '/' . $filename;
}

/**
 * Deletes a previously stored image given its public URL path, if it lives
 * inside the configured uploads directory. Silently ignores missing files.
 */
function delete_uploaded_image(?string $publicPath): void
{
    if (!$publicPath) {
        return;
    }
    $config = require __DIR__ . '/../config/config.php';
    $uploads = $config['uploads'];

    if (!str_starts_with($publicPath, $uploads['url'] . '/')) {
        return;
    }

    $relative = substr($publicPath, strlen($uploads['url']) + 1);
    $relative = str_replace(['..', "\0"], '', $relative);
    $fullPath = $uploads['path'] . '/' . $relative;

    if (is_file($fullPath)) {
        @unlink($fullPath);
    }
}
