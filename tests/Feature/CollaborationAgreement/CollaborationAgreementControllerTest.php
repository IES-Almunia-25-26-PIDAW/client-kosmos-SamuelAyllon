<?php

use App\Models\CollaborationAgreement;
use App\Models\Workspace;

// ── Acceso por rol ────────────────────────────────────────────────────────────

it('redirects guests from collaborations index to login', function () {
    $this->get(route('professional.workspace.collaborations.index'))->assertRedirect(route('login'));
});

it('professional can view collaborations index', function () {
    $professional = createProfessional();

    $workspace = Workspace::factory()->create([
        'creator_id' => $professional->id,
        'type' => Workspace::TYPE_PERSONAL,
    ]);
    $workspace->members()->attach($professional->id, [
        'role' => 'member',
        'is_active' => true,
        'joined_at' => now(),
    ]);

    $this->actingAs($professional)
        ->get(route('professional.workspace.collaborations.index'))
        ->assertOk();
});

// ── Crear acuerdo ─────────────────────────────────────────────────────────────

it('professional can create a collaboration agreement', function () {
    $professionalA = createProfessional();
    $professionalB = createProfessional();

    $workspace = Workspace::factory()->create([
        'creator_id' => $professionalA->id,
        'type' => Workspace::TYPE_PERSONAL,
    ]);
    $workspace->members()->attach($professionalA->id, [
        'role' => 'member',
        'is_active' => true,
        'joined_at' => now(),
    ]);

    $this->actingAs($professionalA)
        ->post(route('professional.workspace.collaborations.store'), [
            'professional_b_id' => $professionalB->id,
            'start_date' => now()->toDateString(),
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('collaboration_agreements', [
        'professional_a_id' => $professionalA->id,
        'professional_b_id' => $professionalB->id,
        'status' => 'active',
    ]);
});

it('prevents duplicate active collaboration agreements', function () {
    $professionalA = createProfessional();
    $professionalB = createProfessional();

    $workspace = Workspace::factory()->create([
        'creator_id' => $professionalA->id,
        'type' => Workspace::TYPE_PERSONAL,
    ]);
    $workspace->members()->attach($professionalA->id, [
        'role' => 'member',
        'is_active' => true,
        'joined_at' => now(),
    ]);

    CollaborationAgreement::create([
        'professional_a_id' => $professionalA->id,
        'professional_b_id' => $professionalB->id,
        'workspace_id' => $workspace->id,
        'start_date' => now()->toDateString(),
        'status' => 'active',
    ]);

    $this->actingAs($professionalA)
        ->post(route('professional.workspace.collaborations.store'), [
            'professional_b_id' => $professionalB->id,
            'start_date' => now()->toDateString(),
        ])
        ->assertSessionHasErrors('professional_b_id');
});

// ── Cancelar acuerdo ──────────────────────────────────────────────────────────

it('professional can cancel their own collaboration agreement', function () {
    $professionalA = createProfessional();
    $professionalB = createProfessional();

    $workspace = Workspace::factory()->create([
        'creator_id' => $professionalA->id,
        'type' => Workspace::TYPE_PERSONAL,
    ]);

    $agreement = CollaborationAgreement::create([
        'professional_a_id' => $professionalA->id,
        'professional_b_id' => $professionalB->id,
        'workspace_id' => $workspace->id,
        'start_date' => now()->toDateString(),
        'status' => 'active',
    ]);

    $this->actingAs($professionalA)
        ->delete(route('professional.workspace.collaborations.destroy', $agreement))
        ->assertRedirect();

    expect($agreement->fresh()->status)->toBe('cancelled');
});

it('professional cannot cancel an agreement they are not part of', function () {
    $professionalA = createProfessional();
    $professionalB = createProfessional();
    $stranger = createProfessional();

    $workspace = Workspace::factory()->create(['creator_id' => $professionalA->id]);

    $agreement = CollaborationAgreement::create([
        'professional_a_id' => $professionalA->id,
        'professional_b_id' => $professionalB->id,
        'workspace_id' => $workspace->id,
        'start_date' => now()->toDateString(),
        'status' => 'active',
    ]);

    $this->actingAs($stranger)
        ->delete(route('professional.workspace.collaborations.destroy', $agreement))
        ->assertForbidden();
});
