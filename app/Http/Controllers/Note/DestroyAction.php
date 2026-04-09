<?php

namespace App\Http\Controllers\Note;

use App\Http\Controllers\Controller;
use App\Models\Note;
use App\Models\Patient;
use Illuminate\Http\RedirectResponse;

class DestroyAction extends Controller
{
    public function __invoke(Patient $patient, Note $note): RedirectResponse
    {
        $this->authorize('view', $patient);

        $note->delete();

        return back()->with('success', 'Nota eliminada.');
    }
}
