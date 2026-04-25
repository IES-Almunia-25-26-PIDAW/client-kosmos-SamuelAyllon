<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class ShowAction extends Controller
{
    public function __invoke(User $user): Response
    {
        $user->loadCount(['patientProfiles', 'professionalAppointments'])
            ->loadSum(['professionalInvoices as paid_amount' => fn ($q) => $q->where('status', 'paid')], 'total')
            ->load('professionalProfile');

        return Inertia::render('admin/users/show', compact('user'));
    }
}
