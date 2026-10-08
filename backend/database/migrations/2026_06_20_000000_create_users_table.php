<?php

/**
 * Description : Migration pour la création de la table 'users'.
 * Cette table gère l'authentification et les informations de base des utilisateurs 
 * du système ArchiveSafe.
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
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // Identifiant unique auto-incrémenté
            $table->string('name'); // Nom complet de l'utilisateur
            $table->string('email')->unique(); // Email unique pour l'authentification
            $table->timestamp('email_verified_at')->nullable(); // Date de vérification de l'email
            $table->string('password'); // Mot de passe haché
            $table->string('role')->default('user'); // Rôle de l'utilisateur (ex: user, admin)
            $table->rememberToken(); // Token pour la fonctionnalité "se souvenir de moi"
            $table->timestamps(); // colonnes created_at et updated_at
        });
    }

    /**
     * Annule les opérations de la migration.
     */
    public function down(): void
    {
        // Suppression de la table users en cas de rollback
        Schema::dropIfExists('users');
    }
};
