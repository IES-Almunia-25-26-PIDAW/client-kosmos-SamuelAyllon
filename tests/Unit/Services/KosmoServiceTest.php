<?php

declare(strict_types=1);

use App\Models\Appointment;
use App\Models\SessionRecording;
use App\Models\User;
use App\Services\KosmoService;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class)->group('external');

beforeEach(function () {
    $this->withoutVite();
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
    $this->seed(RoleSeeder::class);

    config()->set('services.groq.api_key', 'test-key');
    config()->set('services.groq.base_url', 'https://api.groq.test/openai/v1');
    config()->set('services.groq.model', 'llama-3.3-70b-versatile');

    $this->service = new KosmoService;
});

it('chat returns the assistant message on a successful response', function () {
    Http::fake([
        '*/chat/completions' => Http::response([
            'choices' => [['message' => ['content' => '  Hola, soy Kosmo.  ']]],
        ], 200),
    ]);

    $user = User::factory()->create();

    $reply = $this->service->chat($user, 'Hola');

    expect($reply)->toBe('Hola, soy Kosmo.');
});

it('chat returns a graceful fallback message when Groq fails', function () {
    Http::fake([
        '*/chat/completions' => Http::response(['error' => 'down'], 503),
    ]);

    $user = User::factory()->create();

    $reply = $this->service->chat($user, 'Hola');

    expect($reply)->toContain('No he podido procesar tu mensaje');
});

it('summarizeSession short-circuits when transcription is empty', function () {
    $recording = SessionRecording::factory()->create([
        'appointment_id' => Appointment::factory(),
        'transcription' => '   ',
    ]);

    Http::fake();

    $result = $this->service->summarizeSession($recording);

    expect($result)->toBe([
        'key_points' => [],
        'patient_state' => '',
        'next_actions' => [],
        'raw' => '',
    ]);

    Http::assertNothingSent();
});

it('summarizeSession parses Groq JSON response into structured array', function () {
    $payload = json_encode([
        'key_points' => ['Mejora en sueño', 'Reducción de ansiedad'],
        'patient_state' => 'Estable y receptivo',
        'next_actions' => ['Practicar respiración diafragmática'],
    ]);

    Http::fake([
        '*/chat/completions' => Http::response([
            'choices' => [['message' => ['content' => $payload]]],
        ], 200),
    ]);

    $recording = SessionRecording::factory()->create([
        'appointment_id' => Appointment::factory(),
        'transcription' => 'Sesión completa sobre técnicas de afrontamiento.',
    ]);

    $result = $this->service->summarizeSession($recording);

    expect($result['key_points'])->toBe(['Mejora en sueño', 'Reducción de ansiedad'])
        ->and($result['patient_state'])->toBe('Estable y receptivo')
        ->and($result['next_actions'])->toBe(['Practicar respiración diafragmática'])
        ->and($result['raw'])->toBe($payload);
});

it('summarizeSession throws RuntimeException when Groq fails', function () {
    Http::fake([
        '*/chat/completions' => Http::response('boom', 500),
    ]);

    $recording = SessionRecording::factory()->create([
        'appointment_id' => Appointment::factory(),
        'transcription' => 'Texto válido para resumir.',
    ]);

    expect(fn () => $this->service->summarizeSession($recording))
        ->toThrow(RuntimeException::class, 'Groq summarization failed');
});

it('summarizeSession returns safe defaults when the JSON payload is missing keys', function () {
    Http::fake([
        '*/chat/completions' => Http::response([
            'choices' => [['message' => ['content' => '{"key_points":["solo este"]}']]],
        ], 200),
    ]);

    $recording = SessionRecording::factory()->create([
        'appointment_id' => Appointment::factory(),
        'transcription' => 'Texto válido.',
    ]);

    $result = $this->service->summarizeSession($recording);

    expect($result['key_points'])->toBe(['solo este'])
        ->and($result['patient_state'])->toBe('')
        ->and($result['next_actions'])->toBe([]);
});
