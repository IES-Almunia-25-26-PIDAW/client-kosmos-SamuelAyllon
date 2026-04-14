<?php

namespace Database\Factories;

use App\Models\Clinic;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PatientProfile>
 */
class PatientProfileFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'         => User::factory(),
            'clinic_id'       => Clinic::factory(),
            'professional_id' => User::factory(),
            'email'           => fake()->optional(0.7)->safeEmail(),
            'phone'           => fake()->optional(0.6)->numerify('6## ### ###'),
            'avatar_path'     => null,
            'is_active'       => true,
            'clinical_notes'  => fake()->optional(0.5)->paragraph(),
            'diagnosis'       => fake()->optional(0.4)->sentence(),
            'treatment_plan'  => fake()->optional(0.4)->paragraph(),
            'referral_source' => fake()->optional(0.3)->word(),
            'status'          => 'active',
            'first_session_at'=> null,
            'last_session_at' => null,
        ];
    }

    public function discharged(): static
    {
        return $this->state(['status' => 'discharged', 'is_active' => false]);
    }

    public function suspended(): static
    {
        return $this->state(['status' => 'suspended']);
    }
}
