<?php

namespace App\Http\Controllers\Patient;

use App\Actions\Patient\CreateOrUpdateProfessionalPatient;
use App\DTOs\PatientUpsertData;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePatientRequest;
use App\Models\PatientProfile;
use Illuminate\Http\RedirectResponse;

class StoreAction extends Controller
{
    public function __invoke(StorePatientRequest $request, CreateOrUpdateProfessionalPatient $upsert): RedirectResponse
    {
        $this->authorize('create', PatientProfile::class);

        $validated = $request->validated();
        $professional = $request->user();

        $profile = $upsert(
            $professional,
            $professional->currentWorkspace(),
            new PatientUpsertData(
                name: $validated['project_name'],
                email: $validated['email'] ?? null,
                phone: $validated['phone'] ?? null,
                consultationReason: $validated['service_scope'] ?? null,
                therapeuticApproach: $validated['brand_tone'] ?? null,
            ),
        );

        return redirect()->route('professional.patients.show', $profile)
            ->with('success', 'Paciente añadido correctamente.');
    }
}
