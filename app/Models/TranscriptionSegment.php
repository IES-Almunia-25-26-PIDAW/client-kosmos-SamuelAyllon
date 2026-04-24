<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TranscriptionSegment extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_recording_id', 'speaker_user_id', 'text',
        'position', 'started_at_ms', 'ended_at_ms',
    ];

    protected function casts(): array
    {
        return [
            'position' => 'integer',
            'started_at_ms' => 'integer',
            'ended_at_ms' => 'integer',
            'text' => 'encrypted',
        ];
    }

    public function sessionRecording(): BelongsTo
    {
        return $this->belongsTo(SessionRecording::class);
    }

    public function speaker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'speaker_user_id');
    }
}
