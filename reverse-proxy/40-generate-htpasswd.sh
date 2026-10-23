#!/bin/sh
# Génère le fichier d'authentification de l'admin à partir des variables d'environnement.
# Exécuté automatiquement par l'image nginx au démarrage (dossier /docker-entrypoint.d/).
set -eu

printf '%s:%s\n' "$ADMIN_USER" "$(mkpasswd -m sha512 "$ADMIN_PASSWORD")" > /etc/nginx/.htpasswd
chgrp nginx /etc/nginx/.htpasswd
chmod 640 /etc/nginx/.htpasswd
