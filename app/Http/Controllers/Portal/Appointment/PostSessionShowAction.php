<?php

namespace App\Http\Controllers\Portal\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostSessionShowAction extends Controller
{
    public function __invoke(Request $request, Appointment $appointment): Response
    {
        abort_if($appointment->patient_id !== $request->user()->id, 403);

        abort_unless(
            in_array($appointment->status, ['completed', 'in_progress'], strict: true),
            403,
            'La sesión aún no ha finalizado.',
        );

        $appointment->load(['professional:id,name,avatar_path']);

        return Inertia::render('patient/appointments/post-session', [
            'appointment' => $appointment,
        ]);
    }
}
