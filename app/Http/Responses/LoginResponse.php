<?php

namespace App\Http\Responses;

use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Redirect the user after a successful login.
     * Admins go to the admin panel; professionals go to the main dashboard.
     * If onboarding is incomplete, redirect to the onboarding flow.
     */
    public function toResponse($request): RedirectResponse
    {
        $user = auth()->user();

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        if ($user->isProfessional() && ! $user->hasCompletedTutorial()) {
            return redirect()->route('professional.onboarding');
        }

        if ($user->isProfessional()) {
            return redirect()->route('professional.dashboard');
        }

        return redirect()->route('patient.dashboard');
    }
}
