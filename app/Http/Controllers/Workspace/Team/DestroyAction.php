<?php

namespace App\Http\Controllers\Workspace\Team;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DestroyAction extends Controller
{
    public function __invoke(Request $request, Workspace $workspace, User $user): RedirectResponse
    {
        $current = $request->user();

        $isMember = $workspace->creator_id === $current->id
            || $workspace->members()->where('users.id', $current->id)->exists();

        if (! $isMember) {
            throw new NotFoundHttpException;
        }

        if ($workspace->creator_id === $user->id) {
            return back()->withErrors(['user' => 'No puedes eliminar al creador del espacio de trabajo.']);
        }

        $workspace->members()->detach($user->id);

        return back()->with('success', 'Miembro eliminado del espacio de trabajo.');
    }
}
