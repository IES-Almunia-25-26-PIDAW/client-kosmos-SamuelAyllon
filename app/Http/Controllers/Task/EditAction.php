<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class EditAction extends Controller
{
    use AuthorizesRequests;

    public function __invoke(Task $task): Response
    {
        $this->authorize('update', $task);

        $user = Auth::user();

        // Igual que en create: proyectos solo para premium
        $projects = $user->isPremiumUser() || $user->isAdmin()
            ? $user->projects()->active()->get(['id', 'name'])
            : collect();

        return Inertia::render('tasks/edit', [
            'task' => $task->load('project'),
            'projects' => $projects,
        ]);
    }
}
