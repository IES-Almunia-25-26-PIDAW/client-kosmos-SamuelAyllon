<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCollaborationAgreementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', 'in:pending,active,ended,cancelled'],
            'end_date' => ['sometimes', 'nullable', 'date'],
            'terms' => ['sometimes', 'nullable', 'array'],
        ];
    }
}
