<?php

namespace App\Http\Controllers\ConsentForm;

use App\Http\Controllers\Controller;
use App\Http\Requests\SignConsentFormRequest;
use App\Models\ConsentForm;
use App\Models\Patient;
use Illuminate\Http\RedirectResponse;

class UpdateAction extends Controller
{
    public function __invoke(SignConsentFormRequest $request, Patient $patient, ConsentForm $consentForm): RedirectResponse
    {
        $this->authorize('view', $patient);

        $consentForm->update([
            'status'         => 'signed',
            'signed_at'      => now(),
            'signature_data' => $request->signature_data,
            'signed_ip'      => $request->ip(),
        ]);

        return back()->with('success', 'Consentimiento firmado correctamente.');
    }
}
