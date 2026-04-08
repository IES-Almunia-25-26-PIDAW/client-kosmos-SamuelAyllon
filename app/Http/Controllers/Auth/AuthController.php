<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Authenticate the user via Fortify.
     *
     * Returns the User if credentials are valid and the user has a valid role,
     * or null to let Fortify reject the login attempt.
     */
    public function authenticate(Request $request): ?User
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return null;
        }

        // Block login if user has no valid role
        if (! in_array($user->role, ['professional', 'admin'])) {
            return null;
        }

        return $user;
    }
}
