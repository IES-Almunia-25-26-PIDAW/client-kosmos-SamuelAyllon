<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DestroyAction extends Controller
{
    public function __invoke(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return back()->withErrors(['delete' => 'No puedes eliminarte a ti mismo.']);
        }

        // Renombrar email/google_id antes del soft-delete para liberar los
        // índices unique a nivel BD y permitir que el mismo email/cuenta de
        // Google se reutilice en un registro futuro. La fila permanece en
        // papelera para auditoría.
        DB::transaction(function () use ($user): void {
            $suffix = 'del_'.now()->timestamp.'_'.Str::random(6).'_';

            $user->forceFill([
                'email' => $suffix.$user->email,
                'google_id' => $user->google_id !== null ? $suffix.$user->google_id : null,
            ])->save();

            $user->delete();
        });

        return redirect()->route('admin.dashboard')
            ->with('success', "Usuario {$user->name} eliminado correctamente.");
    }
}
