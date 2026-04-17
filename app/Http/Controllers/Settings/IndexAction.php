<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        if ($request->user()->isAdmin()) {
            return redirect()->route('profile.edit');
        }

        return Inertia::render('settings/index', [
            'user' => $request->user(),
        ]);
    }
}
