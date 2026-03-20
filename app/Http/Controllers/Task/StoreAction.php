<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class StoreAction extends Controller
{
    public function __invoke(StoreTaskRequest $request): RedirectResponse
    {
        $user = Auth::user();

        if (! $user->canAddTask()) {
            return redirect()->back()->withErrors([
                'limit' => '5 tareas es el máximo en Free. Con Solo, añade todas las que necesites.',
            ]);
        }

        $user->tasks()->create([
            ...$request->validated(),
            'status' => 'pending',
            'user_modified_at' => now(),
        ]);

        return redirect()->route('tasks.index')->with('success', 'Tarea creada correctamente.');
    }
}
