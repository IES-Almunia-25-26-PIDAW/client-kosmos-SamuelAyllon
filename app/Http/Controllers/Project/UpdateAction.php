<?php

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;

class UpdateAction extends Controller
{
    public function __invoke(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $project->update([
            ...$request->validated(),
            'user_modified_at' => now(),
        ]);

        return redirect()->route('clients.show', $project)->with('success', 'Cliente actualizado correctamente.');
    }
}
