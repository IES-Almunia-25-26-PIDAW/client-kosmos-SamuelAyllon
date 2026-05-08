<?php

namespace App\DTOs;

final readonly class PatientUpsertData
{
    public function __construct(
        public string $name,
        public ?string $email = null,
        public ?string $phone = null,
        public ?string $consultationReason = null,
        public ?string $therapeuticApproach = null,
    ) {}
}
