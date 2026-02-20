<?php

use App\Models\Box;
use App\Models\User;

// ── Control de acceso por rol ────────────────────────────────────────────────

it('redirects guests from boxes index to login', function () {
    $this->get(route('boxes.index'))->assertRedirect(route('login'));
});

it('free user cannot access boxes', function () {
    $user = createFreeUser();

    $this->actingAs($user)->get(route('boxes.index'))->assertForbidden();
});

it('premium user can access boxes index', function () {
    $user = createPremiumUser();

    $this->actingAs($user)
        ->get(route('boxes.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('boxes/index'));
});

it('admin can access boxes index', function () {
    $this->actingAs(createAdmin())
        ->get(route('boxes.index'))
        ->assertOk();
});

// ── Listado ──────────────────────────────────────────────────────────────────

it('boxes index only shows own boxes', function () {
    $user = createPremiumUser();

    Box::factory()->create(['user_id' => $user->id, 'name' => 'Mi caja']);
    Box::factory()->create(['user_id' => User::factory()->create()->id, 'name' => 'Caja ajena']);

    $this->actingAs($user)
        ->get(route('boxes.index'))
        ->assertInertia(fn ($page) => $page
            ->component('boxes/index')
            ->has('boxes', 1)
            ->where('boxes.0.name', 'Mi caja')
        );
});

// ── Creación ─────────────────────────────────────────────────────────────────

it('premium user can create a box', function () {
    $user = createPremiumUser();

    $this->actingAs($user)
        ->post(route('boxes.store'), ['name' => 'Nueva caja'])
        ->assertRedirect();

    $this->assertDatabaseHas('boxes', ['user_id' => $user->id, 'name' => 'Nueva caja']);
});

it('box store fails with missing name', function () {
    $user = createPremiumUser();

    $this->actingAs($user)
        ->post(route('boxes.store'), ['name' => ''])
        ->assertSessionHasErrors('name');
});

// ── Vista ─────────────────────────────────────────────────────────────────────

it('premium user can view own box', function () {
    $user = createPremiumUser();
    $box = Box::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('boxes.show', $box))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('boxes/show'));
});

it('premium user cannot view another user box', function () {
    $user = createPremiumUser();
    $box = Box::factory()->create(['user_id' => User::factory()->create()->id]);

    $this->actingAs($user)
        ->get(route('boxes.show', $box))
        ->assertForbidden();
});

// ── Edición ──────────────────────────────────────────────────────────────────

it('premium user can update own box', function () {
    $user = createPremiumUser();
    $box = Box::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->put(route('boxes.update', $box), ['name' => 'Caja actualizada'])
        ->assertRedirect(route('boxes.show', $box));

    $this->assertDatabaseHas('boxes', ['id' => $box->id, 'name' => 'Caja actualizada']);
});

it('premium user cannot update another user box', function () {
    $user = createPremiumUser();
    $box = Box::factory()->create(['user_id' => User::factory()->create()->id]);

    $this->actingAs($user)
        ->put(route('boxes.update', $box), ['name' => 'Hack'])
        ->assertForbidden();
});

// ── Eliminación ──────────────────────────────────────────────────────────────

it('premium user can delete own box', function () {
    $user = createPremiumUser();
    $box = Box::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->delete(route('boxes.destroy', $box))
        ->assertRedirect(route('boxes.index'));

    $this->assertDatabaseMissing('boxes', ['id' => $box->id]);
});

it('premium user cannot delete another user box', function () {
    $user = createPremiumUser();
    $box = Box::factory()->create(['user_id' => User::factory()->create()->id]);

    $this->actingAs($user)
        ->delete(route('boxes.destroy', $box))
        ->assertForbidden();
});
