<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        $projects = $user->projects()
            ->withCount(['tasks', 'tasks as pending_tasks_count' => fn ($q) => $q->where('status', 'pending')])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('projects/index', [
            'projects' => $projects,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('projects/create');
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $user = Auth::user();

        if (!$user->canAddProject()) {
            return redirect()->route('clients.index')
                ->with('error', 'Has alcanzado el límite de clientes de tu plan. Mejora a Solo para añadir más.');
        }

        $project = $user->projects()->create([
            ...$request->validated(),
            'status' => 'inactive',
            'user_modified_at' => now(),
        ]);

        return redirect()->route('clients.show', $project)->with('success', 'Cliente creado correctamente.');
    }

    public function show(Project $project): Response
    {
        $this->authorize('view', $project);

        $project->load([
            'tasks' => fn ($q) => $q->byPriority()->orderByRaw("CASE status WHEN 'pending' THEN 0 ELSE 1 END"),
            'ideas' => fn ($q) => $q->where('status', 'active')->orderBy('created_at', 'desc'),
            'resources' => fn ($q) => $q->orderBy('created_at', 'desc'),
        ]);

        return Inertia::render('projects/show', [
            'project' => $project,
            'tasksSummary' => $project->getTasksSummary(),
            'progressPercentage' => $project->getProgressPercentage(),
        ]);
    }

    public function edit(Project $project): Response
    {
        $this->authorize('update', $project);

        return Inertia::render('projects/edit', [
            'project' => $project,
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $project->update([
            ...$request->validated(),
            'user_modified_at' => now(),
        ]);

        return redirect()->route('clients.show', $project)->with('success', 'Cliente actualizado correctamente.');
    }

    public function complete(Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        // Alterna entre completado y activo
        $project->update([
            'status' => $project->status === 'completed' ? 'active' : 'completed',
            'user_modified_at' => now(),
        ]);

        return redirect()->route('clients.index');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $this->authorize('delete', $project);

        $project->delete();

        return redirect()->route('clients.index')->with('success', 'Cliente eliminado correctamente.');
    }
}
