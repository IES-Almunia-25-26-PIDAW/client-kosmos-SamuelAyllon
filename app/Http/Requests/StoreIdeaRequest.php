<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreIdeaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'priority' => ['required', 'in:low,medium,high'],
            'source' => ['nullable', 'in:manual,voice,ai_suggestion'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre de la idea es obligatorio.',
            'name.max' => 'El nombre no puede superar 255 caracteres.',
            'description.max' => 'La descripción no puede superar 2000 caracteres.',
            'priority.required' => 'La prioridad es obligatoria.',
            'priority.in' => 'La prioridad debe ser baja, media o alta.',
        ];
    }
}
