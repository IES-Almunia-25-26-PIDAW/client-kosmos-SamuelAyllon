<?php

namespace App\Http\Controllers\Settings\Profile;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EditAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $patientProfile = $user?->patientProfile;

        $consentForms = $patientProfile
            ? $patientProfile->consentForms()
                ->whereIn('status', ['signed', 'revoked', 'expired'])
                ->orderByDesc('signed_at')
                ->get([
                    'id', 'consent_type', 'template_version', 'status',
                    'signed_at', 'expires_at', 'created_at', 'updated_at',
                ])
            : collect();

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'consentForms' => $consentForms,
        ]);
    }
}
