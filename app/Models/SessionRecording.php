<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SessionRecording extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_id', 'audio_path', 'transcription', 'ai_summary',
        'transcription_status', 'summarized_at', 'language', 'duration_seconds',
    ];

    protected function casts(): array
    {
        return [
            'summarized_at'    => 'datetime',
            'duration_seconds' => 'integer',
        ];
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }
}
