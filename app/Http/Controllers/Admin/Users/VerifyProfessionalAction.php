<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class VerifyProfessionalAction extends Controller
{
    public function __invoke(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'string', 'in:verified,rejected,pending,unverified'],
        ]);

        abort_if($user->professionalProfile === null, 422, 'El usuario no tiene perfil profesional.');

        $user->professionalProfile->update([
            'verification_status' => $data['status'],
            'verified_at' => $data['status'] === 'verified' ? now() : null,
        ]);

        return back()->with('success', 'Estado de verificación actualizado.');
    }
}
