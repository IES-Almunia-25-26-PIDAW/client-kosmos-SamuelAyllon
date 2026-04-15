<?php

namespace App\Http\Controllers\Clinic\Team;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class InviteAction extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'role'  => ['required', 'in:professional,receptionist,admin'],
        ]);

        $clinic = $request->user()->currentClinic();

        $user = User::firstOrCreate(
            ['email' => $request->email],
            [
                'name'     => $request->email,
                'password' => Hash::make(Str::random(16)),
            ],
        );

        $clinic->users()->syncWithoutDetaching([
            $user->id => [
                'role'                  => $request->role,
                'can_view_all_patients' => false,
                'joined_at'             => now(),
                'is_active'             => true,
            ],
        ]);

        // @todo Dispatch invitation email notification

        return back()->with('success', 'Invitación enviada.');
    }
}
