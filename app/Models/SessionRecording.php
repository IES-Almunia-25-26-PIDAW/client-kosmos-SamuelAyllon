<?php

namespace App\Models;

use Database\Factories\SessionRecordingFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

/**
 * @property int $appointment_id
 * @property string|null $ai_summary
 * @property string|null $transcription
 * @property Carbon|null $patient_consent_given_at
 * @property Carbon|null $summarized_at
 * @property-read Appointment|null $appointment
 */
class SessionRecording extends Model
{
    /** @use HasFactory<SessionRecordingFactory> */
    use HasFactory;

    use LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['transcription_status', 'summarized_at', 'patient_consent_given_at'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

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
            'transcription' => 'encrypted',
            'ai_summary' => 'encrypted',
        ];
    }

    /** @return BelongsTo<Appointment, $this> */
    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    /** @return HasMany<TranscriptionSegment, $this> */
    public function transcriptionSegments(): HasMany
    {
        return $this->hasMany(TranscriptionSegment::class)->orderBy('started_at_ms');
    }

    public function hasPatientConsent(): bool
    {
        return $this->patient_consent_given_at !== null;
    }
}
