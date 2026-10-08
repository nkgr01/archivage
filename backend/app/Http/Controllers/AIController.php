<?php

namespace App\Http\Controllers;

use App\Contracts\AIServiceInterface;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AIController extends Controller
{
    protected AIServiceInterface $aiService;

    public function __construct(AIServiceInterface $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Répond à une question sur un document spécifique (Chat).
     */
    public function chat(Request $request, $id)
    {
        $request->validate([
            'question' => 'required|string|max:1000',
        ]);

        $document = Document::where('user_id', Auth::id())->findOrFail($id);

        if (empty($document->content)) {
            return response()->json([
                'message' => 'Le document ne contient pas de texte exploitable.',
                'error' => 'No content'
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $answer = $this->aiService->answerQuestion([$document], $request->question);

            return response()->json([
                'answer' => $answer,
                'document_id' => $document->id,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'L\'IA n\'a pas pu répondre à la question.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Analyse globale du corpus pour l'exploration sémantique.
     */
    public function explore(Request $request)
    {
        $query = $request->query('q');

        if (empty($query)) {
            return response()->json(['message' => 'Requête requise'], Response::HTTP_BAD_REQUEST);
        }

        // Simulation de recherche sémantique basée sur le contenu
        // Dans une version avancée, on utiliserait des embeddings et une base vectorielle
        $documents = Document::where('user_id', Auth::id())
            ->where('content', 'LIKE', "%{$query}%")
            ->limit(10)
            ->get();

        $results = $documents->map(function ($doc) use ($query) {
            return [
                'id' => $doc->id,
                'docName' => $doc->title ?: 'Sans titre',
                'score' => rand(70, 99), // Simulation de score de pertinence
                'excerpt' => substr($doc->content, 0, 200) . '...',
                'tags' => $doc->metadata['tags'] ?? [],
            ];
        });

        return response()->json([
            'query' => $query,
            'results' => $results,
        ]);
    }

    public function analyze(Request $request, $id)
    {
        $document = Document::where('user_id', Auth::id())->findOrFail($id);

        if (empty($document->content)) {
            return response()->json([
                'message' => 'Document not processed yet',
            ], 400);
        }

        try {
            $info = $this->aiService->extractInformation($document, ['language', 'category', 'main_entities']);

            return response()->json([
                'document_id' => $document->id,
                'analysis' => $info,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur d\'analyse',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}