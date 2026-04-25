<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Invoice;
use App\Models\KosmoBriefing;
use App\Models\PatientProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        if ($user->isPatient()) {
            return $this->patientDashboard($user);
        }

        return $this->professionalDashboard($user);
    }

    private function professionalDashboard($user): Response
    {
        $activePatientProfiles = PatientProfile::withoutGlobalScopes()
            ->where('professional_id', $user->id)
            ->where('is_active', true)
            ->with('user:id,name,avatar_path')
            ->get();

        $patientProfileMap = $activePatientProfiles->keyBy('user_id');

        $todaySessions = $user->professionalAppointments()
            ->with(['patient:id,name,avatar_path', 'service:id,name'])
            ->whereDate('starts_at', today())
            ->whereNotIn('status', ['cancelled'])
            ->orderBy('starts_at')
            ->get()
            ->map(function (Appointment $appointment) use ($user, $patientProfileMap) {
                $sessionNumber = Appointment::where('professional_id', $user->id)
                    ->where('patient_id', $appointment->patient_id)
                    ->where('status', 'completed')
                    ->where('starts_at', '<', $appointment->starts_at)
                    ->count() + 1;

                $totalSessions = Appointment::where('professional_id', $user->id)
                    ->where('patient_id', $appointment->patient_id)
                    ->whereNotIn('status', ['cancelled'])
                    ->count();

                $patientProfile = $patientProfileMap->get($appointment->patient_id);

                return [
                    'id' => $appointment->id,
                    'scheduled_at' => $appointment->starts_at,
                    'modality' => $appointment->modality ?? 'presencial',
                    'status' => $appointment->status,
                    'session_number' => $sessionNumber,
                    'total_sessions' => max($totalSessions, $sessionNumber),
                    'patient' => [
                        'id' => $patientProfile?->id ?? $appointment->patient_id,
                        'patient_user_id' => $appointment->patient_id,
                        'name' => $appointment->patient?->name ?? 'Paciente',
                        'avatar_path' => $appointment->patient?->avatar_path,
                    ],
                    'service_name' => $appointment->service?->name,
                ];
            });

        $pendingPayments = Invoice::where('professional_id', $user->id)
            ->whereIn('status', ['sent', 'overdue'])
            ->with('patient:id,name')
            ->orderBy('due_at')
            ->take(5)
            ->get()
            ->map(fn (Invoice $invoice) => [
                'id' => $invoice->id,
                'patient_id' => $invoice->patient_id,
                'patient_name' => $invoice->patient->name ?? 'Paciente',
                'amount' => (float) $invoice->total,
                'status' => $invoice->status,
                'due_at' => $invoice->due_at?->format('Y-m-d'),
                'hours_since_due' => $invoice->due_at
                    ? max(0, (int) $invoice->due_at->diffInHours(now()))
                    : null,
            ]);

        $alerts = [
            'invoice' => PatientProfile::withoutGlobalScopes()
                ->where('professional_id', $user->id)
                ->whereHas('invoices', fn ($q) => $q->whereIn('status', ['sent', 'overdue']))
                ->where('is_active', true)
                ->with('user:id,name')
                ->get(['id', 'user_id'])
                ->map(fn (PatientProfile $p) => [
                    'id' => $p->id,
                    'project_name' => $p->user->name,
                    'payment_status' => 'pending',
                ]),
            'consent' => PatientProfile::withoutGlobalScopes()
                ->where('professional_id', $user->id)
                ->whereDoesntHave('consentForms', fn ($q) => $q
                    ->where('status', 'signed')
                    ->where(fn ($q2) => $q2->whereNull('expires_at')->orWhere('expires_at', '>', now())))
                ->where('is_active', true)
                ->with('user:id,name')
                ->get(['id', 'user_id'])
                ->map(fn (PatientProfile $p) => [
                    'id' => $p->id,
                    'project_name' => $p->user->name,
                ]),
        ];

        $dailyBriefing = KosmoBriefing::where('user_id', $user->id)
            ->where('type', 'daily')
            ->whereDate('for_date', today())
            ->first();

        $stats = [
            'sessions_today' => $todaySessions->count(),
            'appointments_this_week' => $user->professionalAppointments()
                ->whereBetween('starts_at', [now()->startOfWeek(), now()->endOfWeek()])
                ->count(),
            'pending_invoices' => Invoice::where('professional_id', $user->id)
                ->whereIn('status', ['sent', 'overdue'])
                ->sum('total'),
            'active_patients' => $activePatientProfiles->count(),
            'collection_rate' => $this->getCollectionRate($user->id),
        ];

        return Inertia::render('professional/dashboard', [
            'activePatients' => $activePatientProfiles,
            'todayAppointments' => $todaySessions,
            'pendingPayments' => $pendingPayments,
            'alerts' => $alerts,
            'dailyBriefing' => $dailyBriefing,
            'stats' => $stats,
        ]);
    }

    private function patientDashboard($user): Response
    {
        $upcomingAppointments = $user->appointments()
            ->with(['professional:id,name,avatar_path,specialty', 'service:id,name'])
            ->where('starts_at', '>=', now())
            ->whereNotIn('status', ['cancelled'])
            ->orderBy('starts_at')
            ->take(5)
            ->get()
            ->map(fn ($appointment) => [
                'id' => $appointment->id,
                'scheduled_at' => $appointment->starts_at,
                'modality' => $appointment->modality ?? 'presencial',
                'status' => $appointment->status,
                'professional' => [
                    'id' => $appointment->professional_id,
                    'name' => $appointment->professional->name ?? 'Profesional',
                    'specialty' => $appointment->professional?->specialty,
                    'avatar_path' => $appointment->professional?->avatar_path,
                ],
                'service_name' => $appointment->service?->name,
            ]);

        $recentInvoices = $user->invoices()
            ->orderByDesc('created_at')
            ->take(4)
            ->get()
            ->map(fn ($invoice) => [
                'id' => $invoice->id,
                'amount' => (float) $invoice->total,
                'status' => $invoice->status,
                'due_at' => $invoice->due_at?->format('Y-m-d'),
                'created_at' => $invoice->created_at?->format('Y-m-d'),
            ]);

        $stats = [
            'upcoming_appointments' => $user->appointments()
                ->where('starts_at', '>=', now())
                ->whereNotIn('status', ['cancelled'])
                ->count(),
            'completed_sessions' => $user->appointments()
                ->where('status', 'completed')
                ->count(),
            'pending_invoices' => $user->invoices()
                ->whereIn('status', ['sent', 'overdue'])
                ->sum('total'),
        ];

        return Inertia::render('patient/dashboard', [
            'upcomingAppointments' => $upcomingAppointments,
            'recentInvoices' => $recentInvoices,
            'stats' => $stats,
        ]);
    }

    private function getCollectionRate(int $userId): float
    {
        $total = Invoice::where('professional_id', $userId)->count();
        if ($total === 0) {
            return 100.0;
        }
        $paid = Invoice::where('professional_id', $userId)->where('status', 'paid')->count();

        return round(($paid / $total) * 100, 1);
    }
}
