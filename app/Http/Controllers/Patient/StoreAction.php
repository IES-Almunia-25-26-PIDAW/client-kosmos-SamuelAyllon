<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePatientRequest;
use App\Models\CaseAssignment;
use App\Models\PatientProfile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class StoreAction extends Controller
{
    public function __invoke(StorePatientRequest $request): RedirectResponse
    {
        $this->authorize('create', PatientProfile::class);

        $validated = $request->validated();

        $email = $validated['email'] ?? null;
        if ($email === null || $email === '') {
            $email = Str::lower(Str::slug($validated['project_name'])).'.'.Str::random(8).'@patients.local';
        }

        $patientUser = User::create([
            'name' => $validated['project_name'],
            'email' => $email,
            'password' => Hash::make(Str::random(32)),
            'phone' => $validated['phone'] ?? null,
            'email_verified_at' => null,
        ]);
        $patientUser->assignRole('patient');

        $clinicalLines = collect([
            isset($validated['brand_tone']) ? 'Tono de marca: '.$validated['brand_tone'] : null,
            isset($validated['service_scope']) ? 'Alcance del servicio: '.$validated['service_scope'] : null,
            isset($validated['next_deadline']) ? 'Próxima fecha límite: '.$validated['next_deadline'] : null,
        ])->filter()->implode("\n");

        $profile = PatientProfile::create([
            'user_id' => $patientUser->id,
            'workspace_id' => $request->user()->currentWorkspaceId(),
            'professional_id' => $request->user()->id,
            'is_active' => true,
            'status' => 'active',
            'clinical_notes' => $clinicalLines !== '' ? $clinicalLines : null,
        ]);

        CaseAssignment::create([
            'patient_id'      => $patientUser->id,
            'professional_id' => $request->user()->id,
            'workspace_id'    => $request->user()->currentWorkspaceId(),
            'is_primary'      => true,
            'role'            => 'primary',
            'status'          => 'active',
            'started_at'      => now(),
        ]);

        return redirect()->route('patients.show', $profile)
            ->with('success', 'Paciente añadido correctamente.');
    }
}
