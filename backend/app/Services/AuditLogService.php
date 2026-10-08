<?php

/**
 * Description : AuditLogService pour ArchiveSafe.
 * Ce service permet d'enregistrer toutes les actions critiques du système 
 * dans la table 'audit_logs'. Il assure la traçabilité complète des 
 * modifications de documents et des accès utilisateurs.
 */

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\DB;

class AuditLogService
{
    /**
     * Enregistre un événement d'audit.
     *
     * @param string $event Nom de l'événement (ex: 'document.create', 'document.update')
     * @param mixed $model Le modèle concerné (optionnel)
     * @param array|null $oldValues Valeurs avant modification (optionnel)
     * @param array|null $newValues Valeurs après modification (optionnel)
     * @return void
     */
    public function log(string $event, $model = null, ?array $oldValues = null, ?array $newValues = null): void
    {
        $userId = Auth::id();
        
        $auditableType = null;
        $auditableId = null;

        if ($model) {
            $auditableType = get_class($model);
            $auditableId = $model->getKey();
        }

        // Insertion directe via le Query Builder pour éviter les dépendances circulaires avec les modèles
        DB::table('audit_logs')->insert([
            'user_id' => $userId,
            'event' => $event,
            'auditable_type' => $auditableType,
            'auditable_id' => $auditableId,
            'old_values' => $oldValues ? json_encode($oldValues) : null,
            'new_values' => $newValues ? json_encode($newValues) : null,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Méthode helper pour enregistrer une suppression.
     */
    public function logDeletion($model): void
    {
        $this->log('deleted', $model, ['data' => $model->toArray()], null);
    }

    /**
     * Méthode helper pour enregistrer une mise à jour.
     */
    public function logUpdate($model, array $old, array $new): void
    {
        $this->log('updated', $model, $old, $new);
    }
}
