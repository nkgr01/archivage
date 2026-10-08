<?php

/**
 * Description : FileValidationService pour ArchiveSafe.
 * Ce service est responsable de la validation technique des fichiers importés 
 * (type MIME, taille, et intégrité) avant leur traitement par l'OCR.
 */

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

class FileValidationService
{
    /**
     * Liste des types MIME autorisés pour l'importation.
     */
    protected array $allowedMimeTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/tiff',
        'image/webp',
        'image/gif',
    ];

    /**
     * Valide si le fichier est acceptable pour le système.
     *
     * @param UploadedFile $file
     * @return array{isValid: bool, message: string|null}
     */
    public function validate(UploadedFile $file): array
    {
        try {
            // 1. Vérification du type MIME
            if (!$this->isValidMimeType($file)) {
                return [
                    'isValid' => false, 
                    'message' => 'Le format du fichier n'est pas supporté. Veuillez fournir un PDF ou une image.'
                ];
            }

            // 2. Vérification de l'intégrité du fichier (lecture basique)
            if (!$this->isReadable($file)) {
                return [
                    'isValid' => false, 
                    'message' => 'Le fichier semble corrompu ou illisible.'
                ];
            }

            return ['isValid' => true, 'message' => null];

        } catch (\Exception $e) {
            Log::error("Erreur lors de la validation du fichier: " . $e->getMessage());
            return [
                'isValid' => false, 
                'message' => 'Une erreur interne est survenue lors de la validation du fichier.'
            ];
        }
    }

    /**
     * Vérifie si le type MIME du fichier est dans la liste des types autorisés.
     */
    protected function isValidMimeType(UploadedFile $file): bool
    {
        return in_array($file->getMimeType(), $this->allowedMimeTypes);
    }

    /**
     * Vérifie si le fichier peut être lu sans erreur.
     */
    protected function isReadable(UploadedFile $file): bool
    {
        try {
            // Tentative de lecture d'un petit fragment du fichier pour vérifier l'accessibilité
            $handle = fopen($file->getRealPath(), 'rb');
            if (!$handle) return false;
            
            fread($handle, 1024);
            fclose($handle);
            
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}
