<?php

/**
 * Description : Interface AIServiceInterface pour ArchiveSafe.
 * Ce contrat définit les capacités d'intelligence artificielle requises pour le système,
 * permettant l'intégration de différents LLM (Gemini, OpenAI, etc.) de manière transparente.
 */

namespace App\Contracts;

use App\Models\Document;

interface AIServiceInterface
{
    /**
     * Génère un résumé concis du contenu d'un document.
     *
     * @param Document $document
     * @param int $maxLength Longueur maximale souhaitée pour le résumé.
     * @return string Le résumé généré.
     * @throws \Exception Si l'IA ne peut pas traiter le document.
     */
    public function summarize(Document $document, int $maxLength = 500): string;

    /**
     * Extrait des informations structurées spécifiques d'un document.
     * (ex: extraire la date, le montant total, le fournisseur d'une facture).
     *
     * @param Document $document
     * @param array $fields Liste des champs à extraire.
     * @return array Un tableau associatif contenant les informations extraites.
     * @throws \Exception
     */
    public function extractInformation(Document $document, array $fields): array;

    /**
     * Répond à une question spécifique basée sur le contenu d'un ou plusieurs documents.
     *
     * @param array $documents Liste de documents servant de contexte.
     * @param string $question La question posée par l'utilisateur.
     * @return string La réponse générée par l'IA.
     * @throws \Exception
     */
    public function answerQuestion(array $documents, string $question): string;

    /**
     * Analyse le document pour suggérer des tags pertinents.
     *
     * @param Document $document
     * @return array Liste de tags suggérés.
     */
    public function suggestTags(Document $document): array;
}
