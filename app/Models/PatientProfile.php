<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Database\Factories\PatientProfileFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

/**
 * @property-read \App\Models\User $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Appointment> $appointments
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Invoice> $invoices
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ConsentForm> $consentForms
 */
class PatientProfile extends Model
{
    use BelongsToWorkspace, HasFactory, LogsActivity, SoftDeletes;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status', 'is_active', 'first_session_at', 'last_session_at'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    protected static function newFactory(): PatientProfileFactory
    {
        return PatientProfileFactory::new();
    }

    protected $table = 'patient_profiles';

    protected $fillable = [
        'user_id', 'workspace_id', 'professional_id',
        'is_active', 'clinical_notes', 'diagnosis', 'treatment_plan',
        'referral_source', 'status', 'first_session_at', 'last_session_at',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'first_session_at' => 'datetime',
            'last_session_at' => 'datetime',
            'clinical_notes' => 'encrypted',
            'diagnosis' => 'encrypted',
            'treatment_plan' => 'encrypted',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function professional(): BelongsTo
    {
        return $this->belongsTo(User::class, 'professional_id');
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'patient_id', 'user_id');
    }

    public function notes(): HasMany
    {
        return $this->hasMany(Note::class, 'patient_id');
    }

    public function agreements(): HasMany
    {
        return $this->hasMany(Agreement::class, 'patient_id');
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class, 'patient_id', 'user_id');
    }

    /** @return HasMany<Document, $this> */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'patient_id');
    }

    public function consentForms(): HasMany
    {
        return $this->hasMany(ConsentForm::class, 'patient_id');
    }

    public function kosmoBriefings(): HasMany
    {
        return $this->hasMany(KosmoBriefing::class, 'patient_id');
    }

    public function caseAssignments(): HasMany
    {
        return $this->hasMany(CaseAssignment::class, 'patient_id', 'user_id');
    }

    public function professionals(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'case_assignments', 'patient_id', 'professional_id', 'user_id')
            ->withPivot(['workspace_id', 'is_primary', 'role', 'status', 'started_at', 'ended_at', 'notes'])
            ->withTimestamps();
    }

    public function referrals(): HasMany
    {
        return $this->hasMany(Referral::class, 'patient_id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeInactive($query)
    {
        return $query->where('status', 'inactive');
    }

    public function scopeDischarged($query)
    {
        return $query->where('status', 'discharged');
    }
}
