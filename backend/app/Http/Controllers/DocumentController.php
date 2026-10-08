<?php

/**
 * Description : DocumentController pour ArchiveSafe.
 * Contrôleur REST gérant les opérations CRUD sur les documents (index, show, update, delete, trash).
 */

namespace App\Http\Controllers;

use App\Models\Document;
//use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
//use Illuminate\Support\Facades\Storage;
//use Illuminate\Support\Str;

class DocumentController extends Controller
{
    /**
     * Liste les documents de l'utilisateur connecté avec support recherche, tri et pagination.
     */
    public function index(Request $request)
    {
        $query = Document::where('user_id', Auth::id());

        // Recherche sémantique IA (Placeholder pour future intégration)
        if ($request->has('semantic') && $request->boolean('semantic')) {
            // Ici on appellera le service de recherche vectorielle
            // Pour l'instant, on fallback sur la recherche FullText
        }

        // Recherche plein texte
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%")
                  ->orWhere('ocr_text', 'like', "%{$search}%");
            });
        }

        // Filtre par statut
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filtre par type MIME
        if ($request->has('mime_type') && $request->mime_type) {
            $mime = $request->mime_type;
            if (str_contains($mime, '/')) {
                $query->where('mime_type', $mime);
            } else {
                $query->where('mime_type', 'like', $mime . '%');
            }
        }

        // Filtre par plage de dates
        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Filtre par Tags (JSON)
        if ($request->has('tag') && $request->tag) {
            $query->whereJsonContains('metadata->tags', $request->tag);
        }

        // Filtre par Correspondant (JSON)
        if ($request->has('correspondent') && $request->correspondent) {
            $query->where('metadata->correspondent', 'like', "%{$request->correspondent}%");
        }

        // Tri (whitelist colonnes autorisées)
        $allowedSortFields = ['created_at', 'title', 'file_size', 'status', 'mime_type', 'updated_at'];
        $sortField = $request->get('sortField', 'created_at');
        $sortOrder = strtolower($request->get('sortOrder', 'desc')) === 'asc' ? 'asc' : 'desc';
        if (! in_array($sortField, $allowedSortFields, true)) {
            $sortField = 'created_at';
        }
        $query->orderBy($sortField, $sortOrder);

        // Pagination — exclure le contenu OCR lourd de la liste
        $perPage = min((int) $request->get('rows', 15), 100);
        $documents = $query
            ->select([
                'id', 'user_id', 'title', 'checksum', 'mime_type', 'page_count',
                'filename', 'file_size', 'archive_filename', 'original_filename',
                'ai_summary', 'metadata', 'status', 'processed_at',
                'created_at', 'updated_at', 'deleted_at',
            ])
            ->paginate($perPage);

        return response()->json([
            'data' => $documents->items(),
            'totalRecords' => $documents->total(),
            'rows' => $documents->perPage(),
        ]);
    }

    /**
     * Affiche les détails d'un document spécifique.
     */
    public function show($id)
    {
        // Recherche du document appartenant à l'utilisateur connecté
        $document = Document::where('user_id', Auth::id())
            ->findOrFail($id);

        return response()->json($document);
    }

    /**
     * Met à jour les métadonnées d'un document.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'metadata' => 'sometimes|array',
        ]);

        $document = Document::where('user_id', Auth::id())
            ->findOrFail($id);

        $updateData = [];
        if ($request->has('title')) {
            $updateData['title'] = $request->title;
        }

        if ($request->has('metadata')) {
            // Fusion des métadonnées existantes avec les nouvelles
            $currentMetadata = $document->metadata ?? [];
            $updateData['metadata'] = array_merge($currentMetadata, $request->metadata);
        }

        $document->update($updateData);

        return response()->json([
            'message' => 'Document mis à jour avec succès',
            'document' => $document,
        ]);
    }


    /**
     * Envoie un document vers la corbeille (Soft Delete).
     */
    public function destroy($id)
    {
        $document = Document::where('user_id', Auth::id())
            ->findOrFail($id);

        $document->delete(); // Soft-delete Eloquent

        return response()->json([
            'message' => 'Document déplacé vers la corbeille avec succès',
        ]);
    }

    /**
     * Liste les documents supprimés (corbeille).
     */
    public function trash()
    {
        // Récupération uniquement des documents soft-deletés
        $trashed = Document::onlyTrashed()
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return response()->json($trashed);
    }

    /**
     * Restaure un document de la corbeille.
     */
    public function restore($id)
    {
        $document = Document::onlyTrashed()
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        $document->restore(); // Restauration du document

        return response()->json([
            'message' => 'Document restauré de la corbeille avec succès',
            'document' => $document,
        ]);
    }

    /**
     * Supprime définitivement un document et ses fichiers associés.
     */
    public function forceDelete($id)
    {
        $document = Document::onlyTrashed()
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        // Note : Le service de stockage devra s'occuper de supprimer les fichiers physiques (Phase 3/4)
        $document->forceDelete(); // Suppression définitive de la BDD

        return response()->json([
            'message' => 'Document supprimé définitivement',
        ]);
    }
}
