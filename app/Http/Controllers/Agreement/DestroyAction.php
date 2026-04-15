<?php

namespace App\Http\Controllers\Agreement;

use App\Http\Controllers\Controller;
use App\Models\Agreement;
use App\Models\PatientProfile;
use Illuminate\Http\RedirectResponse;

class DestroyAction extends Controller
{
    public function __invoke(PatientProfile $patient, Agreement $agreement): RedirectResponse
    {
        $this->authorize('view', $patient);

        $agreement->delete();

        return back()->with('success', 'Acuerdo eliminado.');
    }
}
