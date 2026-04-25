<?php

namespace App\Http\Controllers\CollaborationAgreement;

use App\Http\Controllers\Controller;
use App\Models\CollaborationAgreement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $agreements = CollaborationAgreement::forProfessional($user->id)
            ->where('workspace_id', $user->currentWorkspaceId())
            ->with(['professionalA', 'professionalB'])
            ->latest()
            ->get();

        return Inertia::render('professional/workspace/collaborations/index', [
            'agreements' => $agreements,
        ]);
    }
}
