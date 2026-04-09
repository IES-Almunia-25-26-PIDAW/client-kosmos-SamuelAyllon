<?php

namespace App\Http\Controllers\Document;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Patient;
use Illuminate\Http\RedirectResponse;

class DestroyAction extends Controller
{
    public function __invoke(Patient $patient, Document $document): RedirectResponse
    {
        $this->authorize('view', $patient);

        $document->delete();

        return back()->with('success', 'Documento eliminado.');
    }
}
