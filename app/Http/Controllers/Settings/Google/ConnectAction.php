<?php

namespace App\Http\Controllers\Settings\Google;

use App\Http\Controllers\Controller;
use App\Services\GoogleCalendarService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ConnectAction extends Controller
{
    public function __invoke(Request $request, GoogleCalendarService $google): RedirectResponse
    {
        return redirect($google->getAuthorizationUrl());
    }
}
