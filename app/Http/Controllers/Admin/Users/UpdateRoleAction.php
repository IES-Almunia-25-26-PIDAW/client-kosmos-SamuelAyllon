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
        $request->validate(['role' => ['required', 'in:professional,admin']]);

        if ($user->id === $request->user()->id) {
            return back()->withErrors(['role' => 'No puedes cambiar tu propio rol.']);
        }

        $user->update(['role' => $request->role]);

        if ($request->role === 'professional') {
            $user->syncRoles(['professional']);
        } else {
            $user->syncRoles(['admin']);
        }

        return back()->with('success', "Rol actualizado a {$request->role}.");
    }
}
