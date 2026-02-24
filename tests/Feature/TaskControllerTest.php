<?php

use App\Models\Task;
use App\Models\User;

// ── Acceso no autenticado ────────────────────────────────────────────────────

it('redirects guests from tasks index to login', function () {
    $this->get(route('tasks.index'))->assertRedirect(route('login'));
});

it('redirects guests from tasks create to login', function () {
    $this->get(route('tasks.create'))->assertRedirect(route('login'));
});

// ── Listado ──────────────────────────────────────────────────────────────────

it('authenticated user can view tasks index', function () {
    $user = createFreeUser();

    $this->actingAs($user)
        ->get(route('tasks.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('tasks/index'));
});

it('tasks index only shows own tasks', function () {
    $user = createFreeUser();
    $other = User::factory()->create();

    Task::factory()->create(['user_id' => $user->id, 'name' => 'Mi tarea']);
    Task::factory()->create(['user_id' => $other->id, 'name' => 'Tarea ajena']);

    $this->actingAs($user)
        ->get(route('tasks.index'))
        ->assertInertia(fn ($page) => $page
            ->component('tasks/index')
            ->has('tasks', 1)
            ->where('tasks.0.name', 'Mi tarea')
        );
});

// ── Creación ─────────────────────────────────────────────────────────────────

it('free user can create a task', function () {
    $user = createFreeUser();

    $this->actingAs($user)
        ->post(route('tasks.store'), [
            'name' => 'Nueva tarea',
            'priority' => 'medium',
        ])
        ->assertRedirect(route('tasks.index'));

    $this->assertDatabaseHas('tasks', [
        'user_id' => $user->id,
        'name' => 'Nueva tarea',
        'status' => 'pending',
    ]);
});

it('task store fails with invalid data', function () {
    $user = createFreeUser();

    $this->actingAs($user)
        ->post(route('tasks.store'), ['name' => '', 'priority' => 'invalid'])
        ->assertSessionHasErrors(['name', 'priority']);
});

it('free user is blocked when already has 5 pending tasks', function () {
    $user = createFreeUser();
    Task::factory()->count(5)->create(['user_id' => $user->id, 'status' => 'pending']);

    $this->actingAs($user)
        ->post(route('tasks.store'), ['name' => 'Sexta tarea', 'priority' => 'low'])
        ->assertSessionHasErrors('limit');

    $this->assertDatabaseMissing('tasks', ['name' => 'Sexta tarea']);
});

it('premium user can create more than 5 tasks', function () {
    $user = createPremiumUser();
    Task::factory()->count(5)->create(['user_id' => $user->id, 'status' => 'pending']);

    $this->actingAs($user)
        ->post(route('tasks.store'), ['name' => 'Sexta tarea', 'priority' => 'low'])
        ->assertRedirect(route('tasks.index'));

    expect(Task::where('user_id', $user->id)->count())->toBe(6);
});

// ── Edición ──────────────────────────────────────────────────────────────────

it('user can view edit form for own task', function () {
    $user = createFreeUser();
    $task = Task::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('tasks.edit', $task))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('tasks/edit'));
});

it('user cannot edit another user task', function () {
    $user = createFreeUser();
    $other = User::factory()->create();
    $task = Task::factory()->create(['user_id' => $other->id]);

    $this->actingAs($user)
        ->get(route('tasks.edit', $task))
        ->assertForbidden();
});

it('user can update own task', function () {
    $user = createFreeUser();
    $task = Task::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->put(route('tasks.update', $task), [
            'name' => 'Nombre actualizado',
            'priority' => 'high',
        ])
        ->assertRedirect(route('tasks.index'));

    $this->assertDatabaseHas('tasks', ['id' => $task->id, 'name' => 'Nombre actualizado']);
});

it('user cannot update another user task', function () {
    $user = createFreeUser();
    $other = User::factory()->create();
    $task = Task::factory()->create(['user_id' => $other->id]);

    $this->actingAs($user)
        ->put(route('tasks.update', $task), ['name' => 'Hack', 'priority' => 'low'])
        ->assertForbidden();
});

// ── Eliminación ──────────────────────────────────────────────────────────────

it('user can delete own task', function () {
    $user = createFreeUser();
    $task = Task::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->delete(route('tasks.destroy', $task))
        ->assertRedirect(route('tasks.index'));

    $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
});

it('user cannot delete another user task', function () {
    $user = createFreeUser();
    $other = User::factory()->create();
    $task = Task::factory()->create(['user_id' => $other->id]);

    $this->actingAs($user)
        ->delete(route('tasks.destroy', $task))
        ->assertForbidden();
});

// ── Complete / Reopen ────────────────────────────────────────────────────────

it('user can complete own task', function () {
    $user = createFreeUser();
    $task = Task::factory()->create(['user_id' => $user->id, 'status' => 'pending']);

    $this->actingAs($user)
        ->patch(route('tasks.complete', $task))
        ->assertRedirect();

    expect($task->fresh()->status)->toBe('completed');
});

it('user can reopen a completed task if under limit', function () {
    $user = createFreeUser();
    $task = Task::factory()->completed()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->patch(route('tasks.reopen', $task))
        ->assertRedirect();

    expect($task->fresh()->status)->toBe('pending');
});

it('free user cannot reopen a task when at limit', function () {
    $user = createFreeUser();
    Task::factory()->count(5)->create(['user_id' => $user->id, 'status' => 'pending']);
    $task = Task::factory()->completed()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->patch(route('tasks.reopen', $task))
        ->assertSessionHasErrors('limit');

    expect($task->fresh()->status)->toBe('completed');
});

it('user cannot complete another user task', function () {
    $user = createFreeUser();
    $other = User::factory()->create();
    $task = Task::factory()->create(['user_id' => $other->id]);

    $this->actingAs($user)
        ->patch(route('tasks.complete', $task))
        ->assertForbidden();
});
