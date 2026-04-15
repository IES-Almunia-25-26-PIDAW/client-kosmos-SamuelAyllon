<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UpdateRoleAction extends Controller
{
    public function __invoke(Request $request, User $user): RedirectResponse
    {
        $request->validate(['role' => ['required', 'in:admin,professional,patient']]);

        if ($user->id === $request->user()->id) {
            return back()->withErrors(['role' => 'No puedes cambiar tu propio rol.']);
        }

        $user->syncRoles([$request->role]);

        return back()->with('success', "Rol actualizado a {$request->role}.");
    }
}
