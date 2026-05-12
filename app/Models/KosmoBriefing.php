<?php

namespace App\Models;

use Database\Factories\KosmoBriefingFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KosmoBriefing extends Model
{
    /** @use HasFactory<KosmoBriefingFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id', 'patient_id', 'appointment_id',
        'type', 'content', 'is_read', 'for_date',
    ];

    protected $casts = [
        'content' => 'array',
        'is_read' => 'boolean',
        'for_date' => 'date',
    ];

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<PatientProfile, $this> */
    public function patient(): BelongsTo
    {
        return $this->belongsTo(PatientProfile::class, 'patient_id');
    }

    /** @return BelongsTo<Appointment, $this> */
    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }
}
