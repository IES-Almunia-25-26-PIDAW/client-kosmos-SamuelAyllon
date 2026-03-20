<?php

namespace App\Http\Controllers\Admin\AdminUser;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class ShowAction extends Controller
{
    public function __invoke(User $user): Response
    {
        $user->load(['subscription', 'roles', 'payments']);

        return Inertia::render('admin/users/show', [
            'user' => $user,
            'dashboardData' => $user->getDashboardData(),
        ]);
    }
}
