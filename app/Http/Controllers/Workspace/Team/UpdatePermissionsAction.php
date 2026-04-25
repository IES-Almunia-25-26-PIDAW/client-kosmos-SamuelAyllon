<?php

namespace App\Http\Controllers\Workspace\Team;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UpdatePermissionsAction extends Controller
{
    public function __invoke(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'role' => ['required', 'in:member,billing_manager'],
        ]);

        $workspace = $request->user()->currentWorkspace();

        $workspace->members()->updateExistingPivot($user->id, [
            'role' => $request->role,
        ]);

        return back()->with('success', 'Permisos actualizados.');
    }
}
