<?php

namespace App\Http\Controllers\Portal\Appointment;

use App\Actions\Patient\CreateOrUpdateProfessionalPatient;
use App\DTOs\PatientUpsertData;
use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Workspace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ConfirmAction extends Controller
{
    public function __invoke(
        Request $request,
        Appointment $appointment,
        CreateOrUpdateProfessionalPatient $upsertPatient,
    ): RedirectResponse {
        abort_if($appointment->patient_id !== $request->user()->id, 403);

        if ($appointment->status !== 'pending') {
            return back()->withErrors(['status' => 'Solo las citas pendientes pueden confirmarse.']);
        }

        if ($appointment->starts_at->lessThan(now()->addHours(24))) {
            return back()->withErrors([
                'status' => 'Las citas deben confirmarse con al menos 24 horas de antelación.',
            ]);
        }

        DB::transaction(function () use ($appointment, $request, $upsertPatient): void {
            $appointment->update([
                'status' => 'confirmed',
                'confirmed_at' => now(),
            ]);

            $patient = $request->user();
            $professional = $appointment->professional;
            $workspace = Workspace::find($appointment->workspace_id);

            if ($professional && $workspace) {
                $upsertPatient(
                    $professional,
                    $workspace,
                    new PatientUpsertData(
                        name: $patient->name,
                        email: $patient->email,
                        phone: $patient->phone,
                    ),
                    $patient,
                );
            }
        });

        return back()->with('success', 'Cita confirmada.');
    }
}
