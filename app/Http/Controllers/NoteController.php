<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNoteRequest;
use App\Models\Note;
use App\Models\Patient;
use Illuminate\Http\RedirectResponse;

class NoteController extends Controller
{
    public function store(StoreNoteRequest $request, Patient $patient): RedirectResponse
    {
        $this->authorize('view', $patient);

        $patient->notes()->create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Nota guardada.');
    }

    public function update(StoreNoteRequest $request, Patient $patient, Note $note): RedirectResponse
    {
        $this->authorize('view', $patient);

        $note->update($request->validated());

        return back()->with('success', 'Nota actualizada.');
    }

    public function destroy(Patient $patient, Note $note): RedirectResponse
    {
        $this->authorize('view', $patient);

        $note->delete();

        return back()->with('success', 'Nota eliminada.');
    }
}
