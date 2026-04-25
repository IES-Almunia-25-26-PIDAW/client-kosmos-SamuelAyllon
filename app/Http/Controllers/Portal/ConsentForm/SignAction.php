<?php

namespace App\Http\Controllers\Portal\ConsentForm;

use App\Http\Controllers\Controller;
use App\Models\ConsentForm;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SignAction extends Controller
{
    public function __invoke(Request $request, ConsentForm $consentForm): RedirectResponse
    {
        $profile = $request->user()->patientProfile()->firstOrFail();

        abort_if($consentForm->patient_id !== $profile->id, 403);

        $request->validate([
            'signature_data' => ['required', 'string'],
        ]);

        $consentForm->update([
            'status'         => 'signed',
            'signed_at'      => now(),
            'signature_data' => $request->signature_data,
            'signed_ip'      => $request->ip(),
        ]);

        return back()->with('success', 'Formulario firmado.');
    }
}
