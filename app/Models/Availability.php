<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property \Illuminate\Support\Carbon|null $specific_date
 */
class Availability extends Model
{
    use HasFactory;

    protected $fillable = [
        'professional_id', 'workspace_id', 'specific_date', 'day_of_week',
        'start_time', 'end_time', 'slot_duration_minutes', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'specific_date' => 'date',
            'day_of_week' => 'integer',
            'slot_duration_minutes' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function professional()
    {
        return $this->belongsTo(User::class, 'professional_id');
    }

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }
}
