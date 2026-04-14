<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'patient_id', 'user_id', 'clinic_id', 'name', 'local_path',
        'storage_type', 'gdrive_file_id', 'gdrive_url',
        'mime_type', 'file_size', 'category', 'is_rgpd', 'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'is_rgpd'    => 'boolean',
            'expires_at' => 'date',
        ];
    }

    public function patient()
    {
        return $this->belongsTo(PatientProfile::class, 'patient_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }
}
