<?php

/**
 * Description : Fichier de définition des routes API pour ArchiveSafe.
 * Ce fichier expose tous les endpoints nécessaires au fonctionnement du système,
 * en appliquant les middlewares d'authentification et de rôles.
 */

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\SummaryController;
use App\Http\Middleware\AuthenticateApi;
use App\Http\Middleware\RolesMiddleware;
use App\Http\Controllers\AIController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SystemController;
use App\Http\Controllers\UserController;


/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Auth required)
|--------------------------------------------------------------------------
*/
Route::middleware([AuthenticateApi::class])->group(function () {
    
    // Authentification
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

        // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Gestion des Documents (routes littérales avant {id})
    Route::get('/documents/trash', [DocumentController::class, 'trash']);
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::get('/documents/{id}', [DocumentController::class, 'show']);
    Route::put('/documents/{id}', [DocumentController::class, 'update']);
    Route::delete('/documents/{id}', [DocumentController::class, 'destroy']);
    Route::post('/documents/{id}/restore', [DocumentController::class, 'restore']);
    Route::delete('/documents/{id}/force-delete', [DocumentController::class, 'forceDelete']);

    // Upload & Ingestion
    Route::post('/upload', [UploadController::class, 'upload']);
    Route::get('/upload/status/{id}', [UploadController::class, 'status']);

    // Intelligence Artificielle (Gemini)
    Route::get('/ai/summarize/{id}', [SummaryController::class, 'summarize']);
    Route::get('/ai/suggest-tags/{id}', [SummaryController::class, 'suggestTags']);
    Route::post('/ai/chat/{id}', [AIController::class, 'chat']);
    Route::get('/ai/explore', [AIController::class, 'explore']);
    Route::get('/ai/analyze/{id}', [AIController::class, 'analyze']);

        // Audit Logs
    Route::get('/audit-logs', [AuditLogController::class, 'index']);
    Route::get('/audit-logs/{id}', [AuditLogController::class, 'show']);
    Route::get('/audit-logs/action/{action}', [AuditLogController::class, 'getByAction']);
    Route::get('/audit-logs/model/{modelType}/{modelId}', [AuditLogController::class, 'getByModel']);

    /*
    |--------------------------------------------------------------------------
    | Admin Routes (Role 'admin' required)
    |--------------------------------------------------------------------------
    */
    Route::middleware([RolesMiddleware::class . ':admin'])->group(function () {
        // Gestion des utilisateurs
        Route::get('/admin/users', [UserController::class, 'index']);
        Route::post('/admin/users', [UserController::class, 'store']);
        Route::get('/admin/users/{id}', [UserController::class, 'show']);
        Route::put('/admin/users/{id}', [UserController::class, 'update']);
        Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);

        // Monitoring Système
        Route::get('/admin/system/status', [SystemController::class, 'status']);
        Route::get('/admin/system/storage', [SystemController::class, 'storage']);
        Route::get('/admin/system/redis', [SystemController::class, 'redis']);
        Route::get('/admin/system/queue', [SystemController::class, 'queue']);
        Route::get('/admin/system/logs', [SystemController::class, 'logs']);
        Route::get('/admin/system/settings', [SystemController::class, 'settings']);
        Route::put('/admin/system/settings', [SystemController::class, 'settings']);
    });
});
