<?php

namespace App\Http\Controllers\Auth\Google;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\GoogleAuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class CallbackAction extends Controller
{
    public function __invoke(Request $request, GoogleAuthService $google): RedirectResponse
    {
        $sessionState = session()->pull('google_oauth');

        if (! is_array($sessionState)
            || $request->query('state') !== ($sessionState['state'] ?? null)
        ) {
            return redirect()->route('login')
                ->withErrors(['google' => 'La sesión de Google ha expirado. Vuelve a intentarlo.']);
        }

        if ($request->filled('error') || ! $request->filled('code')) {
            return redirect()->route('login')
                ->withErrors(['google' => 'Has cancelado el acceso con Google.']);
        }

        $intent = $sessionState['intent'] ?? 'login';
        $type = $sessionState['type'] ?? null;

        try {
            $profile = $google->handleCallback((string) $request->query('code'));
        } catch (Throwable $e) {
            Log::warning('Google OAuth callback failed', ['err' => $e->getMessage()]);

            return redirect()->route('login')
                ->withErrors(['google' => 'No se pudo verificar tu cuenta de Google.']);
        }

        $user = User::query()->where('google_id', $profile['google_id'])->first();

        if ($user === null) {
            $user = User::query()->where('email', $profile['email'])->first();

            if ($user !== null) {
                if ($intent === 'register' && $type !== null && ! $user->hasRole($type)) {
                    return redirect()->route('login')
                        ->withErrors(['google' => 'Esa cuenta de Google ya está vinculada a otro tipo de usuario.']);
                }

                $user->google_id = $profile['google_id'];
                if ($user->email_verified_at === null && $profile['email_verified']) {
                    $user->email_verified_at = now();
                }
                if ($profile['refresh_token'] !== null) {
                    $user->google_refresh_token = $profile['refresh_token'];
                }
                $user->save();
            }
        } else {
            if ($profile['refresh_token'] !== null) {
                $user->google_refresh_token = $profile['refresh_token'];
                $user->save();
            }
        }

        if ($user === null) {
            if ($intent !== 'register' || $type === null) {
                return redirect()->route('register')
                    ->withErrors(['google' => 'No existe ninguna cuenta con ese Google. Regístrate primero.']);
            }

            if ($type === 'professional') {
                // Bloqueo soft-deleted: el unique index a nivel BD daría 500
                // si una cuenta previa con el mismo email/google_id está en
                // la papelera. Mensaje claro en su lugar.
                $trashed = User::onlyTrashed()
                    ->where(fn ($q) => $q
                        ->where('email', $profile['email'])
                        ->orWhere('google_id', $profile['google_id'])
                    )
                    ->exists();

                if ($trashed) {
                    return redirect()->route('register')
                        ->withErrors(['google' => 'Esta cuenta de Google ya estuvo registrada anteriormente. Contacta con soporte para reactivarla.']);
                }

                $user = $this->createProfessional($profile);
            } else {
                session([
                    'pending_google_patient' => [
                        ...$profile,
                        'expires_at' => now()->addMinutes(15)->toIso8601String(),
                    ],
                ]);

                return redirect()->route('auth.google.patient-consents');
            }
        }

        // Paridad con AuthenticateAction (login email/password): rechazar usuarios
        // sin rol válido. Esto cubre cuentas que se crearon antes de que la tabla
        // roles existiera (assignRole falló silenciosa) o que fueron purgadas.
        if (! $user->hasAnyRole(['admin', 'professional', 'patient'])) {
            return redirect()->route('login')
                ->withErrors(['google' => 'Tu cuenta no tiene un rol asignado. Contacta con soporte.']);
        }

        Auth::login($user, remember: true);
        $request->session()->regenerate();

        if ($user->isProfessional() && $user->google_refresh_token === null) {
            return redirect()->route('settings.google.redirect');
        }

        return redirect()->intended(route('dashboard'));
    }

    /**
     * @param  array{google_id:string,email:string,name:string,avatar_url:?string,email_verified:bool,refresh_token:?string}  $profile
     */
    private function createProfessional(array $profile): User
    {
        // Transacción: igual que CreateNewUser, evita usuarios huérfanos si
        // assignRole() o professionalProfile()->create() fallan tras el insert.
        return DB::transaction(function () use ($profile) {
            $user = User::create([
                'name' => $profile['name'],
                'email' => $profile['email'],
                'google_id' => $profile['google_id'],
                'password' => null,
                'email_verified_at' => $profile['email_verified'] ? now() : null,
                'google_refresh_token' => $profile['refresh_token'],
            ]);

            $user->assignRole('professional');
            $user->professionalProfile()->create([
                'verification_status' => 'pending',
            ]);

            return $user;
        });
    }
}
