<?php

namespace App\Jobs;

use App\Mail\PostSessionMail;
use App\Models\Appointment;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendPostSessionEmailJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 30;

    public function __construct(
        public int $appointmentId,
    ) {}

    public function handle(): void
    {
        $appointment = Appointment::with(['patient', 'professional'])->find($this->appointmentId);

        if ($appointment === null) {
            Log::warning('SendPostSessionEmailJob: appointment not found', ['id' => $this->appointmentId]);

            return;
        }

        $patientEmail = $appointment->patient?->email;

        if ($patientEmail === null) {
            Log::warning('SendPostSessionEmailJob: patient has no email', ['appointment_id' => $this->appointmentId]);

            return;
        }

        Mail::to($patientEmail)->send(new PostSessionMail($appointment));
    }
}
