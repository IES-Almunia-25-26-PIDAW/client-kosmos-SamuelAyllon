<?php

use App\Http\Controllers\Admin\Users\TrashedIndexAction;

it('guest cannot access the trash index', function () {
    $this->get(route('admin.users.trash'))
        ->assertRedirect(route('login'));
});

it('non-admin cannot access the trash index', function () {
    $professional = createProfessional();

    $this->actingAs($professional)
        ->get(route('admin.users.trash'))
        ->assertForbidden();
});

it('admin sees trashed users with the original email reconstructed', function () {
    $admin = createAdmin();
    $target = createProfessional();
    $originalEmail = $target->email;

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $target));

    $response = $this->actingAs($admin)
        ->get(route('admin.users.trash'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/users/trash')
            ->has('users.data', 1)
            ->where('users.data.0.id', $target->id)
            ->where('users.data.0.original_email', $originalEmail)
        );

    expect($response)->not->toBeNull();
});

it('admin trash index does not list active users', function () {
    $admin = createAdmin();
    createProfessional();

    $this->actingAs($admin)
        ->get(route('admin.users.trash'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('users.data', 0));
});

it('stripDeletedPrefix returns null for null input', function () {
    expect(TrashedIndexAction::stripDeletedPrefix(null))->toBeNull();
});

it('stripDeletedPrefix strips the del_{ts}_{rand}_ prefix', function () {
    $original = 'foo@bar.com';
    $prefixed = 'del_1715938800_abc123_'.$original;

    expect(TrashedIndexAction::stripDeletedPrefix($prefixed))
        ->toBe($original);
});

it('stripDeletedPrefix leaves values without the prefix unchanged', function () {
    expect(TrashedIndexAction::stripDeletedPrefix('plain@x.com'))
        ->toBe('plain@x.com');
});
