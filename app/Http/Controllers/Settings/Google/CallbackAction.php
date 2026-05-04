<?php

namespace App\Http\Controllers\Settings\Google;

use App\Http\Controllers\Controller;
use App\Services\GoogleCalendarService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CallbackAction extends Controller
{
    public function __invoke(Request $request, GoogleCalendarService $google): RedirectResponse
    {
        $expectedState = $request->session()->pull('google_oauth_state');
        $providedState = (string) $request->query('state', '');

        if ($expectedState === null || ! hash_equals((string) $expectedState, $providedState)) {
            return redirect()->route('settings.google.edit')
                ->withErrors(['google' => 'La verificación de estado falló. Inténtalo de nuevo.']);
        }

        if ($request->query('error') !== null) {
            return redirect()->route('settings.google.edit')
                ->withErrors(['google' => 'Google rechazó la conexión: '.$request->query('error')]);
        }

        $code = $request->query('code');

        if ($code === null) {
            return redirect()->route('settings.google.edit')
                ->withErrors(['google' => 'No se recibió código de autorización de Google.']);
        }

        try {
            $refreshToken = $google->exchangeCode((string) $code);
        } catch (\RuntimeException $e) {
            return redirect()->route('settings.google.edit')
                ->withErrors(['google' => $e->getMessage()]);
        }

        $request->user()->update(['google_refresh_token' => $refreshToken]);

        return redirect()->route('settings.google.edit')
            ->with('success', 'Cuenta Google conectada correctamente.');
    }
}
