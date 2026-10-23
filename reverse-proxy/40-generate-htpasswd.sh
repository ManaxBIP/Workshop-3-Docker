#!/bin/sh

set -eu

printf '%s:%s\n' "$ADMIN_USER" "$(mkpasswd -m sha512 "$ADMIN_PASSWORD")" > /etc/nginx/.htpasswd
chgrp nginx /etc/nginx/.htpasswd
chmod 640 /etc/nginx/.htpasswd
