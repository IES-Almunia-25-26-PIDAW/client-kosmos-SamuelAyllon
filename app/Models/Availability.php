<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property Carbon|null $specific_date
 */
class Availability extends Model
{
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

    /** @return BelongsTo<User, $this> */
    public function professional(): BelongsTo
    {
        return $this->belongsTo(User::class, 'professional_id');
    }

    /** @return BelongsTo<Workspace, $this> */
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }
}
