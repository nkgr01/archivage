# Archivage

Plateforme de gestion documentaire et d’archivage numérique pensée pour centraliser les documents, automatiser les traitements OCR/IA, suivre les actions réalisées et faciliter la recherche et la gouvernance documentaire.

## Vue d’ensemble

Archivage permet à une organisation de :

- téléverser et classer des documents ;
- consulter un tableau de bord de supervision ;
- rechercher rapidement dans la base documentaire ;
- traiter les fichiers via OCR et analyse IA ;
- suivre les historiques d’accès et d’actions ;
- gérer les permissions, le partage et les flux de validation.

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
- MySQL / SQLite / base configurable
- services OCR et IA intégrés

## Aperçu du projet

```text
archivage/
├── backend/                 # API Laravel
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
├── src/                     # Frontend React + Vite
│   ├── components/
│   ├── routes/
│   ├── lib/
│   └── ...
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .gitignore
├── AGENTS.md
├── README.md
└── ...
```

## Démarrage rapide pour les collaborateurs

### 1) Récupérer le projet

```bash
git clone https://github.com/nkgr01/archivage.git
cd archivage
```

### 2) Installer les dépendances du frontend

```bash
npm install
```

### 3) Installer les dépendances du backend

```bash
cd backend
composer install
```

### 4) Configurer l’environnement Laravel

```bash
cp .env.example .env
php artisan key:generate
```

Puis modifier le fichier `backend/.env` selon ton environnement local :

```env
APP_NAME=Archivage
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=archivage
DB_USERNAME=root
DB_PASSWORD=
```

### 5) Initialiser la base

```bash
php artisan migrate
php artisan db:seed
```

### 6) Lancer les services

Terminal 1 – backend :

```bash
cd backend
php artisan serve --host 0.0.0.0 --port 8000
```

Terminal 2 – frontend :

```bash
cd ..
npm run dev
```

Ouvrir ensuite :

- Frontend : http://localhost:5173
- API : http://localhost:8000

## Workflow de contribution

```bash
git checkout -b feature/ma-fonctionnalite
# développer
npm run lint
# ou côté backend
cd backend
php artisan test
git add .
git commit -m "feat: ajout de la fonctionnalité"
git push origin feature/ma-fonctionnalite
```

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
cd backend
php artisan serve
php artisan migrate
php artisan test
php artisan queue:work
```

## Fonctionnalités principales

- gestion et suivi des documents ;
- recherche avancée ;
- OCR et traitement IA ;
- historique d’audit complet ;
- gestion des rôles et autorisations ;
- workflow de validation, partage et conservation ;
- tableau de bord de supervision.

## Démonstration

Voici la structure d’une démonstration de produit que tu peux compléter avec les captures de ton interface :

### 1) Tableau de bord
- vue d’ensemble des performances,
- statistiques de documents,
- indicateurs de traitement et d’activité.

### 2) Gestion documentaire
- liste des documents,
- filtres et recherche,
- actions de consultation, validation et partage.

### 3) OCR et IA
- extraction de texte depuis des fichiers,
- indexation du contenu,
- synthèse et analyse documentaire.

### 4) Audit et traçabilité
- historique des actions,
- identités des agents ou utilisateurs,
- journal des changements et validations.

> Ajoute ici tes captures d’écran réelles pour rendre le README plus premium et plus représentatif du projet.

## Roadmap possible

- amélioration de la recherche et filtres avancés ;
- ajout de règles de retention et archivage ;
- intégration d’outils IA plus poussés ;
- gestion multi-utilisateur et rôles avancés ;
- reporting et export des données.

## Licence

Le projet est actuellement livré sans licence explicite. Si nécessaire, tu peux ajouter une licence plus tard selon les contraintes du projet et de l’équipe.

## Contact

Pour toute question ou contribution, utiliser les issues GitHub du dépôt ou contacter la personne responsable du projet.
