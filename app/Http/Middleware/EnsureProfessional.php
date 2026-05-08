<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureProfessional
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user?->isAdmin()) {
            return redirect()->route('admin.users.index');
        }

        if ($user?->isProfessional() && ! $user->professionalProfile?->isVerified()) {
            return redirect()->route('professional.pending-approval');
        }

        return $next($request);
    }
}
