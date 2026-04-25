<?php

namespace App\Http\Controllers\Portal\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Invoice;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $upcomingAppointments = Appointment::where('patient_id', $user->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('starts_at', '>=', now())
            ->with(['professional:id,name,avatar_path', 'service:id,name'])
            ->orderBy('starts_at')
            ->limit(5)
            ->get()
            ->map(fn ($appointment) => [
                'id' => $appointment->id,
                'scheduled_at' => $appointment->starts_at,
                'modality' => $appointment->modality,
                'status' => $appointment->status,
                'service_name' => $appointment->service?->name,
                'professional' => [
                    'id' => $appointment->professional->id,
                    'name' => $appointment->professional->name,
                    'avatar_path' => $appointment->professional->avatar_path,
                ],
            ]);

        $recentInvoices = Invoice::where('patient_id', $user->id)
            ->whereIn('status', ['sent', 'overdue'])
            ->orderBy('due_at')
            ->limit(5)
            ->get();

        $unreadMessages = Message::where('receiver_id', $user->id)
            ->whereNull('read_at')
            ->count();

        return Inertia::render('patient/dashboard', [
            'upcomingAppointments' => $upcomingAppointments,
            'recentInvoices' => $recentInvoices,
            'unreadMessages' => $unreadMessages,
        ]);
    }
}
