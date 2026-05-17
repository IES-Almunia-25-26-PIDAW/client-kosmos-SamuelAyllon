<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Versión encolable del email de reset de contraseña.
 *
 * Misma motivación que [[QueuedVerifyEmail]]: el envío síncrono por SMTP
 * cuelga la request de `/forgot-password` cuando el proveedor (Gmail SMTP
 * con app password caducada en Railway) no responde, y PHP la mata por
 * max_execution_time dejando al usuario sin feedback.
 */
class QueuedResetPassword extends ResetPassword implements ShouldQueue
{
    use Queueable;
}
