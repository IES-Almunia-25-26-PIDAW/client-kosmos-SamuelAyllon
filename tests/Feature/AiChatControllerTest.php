<?php

use App\Models\AiConversation;

// ── Control de acceso por rol ────────────────────────────────────────────────

it('redirects guests from ai-chats index to login', function () {
    $this->get(route('ai-chats.index'))->assertRedirect(route('login'));
});

it('redirects guests from ai-chats store to login', function () {
    $this->postJson(route('ai-chats.store'))->assertUnauthorized();
});

it('redirects guests from ai-chats destroy to login', function () {
    $this->deleteJson(route('ai-chats.destroy'))->assertUnauthorized();
});

it('free user cannot access ai-chats index', function () {
    $this->actingAs(createFreeUser())
        ->get(route('ai-chats.index'))
        ->assertForbidden();
});

it('free user cannot access ai-chats store', function () {
    $this->actingAs(createFreeUser())
        ->postJson(route('ai-chats.store'), ['message' => 'Hola'])
        ->assertForbidden();
});

it('free user cannot access ai-chats destroy', function () {
    $this->actingAs(createFreeUser())
        ->deleteJson(route('ai-chats.destroy'))
        ->assertForbidden();
});

it('admin cannot access ai-chats index', function () {
    $this->actingAs(createAdmin())
        ->get(route('ai-chats.index'))
        ->assertForbidden();
});

it('admin cannot access ai-chats store', function () {
    $this->actingAs(createAdmin())
        ->postJson(route('ai-chats.store'), ['message' => 'Hola'])
        ->assertForbidden();
});

// ── Premium user puede acceder ──────────────────────────────────────────────

it('premium user can access ai-chats index', function () {
    $this->actingAs(createPremiumUser())
        ->get(route('ai-chats.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('ai-chats/index'));
});

it('premium user sees empty messages array initially', function () {
    $this->actingAs(createPremiumUser())
        ->get(route('ai-chats.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('messages', 0)
        );
});

it('premium user sees their conversation history', function () {
    $user = createPremiumUser();

    AiConversation::addUserMessage($user, 'Hola asistente');
    AiConversation::addAssistantMessage($user, 'Hola, ¿en qué puedo ayudarte?');

    $this->actingAs($user)
        ->get(route('ai-chats.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('messages', 2)
            ->where('messages.0.role', 'user')
            ->where('messages.0.message', 'Hola asistente')
            ->where('messages.1.role', 'assistant')
            ->where('messages.1.message', 'Hola, ¿en qué puedo ayudarte?')
        );
});

it('premium user only sees their own messages', function () {
    $user1 = createPremiumUser();
    $user2 = createPremiumUser();

    AiConversation::addUserMessage($user1, 'Mensaje de usuario 1');
    AiConversation::addUserMessage($user2, 'Mensaje de usuario 2');

    $this->actingAs($user1)
        ->get(route('ai-chats.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('messages', 1)
            ->where('messages.0.message', 'Mensaje de usuario 1')
        );
});

// ── Validación de store ─────────────────────────────────────────────────────

it('ai-chats store requires message', function () {
    $this->actingAs(createPremiumUser())
        ->postJson(route('ai-chats.store'), [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['message']);
});

it('ai-chats store requires non-empty message', function () {
    $this->actingAs(createPremiumUser())
        ->postJson(route('ai-chats.store'), ['message' => ''])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['message']);
});

it('ai-chats store rejects message over 2000 characters', function () {
    $this->actingAs(createPremiumUser())
        ->postJson(route('ai-chats.store'), [
            'message' => str_repeat('a', 2001),
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['message']);
});

// ── Destroy ────────────────────────────────────────────────────────────────

it('premium user can clear their conversation history', function () {
    $user = createPremiumUser();

    AiConversation::addUserMessage($user, 'Mensaje 1');
    AiConversation::addAssistantMessage($user, 'Respuesta 1');
    AiConversation::addUserMessage($user, 'Mensaje 2');

    $this->assertDatabaseCount('ai_conversations', 3);

    $this->actingAs($user)
        ->deleteJson(route('ai-chats.destroy'))
        ->assertOk()
        ->assertJson(['message' => 'Historial eliminado correctamente.']);

    $this->assertDatabaseCount('ai_conversations', 0);
});

it('premium user clearing history does not affect other users', function () {
    $user1 = createPremiumUser();
    $user2 = createPremiumUser();

    AiConversation::addUserMessage($user1, 'Mensaje de usuario 1');
    AiConversation::addUserMessage($user2, 'Mensaje de usuario 2');

    $this->assertDatabaseCount('ai_conversations', 2);

    $this->actingAs($user1)
        ->deleteJson(route('ai-chats.destroy'))
        ->assertOk();

    $this->assertDatabaseCount('ai_conversations', 1);
    $this->assertDatabaseHas('ai_conversations', [
        'user_id' => $user2->id,
        'message' => 'Mensaje de usuario 2',
    ]);
});

// ── Modelo AiConversation ───────────────────────────────────────────────────

it('AiConversation addUserMessage creates user role message', function () {
    $user = createPremiumUser();

    $msg = AiConversation::addUserMessage($user, 'Test message', ['context' => 'test']);

    expect($msg->user_id)->toBe($user->id);
    expect($msg->role)->toBe('user');
    expect($msg->message)->toBe('Test message');
    expect($msg->metadata)->toBe(['context' => 'test']);
    expect($msg->isUserMessage())->toBeTrue();
    expect($msg->isAssistantMessage())->toBeFalse();
});

it('AiConversation addAssistantMessage creates assistant role message', function () {
    $user = createPremiumUser();

    $msg = AiConversation::addAssistantMessage($user, 'AI response', ['tokens_used' => 50]);

    expect($msg->user_id)->toBe($user->id);
    expect($msg->role)->toBe('assistant');
    expect($msg->message)->toBe('AI response');
    expect($msg->metadata)->toBe(['tokens_used' => 50]);
    expect($msg->isUserMessage())->toBeFalse();
    expect($msg->isAssistantMessage())->toBeTrue();
});

it('AiConversation getConversationHistory returns formatted array', function () {
    $user = createPremiumUser();

    AiConversation::addUserMessage($user, 'First message');
    AiConversation::addAssistantMessage($user, 'First response');

    $history = AiConversation::getConversationHistory($user);

    expect($history)->toHaveCount(2);
    expect($history[0]['role'])->toBe('user');
    expect($history[0]['content'])->toBe('First message');
    expect($history[1]['role'])->toBe('assistant');
    expect($history[1]['content'])->toBe('First response');
});
