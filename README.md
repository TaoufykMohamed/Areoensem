# Club AéroENSEM — site web

Monorepo du site du Club AéroENSEM (ENSEM Casablanca) : backend Express/MongoDB
et frontend React/Vite, dans deux dossiers séparés.

> Ce README correspond à l'étape 1 (arborescence + configuration). Il sera
> complété au fil des étapes suivantes (comptes de démo, déploiement, etc. à
> l'étape 8).

## Structure

```
backend/    API REST (Express, Mongoose, JWT en cookie httpOnly)
frontend/   Application React (Vite, Tailwind, React Router)
design-reference/   Logo et vidéo hero issus de la maquette, à réutiliser
                     comme assets lors de la construction des pages (étape 6)
```

Le frontend ne parle au backend que via l'API REST — aucune logique métier,
requête base de données ou secret côté client.

## Prérequis

- Node.js 18+
- Docker (pour MongoDB en local)

## Installation

```bash
# Base de données
docker compose up -d

# Backend
cd backend
cp .env.example .env
npm install
npm run dev        # http://localhost:5000

# Frontend (autre terminal)
cd frontend
cp .env.example .env
npm install
npm run dev         # http://localhost:5173
```

Le frontend affiche un statut de connexion à l'API (`GET /api/v1/health`) —
c'est la vérification de bout en bout pour cette étape.

## Variables d'environnement

Voir `backend/.env.example` et `frontend/.env.example`.

## Avancement

- [x] Étape 1 — arborescence, package.json, configuration
- [ ] Étape 2 — modèles Mongoose, connexion base, seed
- [ ] Étape 3 — authentification et middlewares de permissions
- [ ] Étape 4 — contrôleurs et routes API
- [ ] Étape 5 — socle frontend (layout, routing, thème, i18n, auth)
- [ ] Étape 6 — pages publiques
- [ ] Étape 7 — dashboard admin / chef de cellule
- [ ] Étape 8 — finitions, README complet, déploiement
