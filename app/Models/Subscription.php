<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'plan',
        'status',
        'started_at',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    // ==================== RELACIONES ====================

    /**
     * Obtener el usuario de la suscripción
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // ==================== MÉTODOS HELPER ====================

    /**
     * Obtener el precio del plan
     */
    public function getPrice(): float
    {
        return match($this->plan) {
            'free' => 0.00,
            'premium_monthly' => 11.99,
            'premium_yearly' => 119.00,
            default => 0.00,
        };
    }

    /**
     * Obtener la duración del plan en días
     */
    public function getDurationInDays(): ?int
    {
        return match($this->plan) {
            'free' => null,
            'premium_monthly' => 30,
            'premium_yearly' => 365,
            default => null,
        };
    }

    /**
     * Verificar si la suscripción está activa
     */
    public function isActive(): bool
    {
        if ($this->status !== 'active') {
            return false;
        }

        // Free siempre está activo
        if ($this->plan === 'free') {
            return true;
        }

        // Premium: verificar fecha de expiración
        return $this->expires_at === null || $this->expires_at->isFuture();
    }

    /**
     * Actualizar a premium
     */
    public function upgradeToPremium(string $plan): void
    {
        $days = match($plan) {
            'premium_monthly' => 30,
            'premium_yearly'  => 365,
            default           => null,
        };

        $this->update([
            'plan'       => $plan,
            'status'     => 'active',
            'started_at' => now(),
            'expires_at' => $days ? now()->addDays($days) : null,
        ]);

        // Actualizar rol del usuario
        $this->user->syncRoles('premium_user');
    }

    /**
     * Downgrade a free
     */
    public function downgradeToFree(): void
    {
        $this->update([
            'plan' => 'free',
            'status' => 'active',
            'started_at' => now(),
            'expires_at' => null,
        ]);

        // Actualizar rol del usuario
        $this->user->syncRoles('free_user');
    }

    /**
     * Verificar si la suscripción ha expirado
     */
    public function hasExpired(): bool
    {
        if ($this->plan === 'free') {
            return false;
        }

        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    /**
     * Obtener días restantes
     */
    public function getDaysRemaining(): ?int
    {
        if ($this->plan === 'free' || $this->expires_at === null) {
            return null;
        }

        // false: permite valor negativo (suscripción expirada); max(0,...) lo clamp a 0
        return max(0, now()->diffInDays($this->expires_at, false));
    }
}