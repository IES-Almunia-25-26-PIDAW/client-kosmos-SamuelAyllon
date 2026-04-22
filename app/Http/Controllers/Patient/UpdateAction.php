<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePatientRequest;
use App\Models\PatientProfile;
use Illuminate\Http\RedirectResponse;

class UpdateAction extends Controller
{
    public function __invoke(StorePatientRequest $request, PatientProfile $patient): RedirectResponse
    {
        $this->authorize('update', $patient);

        $validated = $request->validated();

        $patient->user->update(array_filter([
            'name' => $validated['project_name'] ?? null,
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
        ], fn ($v) => $v !== null && $v !== ''));

        $clinicalLines = collect([
            isset($validated['brand_tone']) ? 'Tono de marca: '.$validated['brand_tone'] : null,
            isset($validated['service_scope']) ? 'Alcance del servicio: '.$validated['service_scope'] : null,
            isset($validated['next_deadline']) ? 'Próxima fecha límite: '.$validated['next_deadline'] : null,
        ])->filter()->implode("\n");

        if ($clinicalLines !== '') {
            $patient->update(['clinical_notes' => $clinicalLines]);
        }

        return redirect()->route('professional.patients.show', $patient)
            ->with('success', 'Paciente actualizado correctamente.');
    }
}
