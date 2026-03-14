<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'plan',
        'amount',
        'status',
        'payment_method',
        'transaction_id',
        'card_last_four',
    ];

    // ==================== RELACIONES ====================

    /**
     * Obtener el usuario del pago
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // ==================== MÉTODOS HELPER ====================

    /**
     * Generar un ID de transacción único
     */
    public static function generateTransactionId(): string
    {
        return 'TXN_' . strtoupper(Str::random(16));
    }

    /**
     * Procesar el pago (simulado)
     * 
     * Simula un procesamiento de pago con:
     * - 80% de éxito
     * - 20% de fallo
     */
    public function process(): bool
    {
        // Simular procesamiento (80% éxito, 20% fallo)
        $success = rand(1, 100) <= 80;

        if ($success) {
            return DB::transaction(function () {
                $this->update(['status' => 'completed']);

                // Actualizar suscripción del usuario
                $subscription = $this->user->subscription;
                if ($subscription) {
                    $subscription->upgradeToPremium($this->plan);
                }

                return true;
            });
        } else {
            $this->update(['status' => 'failed']);
            return false;
        }
    }

    /**
     * Verificar si el pago fue exitoso
     */
    public function isSuccessful(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Verificar si el pago falló
     */
    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }

    /**
     * Verificar si el pago está pendiente
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Obtener el nombre formateado del plan
     */
    public function getPlanName(): string
    {
        return match($this->plan) {
            'premium_monthly' => 'Premium Mensual',
            'premium_yearly' => 'Premium Anual',
            default => 'Desconocido',
        };
    }

    /**
     * Obtener el estado formateado
     */
    public function getStatusLabel(): string
    {
        return match($this->status) {
            'pending' => 'Pendiente',
            'completed' => 'Completado',
            'failed' => 'Fallido',
            default => 'Desconocido',
        };
    }
}