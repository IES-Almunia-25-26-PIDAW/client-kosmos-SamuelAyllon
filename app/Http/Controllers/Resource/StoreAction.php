<?php

namespace App\Http\Controllers\Resource;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreResourceRequest;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class StoreAction extends Controller
{
    public function __invoke(StoreResourceRequest $request, Project $project): RedirectResponse
    {
        $this->authorize('view', $project);

        $project->resources()->create([
            ...$request->validated(),
            'user_id' => Auth::id(),
            'user_modified_at' => now(),
        ]);

        return redirect()->route('clients.show', $project)->with('success', 'Recurso añadido correctamente.');
    }
}
