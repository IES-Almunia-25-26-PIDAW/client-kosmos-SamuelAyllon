<?php

namespace Database\Factories;

use App\Models\PatientProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Referral>
 */
class ReferralFactory extends Factory
{
    public function definition(): array
    {
        return [
            'from_professional_id' => User::factory(),
            'to_professional_id'   => User::factory(),
            'patient_id'           => PatientProfile::factory(),
            'status'               => 'pending',
            'reason'               => fake()->sentence(),
            'responded_at'         => null,
        ];
    }

    public function accepted(): static
    {
        return $this->state([
            'status' => 'accepted',
            'responded_at' => now(),
        ]);
    }
}
