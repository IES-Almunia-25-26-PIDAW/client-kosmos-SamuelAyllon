<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $this->authorize('viewAny', Patient::class);

        $patients = Patient::where('user_id', $request->user()->id)
            ->where('is_active', true)
            ->orderBy('project_name')
            ->get();

        return Inertia::render('patients/index', [
            'patients' => $patients,
        ]);
    }
}
