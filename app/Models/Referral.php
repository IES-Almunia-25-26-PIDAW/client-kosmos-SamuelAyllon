<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Referral extends Model
{
    use HasFactory;

    protected $table = 'referrals';

    protected $fillable = [
        'from_professional_id', 'to_professional_id', 'patient_id',
        'status', 'reason', 'responded_at',
    ];

    protected function casts(): array
    {
        return [
            'responded_at' => 'datetime',
        ];
    }

    public function fromProfessional()
    {
        return $this->belongsTo(User::class, 'from_professional_id');
    }

    public function toProfessional()
    {
        return $this->belongsTo(User::class, 'to_professional_id');
    }

    public function patient()
    {
        return $this->belongsTo(PatientProfile::class, 'patient_id');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}
