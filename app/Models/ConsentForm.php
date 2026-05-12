<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class ConsentForm extends Model
{
    use LogsActivity, SoftDeletes;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['consent_type', 'status', 'signed_at', 'expires_at'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    protected $fillable = [
        'patient_id', 'user_id', 'consent_type', 'template_version', 'content_snapshot',
        'status', 'signed_at', 'signature_data', 'signed_ip', 'expires_at',
    ];

    protected $casts = [
        'signed_at' => 'datetime',
        'expires_at' => 'date',
    ];

    /** @return BelongsTo<PatientProfile, $this> */
    public function patient(): BelongsTo
    {
        return $this->belongsTo(PatientProfile::class, 'patient_id');
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
