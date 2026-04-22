<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SessionRecording extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_id', 'audio_path', 'transcription', 'ai_summary',
        'transcription_status', 'patient_consent_given_at',
        'summarized_at', 'language', 'duration_seconds',
    ];

    protected function casts(): array
    {
        return [
            'patient_consent_given_at' => 'datetime',
            'summarized_at' => 'datetime',
            'duration_seconds' => 'integer',
        ];
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function transcriptionSegments()
    {
        return $this->hasMany(TranscriptionSegment::class)->orderBy('started_at_ms');
    }

    public function hasPatientConsent(): bool
    {
        return $this->patient_consent_given_at !== null;
    }
}
