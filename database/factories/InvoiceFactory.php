<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 30, 200);
        $taxRate = 0;
        $taxAmount = round($subtotal * $taxRate / 100, 2);
        $total = $subtotal + $taxAmount;

        return [
            'workspace_id' => Workspace::factory(),
            'patient_id' => User::factory(),
            'professional_id' => User::factory(),
            'invoice_number' => 'CK-'.now()->year.'-'.fake()->unique()->numerify('#####'),
            'status' => 'draft',
            'issued_at' => null,
            'due_at' => null,
            'paid_at' => null,
            'subtotal' => $subtotal,
            'tax_rate' => $taxRate,
            'tax_amount' => $taxAmount,
            'total' => $total,
            'payment_method' => null,
            'stripe_payment_id' => null,
            'notes' => null,
            'pdf_path' => null,
        ];
    }

    public function draft(): static
    {
        return $this->state(['status' => 'draft']);
    }

    public function sent(): static
    {
        return $this->state([
            'status' => 'sent',
            'issued_at' => now()->subDays(fake()->numberBetween(1, 30)),
            'due_at' => now()->addDays(30)->toDateString(),
        ]);
    }

    public function paid(): static
    {
        $issuedAt = now()->subDays(fake()->numberBetween(5, 60));

        return $this->state([
            'status' => 'paid',
            'issued_at' => $issuedAt,
            'due_at' => $issuedAt->copy()->addDays(30)->toDateString(),
            'paid_at' => now()->subDays(fake()->numberBetween(1, 30)),
            'payment_method' => fake()->randomElement(['transfer', 'bizum', 'card', 'cash', 'stripe', 'other']),
        ]);
    }

    public function overdue(): static
    {
        $issuedAt = now()->subDays(fake()->numberBetween(40, 90));

        return $this->state([
            'status' => 'overdue',
            'issued_at' => $issuedAt,
            'due_at' => $issuedAt->copy()->addDays(30)->toDateString(),
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(['status' => 'cancelled']);
    }
}
