<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KosmoBriefing extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'patient_id', 'consulting_session_id',
        'type', 'content', 'is_read', 'for_date',
    ];

    protected $casts = [
        'content'  => 'array',
        'is_read'  => 'boolean',
        'for_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function session()
    {
        return $this->belongsTo(ConsultingSession::class, 'consulting_session_id');
    }
}
