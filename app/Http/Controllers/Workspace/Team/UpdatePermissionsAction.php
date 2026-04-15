<?php

namespace App\Http\Controllers\Clinic\Team;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UpdatePermissionsAction extends Controller
{
    public function __invoke(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'role'                  => ['required', 'in:professional,receptionist,admin'],
            'can_view_all_patients' => ['boolean'],
        ]);

        $clinic = $request->user()->currentClinic();

        $clinic->users()->updateExistingPivot($user->id, [
            'role'                  => $request->role,
            'can_view_all_patients' => $request->boolean('can_view_all_patients'),
        ]);

        return back()->with('success', 'Permisos actualizados.');
    }
}
