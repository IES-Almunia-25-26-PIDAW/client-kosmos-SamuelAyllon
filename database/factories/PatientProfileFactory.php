<?php

namespace Database\Factories;

use App\Models\Workspace;
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
            'user_id' => User::factory(),
            'workspace_id' => Workspace::factory(),
            'professional_id' => User::factory(),
            'is_active' => true,
            'clinical_notes' => fake()->optional(0.5)->paragraph(),
            'diagnosis' => fake()->optional(0.4)->sentence(),
            'treatment_plan' => fake()->optional(0.4)->paragraph(),
            'referral_source' => fake()->optional(0.3)->word(),
            'status' => 'active',
            'first_session_at' => null,
            'last_session_at' => null,
        ];
    }

    public function discharged(): static
    {
        return $this->state(['status' => 'discharged', 'is_active' => false]);
    }

    public function inactive(): static
    {
        return $this->state(['status' => 'inactive', 'is_active' => false]);
    }
}
