<?php

/**
 * Description : DocumentStorageService pour ArchiveSafe.
 * Ce service gère l'enregistrement physique des fichiers, la génération
 * de noms uniques, la création de vignettes et la suppression des documents.
 */

namespace App\Services\Storage;

use App\Models\Document;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;

class DocumentStorageService
{
    /**
     * Enregistre un fichier uploadé et retourne le chemin relatif.
     *
     * @param UploadedFile $file
     * @param Document $document
     * @return string
     */
    public function storeDocument(UploadedFile $file, Document $document): string
    {
        // Génération d'un nom de fichier unique pour éviter les collisions
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        
        // Stockage dans le dossier 'documents' du disque dédié ArchiveSafe.
        $path = $file->storeAs('documents', $filename, 'archivesafe');

        // Mise à jour du modèle document avec le nom du fichier
        $document->update([
            'filename' => $path,
        ]);

        return $path;
    }

    /**
     * Gère l'archivage du document en format PDF/A (simulé ici).
     * 
     * @param Document $document
     * @return string|null
     */
    public function archiveDocument(Document $document): ?string
    {
        // Cette méthode sera étendue durant la Phase 4 (OCR Pipeline)
        // Elle appellera ocrmypdf pour générer l'archive
        return null;
    }

    /**
     * Supprime physiquement un document et son archive.
     *
     * @param Document $document
     * @return bool
     */
    public function deleteDocumentFiles(Document $document): bool
    {
        $deleted = true;

        // Suppression du fichier original
        if ($document->filename && Storage::disk('archivesafe')->exists($document->filename)) {
            Storage::disk('archivesafe')->delete($document->filename);
        }

        // Suppression de l'archive PDF/A
        if ($document->archive_filename && Storage::disk('archivesafe')->exists($document->archive_filename)) {
            Storage::disk('archivesafe')->delete($document->archive_filename);
        }

        return $deleted;
    }

    /**
     * Génère l'URL publique pour le téléchargement du document.
     *
     * @param Document $document
     * @return string
     */
    public function getDownloadUrl(Document $document): string
    {
        return Storage::disk('archivesafe')->url($document->filename);
    }
}
