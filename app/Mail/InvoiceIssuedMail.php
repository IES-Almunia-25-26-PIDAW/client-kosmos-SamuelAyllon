<?php

namespace App\Mail;

use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InvoiceIssuedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Invoice $invoice,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Tu factura '.$this->invoice->invoice_number.' de ClientKosmos',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.invoice-issued',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
