<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreResourceRequest extends FormRequest
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
            'url' => ['required_if:type,link', 'nullable', 'url', 'max:2048'],
            'type' => ['required', 'in:link,document,video,image,other'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del recurso es obligatorio.',
            'name.max' => 'El nombre no puede superar 255 caracteres.',
            'description.max' => 'La descripción no puede superar 2000 caracteres.',
            'url.url' => 'La URL no tiene un formato válido.',
            'url.max' => 'La URL no puede superar 2048 caracteres.',
            'type.required' => 'El tipo de recurso es obligatorio.',
            'type.in' => 'El tipo debe ser: enlace, documento, video, imagen u otro.',
        ];
    }
}
