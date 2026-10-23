# Workshop 3 - Microservices Adresses

Architecture microservices avec Docker Compose : une base MySQL, une API Node.js avec des routes distinctes pour l'admin et les utilisateurs, deux fronts, et un reverse-proxy NGINX comme unique point d'entrée (port 80).

## Démarrage

```bash
docker compose up -d --build
```

| URL | Service |
|---|---|
| http://localhost/ | Front utilisateurs (consultation) |
| http://localhost/admin/ | Front administrateur (création), protégé par identifiant : `admin` / `admin` par défaut |
| http://localhost/api/health | État de l'API |

Aucun fichier `.env` n'est nécessaire : des valeurs par défaut sont prévues. Pour changer l'identifiant admin, copier `.env.example` en `.env` et modifier `ADMIN_USER` / `ADMIN_PASSWORD`.

Pour réinitialiser la base (et rejouer les migrations) : `docker compose down -v && docker compose up -d --build`

---

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
| `/admin/` | `front_admin:80` (préfixe `/admin` retiré), 🔒 authentification |
| `/api/admin/` | `api:3000`, 🔒 authentification |
| `/api/` | `api:3000` (préfixe `/api` conservé) |


---

## Tests rapides de l'API

```bash
curl localhost/api/health
curl localhost/api/users/adresses
curl localhost/api/users/adresses/1
curl -u admin:admin localhost/api/admin/adresses
curl -u admin:admin -X POST localhost/api/admin/adresses -H "Content-Type: application/json" \
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
- Partie admin (`/admin/` et `/api/admin/`) protégée par authentification HTTP Basic dans le reverse-proxy. Le fichier de mots de passe est généré au démarrage depuis `ADMIN_USER` / `ADMIN_PASSWORD` (`reverse-proxy/40-generate-htpasswd.sh`).