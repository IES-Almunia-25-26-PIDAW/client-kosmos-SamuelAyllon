<?php

namespace App\Models;

use Database\Factories\CollaborationAgreementFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read User $professionalA
 * @property-read User $professionalB
 */
class CollaborationAgreement extends Model
{
    /** @use HasFactory<CollaborationAgreementFactory> */
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
            'end_date' => 'date',
            'terms' => 'array',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function professionalA(): BelongsTo
    {
        return $this->belongsTo(User::class, 'professional_a_id');
    }

    /** @return BelongsTo<User, $this> */
    public function professionalB(): BelongsTo
    {
        return $this->belongsTo(User::class, 'professional_b_id');
    }

    /** @return BelongsTo<Workspace, $this> */
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
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
    public function scopeForProfessional(Builder $query, int $userId): Builder
    {
        return $query->where(function (Builder $q) use ($userId): void {
            $q->where('professional_a_id', $userId)
                ->orWhere('professional_b_id', $userId);
        });
    }
}
