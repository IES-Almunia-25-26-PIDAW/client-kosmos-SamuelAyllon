<?php

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(): Response
    {
        $user = Auth::user();

        $projects = $user->projects()
            ->withCount(['tasks', 'tasks as pending_tasks_count' => fn ($q) => $q->where('status', 'pending')])
            ->withCount(['tasks as overdue_tasks_count' => fn ($q) => $q->where('status', 'pending')->whereDate('due_date', '<', now())])
            ->withCount(['tasks as upcoming_tasks_count' => fn ($q) => $q->where('status', 'pending')->whereDate('due_date', '>=', now())->whereDate('due_date', '<=', now()->addDays(2))])
            ->orderByRaw('
                (SELECT COUNT(*) FROM tasks WHERE tasks.project_id = projects.id AND tasks.status = ? AND tasks.due_date < ?) DESC
            ', ['pending', now()->toDateString()])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('projects/index', [
            'projects' => $projects,
        ]);
    }
}
