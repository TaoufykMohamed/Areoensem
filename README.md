# Club AéroENSEM — site web

Site du Club AéroENSEM (club aéronautique de l'ENSEM, Casablanca) : backend
Express/MongoDB et frontend React/Vite, dans un monorepo à deux dossiers
séparés. Le frontend ne parle au backend que via l'API REST — aucune
logique métier, requête base de données ou secret côté client.

En production, le backend sert aussi le build du frontend (fichiers
statiques + fallback SPA) : un seul service, une seule URL, pas de CORS.
En développement, deux serveurs séparés (Vite + Express) reliés par un
proxy — voir [Déploiement](#déploiement).

## Structure

```
package.json         Scripts racine (install/build/start) pour Render
backend/            API REST (Express, Mongoose, JWT en cookie httpOnly)
  src/config/        env, MongoDB, Cloudinary
  src/models/        13 schémas Mongoose
  src/controllers/   logique métier par ressource
  src/routes/        endpoints par ressource
  src/middleware/    auth, rôles, validation, rate limiting, erreurs
  src/validators/    schémas Zod par ressource
  src/seed/          données de démo
  scripts/           script de vérification du modèle de permissions
frontend/            Application React (Vite, Tailwind, React Router)
  src/api/            clients Axios par ressource (URL relative /api/v1)
  src/pages/          une page par route publique
  src/pages/dashboard/ écrans admin et chef de cellule
  src/context/        AuthContext, ThemeContext
  src/locales/        fr.json, en.json
design-reference/    Logo et vidéo hero issus de la maquette d'origine
```

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
npm run seed          # peuple la base (admin, cellules, événements, ...)
npm run dev            # http://localhost:5000

# Frontend (autre terminal)
cd frontend
npm install
npm run dev             # http://localhost:5173 — proxifie /api vers :5000
```

Le frontend n'a besoin d'aucune variable d'environnement : il appelle
toujours `/api/v1` en relatif (proxifié par Vite en dev, même origine en
prod).

## Variables d'environnement

Voir `backend/.env.example`. À renseigner pour un fonctionnement complet :

- `MONGO_URI`, `JWT_SECRET` — obligatoires
- `CLOUDINARY_*` — sans eux, l'upload d'images échoue (le reste du site
  fonctionne ; voir limites connues ci-dessous)
- `EMAIL_*` — non utilisés pour l'instant (voir limites connues)

## Comptes de démonstration

Créés par `npm run seed`, tous avec le même mot de passe (défini par
`SEED_ADMIN_PASSWORD` dans `backend/.env`, voir `backend/.env.example` —
à changer avant toute mise en production réelle ; le script refuse de
s'exécuter si `NODE_ENV=production`) :

| Rôle | Email |
|---|---|
| Admin | `admin@aeroensem.ma` |
| Chef de cellule | `chef.<slug-cellule>@aeroensem.ma` (ex. `chef.conception-cao@aeroensem.ma`) |

Le mot de passe et la liste complète des 7 comptes chefs s'affichent à la
fin de l'exécution de `npm run seed`.

## Commandes utiles

```bash
# racine (ce que Render exécute)
npm install && npm run build   # installe backend+frontend, build le frontend
npm start                       # démarre le backend, qui sert aussi le build

# backend/
npm run seed                # réinitialise et repeuple la base
npm run verify:permissions  # vérifie requireRole/requireCellOwnership contre le seed
npm run dev                 # serveur avec rechargement (nodemon)
npm start                   # serveur de production

# frontend/
npm run dev      # serveur de développement (proxy /api -> :5000)
npm run build    # build de production dans dist/
npm run preview  # sert le build de production en local
```

## API

Préfixe `/api/v1`. Toutes les réponses suivent `{ success, data, message }`.
Routes publiques en lecture, routes protégées en écriture (JWT en cookie
httpOnly). Voir `backend/src/routes/` pour le détail — une ressource par
fichier, même structure partout : `requireAuth` → `requireRole`/
`requireCellOwnership` → `validate(schema)` → contrôleur.

## Déploiement

Service unique sur **Render** : le backend Express sert son API sous
`/api/v1` et le build statique du frontend sur tout le reste (voir le
bloc `if (isProd)` dans `backend/src/app.js`). Pas de Vercel, pas de CORS
en production, un seul domaine.

1. Fournir une base MongoDB managée — Render n'héberge pas Mongo, utiliser
   [MongoDB Atlas](https://www.mongodb.com/atlas) (offre gratuite
   suffisante).
2. Créer un Web Service Render à partir du repo, root directory = racine
   du monorepo (pas `backend/`).
   - **Build command** : `npm install && npm run build`
   - **Start command** : `npm start`
3. Renseigner les variables d'environnement du backend dans le dashboard
   Render : `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET` (généré),
   `CLOUDINARY_*`, `EMAIL_*`, `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`.
   `CLIENT_URL` n'est plus utilisé en production (même origine), inutile
   de le renseigner sur Render.
4. Render fournit `PORT` automatiquement — `backend/src/server.js` l'utilise
   déjà (`env.PORT`, défaut 5000 en local).
5. Après le premier déploiement, lancer `npm run seed --prefix backend`
   une fois via le shell Render pour peupler la base.

## Limites connues

Construit rapidement sur les étapes 4 à 8 après une base (modèles, auth,
permissions) posée et vérifiée avec soin aux étapes 1 à 3. Quelques
simplifications assumées, à traiter avant une mise en production réelle :

- **Upload d'images** : aucun widget d'upload Cloudinary côté frontend —
  les champs image (logos, photos, galerie) attendent une URL saisie à la
  main dans le dashboard. Le backend est prêt côté Cloudinary (config +
  Multer en dépendance), il manque l'intégration `multer.memoryStorage()`
  + `cloudinary.uploader.upload_stream` dans un `middleware/upload.js`,
  et le widget React côté formulaires.
- **Email** : `services/email.js` n'a pas été écrit — aucune confirmation
  automatique par email (inscription, candidature, commande). Nodemailer
  est en dépendance, prêt à être branché.
- **Mode clair** sur le dashboard : le dashboard est stylé en sombre fixe
  (cohérent avec son propre usage interne), le toggle clair/sombre n'agit
  que sur les pages publiques.
- **Inscriptions** : pas d'écran dédié pour changer le statut d'une
  inscription à un événement (l'API le permettrait facilement à ajouter,
  le contrôleur `updateApplicationStatut` sert de modèle) — actuellement
  consultation seule côté dashboard.
- Pas de suite de tests automatisés (Jest/Vitest) — seule
  `backend/scripts/verify-permissions.mjs` existe, ciblée sur le modèle
  de permissions.

## Avancement

- [x] Étape 1 — arborescence, package.json, configuration
- [x] Étape 2 — modèles Mongoose, connexion base, seed
- [x] Étape 3 — authentification et middlewares de permissions
- [x] Étape 4 — contrôleurs et routes API
- [x] Étape 5 — socle frontend (layout, routing, thème, i18n, auth)
- [x] Étape 6 — pages publiques
- [x] Étape 7 — dashboard admin / chef de cellule
- [x] Étape 8 — finitions, README, déploiement (service unique Render)
