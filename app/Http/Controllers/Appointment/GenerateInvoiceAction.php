<?php

namespace App\Http\Controllers\Appointment;

use App\Actions\Billing\GenerateInvoiceForAppointment;
use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class GenerateInvoiceAction extends Controller
{
    public function __invoke(
        Request $request,
        Appointment $appointment,
        GenerateInvoiceForAppointment $generate,
    ): RedirectResponse {
        if ($appointment->invoiceItems()->whereHas('invoice')->exists()) {
            return back()->withErrors(['invoice' => 'Ya existe una factura para esta cita.']);
        }

        $invoice = $generate($appointment);

        if ($invoice === null) {
            return back()->withErrors(['invoice' => 'No se pudo generar la factura: la cita no tiene servicio asociado.']);
        }

        return redirect()->route('professional.invoices.review', $invoice)
            ->with('success', 'Borrador de factura generado.');
    }
}
