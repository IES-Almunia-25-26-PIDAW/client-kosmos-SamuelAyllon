<?php

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class StoreAction extends Controller
{
    public function __invoke(StoreProjectRequest $request): RedirectResponse
    {
        $user = Auth::user();

        if (!$user->canAddProject()) {
            return redirect()->route('clients.index')
                ->with('error', 'Con Solo puedes gestionar todos tus clientes desde un solo lugar. Sin límites.');
        }

        $project = $user->projects()->create([
            ...$request->validated(),
            'status' => 'inactive',
            'user_modified_at' => now(),
        ]);

        return redirect()->route('clients.show', $project)->with('success', 'Cliente creado correctamente.');
    }
}
