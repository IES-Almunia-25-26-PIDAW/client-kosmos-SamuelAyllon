<?php

namespace App\Http\Controllers\Onboarding;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class StoreAction extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $request->user()->completeTutorial();

        return redirect()->route('professional.dashboard')
            ->with('success', 'Todo listo. Kosmo te acompañará en cada sesión.');
    }
}
