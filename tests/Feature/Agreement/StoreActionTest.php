<?php

it('redirects guests to login', function () {
    $professional = createProfessional();
    $patient = createPatientProfileFor($professional);

    $this->post(route('professional.patients.agreements.store', $patient))
        ->assertRedirect(route('login'));
});

it('stores agreement and redirects back', function () {
    $professional = createProfessional();
    $patient = createPatientProfileFor($professional);

    $this->actingAs($professional)
        ->post(route('professional.patients.agreements.store', $patient), [
            'content' => 'El paciente se compromete a asistir puntualmente.',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('agreements', [
        'patient_id' => $patient->id,
        'user_id' => $professional->id,
        'content' => 'El paciente se compromete a asistir puntualmente.',
    ]);
});

it('rejects agreement without content', function () {
    $professional = createProfessional();
    $patient = createPatientProfileFor($professional);

    $this->actingAs($professional)
        ->post(route('professional.patients.agreements.store', $patient), [])
        ->assertSessionHasErrors('content');
});

it('forbids storing agreement for unrelated patient', function () {
    $professional = createProfessional();
    $other = createProfessional();
    $patient = createPatientProfileFor($other);

    $this->actingAs($professional)
        ->post(route('professional.patients.agreements.store', $patient), [
            'content' => 'Intento no autorizado.',
        ])
        ->assertForbidden();
});
