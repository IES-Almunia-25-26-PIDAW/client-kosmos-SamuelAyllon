<?php

use App\Models\Project;
use App\Models\User;

// ── Control de acceso por rol ────────────────────────────────────────────────

it('redirects guests from clients index to login', function () {
    $this->get(route('clients.index'))->assertRedirect(route('login'));
});

it('free user can access clients index', function () {
    $user = createFreeUser();

    $this->actingAs($user)
        ->get(route('clients.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('projects/index'));
});

it('premium user can access clients index', function () {
    $user = createPremiumUser();

    $this->actingAs($user)
        ->get(route('clients.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('projects/index'));
});

// ── Listado ──────────────────────────────────────────────────────────────────

it('clients index only shows own projects', function () {
    $user = createPremiumUser();
    $other = User::factory()->create();

    Project::factory()->create(['user_id' => $user->id, 'name' => 'Mi cliente']);
    Project::factory()->create(['user_id' => $other->id, 'name' => 'Cliente ajeno']);

    $this->actingAs($user)
        ->get(route('clients.index'))
        ->assertInertia(fn ($page) => $page
            ->component('projects/index')
            ->has('projects', 1)
            ->where('projects.0.name', 'Mi cliente')
        );
});

// ── Creación ─────────────────────────────────────────────────────────────────

it('premium user can create a client', function () {
    $user = createPremiumUser();

    $this->actingAs($user)
        ->post(route('clients.store'), ['name' => 'Nuevo cliente'])
        ->assertRedirect();

    $this->assertDatabaseHas('projects', [
        'user_id' => $user->id,
        'name' => 'Nuevo cliente',
        'status' => 'inactive',
    ]);
});

it('free user can create one client', function () {
    $user = createFreeUser();

    $this->actingAs($user)
        ->post(route('clients.store'), ['name' => 'Mi único cliente'])
        ->assertRedirect();

    $this->assertDatabaseHas('projects', [
        'user_id' => $user->id,
        'name' => 'Mi único cliente',
    ]);
});

it('free user cannot create a second client', function () {
    $user = createFreeUser();
    Project::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post(route('clients.store'), ['name' => 'Segundo cliente'])
        ->assertRedirect(route('clients.index'));

    expect($user->projects()->count())->toBe(1);
});

it('client store fails with invalid data', function () {
    $user = createPremiumUser();

    $this->actingAs($user)
        ->post(route('clients.store'), ['name' => ''])
        ->assertSessionHasErrors('name');
});

it('client store fails with invalid color', function () {
    $user = createPremiumUser();

    $this->actingAs($user)
        ->post(route('clients.store'), ['name' => 'Cliente', 'color' => 'rojo'])
        ->assertSessionHasErrors('color');
});

// ── Vista ─────────────────────────────────────────────────────────────────────

it('user can view own client', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('clients.show', $project))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('projects/show'));
});

it('user cannot view another user client', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => User::factory()->create()->id]);

    $this->actingAs($user)
        ->get(route('clients.show', $project))
        ->assertForbidden();
});

// ── Edición ──────────────────────────────────────────────────────────────────

it('user can update own client', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->put(route('clients.update', $project), [
            'name' => 'Cliente actualizado',
            'status' => 'active',
        ])
        ->assertRedirect(route('clients.show', $project));

    $this->assertDatabaseHas('projects', ['id' => $project->id, 'name' => 'Cliente actualizado', 'status' => 'active']);
});

it('user cannot update another user client', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => User::factory()->create()->id]);

    $this->actingAs($user)
        ->put(route('clients.update', $project), ['name' => 'Hack', 'status' => 'active'])
        ->assertForbidden();
});

it('client update fails with invalid status', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->put(route('clients.update', $project), ['name' => 'Test', 'status' => 'archived'])
        ->assertSessionHasErrors('status');
});

// ── Eliminación ──────────────────────────────────────────────────────────────

it('user can delete own client', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->delete(route('clients.destroy', $project))
        ->assertRedirect(route('clients.index'));

    $this->assertDatabaseMissing('projects', ['id' => $project->id]);
});

it('user cannot delete another user client', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => User::factory()->create()->id]);

    $this->actingAs($user)
        ->delete(route('clients.destroy', $project))
        ->assertForbidden();
});
