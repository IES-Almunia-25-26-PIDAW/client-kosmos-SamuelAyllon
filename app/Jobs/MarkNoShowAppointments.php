<?php

namespace App\Jobs;

use App\Models\Appointment;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class MarkNoShowAppointments implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        // Citas confirmed sin professional_joined_at, más de 20 min pasados desde starts_at
        Appointment::query()
            ->where('status', 'confirmed')
            ->whereNull('professional_joined_at')
            ->where('starts_at', '<', now()->subMinutes(20))
            ->update(['status' => 'no_show']);
    }
}
