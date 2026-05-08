<?php

it('redirects guests to login', function () {
    $professional = createProfessional();
    $patient = createPatientProfileFor($professional);

    $this->post(route('professional.patients.notes.store', $patient))
        ->assertRedirect(route('login'));
});

it('stores note and redirects back', function () {
    $professional = createProfessional();
    $patient = createPatientProfileFor($professional);

    $this->actingAs($professional)
        ->post(route('professional.patients.notes.store', $patient), [
            'content' => 'Paciente muestra progreso significativo.',
            'type' => 'session_note',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('notes', [
        'patient_id' => $patient->id,
        'user_id' => $professional->id,
        'type' => 'session_note',
    ]);
});

it('rejects note with invalid type', function () {
    $professional = createProfessional();
    $patient = createPatientProfileFor($professional);

    $this->actingAs($professional)
        ->post(route('professional.patients.notes.store', $patient), [
            'content' => 'Contenido válido.',
            'type' => 'tipo_invalido',
        ])
        ->assertSessionHasErrors('type');
});

it('forbids storing note for unrelated patient', function () {
    $professional = createProfessional();
    $other = createProfessional();
    $patient = createPatientProfileFor($other);

    $this->actingAs($professional)
        ->post(route('professional.patients.notes.store', $patient), [
            'content' => 'Nota no autorizada.',
            'type' => 'quick_note',
        ])
        ->assertForbidden();
});
