<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $appointments = Appointment::where('professional_id', $user->id)
            ->with(['patient', 'service'])
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when($request->date, fn ($q, $d) => $q->whereDate('starts_at', $d))
            ->orderBy('starts_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('professional/appointments/index', [
            'appointments' => $appointments,
            'filters' => $request->only(['status', 'date']),
        ]);
    }
}
