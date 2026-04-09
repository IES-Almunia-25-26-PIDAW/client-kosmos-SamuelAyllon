<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(): Response
    {
        $users = User::where('role', 'professional')
            ->withCount(['patients', 'sessions'])
            ->withSum(['payments as paid_amount' => fn ($q) => $q->where('status', 'paid')], 'amount')
            ->latest()
            ->paginate(25);

        return Inertia::render('admin/users/index', compact('users'));
    }
}
