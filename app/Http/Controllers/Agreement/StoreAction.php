<?php

namespace App\Http\Controllers\Agreement;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class StoreAction extends Controller
{
    public function __invoke(Request $request, Patient $patient): RedirectResponse
    {
        $this->authorize('view', $patient);

        $request->validate(['content' => ['required', 'string', 'min:1']]);

        $patient->agreements()->create([
            'content'               => $request->content,
            'consulting_session_id' => $request->consulting_session_id,
            'user_id'               => $request->user()->id,
        ]);

        return back()->with('success', 'Acuerdo guardado.');
    }
}
