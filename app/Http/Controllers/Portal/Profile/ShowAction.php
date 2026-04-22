<?php

namespace App\Http\Controllers\Portal\Profile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user()->load('patientProfile');
        $profile = $user->patientProfile;

        return Inertia::render('patient/profile/show', [
            'user' => $user,
            'profile' => $profile,
        ]);
    }
}
