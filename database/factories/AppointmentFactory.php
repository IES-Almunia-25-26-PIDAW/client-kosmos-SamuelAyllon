<?php

namespace Database\Factories;

use App\Models\Clinic;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Appointment>
 */
class AppointmentFactory extends Factory
{
    public function definition(): array
    {
        $startsAt = fake()->dateTimeBetween('-1 month', '+1 month');
        $endsAt = (clone $startsAt)->modify('+50 minutes');

        return [
            'clinic_id'       => Clinic::factory(),
            'patient_id'      => User::factory(),
            'professional_id' => User::factory(),
            'service_id'      => null,
            'starts_at'       => $startsAt,
            'ends_at'         => $endsAt,
            'status'          => 'pending',
            'modality'        => fake()->randomElement(['in_person', 'video', 'phone']),
            'notes'           => null,
        ];
    }

    public function pending(): static
    {
        return $this->state(['status' => 'pending']);
    }

    public function confirmed(): static
    {
        return $this->state(['status' => 'confirmed']);
    }

    public function completed(): static
    {
        return $this->state([
            'status'    => 'completed',
            'starts_at' => fake()->dateTimeBetween('-2 months', '-1 day'),
        ]);
    }

    public function cancelled(): static
    {
        return $this->state([
            'status'              => 'cancelled',
            'cancellation_reason' => fake()->sentence(),
        ]);
    }
}
