<?php

namespace App\Http\Controllers\Agreement;

use App\Http\Controllers\Controller;
use App\Models\Agreement;
use App\Models\Patient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UpdateAction extends Controller
{
    public function __invoke(Request $request, Patient $patient, Agreement $agreement): RedirectResponse
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
}
