# Archivage

Application de gestion documentaire et d’archivage numérique, composée d’un frontend moderne et d’une API Laravel pour la gestion des documents, la recherche, l’OCR, l’analyse IA et la traçabilité des actions.

## Aperçu

Ce projet permet de :

- téléverser et organiser des documents numériques ;
- consulter un tableau de bord d’administration ;
- extraire du contenu via OCR et IA ;
- rechercher et filtrer des documents rapidement ;
- suivre les accès et modifications via un journal d’audit ;
- gérer la conservation, le partage et les workflows documentaires.

## Stack technique

### Frontend
- React 19
- TypeScript
- Vite
- TanStack Router
- Tailwind CSS
- shadcn/ui

### Backend
- PHP 8.2+
- Laravel 11
- Sanctum
- MySQL / SQLite / base configurée selon l’environnement
- services d’OCR et IA intégrés

## Structure du projet

```text
archivage/
├── backend/                # API Laravel
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── public/
│   ├── resources/
│   ├── routes/
│   ├── tests/
│   ├── composer.json
│   ├── artisan
│   └── .env.example
├── src/                    # Frontend React / Vite
│   ├── components/
│   ├── routes/
│   ├── lib/
│   └── ...
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .gitignore
├── .prettierrc
├── components.json
├── bundig.toml
├── AGENTS.md
└── README.md
```

## Prérequis

Avant de lancer le projet, vérifie que tu as installé :

- Node.js 18+
- npm
- PHP 8.2+
- Composer
- une base de données compatible avec Laravel (MySQL, SQLite, etc.)

## Installation

### 1) Cloner le projet

```bash
git clone https://github.com/nkgr01/archivage.git
cd archivage
```

### 2) Installer les dépendances frontend

```bash
npm install
```

### 3) Installer les dépendances backend

```bash
cd backend
composer install
```

### 4) Configuration de l’environnement

Copie le fichier d’environnement Laravel et configure les variables :

```bash
cp .env.example .env
```

Puis mets à jour au minimum :

```env
APP_NAME=Archivage
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=archivage
DB_USERNAME=root
DB_PASSWORD=
```

Génère ensuite la clé d’application :

```bash
php artisan key:generate
```

### 5) Migration de la base

```bash
php artisan migrate
```

Si besoin, tu peux aussi lancer les seeders :

```bash
php artisan db:seed
```

## Lancer le projet

### Backend Laravel

Depuis le dossier backend :

```bash
php artisan serve --host 0.0.0.0 --port 8000
```

### Frontend Vite

Depuis la racine du projet :

```bash
npm run dev
```

Le frontend sera généralement disponible sur :

- http://localhost:5173

La API Laravel sera disponible sur :

- http://localhost:8000

## Scripts utiles

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Backend

```bash
php artisan serve
php artisan migrate
php artisan test
php artisan queue:work
```

## Fonctionnalités principales

- gestion des documents et fichiers ;
- tableaux de bord de supervision ;
- recherche documentaire avancée ;
- OCR et traitement IA ;
- gestion des rôles et autorisations ;
- logs d’audit et suivi des actions ;
- conservation et gestion des versions ;
- workflows de signature, partage et reporting.

## Développement

Pour contribuer au projet :

1. créer une branche ;
2. développer la fonctionnalité ;
3. vérifier le code et les tests ;
4. ouvrir une pull request.

Exemple :

```bash
git checkout -b feature/ma-fonctionnalite
```

## Licence

Ce projet est fourni sans garantie explicite. La licence précise peut être ajoutée selon les besoins du projet.

## Contact

Pour toute question sur le projet, contacte le responsable du dépôt ou utilise les issues GitHub du repository.
