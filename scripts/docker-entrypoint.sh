#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL is required" >&2
  exit 1
fi

cd /cli
npx --yes prisma generate
npx --yes prisma migrate deploy

cd /app
exec node server.js
