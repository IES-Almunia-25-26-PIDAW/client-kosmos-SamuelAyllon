<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(): Response
    {
        $user = Auth::user();

        if ($user->isPremiumUser()) {
            return Inertia::render('checkout/index', [
                'alreadyPremium' => true,
                'subscription' => $user->subscription,
            ]);
        }

        return Inertia::render('checkout/index', [
            'alreadyPremium' => false,
            'plans' => [
                [
                    'key' => 'premium_monthly',
                    'name' => 'Solo Mensual',
                    'price' => 11.99,
                    'description' => 'Facturado mensualmente',
                ],
                [
                    'key' => 'premium_yearly',
                    'name' => 'Solo Anual',
                    'price' => 119,
                    'description' => 'Facturado anualmente — ahorra ~2 meses',
                ],
            ],
        ]);
    }
}
