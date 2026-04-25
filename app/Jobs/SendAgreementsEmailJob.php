<?php

namespace App\Jobs;

use App\Mail\AgreementsDeliveredMail;
use App\Models\Appointment;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendAgreementsEmailJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 30;

    public function __construct(
        public int $appointmentId,
    ) {}

    public function handle(): void
    {
        $appointment = Appointment::with(['patient', 'professional', 'agreements'])
            ->find($this->appointmentId);

        if ($appointment === null) {
            Log::warning('SendAgreementsEmailJob: appointment not found', ['id' => $this->appointmentId]);

            return;
        }

        $patientEmail = $appointment->patient?->email;

        if ($patientEmail === null) {
            Log::warning('SendAgreementsEmailJob: patient has no email', ['appointment_id' => $this->appointmentId]);

            return;
        }

        $agreements = $appointment->agreements;

        if ($agreements->isEmpty()) {
            return;
        }

        Mail::to($patientEmail)->send(new AgreementsDeliveredMail($appointment, $agreements));
    }
}
