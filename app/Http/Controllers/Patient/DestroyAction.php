<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\RedirectResponse;

class DestroyAction extends Controller
{
    public function __invoke(Patient $patient): RedirectResponse
    {
        $this->authorize('delete', $patient);

        $patient->delete();

        return redirect()->route('patients.index')
            ->with('success', 'Paciente eliminado correctamente.');
    }
}
