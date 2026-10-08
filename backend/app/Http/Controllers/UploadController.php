<?php

/**
 * Description : UploadController pour ArchiveSafe.
 * Ce contrôleur gère l'importation des documents, la validation initiale 
 * et le déclenchement du processus d'enregistrement.
 */

namespace App\Http\Controllers;

use App\Models\Document;
use App\Services\Storage\DocumentStorageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class UploadController extends Controller
{
    protected $storageService;

    /**
     * Injection du service de stockage via le constructeur.
     */
    public function __construct(DocumentStorageService $storageService)
    {
        $this->storageService = $storageService;
    }

    /**
     * Gère l'upload d'un nouveau document.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function upload(Request $request)
    {
        // Validation basique du fichier
        $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx,txt,jpg,jpeg,png|max:51200', // Max 50MB
            'title' => 'nullable|string|max:255',
        ]);

        $file = $request->file('file');
        $user = Auth::user();

        // 1. Création de l'entrée en base de données
        // On utilise le nom original comme titre par défaut si non fourni
        $document = Document::create([
            'user_id' => $user->id,
            'title' => $request->input('title', pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)),
            'original_filename' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'checksum' => hash_file('sha256', $file->getRealPath()),
            'file_size' => $file->getSize(),
            'filename' => 'pending',
            'status' => 'pending',
        ]);

        try {
            // 2. Stockage physique du fichier via le service dédié
            $this->storageService->storeDocument($file, $document);

            // Déclenchement du pipeline OCR asynchrone
            \App\Jobs\ProcessDocumentOCR::dispatch($document);

            return response()->json([
                'message' => 'Document ajouté avec succès',
                'document' => $document,
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            // Nettoyage en cas d'échec du stockage
            $document->delete();
            
            return response()->json([
                'message' => 'Erreur lors du stockage du fichier',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Récupère le statut d'un upload (utile pour suivre l'OCR en cours).
     */
    public function status($id)
    {
        $document = Document::where('user_id', Auth::id())->findOrFail($id);

        return response()->json([
            'id' => $document->id,
            'title' => $document->title,
            'status' => $document->status,
            'content_available' => !empty($document->content),
        ]);
    }
}
