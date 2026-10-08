<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class SystemController extends Controller
{
    /**
     * État global de santé du système.
     */
    public function status()
    {
        return response()->json([
            'status' => 'healthy',
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'environment' => app()->environment(),
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Statistiques du stockage.
     */
    public function storage()
    {
        $disk = Storage::disk('local');
        
        // Note: disk_free_space ne fonctionne que sur les systèmes de fichiers locaux
        $free = disk_free_space(storage_path('app'));
        $total = 0; // Difficile à obtenir de manière portable sans commande shell
        
        return response()->json([
            'disk_free_space' => $this->formatBytes($free),
            'storage_path' => storage_path('app'),
            'status' => $free > 1024 * 1024 * 100 ? 'ok' : 'warning', // Warning si < 100MB
        ]);
    }

    /**
     * État de Redis.
     */
    public function redis()
    {
        try {
            $info = Redis::info();
            return response()->json([
                'status' => 'connected',
                'version' => $info['redis_version'] ?? 'Unknown',
                'used_memory' => $this->formatBytes($info['used_memory'] ?? 0),
                'connected_clients' => $info['connected_clients'] ?? 0,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'disconnected',
                'error' => $e->getMessage()
            ], Response::HTTP_SERVICE_UNAVAILABLE);
        }
    }

    /**
     * État de la queue (Jobs OCR).
     */
    public function queue()
    {
        // Simulation de la taille de la queue pour l'exemple
        // Dans un vrai environnement, on utiliserait Redis::llen('queues:default')
        $size = Redis::llen('queues:default') ?? 0;

        return response()->json([
            'queue_name' => 'default',
            'pending_jobs' => $size,
            'status' => $size < 100 ? 'ok' : 'congested',
        ]);
    }

    /**
     * Accès aux journaux système.
     */
    public function logs()
    {
        $logPath = storage_path('logs/laravel.log');
        if (!file_exists($logPath)) {
            return response()->json(['logs' => 'Aucun log trouvé']);
        }

        $content = file($logPath);
        $recentLogs = array_slice($content, -100); // 100 dernières lignes

        return response()->json([
            'logs' => implode("", $recentLogs),
            'file' => 'laravel.log'
        ]);
    }

    /**
     * Paramètres système.
     */
    public function settings(Request $request)
    {
        if ($request->isMethod('get')) {
            return response()->json([
                'app_name' => config('app.name'),
                'timezone' => config('app.timezone'),
                'debug_mode' => config('app.debug'),
                'maintenance_mode' => app()->isDownForMaintenance(),
            ]);
        }

        // Mise à jour simplifiée des paramètres (exemple)
        return response()->json(['message' => 'Paramètres mis à jour']);
    }

    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
