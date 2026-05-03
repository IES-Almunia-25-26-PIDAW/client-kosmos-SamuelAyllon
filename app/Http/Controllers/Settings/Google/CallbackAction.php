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
        $code = $request->query('code');

        if ($code === null) {
            return redirect()->route('profile.edit')
                ->withErrors(['google' => 'No se recibió código de autorización de Google.']);
        }

        $refreshToken = $google->exchangeCode((string) $code);

        $request->user()->update(['google_refresh_token' => $refreshToken]);

        return redirect()->route('profile.edit')
            ->with('success', 'Cuenta Google conectada correctamente.');
    }
}
