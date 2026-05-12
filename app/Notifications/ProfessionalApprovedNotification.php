<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProfessionalApprovedNotification extends Notification
{
    use Queueable;

    /** @return array<int, string> */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $name = $notifiable instanceof User ? $notifiable->name : '';

        return (new MailMessage)
            ->subject('Tu cuenta de Kosmos ha sido aprobada')
            ->greeting('¡Bienvenido, '.$name.'!')
            ->line('Hemos verificado tu perfil profesional. Ya puedes empezar a trabajar en Kosmos.')
            ->action('Ir a mi panel', route('professional.dashboard'))
            ->line('Si tienes cualquier duda, responde a este correo y te ayudaremos.');
    }

    /** @return array<string, mixed> */
    public function toDatabase(object $notifiable): array
    {
        $verifiedAt = $notifiable instanceof User
            ? $notifiable->professionalProfile?->verified_at
            : null;

        return [
            'type' => 'professional_approved',
            'message' => 'Tu cuenta ha sido aprobada. Ya puedes empezar a trabajar.',
            'verified_at' => $verifiedAt?->toIso8601String(),
        ];
    }
}
