<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePatientRequest;
use App\Models\Patient;
use Illuminate\Http\RedirectResponse;

class StoreAction extends Controller
{
    public function __invoke(StorePatientRequest $request): RedirectResponse
    {
        $this->authorize('create', Patient::class);

        $patient = Patient::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return redirect()->route('patients.show', $patient)
            ->with('success', 'Paciente añadido correctamente.');
    }
}
