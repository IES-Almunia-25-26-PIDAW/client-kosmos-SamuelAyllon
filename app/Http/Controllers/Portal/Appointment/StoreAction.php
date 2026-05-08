<?php

namespace App\Http\Controllers\Portal\Appointment;

use App\Actions\Appointment\CreateAppointment;
use App\Http\Controllers\Controller;
use App\Http\Requests\Portal\StoreAppointmentRequest;
use Illuminate\Http\RedirectResponse;

class StoreAction extends Controller
{
    public function __invoke(StoreAppointmentRequest $request, CreateAppointment $createAppointment): RedirectResponse
    {
        $createAppointment($request->user(), $request->validated());

        return redirect()->route('patient.appointments.book-success');
    }
}
