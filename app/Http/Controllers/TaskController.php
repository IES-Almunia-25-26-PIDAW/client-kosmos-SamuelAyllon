<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    use AuthorizesRequests;
    
    public function index(): Response
    {
        $user = Auth::user();

        $tasks = $user->tasks()
            ->with('project')
            // Primero pendientes (0), luego completadas (1);
            // dentro de cada grupo el scope byPriority ordena high→medium→low
            ->orderByRaw("CASE status WHEN 'pending' THEN 0 ELSE 1 END")
            ->byPriority()
            ->get();

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'canAddTask' => $user->canAddTask(),
            'isFreeUser' => $user->isFreeUser(),
        ]);
    }

    public function create(): Response
    {
        $user = Auth::user();

        // Solo premium pueden asignar tareas a proyectos;
        // los free reciben colección vacía para no exponer la feature en el formulario
        $projects = $user->isPremiumUser() || $user->isAdmin()
            ? $user->projects()->active()->get(['id', 'name'])
            : collect();

        return Inertia::render('tasks/create', [
            'projects' => $projects,
            'defaultProjectId' => request()->query('project_id'),
        ]);
    }

    public function store(StoreTaskRequest $request): RedirectResponse
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

    public function edit(Task $task): Response
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

    public function update(UpdateTaskRequest $request, Task $task): RedirectResponse
    {
        $this->authorize('update', $task);

        $task->update([
            ...$request->validated(),
            'user_modified_at' => now(),
        ]);

        return redirect()->route('tasks.index')->with('success', 'Tarea actualizada correctamente.');
    }

    public function destroy(Task $task): RedirectResponse
    {
        $this->authorize('delete', $task);

        $task->delete();

        return redirect()->route('tasks.index')->with('success', 'Tarea eliminada correctamente.');
    }

    public function complete(Task $task): RedirectResponse
    {
        $this->authorize('update', $task);

        $task->markAsCompleted();

        return redirect()->back()->with('success', 'Tarea marcada como completada.');
    }

    public function reopen(Task $task): RedirectResponse
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
