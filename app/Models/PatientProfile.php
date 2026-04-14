<?php

namespace App\Models;

use App\Models\Concerns\BelongsToClinic;
use Database\Factories\PatientProfileFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PatientProfile extends Model
{
    use BelongsToClinic, HasFactory, SoftDeletes;

    protected static function newFactory(): PatientProfileFactory
    {
        return PatientProfileFactory::new();
    }

    protected $table = 'patient_profiles';

    protected $fillable = [
        'user_id', 'clinic_id', 'professional_id',
        'email', 'phone', 'avatar_path',
        'is_active', 'clinical_notes', 'diagnosis', 'treatment_plan',
        'referral_source', 'status', 'first_session_at', 'last_session_at',
    ];

    protected function casts(): array
    {
        return [
            'is_active'       => 'boolean',
            'first_session_at' => 'datetime',
            'last_session_at'  => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function professional()
    {
        return $this->belongsTo(User::class, 'professional_id');
    }

    public function sessions()
    {
        return $this->hasMany(ConsultingSession::class, 'patient_id');
    }

    public function notes()
    {
        return $this->hasMany(Note::class, 'patient_id');
    }

    public function agreements()
    {
        return $this->hasMany(Agreement::class, 'patient_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'patient_id');
    }

    public function documents()
    {
        return $this->hasMany(Document::class, 'patient_id');
    }

    public function consentForms()
    {
        return $this->hasMany(ConsentForm::class, 'patient_id');
    }

    public function professionals()
    {
        return $this->belongsToMany(User::class, 'patient_professional', 'patient_id', 'professional_id')
            ->withPivot(['clinic_id', 'is_primary', 'status', 'started_at', 'ended_at', 'notes'])
            ->withTimestamps();
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeInactive($query)
    {
        return $query->where('status', 'discharged');
    }
}
