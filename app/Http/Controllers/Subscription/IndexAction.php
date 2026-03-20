<?php

namespace App\Http\Controllers\Subscription;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(): Response
    {
        $user = Auth::user();
        $subscription = $user->subscription;

        return Inertia::render('subscription/index', [
            'subscription' => $subscription,
            'plans' => [
                [
                    'key' => 'free',
                    'name' => 'Gratuito',
                    'price' => 0,
                    'features' => [
                        'Notas ilimitadas',
                        '1 cliente',
                        'Hasta 5 tareas activas',
                    ],
                ],
                [
                    'key' => 'premium_monthly',
                    'name' => 'Solo Mensual',
                    'price' => 11.99,
                    'features' => [
                        'Clientes ilimitados',
                        'Tareas ilimitadas',
                        'Recursos por cliente',
                        'IA contextual (3 acciones)',
                    ],
                ],
                [
                    'key' => 'premium_yearly',
                    'name' => 'Solo Anual',
                    'price' => 119,
                    'features' => [
                        'Todo lo de Solo Mensual',
                        'Ahorra ~2 meses',
                    ],
                ],
            ],
        ]);
    }
}
