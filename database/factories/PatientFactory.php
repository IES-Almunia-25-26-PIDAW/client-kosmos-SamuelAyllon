<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Patient>
 */
class PatientFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'            => User::factory(),
            'project_name'       => fake()->name(),
            'brand_tone'         => fake()->optional(0.5)->word(),
            'service_scope'      => fake()->optional(0.5)->sentence(),
            'next_deadline'      => fake()->optional(0.4)->dateTimeBetween('now', '+6 months')?->format('Y-m-d'),
            'email'              => fake()->optional(0.7)->safeEmail(),
            'phone'              => fake()->optional(0.6)->numerify('6## ### ###'),
            'is_active'          => true,
            'payment_status'     => 'paid',
            'has_valid_consent'  => false,
            'has_open_agreement' => false,
        ];
    }

    public function inactive(): static
    {
        return $this->state(['is_active' => false]);
    }

    public function withPendingPayment(): static
    {
        return $this->state(['payment_status' => 'pending']);
    }

    public function withOverduePayment(): static
    {
        return $this->state(['payment_status' => 'overdue']);
    }

    public function withConsent(): static
    {
        return $this->state(['has_valid_consent' => true]);
    }

    public function withOpenAgreement(): static
    {
        return $this->state(['has_open_agreement' => true]);
    }
}
