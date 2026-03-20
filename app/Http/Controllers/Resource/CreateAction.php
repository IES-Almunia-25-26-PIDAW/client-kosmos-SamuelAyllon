<?php

namespace App\Http\Controllers\Resource;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class CreateAction extends Controller
{
    public function __invoke(Project $project): Response
    {
        $this->authorize('view', $project);

        return Inertia::render('resources/create', [
            'project' => $project,
        ]);
    }
}
