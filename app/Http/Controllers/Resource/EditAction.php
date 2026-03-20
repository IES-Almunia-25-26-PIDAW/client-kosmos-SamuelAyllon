<?php

namespace App\Http\Controllers\Resource;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Inertia\Inertia;
use Inertia\Response;

class EditAction extends Controller
{
    public function __invoke(Resource $resource): Response
    {
        $this->authorize('update', $resource);

        $resource->load('project');

        return Inertia::render('resources/edit', [
            'resource' => $resource,
        ]);
    }
}
