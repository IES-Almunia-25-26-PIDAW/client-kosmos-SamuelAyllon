<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\PatientProfile;
use Inertia\Inertia;
use Inertia\Response;

class EditAction extends Controller
{
    public function __invoke(PatientProfile $patient): Response
    {
        $this->authorize('update', $patient);

        $patient->load('user:id,name,email,phone,avatar_path');

        return Inertia::render('professional/patients/edit', [
            'patient' => array_merge($patient->toArray(), [
                'name' => $patient->user->name,
                'email' => $patient->user->email,
                'phone' => $patient->user->phone,
                'avatar_path' => $patient->user->avatar_path,
            ]),
        ]);
    }
}
