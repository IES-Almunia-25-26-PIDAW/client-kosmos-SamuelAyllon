<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'user_modified_at',
        'tutorial_completed_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'user_modified_at' => 'datetime',
            'tutorial_completed_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // ==================== RELACIONES ====================

    /**
     * Obtener la suscripción del usuario
     */
    public function subscription()
    {
        return $this->hasOne(Subscription::class);
    }

    /**
     * Obtener los pagos del usuario
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Obtener los proyectos del usuario
     */
    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    /**
     * Obtener las tareas del usuario
     */
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Obtener las ideas del usuario
     */
    public function ideas()
    {
        return $this->hasMany(Idea::class);
    }

    /**
     * Obtener los recursos del usuario
     */
    public function resources()
    {
        return $this->hasMany(Resource::class);
    }

    /**
     * Obtener los logs de IA del usuario
     */
    public function aiLogs()
    {
        return $this->hasMany(AiLog::class);
    }

    // ==================== MÉTODOS HELPER ====================

    /**
     * Verificar si el usuario es free
     */
    public function isFreeUser(): bool
    {
        return $this->hasRole('free_user');
    }

    /**
     * Verificar si el usuario es premium
     */
    public function isPremiumUser(): bool
    {
        return $this->hasRole('premium_user');
    }

    /**
     * Verificar si el usuario es admin
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Verificar si el usuario puede agregar más clientes
     */
    public function canAddProject(): bool
    {
        if ($this->isAdmin() || $this->isPremiumUser()) {
            return true;
        }

        return $this->projects()->count() < 1;
    }

    /**
     * Verificar si el usuario puede agregar más tareas
     */
    public function canAddTask(): bool
    {
        // Admin y premium: ilimitadas
        if ($this->isAdmin() || $this->isPremiumUser()) {
            return true;
        }

        // Free user: máximo 5 tareas activas (pending)
        $activeTasksCount = $this->tasks()
            ->where('status', 'pending')
            ->count();

        return $activeTasksCount < 5;
    }

    /**
     * Obtener el conteo de tareas activas
     */
    public function getActiveTasksCount(): int
    {
        return $this->tasks()
            ->where('status', 'pending')
            ->count();
    }

    /**
     * Obtener el conteo de tareas completadas este mes
     */
    public function getCompletedThisMonthCount(): int
    {
        return $this->tasks()
            ->where('status', 'completed')
            ->whereMonth('completed_at', now()->month)
            ->whereYear('completed_at', now()->year)
            ->count();
    }

    /**
     * Obtener datos para el dashboard
     */
    public function getDashboardData(): array
    {
        return [
            'active_tasks' => $this->getActiveTasksCount(),
            'completed_this_month' => $this->getCompletedThisMonthCount(),
            'total_ideas' => $this->ideas()->where('status', 'active')->count(),
            'total_projects' => $this->projects()->where('status', 'active')->count(),
            'is_premium' => $this->isPremiumUser() || $this->isAdmin(),
        ];
    }

    /**
     * Verificar si el usuario ha completado el tutorial
     */
    public function hasCompletedTutorial(): bool
    {
        return $this->tutorial_completed_at !== null;
    }

    /**
     * Marcar el tutorial como completado
     */
    public function completeTutorial(): void
    {
        $this->update(['tutorial_completed_at' => now()]);
    }
}