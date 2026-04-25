<?php

namespace App\Http\Controllers\CollaborationAgreement;

use App\Http\Controllers\Controller;
use App\Models\CollaborationAgreement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DestroyAction extends Controller
{
    public function __invoke(Request $request, CollaborationAgreement $collaboration): RedirectResponse
    {
        $user = $request->user();

        abort_unless(
            $collaboration->professional_a_id === $user->id || $collaboration->professional_b_id === $user->id,
            403
        );

        $collaboration->update(['status' => 'cancelled']);

        return back()->with('success', 'Acuerdo de colaboración cancelado.');
    }
}
