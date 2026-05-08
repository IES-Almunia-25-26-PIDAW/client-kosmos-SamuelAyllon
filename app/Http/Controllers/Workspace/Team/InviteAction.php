<?php

namespace App\Http\Controllers\Workspace\Team;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class InviteAction extends Controller
{
    public function __invoke(Request $request, Workspace $workspace): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'role' => ['nullable', 'in:member,billing_manager'],
        ]);

        $user = $request->user();

        $isMember = $workspace->creator_id === $user->id
            || $workspace->members()->where('users.id', $user->id)->exists();

        if (! $isMember) {
            throw new NotFoundHttpException;
        }

        if ($workspace->isPersonal()) {
            throw ValidationException::withMessages([
                'email' => 'No puedes invitar colaboradores a un workspace personal.',
            ]);
        }

        $invited = User::firstOrCreate(
            ['email' => $request->email],
            [
                'name' => $request->email,
                'password' => Hash::make(Str::random(16)),
            ],
        );

        $workspace->members()->syncWithoutDetaching([
            $invited->id => [
                'role' => $request->input('role', 'member'),
                'joined_at' => now(),
                'is_active' => true,
            ],
        ]);

        // @todo Dispatch invitation email notification

        return back()->with('success', 'Invitación enviada.');
    }
}
