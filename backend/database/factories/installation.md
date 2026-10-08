# Guide d'Installation et d'Initialisation - ArchiveSafe

Ce document fournit la procédure pas-à-pas pour installer et configurer l'application ArchiveSafe sur votre machine locale.

## 📋 Pré-requis Système

Avant de commencer, assurez-vous d'avoir installé les composants suivants :

### 1. Environnement PHP & Web
- **PHP 8.2+** (avec extensions `bcmath`, `ctype`, `fileinfo`, `json`, `mbstring`, `openssl`, `pdo_mysql`, `tokenizer`, `xml`)
- **Composer** (Gestionnaire de dépendances PHP)
- **MySQL 8.0+**

### 2. Services de Support
- **Redis** (Pour la gestion des queues et du cache)

### 3. Binaires OCR (Essentiels)
Le système dépend d'outils externes pour le traitement des documents. Installez-les via votre gestionnaire de paquets (ex: `apt` sur Linux ou `choco`/`winget` sur Windows) :
- **Tesseract OCR**
- **ocrmypdf**
- **Ghostscript**
- **poppler-utils** (pour `pdfinfo` et `pdftoppm`)

---

## 🚀 Étapes d'Installation

### 1. Initialisation du projet
Ouvrez un terminal dans le dossier `C:\Users\SARAKA\creation\ArchiveSafe` :

```bash
# Installation des dépendances PHP
composer install

# Installation de Laravel Sanctum pour l'authentification API
php artisan sanctum:install
```

### 2. Configuration de l'Environnement
Créez un fichier `.env` à la racine du projet en copiant le fichier `.env.example` (si existant) ou en ajoutant les variables suivantes :

```env
APP_NAME=ArchiveSafe
APP_ENV=local
APP_KEY=base64:... # Générez-la avec 'php artisan key:generate'
APP_DEBUG=true
APP_URL=http://localhost

# Base de données
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=archivesafe
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe

# Redis (Queue)
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1

# API Gemini (IA)
GEMINI_API_KEY=votre_cle_api_gemini

# Chemins Binaires OCR
OCR_BINARY_PATH=ocrmypdf
PDFINFO_BINARY_PATH=pdfinfo

# Stockage
FILESYSTEM_DISK=local
ARCHIVESAFE_DISK=local
```

Générez la clé de l'application :
```bash
php artisan key:generate
```

### 3. Base de Données et Migrations
Créez la base de données `archivesafe` dans MySQL, puis exécutez les migrations :

```bash
# Exécute toutes les migrations (users, documents, audit_logs)
php artisan migrate
```

### 4. Liens de Stockage
Créez le lien symbolique pour rendre les fichiers stockés accessibles via le web (si nécessaire) :

```bash
php artisan storage:link
```

---

## 🛠️ Lancement et Validation

### 1. Démarrage du serveur
```bash
php artisan serve
```

### 2. Lancement du Worker OCR (Crucial)
L'OCR et l'IA fonctionnent en arrière-plan. Vous **devez** lancer un worker pour que les documents soient traités après l'upload :

```bash
php artisan queue:work
```

### 3. Vérification des Routes
Pour vous assurer que tous les endpoints sont correctement enregistrés :

```bash
php artisan route:list
```

---

