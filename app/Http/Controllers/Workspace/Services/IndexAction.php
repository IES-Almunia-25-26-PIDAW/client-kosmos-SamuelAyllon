<?php

namespace App\Http\Controllers\Clinic\Services;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $clinic   = $request->user()->currentClinic();
        $services = $clinic->services()->orderBy('name')->get();

        return Inertia::render('clinic/services/index', [
            'clinic'   => $clinic,
            'services' => $services,
        ]);
    }
}
