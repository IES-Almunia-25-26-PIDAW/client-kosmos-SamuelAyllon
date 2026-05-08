<?php

namespace App\Http\Controllers\Workspace\Patient;

use App\Http\Controllers\Controller;
use App\Models\CaseAssignment;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class UnshareAction extends Controller
{
    public function __invoke(Request $request, Workspace $workspace, User $patient): RedirectResponse
    {
        $current = $request->user();

        $isMember = $workspace->creator_id === $current->id
            || $workspace->members()->where('users.id', $current->id)->exists();

        if (! $isMember) {
            throw new NotFoundHttpException;
        }

        CaseAssignment::query()
            ->where('workspace_id', $workspace->id)
            ->where('professional_id', $current->id)
            ->where('patient_id', $patient->id)
            ->delete();

        return back()->with('success', 'Paciente retirado del workspace.');
    }
}
