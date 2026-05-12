<?php

namespace App\Models;

use Database\Factories\CaseAssignmentFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class CaseAssignment extends Model
{
    /** @use HasFactory<CaseAssignmentFactory> */
    use HasFactory;

    protected $table = 'case_assignments';

    protected $fillable = [
        'patient_id', 'professional_id', 'workspace_id',
        'is_primary', 'role', 'status', 'started_at', 'ended_at', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
            'started_at' => 'date',
            'ended_at' => 'date',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function patient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    /** @return BelongsTo<User, $this> */
    public function professional(): BelongsTo
    {
        return $this->belongsTo(User::class, 'professional_id');
    }

    /** @return BelongsTo<Workspace, $this> */
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    /** @return HasOneThrough<PatientProfile, User, $this> */
    public function patientProfile(): HasOneThrough
    {
        return $this->hasOneThrough(
            PatientProfile::class,
            User::class,
            'id',
            'user_id',
            'patient_id',
            'id'
        );
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopePrimary(Builder $query): Builder
    {
        return $query->where('is_primary', true);
    }
}
