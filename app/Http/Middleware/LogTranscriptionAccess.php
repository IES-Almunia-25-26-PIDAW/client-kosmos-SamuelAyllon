<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class LogTranscriptionAccess
{
    public function handle(Request $request, Closure $next, ?string $action = null)
    {
        $response = $next($request);

        $user = $request->user();

        if ($user === null) {
            return $response;
        }

        $resolvedAction = $action ?? $this->resolveAction($request);
        $subjectId = $this->resolveSubjectId($request);

        activity('rgpd_access')
            ->causedBy($user)
            ->withProperties([
                'ip' => $request->ip(),
                'user_agent' => substr((string) $request->userAgent(), 0, 255),
                'route' => $request->route()?->getName(),
                'subject_id' => $subjectId,
                'status' => $response->getStatusCode(),
            ])
            ->event($resolvedAction)
            ->log($resolvedAction);

        return $response;
    }

    private function resolveAction(Request $request): string
    {
        $name = $request->route()?->getName() ?? $request->path();

        return 'access:'.$name;
    }

    private function resolveSubjectId(Request $request): ?int
    {
        foreach (['recording', 'invoice', 'document', 'appointment'] as $key) {
            $param = $request->route($key);
            if ($param === null) {
                continue;
            }
            if (is_object($param) && property_exists($param, 'id')) {
                return (int) $param->id;
            }
            if (is_numeric($param)) {
                return (int) $param;
            }
        }

        return null;
    }
}
