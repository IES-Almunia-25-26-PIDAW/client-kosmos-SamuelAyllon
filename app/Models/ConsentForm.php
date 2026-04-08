<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConsentForm extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'patient_id', 'user_id', 'template_version', 'content_snapshot',
        'status', 'signed_at', 'signature_data', 'signed_ip', 'expires_at',
    ];

    protected $casts = [
        'signed_at'  => 'datetime',
        'expires_at' => 'date',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
