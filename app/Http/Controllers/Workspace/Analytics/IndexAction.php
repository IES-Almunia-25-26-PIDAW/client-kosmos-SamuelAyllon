<?php

namespace App\Http\Controllers\Clinic\Analytics;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Invoice;
use App\Models\PatientProfessional;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $clinicId = $request->user()->currentClinicId();

        $stats = [
            'total_patients'     => PatientProfessional::where('clinic_id', $clinicId)
                ->where('status', 'active')
                ->count(),
            'appointments_month' => Appointment::where('clinic_id', $clinicId)
                ->whereYear('starts_at', now()->year)
                ->whereMonth('starts_at', now()->month)
                ->count(),
            'revenue_month'      => Invoice::where('clinic_id', $clinicId)
                ->where('status', 'paid')
                ->whereYear('paid_at', now()->year)
                ->whereMonth('paid_at', now()->month)
                ->sum('total'),
            'pending_invoices'   => Invoice::where('clinic_id', $clinicId)
                ->whereIn('status', ['draft', 'sent'])
                ->count(),
        ];

        return Inertia::render('clinic/analytics/index', [
            'stats' => $stats,
        ]);
    }
}
