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
            ->with(['professional:id,name', 'service:id,name'])
            ->orderBy('starts_at')
            ->limit(5)
            ->get();

        $pendingInvoices = Invoice::where('patient_id', $user->id)
            ->whereIn('status', ['sent', 'overdue'])
            ->orderBy('due_at')
            ->limit(5)
            ->get();

        $unreadMessages = Message::where('receiver_id', $user->id)
            ->whereNull('read_at')
            ->count();

        return Inertia::render('patient/dashboard', [
            'upcomingAppointments' => $upcomingAppointments,
            'pendingInvoices' => $pendingInvoices,
            'unreadMessages' => $unreadMessages,
        ]);
    }
}
