<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\PatientProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $this->authorize('viewAny', PatientProfile::class);

        $patients = PatientProfile::query()
            ->where('professional_id', $request->user()->id)
            ->where('is_active', true)
            ->orderBy('id')
            ->get();

        return Inertia::render('professional/patients/index', [
            'patients' => $patients,
        ]);
    }
}
