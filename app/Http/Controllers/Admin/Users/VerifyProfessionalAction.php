<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\ProfessionalApprovedNotification;
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

        $previousStatus = $user->professionalProfile->verification_status;

        $user->professionalProfile->update([
            'verification_status' => $data['status'],
            'verified_at' => $data['status'] === 'verified' ? now() : null,
        ]);

        if ($data['status'] === 'verified' && $previousStatus !== 'verified') {
            $user->notify(new ProfessionalApprovedNotification);
        }

        return back()->with('success', 'Estado de verificación actualizado.');
    }
}
