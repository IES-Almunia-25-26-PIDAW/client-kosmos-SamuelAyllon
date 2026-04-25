<?php

namespace App\Http\Controllers\Portal\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $appointments = Appointment::where('patient_id', $request->user()->id)
            ->with(['professional:id,name', 'service:id,name,duration_minutes'])
            ->orderByDesc('starts_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('patient/appointments/index', [
            'appointments' => $appointments,
        ]);
    }
}
