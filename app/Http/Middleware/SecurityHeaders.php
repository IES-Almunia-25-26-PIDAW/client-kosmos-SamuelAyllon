<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(self), microphone=(self), display-capture=(self), geolocation=()');

        if (! app()->environment('local') && ! $response->headers->has('Content-Security-Policy')) {
            $response->headers->set('Content-Security-Policy', $this->csp());
        }

        return $response;
    }

    private function csp(): string
    {
        $reverbHost = config('broadcasting.connections.reverb.options.host', 'localhost');
        $reverbPort = config('broadcasting.connections.reverb.options.port', 8080);
        $reverbScheme = config('broadcasting.connections.reverb.options.scheme', 'http') === 'https' ? 'wss' : 'ws';
        $reverbWs = sprintf('%s://%s:%s', $reverbScheme, $reverbHost, $reverbPort);

        return implode('; ', [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com",
            "font-src 'self' https://fonts.gstatic.com https://api.fontshare.com data:",
            "img-src 'self' data: blob: https:",
            "media-src 'self' blob:",
            "connect-src 'self' {$reverbWs} https://api.groq.com https://www.googleapis.com",
            "frame-src 'self' https://meet.google.com",
            "frame-ancestors 'self'",
            "base-uri 'self'",
            "form-action 'self'",
        ]);
    }
}
