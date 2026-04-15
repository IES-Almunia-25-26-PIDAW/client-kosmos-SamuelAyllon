<?php

namespace App\Http\Controllers\Agreement;

use App\Http\Controllers\Controller;
use App\Models\PatientProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class StoreAction extends Controller
{
    public function __invoke(Request $request, PatientProfile $patient): RedirectResponse
    {
        $this->authorize('view', $patient);

        $request->validate(['content' => ['required', 'string', 'min:1']]);

        $patient->agreements()->create([
            'content' => $request->content,
            'appointment_id' => $request->appointment_id,
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Acuerdo guardado.');
    }
}
