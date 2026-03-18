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
                background-color: #F7F6F2;
            }

            html.dark, html.dark body {
                background-color: #141311;
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
                border: 3px solid rgba(14, 124, 131, 0.2);
                border-top-color: #0E7C83;
                border-radius: 50%;
                animation: app-spin 0.7s linear infinite;
            }
            html.dark .app-loading-spinner {
                border-color: rgba(61, 168, 176, 0.2);
                border-top-color: #3DA8B0;
            }
            @keyframes app-spin {
                to { transform: rotate(360deg); }
            }
        </style>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        {{-- ClientKosmos Design System fonts: General Sans (títulos), Inter (cuerpo & UI), JetBrains Mono (código) --}}
        <link rel="preconnect" href="https://api.fontshare.com" crossorigin>
        <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

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
