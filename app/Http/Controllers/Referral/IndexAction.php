<?php

namespace App\Http\Controllers\Referral;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $sent = $user->referralsSent()
            ->with(['toProfessional', 'patient.user'])
            ->latest()
            ->get();

        $received = $user->referralsReceived()
            ->with(['fromProfessional', 'patient.user'])
            ->latest()
            ->get();

        return Inertia::render('professional/referrals/index', [
            'sent' => $sent,
            'received' => $received,
        ]);
    }
}
