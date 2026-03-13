<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'status',
        'color',
        'brand_tone',
        'service_scope',
        'key_links',
        'next_deadline',
        'client_notes',
        'user_modified_at',
    ];

    protected function casts(): array
    {
        return [
            'key_links' => 'array',
            'next_deadline' => 'date',
            'user_modified_at' => 'datetime',
        ];
    }

    // ==================== RELACIONES ====================

    /**
     * Obtener el usuario del proyecto
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtener las tareas del proyecto
     */
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Obtener las ideas del proyecto
     */
    public function ideas()
    {
        return $this->hasMany(Idea::class);
    }

    /**
     * Obtener los recursos del proyecto
     */
    public function resources()
    {
        return $this->hasMany(Resource::class);
    }

    // ==================== SCOPES ====================

    /**
     * Filtrar proyectos activos
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Filtrar proyectos inactivos
     */
    public function scopeInactive($query)
    {
        return $query->where('status', 'inactive');
    }

    /**
     * Filtrar proyectos completados
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Filtrar proyectos por usuario
     */
    public function scopeForUser($query, User $user)
    {
        return $query->where('user_id', $user->id);
    }

    // ==================== MÉTODOS HELPER ====================

    /**
     * Obtener resumen de tareas
     */
    public function getTasksSummary(): array
    {
        return [
            'total' => $this->tasks()->count(),
            'pending' => $this->tasks()->where('status', 'pending')->count(),
            'completed' => $this->tasks()->where('status', 'completed')->count(),
        ];
    }

    /**
     * Obtener porcentaje de progreso
     */
    public function getProgressPercentage(): int
    {
        $total = $this->tasks()->count();
        
        if ($total === 0) {
            return 0;
        }

        $completed = $this->tasks()->where('status', 'completed')->count();
        
        return (int) round(($completed / $total) * 100);
    }

    /**
     * Marcar como activo
     */
    public function markAsActive(): void
    {
        $this->update([
            'status' => 'active',
            'user_modified_at' => now(),
        ]);
    }

    /**
     * Marcar como completado
     */
    public function markAsCompleted(): void
    {
        $this->update([
            'status' => 'completed',
            'user_modified_at' => now(),
        ]);
    }

    /**
     * Obtener label del estado
     */
    public function getStatusLabel(): string
    {
        return match($this->status) {
            'inactive' => 'Inactivo',
            'active' => 'Activo',
            'completed' => 'Completado',
            default => 'Desconocido',
        };
    }
}