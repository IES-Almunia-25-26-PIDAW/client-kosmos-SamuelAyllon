<?php

namespace App\Http\Controllers\Note;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNoteRequest;
use App\Models\Note;
use App\Models\PatientProfile;
use Illuminate\Http\RedirectResponse;

class UpdateAction extends Controller
{
    public function __invoke(StoreNoteRequest $request, PatientProfile $patient, Note $note): RedirectResponse
    {
        $this->authorize('view', $patient);

        $note->update($request->validated());

        return back()->with('success', 'Nota actualizada.');
    }
}
