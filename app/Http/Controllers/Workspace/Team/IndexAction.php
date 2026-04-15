<?php

namespace App\Http\Controllers\Clinic\Team;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $clinic = $request->user()->currentClinic();

        $members = $clinic->users()
            ->withPivot(['role', 'can_view_all_patients', 'joined_at', 'is_active'])
            ->get();

        return Inertia::render('clinic/team/index', [
            'clinic'  => $clinic,
            'members' => $members,
        ]);
    }
}
