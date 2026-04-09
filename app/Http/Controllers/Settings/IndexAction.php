<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        return Inertia::render('settings/index', [
            'user' => $request->user(),
        ]);
    }
}
