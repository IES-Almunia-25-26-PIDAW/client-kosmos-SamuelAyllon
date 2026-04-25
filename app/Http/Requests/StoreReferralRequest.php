<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReferralRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'to_professional_id' => ['required', 'exists:users,id'],
            'patient_id' => ['required', 'exists:patient_profiles,id'],
            'reason' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
