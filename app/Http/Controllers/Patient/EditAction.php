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

        return Inertia::render('professional/patients/edit', [
            'patient' => $patient,
        ]);
    }
}
