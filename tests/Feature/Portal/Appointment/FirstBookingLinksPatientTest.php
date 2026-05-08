<?php

use App\Models\CaseAssignment;
use App\Models\OfferedConsultation;
use App\Models\PatientProfile;
use App\Models\ProfessionalProfile;
use App\Models\User;
use App\Models\Workspace;

function makeVerifiedProfessionalWithWorkspace(): array
{
    ensureRolesExist();

    $professional = User::factory()->create(['tutorial_completed_at' => now()]);
    $professional->assignRole('professional');

    $profile = ProfessionalProfile::factory()->verified()->create([
        'user_id' => $professional->id,
    ]);

    $workspace = Workspace::factory()->create(['creator_id' => $professional->id]);
    $workspace->members()->attach($professional->id, [
        'role' => 'member',
        'is_active' => true,
        'joined_at' => now(),
    ]);

    OfferedConsultation::factory()->for($profile, 'professionalProfile')->create([
        'name' => 'Sesión inicial',
        'duration_minutes' => 50,
        'price' => 60,
        'is_active' => true,
    ]);

    return [$professional, $profile, $workspace];
}

function makeFreshlyRegisteredPatient(): User
{
    ensureRolesExist();

    $user = User::factory()->create([
        'email_verified_at' => now(),
        'tutorial_completed_at' => now(),
    ]);
    $user->assignRole('patient');

    PatientProfile::create([
        'user_id' => $user->id,
        'workspace_id' => null,
        'professional_id' => null,
        'is_active' => true,
        'status' => 'active',
    ]);

    return $user;
}

it('does NOT link the patient to the workspace just by opening the booking page', function () {
    [, $profile, $workspace] = makeVerifiedProfessionalWithWorkspace();
    $patient = makeFreshlyRegisteredPatient();

    $startsAt = now()->addDays(2)->setTime(10, 0);

    $this->actingAs($patient)
        ->get(route('patient.appointments.book', [
            'professional_id' => $profile->id,
            'starts_at' => $startsAt->toIso8601String(),
        ]))
        ->assertOk();

    expect(PatientProfile::where('user_id', $patient->id)
        ->where('workspace_id', $workspace->id)
        ->count())->toBe(0);

    expect(CaseAssignment::where('patient_id', $patient->id)->count())->toBe(0);
});

it('does NOT link the patient when creating the appointment in pending status', function () {
    [$professional, $profile, $workspace] = makeVerifiedProfessionalWithWorkspace();
    $service = OfferedConsultation::where('professional_profile_id', $profile->id)->first();
    $patient = makeFreshlyRegisteredPatient();

    $startsAt = now()->addDays(2)->setTime(10, 0);

    $this->actingAs($patient)
        ->post(route('patient.appointments.store'), [
            'professional_id' => $professional->id,
            'service_id' => $service->id,
            'starts_at' => $startsAt->toIso8601String(),
            'modality' => 'video_call',
            'notes' => null,
        ])
        ->assertRedirect(route('patient.appointments.book-success'));

    $this->assertDatabaseHas('appointments', [
        'workspace_id' => $workspace->id,
        'patient_id' => $patient->id,
        'professional_id' => $professional->id,
        'service_id' => $service->id,
        'status' => 'pending',
    ]);

    expect(PatientProfile::where('user_id', $patient->id)
        ->where('workspace_id', $workspace->id)
        ->count())->toBe(0);

    expect(CaseAssignment::where('patient_id', $patient->id)->count())->toBe(0);
});
