<?php

namespace App\Http\Controllers\Professional;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PendingApprovalAction extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if (! $user->isProfessional()) {
            return redirect()->route('dashboard');
        }

        if ($user->professionalProfile?->isVerified()) {
            return redirect()->route('professional.dashboard');
        }

        return Inertia::render('professional/pending-approval', [
            'email' => $user->email,
        ]);
    }
}
