<?php

namespace Database\Factories;

use App\Models\Box;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ResourceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'box_id' => Box::factory(),
            'name' => fake()->words(3, true),
            'description' => fake()->optional()->sentence(),
            'url' => fake()->optional()->url(),
            'type' => fake()->randomElement(['link', 'document', 'video', 'image', 'other']),
            'user_modified_at' => null,
        ];
    }
}
