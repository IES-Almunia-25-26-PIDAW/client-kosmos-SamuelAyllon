<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read \App\Models\User $professionalA
 * @property-read \App\Models\User $professionalB
 */
class CollaborationAgreement extends Model
{
    use HasFactory;

    protected $table = 'collaboration_agreements';

    protected $fillable = [
        'professional_a_id', 'professional_b_id', 'workspace_id',
        'start_date', 'end_date', 'status', 'terms',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date'   => 'date',
            'terms'      => 'array',
        ];
    }

    public function professionalA(): BelongsTo
    {
        return $this->belongsTo(User::class, 'professional_a_id');
    }

    public function professionalB(): BelongsTo
    {
        return $this->belongsTo(User::class, 'professional_b_id');
    }

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeForProfessional($query, int $userId)
    {
        return $query->where(function ($q) use ($userId) {
            $q->where('professional_a_id', $userId)
              ->orWhere('professional_b_id', $userId);
        });
    }
}
