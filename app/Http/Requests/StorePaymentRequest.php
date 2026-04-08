<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount'                => ['required', 'numeric', 'min:0'],
            'due_date'              => ['required', 'date'],
            'concept'               => ['nullable', 'string'],
            'payment_method'        => ['nullable', 'in:cash,bizum,transfer,card'],
            'consulting_session_id' => ['nullable', 'exists:consulting_sessions,id'],
        ];
    }
}
