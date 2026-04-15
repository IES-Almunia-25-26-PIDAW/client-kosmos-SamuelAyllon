<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProfessionalProfile>
 */
class ProfessionalProfileFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'             => User::factory(),
            'license_number'      => fake()->numerify('LIC-#####'),
            'collegiate_number'   => fake()->numerify('M-#####'),
            'specialties'         => fake()->randomElements(
                ['clinical', 'cognitive_behavioral', 'child', 'couples', 'trauma', 'systemic'],
                fake()->numberBetween(1, 3)
            ),
            'verification_status' => 'verified',
            'bio'                 => fake()->optional(0.7)->paragraph(),
            'verified_at'         => now()->subDays(fake()->numberBetween(10, 365)),
        ];
    }
}
