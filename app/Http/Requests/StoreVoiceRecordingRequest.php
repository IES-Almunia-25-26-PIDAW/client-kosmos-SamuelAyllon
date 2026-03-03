<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVoiceRecordingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'audio' => ['required', 'file', 'mimes:webm,ogg,mp4,m4a,wav,mp3', 'max:25600'],
        ];
    }

    public function messages(): array
    {
        return [
            'audio.required' => 'El archivo de audio es obligatorio.',
            'audio.file' => 'El archivo de audio no es válido.',
            'audio.mimes' => 'El formato de audio no está soportado.',
            'audio.max' => 'El audio no puede superar 25 MB.',
        ];
    }
}
