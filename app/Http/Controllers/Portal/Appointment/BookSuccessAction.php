<?php

namespace App\Http\Controllers\Portal\Appointment;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class BookSuccessAction extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('patient/appointments/book-success');
    }
}
