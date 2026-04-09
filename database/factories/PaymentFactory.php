<?php

namespace Database\Factories;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'patient_id'            => Patient::factory(),
            'user_id'               => User::factory(),
            'consulting_session_id' => null,
            'amount'                => fake()->randomFloat(2, 40, 200),
            'concept'               => fake()->optional(0.7)->sentence(3),
            'payment_method'        => fake()->optional(0.8)->randomElement(['cash', 'bizum', 'transfer', 'card']),
            'status'                => 'pending',
            'due_date'              => fake()->dateTimeBetween('-1 month', '+2 months')->format('Y-m-d'),
            'paid_at'               => null,
            'invoice_number'        => null,
        ];
    }

    public function paid(): static
    {
        return $this->state([
            'status'  => 'paid',
            'paid_at' => now(),
        ]);
    }

    public function overdue(): static
    {
        return $this->state([
            'status'   => 'overdue',
            'due_date' => fake()->dateTimeBetween('-3 months', '-1 day')->format('Y-m-d'),
        ]);
    }
}
