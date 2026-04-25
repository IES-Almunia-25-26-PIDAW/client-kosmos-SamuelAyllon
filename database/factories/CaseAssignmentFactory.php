<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CaseAssignment>
 */
class CaseAssignmentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'patient_id' => User::factory(),
            'professional_id' => User::factory(),
            'workspace_id' => null,
            'is_primary' => true,
            'role' => 'primary',
            'status' => 'active',
            'started_at' => now()->subDays(fake()->numberBetween(1, 180))->toDateString(),
            'ended_at' => null,
            'notes' => null,
        ];
    }

    public function secondary(): static
    {
        return $this->state(['is_primary' => false, 'role' => 'secondary']);
    }

    public function substitute(): static
    {
        return $this->state(['is_primary' => false, 'role' => 'substitute']);
    }

    public function coTherapist(): static
    {
        return $this->state(['is_primary' => false, 'role' => 'co_therapist']);
    }

    public function paused(): static
    {
        return $this->state(['status' => 'paused']);
    }

    public function ended(): static
    {
        return $this->state([
            'status' => 'ended',
            'ended_at' => now()->subDays(fake()->numberBetween(1, 30))->toDateString(),
        ]);
    }
}
