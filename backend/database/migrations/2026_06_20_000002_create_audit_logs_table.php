<?php

/**
 * Description : Migration pour la création de la table 'audit_logs'.
 * Cette table enregistre toutes les actions critiques effectuées sur le système
 * pour garantir la traçabilité et la sécurité (Audit Trail).
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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id(); // Identifiant unique de l'entrée d'audit
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null'); // Utilisateur ayant effectué l'action
            $table->string('event'); // Nom de l'événement (ex: 'document.uploaded', 'document.deleted', 'user.login')
            $table->string('auditable_type')->nullable(); // Type du modèle concerné (ex: App\Models\Document)
            $table->unsignedBigInteger('auditable_id')->nullable(); // ID du modèle concerné
            $table->json('old_values')->nullable(); // État des données avant modification
            $table->json('new_values')->nullable(); // État des données après modification
            $table->string('ip_address', 45)->nullable(); // Adresse IP de l'utilisateur
            $table->text('user_agent')->nullable(); // Navigateur/Client utilisé
            $table->timestamps(); // created_at (moment de l'action)
        });
    }

    /**
     * Annule les opérations de la migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
