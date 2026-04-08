<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'patient_id', 'user_id', 'consulting_session_id',
        'amount', 'concept', 'payment_method', 'status',
        'due_date', 'paid_at', 'invoice_number', 'invoice_sent_at',
        'reminder_count', 'last_reminder_at',
    ];

    protected $casts = [
        'amount'           => 'decimal:2',
        'due_date'         => 'date',
        'paid_at'          => 'datetime',
        'invoice_sent_at'  => 'datetime',
        'last_reminder_at' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function session()
    {
        return $this->belongsTo(ConsultingSession::class, 'consulting_session_id');
    }
}
