<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'workspace_id', 'name', 'description', 'duration_minutes', 'price', 'color', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price'            => 'decimal:2',
            'duration_minutes' => 'integer',
            'is_active'        => 'boolean',
        ];
    }

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}
