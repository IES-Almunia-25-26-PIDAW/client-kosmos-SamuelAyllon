<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $professional_profile_id
 * @property string $name
 * @property string|null $description
 * @property int $duration_minutes
 * @property string|null $price
 * @property string|null $color
 * @property bool $is_active
 * @property string $modality
 * @property-read \App\Models\ProfessionalProfile $professionalProfile
 */
class OfferedConsultation extends Model
{
    use HasFactory;

    protected $fillable = [
        'professional_profile_id',
        'name',
        'description',
        'duration_minutes',
        'price',
        'color',
        'is_active',
        'modality',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'duration_minutes' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function professionalProfile(): BelongsTo
    {
        return $this->belongsTo(ProfessionalProfile::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'service_id');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeForProfile(Builder $query, int $professionalProfileId): Builder
    {
        return $query->where('professional_profile_id', $professionalProfileId);
    }
}
