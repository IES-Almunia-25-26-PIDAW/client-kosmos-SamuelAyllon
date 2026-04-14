<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, HasRoles, TwoFactorAuthenticatable, SoftDeletes;

    protected $fillable = [
        'name', 'email', 'password',
        'avatar_path', 'phone', 'date_of_birth', 'address',
        'emergency_contact', 'patient_notes',
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
            'email_verified_at'     => 'datetime',
            'tutorial_completed_at' => 'datetime',
            'date_of_birth'         => 'date',
            'emergency_contact'     => 'array',
            'password'              => 'hashed',
        ];
    }

    // ==================== RELACIONES ====================

    public function clinics()
    {
        return $this->belongsToMany(Clinic::class, 'clinic_user')
            ->withPivot(['role', 'can_view_all_patients', 'joined_at', 'is_active'])
            ->withTimestamps();
    }

    public function ownedClinics()
    {
        return $this->hasMany(Clinic::class, 'owner_id');
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

    public function patientProfessionals()
    {
        return $this->hasMany(PatientProfessional::class, 'patient_id');
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function sessions()
    {
        return $this->hasMany(ConsultingSession::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function availabilities()
    {
        return $this->hasMany(Availability::class, 'professional_id');
    }

    // ==================== MÉTODOS HELPER ====================

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isOwner(): bool
    {
        return $this->hasRole('owner');
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

    public function currentClinicId(): ?int
    {
        return session('current_clinic_id')
            ?? $this->clinics()->first()?->id
            ?? $this->ownedClinics()->first()?->id;
    }

    public function currentClinic(): ?Clinic
    {
        $id = $this->currentClinicId();
        return $id ? Clinic::find($id) : null;
    }
}
