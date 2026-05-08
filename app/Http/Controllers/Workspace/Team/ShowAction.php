<?php

namespace App\Http\Controllers\Workspace\Team;

use App\Http\Controllers\Controller;
use App\Models\CaseAssignment;
use App\Models\PatientProfile;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ShowAction extends Controller
{
    public function __invoke(Request $request, Workspace $workspace): Response
    {
        $user = $request->user();

        $isMember = $workspace->creator_id === $user->id
            || $workspace->members()->where('users.id', $user->id)->exists();

        if (! $isMember || ! $workspace->isCollaborative()) {
            throw new NotFoundHttpException;
        }

        $members = $workspace->members()
            ->withPivot(['role', 'joined_at', 'is_active'])
            ->get()
            ->map(function (User $m): array {
                /** @var \Illuminate\Database\Eloquent\Relations\Pivot $pivot */
                $pivot = $m->getRelation('pivot');

                return [
                    'id' => $m->id,
                    'name' => $m->name,
                    'email' => $m->email,
                    'avatar_path' => $m->avatar_path,
                    'pivot' => [
                        'role' => $pivot->getAttribute('role'),
                        'joined_at' => $pivot->getAttribute('joined_at'),
                        'is_active' => (bool) $pivot->getAttribute('is_active'),
                    ],
                ];
            });

        $sharedPatientUserIds = CaseAssignment::query()
            ->where('workspace_id', $workspace->id)
            ->where('professional_id', $user->id)
            ->pluck('patient_id')
            ->all();

        $allPatients = PatientProfile::query()
            ->where('professional_id', $user->id)
            ->with('user:id,name,email,avatar_path')
            ->get()
            ->map(fn (PatientProfile $p) => [
                'id' => $p->user_id,
                'name' => $p->user->name,
                'email' => $p->user->email,
                'avatar_path' => $p->user->avatar_path,
                'is_shared' => in_array($p->user_id, $sharedPatientUserIds, true),
            ])
            ->values();

        return Inertia::render('professional/workspace/team/show', [
            'workspace' => [
                'id' => $workspace->id,
                'name' => $workspace->name,
                'description' => $workspace->settings['description'] ?? null,
                'is_owner' => $workspace->creator_id === $user->id,
            ],
            'members' => $members,
            'patients' => $allPatients,
        ]);
    }
}
