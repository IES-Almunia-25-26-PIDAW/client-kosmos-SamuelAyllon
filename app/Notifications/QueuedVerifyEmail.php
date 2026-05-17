<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Versión encolable de la notificación de verificación de email.
 *
 * El listener por defecto `SendEmailVerificationNotification` ejecuta el envío
 * de forma síncrona dentro de la request de registro. En despliegues donde el
 * SMTP cuelga (Gmail SMTP desde Railway con app password caducada), PHP llega
 * a su max_execution_time y mata la request: el usuario queda creado en BD
 * pero la página se queda cargando. Empujar el envío a la cola permite que la
 * request de registro responda inmediatamente y deja que el worker reintente.
 */
class QueuedVerifyEmail extends VerifyEmail implements ShouldQueue
{
    use Queueable;
}
