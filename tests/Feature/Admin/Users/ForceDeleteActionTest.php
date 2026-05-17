<?php

use App\Models\User;

it('guest cannot force-delete a user', function () {
    $target = createProfessional();
    $target->delete();

    $this->delete(route('admin.users.force-delete', $target))
        ->assertRedirect(route('login'));
});

it('non-admin cannot force-delete a user', function () {
    $professional = createProfessional();
    $target = createProfessional();
    $target->delete();

    $this->actingAs($professional)
        ->delete(route('admin.users.force-delete', $target))
        ->assertForbidden();
});

it('admin can permanently delete a soft-deleted user', function () {
    $admin = createAdmin();
    $target = createProfessional();
    $target->delete();

    $this->actingAs($admin)
        ->delete(route('admin.users.force-delete', $target))
        ->assertRedirect(route('admin.users.trash'));

    expect(User::withTrashed()->find($target->id))->toBeNull();
});

it('admin force-delete fails on an active user', function () {
    $admin = createAdmin();
    $target = createProfessional();

    $this->actingAs($admin)
        ->from(route('admin.users.trash'))
        ->delete(route('admin.users.force-delete', $target))
        ->assertSessionHasErrors('force_delete');

    expect(User::find($target->id))->not->toBeNull();
});

it('admin cannot force-delete themselves', function () {
    $admin = createAdmin();

    $this->actingAs($admin)
        ->delete(route('admin.users.force-delete', $admin))
        ->assertSessionHasErrors('force_delete');

    expect(User::find($admin->id))->not->toBeNull();
});
