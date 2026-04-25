<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

/**
 * @property string $name
 * @property-read \App\Models\PatientProfile|null $patientProfile
 * @property-read \App\Models\ProfessionalProfile|null $professionalProfile
 */
class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, HasRoles, Notifiable, SoftDeletes, TwoFactorAuthenticatable;

    protected $appends = ['role'];

    protected $fillable = [
        'name', 'email', 'password',
        'avatar_path', 'phone', 'date_of_birth', 'address',
        'patient_notes',
        'stripe_customer_id', 'google_refresh_token', 'gdrive_refresh_token',
        'tutorial_completed_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'google_refresh_token',
        'gdrive_refresh_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'tutorial_completed_at' => 'datetime',
            'date_of_birth' => 'date',
            'password' => 'hashed',
            'google_refresh_token' => 'encrypted',
            'gdrive_refresh_token' => 'encrypted',
        ];
    }

    // ==================== RELACIONES ====================

    public function workspaces()
    {
        return $this->belongsToMany(Workspace::class, 'workspace_members')
            ->withPivot(['role', 'joined_at', 'is_active'])
            ->withTimestamps();
    }

    public function createdWorkspaces()
    {
        return $this->hasMany(Workspace::class, 'creator_id');
    }

    public function professionalProfile()
    {
        return $this->hasOne(ProfessionalProfile::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'patient_id');
    }

    public function professionalAppointments()
    {
        return $this->hasMany(Appointment::class, 'professional_id');
    }

    public function patientProfile()
    {
        return $this->hasOne(PatientProfile::class);
    }

    public function patientProfiles()
    {
        return $this->hasMany(PatientProfile::class, 'professional_id');
    }

    public function caseAssignments()
    {
        return $this->hasMany(CaseAssignment::class, 'professional_id');
    }

    public function patientCaseAssignments()
    {
        return $this->hasMany(CaseAssignment::class, 'patient_id');
    }

    public function collaborationAgreements()
    {
        return CollaborationAgreement::forProfessional($this->id);
    }

    public function referralsSent()
    {
        return $this->hasMany(Referral::class, 'from_professional_id');
    }

    public function referralsReceived()
    {
        return $this->hasMany(Referral::class, 'to_professional_id');
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class, 'patient_id');
    }

    public function professionalInvoices()
    {
        return $this->hasMany(Invoice::class, 'professional_id');
    }

    public function availabilities()
    {
        return $this->hasMany(Availability::class, 'professional_id');
    }

    // ==================== ACCESSORS ====================

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
