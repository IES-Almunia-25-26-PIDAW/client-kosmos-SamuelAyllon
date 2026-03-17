<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html, body {
                background-color: #E9EDC9;
            }

            html.dark, html.dark body {
                background-color: #1a1e1b;
            }

            /* Loading spinner visible mientras React monta la app */
            .app-loading {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
            }
            .app-loading-spinner {
                width: 36px;
                height: 36px;
                border: 3px solid rgba(58, 90, 64, 0.2);
                border-top-color: #3A5A40;
                border-radius: 50%;
                animation: app-spin 0.7s linear infinite;
            }
            html.dark .app-loading-spinner {
                border-color: rgba(107, 155, 115, 0.2);
                border-top-color: #6b9b73;
            }
            @keyframes app-spin {
                to { transform: rotate(360deg); }
            }
        </style>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        {{-- Flowly Design System fonts: Nunito (títulos 600-800), Inter (cuerpo & UI 400-600) --}}
        <link href="https://fonts.bunny.net/css?family=nunito:600,700,800|inter:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia

        {{-- Loading spinner visible mientras React hidrata la app --}}
        <script>
            (function() {
                var el = document.getElementById('app');
                if (el && !el.hasChildNodes()) {
                    el.innerHTML = '<div class="app-loading"><div class="app-loading-spinner"></div></div>';
                }
            })();
        </script>
    </body>
</html>
