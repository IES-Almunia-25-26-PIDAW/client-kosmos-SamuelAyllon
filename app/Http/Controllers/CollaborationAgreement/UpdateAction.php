<?php

namespace App\Http\Controllers\CollaborationAgreement;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateCollaborationAgreementRequest;
use App\Models\CollaborationAgreement;
use Illuminate\Http\RedirectResponse;

class UpdateAction extends Controller
{
    public function __invoke(UpdateCollaborationAgreementRequest $request, CollaborationAgreement $collaboration): RedirectResponse
    {
        $user = $request->user();

        abort_unless(
            $collaboration->professional_a_id === $user->id || $collaboration->professional_b_id === $user->id,
            403
        );

        $collaboration->update($request->validated());

        return back()->with('success', 'Acuerdo de colaboración actualizado.');
    }
}
