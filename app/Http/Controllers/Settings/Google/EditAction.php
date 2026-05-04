<?php

namespace App\Http\Controllers\Settings\Google;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EditAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        return Inertia::render('settings/google', [
            'connected' => $request->user()->google_refresh_token !== null,
        ]);
    }
}
