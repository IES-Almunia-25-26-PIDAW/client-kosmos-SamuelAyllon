<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientProfessional extends Model
{
    use HasFactory;

    protected $table = 'patient_professional';

    protected $fillable = [
        'patient_id', 'professional_id', 'clinic_id',
        'is_primary', 'status', 'started_at', 'ended_at', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
            'started_at' => 'date',
            'ended_at'   => 'date',
        ];
    }

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function professional()
    {
        return $this->belongsTo(User::class, 'professional_id');
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function patientProfile()
    {
        return $this->hasOneThrough(
            PatientProfile::class,
            User::class,
            'id',
            'user_id',
            'patient_id',
            'id'
        );
    }
}
