<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $workspace_id
 * @property int $patient_id
 * @property int $professional_id
 * @property int|null $service_id
 * @property \Illuminate\Support\Carbon $starts_at
 * @property \Illuminate\Support\Carbon $ends_at
 * @property \Illuminate\Support\Carbon|null $patient_joined_at
 * @property \Illuminate\Support\Carbon|null $professional_joined_at
 * @property string $status
 * @property string|null $modality
 * @property string|null $meeting_room_id
 * @property string|null $meeting_url
 * @property int|null $cancelled_by
 * @property string|null $cancellation_reason
 * @property string|null $notes
 * @property-read \App\Models\User|null $patient
 * @property-read \App\Models\User|null $professional
 * @property-read \App\Models\Service|null $service
 * @property-read \App\Models\SessionRecording|null $sessionRecording
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Agreement> $agreements
 */
class Appointment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'workspace_id', 'patient_id', 'professional_id', 'service_id',
        'starts_at', 'ends_at', 'status', 'modality',
        'meeting_room_id', 'meeting_url', 'external_calendar_event_id',
        'patient_joined_at', 'professional_joined_at',
        'cancellation_reason', 'cancelled_by', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'patient_joined_at' => 'datetime',
            'professional_joined_at' => 'datetime',
        ];
    }

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function professional(): BelongsTo
    {
        return $this->belongsTo(User::class, 'professional_id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function sessionRecording(): HasOne
    {
        return $this->hasOne(SessionRecording::class);
    }

    public function invoiceItems(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function cancelledBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }

    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }

    public function agreements(): HasMany
    {
        return $this->hasMany(Agreement::class);
    }

    public function kosmoBriefings(): HasMany
    {
        return $this->hasMany(KosmoBriefing::class);
    }

    /**
     * Window: starts_at - 10min ≤ now ≤ ends_at + 15min, status pending or confirmed or in_progress.
     */
    public function canBeJoinedNow(): bool
    {
        return now()->greaterThanOrEqualTo($this->starts_at->subMinutes(10))
            && now()->lessThanOrEqualTo($this->ends_at->addMinutes(15))
            && in_array($this->status, ['pending', 'confirmed', 'in_progress'], strict: true);
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isConfirmed(): bool
    {
        return $this->status === 'confirmed';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }
}
