<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardIndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $search = $request->string('search')->trim()->value();
        $role = $request->string('role', 'all')->value();

        $users = User::withCount(['patientProfiles', 'professionalAppointments'])
            ->withSum(['professionalInvoices as paid_amount' => fn ($q) => $q->where('status', 'paid')], 'total')
            ->when($search, fn ($q) => $q->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            }))
            ->when($role !== 'all', fn ($q) => $q->role($role))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('admin/dashboard', [
            'users' => $users,
            'filters' => ['search' => $search, 'role' => $role],
        ]);
    }
}
