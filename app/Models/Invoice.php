<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'clinic_id', 'patient_id', 'professional_id', 'invoice_number',
        'status', 'issued_at', 'due_at', 'paid_at',
        'subtotal', 'tax_rate', 'tax_amount', 'total',
        'payment_method', 'stripe_payment_id', 'notes', 'pdf_path',
    ];

    protected function casts(): array
    {
        return [
            'issued_at'  => 'datetime',
            'due_at'     => 'date',
            'paid_at'    => 'datetime',
            'subtotal'   => 'decimal:2',
            'tax_rate'   => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'total'      => 'decimal:2',
        ];
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function professional()
    {
        return $this->belongsTo(User::class, 'professional_id');
    }

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }
}
