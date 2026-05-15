<?php

namespace App\Http\Controllers\Auth\Google;

use App\Http\Controllers\Controller;
use App\Services\GoogleAuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RedirectAction extends Controller
{
    public function __invoke(Request $request, GoogleAuthService $google): RedirectResponse
    {
        $validated = $request->validate([
            'intent' => ['nullable', 'in:login,register'],
            'type' => ['nullable', 'in:professional,patient'],
        ]);

        $intent = $validated['intent'] ?? 'login';
        $type = $validated['type'] ?? null;

        if ($intent === 'register' && $type === null) {
            return redirect()->route('register')
                ->withErrors(['google' => 'Selecciona si te registras como profesional o paciente.']);
        }

        $state = Str::random(40);

        session([
            'google_oauth' => [
                'state' => $state,
                'intent' => $intent,
                'type' => $type,
            ],
        ]);

        return redirect()->away($google->createAuthUrl($state));
    }
}
