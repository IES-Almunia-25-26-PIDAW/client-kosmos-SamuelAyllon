<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'plan' => ['required', 'in:premium_monthly,premium_yearly'],
            'card_number' => ['required', 'string', 'digits:16'],
            'card_holder' => ['required', 'string', 'max:255'],
            'expiry_month' => ['required', 'integer', 'min:1', 'max:12'],
            'expiry_year' => ['required', 'integer', 'min:' . date('Y')],
            'cvv' => ['required', 'string', 'digits_between:3,4'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $month = (int) $this->input('expiry_month');
            $year = (int) $this->input('expiry_year');
            $now = now();

            if ($year === (int) $now->format('Y') && $month < (int) $now->format('m')) {
                $validator->errors()->add('expiry_month', 'La tarjeta está expirada.');
            }
        });
    }

    public function messages(): array
    {
        return [
            'plan.required' => 'Debes seleccionar un plan.',
            'plan.in' => 'El plan seleccionado no es válido.',
            'card_number.required' => 'El número de tarjeta es obligatorio.',
            'card_number.digits' => 'El número de tarjeta debe tener 16 dígitos.',
            'card_holder.required' => 'El nombre del titular es obligatorio.',
            'card_holder.max' => 'El nombre del titular no puede superar 255 caracteres.',
            'expiry_month.required' => 'El mes de expiración es obligatorio.',
            'expiry_month.min' => 'El mes de expiración no es válido.',
            'expiry_month.max' => 'El mes de expiración no es válido.',
            'expiry_year.required' => 'El año de expiración es obligatorio.',
            'expiry_year.min' => 'La tarjeta está expirada.',
            'cvv.required' => 'El CVV es obligatorio.',
            'cvv.digits_between' => 'El CVV debe tener entre 3 y 4 dígitos.',
        ];
    }
}
