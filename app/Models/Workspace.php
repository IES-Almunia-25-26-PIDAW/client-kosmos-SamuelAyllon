<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Clinic extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'owner_id', 'name', 'slug', 'tax_name', 'tax_id', 'tax_address',
        'phone', 'email', 'logo_path', 'settings',
    ];

    protected function casts(): array
    {
        return [
            'settings' => 'array',
        ];
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'clinic_user')
            ->withPivot(['role', 'can_view_all_patients', 'joined_at', 'is_active'])
            ->withTimestamps();
    }

    public function professionals()
    {
        return $this->belongsToMany(User::class, 'clinic_user')
            ->withPivot(['role', 'can_view_all_patients', 'joined_at', 'is_active'])
            ->wherePivot('role', 'professional')
            ->withTimestamps();
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
