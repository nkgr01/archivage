<?php

/**
 * Description : SummaryController pour ArchiveSafe.
 * Ce contrôleur expose les fonctionnalités d'IA pour générer des résumés 
 * automatiques des documents à l'aide du service d'IA.
 */

namespace App\Http\Controllers;

use App\Contracts\AIServiceInterface;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SummaryController extends Controller
{
    protected AIServiceInterface $aiService;

    /**
     * Injection du service d'IA via le constructeur.
     * Laravel résout automatiquement l'interface AIServiceInterface 
     * vers l'implémentation GeminiAIService.
     */
    public function __construct(AIServiceInterface $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Génère un résumé pour un document spécifique.
     *
     * @param Request $request
     * @param int $id ID du document
     * @return \Illuminate\Http\JsonResponse
     */
    public function summarize(Request $request, $id)
    {
        // Validation de la longueur maximale du résumé si fournie
        $maxLength = $request->query('length', 500);

        // Récupération du document appartenant à l'utilisateur connecté
        $document = Document::where('user_id', Auth::id())->findOrFail($id);

        // Vérification si le document a du contenu OCR
        if (empty($document->content)) {
            return response()->json([
                'message' => 'Ce document ne contient pas de texte exploitable pour un résumé (OCR non terminé ou vide).',
                'error' => 'No content'
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            // Appel au service d'IA pour générer le résumé
            $summary = $this->aiService->summarize($document, (int)$maxLength);

            return response()->json([
                'document_id' => $document->id,
                'title' => $document->title,
                'summary' => $summary,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'L\'IA n\'a pas pu générer le résumé.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Analyse un document et propose des tags suggérés par l'IA.
     */
    public function suggestTags($id)
    {
        $document = Document::where('user_id', Auth::id())->findOrFail($id);

        if (empty($document->content)) {
            return response()->json([
                'message' => 'Contenu vide, impossible de suggérer des tags.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $tags = $this->aiService->suggestTags($document);

            return response()->json([
                'document_id' => $document->id,
                'suggested_tags' => $tags,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la suggestion de tags.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
