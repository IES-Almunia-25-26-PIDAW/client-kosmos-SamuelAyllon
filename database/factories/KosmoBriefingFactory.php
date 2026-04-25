<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\KosmoBriefing>
 */
class KosmoBriefingFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'patient_id' => null,
            'appointment_id' => null,
            'type' => 'daily',
            'content' => ['summary' => fake()->paragraph()],
            'is_read' => false,
            'for_date' => now()->toDateString(),
        ];
    }

    public function preSession(): static
    {
        return $this->state(['type' => 'pre_session']);
    }

    public function postSession(): static
    {
        return $this->state(['type' => 'post_session']);
    }

    public function weekly(): static
    {
        return $this->state(['type' => 'weekly']);
    }

    public function nudge(): static
    {
        return $this->state(['type' => 'nudge']);
    }

    public function read(): static
    {
        return $this->state(['is_read' => true]);
    }
}
