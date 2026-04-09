<?php

namespace App\Http\Controllers\ConsentForm;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class StoreAction extends Controller
{
    public function __invoke(Request $request, Patient $patient): RedirectResponse
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
}
