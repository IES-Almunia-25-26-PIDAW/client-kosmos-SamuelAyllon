<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function index(): Response
    {
        $users = User::with(['subscription', 'roles'])
            ->withCount(['tasks', 'ideas', 'projects'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('admin/users/index', [
            'users' => $users,
        ]);
    }

    public function show(User $user): Response
    {
        $user->load(['subscription', 'roles', 'payments']);

        return Inertia::render('admin/users/show', [
            'user' => $user,
            'dashboardData' => $user->getDashboardData(),
        ]);
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->id === Auth::id()) {
            return redirect()->route('admin.users.index')->with('error', 'No puedes eliminar tu propia cuenta.');
        }

        Log::info('Admin eliminó usuario', [
            'admin_id' => Auth::id(),
            'deleted_user_id' => $user->id,
            'deleted_user_email' => $user->email,
        ]);

        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'Usuario eliminado correctamente.');
    }
}
