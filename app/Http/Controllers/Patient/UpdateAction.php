<?php

namespace App\Http\Controllers\Patient;

use App\Actions\Patient\CreateOrUpdateProfessionalPatient;
use App\DTOs\PatientUpsertData;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePatientRequest;
use App\Models\PatientProfile;
use Illuminate\Http\RedirectResponse;

class UpdateAction extends Controller
{
    public function __invoke(
        StorePatientRequest $request,
        PatientProfile $patient,
        CreateOrUpdateProfessionalPatient $upsert,
    ): RedirectResponse {
        $this->authorize('update', $patient);

        $validated = $request->validated();
        $professional = $request->user();
        $workspace = $patient->workspace ?? $professional->currentWorkspace();

        $upsert(
            $professional,
            $workspace,
            new PatientUpsertData(
                name: $validated['project_name'],
                email: $validated['email'] ?? null,
                phone: $validated['phone'] ?? null,
                consultationReason: $validated['service_scope'] ?? null,
                therapeuticApproach: $validated['brand_tone'] ?? null,
            ),
            patientUser: $patient->user,
        );

        return redirect()->route('professional.patients.show', $patient)
            ->with('success', 'Paciente actualizado correctamente.');
    }
}
