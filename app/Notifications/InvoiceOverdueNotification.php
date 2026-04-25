<?php

namespace App\Notifications;

use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvoiceOverdueNotification extends Notification
{
    use Queueable;

    public function __construct(public readonly Invoice $invoice) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Factura vencida: '.$this->invoice->invoice_number)
            ->line('La factura '.$this->invoice->invoice_number.' ha vencido el '.($this->invoice->due_at?->format('d/m/Y') ?? '—').'.')
            ->line('Total pendiente: '.number_format($this->invoice->total, 2).' €')
            ->action('Ver factura', url('/invoices/'.$this->invoice->id));
    }
}
