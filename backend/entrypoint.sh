#!/bin/sh
set -e

# Fix permissions on staticfiles volume if mounted with root/different UID
chown -R appuser:appgroup /app/staticfiles 2>/dev/null || true

# Run migrations and collectstatic as unprivileged appuser
gosu appuser python manage.py migrate --noinput
gosu appuser python manage.py collectstatic --noinput
gosu appuser python manage.py seed_demo

# Drop root privileges and execute process as appuser
exec gosu appuser "$@"
