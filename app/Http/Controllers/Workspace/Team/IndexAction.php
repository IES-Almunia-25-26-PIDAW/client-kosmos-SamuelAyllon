<?php

namespace App\Http\Controllers\Workspace\Team;

use App\Http\Controllers\Controller;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $workspaces = Workspace::query()
            ->where('type', Workspace::TYPE_COLLABORATIVE)
            ->where(function ($query) use ($user) {
                $query->where('creator_id', $user->id)
                    ->orWhereHas('members', fn ($q) => $q->where('users.id', $user->id));
            })
            ->withCount('members')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Workspace $w) => [
                'id' => $w->id,
                'name' => $w->name,
                'description' => $w->settings['description'] ?? null,
                'members_count' => $w->members_count,
                'is_owner' => $w->creator_id === $user->id,
                'created_at' => $w->created_at?->toIso8601String(),
            ]);

        return Inertia::render('professional/workspace/team/index', [
            'workspaces' => $workspaces,
        ]);
    }
}
