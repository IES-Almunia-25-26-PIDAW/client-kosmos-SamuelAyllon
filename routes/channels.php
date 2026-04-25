<?php

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('appointment.{appointmentId}', function (User $user, int $appointmentId) {
    $appointment = Appointment::find($appointmentId);

    if ($appointment === null) {
        return false;
    }

    return $user->id === $appointment->patient_id
        || $user->id === $appointment->professional_id;
});
