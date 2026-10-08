<?php

/**
 * Description : GeminiAIService pour ArchiveSafe.
 * Implémentation concrète de l'interface AIServiceInterface utilisant l'API Google Gemini.
 * Ce service permet de transformer le texte brut extrait par l'OCR en insights intelligents.
 */

namespace App\Services\AI;

use App\Contracts\AIServiceInterface;
use App\Models\Document;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiAIService implements AIServiceInterface
{
    protected string $apiKey;
    protected string $apiUrl;

    public function __construct()
    {
        // Récupération de la clé API et de l'URL depuis le fichier .env
        $this->apiKey = config('services.gemini.key') ?? env('GEMINI_API_KEY');
        $this->apiUrl = config('services.gemini.url') ?? env('GEMINI_API_URL', 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent');
    }

    /**
     * Génère un résumé concis du contenu d'un document.
     */
    public function summarize(Document $document, int $maxLength = 500): string
    {
        $prompt = "Rédige un résumé concis et professionnel du texte suivant, en maximum {$maxLength} caractères. " .
                  "Si le texte est incohérent, indique que le document est illisible.

" . 
                  "Texte :
" . $document->content;

        return $this->callGemini($prompt);
    }

    /**
     * Extrait des informations structurées (format JSON).
     */
    public function extractInformation(Document $document, array $fields): array
    {
        $fieldsList = implode(', ', $fields);
        $prompt = "Analyse le texte suivant et extrais uniquement les informations suivantes : {$fieldsList}. " .
                  "Réponds strictement au format JSON. Si une information est absente, mets la valeur à null.

" . 
                  "Texte :
" . $document->content;

        $response = $this->callGemini($prompt);

        // Première tentative : décodage direct
        $data = json_decode($response, true);

        // Si échec, tenter d'extraire le premier objet JSON présent dans la réponse
        if (!is_array($data)) {
            if (preg_match('/\{.*\}/s', $response, $matches)) {
                $jsonString = $matches[0];
                $decoded = json_decode($jsonString, true);
                if (is_array($decoded)) {
                    return $decoded;
                }
            }

            // Retour d'erreur enrichi pour faciliter le debug
            return [
                'error' => "L'IA n'a pas retourné un JSON décodable",
                'raw' => $response,
            ];
        }

        return $data;
    }

    /**
     * Répond à une question basée sur un ou plusieurs documents.
     */
    public function answerQuestion(array $documents, string $question): string
    {
        $context = "";
        foreach ($documents as $doc) {
            $context .= "--- Document ID {$doc->id} ---
" . $doc->content . "

";
        }

        $prompt = "En utilisant uniquement le contexte suivant, réponds précisément à la question. " .
                  "Si la réponse n'est pas dans le contexte, dis que tu ne sais pas.

" . 
                  "Contexte :
" . $context . "

" . 
                  "Question : " . $question;

        return $this->callGemini($prompt);
    }

    /**
     * Suggère des tags pertinents pour le document.
     */
    public function suggestTags(Document $document): array
    {
        $prompt = "Analyse le texte suivant et propose 3 à 5 tags (mots-clés) pertinents pour classer ce document. " .
                  "Réponds uniquement sous la forme d'une liste séparée par des virgules.

" . 
                  "Texte :
" . $document->content;

        $response = $this->callGemini($prompt);
        
        // Conversion de la chaîne en tableau
        return array_map('trim', explode(',', $response));
    }

    /**
     * Méthode interne pour effectuer l'appel HTTP vers l'API Gemini.
     */
    protected function callGemini(string $prompt): string
    {
        if (empty($this->apiKey)) {
            throw new \Exception("La clé API Gemini n'est pas configurée dans le fichier .env");
        }

        try {
            $response = Http::post("{$this->apiUrl}?key={$this->apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ]
            ]);

            if ($response->failed()) {
                throw new \Exception("Erreur API Gemini : " . $response->body());
            }

            // Extraction de la réponse textuelle dans la structure JSON de Gemini
            $data = $response->json();
            return $data['candidates'][0]['content']['parts'][0]['text'] ?? "Aucune réponse générée par l'IA.";

        } catch (\Exception $e) {
            Log::error("Erreur GeminiAIService : " . $e->getMessage());
            throw new \Exception("L'IA a rencontré un problème lors du traitement.");
        }
    }
}
