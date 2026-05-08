<?php

// ── Acceso por rol ────────────────────────────────────────────────────────────

it('redirects guests from patients index to login', function () {
    $this->get(route('professional.patients.index'))->assertRedirect(route('login'));
});

it('professional can view patients index', function () {
    $user = createProfessional();

    $this->actingAs($user)
        ->get(route('professional.patients.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('professional/patients/index'));
});

it('patients index only shows patients belonging to authenticated user', function () {
    $user = createProfessional();
    $other = createProfessional();

    createPatientProfileFor($user, ['is_active' => true]);
    createPatientProfileFor($user, ['is_active' => true]);
    createPatientProfileFor($other, ['is_active' => true]);

    $this->actingAs($user)
        ->get(route('professional.patients.index'))
        ->assertInertia(fn ($page) => $page
            ->component('professional/patients/index')
            ->has('patients', 2)
        );
});

// ── Crear paciente ────────────────────────────────────────────────────────────

it('professional can access create patient page', function () {
    $this->actingAs(createProfessional())
        ->get(route('professional.patients.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('professional/patients/create'));
});

it('professional can create a patient', function () {
    $user = createProfessional();

    $this->actingAs($user)
        ->post(route('professional.patients.store'), [
            'project_name' => 'Ana García',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('users', [
        'name' => 'Ana García',
    ]);
    $this->assertDatabaseHas('patient_profiles', [
        'professional_id' => $user->id,
    ]);
});

it('store patient requires project_name', function () {
    $this->actingAs(createProfessional())
        ->post(route('professional.patients.store'), [])
        ->assertSessionHasErrors('project_name');
});

// ── Ver paciente ──────────────────────────────────────────────────────────────

it('professional can view their own patient', function () {
    $user = createProfessional();
    $patient = createPatientProfileFor($user);

    $this->actingAs($user)
        ->get(route('professional.patients.show', $patient))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('professional/patients/show'));
});

it('professional cannot view another users patient', function () {
    $user = createProfessional();
    $other = createProfessional();
    $patient = createPatientProfileFor($other);

    $this->actingAs($user)
        ->get(route('professional.patients.show', $patient))
        ->assertForbidden();
});

// ── Editar paciente ───────────────────────────────────────────────────────────

it('professional can access edit patient page', function () {
    $user = createProfessional();
    $patient = createPatientProfileFor($user);

    $this->actingAs($user)
        ->get(route('professional.patients.edit', $patient))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('professional/patients/edit'));
});

it('professional can update their own patient', function () {
    $user = createProfessional();
    $patient = createPatientProfileFor($user);

    $this->actingAs($user)
        ->put(route('professional.patients.update', $patient), [
            'project_name' => 'Nombre Actualizado',
        ])
        ->assertRedirect(route('professional.patients.show', $patient));

    $this->assertDatabaseHas('users', [
        'id' => $patient->user_id,
        'name' => 'Nombre Actualizado',
    ]);
});

it('professional cannot update another users patient', function () {
    $user = createProfessional();
    $other = createProfessional();
    $patient = createPatientProfileFor($other);

    $this->actingAs($user)
        ->put(route('professional.patients.update', $patient), ['project_name' => 'Hack'])
        ->assertForbidden();
});

// ── Eliminar paciente ─────────────────────────────────────────────────────────

it('professional can delete their own patient', function () {
    $user = createProfessional();
    $patient = createPatientProfileFor($user);

    $this->actingAs($user)
        ->delete(route('professional.patients.destroy', $patient))
        ->assertRedirect(route('professional.patients.index'));

    $this->assertSoftDeleted('patient_profiles', ['id' => $patient->id]);
});

it('professional cannot delete another users patient', function () {
    $user = createProfessional();
    $other = createProfessional();
    $patient = createPatientProfileFor($other);

    $this->actingAs($user)
        ->delete(route('professional.patients.destroy', $patient))
        ->assertForbidden();
});

// ── Pre y post sesión ─────────────────────────────────────────────────────────

it('professional can access pre-session page for their patient', function () {
    $user = createProfessional();
    $patient = createPatientProfileFor($user);

    $this->actingAs($user)
        ->get(route('professional.patients.pre-session', $patient))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('professional/patients/pre-session'));
});

it('pre-session page exposes context with frontend-shaped keys', function () {
    $user = createProfessional();
    $patient = createPatientProfileFor($user);

    \App\Models\Appointment::factory()->completed()->create([
        'patient_id' => $patient->user_id,
        'professional_id' => $user->id,
    ]);

    $this->actingAs($user)
        ->get(route('professional.patients.pre-session', $patient))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('professional/patients/pre-session')
            ->has('context.lastSessions')
            ->has('context.recentNotes')
            ->has('context.openAgreements')
            ->has('context', fn ($c) => $c
                ->has('lastSessions')
                ->has('recentNotes')
                ->has('openAgreements')
                ->has('lastPayment')
                ->has('validConsent')
            )
        );
});

it('professional can access post-session page for their patient', function () {
    $user = createProfessional();
    $patient = createPatientProfileFor($user);

    $this->actingAs($user)
        ->get(route('professional.patients.post-session', $patient))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('professional/patients/post-session'));
});
