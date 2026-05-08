<?php

namespace App\Http\Controllers\Workspace\Patient;

use App\Http\Controllers\Controller;
use App\Models\CaseAssignment;
use App\Models\PatientProfile;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ShareAction extends Controller
{
    public function __invoke(Request $request, Workspace $workspace, User $patient): RedirectResponse
    {
        $current = $request->user();

        $isMember = $workspace->creator_id === $current->id
            || $workspace->members()->where('users.id', $current->id)->exists();

        if (! $isMember || ! $workspace->isCollaborative()) {
            throw new NotFoundHttpException;
        }

        $owns = PatientProfile::query()
            ->where('professional_id', $current->id)
            ->where('user_id', $patient->id)
            ->exists();

        if (! $owns) {
            throw new NotFoundHttpException;
        }

        CaseAssignment::firstOrCreate(
            [
                'patient_id' => $patient->id,
                'professional_id' => $current->id,
                'workspace_id' => $workspace->id,
            ],
            [
                'role' => 'secondary',
                'status' => 'active',
                'started_at' => now(),
            ],
        );

        return back()->with('success', 'Paciente compartido en el workspace.');
    }
}
