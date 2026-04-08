<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SignConsentFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'signature_data' => ['required', 'string'],
            'signed_ip'      => ['nullable', 'ip'],
        ];
    }
}
