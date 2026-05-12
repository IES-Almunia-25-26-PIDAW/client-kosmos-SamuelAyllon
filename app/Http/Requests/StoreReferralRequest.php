<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;

class StoreReferralRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'to_professional_id' => ['required', 'exists:users,id'],
            'patient_id' => [
                'required',
                'exists:patient_profiles,id',
                function ($attribute, $value, $fail) {
                    $exists = DB::table('referrals')
                        ->where('from_professional_id', auth()->id())
                        ->where('to_professional_id', $this->input('to_professional_id'))
                        ->where('patient_id', $value)
                        ->whereIn('status', ['pending', 'accepted'])
                        ->exists();

                    if ($exists) {
                        $fail('Ya existe un referral activo para este paciente y profesional.');
                    }
                },
            ],
            'reason' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
