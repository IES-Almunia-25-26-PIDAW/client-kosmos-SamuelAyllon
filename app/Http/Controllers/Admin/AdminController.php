<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ConsultingSession;
use App\Models\Patient;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function users(): Response
    {
        $users = User::where('role', 'professional')
            ->withCount(['patients', 'sessions'])
            ->withSum(['payments as paid_amount' => fn ($q) => $q->where('status', 'paid')], 'amount')
            ->latest()
            ->paginate(25);

        return Inertia::render('admin/users/index', compact('users'));
    }

    public function showUser(User $user): Response
    {
        $user->loadCount(['patients', 'sessions'])
             ->loadSum(['payments as paid_amount' => fn ($q) => $q->where('status', 'paid')], 'amount');

        return Inertia::render('admin/users/show', compact('user'));
    }

    public function create(): Response
    {
        return Inertia::render('admin/users/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $user = User::create([
            'name'              => $validated['name'],
            'email'             => $validated['email'],
            'password'          => Hash::make($validated['password']),
            'role'              => 'professional',
            'email_verified_at' => now(),
        ]);

        $user->assignRole('professional');

        return redirect()->route('admin.users.show', $user)
            ->with('success', "Profesional {$user->name} creado correctamente.");
    }

    public function updateRole(Request $request, User $user): RedirectResponse
    {
        $request->validate(['role' => ['required', 'in:professional,admin']]);

        if ($user->id === $request->user()->id) {
            return back()->withErrors(['role' => 'No puedes cambiar tu propio rol.']);
        }

        $user->update(['role' => $request->role]);

        if ($request->role === 'professional') {
            $user->syncRoles(['professional']);
        } else {
            $user->syncRoles(['admin']);
        }

        return back()->with('success', "Rol actualizado a {$request->role}.");
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return back()->withErrors(['delete' => 'No puedes eliminarte a ti mismo.']);
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', "Usuario {$user->name} eliminado correctamente.");
    }
}
