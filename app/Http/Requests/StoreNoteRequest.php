<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreNoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'content'               => ['required', 'string', 'min:1'],
            'type'                  => ['required', 'in:quick_note,session_note,observation,followup'],
            'consulting_session_id' => ['nullable', 'exists:consulting_sessions,id'],
        ];
    }
}
