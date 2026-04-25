<?php

namespace App\Http\Controllers\Referral;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateReferralRequest;
use App\Models\Referral;
use Illuminate\Http\RedirectResponse;

class UpdateAction extends Controller
{
    public function __invoke(UpdateReferralRequest $request, Referral $referral): RedirectResponse
    {
        // Only the receiving professional can accept or reject.
        abort_unless($referral->to_professional_id === $request->user()->id, 403);
        abort_unless($referral->status === 'pending', 403);

        $referral->update([
            'status' => $request->validated('status'),
            'responded_at' => now(),
        ]);

        $message = match ($request->validated('status')) {
            'accepted' => 'Derivación aceptada.',
            'rejected' => 'Derivación rechazada.',
            default => 'Derivación actualizada.',
        };

        return back()->with('success', $message);
    }
}
