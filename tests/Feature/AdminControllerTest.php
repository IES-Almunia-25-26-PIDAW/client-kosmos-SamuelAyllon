<?php

use App\Models\User;

// ── Acceso por rol ────────────────────────────────────────────────────────────

it('redirects guests from admin users index to login', function () {
    $this->get(route('admin.users.index'))->assertRedirect(route('login'));
});

it('professional cannot access admin users index', function () {
    $this->actingAs(createProfessional())
        ->get(route('admin.users.index'))
        ->assertForbidden();
});

it('admin can access admin users index', function () {
    $this->actingAs(createAdmin())
        ->get(route('admin.users.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('admin/users/index'));
});

// ── Listado de usuarios ───────────────────────────────────────────────────────

it('admin users index contains paginated users', function () {
    $admin = createAdmin();

    $this->actingAs($admin)
        ->get(route('admin.users.index'))
        ->assertInertia(fn ($page) => $page
            ->component('admin/users/index')
            ->has('users')
        );
});

// ── Detalle de usuario ────────────────────────────────────────────────────────

it('redirects guests from admin user show to login', function () {
    $user = User::factory()->create();
    $this->get(route('admin.users.show', $user))->assertRedirect(route('login'));
});

it('professional cannot view admin user detail', function () {
    $professional = createProfessional();
    $other = User::factory()->create();

    $this->actingAs($professional)
        ->get(route('admin.users.show', $other))
        ->assertForbidden();
});

it('admin can view a specific user detail', function () {
    $admin = createAdmin();
    $professional = createProfessional();

    $this->actingAs($admin)
        ->get(route('admin.users.show', $professional))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('admin/users/show'));
});

// ── Crear usuario ─────────────────────────────────────────────────────────────

it('admin can access create user page', function () {
    $this->actingAs(createAdmin())
        ->get(route('admin.users.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('admin/users/create'));
});

it('admin can create a new professional user', function () {
    $admin = createAdmin();

    $this->actingAs($admin)
        ->post(route('admin.users.store'), [
            'name'     => 'Nuevo Profesional',
            'email'    => 'nuevo@clientkosmos.test',
            'password' => 'password123',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('users', ['email' => 'nuevo@clientkosmos.test']);
});

// ── Eliminar usuario ──────────────────────────────────────────────────────────

it('admin can delete a user', function () {
    $admin = createAdmin();
    $professional = createProfessional();

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $professional))
        ->assertRedirect(route('admin.users.index'));

    $this->assertSoftDeleted('users', ['id' => $professional->id]);
});

it('admin cannot delete themselves', function () {
    $admin = createAdmin();

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $admin))
        ->assertSessionHasErrors('delete');

    $this->assertNotSoftDeleted('users', ['id' => $admin->id]);
});
