<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProfessionalApprovedNotification extends Notification
{
    use Queueable;

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Tu cuenta de Kosmos ha sido aprobada')
            ->greeting('¡Bienvenido, '.$notifiable->name.'!')
            ->line('Hemos verificado tu perfil profesional. Ya puedes empezar a trabajar en Kosmos.')
            ->action('Ir a mi panel', route('professional.dashboard'))
            ->line('Si tienes cualquier duda, responde a este correo y te ayudaremos.');
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'professional_approved',
            'message' => 'Tu cuenta ha sido aprobada. Ya puedes empezar a trabajar.',
            'verified_at' => optional($notifiable->professionalProfile?->verified_at)->toIso8601String(),
        ];
    }
}
