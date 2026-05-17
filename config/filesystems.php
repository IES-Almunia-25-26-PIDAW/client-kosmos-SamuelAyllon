<?php

/**
 * Helper: construye una entrada de disco s3-compatible (Cloudflare R2)
 * con un prefijo opcional, reutilizando las credenciales globales.
 */
$s3Disk = function (string $prefix = '', array $overrides = []): array {
    return array_merge([
        'driver' => 's3',
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'auto'),
        'bucket' => env('AWS_BUCKET'),
        'url' => env('AWS_URL'),
        'endpoint' => env('AWS_ENDPOINT'),
        'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
        'root' => $prefix,
        'throw' => false,
        'report' => false,
    ], $overrides);
};

$useObjectStorage = env('STORAGE_BACKEND') === 's3';

return [

    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    */

    'default' => env('FILESYSTEM_DISK', 'local'),

    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    |
    | Producción multi-servicio (Railway) usa S3-compatible (Cloudflare R2) para
    | que el contenedor web y el worker de la cola compartan storage. Cuando
    | STORAGE_BACKEND=s3, los discos local/private/audio_chunks/public viven en
    | el mismo bucket bajo prefijos distintos. En dev (driver "local") el
    | comportamiento previo se mantiene intacto. Ver ADR-0032.
    |
    */

    'disks' => [

        // El disco "local" guarda chunks de audio cifrados que el worker de la
        // cola consume (TranscribeChunkJob). En producción debe ser s3 para
        // que web y queue compartan storage.
        'local' => $useObjectStorage
            ? $s3Disk('local')
            : [
                'driver' => 'local',
                'root' => storage_path('app/private'),
                'serve' => true,
                'throw' => false,
                'report' => false,
            ],

        // Almacenamiento cifrado para documentos clínicos, consentimientos y
        // PDFs de facturas (RGPD Art. 32).
        'private' => $useObjectStorage
            ? $s3Disk('private', ['throw' => true])
            : [
                'driver' => 'local',
                'root' => storage_path('app/private'),
                'serve' => false,
                'throw' => true,
                'report' => false,
                'permissions' => [
                    'file' => ['public' => 0600, 'private' => 0600],
                    'dir' => ['public' => 0700, 'private' => 0700],
                ],
            ],

        // Chunks de audio temporales — TTL 24h, borrado automático tras transcribir.
        'audio_chunks' => $useObjectStorage
            ? $s3Disk('chunks')
            : [
                'driver' => 'local',
                'root' => storage_path('app/chunks'),
                'serve' => false,
                'throw' => false,
                'report' => false,
            ],

        // Disco público: en local sirve via storage:link; con R2 el bucket
        // debe tener acceso público (o usar dominio R2 público) y AWS_URL apuntar a él.
        'public' => $useObjectStorage
            ? $s3Disk('public', ['visibility' => 'public'])
            : [
                'driver' => 'local',
                'root' => storage_path('app/public'),
                'url' => rtrim((string) env('APP_URL', 'http://localhost'), '/').'/storage',
                'visibility' => 'public',
                'throw' => false,
                'report' => false,
            ],

        // Disco "s3" genérico — disponible siempre por si algún paquete espera
        // un disco con ese nombre. En R2 apunta al raíz del bucket.
        's3' => $s3Disk(''),

    ],

    /*
    |--------------------------------------------------------------------------
    | Symbolic Links
    |--------------------------------------------------------------------------
    */

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];
