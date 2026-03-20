<?php

namespace App\Http\Controllers\Admin\AdminDashboard;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(): Response
    {
        $stats = [
            'total_users' => User::count(),
            'free_users' => User::role('free_user')->count(),
            'premium_users' => User::role('premium_user')->count(),
            'total_revenue' => Payment::where('status', 'completed')->sum('amount'),
            'payments_this_month' => Payment::where('status', 'completed')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('amount'),
            'active_subscriptions' => Subscription::where('status', 'active')
                ->where('plan', '!=', 'free')
                ->count(),
        ];

        $recentPayments = Payment::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $recentUsers = User::orderBy('created_at', 'desc')
            ->limit(10)
            ->get(['id', 'name', 'email', 'created_at']);

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentPayments' => $recentPayments,
            'recentUsers' => $recentUsers,
        ]);
    }
}
