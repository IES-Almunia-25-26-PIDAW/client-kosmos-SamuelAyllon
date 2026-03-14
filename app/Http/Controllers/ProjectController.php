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

        return Inertia::render('projects/show', [
            'project'          => $project,
            'recentCompleted'  => $recentCompleted,
            'upcomingPending'  => $upcomingPending,
            'ideas'            => $ideas,
            'resources'        => $resources,
            'tasksSummary'     => $project->getTasksSummary(),
            'progressPercentage' => $project->getProgressPercentage(),
            'isPremium'        => $isPremium,
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
