<?php

use App\Models\Message;
use App\Models\Workspace;

// ── Acceso por rol ────────────────────────────────────────────────────────────

it('redirects guests from patient messages to login', function () {
    $this->get(route('patient.messages.index'))->assertRedirect(route('login'));
});

it('patient can view messages index', function () {
    $this->actingAs(createPatient())
        ->get(route('patient.messages.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('patient/messages/index'));
});

// ── Envío de mensaje ──────────────────────────────────────────────────────────

it('patient can send a message when their profile has a workspace', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $workspace = Workspace::factory()->create([
        'creator_id' => $professional->id,
        'type' => Workspace::TYPE_PERSONAL,
    ]);

    $patient->patientProfile->update(['workspace_id' => $workspace->id]);

    $this->actingAs($patient)
        ->post(route('patient.messages.store'), [
            'receiver_id' => $professional->id,
            'body' => 'Hola, tengo una pregunta.',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('messages', [
        'sender_id' => $patient->id,
        'receiver_id' => $professional->id,
        'body' => 'Hola, tengo una pregunta.',
    ]);
});

it('patient message store fails when profile has no workspace', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $patient->patientProfile->update(['workspace_id' => null]);

    $this->actingAs($patient)
        ->post(route('patient.messages.store'), [
            'receiver_id' => $professional->id,
            'body' => 'Sin clínica activa.',
        ])
        ->assertStatus(422);
});

it('patient message store requires body', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $this->actingAs($patient)
        ->post(route('patient.messages.store'), [
            'receiver_id' => $professional->id,
        ])
        ->assertSessionHasErrors('body');
});
