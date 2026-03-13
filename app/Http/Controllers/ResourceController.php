<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreResourceRequest;
use App\Http\Requests\UpdateResourceRequest;
use App\Models\Project;
use App\Models\Resource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ResourceController extends Controller
{
    public function create(Project $project): Response
    {
        $this->authorize('view', $project);

        return Inertia::render('resources/create', [
            'project' => $project,
        ]);
    }

    public function store(StoreResourceRequest $request, Project $project): RedirectResponse
    {
        $this->authorize('view', $project);

        $project->resources()->create([
            ...$request->validated(),
            'user_id' => Auth::id(),
            'user_modified_at' => now(),
        ]);

        return redirect()->route('clients.show', $project)->with('success', 'Recurso añadido correctamente.');
    }

    public function edit(Resource $resource): Response
    {
        $this->authorize('update', $resource);

        $resource->load('project');

        return Inertia::render('resources/edit', [
            'resource' => $resource,
        ]);
    }

    public function update(UpdateResourceRequest $request, Resource $resource): RedirectResponse
    {
        $this->authorize('update', $resource);

        $resource->update([
            ...$request->validated(),
            'user_modified_at' => now(),
        ]);

        return redirect()->route('clients.show', $resource->project_id)->with('success', 'Recurso actualizado correctamente.');
    }

    public function destroy(Resource $resource): RedirectResponse
    {
        $this->authorize('delete', $resource);

        $projectId = $resource->project_id;
        $resource->delete();

        return redirect()->route('clients.show', $projectId)->with('success', 'Recurso eliminado correctamente.');
    }
}
