<?php

/**
 * Description : TesseractOCRService pour ArchiveSafe.
 * Implémentation concrète de l'OCR utilisant l'outil 'ocrmypdf' (qui encapsule Tesseract, 
 * Ghostscript et Unpaper). Ce service gère l'extraction de texte, la création d'archives 
 * PDF/A et la génération de vignettes.
 */

namespace App\Services\OCR;

use App\Contracts\OCRServiceInterface;
use App\Models\Document;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class TesseractOCRService implements OCRServiceInterface
{
    /**
     * Chemin vers le binaire ocrmypdf. 
     * Idéalement configuré via le fichier .env.
     */
    protected string $ocrBinary;
    protected string $pdfInfoBinary;

    public function __construct()
    {
        $this->ocrBinary = env('OCR_BINARY_PATH', 'ocrmypdf');
        $this->pdfInfoBinary = env('PDFINFO_BINARY_PATH', 'pdfinfo');

        // Vérification légère des binaires externes pour aider le développeur
        try {
            $checkOcr = new Process([$this->ocrBinary, '--version']);
            $checkOcr->run();
            if (!$checkOcr->isSuccessful()) {
                Log::warning("Binaire OCR non trouvé ou non exécutable : {$this->ocrBinary}");
            }
        } catch (\Throwable $e) {
            Log::warning("Impossible de vérifier le binaire OCR ({$this->ocrBinary}) : " . $e->getMessage());
        }

        try {
            $checkPdfInfo = new Process([$this->pdfInfoBinary, '--version']);
            $checkPdfInfo->run();
            if (!$checkPdfInfo->isSuccessful()) {
                Log::warning("Binaire pdfinfo non trouvé ou non exécutable : {$this->pdfInfoBinary}");
            }
        } catch (\Throwable $e) {
            Log::warning("Impossible de vérifier le binaire pdfinfo ({$this->pdfInfoBinary}) : " . $e->getMessage());
        }
    }

    /**
     * Effectue l'OCR et extrait le texte brut.
     * Utilise l'option --sidecar pour générer un fichier texte séparé.
     */
    public function extractText(Document $document): string
    {
        $inputPath = Storage::disk('archivesafe')->path($document->filename);
        $tempTextFile = storage_path('app/temp/ocr_' . $document->id . '.txt');
        $tempPdfFile = storage_path('app/temp/ocr_' . $document->id . '.pdf');

        // Commande : ocrmypdf --sidecar [texte] [entrée] [sortie]
        $process = new Process([
            $this->ocrBinary,
            '--sidecar', $tempTextFile,
            '--skip-text', // Ne pas refaire l'OCR si du texte existe déjà
            $inputPath,
            $tempPdfFile
        ]);

        try {
            $process->mustRun();
            $text = file_get_contents($tempTextFile);
            
            // Nettoyage des fichiers temporaires
            @unlink($tempTextFile);
            @unlink($tempPdfFile);

            return $text;
        } catch (ProcessFailedException $e) {
            Log::error("Échec de l'extraction OCR pour le document {$document->id}: " . $e->getMessage());
            throw new \Exception("L'extraction du texte a échoué.");
        }
    }

    /**
     * Génère une archive PDF/A conforme.
     */
    public function generateArchive(Document $document): string
    {
        $inputPath = Storage::disk('archivesafe')->path($document->filename);
        $archiveFilename = 'archives/' . Str::uuid() . '.pdf';
        $outputPath = Storage::disk('archivesafe')->path($archiveFilename);

        // S'assurer que le dossier archives existe
        Storage::disk('archivesafe')->makeDirectory('archives');

        // Commande : ocrmypdf [entrée] [sortie]
        $process = new Process([
            $this->ocrBinary,
            '--output-type', 'pdfa',
            $inputPath,
            $outputPath
        ]);

        try {
            $process->mustRun();
            
            // Mise à jour du document avec le chemin de l'archive
            $document->update(['archive_filename' => $archiveFilename]);

            return $archiveFilename;
        } catch (ProcessFailedException $e) {
            Log::error("Échec de la génération d'archive pour le document {$document->id}: " . $e->getMessage());
            throw new \Exception("La génération de l'archive PDF/A a échoué.");
        }
    }

    /**
     * Génère une vignette à partir de la première page du PDF.
     * Utilise généralement pdftoppm ou ImageMagick.
     */
    public function generateThumbnail(Document $document): string
    {
        $inputPath = Storage::disk('archivesafe')->path($document->filename);
        $thumbBase = 'thumbs/' . Str::uuid();
        $thumbFilename = $thumbBase . '.jpg';
        $outputBasePath = Storage::disk('archivesafe')->path($thumbBase);

        Storage::disk('archivesafe')->makeDirectory('thumbs');

        // Commande simplifiée via pdftoppm (partie de poppler-utils)
        $process = new Process([
            'pdftoppm',
            '-jpeg',
            '-singlefile',
            '-scale-to',
            '300',
            $inputPath,
            $outputBasePath
        ]);

        try {
            $process->mustRun();
            return $thumbFilename;
        } catch (\Exception $e) {
            Log::warning("Impossible de générer la vignette pour le document {$document->id}.", ['error' => $e->getMessage()]);
            return ''; 
        }
    }

    /**
     * Récupère le nombre de pages via pdfinfo.
     */
    public function getPageCount(Document $document): int
    {
        $inputPath = Storage::disk('archivesafe')->path($document->filename);

        $process = new Process([$this->pdfInfoBinary, $inputPath]);
        
        try {
            $process->mustRun();
            $output = $process->getOutput();
            
            // Extraction du nombre de pages via regex (ex: "Pages: 5")
            if (preg_match('/Pages:\s+(\d+)/', $output, $matches)) {
                return (int)$matches[1];
            }
        } catch (\Exception $e) {
            Log::error("Erreur lors du comptage des pages pour le document {$document->id}.");
        }

        return 0;
    }
}
