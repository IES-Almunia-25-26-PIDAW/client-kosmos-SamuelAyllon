<?php

namespace App\Http\Controllers\Note;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNoteRequest;
use App\Models\PatientProfile;
use Illuminate\Http\RedirectResponse;

class StoreAction extends Controller
{
    public function __invoke(StoreNoteRequest $request, PatientProfile $patient): RedirectResponse
    {
        $this->authorize('view', $patient);

        $patient->notes()->create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Nota guardada.');
    }
}