## 🧪 Test Rapide de Fonctionnement
1. **Inscription :** `POST /api/register` avec `name`, `email`, `password`, `password_confirmation`.
2. **Connexion :** `POST /api/login` $
ightarrow$ récupérez le `access_token`.
3. **Upload :** `POST /api/upload` (avec le token Bearer) $
ightarrow$ envoyez un fichier PDF.
4. **Vérification OCR :** Attendez quelques secondes, puis appelez `GET /api/upload/status/{id}`.
5. **Résumé IA :** `GET /api/ai/summarize/{id}`.


 Pour faire fonctionner ArchiveSafe, vous devez installer deux types de
  dépendances : les packages PHP (via Composer) et les outils système
  (binaires) pour l'OCR.

  Voici la liste complète et détaillée :

  1. Packages PHP (via Composer)
  Ces packages sont nécessaires pour la logique du framework,
  l'authentification API et l'exécution des commandes système.

  ┌─────────┬───────────────────┬──────────────────────────────┐
  │ Package │ Commande          │ Rôle dans ArchiveSafe        │
  │         │ d'installation    │                              │
  ├─────────┼───────────────────┼──────────────────────────────┤
  │ Laravel │ composer require  │ Gère l'authentification via  │
  │ Sanctum │ laravel/sanctum   │ tokens Bearer pour l'API.    │
  │ Symfony │ composer require  │ Permet à PHP de lancer et    │
  │ Process │ symfony/process   │ contrôler les binaires OCR   │
  │         │                   │ (ocrmypdf, pdfinfo).         │
  │ Guzzle  │ composer require  │ Utilisé par Laravel pour     │
  │ HTTP    │ guzzlehttp/guzzle │ envoyer les requêtes à l'API │
  │         │                   │ Gemini.                      │
  │ Predis  │ composer require  │ Client PHP pour communiquer  │
  │         │ predis/predis     │ avec Redis (indispensable    │
  │         │                   │ pour les Queues OCR).        │
  └─────────┴───────────────────┴──────────────────────────────┘
  Commande groupée :

   1 composer require laravel/sanctum symfony/process guzzlehttp/guzzle
     predis/predis

  ---

  2. Dépendances Système (Binaires Externes)
  Le code PHP ne fait pas l'OCR lui-même ; il pilote des outils
  spécialisés installés sur votre système d'exploitation. C'est la
  partie la plus critique.

  ┌─────────────┬──────────────┬────────────────────────────────┐
  │ Outil       │ Rôle         │ Pourquoi ?                     │
  ├─────────────┼──────────────┼────────────────────────────────┤
  │ Tesseract   │ Moteur d'OCR │ Reconnaissance optique des     │
  │ OCR         │              │ caractères (transforme l'image │
  │             │              │ en texte).                     │
  │ ocrmypdf    │ Wrapper OCR  │ L'outil principal qui gère le  │
  │             │              │ flux : PDF → OCR → PDF/A.      │
  │ Ghostscript │ Processeur   │ Nécessaire pour que ocrmypdf   │
  │             │ PDF          │ puisse manipuler et convertir  │
  │             │              │ les PDF.                       │
  │ Poppler     │ Utilitaires  │ Fournit pdfinfo (compter les   │
  │ Utils       │ PDF          │ pages) et pdftoppm (créer les  │
  │             │              │ vignettes).                    │
  │ Redis       │ Broker de    │ Stocke les jobs de traitement  │
  │ Server      │ messages     │ OCR en attente d'exécution.    │
  └─────────────┴──────────────┴────────────────────────────────┘





Liste complète des packages pour ArchiveSafe : 

- php artisan key:generate
-php artisan storage:link
-composer require laravel/sanctum
-composer require predis/predis
-composer require guzzlehttp/guzzle
-composer require guzzlehttp/guzzle
-composer require predis/predis
# Gestion des fichiers
-composer require league/flysystem
-composer require league/flysystem-aws-s3-v3
# OCR - Tesseract PHP
composer require thiagoalessio/tesseract_ocr

# PDF Processing
composer require spatie/pdf-to-image
composer require smalot/pdfparser

# Image processing
composer require intervention/image

# Pour la manipulation de fichiers
composer require symfony/process

# Logging et debugging
composer require laravel/tinker
composer require barryvdh/laravel-debugbar --dev

# Génération de codes et UUID
composer require ramsey/uuid

# Excel et export de données
composer require maatwebsite/excel

# Notifications par email
composer require laravel-notification-channels/telegram



















Étape 7 : Vérification finale
bash
# Vider les caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Générer l'optimisation
php artisan optimize

# Vérifier le statut des queues
php artisan queue:status
🏃 Étape 8 : Lancer l'application
Terminal 1 - Serveur Web
bash
php artisan serve
Terminal 2 - Worker pour les queues
bash
php artisan queue:work
🎯 Test rapide
Ouvrez votre navigateur et allez à :

http://127.0.0.1:8000

# Voir toutes les routes
php artisan route:list


# Exécuter les migrations (cela créera les tables users, cache, jobs, etc.)
php artisan migrate




bash
# Protection CSRF et CORS
composer require fruitcake/laravel-cors

# Validation avancée
composer require vladimir-yuldashev/laravel-queue-rabbitmq

-Packages pour l'API (Recommandés) "pas encore installé"
bash
# Documentation API
composer require knuckleswtf/scribe

# Rate limiting
composer require laravel/rate-limiter

# API Versioning
composer require phoenix/elasticsearch



Configuration après installation
1. Configurer Sanctum
bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
2. Configurer Intervention Image
bash
php artisan vendor:publish --provider="Intervention\Image\ImageServiceProviderLaravelRecent"
3. Configurer Debugbar (dev)
bash
php artisan vendor:publish --provider="Barryvdh\Debugbar\ServiceProvider"
4. Configurer Scribe (documentation API)
bash
php artisan vendor:publish --provider="Knuckles\Scribe\ScribeServiceProvider" --tag="config"
5. Configurer Excel
bash
php artisan vendor:publish --provider="Maatwebsite\Excel\ExcelServiceProvider" --tag=config
📋 Vérification des binaires système
Avant les tests, assurez-vous d'avoir ces binaires installés :

bash
# Vérifier Tesseract
tesseract --version

# Vérifier Ghostscript
gs --version

# Vérifier Poppler (pdfinfo, pdftoppm)
pdfinfo -v

# Vérifier ocrmypdf
ocrmypdf --version
🛠️ Si des binaires sont manquants dans Laragon
bash
# Installer Tesseract
choco install tesseract

# Installer Ghostscript
choco install ghostscript

# Installer Poppler
choco install poppler

# Installer Python pour ocrmypdf
choco install python
pip install ocrmypdf
