<?php

function require_csrf(): void
{
    if (!csrf_verify()) {
        throw new ApiException('Invalid or missing CSRF token.', 419);
    }
}
