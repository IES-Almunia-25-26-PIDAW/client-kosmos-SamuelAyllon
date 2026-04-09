<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePatientRequest;
use App\Models\Patient;
use Illuminate\Http\RedirectResponse;

class UpdateAction extends Controller
{
    public function __invoke(StorePatientRequest $request, Patient $patient): RedirectResponse
    {
        $this->authorize('update', $patient);

        $patient->update($request->validated());

        return redirect()->route('patients.show', $patient)
            ->with('success', 'Paciente actualizado correctamente.');
    }
}
