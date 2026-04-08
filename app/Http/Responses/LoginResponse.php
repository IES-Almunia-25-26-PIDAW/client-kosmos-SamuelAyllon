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
            return redirect()->route('admin.users.index');
        }

        if (! $user->hasCompletedTutorial()) {
            return redirect()->route('onboarding');
        }

        return redirect()->route('dashboard');
    }
}
