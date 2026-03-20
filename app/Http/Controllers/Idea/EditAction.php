<?php

namespace App\Http\Controllers\Idea;

use App\Http\Controllers\Controller;
use App\Models\Idea;
use Inertia\Inertia;
use Inertia\Response;

class EditAction extends Controller
{
    public function __invoke(Idea $idea): Response
    {
        $this->authorize('update', $idea);

        return Inertia::render('ideas/edit', [
            'idea' => $idea,
        ]);
    }
}
