<?php

namespace Database\Factories;

use App\Models\PatientProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Document>
 */
class DocumentFactory extends Factory
{
    public function definition(): array
    {
        $filename = fake()->slug(3).'.pdf';

        return [
            'patient_id' => PatientProfile::factory(),
            'user_id' => User::factory(),
            'workspace_id' => null,
            'name' => $filename,
            'local_path' => 'documents/'.$filename,
            'mime_type' => 'application/pdf',
            'size_bytes' => fake()->numberBetween(10_000, 5_000_000),
            'category' => 'other',
            'is_rgpd' => false,
            'expires_at' => null,
        ];
    }

    public function rgpd(): static
    {
        return $this->state([
            'category' => 'rgpd_consent',
            'is_rgpd' => true,
        ]);
    }

    public function expiring(): static
    {
        return $this->state([
            'expires_at' => now()->addDays(fake()->numberBetween(1, 30))->toDateString(),
        ]);
    }
}
