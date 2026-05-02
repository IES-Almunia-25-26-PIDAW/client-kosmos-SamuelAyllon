<?php

use App\Actions\Patient\CreateOrUpdateProfessionalPatient;
use App\Actions\Patient\DelegatePatientToProfessional;
use App\DTOs\PatientUpsertData;
use App\Models\CaseAssignment;
use App\Models\PatientDelegation;
use App\Models\PatientProfile;
use App\Models\ProfessionalProfile;
use App\Models\User;
use App\Models\Workspace;

function makeProfessionalWithWorkspaceForUpsert(): array
{
    ensureRolesExist();

    $professional = User::factory()->create(['tutorial_completed_at' => now()]);
    $professional->assignRole('professional');
    ProfessionalProfile::factory()->verified()->create(['user_id' => $professional->id]);

    $workspace = Workspace::factory()->create(['creator_id' => $professional->id]);
    $workspace->members()->attach($professional->id, [
        'role' => 'member',
        'is_active' => true,
        'joined_at' => now(),
    ]);

    session(['current_workspace_id' => $workspace->id]);

    return [$professional, $workspace];
}

it('creates a patient via the manual store endpoint using the upsert action', function () {
    [$professional, $workspace] = makeProfessionalWithWorkspaceForUpsert();

    $this->actingAs($professional)
        ->post(route('professional.patients.store'), [
            'project_name' => 'Marta García',
            'email' => 'marta@example.com',
            'phone' => '+34600000000',
            'service_scope' => 'Ansiedad generalizada',
            'brand_tone' => 'TCC',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('patient_profiles', [
        'workspace_id' => $workspace->id,
        'professional_id' => $professional->id,
        'consultation_reason' => 'Ansiedad generalizada',
        'therapeutic_approach' => 'TCC',
    ]);

    expect(User::where('email', 'marta@example.com')->count())->toBe(1);
    expect(CaseAssignment::where('professional_id', $professional->id)->count())->toBe(1);
});

it('upserts patient profile with consultation reason on appointment booking', function () {
    [$professional, $workspace] = makeProfessionalWithWorkspaceForUpsert();
    $patient = User::factory()->create();
    $patient->assignRole('patient');

    $action = app(CreateOrUpdateProfessionalPatient::class);

    $action(
        $professional,
        $workspace,
        new PatientUpsertData(
            name: $patient->name,
            email: $patient->email,
            phone: $patient->phone,
            consultationReason: 'Primera sesión exploratoria',
        ),
        $patient,
    );

    $this->assertDatabaseHas('patient_profiles', [
        'user_id' => $patient->id,
        'workspace_id' => $workspace->id,
        'professional_id' => $professional->id,
        'consultation_reason' => 'Primera sesión exploratoria',
    ]);
});

it('does not duplicate when called repeatedly for the same patient and workspace', function () {
    [$professional, $workspace] = makeProfessionalWithWorkspaceForUpsert();
    $patient = User::factory()->create();
    $patient->assignRole('patient');

    $action = app(CreateOrUpdateProfessionalPatient::class);

    $data = new PatientUpsertData(
        name: $patient->name,
        email: $patient->email,
    );

    $action($professional, $workspace, $data, $patient);
    $action($professional, $workspace, $data, $patient);
    $action($professional, $workspace, $data, $patient);

    expect(PatientProfile::where('user_id', $patient->id)->count())->toBe(1);
    expect(CaseAssignment::where('patient_id', $patient->id)->count())->toBe(1);
});

it('records delegation history without overwriting previous assignment', function () {
    [$fromPro, $workspace] = makeProfessionalWithWorkspaceForUpsert();
    $toPro = User::factory()->create();
    $toPro->assignRole('professional');

    $patient = User::factory()->create();
    $patient->assignRole('patient');

    $upsert = app(CreateOrUpdateProfessionalPatient::class);
    $profile = $upsert(
        $fromPro,
        $workspace,
        new PatientUpsertData(name: $patient->name, email: $patient->email),
        $patient,
    );

    $delegate = app(DelegatePatientToProfessional::class);
    $delegation = $delegate($profile, $fromPro, $toPro, 'Cambio de horarios');

    expect(PatientDelegation::count())->toBe(1)
        ->and($delegation->from_professional_id)->toBe($fromPro->id)
        ->and($delegation->to_professional_id)->toBe($toPro->id)
        ->and($delegation->reason)->toBe('Cambio de horarios')
        ->and($delegation->delegated_at)->not->toBeNull();

    expect($profile->fresh()->professional_id)->toBe($toPro->id);

    expect(CaseAssignment::where('patient_id', $patient->id)
        ->where('professional_id', $fromPro->id)
        ->where('status', 'ended')
        ->count())->toBe(1);

    expect(CaseAssignment::where('patient_id', $patient->id)
        ->where('professional_id', $toPro->id)
        ->where('status', 'active')
        ->count())->toBe(1);
});

it('rejects delegating a patient to the same professional', function () {
    [$pro, $workspace] = makeProfessionalWithWorkspaceForUpsert();
    $patient = User::factory()->create();
    $patient->assignRole('patient');

    $upsert = app(CreateOrUpdateProfessionalPatient::class);
    $profile = $upsert(
        $pro,
        $workspace,
        new PatientUpsertData(name: $patient->name, email: $patient->email),
        $patient,
    );

    $delegate = app(DelegatePatientToProfessional::class);

    expect(fn () => $delegate($profile, $pro, $pro))
        ->toThrow(Illuminate\Validation\ValidationException::class);
});
