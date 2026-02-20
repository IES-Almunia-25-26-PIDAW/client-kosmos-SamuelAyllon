<?php

use App\Models\Project;
use App\Models\User;

// ── Control de acceso por rol ────────────────────────────────────────────────

it('redirects guests from projects index to login', function () {
    $this->get(route('projects.index'))->assertRedirect(route('login'));
});

it('free user cannot access projects index', function () {
    $user = createFreeUser();

    $this->actingAs($user)
        ->get(route('projects.index'))
        ->assertForbidden();
});

it('premium user can access projects index', function () {
    $user = createPremiumUser();

    $this->actingAs($user)
        ->get(route('projects.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('projects/index'));
});

it('admin can access projects index', function () {
    $user = createAdmin();

    $this->actingAs($user)
        ->get(route('projects.index'))
        ->assertOk();
});

// ── Listado ──────────────────────────────────────────────────────────────────

it('projects index only shows own projects', function () {
    $user = createPremiumUser();
    $other = User::factory()->create();

    Project::factory()->create(['user_id' => $user->id, 'name' => 'Mi proyecto']);
    Project::factory()->create(['user_id' => $other->id, 'name' => 'Proyecto ajeno']);

    $this->actingAs($user)
        ->get(route('projects.index'))
        ->assertInertia(fn ($page) => $page
            ->component('projects/index')
            ->has('projects', 1)
            ->where('projects.0.name', 'Mi proyecto')
        );
});

// ── Creación ─────────────────────────────────────────────────────────────────

it('premium user can create a project', function () {
    $user = createPremiumUser();

    $this->actingAs($user)
        ->post(route('projects.store'), ['name' => 'Nuevo proyecto'])
        ->assertRedirect();

    $this->assertDatabaseHas('projects', [
        'user_id' => $user->id,
        'name' => 'Nuevo proyecto',
        'status' => 'created',
    ]);
});

it('project store fails with invalid data', function () {
    $user = createPremiumUser();

    $this->actingAs($user)
        ->post(route('projects.store'), ['name' => ''])
        ->assertSessionHasErrors('name');
});

it('project store fails with invalid color', function () {
    $user = createPremiumUser();

    $this->actingAs($user)
        ->post(route('projects.store'), ['name' => 'Proyecto', 'color' => 'rojo'])
        ->assertSessionHasErrors('color');
});

// ── Vista ─────────────────────────────────────────────────────────────────────

it('premium user can view own project', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('projects.show', $project))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('projects/show'));
});

it('premium user cannot view another user project', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => User::factory()->create()->id]);

    $this->actingAs($user)
        ->get(route('projects.show', $project))
        ->assertForbidden();
});

// ── Edición ──────────────────────────────────────────────────────────────────

it('premium user can update own project', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->put(route('projects.update', $project), [
            'name' => 'Proyecto actualizado',
            'status' => 'active',
        ])
        ->assertRedirect(route('projects.show', $project));

    $this->assertDatabaseHas('projects', ['id' => $project->id, 'name' => 'Proyecto actualizado', 'status' => 'active']);
});

it('premium user cannot update another user project', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => User::factory()->create()->id]);

    $this->actingAs($user)
        ->put(route('projects.update', $project), ['name' => 'Hack', 'status' => 'active'])
        ->assertForbidden();
});

it('project update fails with invalid status', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->put(route('projects.update', $project), ['name' => 'Test', 'status' => 'archived'])
        ->assertSessionHasErrors('status');
});

// ── Eliminación ──────────────────────────────────────────────────────────────

it('premium user can delete own project', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->delete(route('projects.destroy', $project))
        ->assertRedirect(route('projects.index'));

    $this->assertDatabaseMissing('projects', ['id' => $project->id]);
});

it('premium user cannot delete another user project', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => User::factory()->create()->id]);

    $this->actingAs($user)
        ->delete(route('projects.destroy', $project))
        ->assertForbidden();
});
