<?php

namespace Database\Factories;

use App\Models\OfferedConsultation;
use App\Models\ProfessionalProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OfferedConsultation>
 */
class OfferedConsultationFactory extends Factory
{
    protected $model = OfferedConsultation::class;

    public function definition(): array
    {
        return [
            'professional_profile_id' => ProfessionalProfile::factory(),
            'name' => fake()->randomElement([
                'Sesión de psicología',
                'Sesión EMDR',
                'Primera consulta',
                'Terapia de pareja',
                'Evaluación inicial',
            ]),
            'description' => fake()->sentence(8),
            'duration_minutes' => fake()->randomElement([30, 45, 50, 60, 90]),
            'price' => fake()->numberBetween(40, 120),
            'color' => fake()->randomElement(['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']),
            'is_active' => true,
            'modality' => fake()->randomElement(['in_person', 'video_call', 'both']),
        ];
    }

    public function inactive(): static
    {
        return $this->state(['is_active' => false]);
    }

    public function online(): static
    {
        return $this->state(['modality' => 'video_call']);
    }

    public function inPerson(): static
    {
        return $this->state(['modality' => 'in_person']);
    }
}
