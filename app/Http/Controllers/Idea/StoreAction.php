<?php

namespace App\Http\Controllers\Idea;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreIdeaRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class StoreAction extends Controller
{
    public function __invoke(StoreIdeaRequest $request): RedirectResponse
    {
        Auth::user()->ideas()->create([
            ...$request->validated(),
            'source' => $request->validated('source') ?? 'manual',
            'status' => 'active',
            'user_modified_at' => now(),
        ]);

        return redirect()->route('ideas.index')->with('success', 'Idea creada correctamente.');
    }
}
