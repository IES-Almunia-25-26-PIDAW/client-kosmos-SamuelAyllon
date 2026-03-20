<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutRequest;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class StoreAction extends Controller
{
    public function __invoke(CheckoutRequest $request): RedirectResponse
    {
        $user = Auth::user();
        $data = $request->validated();

        $prices = [
            'premium_monthly' => 11.99,
            'premium_yearly' => 119,
        ];

        $payment = Payment::create([
            'user_id'      => $user->id,
            'plan'         => $data['plan'],
            'amount'       => $prices[$data['plan']],
            'status'       => 'pending',
            'payment_method' => 'card',
            'transaction_id' => Payment::generateTransactionId(),
            // Solo almacenamos los últimos 4 dígitos de la tarjeta (PCI-DSS)
            'card_last_four' => substr($data['card_number'], -4),
        ]);

        // process() simula la pasarela: 80% éxito / 20% fallo
        // En caso de éxito actualiza la suscripción y el rol del usuario
        $success = $payment->process();

        if ($success) {
            return redirect()->route('subscription.index')
                ->with('success', '¡Suscripción activada! Bienvenido a Premium.');
        }

        return redirect()->back()
            ->withErrors(['payment' => 'El pago no pudo procesarse. Por favor, inténtalo de nuevo.']);
    }
}
