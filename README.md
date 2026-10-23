# Workshop 3 - Microservices Adresses

Architecture microservices avec Docker Compose : une base MySQL (table `adresse`), une API Node.js avec des routes distinctes pour l'admin et les utilisateurs, deux fronts, et un reverse-proxy NGINX comme unique point d'entrée (port 80).

## Démarrage

```bash
docker compose up -d --build
```

| URL | Service |
|---|---|
| http://localhost/ | Front utilisateurs (consultation) |
| http://localhost/admin/ | Front administrateur (création) |
| http://localhost/api/health | État de l'API |

Pour réinitialiser la base (et rejouer les migrations) : `docker compose down -v && docker compose up -d --build`

---

## 📜 Contrat (à ne pas modifier sans prévenir l'autre)

### Table `adresse`

| Colonne | Type | Remarque |
|---|---|---|
| `id` | INT AUTO_INCREMENT | clé primaire |
| `numero_rue` | VARCHAR(10) | obligatoire (ex. "12", "12 bis") |
| `nom_rue` | VARCHAR(255) | obligatoire |
| `ville` | VARCHAR(100) | obligatoire |
| `code_postal` | VARCHAR(10) | obligatoire (texte : garde le 0 de "01000") |
| `created_at` | TIMESTAMP | automatique |

### Routes de l'API

| Front | Méthode | Route | Réponse |
|---|---|---|---|
| Admin | `POST` | `/api/admin/adresses` | `201` + adresse créée, `400` si champ manquant |
| Admin | `GET` | `/api/admin/adresses` | `200` + liste |
| Users | `GET` | `/api/users/adresses` | `200` + liste |
| Users | `GET` | `/api/users/adresses/:id` | `200` + adresse, `404` si introuvable |

Format JSON d'une adresse :
```json
{ "id": 1, "numero_rue": "12", "nom_rue": "rue de la Paix", "ville": "Paris", "code_postal": "75002" }
```
Erreurs : `{ "error": "message" }`

### Routage du reverse-proxy

| URL publique | Service interne |
|---|---|
| `/` | `front_users:80` |
| `/admin/` | `front_admin:80` (préfixe `/admin` retiré) |
| `/api/` | `api:3000` (préfixe `/api` conservé) |

⚠️ **Dans les fronts, utiliser des chemins relatifs** pour les fichiers (`src="app.js"`, pas `src="/app.js"`), sinon le front admin chargerait les fichiers du front users. Les appels API, eux, utilisent le chemin absolu `/api/...`.

---

## 👥 Répartition

### Personne A : backend
- [ ] `migrations/002_insert_adresses.sql` : adresses de démo
- [ ] `api/src/routes/admin.js` : `GET` et `POST` (validation 400, try/catch 500)
- [ ] `api/src/routes/users.js` : `GET` liste et `GET /:id` (404)
- [ ] Tests avec `curl` (voir ci-dessous)

### Personne B : fronts + infra
- [ ] `front_users/` : affichage des adresses (avec le mock, puis branchement sur `/api/users/adresses`)
- [ ] `front_admin/` : formulaire de création + liste + gestion des erreurs
- [ ] Style des deux fronts
- [ ] `docker-compose.yml` et `reverse-proxy/nginx.conf` (déjà fonctionnels, à ajuster si besoin)

### Ensemble : intégration
- [ ] `front_users/app.js` : remplacer `mock/adresses.json` par `/api/users/adresses`
- [ ] `docker compose down -v && docker compose up -d --build` : tout repart de zéro
- [ ] Parcours complet : créer sur `/admin/`, puis voir sur `/`
- [ ] Vérifier que seul le port 80 répond
- [ ] Zip du rendu (voir ci-dessous)

## Tests rapides de l'API

```bash
curl localhost/api/health
curl localhost/api/users/adresses
curl localhost/api/users/adresses/1
curl -X POST localhost/api/admin/adresses -H "Content-Type: application/json" \
  -d '{"numero_rue":"8","nom_rue":"rue Victor Hugo","ville":"Nantes","code_postal":"44000"}'
```

## Architecture

```
                    :80
Navigateur ──► reverse-proxy (NGINX)
                 ├── /        ──► front_users (NGINX)
                 ├── /admin/  ──► front_admin (NGINX)
                 └── /api/    ──► api (Node.js / Express)
                                     └──► db (MySQL)  ◄── migrations/*.sql
```

- **Réseau `frontend`** : reverse-proxy, fronts, API.
- **Réseau `backend`** : API et MySQL. La base n'est accessible que par l'API.

## Bonnes pratiques

- Versions d'images épinglées (`.env.example`), jamais `latest`.
- Migrations SQL versionnées (`001_`, `002_`…), exécutées automatiquement au premier démarrage.
- Healthcheck MySQL : l'API attend que la base soit prête.
- Un seul port exposé (80).

## Rendu

```bash
zip -r Workshop3-NOM1-PRENOM1-NOM2-PRENOM2.zip . -x "*/node_modules/*" ".git/*" ".env" "*.zip"
```

> ⚠️ Si une dépendance est ajoutée à l'API, régénérer le lock file avec le npm de l'image (le npm du Mac produit un lock incompatible avec `npm ci` dans `node:22-alpine`) :
> ```bash
> docker run --rm -v "$PWD/api":/app -w /app node:22-alpine npm install
> ```
