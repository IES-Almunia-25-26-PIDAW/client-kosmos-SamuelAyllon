<?php

// ── Acceso por rol ────────────────────────────────────────────────────────────

it('redirects guests from patients index to login', function () {
    $this->get(route('patients.index'))->assertRedirect(route('login'));
});

it('professional can view patients index', function () {
    $user = createProfessional();

    $this->actingAs($user)
        ->get(route('patients.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('patients/index'));
});

it('patients index only shows patients belonging to authenticated user', function () {
    $user = createProfessional();
    $other = createProfessional();

    createPatientProfileFor($user, ['is_active' => true]);
    createPatientProfileFor($user, ['is_active' => true]);
    createPatientProfileFor($other, ['is_active' => true]);

    $this->actingAs($user)
        ->get(route('patients.index'))
        ->assertInertia(fn ($page) => $page
            ->component('patients/index')
            ->has('patients', 2)
        );
});

// ── Crear paciente ────────────────────────────────────────────────────────────

it('professional can access create patient page', function () {
    $this->actingAs(createProfessional())
        ->get(route('patients.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('patients/create'));
});

it('professional can create a patient', function () {
    $user = createProfessional();

    $this->actingAs($user)
        ->post(route('patients.store'), [
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
        ->post(route('patients.store'), [])
        ->assertSessionHasErrors('project_name');
});

// ── Ver paciente ──────────────────────────────────────────────────────────────

it('professional can view their own patient', function () {
    $user = createProfessional();
    $patient = createPatientProfileFor($user);

    $this->actingAs($user)
        ->get(route('patients.show', $patient))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('patients/show'));
});

it('professional cannot view another users patient', function () {
    $user = createProfessional();
    $other = createProfessional();
    $patient = createPatientProfileFor($other);

    $this->actingAs($user)
        ->get(route('patients.show', $patient))
        ->assertForbidden();
});

// ── Editar paciente ───────────────────────────────────────────────────────────

it('professional can access edit patient page', function () {
    $user = createProfessional();
    $patient = createPatientProfileFor($user);

    $this->actingAs($user)
        ->get(route('patients.edit', $patient))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('patients/edit'));
});

it('professional can update their own patient', function () {
    $user = createProfessional();
    $patient = createPatientProfileFor($user);

    $this->actingAs($user)
        ->put(route('patients.update', $patient), [
            'project_name' => 'Nombre Actualizado',
        ])
        ->assertRedirect(route('patients.show', $patient));

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
        ->put(route('patients.update', $patient), ['project_name' => 'Hack'])
        ->assertForbidden();
});

// ── Eliminar paciente ─────────────────────────────────────────────────────────

it('professional can delete their own patient', function () {
    $user = createProfessional();
    $patient = createPatientProfileFor($user);

    $this->actingAs($user)
        ->delete(route('patients.destroy', $patient))
        ->assertRedirect(route('patients.index'));

    $this->assertSoftDeleted('patient_profiles', ['id' => $patient->id]);
});

it('professional cannot delete another users patient', function () {
    $user = createProfessional();
    $other = createProfessional();
    $patient = createPatientProfileFor($other);

    $this->actingAs($user)
        ->delete(route('patients.destroy', $patient))
        ->assertForbidden();
});

// ── Pre y post sesión ─────────────────────────────────────────────────────────

it('professional can access pre-session page for their patient', function () {
    $user = createProfessional();
    $patient = createPatientProfileFor($user);

    $this->actingAs($user)
        ->get(route('patients.pre-session', $patient))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('patients/pre-session'));
});

it('professional can access post-session page for their patient', function () {
    $user = createProfessional();
    $patient = createPatientProfileFor($user);

    $this->actingAs($user)
        ->get(route('patients.post-session', $patient))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('patients/post-session'));
});
