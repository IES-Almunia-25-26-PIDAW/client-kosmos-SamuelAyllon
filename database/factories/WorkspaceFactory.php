<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Clinic>
 */
class ClinicFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->company();

        return [
            'owner_id'    => User::factory(),
            'name'        => $name,
            'slug'        => Str::slug($name).'-'.fake()->unique()->numerify('###'),
            'tax_name'    => fake()->optional(0.8)->company(),
            'tax_id'      => fake()->optional(0.8)->numerify('########Z'),
            'tax_address' => fake()->optional(0.7)->address(),
            'phone'       => fake()->optional(0.7)->numerify('6## ### ###'),
            'email'       => fake()->optional(0.7)->companyEmail(),
            'logo_path'   => null,
            'settings'    => null,
        ];
    }
}
