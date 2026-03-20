<?php

namespace App\Http\Controllers\Resource;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\RedirectResponse;

class DestroyAction extends Controller
{
    public function __invoke(Resource $resource): RedirectResponse
    {
        $this->authorize('delete', $resource);

        $projectId = $resource->project_id;
        $resource->delete();

        return redirect()->route('clients.show', $projectId)->with('success', 'Recurso eliminado correctamente.');
    }
}
