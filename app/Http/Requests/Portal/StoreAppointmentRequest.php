<?php

namespace App\Http\Requests\Portal;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->isPatient();
    }

    public function rules(): array
    {
        return [
            'professional_id' => ['required', 'integer', Rule::exists('users', 'id')],
            'service_id' => ['required', 'integer', Rule::exists('offered_consultations', 'id')],
            'starts_at' => ['required', 'date', 'after:now'],
            'modality' => ['required', 'in:in_person,video_call'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
