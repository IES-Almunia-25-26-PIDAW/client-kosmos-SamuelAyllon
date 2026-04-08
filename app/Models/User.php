<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, HasRoles, TwoFactorAuthenticatable, SoftDeletes;

    protected $fillable = [
        'name', 'email', 'password', 'role',
        'practice_name', 'specialty', 'city', 'avatar_path',
        'default_rate', 'default_session_duration', 'nif', 'fiscal_address',
        'invoice_prefix', 'invoice_counter', 'invoice_footer_text',
        'rgpd_template', 'data_retention_months', 'privacy_policy_url',
        'tutorial_completed_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at'     => 'datetime',
            'tutorial_completed_at' => 'datetime',
            'password'              => 'hashed',
            'default_rate'          => 'decimal:2',
            'data_retention_months' => 'integer',
            'invoice_counter'       => 'integer',
        ];
    }

    // ==================== RELACIONES ====================

    public function patients()
    {
        return $this->hasMany(Patient::class);
    }

    public function sessions()
    {
        return $this->hasMany(ConsultingSession::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    // ==================== MÉTODOS HELPER ====================

    public function isAdmin(): bool
    {
        return $this->role === 'admin' || $this->hasRole('admin');
    }

    public function isProfessional(): bool
    {
        return $this->role === 'professional';
    }

    public function hasCompletedTutorial(): bool
    {
        return $this->tutorial_completed_at !== null;
    }

    public function completeTutorial(): void
    {
        $this->update(['tutorial_completed_at' => now()]);
    }
}
