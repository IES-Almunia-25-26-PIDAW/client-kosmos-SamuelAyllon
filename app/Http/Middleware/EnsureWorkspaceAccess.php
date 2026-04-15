<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureWorkspaceAccess
{
    /**
     * Verify the authenticated user belongs to the active workspace.
     *
     * The active workspace is resolved from the session key `current_workspace_id`.
     * Admins bypass this check entirely.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(401);
        }

        // Admins have global access — no workspace scope needed
        if ($user->hasRole('admin')) {
            return $next($request);
        }

        $workspaceId = session('current_workspace_id') ?? $user->currentWorkspaceId();

        if (! $workspaceId) {
            abort(403, 'No hay espacio de trabajo activo asignado.');
        }

        $belongsToWorkspace = $user->workspaces()
            ->where('workspaces.id', $workspaceId)
            ->where('workspace_members.is_active', true)
            ->exists();

        if (! $belongsToWorkspace) {
            abort(403, 'No tienes acceso a este espacio de trabajo.');
        }

        return $next($request);
    }
}
