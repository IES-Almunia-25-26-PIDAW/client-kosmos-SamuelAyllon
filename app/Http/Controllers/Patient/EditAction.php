<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Inertia\Inertia;
use Inertia\Response;

class EditAction extends Controller
{
    public function __invoke(Patient $patient): Response
    {
        $this->authorize('update', $patient);

        return Inertia::render('patients/edit', [
            'patient' => $patient,
        ]);
    }
}
