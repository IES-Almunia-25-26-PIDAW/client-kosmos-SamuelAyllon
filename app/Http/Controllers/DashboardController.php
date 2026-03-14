<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;


class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response|RedirectResponse
    {
        $user = Auth::user();

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        // Tareas críticas del día: overdue > dueToday > dueSoon > byPriority
        $todayTasks = $user->tasks()
            ->with('project:id,name,color')
            ->where('status', 'pending')
            ->orderByRaw("
                CASE
                    WHEN due_date < CURRENT_DATE THEN 0
                    WHEN due_date = CURRENT_DATE THEN 1
                    WHEN due_date <= CURRENT_DATE + INTERVAL 3 DAY THEN 2
                    ELSE 3
                END
            ")
            ->orderByRaw("
                CASE priority
                    WHEN 'high' THEN 0
                    WHEN 'medium' THEN 1
                    WHEN 'low' THEN 2
                END
            ")
            ->limit(5)
            ->get();

        // Clientes activos con datos de riesgo
        $activeProjects = $user->projects()
            ->active()
            ->withCount(['tasks as pending_tasks_count' => fn ($q) => $q->where('status', 'pending')])
            ->withCount(['tasks as overdue_tasks_count' => fn ($q) => $q->where('status', 'pending')->whereDate('due_date', '<', now())])
            ->get(['id', 'name', 'color', 'next_deadline']);

        // Clientes en riesgo: con tareas atrasadas o deadline próximo
        $atRiskProjects = $activeProjects->filter(function ($project) {
            return $project->overdue_tasks_count > 0
                || ($project->next_deadline && $project->next_deadline->lte(now()->addDays(7)));
        })->values();

        $subscription = $user->subscription;

        return Inertia::render('dashboard', [
            'todayTasks'     => $todayTasks,
            'activeProjects' => $activeProjects,
            'atRiskProjects' => $atRiskProjects,
            'subscription'   => $subscription,
        ]);
    }

}
