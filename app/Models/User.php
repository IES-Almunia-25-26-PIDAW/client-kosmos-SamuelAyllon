<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

/**
 * @property string $name
 * @property-read PatientProfile|null $patientProfile
 * @property-read ProfessionalProfile|null $professionalProfile
 */
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory;

    use HasRoles, Notifiable, SoftDeletes, TwoFactorAuthenticatable;

    protected $appends = ['role'];

    protected $fillable = [
        'name', 'email', 'password',
        'avatar_path', 'phone', 'date_of_birth', 'address',
        'patient_notes',
        'stripe_customer_id', 'google_refresh_token',
        'tutorial_completed_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'google_refresh_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'tutorial_completed_at' => 'datetime',
            'date_of_birth' => 'date',
            'password' => 'hashed',
            'google_refresh_token' => 'encrypted',
        ];
    }

    // ==================== RELACIONES ====================

    /** @return BelongsToMany<Workspace, $this> */
    public function workspaces(): BelongsToMany
    {
        return $this->belongsToMany(Workspace::class, 'workspace_members')
            ->withPivot(['role', 'joined_at', 'is_active'])
            ->withTimestamps();
    }

    /** @return HasMany<Workspace, $this> */
    public function createdWorkspaces(): HasMany
    {
        return $this->hasMany(Workspace::class, 'creator_id');
    }

    /** @return HasOne<ProfessionalProfile, $this> */
    public function professionalProfile(): HasOne
    {
        return $this->hasOne(ProfessionalProfile::class);
    }

    /** @return HasMany<Appointment, $this> */
    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'patient_id');
    }

    /** @return HasMany<Appointment, $this> */
    public function professionalAppointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'professional_id');
    }

    /** @return HasOne<PatientProfile, $this> */
    public function patientProfile(): HasOne
    {
        return $this->hasOne(PatientProfile::class);
    }

    /** @return HasMany<PatientProfile, $this> */
    public function patientProfiles(): HasMany
    {
        return $this->hasMany(PatientProfile::class, 'professional_id');
    }

    /** @return HasMany<CaseAssignment, $this> */
    public function caseAssignments(): HasMany
    {
        return $this->hasMany(CaseAssignment::class, 'professional_id');
    }

    /** @return HasMany<CaseAssignment, $this> */
    public function patientCaseAssignments(): HasMany
    {
        return $this->hasMany(CaseAssignment::class, 'patient_id');
    }

    /** @return Builder<CollaborationAgreement> */
    public function collaborationAgreements(): Builder
    {
        return CollaborationAgreement::forProfessional($this->id);
    }

    /** @return HasMany<Referral, $this> */
    public function referralsSent(): HasMany
    {
        return $this->hasMany(Referral::class, 'from_professional_id');
    }

    /** @return HasMany<Referral, $this> */
    public function referralsReceived(): HasMany
    {
        return $this->hasMany(Referral::class, 'to_professional_id');
    }

    /** @return HasMany<Message, $this> */
    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    /** @return HasMany<Message, $this> */
    public function receivedMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    /** @return HasMany<Invoice, $this> */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class, 'patient_id');
    }

    /** @return HasMany<Invoice, $this> */
    public function professionalInvoices(): HasMany
    {
        return $this->hasMany(Invoice::class, 'professional_id');
    }

    /** @return HasMany<Availability, $this> */
    public function availabilities(): HasMany
    {
        return $this->hasMany(Availability::class, 'professional_id');
    }

    // ==================== ACCESSORS ====================

    /** @return Attribute<string, never> */
    protected function role(): Attribute
    {
        return Attribute::make(
            /** @phpstan-ignore nullsafe.neverNull */
            get: fn () => $this->roles->first()?->name ?? 'professional',
        );
    }

    // ==================== MÉTODOS HELPER ====================

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isProfessional(): bool
    {
        return $this->hasRole('professional');
    }

    public function isPatient(): bool
    {
        return $this->hasRole('patient');
    }

    public function hasCompletedTutorial(): bool
    {
        return $this->tutorial_completed_at !== null;
    }

    public function completeTutorial(): void
    {
        $this->update(['tutorial_completed_at' => now()]);
    }

    public function currentWorkspaceId(): ?int
    {
        return session('current_workspace_id')
            ?? $this->workspaces()->first()->id
            ?? $this->createdWorkspaces()->first()?->id;
    }

    public function currentWorkspace(): ?Workspace
    {
        $id = $this->currentWorkspaceId();

        return $id ? Workspace::find($id) : null;
    }
}
