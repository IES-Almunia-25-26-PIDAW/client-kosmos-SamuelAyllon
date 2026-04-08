<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_name'  => ['required', 'string', 'max:255'],
            'email'         => ['nullable', 'email'],
            'phone'         => ['nullable', 'string'],
            'brand_tone'    => ['nullable', 'string', 'max:100'],
            'service_scope' => ['nullable', 'string'],
            'next_deadline' => ['nullable', 'date'],
        ];
    }
}
