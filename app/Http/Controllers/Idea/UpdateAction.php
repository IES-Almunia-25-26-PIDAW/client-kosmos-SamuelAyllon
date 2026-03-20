<?php

namespace App\Http\Controllers\Idea;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateIdeaRequest;
use App\Models\Idea;
use Illuminate\Http\RedirectResponse;

class UpdateAction extends Controller
{
    public function __invoke(UpdateIdeaRequest $request, Idea $idea): RedirectResponse
    {
        $this->authorize('update', $idea);

        $idea->update([
            ...$request->validated(),
            'user_modified_at' => now(),
        ]);

        return redirect()->route('ideas.index')->with('success', 'Idea actualizada correctamente.');
    }
}
