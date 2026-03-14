<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
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
            'due_date' => ['required', 'date', 'after_or_equal:today'],
            'project_id' => ['nullable', 'integer', 'exists:projects,id', function ($attribute, $value, $fail) {
                if ($value && \App\Models\Project::where('id', $value)->where('user_id', $this->user()->id)->doesntExist()) {
                    $fail('El proyecto seleccionado no te pertenece.');
                }
            }],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre de la tarea es obligatorio.',
            'name.max' => 'El nombre no puede superar 255 caracteres.',
            'description.max' => 'La descripción no puede superar 2000 caracteres.',
            'priority.required' => 'La prioridad es obligatoria.',
            'priority.in' => 'La prioridad debe ser baja, media o alta.',
            'due_date.required' => 'La fecha de vencimiento es obligatoria.',
            'due_date.date' => 'La fecha de vencimiento no es válida.',
            'due_date.after_or_equal' => 'La fecha de vencimiento debe ser hoy o posterior.',
            'project_id.exists' => 'El proyecto seleccionado no existe.',
        ];
    }
}
