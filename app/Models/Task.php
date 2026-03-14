<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Task extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'project_id',
        'name',
        'description',
        'priority',
        'status',
        'due_date',
        'completed_at',
        'user_modified_at',
    ];

    protected function casts(): array
    {
        return [
            'due_date' => 'date',
            'completed_at' => 'datetime',
            'user_modified_at' => 'datetime',
        ];
    }

    // ==================== RELACIONES ====================

    /**
     * Obtener el usuario de la tarea
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtener el proyecto de la tarea (nullable)
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // ==================== SCOPES ====================

    /**
     * Filtrar tareas activas (no eliminadas)
     */
    public function scopeActive($query)
    {
        return $query->whereNull('deleted_at');
    }

    /**
     * Filtrar tareas pendientes
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Filtrar tareas completadas
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Filtrar por usuario
     */
    public function scopeForUser($query, User $user)
    {
        return $query->where('user_id', $user->id);
    }

    /**
     * Ordenar por prioridad
     */
    public function scopeByPriority($query)
    {
        return $query->orderByRaw("
            CASE priority
                WHEN 'high' THEN 1
                WHEN 'medium' THEN 2
                WHEN 'low' THEN 3
            END
        ");
    }

    /**
     * Tareas vencidas
     */
    public function scopeOverdue($query)
    {
        return $query->where('status', 'pending')
            ->whereNotNull('due_date')
            ->where('due_date', '<', now()->toDateString());
    }

    /**
     * Tareas que vencen hoy
     */
    public function scopeDueToday($query)
    {
        return $query->where('status', 'pending')
            ->whereDate('due_date', now()->toDateString());
    }

    /**
     * Tareas que vencen pronto (próximos 7 días)
     */
    public function scopeDueSoon($query)
    {
        return $query->where('status', 'pending')
            ->whereNotNull('due_date')
            ->whereBetween('due_date', [
                now()->toDateString(),
                now()->addDays(7)->toDateString()
            ]);
    }

    // ==================== MÉTODOS HELPER ====================

    /**
     * Marcar como completada
     */
    public function markAsCompleted(): void
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
            'user_modified_at' => now(),
        ]);
    }

    /**
     * Marcar como pendiente
     */
    public function markAsPending(): void
    {
        $this->update([
            'status' => 'pending',
            'completed_at' => null,
            'user_modified_at' => now(),
        ]);
    }

    /**
     * Obtener label del estado
     */
    public function getStatusLabel(): string
    {
        return match($this->status) {
            'pending' => 'Pendiente',
            'completed' => 'Completada',
            default => 'Desconocido',
        };
    }

    /**
     * Obtener label de prioridad
     */
    public function getPriorityLabel(): string
    {
        return match($this->priority) {
            'low' => 'Baja',
            'medium' => 'Media',
            'high' => 'Alta',
            default => 'Desconocida',
        };
    }

    /**
     * Verificar si está vencida
     */
    public function isOverdue(): bool
    {
        if ($this->status === 'completed' || $this->due_date === null) {
            return false;
        }

        return $this->due_date->isPast();
    }

    /**
     * Verificar si vence hoy
     */
    public function isDueToday(): bool
    {
        if ($this->due_date === null) {
            return false;
        }

        return $this->due_date->isToday();
    }

    /**
     * Obtener días restantes hasta vencimiento
     */
    public function getDaysUntilDue(): ?int
    {
        if ($this->due_date === null) {
            return null;
        }

        // false: devuelve valor negativo si la fecha ya pasó (tarea vencida)
        return now()->diffInDays($this->due_date, false);
    }
}