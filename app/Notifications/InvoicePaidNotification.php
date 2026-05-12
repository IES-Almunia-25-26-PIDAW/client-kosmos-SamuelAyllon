<?php

namespace App\Notifications;

use App\Models\Invoice;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvoicePaidNotification extends Notification
{
    use Queueable;

    public function __construct(public readonly Invoice $invoice) {}

    /** @return array<int, string> */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        /** @var User $notifiable */
        $isPayer = $notifiable->id === $this->invoice->patient_id;

        if ($isPayer) {
            return $this->patientMail();
        }

        return $this->professionalMail();
    }

    private function patientMail(): MailMessage
    {
        return (new MailMessage)
            ->subject('Pago confirmado: '.$this->invoice->invoice_number)
            ->greeting('¡Pago recibido!')
            ->line('Hemos registrado tu pago de '.$this->formattedTotal().' para la factura '.$this->invoice->invoice_number.'.')
            ->line('Puedes descargar el recibo en cualquier momento desde tu portal.')
            ->action('Ver factura', route('patient.invoices.show', $this->invoice));
    }

    private function professionalMail(): MailMessage
    {
        return (new MailMessage)
            ->subject('Cobro recibido: '.$this->invoice->invoice_number)
            ->greeting('Pago registrado')
            ->line('El paciente ha pagado la factura '.$this->invoice->invoice_number.' por importe de '.$this->formattedTotal().'.')
            ->action('Ver factura', route('professional.invoices.review', $this->invoice));
    }

    private function formattedTotal(): string
    {
        return number_format((float) $this->invoice->total, 2, ',', '.').' €';
    }
}
