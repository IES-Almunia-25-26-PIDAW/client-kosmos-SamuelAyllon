<?php

use App\Models\User;

it('guest cannot restore a user', function () {
    $target = createProfessional();
    $target->delete();

    $this->post(route('admin.users.restore', $target))
        ->assertRedirect(route('login'));
});

it('non-admin cannot restore a user', function () {
    $professional = createProfessional();
    $target = createProfessional();
    $target->delete();

    $this->actingAs($professional)
        ->post(route('admin.users.restore', $target))
        ->assertForbidden();
});

it('admin can restore a soft-deleted user and the email is recovered', function () {
    $admin = createAdmin();
    $target = createProfessional();
    $originalEmail = $target->email;

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $target));

    $this->actingAs($admin)
        ->post(route('admin.users.restore', $target))
        ->assertRedirect(route('admin.users.trash'));

    $restored = User::find($target->id);
    expect($restored)->not->toBeNull()
        ->and($restored->email)->toBe($originalEmail)
        ->and($restored->deleted_at)->toBeNull();
});

it('admin restore recovers the google_id too', function () {
    $admin = createAdmin();
    $target = createProfessional();
    $target->google_id = 'google-xyz';
    $target->save();

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $target));

    $this->actingAs($admin)
        ->post(route('admin.users.restore', $target))
        ->assertRedirect(route('admin.users.trash'));

    $restored = User::find($target->id);
    expect($restored->google_id)->toBe('google-xyz');
});

it('admin restore fails if the email was reused by another active user', function () {
    $admin = createAdmin();
    $target = createProfessional();
    $originalEmail = $target->email;

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $target));

    // Otro usuario activo se registra con el mismo email mientras el original
    // está en papelera.
    User::create([
        'name' => 'Otro',
        'email' => $originalEmail,
        'password' => 'irrelevant',
    ]);

    $this->actingAs($admin)
        ->from(route('admin.users.trash'))
        ->post(route('admin.users.restore', $target))
        ->assertRedirect(route('admin.users.trash'))
        ->assertSessionHasErrors('restore');

    expect(User::find($target->id))->toBeNull(); // sigue en papelera
});

it('admin restore is a no-op when the user is not actually trashed', function () {
    $admin = createAdmin();
    $target = createProfessional();

    $this->actingAs($admin)
        ->from(route('admin.users.trash'))
        ->post(route('admin.users.restore', $target))
        ->assertSessionHasErrors('restore');
});
