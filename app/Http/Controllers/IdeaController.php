<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreIdeaRequest;
use App\Http\Requests\UpdateIdeaRequest;
use App\Models\Idea;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class IdeaController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        $ideas = $user->ideas()
            ->orderByRaw("CASE status WHEN 'active' THEN 0 ELSE 1 END")
            ->byPriority()
            ->get();

        return Inertia::render('ideas/index', [
            'ideas' => $ideas,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('ideas/create');
    }

    public function store(StoreIdeaRequest $request): RedirectResponse
    {
        Auth::user()->ideas()->create([
            ...$request->validated(),
            'source' => $request->validated('source') ?? 'manual',
            'status' => 'active',
            'user_modified_at' => now(),
        ]);

        return redirect()->route('notes.index')->with('success', 'Idea creada correctamente.');
    }

    public function edit(Idea $idea): Response
    {
        $this->authorize('update', $idea);

        return Inertia::render('ideas/edit', [
            'idea' => $idea,
        ]);
    }

    public function update(UpdateIdeaRequest $request, Idea $idea): RedirectResponse
    {
        $this->authorize('update', $idea);

        $idea->update([
            ...$request->validated(),
            'user_modified_at' => now(),
        ]);

        return redirect()->route('notes.index')->with('success', 'Idea actualizada correctamente.');
    }

    public function destroy(Idea $idea): RedirectResponse
    {
        $this->authorize('delete', $idea);

        $idea->delete();

        return redirect()->route('notes.index')->with('success', 'Idea eliminada correctamente.');
    }

    public function resolve(Idea $idea): RedirectResponse
    {
        $this->authorize('update', $idea);

        $idea->markAsResolved();

        return redirect()->back()->with('success', 'Idea marcada como resuelta.');
    }

    public function reactivate(Idea $idea): RedirectResponse
    {
        $this->authorize('update', $idea);

        $idea->markAsActive();

        return redirect()->back()->with('success', 'Idea reactivada.');
    }
}
