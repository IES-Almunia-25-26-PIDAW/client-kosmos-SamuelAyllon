<?php

namespace App\Http\Controllers\Resource;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateResourceRequest;
use App\Models\Resource;
use Illuminate\Http\RedirectResponse;

class UpdateAction extends Controller
{
    public function __invoke(UpdateResourceRequest $request, Resource $resource): RedirectResponse
    {
        $this->authorize('update', $resource);

        $resource->update([
            ...$request->validated(),
            'user_modified_at' => now(),
        ]);

        return redirect()->route('clients.show', $resource->project_id)->with('success', 'Recurso actualizado correctamente.');
    }
}
