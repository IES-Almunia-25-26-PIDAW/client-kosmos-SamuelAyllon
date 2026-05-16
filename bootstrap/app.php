<?php

use App\Http\Middleware\EnsureAdmin;
use App\Http\Middleware\EnsureProfessional;
use App\Http\Middleware\EnsureWorkspaceAccess;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\LogTranscriptionAccess;
use App\Http\Middleware\SecurityHeaders;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // En Railway terminamos TLS en el edge: FrankenPHP recibe la request
        // por HTTP plano con X-Forwarded-Proto: https. Sin trustProxies, el
        // URL builder de Laravel emite redirects a http:// (ej. login → 302
        // location: http://.../dashboard) y la cookie samesite=lax se pierde
        // en el bounce a https, dejando al usuario fuera de sesión.
        $middleware->trustProxies(at: '*');

        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->validateCsrfTokens(except: ['webhooks/stripe']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            SecurityHeaders::class,
        ]);

        $middleware->alias([
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
            'admin' => EnsureAdmin::class,
            'professional' => EnsureProfessional::class,
            'workspace.access' => EnsureWorkspaceAccess::class,
            'rgpd.access_log' => LogTranscriptionAccess::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
