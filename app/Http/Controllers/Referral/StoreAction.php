<?php

namespace App\Http\Controllers\Referral;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReferralRequest;
use App\Models\PatientProfile;
use App\Models\Referral;
use Illuminate\Http\RedirectResponse;

class StoreAction extends Controller
{
    public function __invoke(StoreReferralRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $patient = PatientProfile::findOrFail($validated['patient_id']);

        // Ensure the patient belongs to the authenticated professional's workspace.
        abort_unless(
            $patient->workspace_id === $request->user()->currentWorkspaceId()
            || $patient->professional_id === $request->user()->id,
            403
        );

        Referral::create([
            'from_professional_id' => $request->user()->id,
            'to_professional_id' => $validated['to_professional_id'],
            'patient_id' => $patient->id,
            'reason' => $validated['reason'] ?? null,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Derivación enviada correctamente.');
    }
}
