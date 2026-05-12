<?php

namespace App\Models;

use Database\Factories\ProfessionalProfileFactory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property-read User $user
 * @property-read Collection<int, OfferedConsultation> $offeredConsultations
 */
class ProfessionalProfile extends Model
{
    /** @use HasFactory<ProfessionalProfileFactory> */
    use HasFactory;

    protected $table = 'professional_profiles';

    protected $fillable = [
        'user_id', 'license_number', 'collegiate_number',
        'specialties', 'verification_status', 'bio', 'city', 'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'specialties' => 'array',
            'verified_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return HasMany<OfferedConsultation, $this> */
    public function offeredConsultations(): HasMany
    {
        return $this->hasMany(OfferedConsultation::class);
    }

    public function isVerified(): bool
    {
        return $this->verification_status === 'verified';
    }
}
