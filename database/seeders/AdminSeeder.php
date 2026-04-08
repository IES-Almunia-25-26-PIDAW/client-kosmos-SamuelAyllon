<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@clientkosmos.com'],
            [
                'name'              => 'Admin ClientKosmos',
                'password'          => Hash::make(env('ADMIN_DEFAULT_PASSWORD', 'changeme_immediately')),
                'role'              => 'admin',
                'email_verified_at' => now(),
            ]
        );
    }
}
