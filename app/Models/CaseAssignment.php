<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaseAssignment extends Model
{
    use HasFactory;

    protected $table = 'case_assignments';

    protected $fillable = [
        'patient_id', 'professional_id', 'workspace_id',
        'is_primary', 'role', 'status', 'started_at', 'ended_at', 'notes',
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

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
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

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }
}
