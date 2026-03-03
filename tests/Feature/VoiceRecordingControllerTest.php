<?php

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

// ── Control de acceso por rol ────────────────────────────────────────────────

it('redirects guests from voice transcribe to login', function () {
    $this->postJson(route('voice.transcribe'))->assertUnauthorized();
});

it('free user cannot access voice transcribe', function () {
    $this->actingAs(createFreeUser())
        ->postJson(route('voice.transcribe'))
        ->assertForbidden();
});

it('admin cannot access voice transcribe', function () {
    $this->actingAs(createAdmin())
        ->postJson(route('voice.transcribe'))
        ->assertForbidden();
});

// ── Validación ──────────────────────────────────────────────────────────────

it('voice transcribe requires audio file', function () {
    $this->actingAs(createPremiumUser())
        ->postJson(route('voice.transcribe'), [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['audio']);
});

it('voice transcribe rejects invalid mime type', function () {
    Storage::fake('local');

    $this->actingAs(createPremiumUser())
        ->postJson(route('voice.transcribe'), [
            'audio' => UploadedFile::fake()->create('file.txt', 10, 'text/plain'),
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['audio']);
});

// ── Idea con source voice ───────────────────────────────────────────────────

it('idea store accepts voice source', function () {
    $user = createFreeUser();

    $this->actingAs($user)
        ->post(route('ideas.store'), [
            'name' => 'Idea por voz',
            'priority' => 'high',
            'source' => 'voice',
        ])
        ->assertRedirect(route('ideas.index'));

    $this->assertDatabaseHas('ideas', [
        'user_id' => $user->id,
        'name' => 'Idea por voz',
        'source' => 'voice',
    ]);
});

it('idea store defaults source to manual when not provided', function () {
    $user = createFreeUser();

    $this->actingAs($user)
        ->post(route('ideas.store'), [
            'name' => 'Idea normal',
            'priority' => 'low',
        ])
        ->assertRedirect(route('ideas.index'));

    $this->assertDatabaseHas('ideas', [
        'user_id' => $user->id,
        'name' => 'Idea normal',
        'source' => 'manual',
    ]);
});
