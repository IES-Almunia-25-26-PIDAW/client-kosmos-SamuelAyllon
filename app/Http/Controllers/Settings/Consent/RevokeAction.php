<?php

namespace App\Http\Controllers\Settings\Consent;

use App\Http\Controllers\Controller;
use App\Models\ConsentForm;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class RevokeAction extends Controller
{
    public function __invoke(Request $request, ConsentForm $consentForm): RedirectResponse
    {
        $patientProfile = $request->user()?->patientProfile;

        abort_unless(
            $patientProfile !== null && $consentForm->patient_id === $patientProfile->id,
            403,
            'Solo puedes revocar consentimientos que hayas firmado.',
        );

        abort_unless(
            $consentForm->status === 'signed',
            422,
            'Solo se pueden revocar consentimientos firmados.',
        );

        $consentForm->update([
            'status' => 'revoked',
        ]);

        return back()->with('success', 'Consentimiento revocado.');
    }
}
