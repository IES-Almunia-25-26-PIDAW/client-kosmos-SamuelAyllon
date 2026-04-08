<?php

namespace App\Http\Controllers;

use App\Models\Agreement;
use App\Models\Patient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AgreementController extends Controller
{
    public function store(Request $request, Patient $patient): RedirectResponse
    {
        $this->authorize('view', $patient);

        $request->validate(['content' => ['required', 'string', 'min:1']]);

        $patient->agreements()->create([
            'content'                => $request->content,
            'consulting_session_id'  => $request->consulting_session_id,
            'user_id'                => $request->user()->id,
        ]);

        return back()->with('success', 'Acuerdo guardado.');
    }

    public function update(Request $request, Patient $patient, Agreement $agreement): RedirectResponse
    {
        $this->authorize('view', $patient);

        $request->validate([
            'content'      => ['sometimes', 'string', 'min:1'],
            'is_completed' => ['sometimes', 'boolean'],
        ]);

        $data = $request->only(['content', 'is_completed']);
        if (isset($data['is_completed']) && $data['is_completed'] && ! $agreement->is_completed) {
            $data['completed_at'] = now();
        }

        $agreement->update($data);

        return back()->with('success', 'Acuerdo actualizado.');
    }

    public function destroy(Patient $patient, Agreement $agreement): RedirectResponse
    {
        $this->authorize('view', $patient);

        $agreement->delete();

        return back()->with('success', 'Acuerdo eliminado.');
    }
}
