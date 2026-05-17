<?php

namespace App\Http\Controllers\Appointment;

use App\Actions\Billing\GenerateInvoiceForAppointment;
use App\Http\Controllers\Controller;
use App\Jobs\SendAgreementsEmailJob;
use App\Jobs\SendInvoiceEmailJob;
use App\Jobs\SendPostSessionEmailJob;
use App\Models\Appointment;
use App\Services\BillingService;
use Illuminate\Http\RedirectResponse;

class FinalizeAndNotifyAction extends Controller
{
    public function __invoke(
        Appointment $appointment,
        BillingService $billing,
        GenerateInvoiceForAppointment $generate,
    ): RedirectResponse {
        abort_unless(
            $appointment->professional_id === auth()->id(),
            403,
            'Solo el profesional de la cita puede finalizarla.',
        );

        if ($appointment->status !== 'completed') {
            $appointment->update(['status' => 'completed']);
        }

        $invoice = $generate($appointment);

        if ($invoice !== null) {
            if ($invoice->pdf_path === null) {
                $billing->generatePdf($invoice);
            }

            if ($invoice->status === 'draft') {
                $invoice->update(['status' => 'sent']);
            }

            SendInvoiceEmailJob::dispatch($invoice->id);
        }

        SendAgreementsEmailJob::dispatch($appointment->id);
        SendPostSessionEmailJob::dispatch($appointment->id);

        return back()->with('success', 'Cierre enviado al paciente.');
    }
}
