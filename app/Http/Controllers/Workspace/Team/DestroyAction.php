<?php

namespace App\Http\Controllers\Clinic\Team;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DestroyAction extends Controller
{
    public function __invoke(Request $request, User $user): RedirectResponse
    {
        $clinic = $request->user()->currentClinic();

        if ($clinic->owner_id === $user->id) {
            return back()->withErrors(['user' => 'No puedes eliminar al propietario de la clínica.']);
        }

        $clinic->users()->detach($user->id);

        return back()->with('success', 'Miembro eliminado del equipo.');
    }
}
