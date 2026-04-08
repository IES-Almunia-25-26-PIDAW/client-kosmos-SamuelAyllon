<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'project_name', 'brand_tone', 'service_scope',
        'next_deadline', 'email', 'phone', 'avatar_path', 'is_active',
    ];

    protected $casts = [
        'next_deadline'      => 'date',
        'is_active'          => 'boolean',
        'has_valid_consent'  => 'boolean',
        'has_open_agreement' => 'boolean',
    ];

    // ==================== RELACIONES ====================

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sessions()
    {
        return $this->hasMany(ConsultingSession::class);
    }

    public function notes()
    {
        return $this->hasMany(Note::class);
    }

    public function agreements()
    {
        return $this->hasMany(Agreement::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    public function consentForms()
    {
        return $this->hasMany(ConsentForm::class);
    }

    // ==================== SCOPES ====================

    public function scopePaymentPending($q)
    {
        return $q->whereIn('payment_status', ['pending', 'overdue']);
    }

    public function scopeMissingConsent($q)
    {
        return $q->where('has_valid_consent', false);
    }

    public function scopeOpenAgreement($q)
    {
        return $q->where('has_open_agreement', true);
    }

    // ==================== ATRIBUTOS ====================

    public function getStatusesAttribute(): array
    {
        $statuses = [];
        if ($this->payment_status !== 'paid') {
            $statuses[] = $this->payment_status;
        }
        if (! $this->has_valid_consent) {
            $statuses[] = 'noConsent';
        }
        if ($this->has_open_agreement) {
            $statuses[] = 'openDeal';
        }
        return $statuses;
    }
}
