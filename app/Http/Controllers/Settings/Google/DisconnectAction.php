<?php

namespace App\Http\Controllers\Settings\Google;

use App\Http\Controllers\Controller;
use App\Services\GoogleCalendarService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DisconnectAction extends Controller
{
    public function __invoke(Request $request, GoogleCalendarService $google): RedirectResponse
    {
        $user = $request->user();
        $token = $user->google_refresh_token;

        if ($token !== null) {
            $google->revoke($token);
        }

        $user->update(['google_refresh_token' => null]);

        return redirect()->route('settings.google.edit')
            ->with('success', 'Cuenta Google desconectada.');
    }
}
