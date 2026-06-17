#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL is required" >&2
  exit 1
fi

cd /cli
./node_modules/.bin/prisma migrate deploy

cd /app
exec node server.js
