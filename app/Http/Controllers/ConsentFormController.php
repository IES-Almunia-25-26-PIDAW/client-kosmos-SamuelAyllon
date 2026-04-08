<?php

namespace App\Http\Controllers;

use App\Http\Requests\SignConsentFormRequest;
use App\Models\ConsentForm;
use App\Models\Patient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ConsentFormController extends Controller
{
    public function store(Request $request, Patient $patient): RedirectResponse
    {
        $this->authorize('view', $patient);

        $user = $request->user();

        $patient->consentForms()->create([
            'user_id'          => $user->id,
            'template_version' => '1.0',
            'content_snapshot' => $user->rgpd_template ?? '',
            'status'           => 'pending',
        ]);

        return back()->with('success', 'Formulario de consentimiento creado.');
    }

    public function update(SignConsentFormRequest $request, Patient $patient, ConsentForm $consentForm): RedirectResponse
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
