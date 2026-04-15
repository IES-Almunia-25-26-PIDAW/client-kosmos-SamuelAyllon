<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Appointment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'workspace_id', 'patient_id', 'professional_id', 'service_id',
        'starts_at', 'ends_at', 'status', 'modality',
        'meeting_room_id', 'meeting_url',
        'cancellation_reason', 'cancelled_by', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at'   => 'datetime',
        ];
    }

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function professional()
    {
        return $this->belongsTo(User::class, 'professional_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function sessionRecording()
    {
        return $this->hasOne(SessionRecording::class);
    }

    public function invoiceItems()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function cancelledBy()
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }

    public function notes()
    {
        return $this->hasMany(Note::class);
    }

    public function agreements()
    {
        return $this->hasMany(Agreement::class);
    }

    public function kosmoBriefings()
    {
        return $this->hasMany(KosmoBriefing::class);
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
