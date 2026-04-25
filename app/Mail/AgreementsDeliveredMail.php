<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AgreementsDeliveredMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param  Collection<int, \App\Models\Agreement>  $agreements
     */
    public function __construct(
        public readonly Appointment $appointment,
        public readonly Collection $agreements,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Acuerdos de tu sesión en ClientKosmos',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.agreements-delivered',
        );
    }
}
