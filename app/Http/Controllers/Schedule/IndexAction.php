<?php

namespace App\Http\Controllers\Schedule;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Availability;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $from = $request->date('from', 'Y-m-d') ?? now()->startOfWeek();
        $to = $request->date('to', 'Y-m-d') ?? now()->endOfWeek();
        $view = $request->string('view', 'semanal');

        $appointments = Appointment::where('professional_id', $user->id)
            ->with(['patient', 'service'])
            ->whereBetween('starts_at', [$from, $to])
            ->orderBy('starts_at')
            ->get()
            ->map(fn (Appointment $a) => [
                'id' => $a->id,
                'starts_at' => $a->starts_at->toIso8601String(),
                'ends_at' => $a->ends_at->toIso8601String(),
                'status' => $a->status,
                'modality' => $a->modality,
                'notes' => $a->notes,
                'patient' => $a->patient ? ['id' => $a->patient->id, 'name' => $a->patient->name] : null,
                'service' => $a->service ? ['id' => $a->service->id, 'name' => $a->service->name] : null,
            ]);

        $recurringSlots = Availability::where('professional_id', $user->id)
            ->whereNotNull('day_of_week')
            ->where('is_active', true)
            ->get()
            ->map(fn (Availability $av) => [
                'id' => $av->id,
                'day_of_week' => $av->day_of_week,
                'specific_date' => null,
                'start_time' => $av->start_time,
                'end_time' => $av->end_time,
                'slot_duration_minutes' => $av->slot_duration_minutes,
                'is_recurring' => true,
            ]);

        $specificSlots = Availability::where('professional_id', $user->id)
            ->whereNotNull('specific_date')
            ->whereBetween('specific_date', [$from, $to])
            ->where('is_active', true)
            ->get()
            ->map(fn (Availability $av) => [
                'id' => $av->id,
                'day_of_week' => null,
                'specific_date' => $av->specific_date->toDateString(),
                'start_time' => $av->start_time,
                'end_time' => $av->end_time,
                'slot_duration_minutes' => $av->slot_duration_minutes,
                'is_recurring' => false,
            ]);

        return Inertia::render('professional/schedule/index', [
            'appointments' => $appointments,
            'recurringSlots' => $recurringSlots,
            'specificSlots' => $specificSlots,
            'from' => $from->toDateString(),
            'to' => $to->toDateString(),
            'view' => $view,
        ]);
    }
}
