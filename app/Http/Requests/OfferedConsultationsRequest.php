<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OfferedConsultationsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->isProfessional();
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'duration_minutes' => ['required', 'integer', 'min:5', 'max:480'],
            'price' => ['nullable', 'numeric', 'min:0', 'max:9999.99'],
            'color' => ['nullable', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'is_active' => ['sometimes', 'boolean'],
            'modality' => ['required', Rule::in(['in_person', 'video_call', 'both'])],
        ];
    }

    public function messages(): array
    {
        return [
            'color.regex' => 'El color debe ser un hex válido (ej. #6366f1).',
            'duration_minutes.min' => 'La duración mínima es 5 minutos.',
            'duration_minutes.max' => 'La duración máxima es 8 horas.',
        ];
    }

    /**
     * @return array<string,mixed>
     */
    public function dataForPersistence(): array
    {
        $data = $this->validated();
        $data['is_active'] = $this->boolean('is_active', true);

        return $data;
    }
}
