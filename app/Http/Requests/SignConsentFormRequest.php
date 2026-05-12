<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SignConsentFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'signature_data' => [
                'required',
                'string',
                // Validates data-URL format produced by canvas.toDataURL()
                'regex:/^data:image\/(png|jpeg);base64,/',
            ],
            'signed_ip' => ['nullable', 'ip'],
        ];
    }
}
