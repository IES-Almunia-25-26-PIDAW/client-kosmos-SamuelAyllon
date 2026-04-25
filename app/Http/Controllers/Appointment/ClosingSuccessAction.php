<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClosingSuccessAction extends Controller
{
    public function __invoke(Request $request, Appointment $appointment): Response
    {
        abort_if($appointment->professional_id !== $request->user()->id, 403);

        abort_unless(
            in_array($appointment->status, ['completed', 'in_progress'], strict: true),
            403,
            'La sesión aún no ha finalizado.',
        );

        $appointment->load(['patient:id,name,avatar_path']);

        return Inertia::render('professional/appointments/closing-success', [
            'appointment' => $appointment,
        ]);
    }
}
