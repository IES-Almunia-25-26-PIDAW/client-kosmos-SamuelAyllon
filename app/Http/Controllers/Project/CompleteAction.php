<?php

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;

class CompleteAction extends Controller
{
    public function __invoke(Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        // Alterna entre completado y activo
        $project->update([
            'status' => $project->status === 'completed' ? 'active' : 'completed',
            'user_modified_at' => now(),
        ]);

        return redirect()->route('clients.index');
    }
}
