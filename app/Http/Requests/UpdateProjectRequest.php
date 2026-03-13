<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
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
            'status' => ['required', 'in:inactive,active,completed'],
            'color' => ['nullable', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'brand_tone' => ['nullable', 'string', 'max:2000'],
            'service_scope' => ['nullable', 'string', 'max:2000'],
            'key_links' => ['nullable', 'array'],
            'key_links.*.label' => ['required_with:key_links', 'string', 'max:255'],
            'key_links.*.url' => ['required_with:key_links', 'url', 'max:2048'],
            'next_deadline' => ['nullable', 'date'],
            'client_notes' => ['nullable', 'string', 'max:5000'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del cliente es obligatorio.',
            'name.max' => 'El nombre no puede superar 255 caracteres.',
            'description.max' => 'La descripción no puede superar 2000 caracteres.',
            'status.required' => 'El estado es obligatorio.',
            'status.in' => 'El estado debe ser inactivo, activo o completado.',
            'color.regex' => 'El color debe ser un código hexadecimal válido (ej: #FF5733).',
            'brand_tone.max' => 'El tono de marca no puede superar 2000 caracteres.',
            'service_scope.max' => 'El alcance del servicio no puede superar 2000 caracteres.',
            'key_links.array' => 'Los enlaces deben ser una lista válida.',
            'next_deadline.date' => 'La fecha límite debe ser una fecha válida.',
            'client_notes.max' => 'Las notas no pueden superar 5000 caracteres.',
        ];
    }
}
