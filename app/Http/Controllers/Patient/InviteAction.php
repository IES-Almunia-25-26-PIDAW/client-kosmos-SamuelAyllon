<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\PatientProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class InviteAction extends Controller
{
    public function __invoke(Request $request, PatientProfile $patient): RedirectResponse
    {
        $this->authorize('update', $patient);

        // @todo Dispatch portal invitation email with signed URL
        // Mail::to($patient->email)->send(new PatientPortalInvitation($patient));

        return back()->with('success', 'Invitación al portal enviada.');
    }
}
