<?php

namespace App\Http\Controllers\Referral;

use App\Http\Controllers\Controller;
use App\Models\Referral;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DestroyAction extends Controller
{
    public function __invoke(Request $request, Referral $referral): RedirectResponse
    {
        // Only the sending professional can cancel a pending referral.
        abort_unless($referral->from_professional_id === $request->user()->id, 403);
        abort_unless($referral->status === 'pending', 403);

        $referral->update(['status' => 'cancelled']);

        return back()->with('success', 'Derivación cancelada.');
    }
}
