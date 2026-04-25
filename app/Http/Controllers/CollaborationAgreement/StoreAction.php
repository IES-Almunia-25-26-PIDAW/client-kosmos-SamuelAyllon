<?php

namespace App\Http\Controllers\CollaborationAgreement;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCollaborationAgreementRequest;
use App\Models\CollaborationAgreement;
use Illuminate\Http\RedirectResponse;

class StoreAction extends Controller
{
    public function __invoke(StoreCollaborationAgreementRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        $alreadyExists = CollaborationAgreement::where('workspace_id', $user->currentWorkspaceId())
            ->where(fn ($q) => $q
                ->where(fn ($q2) => $q2
                    ->where('professional_a_id', $user->id)
                    ->where('professional_b_id', $validated['professional_b_id'])
                )
                ->orWhere(fn ($q2) => $q2
                    ->where('professional_a_id', $validated['professional_b_id'])
                    ->where('professional_b_id', $user->id)
                )
            )
            ->whereIn('status', ['pending', 'active'])
            ->exists();

        if ($alreadyExists) {
            return back()->withErrors(['professional_b_id' => 'Ya existe un acuerdo activo con este profesional.']);
        }

        CollaborationAgreement::create([
            'professional_a_id' => $user->id,
            'professional_b_id' => $validated['professional_b_id'],
            'workspace_id' => $user->currentWorkspaceId(),
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'] ?? null,
            'status' => 'active',
            'terms' => $validated['terms'] ?? null,
        ]);

        return back()->with('success', 'Acuerdo de colaboración creado.');
    }
}
