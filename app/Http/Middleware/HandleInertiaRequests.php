<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => ['user' => $user?->loadMissing('roles')],
            'isImpersonating' => $request->session()->has('impersonating_id'),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
            'notifications' => fn () => $user ? [
                'unread_count' => $user->unreadNotifications()->count(),
                'recent' => $user->notifications()->take(5)->get()
                    ->map(fn ($n) => [
                        'id' => $n->id,
                        'type' => $n->type,
                        'data' => $n->data,
                        'read_at' => $n->read_at?->toIso8601String(),
                        'created_at' => $n->created_at->toIso8601String(),
                    ])
                    ->all(),
            ] : ['unread_count' => 0, 'recent' => []],
        ];
    }
}
