<?php

class ApiException extends RuntimeException
{
    /** @var array<string,string>|null */
    private ?array $fieldErrors;

    public function __construct(string $message, private int $status = 400, ?array $fieldErrors = null)
    {
        parent::__construct($message);
        $this->fieldErrors = $fieldErrors;
    }

    public function getStatus(): int
    {
        return $this->status;
    }

    public function getFieldErrors(): ?array
    {
        return $this->fieldErrors;
    }
}
