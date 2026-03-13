<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'project_id',
        'action_type',
        'input_context',
        'output_text',
    ];

    protected function casts(): array
    {
        return [
            'input_context' => 'array',
            'created_at' => 'datetime',
        ];
    }

    // ==================== RELACIONES ====================

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
