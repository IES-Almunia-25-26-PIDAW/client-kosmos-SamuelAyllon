<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'project_id',
        'name',
        'description',
        'url',
        'type',
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
     * Obtener el usuario del recurso
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtener el proyecto/cliente del recurso
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // ==================== SCOPES ====================

    /**
     * Filtrar por usuario
     */
    public function scopeForUser($query, User $user)
    {
        return $query->where('user_id', $user->id);
    }

    /**
     * Filtrar por proyecto/cliente
     */
    public function scopeInProject($query, Project $project)
    {
        return $query->where('project_id', $project->id);
    }

    /**
     * Filtrar por tipo
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Filtrar solo links
     */
    public function scopeLinks($query)
    {
        return $query->where('type', 'link');
    }

    /**
     * Filtrar solo documentos
     */
    public function scopeDocuments($query)
    {
        return $query->where('type', 'document');
    }

    /**
     * Filtrar solo videos
     */
    public function scopeVideos($query)
    {
        return $query->where('type', 'video');
    }

    // ==================== MÉTODOS HELPER ====================

    /**
     * Obtener label del tipo
     */
    public function getTypeLabel(): string
    {
        return match($this->type) {
            'link' => 'Enlace',
            'document' => 'Documento',
            'video' => 'Video',
            'image' => 'Imagen',
            'other' => 'Otro',
            default => 'Desconocido',
        };
    }

    /**
     * Verificar si tiene URL
     */
    public function hasUrl(): bool
    {
        return !empty($this->url);
    }

    /**
     * Obtener dominio de la URL
     */
    public function getDomain(): ?string
    {
        if (!$this->hasUrl()) {
            return null;
        }

        $parsedUrl = parse_url($this->url);
        return $parsedUrl['host'] ?? null;
    }
}