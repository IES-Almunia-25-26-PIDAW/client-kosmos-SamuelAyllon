<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, mixed>  $input
     */
    public function create(array $input): User
    {
        $type = $input['type'] ?? 'professional';

        $rules = [
            'type' => ['required', 'in:professional,patient'],
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'phone' => ['nullable', 'string', 'max:20'],
        ];

        if ($type === 'professional') {
            $rules += [
                'license_number' => ['nullable', 'string', 'max:50'],
                'collegiate_number' => ['nullable', 'string', 'max:50'],
                'specialties' => ['nullable', 'array'],
                'specialties.*' => ['string', 'in:clinical,cognitive_behavioral,child,couples,trauma,systemic'],
                'bio' => ['nullable', 'string', 'max:1000'],
            ];
        } else {
            $rules += [
                'date_of_birth' => ['nullable', 'date', 'before:today'],
            ];
        }

        Validator::make($input, $rules)->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
            'phone' => $input['phone'] ?? null,
            'date_of_birth' => $input['date_of_birth'] ?? null,
        ]);

        if ($type === 'professional') {
            $user->assignRole('professional');
            $user->professionalProfile()->create([
                'license_number' => $input['license_number'] ?? null,
                'collegiate_number' => $input['collegiate_number'] ?? null,
                'specialties' => $input['specialties'] ?? null,
                'bio' => $input['bio'] ?? null,
            ]);
        } else {
            $user->assignRole('patient');
            $user->patientProfile()->create([]);
        }

        return $user;
    }
}
