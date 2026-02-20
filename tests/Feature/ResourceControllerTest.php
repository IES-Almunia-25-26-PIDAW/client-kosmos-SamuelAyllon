<?php

use App\Models\Box;
use App\Models\Resource;
use App\Models\User;

// ── Control de acceso por rol ────────────────────────────────────────────────

it('free user cannot access resource create form', function () {
    $user = createFreeUser();
    $box = Box::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('resources.create', $box))
        ->assertForbidden();
});

it('premium user can view resource create form for own box', function () {
    $user = createPremiumUser();
    $box = Box::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('resources.create', $box))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('resources/create'));
});

it('premium user cannot view resource create form for another user box', function () {
    $user = createPremiumUser();
    $box = Box::factory()->create(['user_id' => User::factory()->create()->id]);

    $this->actingAs($user)
        ->get(route('resources.create', $box))
        ->assertForbidden();
});

// ── Creación ─────────────────────────────────────────────────────────────────

it('premium user can create a resource in own box', function () {
    $user = createPremiumUser();
    $box = Box::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post(route('resources.store', $box), [
            'name' => 'Nuevo recurso',
            'type' => 'link',
            'url' => 'https://example.com',
        ])
        ->assertRedirect(route('boxes.show', $box));

    $this->assertDatabaseHas('resources', [
        'user_id' => $user->id,
        'box_id' => $box->id,
        'name' => 'Nuevo recurso',
        'type' => 'link',
    ]);
});

it('premium user cannot create a resource in another user box', function () {
    $user = createPremiumUser();
    $box = Box::factory()->create(['user_id' => User::factory()->create()->id]);

    $this->actingAs($user)
        ->post(route('resources.store', $box), ['name' => 'Hack', 'type' => 'link'])
        ->assertForbidden();
});

it('resource store fails with invalid type', function () {
    $user = createPremiumUser();
    $box = Box::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post(route('resources.store', $box), ['name' => 'Recurso', 'type' => 'invalid'])
        ->assertSessionHasErrors('type');
});

it('resource store fails with invalid url', function () {
    $user = createPremiumUser();
    $box = Box::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post(route('resources.store', $box), [
            'name' => 'Recurso',
            'type' => 'link',
            'url' => 'no-es-una-url',
        ])
        ->assertSessionHasErrors('url');
});

// ── Edición ──────────────────────────────────────────────────────────────────

it('premium user can update own resource', function () {
    $user = createPremiumUser();
    $box = Box::factory()->create(['user_id' => $user->id]);
    $resource = Resource::factory()->create(['user_id' => $user->id, 'box_id' => $box->id]);

    $this->actingAs($user)
        ->put(route('resources.update', $resource), [
            'name' => 'Recurso actualizado',
            'type' => 'document',
        ])
        ->assertRedirect(route('boxes.show', $box));

    $this->assertDatabaseHas('resources', ['id' => $resource->id, 'name' => 'Recurso actualizado']);
});

it('premium user cannot update another user resource', function () {
    $user = createPremiumUser();
    $otherBox = Box::factory()->create(['user_id' => User::factory()->create()->id]);
    $resource = Resource::factory()->create(['user_id' => $otherBox->user_id, 'box_id' => $otherBox->id]);

    $this->actingAs($user)
        ->put(route('resources.update', $resource), ['name' => 'Hack', 'type' => 'link'])
        ->assertForbidden();
});

// ── Eliminación ──────────────────────────────────────────────────────────────

it('premium user can delete own resource', function () {
    $user = createPremiumUser();
    $box = Box::factory()->create(['user_id' => $user->id]);
    $resource = Resource::factory()->create(['user_id' => $user->id, 'box_id' => $box->id]);

    $this->actingAs($user)
        ->delete(route('resources.destroy', $resource))
        ->assertRedirect(route('boxes.show', $box));

    $this->assertDatabaseMissing('resources', ['id' => $resource->id]);
});

it('premium user cannot delete another user resource', function () {
    $user = createPremiumUser();
    $otherBox = Box::factory()->create(['user_id' => User::factory()->create()->id]);
    $resource = Resource::factory()->create(['user_id' => $otherBox->user_id, 'box_id' => $otherBox->id]);

    $this->actingAs($user)
        ->delete(route('resources.destroy', $resource))
        ->assertForbidden();
});
