<?php

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Exception\TransportException;

beforeEach(function () {
    Config::set('mail.default', 'brevo');
    Config::set('mail.mailers.brevo', [
        'transport' => 'brevo',
        'key' => 'test-api-key',
    ]);
    Config::set('services.brevo.key', 'test-api-key');
    Config::set('mail.from', [
        'address' => 'sender@example.com',
        'name' => 'ClientKosmos',
    ]);
});

it('sends an email via Brevo HTTP API with correct payload and headers', function () {
    Mail::forgetMailers();

    Http::preventStrayRequests();
    Http::fake([
        'api.brevo.com/v3/smtp/email' => Http::response(['messageId' => '<abc@brevo>'], 201),
    ]);

    Mail::raw('Hola desde el test', function ($m) {
        $m->to('dest@example.com', 'Destino')
            ->subject('Test Brevo');
    });

    Http::assertSent(function ($request) {
        $payload = $request->data();

        return $request->method() === 'POST'
            && $request->url() === 'https://api.brevo.com/v3/smtp/email'
            && $request->header('api-key') === ['test-api-key']
            && $payload['sender']['email'] === 'sender@example.com'
            && $payload['to'][0]['email'] === 'dest@example.com'
            && $payload['subject'] === 'Test Brevo'
            && str_contains($payload['textContent'] ?? '', 'Hola desde el test');
    });
});

it('throws when Brevo API responds with an error', function () {
    Mail::forgetMailers();

    Http::preventStrayRequests();
    Http::fake([
        'api.brevo.com/v3/smtp/email' => Http::response([
            'code' => 'unauthorized',
            'message' => 'API key is invalid',
        ], 401),
    ]);

    expect(fn () => Mail::raw('test', fn ($m) => $m->to('x@y.com')->subject('x')))
        ->toThrow(TransportException::class);
});
