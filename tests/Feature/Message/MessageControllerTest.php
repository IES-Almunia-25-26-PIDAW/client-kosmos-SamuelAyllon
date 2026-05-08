<?php

use App\Models\Message;
use App\Models\User;
use App\Models\Workspace;

// ── Acceso por rol ────────────────────────────────────────────────────────────

it('redirects guests from messages index to login', function () {
    $this->get(route('professional.messages.index'))->assertRedirect(route('login'));
});

it('professional can view messages index', function () {
    $this->actingAs(createProfessional())
        ->get(route('professional.messages.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('professional/messages/index'));
});

it('professional can view conversation with another user', function () {
    $sender = createProfessional();
    $recipient = createProfessional();

    Message::create([
        'workspace_id' => null,
        'sender_id' => $sender->id,
        'receiver_id' => $recipient->id,
        'body' => 'Hola, ¿cómo estás?',
    ]);

    $this->actingAs($sender)
        ->get(route('professional.messages.conversation', $recipient))
        ->assertOk();
});

it('viewing conversation marks received messages as read', function () {
    $sender = createProfessional();
    $recipient = createProfessional();

    $message = Message::create([
        'workspace_id' => null,
        'sender_id' => $sender->id,
        'receiver_id' => $recipient->id,
        'body' => 'Mensaje no leído.',
        'read_at' => null,
    ]);

    $this->actingAs($recipient)
        ->get(route('professional.messages.conversation', $sender));

    expect($message->fresh()->read_at)->not->toBeNull();
});

// ── Envío de mensaje ──────────────────────────────────────────────────────────

it('professional can send a message', function () {
    $sender = createProfessional();
    $recipient = createProfessional();

    $workspace = Workspace::factory()->create([
        'creator_id' => $sender->id,
        'type' => Workspace::TYPE_PERSONAL,
    ]);
    $workspace->members()->attach($sender->id, [
        'role' => 'member',
        'is_active' => true,
        'joined_at' => now(),
    ]);

    $this->actingAs($sender)
        ->post(route('professional.messages.store'), [
            'receiver_id' => $recipient->id,
            'body' => 'Mensaje de prueba.',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('messages', [
        'sender_id' => $sender->id,
        'receiver_id' => $recipient->id,
        'body' => 'Mensaje de prueba.',
    ]);
});

it('message store fails when professional has no workspace', function () {
    $sender = createProfessional();
    $recipient = createProfessional();

    $this->actingAs($sender)
        ->post(route('professional.messages.store'), [
            'receiver_id' => $recipient->id,
            'body' => 'Sin clínica activa.',
        ])
        ->assertStatus(422);
});

it('message store requires body', function () {
    $sender = createProfessional();
    $recipient = createProfessional();

    $this->actingAs($sender)
        ->post(route('professional.messages.store'), [
            'receiver_id' => $recipient->id,
        ])
        ->assertSessionHasErrors('body');
});
