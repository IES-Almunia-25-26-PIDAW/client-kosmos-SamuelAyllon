<?php

use App\Models\Patient;
use App\Models\User;

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

    Patient::factory()->count(2)->create(['user_id' => $user->id, 'is_active' => true]);
    Patient::factory()->create(['user_id' => $other->id, 'is_active' => true]);

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

    $this->assertDatabaseHas('patients', [
        'user_id'      => $user->id,
        'project_name' => 'Ana García',
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
    $patient = Patient::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('patients.show', $patient))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('patients/show'));
});

it('professional cannot view another users patient', function () {
    $user = createProfessional();
    $other = createProfessional();
    $patient = Patient::factory()->create(['user_id' => $other->id]);

    $this->actingAs($user)
        ->get(route('patients.show', $patient))
        ->assertForbidden();
});

// ── Editar paciente ───────────────────────────────────────────────────────────

it('professional can access edit patient page', function () {
    $user = createProfessional();
    $patient = Patient::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('patients.edit', $patient))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('patients/edit'));
});

it('professional can update their own patient', function () {
    $user = createProfessional();
    $patient = Patient::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->put(route('patients.update', $patient), [
            'project_name' => 'Nombre Actualizado',
        ])
        ->assertRedirect(route('patients.show', $patient));

    $this->assertDatabaseHas('patients', [
        'id'           => $patient->id,
        'project_name' => 'Nombre Actualizado',
    ]);
});

it('professional cannot update another users patient', function () {
    $user = createProfessional();
    $other = createProfessional();
    $patient = Patient::factory()->create(['user_id' => $other->id]);

    $this->actingAs($user)
        ->put(route('patients.update', $patient), ['project_name' => 'Hack'])
        ->assertForbidden();
});

// ── Eliminar paciente ─────────────────────────────────────────────────────────

it('professional can delete their own patient', function () {
    $user = createProfessional();
    $patient = Patient::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->delete(route('patients.destroy', $patient))
        ->assertRedirect(route('patients.index'));

    $this->assertSoftDeleted('patients', ['id' => $patient->id]);
});

it('professional cannot delete another users patient', function () {
    $user = createProfessional();
    $other = createProfessional();
    $patient = Patient::factory()->create(['user_id' => $other->id]);

    $this->actingAs($user)
        ->delete(route('patients.destroy', $patient))
        ->assertForbidden();
});

// ── Pre y post sesión ─────────────────────────────────────────────────────────

it('professional can access pre-session page for their patient', function () {
    $user = createProfessional();
    $patient = Patient::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('patients.pre-session', $patient))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('patients/pre-session'));
});

it('professional can access post-session page for their patient', function () {
    $user = createProfessional();
    $patient = Patient::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('patients.post-session', $patient))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('patients/post-session'));
});
