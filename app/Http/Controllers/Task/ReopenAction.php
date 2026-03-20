<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class ReopenAction extends Controller
{
    use AuthorizesRequests;

    public function __invoke(Task $task): RedirectResponse
    {
        $this->authorize('update', $task);

        // Reabrir cuenta como nueva tarea pendiente, por lo que también
        // hay que respetar el límite de 5 activas para usuarios free
        if (! Auth::user()->canAddTask()) {
            return redirect()->back()->withErrors([
                'limit' => '5 tareas activas es el máximo en Free. Completa alguna o pasa a Solo para reabrir esta.',
            ]);
        }

        $task->markAsPending();

        return redirect()->back()->with('success', 'Tarea reabierta.');
    }
}
