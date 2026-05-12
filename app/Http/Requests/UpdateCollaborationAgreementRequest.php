<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCollaborationAgreementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'status' => ['sometimes', 'in:pending,active,ended,cancelled'],
            'end_date' => [
                'sometimes',
                'nullable',
                'date',
                function ($attribute, $value, $fail) {
                    if ($value === null) {
                        return;
                    }
                    $agreement = $this->route('collaboration_agreement');
                    if ($agreement && $value < $agreement->start_date) {
                        $fail('La fecha de fin no puede ser anterior a la fecha de inicio del acuerdo.');
                    }
                },
            ],
            'terms' => ['sometimes', 'nullable', 'array'],
        ];
    }
}
