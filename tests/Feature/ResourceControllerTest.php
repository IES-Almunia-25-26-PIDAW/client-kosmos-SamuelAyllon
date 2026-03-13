<?php

use App\Models\Project;
use App\Models\Resource;
use App\Models\User;

// ── Control de acceso por rol ────────────────────────────────────────────────

it('free user cannot access resource create form', function () {
    $user = createFreeUser();
    $project = Project::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('resources.create', $project))
        ->assertForbidden();
});

it('premium user can view resource create form for own client', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('resources.create', $project))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('resources/create'));
});

it('premium user cannot view resource create form for another user client', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => User::factory()->create()->id]);

    $this->actingAs($user)
        ->get(route('resources.create', $project))
        ->assertForbidden();
});

// ── Creación ─────────────────────────────────────────────────────────────────

it('premium user can create a resource in own client', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post(route('resources.store', $project), [
            'name' => 'Nuevo recurso',
            'type' => 'link',
            'url' => 'https://example.com',
        ])
        ->assertRedirect(route('clients.show', $project));

    $this->assertDatabaseHas('resources', [
        'user_id' => $user->id,
        'project_id' => $project->id,
        'name' => 'Nuevo recurso',
        'type' => 'link',
    ]);
});

it('premium user cannot create a resource in another user client', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => User::factory()->create()->id]);

    $this->actingAs($user)
        ->post(route('resources.store', $project), ['name' => 'Hack', 'type' => 'link'])
        ->assertForbidden();
});

it('resource store fails with invalid type', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post(route('resources.store', $project), ['name' => 'Recurso', 'type' => 'invalid'])
        ->assertSessionHasErrors('type');
});

it('resource store fails with invalid url', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post(route('resources.store', $project), [
            'name' => 'Recurso',
            'type' => 'link',
            'url' => 'no-es-una-url',
        ])
        ->assertSessionHasErrors('url');
});

// ── Edición ──────────────────────────────────────────────────────────────────

it('premium user can update own resource', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => $user->id]);
    $resource = Resource::factory()->create(['user_id' => $user->id, 'project_id' => $project->id]);

    $this->actingAs($user)
        ->put(route('resources.update', $resource), [
            'name' => 'Recurso actualizado',
            'type' => 'document',
        ])
        ->assertRedirect(route('clients.show', $project));

    $this->assertDatabaseHas('resources', ['id' => $resource->id, 'name' => 'Recurso actualizado']);
});

it('premium user cannot update another user resource', function () {
    $user = createPremiumUser();
    $otherProject = Project::factory()->create(['user_id' => User::factory()->create()->id]);
    $resource = Resource::factory()->create(['user_id' => $otherProject->user_id, 'project_id' => $otherProject->id]);

    $this->actingAs($user)
        ->put(route('resources.update', $resource), ['name' => 'Hack', 'type' => 'link'])
        ->assertForbidden();
});

// ── Eliminación ──────────────────────────────────────────────────────────────

it('premium user can delete own resource', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => $user->id]);
    $resource = Resource::factory()->create(['user_id' => $user->id, 'project_id' => $project->id]);

    $this->actingAs($user)
        ->delete(route('resources.destroy', $resource))
        ->assertRedirect(route('clients.show', $project));

    $this->assertDatabaseMissing('resources', ['id' => $resource->id]);
});

it('premium user cannot delete another user resource', function () {
    $user = createPremiumUser();
    $otherProject = Project::factory()->create(['user_id' => User::factory()->create()->id]);
    $resource = Resource::factory()->create(['user_id' => $otherProject->user_id, 'project_id' => $otherProject->id]);

    $this->actingAs($user)
        ->delete(route('resources.destroy', $resource))
        ->assertForbidden();
});
