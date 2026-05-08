<?php

namespace App\Http\Controllers\OfferedConsultations;

use App\Http\Controllers\Controller;
use App\Models\OfferedConsultation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CreateAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $this->authorize('create', OfferedConsultation::class);

        return Inertia::render('professional/offeredConsultations/create');
    }
}
