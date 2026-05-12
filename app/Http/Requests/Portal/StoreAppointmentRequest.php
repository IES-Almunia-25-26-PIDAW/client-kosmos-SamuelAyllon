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

    /** @return array<string, mixed> */
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

    /**
     * @return array{professional_id: int, service_id: int, starts_at: string, modality: string, notes?: string|null}
     */
    public function appointmentData(): array
    {
        /** @var array<string, mixed> $validated */
        $validated = $this->validated();

        return [
            'professional_id' => (int) $validated['professional_id'],
            'service_id' => (int) $validated['service_id'],
            'starts_at' => (string) $validated['starts_at'],
            'modality' => (string) $validated['modality'],
            'notes' => isset($validated['notes']) ? (string) $validated['notes'] : null,
        ];
    }
}
