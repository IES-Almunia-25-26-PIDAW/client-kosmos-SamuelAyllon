<?php

namespace App\Http\Controllers\Onboarding;

use App\Http\Controllers\Controller;
use App\Models\Workspace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StoreAction extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $user = $request->user();

        $user->completeTutorial();

        if ($user->createdWorkspaces()->doesntExist()) {
            $workspace = Workspace::create([
                'creator_id' => $user->id,
                'type' => Workspace::TYPE_PERSONAL,
                'name' => $user->name,
                'slug' => Str::slug($user->name).'-'.Str::lower(Str::random(6)),
            ]);

            $workspace->members()->attach($user->id, [
                'role' => 'member',
                'is_active' => true,
                'joined_at' => now(),
            ]);
        }

        return redirect()->route('professional.dashboard')
            ->with('success', 'Todo listo. Kosmo te acompañará en cada sesión.');
    }
}
