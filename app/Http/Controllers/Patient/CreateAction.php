<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\PatientProfile;
use Inertia\Inertia;
use Inertia\Response;

class CreateAction extends Controller
{
    public function __invoke(): Response
    {
        $this->authorize('create', PatientProfile::class);

        return Inertia::render('professional/patients/create');
    }
}
