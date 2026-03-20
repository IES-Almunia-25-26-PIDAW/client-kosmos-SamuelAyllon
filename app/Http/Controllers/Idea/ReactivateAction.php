<?php

namespace App\Http\Controllers\Idea;

use App\Http\Controllers\Controller;
use App\Models\Idea;
use Illuminate\Http\RedirectResponse;

class ReactivateAction extends Controller
{
    public function __invoke(Idea $idea): RedirectResponse
    {
        $this->authorize('update', $idea);

        $idea->markAsActive();

        return redirect()->back()->with('success', 'Idea reactivada.');
    }
}
