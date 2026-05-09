<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCollaborationAgreementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'professional_b_id' => [
                'required',
                'exists:users,id',
                Rule::notIn([auth()->id()]),
            ],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after:start_date'],
            'terms' => ['nullable', 'array'],
        ];
    }

    public function messages(): array
    {
        return [
            'professional_b_id.not_in' => 'No puedes crear un acuerdo de colaboración contigo mismo.',
        ];
    }
}
