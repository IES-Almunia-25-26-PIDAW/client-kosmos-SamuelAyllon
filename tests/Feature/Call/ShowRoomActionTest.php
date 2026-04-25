<?php

use App\Models\Appointment;
use Illuminate\Support\Str;

// ─── Helpers locales ──────────────────────────────────────────────────────────

function makeActiveAppointment(array $overrides = []): Appointment
{
    $professional = createProfessional();
    $patient = createPatient();

    return Appointment::factory()->create(array_merge([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
        'status' => 'in_progress',
        'meeting_room_id' => 'kosmos-'.Str::uuid(),
        'meeting_url' => 'http://localhost/call/kosmos-test',
        'starts_at' => now()->subMinutes(10),
        'ends_at' => now()->addMinutes(40),
    ], $overrides));
}

// ─── Acceso permitido ─────────────────────────────────────────────────────────

it('el profesional puede acceder a la sala de su cita', function () {
    $appointment = makeActiveAppointment();
    $professional = \App\Models\User::find($appointment->professional_id);

    $this->actingAs($professional)
        ->get(route('call.room', ['roomId' => $appointment->meeting_room_id]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('call/room')
            ->has('appointment')
            ->has('exitUrl')
        );
});

it('la sala no expone props de Jitsi ni recordingConsentGiven', function () {
    $appointment = makeActiveAppointment();
    $professional = \App\Models\User::find($appointment->professional_id);

    $this->actingAs($professional)
        ->get(route('call.room', ['roomId' => $appointment->meeting_room_id]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->missing('jitsiRoomName')
            ->missing('jitsiDomain')
            ->missing('recordingConsentGiven')
        );
});

it('el paciente puede acceder a la sala de su cita', function () {
    $appointment = makeActiveAppointment();
    $patient = \App\Models\User::find($appointment->patient_id);

    $this->actingAs($patient)
        ->get(route('call.room', ['roomId' => $appointment->meeting_room_id]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('call/room'));
});

// ─── Acceso denegado ──────────────────────────────────────────────────────────

it('un usuario ajeno a la cita recibe 403', function () {
    $appointment = makeActiveAppointment();
    $stranger = createProfessional();

    $this->actingAs($stranger)
        ->get(route('call.room', ['roomId' => $appointment->meeting_room_id]))
        ->assertForbidden();
});

it('usuario no autenticado es redirigido al login', function () {
    $appointment = makeActiveAppointment();

    $this->get(route('call.room', ['roomId' => $appointment->meeting_room_id]))
        ->assertRedirect();
});

it('cita cancelada devuelve 403', function () {
    $appointment = makeActiveAppointment(['status' => 'cancelled']);
    $professional = \App\Models\User::find($appointment->professional_id);

    $this->actingAs($professional)
        ->get(route('call.room', ['roomId' => $appointment->meeting_room_id]))
        ->assertForbidden();
});

it('cita completada devuelve 403', function () {
    $appointment = makeActiveAppointment(['status' => 'completed']);
    $professional = \App\Models\User::find($appointment->professional_id);

    $this->actingAs($professional)
        ->get(route('call.room', ['roomId' => $appointment->meeting_room_id]))
        ->assertForbidden();
});

it('sala inexistente devuelve 404', function () {
    $professional = createProfessional();

    $this->actingAs($professional)
        ->get(route('call.room', ['roomId' => 'kosmos-no-existe-room']))
        ->assertNotFound();
});

// ─── Ventana de tiempo ────────────────────────────────────────────────────────

it('devuelve 403 si la cita no ha empezado y el margen previo no cubre', function () {
    $appointment = makeActiveAppointment([
        'starts_at' => now()->addHours(2),
        'ends_at' => now()->addHours(3),
    ]);
    $professional = \App\Models\User::find($appointment->professional_id);

    $this->actingAs($professional)
        ->get(route('call.room', ['roomId' => $appointment->meeting_room_id]))
        ->assertForbidden();
});

it('devuelve 403 si la cita terminó hace más de 30 minutos', function () {
    $appointment = makeActiveAppointment([
        'starts_at' => now()->subHours(2),
        'ends_at' => now()->subMinutes(31),
    ]);
    $professional = \App\Models\User::find($appointment->professional_id);

    $this->actingAs($professional)
        ->get(route('call.room', ['roomId' => $appointment->meeting_room_id]))
        ->assertForbidden();
});

// ─── Portal: paciente une llamada ─────────────────────────────────────────────

it('el paciente que une la llamada recibe room_id y su patient_joined_at se registra', function () {
    $appointment = makeActiveAppointment([
        'patient_joined_at' => null,
    ]);
    $patient = \App\Models\User::find($appointment->patient_id);

    $this->actingAs($patient)
        ->postJson(route('patient.appointments.join', $appointment))
        ->assertOk()
        ->assertJsonStructure(['room_id', 'meeting_url']);

    expect($appointment->fresh()->patient_joined_at)->not->toBeNull();
});

it('el portal no sobreescribe patient_joined_at si ya existe', function () {
    $original = now()->subMinutes(5);

    $appointment = makeActiveAppointment([
        'patient_joined_at' => $original,
    ]);
    $patient = \App\Models\User::find($appointment->patient_id);

    $this->actingAs($patient)
        ->postJson(route('patient.appointments.join', $appointment));

    expect($appointment->fresh()->patient_joined_at->timestamp)->toBe($original->timestamp);
});

it('el portal redirige a la sala de espera si la sala aún no fue iniciada', function () {
    $appointment = makeActiveAppointment([
        'meeting_room_id' => null,
        'meeting_url' => null,
        'status' => 'confirmed',
    ]);
    $patient = \App\Models\User::find($appointment->patient_id);

    $this->actingAs($patient)
        ->postJson(route('patient.appointments.join', $appointment))
        ->assertRedirect(route('patient.appointments.waiting', $appointment));
});

it('otro paciente no puede unirse a una cita ajena', function () {
    $appointment = makeActiveAppointment();
    $otherPatient = createPatient();

    $this->actingAs($otherPatient)
        ->postJson(route('patient.appointments.join', $appointment))
        ->assertForbidden();
});
