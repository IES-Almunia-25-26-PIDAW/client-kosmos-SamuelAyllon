<?php

namespace App\Jobs;

use App\Models\Appointment;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class AutoCancelUnconfirmedAppointments implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        Appointment::query()
            ->where('status', 'pending')
            ->where('starts_at', '<', now()->addHours(24))
            ->update([
                'status' => 'cancelled',
                'cancellation_reason' => 'Cancelada automáticamente: no confirmada con 24h de antelación.',
            ]);
    }
}
