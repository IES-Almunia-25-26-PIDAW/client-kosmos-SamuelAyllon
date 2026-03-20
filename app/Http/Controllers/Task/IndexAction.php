<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    use AuthorizesRequests;

    public function __invoke(): Response
    {
        $user = Auth::user();

        $tasks = $user->tasks()
            ->with('project')
            ->orderByRaw("CASE status WHEN 'pending' THEN 0 ELSE 1 END")
            ->byPriority()
            ->get();

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'canAddTask' => $user->canAddTask(),
            'isFreeUser' => $user->isFreeUser(),
        ]);
    }
}
