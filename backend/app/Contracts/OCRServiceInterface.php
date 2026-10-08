<?php

/**
 * Description : Interface OCRServiceInterface pour ArchiveSafe.
 * Ce contrat définit les méthodes obligatoires pour tout service d'OCR 
 * intégré au système, garantissant que l'implémentation (Tesseract, AWS Textract, etc.) 
 * reste interchangeable.
 */

namespace App\Contracts;

use App\Models\Document;
use Illuminate\Http\UploadedFile;

interface OCRServiceInterface
{
    /**
     * Effectue l'OCR sur un document et extrait le texte brut.
     *
     * @param Document $document
     * @return string Le texte extrait du document.
     * @throws \Exception Si l'OCR échoue.
     */
    public function extractText(Document $document): string;

    /**
     * Génère une archive PDF/A du document avec une couche de texte OCR.
     *
     * @param Document $document
     * @return string Le chemin vers le fichier PDF/A généré.
     * @throws \Exception Si la génération de l'archive échoue.
     */
    public function generateArchive(Document $document): string;

    /**
     * Génère une vignette (thumbnail) pour l'aperçu du document.
     *
     * @param Document $document
     * @return string Le chemin vers l'image de la vignette.
     * @throws \Exception Si la génération de la vignette échoue.
     */
    public function generateThumbnail(Document $document): string;

    /**
     * Analyse le document pour déterminer le nombre de pages.
     *
     * @param Document $document
     * @return int Le nombre de pages détectées.
     */
    public function getPageCount(Document $document): int;
}
