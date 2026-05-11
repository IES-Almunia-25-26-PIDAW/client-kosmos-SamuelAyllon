<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Database\Factories\PatientProfileFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

/**
 * @property int $id
 * @property int $user_id
 * @property bool $is_active
 * @property string $status
 * @property string|null $consultation_reason
 * @property string|null $therapeutic_approach
 * @property Carbon|null $first_session_at
 * @property Carbon|null $last_session_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $user
 * @property-read Collection<int, Appointment> $appointments
 * @property-read Collection<int, Invoice> $invoices
 * @property-read Collection<int, ConsentForm> $consentForms
 */
class PatientProfile extends Model
{
    use BelongsToWorkspace, LogsActivity, SoftDeletes;

    /** @use HasFactory<PatientProfileFactory> */
    use HasFactory;

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
        'consultation_reason', 'therapeutic_approach',
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

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<User, $this> */
    public function professional(): BelongsTo
    {
        return $this->belongsTo(User::class, 'professional_id');
    }

    /** @return HasMany<Appointment, $this> */
    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'patient_id', 'user_id');
    }

    /** @return HasMany<Note, $this> */
    public function notes(): HasMany
    {
        return $this->hasMany(Note::class, 'patient_id');
    }

    /** @return HasMany<Agreement, $this> */
    public function agreements(): HasMany
    {
        return $this->hasMany(Agreement::class, 'patient_id');
    }

    /** @return HasMany<Invoice, $this> */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class, 'patient_id', 'user_id');
    }

    /** @return HasMany<Document, $this> */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'patient_id');
    }

    /** @return HasMany<ConsentForm, $this> */
    public function consentForms(): HasMany
    {
        return $this->hasMany(ConsentForm::class, 'patient_id');
    }

    /** @return HasMany<KosmoBriefing, $this> */
    public function kosmoBriefings(): HasMany
    {
        return $this->hasMany(KosmoBriefing::class, 'patient_id');
    }

    /** @return HasMany<CaseAssignment, $this> */
    public function caseAssignments(): HasMany
    {
        return $this->hasMany(CaseAssignment::class, 'patient_id', 'user_id');
    }

    /** @return BelongsToMany<User, $this> */
    public function professionals(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'case_assignments', 'patient_id', 'professional_id', 'user_id')
            ->withPivot(['workspace_id', 'is_primary', 'role', 'status', 'started_at', 'ended_at', 'notes'])
            ->withTimestamps();
    }

    /** @return HasMany<Referral, $this> */
    public function referrals(): HasMany
    {
        return $this->hasMany(Referral::class, 'patient_id');
    }

    /** @return HasMany<PatientDelegation, $this> */
    public function delegations(): HasMany
    {
        return $this->hasMany(PatientDelegation::class);
    }

    /**
     * Recursos asociados al paciente (documents reused as resources).
     *
     * @return HasMany<Document, $this>
     */
    public function resources(): HasMany
    {
        return $this->hasMany(Document::class, 'patient_id');
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
    public function scopeInactive(Builder $query): Builder
    {
        return $query->where('status', 'inactive');
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeDischarged(Builder $query): Builder
    {
        return $query->where('status', 'discharged');
    }
}
