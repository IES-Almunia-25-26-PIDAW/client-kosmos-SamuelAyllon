<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;


class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response|RedirectResponse
    {
        $user = Auth::user();

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        $pendingTasks = $user->tasks()
            ->where('status', 'pending')
            ->limit(5)
            ->get();

        $activeIdeas = $user->ideas()
            ->where('status', 'active')
            ->get();

        $subscription = $user->subscription;

        $activeProjects = $user->isPremiumUser()
            ? $user->projects()->active()->get(['id', 'name', 'color'])
            : collect();

        return Inertia::render('dashboard', [
            'pendingTasks'   => $pendingTasks,
            'activeIdeas'    => $activeIdeas,
            'subscription'   => $subscription,
            'activeProjects' => $activeProjects,
        ]);
    }

}
