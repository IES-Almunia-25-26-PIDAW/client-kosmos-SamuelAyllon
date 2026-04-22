<?php

namespace App\Http\Controllers\Portal\ConsentForm;

use App\Http\Controllers\Controller;
use App\Models\PatientProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $profile = PatientProfile::where('user_id', $request->user()->id)->firstOrFail();

        $consentForms = $profile->consentForms()
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('patient/consent-forms/index', [
            'consentForms' => $consentForms,
        ]);
    }
}
