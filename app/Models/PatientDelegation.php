<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientDelegation extends Model
{
    protected $table = 'patient_delegations';

    protected $fillable = [
        'patient_profile_id',
        'from_professional_id',
        'to_professional_id',
        'workspace_id',
        'reason',
        'delegated_at',
    ];

    protected function casts(): array
    {
        return [
            'delegated_at' => 'datetime',
        ];
    }

    public function patientProfile(): BelongsTo
    {
        return $this->belongsTo(PatientProfile::class);
    }

    public function fromProfessional(): BelongsTo
    {
        return $this->belongsTo(User::class, 'from_professional_id');
    }

    public function toProfessional(): BelongsTo
    {
        return $this->belongsTo(User::class, 'to_professional_id');
    }

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }
}
