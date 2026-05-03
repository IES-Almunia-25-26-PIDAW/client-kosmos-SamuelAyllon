<?php

use App\Models\Appointment;
use App\Models\OfferedConsultation;
use App\Models\PatientProfile;
use App\Models\ProfessionalProfile;
use App\Models\User;
use App\Models\Workspace;

function bookingProfessionalWithWorkspace(): array
{
    ensureRolesExist();

    $professional = User::factory()->create(['tutorial_completed_at' => now()]);
    $professional->assignRole('professional');

    $profile = ProfessionalProfile::factory()->verified()->create(['user_id' => $professional->id]);

    $workspace = Workspace::factory()->create(['creator_id' => $professional->id]);
    $workspace->members()->attach($professional->id, [
        'role' => 'member',
        'is_active' => true,
        'joined_at' => now(),
    ]);

    $service = OfferedConsultation::factory()->for($profile, 'professionalProfile')->create([
        'name' => 'Sesión inicial',
        'duration_minutes' => 50,
        'price' => 60,
        'is_active' => true,
    ]);

    return [$professional, $workspace, $service, $profile];
}

function bookingPatient(): User
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

it('creates an appointment with valid data and redirects to success', function () {
    [$professional, $workspace, $service] = bookingProfessionalWithWorkspace();
    $patient = bookingPatient();

    $startsAt = now()->addDays(3)->setTime(11, 0);

    $this->actingAs($patient)
        ->post(route('patient.appointments.store'), [
            'professional_id' => $professional->id,
            'service_id' => $service->id,
            'starts_at' => $startsAt->toIso8601String(),
            'modality' => 'video_call',
            'notes' => 'Primera sesión',
        ])
        ->assertRedirect(route('patient.appointments.book-success'));

    $this->assertDatabaseHas('appointments', [
        'workspace_id' => $workspace->id,
        'patient_id' => $patient->id,
        'professional_id' => $professional->id,
        'service_id' => $service->id,
        'modality' => 'video_call',
        'status' => 'pending',
        'notes' => 'Primera sesión',
    ]);

    $appointment = Appointment::first();
    expect($appointment->starts_at->diffInMinutes($appointment->ends_at))
        ->toBe((float) $service->duration_minutes);
});

it('rejects booking with missing required fields', function () {
    $patient = bookingPatient();

    $this->actingAs($patient)
        ->post(route('patient.appointments.store'), [])
        ->assertSessionHasErrors(['professional_id', 'service_id', 'starts_at', 'modality']);

    expect(Appointment::count())->toBe(0);
});

it('rejects booking with a past starts_at', function () {
    [$professional, , $service] = bookingProfessionalWithWorkspace();
    $patient = bookingPatient();

    $this->actingAs($patient)
        ->post(route('patient.appointments.store'), [
            'professional_id' => $professional->id,
            'service_id' => $service->id,
            'starts_at' => now()->subHour()->toIso8601String(),
            'modality' => 'video_call',
        ])
        ->assertSessionHasErrors(['starts_at']);

    expect(Appointment::count())->toBe(0);
});

it('rejects booking with an invalid modality', function () {
    [$professional, , $service] = bookingProfessionalWithWorkspace();
    $patient = bookingPatient();

    $this->actingAs($patient)
        ->post(route('patient.appointments.store'), [
            'professional_id' => $professional->id,
            'service_id' => $service->id,
            'starts_at' => now()->addDays(2)->toIso8601String(),
            'modality' => 'phone_call',
        ])
        ->assertSessionHasErrors(['modality']);
});

it('rejects booking when the service belongs to another professional', function () {
    [$professionalA] = bookingProfessionalWithWorkspace();
    [, , $serviceB] = bookingProfessionalWithWorkspace();
    $patient = bookingPatient();

    $this->actingAs($patient)
        ->post(route('patient.appointments.store'), [
            'professional_id' => $professionalA->id,
            'service_id' => $serviceB->id,
            'starts_at' => now()->addDays(2)->toIso8601String(),
            'modality' => 'video_call',
        ])
        ->assertSessionHasErrors(['service_id']);

    expect(Appointment::count())->toBe(0);
});

