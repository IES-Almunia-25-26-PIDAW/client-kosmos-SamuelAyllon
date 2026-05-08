<?php

namespace App\Observers;

use App\Actions\Billing\GenerateInvoiceForAppointment;
use App\Models\Appointment;

class AppointmentObserver
{
    public function updated(Appointment $appointment): void
    {
        if (! $appointment->wasChanged('status')) {
            return;
        }

        if ($appointment->status !== 'completed') {
            return;
        }

        app(GenerateInvoiceForAppointment::class)($appointment);
    }
}
