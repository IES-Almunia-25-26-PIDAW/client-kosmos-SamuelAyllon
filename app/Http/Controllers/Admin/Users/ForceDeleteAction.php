<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class ForceDeleteAction extends Controller
{
    public function __invoke(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return back()->withErrors(['force_delete' => 'No puedes eliminarte a ti mismo.']);
        }

        if ($user->deleted_at === null) {
            return back()->withErrors(['force_delete' => 'Solo se pueden eliminar de forma permanente usuarios que ya están en la papelera.']);
        }

        $user->forceDelete();

        return redirect()->route('admin.users.trash')
            ->with('success', "Usuario {$user->name} eliminado de forma permanente.");
    }
}
