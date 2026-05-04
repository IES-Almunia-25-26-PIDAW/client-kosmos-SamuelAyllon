<?php

namespace App\Http\Controllers\Settings\Google;

use App\Http\Controllers\Controller;
use App\Services\GoogleCalendarService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RedirectAction extends Controller
{
    public function __invoke(Request $request, GoogleCalendarService $google): RedirectResponse
    {
        $state = Str::random(40);
        $request->session()->put('google_oauth_state', $state);

        return redirect($google->getAuthorizationUrl($state));
    }
}
