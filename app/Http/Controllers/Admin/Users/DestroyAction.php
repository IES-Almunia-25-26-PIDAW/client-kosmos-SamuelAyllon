<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class DestroyAction extends Controller
{
    public function __invoke(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return back()->withErrors(['delete' => 'No puedes eliminarte a ti mismo.']);
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', "Usuario {$user->name} eliminado correctamente.");
    }
}
