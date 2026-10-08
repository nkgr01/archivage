<?php

/**
 * Description : Migration pour la création de la table 'documents'.
 * Cette table stocke les métadonnées des documents, le texte extrait 
 * et les chemins vers les fichiers physiques.
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Exécute les opérations de migration.
     */
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id(); // Identifiant unique
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Propriétaire du document
            $table->string('title'); // Titre du document
            $table->longText('content')->nullable(); // Texte brut extrait par l'OCR
            $table->string('checksum')->index(); // Checksum SHA256 pour éviter les doublons
            $table->string('mime_type'); // Type MIME du fichier
            $table->integer('page_count')->nullable(); // Nombre de pages
            $table->string('filename'); // Nom du fichier stocké sur le disque
            $table->string('archive_filename')->nullable(); // Nom du fichier PDF/A archivé
            $table->string('original_filename'); // Nom original lors de l'upload
            $table->softDeletes(); // Gestion de la corbeille (deleted_at)
            $table->timestamps(); // created_at et updated_at

            $table->fullText(['title', 'content']); // Index pour la recherche plein texte
        });
    }

    /**
     * Annule les opérations de la migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
