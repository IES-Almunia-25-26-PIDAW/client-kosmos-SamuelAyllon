<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConsultingSession extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'patient_id', 'user_id', 'scheduled_at', 'started_at', 'ended_at',
        'duration_minutes', 'status', 'ai_summary', 'ai_summary_generated',
    ];

    protected $casts = [
        'scheduled_at'         => 'datetime',
        'started_at'           => 'datetime',
        'ended_at'             => 'datetime',
        'ai_summary_generated' => 'boolean',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function notes()
    {
        return $this->hasMany(Note::class);
    }

    public function agreements()
    {
        return $this->hasMany(Agreement::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function briefings()
    {
        return $this->hasMany(KosmoBriefing::class);
    }
}
