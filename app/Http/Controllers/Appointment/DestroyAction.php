<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DestroyAction extends Controller
{
    public function __invoke(Request $request, Appointment $appointment): RedirectResponse
    {
        $appointment->delete();

        return back()->with('success', 'Cita eliminada.');
    }
}
