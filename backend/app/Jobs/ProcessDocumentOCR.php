<?php

/**
 * Description : ProcessDocumentOCR Job pour ArchiveSafe.
 * Ce Job est exécuté de manière asynchrone via les queues Laravel.
 * Il orchestre le pipeline OCR complet : comptage des pages, extraction du texte, 
 * génération de l'archive PDF/A et création de la vignette.
 */

namespace App\Jobs;

use App\Contracts\OCRServiceInterface;
use App\Models\Document;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessDocumentOCR implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Le nombre maximum de tentatives en cas d'échec.
     */
    public int $tries = 3;

    /**
     * Le délai d'attente avant de réessayer en cas d'échec (en secondes).
     */
    public int $backoff = 60;

    protected Document $document;

    /**
     * Création d'une nouvelle instance du Job.
     *
     * @param Document $document
     */
    public function __construct(Document $document)
    {
        $this->document = $document;
    }

    /**
     * Exécute le Job.
     *
     * @param OCRServiceInterface $ocrService
     * @return void
     */
    public function handle(OCRServiceInterface $ocrService): void
    {
        Log::info("Début du traitement OCR pour le document ID: {$this->document->id}");

        try {
            // 1. Analyse du nombre de pages
            $pageCount = $ocrService->getPageCount($this->document);
            
            // 2. Extraction du texte brut
            $text = $ocrService->extractText($this->document);
            
            // 3. Génération de l'archive PDF/A
            $archivePath = $ocrService->generateArchive($this->document);
            
            // 4. Génération de la vignette
            $thumbnailPath = $ocrService->generateThumbnail($this->document);

            // Mise à jour finale du document en base de données
            $this->document->update([
                'content' => $text,
                'ocr_text' => $text,
                'page_count' => $pageCount,
                'archive_filename' => $archivePath,
                'status' => 'completed',
                'processed_at' => now(),
            ]);

            Log::info("Traitement OCR terminé avec succès pour le document ID: {$this->document->id}");

        } catch (\Exception $e) {
            Log::error("Échec critique du Job OCR pour le document {$this->document->id}: " . $e->getMessage());
            
            // On relance l'exception pour que Laravel gère la tentative (retry)
            throw $e;
        }
    }

    /**
     * Gère les erreurs lorsque le Job a échoué après toutes les tentatives.
     */
    public function failed(\Throwable $exception): void
    {
        Log::critical("Le Job OCR a définitivement échoué pour le document {$this->document->id}. Erreur: " . $exception->getMessage());

        $this->document->update([
            'status' => 'failed',
            'processed_at' => now(),
        ]);
    }
}
