<?php

namespace App\Models;

use Database\Factories\WorkspaceFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $creator_id
 * @property string $type
 * @property string $name
 * @property array<string, mixed>|null $settings
 * @property string|null $location_address
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read int|null $members_count
 * @property-read User $creator
 */
class Workspace extends Model
{
    /** @use HasFactory<WorkspaceFactory> */
    use HasFactory;

    use SoftDeletes;

    public const TYPE_PERSONAL = 'personal';

    public const TYPE_COLLABORATIVE = 'collaborative';

    protected $fillable = [
        'creator_id', 'type', 'name', 'slug', 'tax_name', 'tax_id', 'tax_address',
        'phone', 'email', 'logo_path', 'location_address', 'settings',
    ];

    protected function casts(): array
    {
        return [
            'settings' => 'array',
        ];
    }

    public function isPersonal(): bool
    {
        return $this->type === self::TYPE_PERSONAL;
    }

    public function isCollaborative(): bool
    {
        return $this->type === self::TYPE_COLLABORATIVE;
    }

    public function isOnlineOnly(): bool
    {
        return is_null($this->location_address);
    }

    public function hasCollaborators(): bool
    {
        return $this->members()->count() > 1;
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    /** @return BelongsToMany<User, $this> */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'workspace_members')
            ->withPivot(['role', 'joined_at', 'is_active'])
            ->withTimestamps();
    }

    /** @return HasMany<Appointment, $this> */
    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    /** @return HasMany<Invoice, $this> */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    /** @return HasMany<Message, $this> */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    /** @return HasMany<CollaborationAgreement, $this> */
    public function collaborationAgreements(): HasMany
    {
        return $this->hasMany(CollaborationAgreement::class);
    }
}
