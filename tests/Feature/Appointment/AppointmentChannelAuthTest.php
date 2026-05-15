<?php

use App\Models\Appointment;
use Illuminate\Broadcasting\Broadcasters\Broadcaster;
use Illuminate\Support\Facades\Broadcast;

function appointmentChannelCallback(): Closure
{
    $broadcaster = Broadcast::driver();
    $channels = (function () {
        /** @var Broadcaster $this */
        return $this->channels;
    })->call($broadcaster);

    expect($channels)->toHaveKey('appointment.{appointmentId}');

    return $channels['appointment.{appointmentId}'];
}

it('patient is authorized on the appointment channel', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id'      => $patient->id,
        'workspace_id'    => null,
    ]);

    $callback = appointmentChannelCallback();

    expect($callback($patient, $appointment->id))->toBeTrue();
});

it('professional is authorized on the appointment channel', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id'      => $patient->id,
        'workspace_id'    => null,
    ]);

    $callback = appointmentChannelCallback();

    expect($callback($professional, $appointment->id))->toBeTrue();
});

it('a third-party user is denied on the appointment channel', function () {
    $stranger = createProfessional();
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id'      => $patient->id,
        'workspace_id'    => null,
    ]);

    $callback = appointmentChannelCallback();

    expect($callback($stranger, $appointment->id))->toBeFalse();
});

it('returns false when the appointment does not exist', function () {
    $user = createPatient();

    $callback = appointmentChannelCallback();

    expect($callback($user, PHP_INT_MAX))->toBeFalse();
});
