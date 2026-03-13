<?php

use App\Models\Idea;
use App\Models\User;

// ── Acceso no autenticado ────────────────────────────────────────────────────

it('redirects guests from ideas index to login', function () {
    $this->get(route('notes.index'))->assertRedirect(route('login'));
});

it('redirects guests from ideas create to login', function () {
    $this->get(route('notes.create'))->assertRedirect(route('login'));
});

// ── Listado ──────────────────────────────────────────────────────────────────

it('authenticated user can view ideas index', function () {
    $user = createFreeUser();

    $this->actingAs($user)
        ->get(route('notes.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('ideas/index'));
});

it('ideas index only shows own ideas', function () {
    $user = createFreeUser();
    $other = User::factory()->create();

    Idea::factory()->create(['user_id' => $user->id, 'name' => 'Mi idea']);
    Idea::factory()->create(['user_id' => $other->id, 'name' => 'Idea ajena']);

    $this->actingAs($user)
        ->get(route('notes.index'))
        ->assertInertia(fn ($page) => $page
            ->component('ideas/index')
            ->has('ideas', 1)
            ->where('ideas.0.name', 'Mi idea')
        );
});

// ── Creación ─────────────────────────────────────────────────────────────────

it('authenticated user can create an idea', function () {
    $user = createFreeUser();

    $this->actingAs($user)
        ->post(route('notes.store'), [
            'name' => 'Nueva idea',
            'priority' => 'high',
        ])
        ->assertRedirect(route('notes.index'));

    $this->assertDatabaseHas('ideas', [
        'user_id' => $user->id,
        'name' => 'Nueva idea',
        'status' => 'active',
        'source' => 'manual',
    ]);
});

it('idea store sets source to manual automatically', function () {
    $user = createFreeUser();

    $this->actingAs($user)
        ->post(route('notes.store'), ['name' => 'Test idea', 'priority' => 'low']);

    $this->assertDatabaseHas('ideas', ['name' => 'Test idea', 'source' => 'manual']);
});

it('idea store fails with invalid data', function () {
    $user = createFreeUser();

    $this->actingAs($user)
        ->post(route('notes.store'), ['name' => '', 'priority' => 'invalid'])
        ->assertSessionHasErrors(['name', 'priority']);
});

// ── Edición ──────────────────────────────────────────────────────────────────

it('user can view edit form for own idea', function () {
    $user = createFreeUser();
    $idea = Idea::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('notes.edit', $idea))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('ideas/edit'));
});

it('user cannot edit another user idea', function () {
    $user = createFreeUser();
    $idea = Idea::factory()->create(['user_id' => User::factory()->create()->id]);

    $this->actingAs($user)
        ->get(route('notes.edit', $idea))
        ->assertForbidden();
});

it('user can update own idea', function () {
    $user = createFreeUser();
    $idea = Idea::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->put(route('notes.update', $idea), [
            'name' => 'Idea actualizada',
            'priority' => 'low',
        ])
        ->assertRedirect(route('notes.index'));

    $this->assertDatabaseHas('ideas', ['id' => $idea->id, 'name' => 'Idea actualizada']);
});

it('user cannot update another user idea', function () {
    $user = createFreeUser();
    $idea = Idea::factory()->create(['user_id' => User::factory()->create()->id]);

    $this->actingAs($user)
        ->put(route('notes.update', $idea), ['name' => 'Hack', 'priority' => 'low'])
        ->assertForbidden();
});

// ── Eliminación ──────────────────────────────────────────────────────────────

it('user can delete own idea', function () {
    $user = createFreeUser();
    $idea = Idea::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->delete(route('notes.destroy', $idea))
        ->assertRedirect(route('notes.index'));

    $this->assertDatabaseMissing('ideas', ['id' => $idea->id]);
});

it('user cannot delete another user idea', function () {
    $user = createFreeUser();
    $idea = Idea::factory()->create(['user_id' => User::factory()->create()->id]);

    $this->actingAs($user)
        ->delete(route('notes.destroy', $idea))
        ->assertForbidden();
});

// ── Resolve / Reactivate ─────────────────────────────────────────────────────

it('user can resolve own idea', function () {
    $user = createFreeUser();
    $idea = Idea::factory()->create(['user_id' => $user->id, 'status' => 'active']);

    $this->actingAs($user)
        ->patch(route('notes.resolve', $idea))
        ->assertRedirect();

    expect($idea->fresh()->status)->toBe('resolved');
});

it('user can reactivate own resolved idea', function () {
    $user = createFreeUser();
    $idea = Idea::factory()->resolved()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->patch(route('notes.reactivate', $idea))
        ->assertRedirect();

    expect($idea->fresh()->status)->toBe('active');
});

it('user cannot resolve another user idea', function () {
    $user = createFreeUser();
    $idea = Idea::factory()->create(['user_id' => User::factory()->create()->id]);

    $this->actingAs($user)
        ->patch(route('notes.resolve', $idea))
        ->assertForbidden();
});
