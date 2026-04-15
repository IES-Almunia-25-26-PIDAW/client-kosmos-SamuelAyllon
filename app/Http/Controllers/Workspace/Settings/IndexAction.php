<?php

namespace App\Http\Controllers\Clinic\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $clinic = $request->user()->currentClinic();

        return Inertia::render('clinic/settings/index', [
            'clinic' => $clinic,
        ]);
    }
}
