<?php

namespace App\Policies;

use App\Models\SessionRecording;
use App\Models\User;

class SessionRecordingPolicy
{
    /**
     * Solo el profesional responsable de la cita puede ver/transcribir.
     * El paciente NO puede leer la transcripción completa en MVP.
     */
    public function view(User $user, SessionRecording $recording): bool
    {
        return $user->id === $recording->appointment?->professional_id
            || $user->isAdmin();
    }

    public function transcribe(User $user, SessionRecording $recording): bool
    {
        return $user->id === $recording->appointment?->professional_id;
    }
}
