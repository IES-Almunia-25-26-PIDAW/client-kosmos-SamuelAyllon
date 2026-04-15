<?php

namespace App\Http\Controllers\Admin\Clinics;

use App\Http\Controllers\Controller;
use App\Models\Clinic;
use App\Models\Invoice;
use Inertia\Inertia;
use Inertia\Response;

class ShowAction extends Controller
{
    public function __invoke(Clinic $clinic): Response
    {
        $clinic->load([
            'owner:id,name,email',
            'users' => fn ($q) => $q->withPivot(['role', 'is_active', 'joined_at']),
            'services',
        ]);

        $stats = [
            'revenue_total' => Invoice::where('clinic_id', $clinic->id)
                ->where('status', 'paid')
                ->sum('total'),
            'invoices_count' => Invoice::where('clinic_id', $clinic->id)->count(),
        ];

        return Inertia::render('admin/clinics/show', [
            'clinic' => $clinic,
            'stats'  => $stats,
        ]);
    }
}
