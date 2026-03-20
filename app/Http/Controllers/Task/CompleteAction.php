<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;

class CompleteAction extends Controller
{
    use AuthorizesRequests;

    public function __invoke(Task $task): RedirectResponse
    {
        $this->authorize('update', $task);

        $task->markAsCompleted();

        return redirect()->back()->with('success', 'Tarea marcada como completada.');
    }
}
