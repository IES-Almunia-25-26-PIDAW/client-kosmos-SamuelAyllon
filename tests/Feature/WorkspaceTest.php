<?php

use App\Models\ProfessionalProfile;
use App\Models\User;
use App\Models\Workspace;

it('onboarding always creates a personal workspace for a fresh professional', function () {
    $user = User::factory()->create(['tutorial_completed_at' => null]);
    ensureRolesExist();
    $user->assignRole('professional');
    ProfessionalProfile::factory()->verified()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post(route('professional.onboarding'))
        ->assertRedirect(route('professional.dashboard'));

    $workspace = $user->createdWorkspaces()->first();

    expect($workspace)->not->toBeNull();
    expect($workspace->isPersonal())->toBeTrue();
});

it('onboarding does not duplicate workspace if professional already has one', function () {
    $user = createProfessional();

    Workspace::factory()->create([
        'creator_id' => $user->id,
        'type' => Workspace::TYPE_PERSONAL,
    ]);

    $this->actingAs($user)
        ->post(route('professional.onboarding'))
        ->assertRedirect(route('professional.dashboard'));

    expect($user->createdWorkspaces()->count())->toBe(1);
});

it('rejects invitation to a personal workspace', function () {
    $user = createProfessional();

    $workspace = Workspace::factory()->create([
        'creator_id' => $user->id,
        'type' => Workspace::TYPE_PERSONAL,
    ]);
    $workspace->members()->attach($user->id, [
        'role' => 'member',
        'is_active' => true,
        'joined_at' => now(),
    ]);

    $this->actingAs($user)
        ->post(route('professional.workspace.team.invite', ['workspace' => $workspace->id]), [
            'email' => 'guest@example.com',
            'role' => 'member',
        ])
        ->assertSessionHasErrors('email');

    expect($workspace->members()->count())->toBe(1);
});

it('professional can create a collaborative workspace', function () {
    $user = createProfessional();

    $this->actingAs($user)
        ->post(route('professional.workspace.collaborative.store'), [
            'name' => 'Clínica Centro',
            'description' => 'Workspace para sesiones grupales',
        ])
        ->assertRedirect();

    $workspace = Workspace::where('creator_id', $user->id)
        ->where('type', Workspace::TYPE_COLLABORATIVE)
        ->first();

    expect($workspace)->not->toBeNull();
    expect($workspace->name)->toBe('Clínica Centro');
    expect($workspace->isCollaborative())->toBeTrue();
    expect($workspace->members()->where('users.id', $user->id)->exists())->toBeTrue();
    expect(session('current_workspace_id'))->toBe($workspace->id);
});
