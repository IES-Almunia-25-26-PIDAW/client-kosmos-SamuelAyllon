<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read \App\Models\User $user
 */
class ProfessionalProfile extends Model
{
    use HasFactory;

    protected $table = 'professional_profiles';

    protected $fillable = [
        'user_id', 'license_number', 'collegiate_number',
        'specialties', 'verification_status', 'bio', 'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'specialties' => 'array',
            'verified_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isVerified(): bool
    {
        return $this->verification_status === 'verified';
    }
}
