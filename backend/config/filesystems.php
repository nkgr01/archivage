<?php

/**
 * Description : Configuration du système de fichiers pour ArchiveSafe.
 * Ce fichier définit les disques de stockage utilisés pour les documents originaux,
 * les archives PDF/A et les vignettes.
 */

return [

    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Ici, nous définissons le disque par défaut utilisé par l'application.
    | Par défaut, nous utilisons 'local', mais cela peut être changé pour 's3' 
    | dans le fichier .env.
    |
    */

    'default' => env('FILESYSTEM_DISK', 'local'),

    /*
    |--------------------------------------------------------------------------
    | Filesystems Configuration
    |--------------------------------------------------------------------------
    |
    | Configurez ici vos différents disques de stockage.
    |
    */

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app'),
            'throw' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL').'/storage',
            'visibility' => 'public',
            'throw' => false,
        ],

        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'throw' => false,
        ],

        /**
         * Disque dédié au stockage sécurisé des documents ArchiveSafe.
         * Ce disque peut pointer vers un dossier spécifique ou un bucket S3.
         */
        'archivesafe' => [
            'driver' => env('ARCHIVESAFE_DISK', 'local'),
            'root' => env('ARCHIVESAFE_ROOT', storage_path('app/archivesafe')),
            'throw' => true,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Cloud Storage Options
    |--------------------------------------------------------------------------
    |
    | Options supplémentaires pour les services de stockage cloud.
    |
    */

    'cloud' => [
        'etc' => [],
    ],

];
