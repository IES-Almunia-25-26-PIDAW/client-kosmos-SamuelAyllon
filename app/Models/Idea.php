<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Idea extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'project_id',
        'name',
        'description',
        'priority',
        'status',
        'source',
        'user_modified_at',
    ];

    protected function casts(): array
    {
        return [
            'user_modified_at' => 'datetime',
        ];
    }

    // ==================== RELACIONES ====================

    /**
     * Obtener el usuario de la idea
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtener el cliente/proyecto de la idea (nullable)
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // ==================== SCOPES ====================

    /**
     * Filtrar ideas activas
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Filtrar ideas resueltas
     */
    public function scopeResolved($query)
    {
        return $query->where('status', 'resolved');
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
     * Filtrar ideas creadas manualmente
     */
    public function scopeManual($query)
    {
        return $query->where('source', 'manual');
    }

    /**
     * Filtrar ideas desde voz
     */
    public function scopeFromVoice($query)
    {
        return $query->where('source', 'voice');
    }

    /**
     * Filtrar ideas desde IA
     */
    public function scopeFromAiSuggestion($query)
    {
        return $query->where('source', 'ai_suggestion');
    }

    // ==================== MÉTODOS HELPER ====================

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
     * Obtener label de fuente
     */
    public function getSourceLabel(): string
    {
        return match($this->source) {
            'manual' => 'Manual',
            'voice' => 'Voz',
            'ai_suggestion' => 'Sugerencia IA',
            default => 'Desconocida',
        };
    }

    /**
     * Obtener label de estado
     */
    public function getStatusLabel(): string
    {
        return match($this->status) {
            'active' => 'Activa',
            'resolved' => 'Resuelta',
            default => 'Desconocido',
        };
    }

    /**
     * Marcar como resuelta
     */
    public function markAsResolved(): void
    {
        $this->update([
            'status' => 'resolved',
            'user_modified_at' => now(),
        ]);
    }

    /**
     * Marcar como activa
     */
    public function markAsActive(): void
    {
        $this->update([
            'status' => 'active',
            'user_modified_at' => now(),
        ]);
    }

    /**
     * Convertir idea en tarea
     */
    public function convertToTask(?int $projectId = null): Task
    {
        $task = Task::create([
            'user_id' => $this->user_id,
            'project_id' => $projectId,
            'name' => $this->name,
            'description' => $this->description,
            'priority' => $this->priority,
            'status' => 'pending',
        ]);

        // Marcar idea como resuelta
        $this->markAsResolved();

        return $task;
    }
}