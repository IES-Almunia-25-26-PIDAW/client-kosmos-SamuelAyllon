<?php

namespace App\Http\Controllers\Workspace\Team;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DestroyAction extends Controller
{
    public function __invoke(Request $request, User $user): RedirectResponse
    {
        $workspace = $request->user()->currentWorkspace();

        if ($workspace->creator_id === $user->id) {
            return back()->withErrors(['user' => 'No puedes eliminar al creador del espacio de trabajo.']);
        }

        $workspace->members()->detach($user->id);

        return back()->with('success', 'Miembro eliminado del espacio de trabajo.');
    }
}
