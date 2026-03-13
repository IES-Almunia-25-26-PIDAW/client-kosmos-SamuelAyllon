<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ResourceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'project_id' => Project::factory(),
            'name' => fake()->words(3, true),
            'description' => fake()->optional()->sentence(),
            'url' => fake()->optional()->url(),
            'type' => fake()->randomElement(['link', 'document', 'video', 'image', 'other']),
            'user_modified_at' => null,
        ];
    }
}
