<?php

use App\Models\Project;
use App\Models\Task;

it('redirects guests to login', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

it('authenticated user can visit dashboard', function () {
    $user = createFreeUser();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('dashboard'));
});

it('dashboard returns todayTasks, activeProjects, atRiskProjects and subscription', function () {
    $user = createFreeUser();
    $project = Project::factory()->create(['user_id' => $user->id, 'status' => 'active']);

    Task::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'status' => 'pending',
        'priority' => 'high',
        'due_date' => now()->toDateString(),
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('todayTasks', 1)
            ->has('activeProjects', 1)
            ->has('subscription')
        );
});

it('free user sees active projects on dashboard', function () {
    $user = createFreeUser();
    Project::factory()->create(['user_id' => $user->id, 'status' => 'active']);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page->has('activeProjects', 1));
});
