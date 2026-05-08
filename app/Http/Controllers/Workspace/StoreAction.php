<?php

namespace App\Http\Controllers\Workspace;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWorkspaceRequest;
use App\Models\Workspace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;

class StoreAction extends Controller
{
    public function __invoke(StoreWorkspaceRequest $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validated();

        $workspace = Workspace::create([
            'creator_id' => $user->id,
            'type' => Workspace::TYPE_COLLABORATIVE,
            'name' => $data['name'],
            'slug' => Str::slug($data['name']).'-'.Str::lower(Str::random(6)),
            'settings' => isset($data['description'])
                ? ['description' => $data['description']]
                : null,
        ]);

        $workspace->members()->attach($user->id, [
            'role' => 'member',
            'is_active' => true,
            'joined_at' => now(),
        ]);

        session(['current_workspace_id' => $workspace->id]);

        return redirect()->route('professional.workspace.team.index')
            ->with('success', 'Workspace colaborativo creado.');
    }
}
