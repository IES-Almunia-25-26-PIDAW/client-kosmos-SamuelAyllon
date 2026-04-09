<?php

namespace App\Http\Controllers\Onboarding;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        if ($request->user()->hasCompletedTutorial()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('onboarding');
    }
}
