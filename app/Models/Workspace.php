<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Workspace extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'creator_id', 'name', 'slug', 'tax_name', 'tax_id', 'tax_address',
        'phone', 'email', 'logo_path', 'location_address', 'settings',
    ];

    protected function casts(): array
    {
        return [
            'settings' => 'array',
        ];
    }

    public function isOnlineOnly(): bool
    {
        return is_null($this->location_address);
    }

    public function hasCollaborators(): bool
    {
        return $this->members()->count() > 1;
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'workspace_members')
            ->withPivot(['role', 'joined_at', 'is_active'])
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

    public function collaborationAgreements()
    {
        return $this->hasMany(CollaborationAgreement::class);
    }
}
