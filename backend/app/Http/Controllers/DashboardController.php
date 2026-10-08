<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Document;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Retourne les statistiques et les données du tableau de bord.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $today = Carbon::today();

        // 1. Statistiques Globales
        $stats = [
            'total_documents' => Document::where('user_id', $user->id)->count(),
            'added_today' => Document::where('user_id', $user->id)
                ->whereDate('created_at', $today)
                ->count(),
            'ocr_pending' => Document::where('user_id', $user->id)
                ->where('status', 'pending')
                ->count(),
            'ocr_completed' => Document::where('user_id', $user->id)
                ->where('status', 'completed')
                ->count(),
            'total_storage_bytes' => Document::where('user_id', $user->id)->sum('file_size'),
        ];

        // 2. Activité Récente (5 derniers documents)
        $recentDocs = Document::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'title', 'created_at', 'status']);

        // 3. Répartition par Type (MIME type)
        $typeDistribution = Document::where('user_id', $user->id)
            ->select('mime_type', DB::raw('count(*) as total'))
            ->groupBy('mime_type')
            ->get();

        // 4. Répartition par Tags (via metadata JSON)
        // Note: On suppose que les tags sont stockés dans metadata->tags (array)
        $tagsDistribution = Document::where('user_id', $user->id)
            ->whereNotNull('metadata')
            ->get()
            ->flatMap(function ($doc) {
                return $doc->metadata['tags'] ?? [];
            })
            ->countBy()
            ->map(fn($count, $tag) => ['tag' => $tag, 'count' => $count]);

        // 5. Répartition par Correspondants (via metadata JSON)
        $correspondentDistribution = Document::where('user_id', $user->id)
            ->whereNotNull('metadata')
            ->get()
            ->flatMap(function ($doc) {
                return [$doc->metadata['correspondent'] ?? null];
            })
            ->filter()
            ->countBy()
            ->map(fn($count, $name) => ['name' => $name, 'count' => $count]);

        return response()->json([
            'stats' => $stats,
            'recent_activity' => $recentDocs,
            'distributions' => [
                'types' => $typeDistribution,
                'tags' => $tagsDistribution,
                'correspondents' => $correspondentDistribution,
            ],
            'storage' => [
                'used_bytes' => $stats['total_storage_bytes'],
                'limit_bytes' => 5 * 1024 * 1024 * 1024, // 5GB par défaut
            ]
        ]);
    }
}
