<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Inertia\Inertia;
use Inertia\Response;

class CreateAction extends Controller
{
    public function __invoke(): Response
    {
        $this->authorize('create', Patient::class);

        return Inertia::render('patients/create');
    }
}
