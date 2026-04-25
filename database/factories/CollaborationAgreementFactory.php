<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CollaborationAgreement>
 */
class CollaborationAgreementFactory extends Factory
{
    public function definition(): array
    {
        return [
            'professional_a_id' => User::factory(),
            'professional_b_id' => User::factory(),
            'workspace_id'      => null,
            'start_date'        => now()->subDays(fake()->numberBetween(1, 180))->toDateString(),
            'end_date'          => null,
            'status'            => 'active',
            'terms'             => [
                'scope' => 'general collaboration',
                'revenue_share' => null,
            ],
        ];
    }
}
