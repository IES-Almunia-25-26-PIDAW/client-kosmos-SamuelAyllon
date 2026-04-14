<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Availability extends Model
{
    use HasFactory;

    protected $fillable = [
        'professional_id', 'clinic_id', 'day_of_week',
        'start_time', 'end_time', 'slot_duration_minutes', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'day_of_week'           => 'integer',
            'slot_duration_minutes' => 'integer',
            'is_active'             => 'boolean',
        ];
    }

    public function professional()
    {
        return $this->belongsTo(User::class, 'professional_id');
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }
}
