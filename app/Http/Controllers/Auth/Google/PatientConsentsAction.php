<?php

namespace App\Http\Controllers\Auth\Google;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\RgpdService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PatientConsentsAction extends Controller
{
    public function show(): Response|RedirectResponse
    {
        $pending = session('pending_google_patient');

        if (! is_array($pending) || $this->expired($pending)) {
            session()->forget('pending_google_patient');

            return redirect()->route('register')
                ->withErrors(['google' => 'La sesión de registro con Google ha expirado.']);
        }

        return Inertia::render('auth/google-patient-consents', [
            'name' => $pending['name'],
            'email' => $pending['email'],
        ]);
    }

    public function store(Request $request, RgpdService $rgpd): RedirectResponse
    {
        $pending = session('pending_google_patient');

        if (! is_array($pending) || $this->expired($pending)) {
            session()->forget('pending_google_patient');

            return redirect()->route('register')
                ->withErrors(['google' => 'La sesión de registro con Google ha expirado.']);
        }

        $request->validate([
            'consent_privacy_policy' => ['required', 'accepted'],
            'consent_terms_of_service' => ['required', 'accepted'],
            'consent_health_data' => ['required', 'accepted'],
            'consent_recording_global' => ['required', 'accepted'],
        ]);

        // Si existe un usuario soft-deleted con este email o google_id, el
        // unique index a nivel BD bloquearía el insert con un 500 opaco.
        // Devolvemos error claro en su lugar: el usuario ya tuvo cuenta,
        // que contacte para reactivarla o usar otra dirección/cuenta Google.
        $existingTrashed = User::onlyTrashed()
            ->where(fn ($q) => $q
                ->where('email', $pending['email'])
                ->orWhere('google_id', $pending['google_id'])
            )
            ->first();

        if ($existingTrashed !== null) {
            session()->forget('pending_google_patient');

            return redirect()->route('register')
                ->withErrors(['google' => 'Esta cuenta de Google ya estuvo registrada anteriormente. Contacta con soporte para reactivarla.']);
        }

        $user = DB::transaction(function () use ($pending, $rgpd, $request) {
            $user = User::create([
                'name' => $pending['name'],
                'email' => $pending['email'],
                'google_id' => $pending['google_id'],
                'password' => null,
                'email_verified_at' => $pending['email_verified'] ? now() : null,
                'google_refresh_token' => $pending['refresh_token'] ?? null,
            ]);

            $user->assignRole('patient');
            $user->patientProfile()->create([]);
            $rgpd->storeRegistrationConsents($user, $request);

            return $user;
        });

        session()->forget('pending_google_patient');

        Auth::login($user, remember: true);
        $request->session()->regenerate();

        return redirect()->route('dashboard');
    }

    /** @param  array<string, mixed>  $pending */
    private function expired(array $pending): bool
    {
        $expiresAt = $pending['expires_at'] ?? null;

        return ! is_string($expiresAt) || Carbon::parse($expiresAt)->isPast();
    }
}
