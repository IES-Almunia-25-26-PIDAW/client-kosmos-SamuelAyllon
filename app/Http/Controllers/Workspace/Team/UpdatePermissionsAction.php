<?php

namespace App\Http\Controllers\Workspace\Team;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class UpdatePermissionsAction extends Controller
{
    public function __invoke(Request $request, Workspace $workspace, User $user): RedirectResponse
    {
        $request->validate([
            'role' => ['required', 'in:member,billing_manager'],
        ]);

        $current = $request->user();

        $isMember = $workspace->creator_id === $current->id
            || $workspace->members()->where('users.id', $current->id)->exists();

        if (! $isMember) {
            throw new NotFoundHttpException;
        }

        $workspace->members()->updateExistingPivot($user->id, [
            'role' => $request->role,
        ]);

        return back()->with('success', 'Permisos actualizados.');
    }
}