it('forbids unauthenticated users from booking', function () {
    [$professional, , $service] = bookingProfessionalWithWorkspace();

    $this->post(route('patient.appointments.store'), [
        'professional_id' => $professional->id,
        'service_id' => $service->id,
        'starts_at' => now()->addDays(2)->toIso8601String(),
        'modality' => 'video_call',
    ])->assertRedirect(route('login'));
});

// ─── Double-booking protection ─────────────────────────────────────────────

it('prevents a second patient from booking an already-occupied slot', function () {
    [$professional, , $service] = bookingProfessionalWithWorkspace();
    $patientA = bookingPatient();
    $patientB = bookingPatient();
    $startsAt = now()->addDays(3)->setTime(11, 0)->toIso8601String();

    $this->actingAs($patientA)
        ->post(route('patient.appointments.store'), [
            'professional_id' => $professional->id,
            'service_id' => $service->id,
            'starts_at' => $startsAt,
            'modality' => 'video_call',
        ])
        ->assertRedirect(route('patient.appointments.book-success'));

    $this->actingAs($patientB)
        ->post(route('patient.appointments.store'), [
            'professional_id' => $professional->id,
            'service_id' => $service->id,
            'starts_at' => $startsAt,
            'modality' => 'video_call',
        ])
        ->assertSessionHasErrors(['starts_at']);

    expect(Appointment::count())->toBe(1);
});

it('prevents the same patient from double-booking the same slot', function () {
    [$professional, , $service] = bookingProfessionalWithWorkspace();
    $patient = bookingPatient();
    $startsAt = now()->addDays(3)->setTime(11, 0)->toIso8601String();

    $this->actingAs($patient)
        ->post(route('patient.appointments.store'), [
            'professional_id' => $professional->id,
            'service_id' => $service->id,
            'starts_at' => $startsAt,
            'modality' => 'video_call',
        ])
        ->assertRedirect(route('patient.appointments.book-success'));

    $this->actingAs($patient)
        ->post(route('patient.appointments.store'), [
            'professional_id' => $professional->id,
            'service_id' => $service->id,
            'starts_at' => $startsAt,
            'modality' => 'video_call',
        ])
        ->assertSessionHasErrors(['starts_at']);

    expect(Appointment::count())->toBe(1);
});

it('prevents booking when slots overlap but share different starts_at', function () {
    // service duration = 50 min; 11:00–11:50 and 11:30–12:20 overlap
    [$professional, , $service] = bookingProfessionalWithWorkspace();
    $patientA = bookingPatient();
    $patientB = bookingPatient();

    $this->actingAs($patientA)
        ->post(route('patient.appointments.store'), [
            'professional_id' => $professional->id,
            'service_id' => $service->id,
            'starts_at' => now()->addDays(3)->setTime(11, 0)->toIso8601String(),
            'modality' => 'video_call',
        ])
        ->assertRedirect(route('patient.appointments.book-success'));

    $this->actingAs($patientB)
        ->post(route('patient.appointments.store'), [
            'professional_id' => $professional->id,
            'service_id' => $service->id,
            'starts_at' => now()->addDays(3)->setTime(11, 30)->toIso8601String(),
            'modality' => 'video_call',
        ])
        ->assertSessionHasErrors(['starts_at']);

    expect(Appointment::count())->toBe(1);
});

it('allows booking a slot that was cancelled', function () {
    [$professional, , $service] = bookingProfessionalWithWorkspace();
    $patientA = bookingPatient();
    $patientB = bookingPatient();
    $startsAt = now()->addDays(3)->setTime(11, 0)->toIso8601String();

    $this->actingAs($patientA)
        ->post(route('patient.appointments.store'), [
            'professional_id' => $professional->id,
            'service_id' => $service->id,
            'starts_at' => $startsAt,
            'modality' => 'video_call',
        ])
        ->assertRedirect(route('patient.appointments.book-success'));

    Appointment::first()->update(['status' => 'cancelled']);

    $this->actingAs($patientB)
        ->post(route('patient.appointments.store'), [
            'professional_id' => $professional->id,
            'service_id' => $service->id,
            'starts_at' => $startsAt,
            'modality' => 'video_call',
        ])
        ->assertRedirect(route('patient.appointments.book-success'));

    expect(Appointment::where('status', '!=', 'cancelled')->count())->toBe(1);
});
