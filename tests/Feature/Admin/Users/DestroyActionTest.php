<?php

use App\Models\User;

it('guest cannot delete a user from admin', function () {
    $target = createProfessional();

    $this->delete(route('admin.users.destroy', $target))
        ->assertRedirect(route('login'));
});

it('non-admin cannot delete a user from admin', function () {
    $professional = createProfessional();
    $target = createProfessional();

    $this->actingAs($professional)
        ->delete(route('admin.users.destroy', $target))
        ->assertForbidden();
});

it('admin cannot delete themselves', function () {
    $admin = createAdmin();

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $admin))
        ->assertSessionHasErrors('delete');

    expect(User::find($admin->id))->not->toBeNull();
});

it('admin soft-deletes a user and frees the email for re-registration', function () {
    $admin = createAdmin();
    $target = createProfessional();
    $originalEmail = $target->email;

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $target))
        ->assertRedirect(route('admin.dashboard'));

    $this->assertSoftDeleted('users', ['id' => $target->id]);

    $trashed = User::withTrashed()->find($target->id);
    expect($trashed->email)->not->toBe($originalEmail)
        ->and($trashed->email)->toContain($originalEmail)
        ->and($trashed->email)->toStartWith('del_');

    // El email original queda libre: un nuevo User::create no choca con el unique.
    $reused = User::create([
        'name' => 'Nuevo Usuario',
        'email' => $originalEmail,
        'password' => 'irrelevant-hash',
    ]);

    expect($reused->email)->toBe($originalEmail);
});

it('admin soft-delete renames google_id when present', function () {
    $admin = createAdmin();
    $target = createProfessional();
    $target->google_id = 'google-12345';
    $target->save();

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $target));

    $trashed = User::withTrashed()->find($target->id);
    expect($trashed->google_id)->not->toBe('google-12345')
        ->and($trashed->google_id)->toContain('google-12345')
        ->and($trashed->google_id)->toStartWith('del_');
});

it('admin soft-delete leaves google_id null when it was null', function () {
    $admin = createAdmin();
    $target = createProfessional();

    expect($target->google_id)->toBeNull();

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $target));

    $trashed = User::withTrashed()->find($target->id);
    expect($trashed->google_id)->toBeNull();
});
