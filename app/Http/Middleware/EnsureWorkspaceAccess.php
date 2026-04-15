<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureClinicAccess
{
    /**
     * Verify the authenticated user belongs to the active clinic.
     *
     * The active clinic is resolved from the session key `current_clinic_id`.
     * Admins bypass this check entirely.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(401);
        }

        // Admins have global access — no clinic scope needed
        if ($user->hasRole('admin')) {
            return $next($request);
        }

        $clinicId = session('current_clinic_id') ?? $user->currentClinicId();

        if (! $clinicId) {
            abort(403, 'No hay clínica activa asignada.');
        }

        $belongsToClinic = $user->clinics()
            ->where('clinics.id', $clinicId)
            ->where('clinic_user.is_active', true)
            ->exists();

        if (! $belongsToClinic) {
            abort(403, 'No tienes acceso a esta clínica.');
        }

        return $next($request);
    }
}
