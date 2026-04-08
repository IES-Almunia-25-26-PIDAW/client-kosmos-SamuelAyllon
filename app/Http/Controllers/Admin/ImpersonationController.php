<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ImpersonationController extends Controller
{
    public function start(Request $request, User $user): RedirectResponse
    {
        abort_if($user->isAdmin(), 403);

        $request->session()->put('impersonating_id', $request->user()->id);
        auth()->login($user);

        return redirect()->route('dashboard')
            ->with('success', "Viendo como {$user->name}");
    }

    public function stop(Request $request): RedirectResponse
    {
        $adminId = $request->session()->pull('impersonating_id');
        abort_if(! $adminId, 403);

        auth()->login(User::findOrFail($adminId));

        return redirect()->route('admin.users.index')
            ->with('success', 'Impersonación finalizada.');
    }
}
