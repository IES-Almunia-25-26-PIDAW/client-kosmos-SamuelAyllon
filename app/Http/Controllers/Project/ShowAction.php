<?php

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ShowAction extends Controller
{
    public function __invoke(Project $project): Response
    {
        $this->authorize('view', $project);

        $user = Auth::user();
        $isPremium = $user->isPremiumUser() || $user->isAdmin();

        // Timeline: últimas 5 completadas + próximas 3 pendientes
        $recentCompleted = $project->tasks()
            ->where('status', 'completed')
            ->orderBy('completed_at', 'desc')
            ->limit(5)
            ->get();

        $upcomingPending = $project->tasks()
            ->where('status', 'pending')
            ->orderBy('due_date', 'asc')
            ->orderByRaw("CASE priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 WHEN 'low' THEN 2 END")
            ->limit(3)
            ->get();

        // Notas/ideas vinculadas
        $ideas = $project->ideas()
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->get();

        // Recursos (solo premium)
        $resources = $isPremium
            ? $project->resources()->orderBy('created_at', 'desc')->get()
            : collect();

        // Datos para el header de contexto rápido
        $contextHeader = [
            'pending_tasks_count' => $project->tasks()->where('status', 'pending')->count(),
            'high_priority_count' => $project->tasks()->where('status', 'pending')->where('priority', 'high')->count(),
            'overdue_tasks_count' => $project->tasks()->where('status', 'pending')->whereDate('due_date', '<', now())->count(),
            'next_due_date'       => $project->tasks()->where('status', 'pending')->whereNotNull('due_date')->min('due_date'),
            'active_ideas_count'  => $project->ideas()->where('status', 'active')->count(),
            'last_activity'       => $project->tasks()->max('updated_at'),
        ];

        return Inertia::render('projects/show', [
            'project'            => $project,
            'recentCompleted'    => $recentCompleted,
            'upcomingPending'    => $upcomingPending,
            'ideas'              => $ideas,
            'resources'          => $resources,
            'tasksSummary'       => $project->getTasksSummary(),
            'progressPercentage' => $project->getProgressPercentage(),
            'isPremium'          => $isPremium,
            'contextHeader'      => $contextHeader,
        ]);
    }
}
